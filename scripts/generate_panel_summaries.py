#!/usr/bin/env python3
"""Generate concise, grounded phase-panel summaries for a precomputed tree."""
from __future__ import annotations

import argparse
import concurrent.futures
import copy
import json
import os
import re
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


PROMPT_VERSION = "toc-panel-summary-v1"
SYSTEM_PROMPT = """You create concise default-panel summaries for a Theory of Change policy simulation interface.
Compress the supplied full rationale without changing its causal meaning.

Requirements for panel_summary:
- Write exactly 3 complete English sentences totaling 55-90 words.
- Aim for 65-80 words so the summary remains concise while preserving the causal mechanism.
- Sentence 1 states the causal transition from the current phase to downstream effects.
- Sentence 2 identifies the strongest two or three limiting conditions and explains how they condition or weaken that transition.
- Sentence 3 states the resulting scope, persistence, or distribution of downstream effects.
- Preserve material uncertainty and distributional inequality when they are central to the source mechanism, using the fewest words possible.
- Omit all numeric values, ranges, monetary amounts, and detailed examples; they are displayed separately in the interface.
- Do not add facts, causal claims, evaluations, recommendations, or policy preferences.
- Do not use headings, bullets, fragments, or meta-commentary inside panel_summary.

Requirements for key_constraints:
- Return 2-3 short, non-overlapping noun phrases.
- Every constraint must be explicitly supported by the source.
- Do not include predicted outcomes as constraints.

Return one valid JSON object with exactly these keys:
{"panel_summary":"string","key_constraints":["string"]}"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--tree", type=Path, required=True)
    parser.add_argument("--mirror", type=Path, action="append", default=[])
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--checkpoint", type=Path)
    return parser.parse_args()


def sentence_count(text: str) -> int:
    return len(re.findall(r"[^.!?]+[.!?](?:\s|$)", text.strip()))


def validate(payload: dict) -> list[str]:
    errors: list[str] = []
    if set(payload) != {"panel_summary", "key_constraints"}:
        errors.append("JSON keys must be exactly panel_summary and key_constraints")
    summary = str(payload.get("panel_summary") or "").strip()
    constraints = payload.get("key_constraints")
    words = len(summary.split())
    if not 55 <= words <= 90:
        errors.append(f"panel_summary must contain 55-90 words; found {words}")
    if sentence_count(summary) != 3:
        errors.append(f"panel_summary must contain exactly 3 complete sentences; found {sentence_count(summary)}")
    if re.search(r"\d", summary):
        errors.append("panel_summary must not contain numeric values")
    if not isinstance(constraints, list) or not 2 <= len(constraints) <= 3:
        errors.append("key_constraints must contain 2-3 items")
    elif any(not isinstance(item, str) or not item.strip() for item in constraints):
        errors.append("every key constraint must be a non-empty string")
    return errors


def request_summary(source: str, phase: str, node_id: str) -> dict:
    api_key = os.environ["DEEPSEEK_API_KEY"]
    url = os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions")
    model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
    body = {
        "model": model,
        "temperature": 0.1,
        "max_tokens": 500,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Phase: {phase}\nNode ID: {node_id}\n\n"
                    f"Summarize this full rationale:\n\n{source}"
                ),
            },
        ],
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(request, timeout=90) as response:
        result = json.load(response)
    parsed = json.loads(result["choices"][0]["message"]["content"])
    constraints = parsed.get("key_constraints")
    if not isinstance(constraints, list):
        constraints = []
    normalized = {
        "panel_summary": str(parsed.get("panel_summary") or "").strip(),
        "key_constraints": [str(item).strip() for item in constraints if str(item).strip()][:3],
    }
    return {
        "panel_summary": normalized["panel_summary"],
        "panel_key_constraints": normalized["key_constraints"],
        "_validation_warnings": validate(normalized),
    }


def atomic_write(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=path.parent, delete=False) as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary = Path(handle.name)
    temporary.replace(path)


def main() -> None:
    args = parse_args()
    tree = json.loads(args.tree.read_text(encoding="utf-8"))
    checkpoint = args.checkpoint or args.tree.with_suffix(".panel-summary-checkpoint.json")
    working = copy.deepcopy(tree)
    if checkpoint.exists():
        candidate = json.loads(checkpoint.read_text(encoding="utf-8"))
        if candidate.get("scenario_id") == tree.get("scenario_id"):
            working = candidate

    pending: list[tuple[str, str, str]] = []
    for node_id, node in working.get("nodes", {}).items():
        result = node.get("phase_result") or {}
        phase = str(result.get("phase") or "")
        if not phase or phase == "Inputs" or result.get("panel_summary"):
            continue
        source = " ".join(str(result.get("phase_summary") or "").split())
        if not source:
            raise RuntimeError(f"{node_id}: missing phase_summary")
        pending.append((node_id, phase, source))

    total = len(pending)
    print(f"Generating {total} summaries with {args.workers} workers")
    completed = 0
    warning_nodes: dict[str, list[str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(request_summary, source, phase, node_id): node_id
            for node_id, phase, source in pending
        }
        for future in concurrent.futures.as_completed(futures):
            node_id = futures[future]
            result = future.result()
            warnings = result.pop("_validation_warnings", [])
            if warnings:
                warning_nodes[node_id] = warnings
            working["nodes"][node_id]["phase_result"].update(result)
            completed += 1
            if completed % 10 == 0 or completed == total:
                atomic_write(checkpoint, working)
                print(f"Completed {completed}/{total}")

    expected = sum(
        1
        for node in working.get("nodes", {}).values()
        if (node.get("phase_result") or {}).get("phase") not in {None, "", "Inputs"}
    )
    generated = sum(
        1
        for node in working.get("nodes", {}).values()
        if (node.get("phase_result") or {}).get("panel_summary")
    )
    if generated != expected:
        raise RuntimeError(f"Expected {expected} summaries, found {generated}")

    working["panel_summary_generation"] = {
        "prompt_version": PROMPT_VERSION,
        "model": os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "node_count": generated,
        "validation_warning_count": len(warning_nodes),
    }
    atomic_write(args.tree, working)
    for mirror in args.mirror:
        atomic_write(mirror, working)
    checkpoint.unlink(missing_ok=True)
    print(f"Updated {args.tree} and {len(args.mirror)} mirror file(s)")
    print(f"QA warnings (no regeneration): {len(warning_nodes)}")
    for node_id, warnings in list(warning_nodes.items())[:5]:
        print(f"- {node_id}: {'; '.join(warnings)}")


if __name__ == "__main__":
    main()
