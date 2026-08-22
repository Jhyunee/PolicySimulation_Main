"""Read the precomputed policy-pathway artifacts bundled with the study."""
from __future__ import annotations

import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
DATA = REPO_ROOT / "data"

POLICY_TREES = {
    "usa/chi_nsa": {
        "label": "No Surprises Act", "short_label": "NSA",
        "title": "No Surprises Act Pathway Explorer",
        "description": "Explore how implementation capacity, provider and insurer behavior, and dispute resolution shape protections from unexpected out-of-network bills.",
        "goal": "The No Surprises Act aims to protect patients from unexpected out-of-network bills and limit patient cost sharing in covered emergency and non-emergency situations.",
        "overview": "The Act restricts balance billing and limits patient cost sharing for many emergency services and certain non-emergency services delivered by out-of-network providers at in-network facilities. Its effects depend on provider and insurer compliance, consumer awareness, administrative enforcement, payment negotiation, and the independent dispute-resolution process. The pathway simulation examines how these conditions may shape out-of-network billing, dispute volume, patient financial exposure, and longer-term market behavior.",
        "tree_path": DATA / "trees" / "nsa.json", "scenario_dir": DATA / "scenarios" / "nsa",
        "roles": [{"key":"patient","label":"Patient"},{"key":"provider","label":"Provider"},{"key":"payer","label":"Insurer"},{"key":"regulator","label":"Federal regulator"},{"key":"mediator","label":"Dispute mediator"}],
    },
    "usa/chi_ira": {
        "label": "Inflation Reduction Act Insulin Provisions", "short_label": "IRA",
        "title": "Insulin Cost-Sharing Pathway Explorer",
        "description": "Explore how plan implementation, pharmacy delivery, and beneficiary access shape insulin affordability under the Inflation Reduction Act.",
        "goal": "The Inflation Reduction Act's insulin provisions aim to reduce out-of-pocket insulin costs for Medicare beneficiaries and make monthly costs more predictable.",
        "overview": "The policy limits cost sharing for covered insulin products in Medicare Part D and for insulin delivered through covered pumps in Medicare Part B. Its effects depend on plan implementation, pharmacy workflows, formulary and eligibility rules, beneficiary awareness, and consistent access to covered insulin. The pathway simulation examines how these conditions may shape out-of-pocket spending, cost variation, treatment access, adherence, and longer-term health and financial effects.",
        "tree_path": DATA / "trees" / "ira.json", "scenario_dir": DATA / "scenarios" / "ira",
        "roles": [{"key":"federal_policy_oversight","label":"Federal policy oversight"},{"key":"part_d_plan_implementer","label":"Part D plan implementer"},{"key":"frontline_pharmacy_provider","label":"Pharmacy provider"},{"key":"high_cost_insulin_beneficiary","label":"Insulin beneficiary"},{"key":"lis_insulin_beneficiary","label":"Low-income subsidy beneficiary"}],
    },
    "usa/chi_ctc": {
        "label": "Expanded Child Tax Credit", "short_label": "CTC",
        "title": "Child Tax Credit Pathway Explorer",
        "description": "Explore how administrative capacity, payment delivery, and access barriers shape child poverty and longer-term well-being.",
        "goal": "The expanded Child Tax Credit aims to reduce child poverty and material hardship by increasing household income support and making the credit more accessible to families with low or no taxable earnings.",
        "overview": "The policy expansion increased benefit amounts, broadened refundability, and delivered part of the credit through advance payments. Its effects depend on administrative capacity, accurate and timely payment delivery, outreach to non-filers, and families' ability to register and maintain current information. The pathway simulation follows how these conditions may affect benefit reach, household hardship, and longer-term child well-being.",
        "tree_path": DATA / "trees" / "ctc.json", "scenario_dir": DATA / "scenarios" / "ctc",
        "roles": [{"key":"irs_administrator","label":"IRS administrator"},{"key":"payment_operator","label":"Payment operator"},{"key":"recipient_parent","label":"Recipient parent"},{"key":"nonfiler_parent","label":"Non-filer parent"},{"key":"outreach_navigator","label":"Outreach navigator"}],
    },
    "usa/chi_ccdf": {
        "label": "Child Care and Development Fund", "short_label": "CCDF",
        "title": "CCDF Pathway Explorer",
        "description": "Explore how subsidy administration, provider participation, and family access shape child-care outcomes.",
        "goal": "CCDF aims to improve access to affordable child care for eligible low-income families.",
        "overview": "The policy provides stabilization funding to state, territorial, and tribal lead agencies, which distribute subgrants to eligible child-care providers. Its effects depend on administrative capacity, timely fund distribution, provider eligibility and participation, allowable uses of funds, and families' access to affordable care. The pathway simulation examines how these conditions may shape provider stability, child-care costs, workforce participation, and longer-term access.",
        "tree_path": DATA / "trees" / "ccdf.json", "scenario_dir": DATA / "scenarios" / "ccdf",
        "roles": [],
    },
    "usa/chi_clean_vehicle": {
        "label": "Clean Vehicle Credit", "short_label": "CVC",
        "title": "Clean Vehicle Credit Pathway Explorer",
        "description": "Explore how dealer readiness, vehicle eligibility, and supply-chain compliance shape Section 30D credit uptake and longer-term market effects.",
        "goal": "The Clean Vehicle Credit aims to accelerate clean-vehicle adoption while encouraging domestic vehicle production and more secure battery and critical-mineral supply chains.",
        "overview": "Eligibility depends on requirements involving buyer income, vehicle price, final assembly, battery components, and critical minerals. Dealers and manufacturers must also support eligibility verification and, where applicable, point-of-sale credit transfers. The pathway simulation examines how implementation readiness, vehicle availability, affordability, and supply-chain compliance may shape credit uptake, market adoption, and emissions-related effects.",
        "tree_path": DATA / "trees" / "clean_vehicle.json", "scenario_dir": DATA / "scenarios" / "clean_vehicle",
        "roles": [{"key":"buyer","label":"Clean vehicle buyer"},{"key":"dealer","label":"Registered dealer"},{"key":"supplier","label":"Battery supplier"},{"key":"manufacturer","label":"Vehicle manufacturer"},{"key":"regulator","label":"Federal regulator"}],
    },
    "ger/chi_vg": {
        "label": "German Packaging Act", "short_label": "VerpackG",
        "title": "German Packaging Act Pathway Explorer",
        "description": "Explore how producer obligations and recycling-system capacity shape packaging and waste outcomes.",
        "goal": "The Packaging Act aims to reduce packaging waste and strengthen producer responsibility and recycling.",
        "overview": "The Act assigns registration, system-participation, reporting, and recycling obligations to producers and distributors of packaged goods. Its effects depend on producer compliance, accurate packaging data, collection-system performance, sorting and recycling capacity, and regulatory enforcement. The pathway simulation examines how variation in these conditions may shape material-specific recycling rates, packaging recovery, market incentives, and longer-term circular-economy outcomes.",
        "tree_path": DATA / "trees" / "verpackg.json", "scenario_dir": DATA / "scenarios" / "verpackg",
        "roles": [],
    },
}


