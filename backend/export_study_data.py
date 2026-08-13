"""Export the study SQLite database as analysis-friendly nested JSON."""
from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

from .study_store import DB_PATH


def _json(value: str | None, default):
    return json.loads(value) if value else default


def export(db_path: Path) -> list[dict]:
    if not db_path.exists():
        return []
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    participant_columns = {
        row["name"] for row in connection.execute("PRAGMA table_info(participants)")
    }
    participants = []
    for row in connection.execute("SELECT * FROM participants ORDER BY created_at"):
        participant_id = row["participant_id"]
        events = []
        for event in connection.execute(
            "SELECT * FROM events WHERE participant_id = ? ORDER BY occurred_at, id",
            (participant_id,),
        ):
            item = dict(event)
            item["payload"] = _json(item.pop("payload_json"), {})
            events.append(item)
        chats = [
            dict(chat) for chat in connection.execute(
                "SELECT * FROM chat_turns WHERE participant_id = ? ORDER BY asked_at, turn_id",
                (participant_id,),
            )
        ]
        surveys = []
        for survey in connection.execute(
            "SELECT * FROM survey_responses WHERE participant_id = ? ORDER BY id",
            (participant_id,),
        ):
            item = dict(survey)
            item["answers"] = _json(item.pop("answers_json"), {})
            surveys.append(item)
        assigned_policies = _json(row["assigned_policies_json"], [])
        assigned_conditions = (
            _json(row["assigned_conditions_json"], [])
            if "assigned_conditions_json" in participant_columns else []
        )
        policy_trials = [
            dict(trial) for trial in connection.execute(
                "SELECT * FROM policy_trials WHERE participant_id = ? ORDER BY policy_order_index",
                (participant_id,),
            )
        ] if "policy_trials" in {
            item["name"] for item in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")
        } else []
        participants.append({
            "participant_id": participant_id,
            "created_at": row["created_at"],
            "variant_id": row["variant_id"] if "variant_id" in participant_columns else None,
            "study_version": row["study_version"] if "study_version" in participant_columns else None,
            "domain_id": row["domain_id"] if "domain_id" in participant_columns else None,
            "condition": row["condition_name"] if "condition_name" in participant_columns else None,
            "policy_order": row["policy_order"] if "policy_order" in participant_columns else None,
            "assigned_policies": assigned_policies,
            "assigned_conditions": assigned_conditions,
            "assigned_trials": [
                {"policy_key": policy_key, "condition": condition, "policy_index": index}
                for index, (policy_key, condition) in enumerate(zip(assigned_policies, assigned_conditions))
            ],
            "policy_trials": policy_trials,
            "pair_key": row["pair_key"],
            "status": row["status"],
            "prolific_pid": row["prolific_pid"],
            "prolific_study_id": row["prolific_study_id"],
            "prolific_session_id": row["prolific_session_id"],
            "events": events,
            "chat_turns": chats,
            "survey_responses": surveys,
        })
    connection.close()
    return participants


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--db", type=Path, default=DB_PATH)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(export(args.db), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Exported study data to {args.output}")


if __name__ == "__main__":
    main()