def _tree_metadata(path: Path) -> tuple[int, int]:
    if not path.exists():
        return 0, 0
    raw = json.loads(path.read_text(encoding="utf-8"))
    nodes = raw.get("nodes") or {}
    parents = {node.get("parent_id") for node in nodes.values() if node.get("parent_id")}
    return sum(node_id not in parents for node_id in nodes), len({node.get("phase_index") for node in nodes.values() if node.get("phase_result") is not None})


def list_policies() -> list[dict]:
    policies = []
    for key, item in POLICY_TREES.items():
        pathways, phases = _tree_metadata(item["tree_path"])
        policies.append({key: value for key, value in item.items() if key not in {"tree_path", "scenario_dir"}} | {"key": key, "available": item["tree_path"].exists(), "pathway_count": pathways, "phase_count": phases})
    return policies


def _config(policy_key: str) -> dict:
    if policy_key not in POLICY_TREES:
        raise KeyError(policy_key)
    return POLICY_TREES[policy_key]


def _raw_tree(policy_key: str) -> dict:
    path = _config(policy_key)["tree_path"]
    if not path.exists():
        raise FileNotFoundError(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _grounded_input_state(policy_key: str) -> dict:
    path = _config(policy_key)["scenario_dir"] / "grounded_input_state.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _phase_payload(result: dict | None, grounded_input_state: dict | None = None) -> dict | None:
    if not result:
        return None
    posts = result.get("revised_posts") or result.get("initial_posts") or []
    document_grounded = result.get("state_type") == "document_grounded"
    return {
        "phase": result.get("phase"), "direction": result.get("direction"),
        "posting_order": result.get("posting_order") or [],
        "phase_summary": "Policy inputs shown below were verified against the source policy document." if document_grounded else result.get("phase_summary"),
        "panel_summary": result.get("panel_summary"),
        "panel_key_constraints": result.get("panel_key_constraints") or [],
        "state_type": result.get("state_type"),
        "grounded_values": result.get("grounded_values") if document_grounded else {},
        "grounded_evidence": result.get("grounded_evidence") if document_grounded else [],
        "grounded_policy_parameters": (grounded_input_state or {}).get("policy_parameters", []) if document_grounded else [],
        "posts": posts,
    }


def get_tree(policy_key: str) -> dict:
    config, raw = _config(policy_key), _raw_tree(policy_key)
    grounded_input_state = _grounded_input_state(policy_key)
    nodes = [{"node_id": node["node_id"], "parent_id": node.get("parent_id"), "transition_mode": node.get("transition_mode"), "phase_index": node["phase_index"], "parent_context_hash": node.get("parent_context_hash"), "phase": _phase_payload(node.get("phase_result"), grounded_input_state)} for node in raw["nodes"].values()]
    available = [phase for phase in raw.get("phases", []) if any(node.get("phase", {}).get("phase") == phase for node in nodes if node.get("phase"))]
    return {"policy": {"key":policy_key,"label":config["label"],"short_label":config["short_label"],"title":config["title"],"description":config["description"],"roles":config["roles"]}, "format_version":raw.get("format_version"), "generation_mode":raw.get("generation_mode"), "scenario_id":raw.get("scenario_id"), "simulation_target":raw.get("simulation_target"), "branch_inputs":raw.get("branch_inputs",False), "mechanism_planner_enabled":bool(raw.get("mechanism_planner_enabled",False)), "transitions":raw.get("transitions",[]), "phases":raw.get("phases",[]), "available_phases":available, "complete":len(available) >= len(raw.get("phases") or []), "nodes":nodes}


def get_baseline_report(policy_key: str) -> dict:
    tree = get_tree(policy_key)
    by_id = {node["node_id"]: node for node in tree["nodes"]}
    path_ids = ["root"] + ["root/" + "/".join(["baseline"] * index) for index in range(1, len(tree["phases"]))]
    missing = [node_id for node_id in path_ids if node_id not in by_id]
    if missing:
        raise KeyError(f"all-baseline pathway is incomplete: {', '.join(missing)}")
    return {"policy":tree["policy"],"simulation_target":tree["simulation_target"],"report_variant":"fixed_all_baseline","report_path":path_ids[-1],"nodes":[by_id[node_id] for node_id in path_ids]}


def _scenario(policy_key: str, raw: dict) -> dict:
    source = _config(policy_key)["scenario_dir"]
    path = source / f"scenario_{raw.get('scenario_index', 1)}.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    payload = json.loads((source / "simulation_personas.json").read_text(encoding="utf-8"))
    scenarios = payload.get("scenarios", [])
    return next((item for item in scenarios if item.get("scenario_id") == raw.get("scenario_id")), scenarios[0] if len(scenarios) == 1 else {})


def persona_chat_context(persona_name: str, policy_key: str) -> dict:
    raw, scenario = _raw_tree(policy_key), _scenario(policy_key, _raw_tree(policy_key))
    participant = next((item for item in scenario.get("participants", []) if item.get("name") == (persona_name or "").strip()), None)
    if not participant:
        raise KeyError(f"persona not found: {persona_name}")
    root = _phase_payload(raw["nodes"]["root"].get("phase_result")) or {}
    post = next((item for item in root.get("posts", []) if item.get("persona_name") == persona_name), {})
    return {"scenario_id":raw.get("scenario_id"),"policy":policy_key,"target_label":raw.get("simulation_target"),"policy_inputs":root.get("grounded_values") or post.get("prediction_values") or {},"persona":participant,"toc_memory":[{"phase":root.get("phase"),"phase_summary":root.get("phase_summary"),"prediction_values":post.get("prediction_values") or {},"narrative":post.get("narrative") or "","evidence":(post.get("evidence") or [])[:3]}]}


def persona_profiles(policy_key: str) -> list[dict]:
    path = _config(policy_key)["scenario_dir"] / "constructed_personas.json"
    if not path.exists():
        return []
    payload = json.loads(path.read_text(encoding="utf-8"))
    return payload if isinstance(payload, list) else []
