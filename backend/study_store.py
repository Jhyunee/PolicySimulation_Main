"""SQLite-backed participant assignment and interaction logging for the CHI study."""
from __future__ import annotations

import json
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from itertools import combinations
from pathlib import Path


DATA_DIR = Path(
    os.getenv("DATA_DIR")
    or os.getenv("RAILWAY_VOLUME_MOUNT_PATH")
    or Path(__file__).resolve().parent / "study_data"
)
DB_PATH = DATA_DIR / "policy_pathway_study.sqlite3"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=30)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")
    connection.execute("PRAGMA foreign_keys=ON")
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS participants (
            participant_id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            assigned_policies_json TEXT NOT NULL,
            pair_key TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            prolific_pid TEXT,
            prolific_study_id TEXT,
            prolific_session_id TEXT,
            assigned_conditions_json TEXT,
            variant_id TEXT,
            study_version TEXT,
            domain_id TEXT,
            condition_name TEXT,
            policy_order TEXT,
            screening_reason TEXT,
            screened_out_at TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_participants_pair ON participants(pair_key);

        CREATE TABLE IF NOT EXISTS policy_trials (
            trial_id TEXT PRIMARY KEY,
            participant_id TEXT NOT NULL,
            domain_id TEXT,
            condition_name TEXT NOT NULL,
            policy_key TEXT NOT NULL,
            policy_order_index INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(participant_id) REFERENCES participants(participant_id),
            UNIQUE(participant_id, policy_order_index)
        );
        CREATE INDEX IF NOT EXISTS idx_trials_variant
            ON policy_trials(domain_id, condition_name, policy_key, policy_order_index);

        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id TEXT NOT NULL,
            policy_key TEXT,
            event_type TEXT NOT NULL,
            occurred_at TEXT NOT NULL,
            server_received_at TEXT NOT NULL,
            elapsed_ms INTEGER,
            trial_id TEXT,
            domain_id TEXT,
            condition_name TEXT,
            policy_order_index INTEGER,
            payload_json TEXT NOT NULL DEFAULT '{}',
            FOREIGN KEY(participant_id) REFERENCES participants(participant_id)
        );
        CREATE INDEX IF NOT EXISTS idx_events_participant ON events(participant_id, id);
        CREATE INDEX IF NOT EXISTS idx_events_policy_type ON events(policy_key, event_type);

        CREATE TABLE IF NOT EXISTS chat_turns (
            turn_id TEXT PRIMARY KEY,
            participant_id TEXT NOT NULL,
            policy_key TEXT NOT NULL,
            pathway TEXT NOT NULL,
            persona_name TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT,
            asked_at TEXT NOT NULL,
            answered_at TEXT,
            latency_ms INTEGER,
            error TEXT,
            trial_id TEXT,
            domain_id TEXT,
            condition_name TEXT,
            policy_order_index INTEGER,
            FOREIGN KEY(participant_id) REFERENCES participants(participant_id)
        );
        CREATE INDEX IF NOT EXISTS idx_chat_participant ON chat_turns(participant_id, policy_key);

        CREATE TABLE IF NOT EXISTS survey_responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id TEXT NOT NULL,
            policy_key TEXT,
            survey_stage TEXT NOT NULL,
            submitted_at TEXT NOT NULL,
            trial_id TEXT,
            domain_id TEXT,
            condition_name TEXT,
            policy_order_index INTEGER,
            answers_json TEXT NOT NULL,
            UNIQUE(participant_id, policy_key, survey_stage),
            FOREIGN KEY(participant_id) REFERENCES participants(participant_id)
        );
        CREATE INDEX IF NOT EXISTS idx_surveys_participant
            ON survey_responses(participant_id, survey_stage, policy_key);
        """
    )
    columns = {row["name"] for row in connection.execute("PRAGMA table_info(participants)")}
    for name in (
        "prolific_pid", "prolific_study_id", "prolific_session_id",
        "assigned_conditions_json", "variant_id", "study_version", "domain_id",
        "condition_name", "policy_order", "screening_reason", "screened_out_at",
    ):
        if name not in columns:
            connection.execute(f"ALTER TABLE participants ADD COLUMN {name} TEXT")
    extra_columns = {
        "events": {"trial_id": "TEXT", "domain_id": "TEXT", "condition_name": "TEXT", "policy_order_index": "INTEGER"},
        "chat_turns": {"trial_id": "TEXT", "domain_id": "TEXT", "condition_name": "TEXT", "policy_order_index": "INTEGER"},
        "survey_responses": {"trial_id": "TEXT", "domain_id": "TEXT", "condition_name": "TEXT", "policy_order_index": "INTEGER"},
    }
    for table, additions in extra_columns.items():
        existing = {row["name"] for row in connection.execute(f"PRAGMA table_info({table})")}
        for name, column_type in additions.items():
            if name not in existing:
                connection.execute(f"ALTER TABLE {table} ADD COLUMN {name} {column_type}")
    return connection


def _new_participant_id(connection: sqlite3.Connection) -> str:
    while True:
        participant_id = f"policy_{secrets.token_hex(4)}"
        exists = connection.execute(
            "SELECT 1 FROM participants WHERE participant_id = ?", (participant_id,)
        ).fetchone()
        if not exists:
            return participant_id


def _balanced_assignment(connection: sqlite3.Connection, policy_keys: list[str]) -> list[str]:
    pairs = list(combinations(sorted(policy_keys), 2))
    if not pairs:
        raise ValueError("At least two policies are required for pair assignment")

    pair_counts = {
        row["pair_key"]: row["n"]
        for row in connection.execute(
            "SELECT pair_key, COUNT(*) AS n FROM participants GROUP BY pair_key"
        )
    }
    minimum = min(pair_counts.get("|".join(pair), 0) for pair in pairs)
    candidates = [pair for pair in pairs if pair_counts.get("|".join(pair), 0) == minimum]
    pair = secrets.choice(candidates)

    left, right = pair
    orientations = {
        row["assigned_policies_json"]: row["n"]
        for row in connection.execute(
            "SELECT assigned_policies_json, COUNT(*) AS n FROM participants GROUP BY assigned_policies_json"
        )
    }
    left_first = orientations.get(json.dumps([left, right]), 0)
    right_first = orientations.get(json.dumps([right, left]), 0)
    if left_first == right_first:
        return list(pair) if secrets.randbelow(2) == 0 else [right, left]
    return [left, right] if left_first < right_first else [right, left]


def _balanced_condition_order(connection: sqlite3.Connection, policies: list[str]) -> list[str]:
    orders = (["full", "baseline"], ["baseline", "full"])
    order_counts = {
        row["assigned_conditions_json"]: row["n"]
        for row in connection.execute(
            """
            SELECT assigned_conditions_json, COUNT(*) AS n
            FROM participants
            WHERE assigned_conditions_json IS NOT NULL
            GROUP BY assigned_conditions_json
            """
        )
    }
    exposure_counts: dict[tuple[str, str], int] = {}
    for row in connection.execute(
        """
        SELECT assigned_policies_json, assigned_conditions_json
        FROM participants
        WHERE assigned_conditions_json IS NOT NULL
        """
    ):
        assigned_policies = json.loads(row["assigned_policies_json"])
        assigned_conditions = json.loads(row["assigned_conditions_json"])
        for policy_key, condition in zip(assigned_policies, assigned_conditions):
            key = (policy_key, condition)
            exposure_counts[key] = exposure_counts.get(key, 0) + 1

    all_policies = {policy_key for policy_key, _ in exposure_counts} | set(policies)
    scores = {}
    for order in orders:
        simulated = dict(exposure_counts)
        for policy_key, condition in zip(policies, order):
            key = (policy_key, condition)
            simulated[key] = simulated.get(key, 0) + 1
        policy_imbalance = sum(
            (simulated.get((policy_key, "full"), 0) - simulated.get((policy_key, "baseline"), 0)) ** 2
            for policy_key in all_policies
        )
        first_after = order_counts.get(json.dumps(orders[0]), 0) + (order == orders[0])
        second_after = order_counts.get(json.dumps(orders[1]), 0) + (order == orders[1])
        scores[tuple(order)] = policy_imbalance + 100 * (first_after - second_after) ** 2
    minimum = min(scores.values())
    candidates = [order for order in orders if scores[tuple(order)] == minimum]
    if len(candidates) == 1:
        return list(candidates[0])
    first_count = order_counts.get(json.dumps(orders[0]), 0)
    second_count = order_counts.get(json.dumps(orders[1]), 0)
    if first_count == second_count:
        return list(orders[secrets.randbelow(2)])
    return list(orders[0] if first_count < second_count else orders[1])


def _legacy_conditions(participant_id: str) -> list[str]:
    return ["full", "baseline"] if int(participant_id.rsplit("_", 1)[-1], 16) % 2 == 0 else ["baseline", "full"]


def _trials(policies: list[str], conditions: list[str]) -> list[dict]:
    return [
        {"policy_key": policy_key, "condition": condition, "policy_index": index}
        for index, (policy_key, condition) in enumerate(zip(policies, conditions))
    ]


def create_participant(
    policy_keys: list[str],
    prolific: dict | None = None,
    assignment_context: dict | None = None,
) -> dict:
    prolific = prolific or {}
    assignment_context = assignment_context or {}
    with _connect() as connection:
        connection.execute("BEGIN IMMEDIATE")
        assignment = list(assignment_context.get("policy_keys") or _balanced_assignment(connection, policy_keys))
        fixed_condition = assignment_context.get("condition")
        conditions = [fixed_condition] * len(assignment) if fixed_condition else _balanced_condition_order(connection, assignment)
        participant_id = _new_participant_id(connection)
        pair_key = "|".join(sorted(assignment))
        created_at = _now()
        connection.execute(
            """
            INSERT INTO participants(
                participant_id, created_at, assigned_policies_json, pair_key,
                prolific_pid, prolific_study_id, prolific_session_id,
                assigned_conditions_json, variant_id, study_version, domain_id,
                condition_name, policy_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                participant_id, created_at, json.dumps(assignment), pair_key,
                prolific.get("prolific_pid"), prolific.get("study_id"),
                prolific.get("session_id"),
                json.dumps(conditions),
                assignment_context.get("variant_id"),
                assignment_context.get("study_version"),
                assignment_context.get("domain_id"),
                fixed_condition,
                assignment_context.get("policy_order"),
            ),
        )
        for index, (policy_key, condition) in enumerate(zip(assignment, conditions)):
            connection.execute(
                """
                INSERT INTO policy_trials(
                    trial_id, participant_id, domain_id, condition_name,
                    policy_key, policy_order_index, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    f"{participant_id}:{index}", participant_id,
                    assignment_context.get("domain_id"), condition,
                    policy_key, index, created_at,
                ),
            )
    return {
        "participant_id": participant_id,
        "created_at": created_at,
        "assigned_policies": assignment,
        "assigned_conditions": conditions,
        "assigned_trials": _trials(assignment, conditions),
        "variant_id": assignment_context.get("variant_id"),
        "study_version": assignment_context.get("study_version"),
        "domain_id": assignment_context.get("domain_id"),
        "condition": fixed_condition,
        "policy_order": assignment_context.get("policy_order"),
        "pair_key": pair_key,
        "status": "active",
        "completed_policies": [],
        "post_study_completed": False,
    }


def get_participant(participant_id: str) -> dict | None:
    with _connect() as connection:
        row = connection.execute(
            "SELECT * FROM participants WHERE participant_id = ?", (participant_id,)
        ).fetchone()
        completed = [
            item["policy_key"] for item in connection.execute(
                """
                SELECT policy_key FROM survey_responses
                WHERE participant_id = ? AND survey_stage = 'policy'
                ORDER BY id
                """,
                (participant_id,),
            )
        ]
        pre_study_completed = connection.execute(
            """
            SELECT 1 FROM survey_responses
            WHERE participant_id = ? AND survey_stage = 'pre_study'
            """,
            (participant_id,),
        ).fetchone() is not None
        introduced_policies = [
            item["policy_key"] for item in connection.execute(
                """
                SELECT policy_key FROM survey_responses
                WHERE participant_id = ? AND survey_stage = 'policy_pre'
                ORDER BY id
                """,
                (participant_id,),
            )
        ]
        post_study_completed = connection.execute(
            """
            SELECT 1 FROM survey_responses
            WHERE participant_id = ? AND survey_stage = 'post_study'
            """,
            (participant_id,),
        ).fetchone() is not None
        extended_completed = connection.execute(
            """
            SELECT 1 FROM survey_responses
            WHERE participant_id = ? AND survey_stage = 'extended'
            """,
            (participant_id,),
        ).fetchone() is not None
    if not row:
        return None
    assigned_policies = json.loads(row["assigned_policies_json"])
    assigned_conditions = (
        json.loads(row["assigned_conditions_json"])
        if row["assigned_conditions_json"]
        else _legacy_conditions(row["participant_id"])
    )
    return {
        "participant_id": row["participant_id"],
        "created_at": row["created_at"],
        "assigned_policies": assigned_policies,
        "assigned_conditions": assigned_conditions,
        "assigned_trials": _trials(assigned_policies, assigned_conditions),
        "variant_id": row["variant_id"],
        "study_version": row["study_version"],
        "domain_id": row["domain_id"],
        "condition": row["condition_name"],
        "policy_order": row["policy_order"],
        "pair_key": row["pair_key"],
        "status": row["status"],
        "screening_reason": row["screening_reason"],
        "screened_out_at": row["screened_out_at"],
        "completed_policies": completed,
        "pre_study_completed": pre_study_completed,
        "introduced_policies": introduced_policies,
        "post_study_completed": post_study_completed,
        "extended_completed": extended_completed,
    }


def delete_participant(participant_id: str) -> dict | None:
    """Permanently delete one participant and every associated study record."""
    with _connect() as connection:
        participant = connection.execute(
            "SELECT participant_id FROM participants WHERE participant_id = ?",
            (participant_id,),
        ).fetchone()
        if not participant:
            return None

        deleted_records: dict[str, int] = {}
        for table in ("chat_turns", "events", "survey_responses", "policy_trials"):
            cursor = connection.execute(
                f"DELETE FROM {table} WHERE participant_id = ?",
                (participant_id,),
            )
            deleted_records[table] = cursor.rowcount
        cursor = connection.execute(
            "DELETE FROM participants WHERE participant_id = ?",
            (participant_id,),
        )
        deleted_records["participants"] = cursor.rowcount
        return {
            "participant_id": participant_id,
            "deleted_records": deleted_records,
        }


def variant_counts() -> dict[str, dict]:
    with _connect() as connection:
        rows = connection.execute(
            """
            SELECT variant_id, COUNT(*) AS total,
                   SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
            FROM participants
            WHERE variant_id IS NOT NULL
            GROUP BY variant_id
            """
        ).fetchall()
    return {
        row["variant_id"]: {
            "participants": int(row["total"] or 0),
            "completed": int(row["completed"] or 0),
        }
        for row in rows
    }


def mark_screened_out(participant_id: str, reason: str) -> dict:
    screened_out_at = _now()
    with _connect() as connection:
        connection.execute(
            """
            UPDATE participants
            SET status = 'screened_out', screening_reason = ?, screened_out_at = ?
            WHERE participant_id = ?
            """,
            (reason, screened_out_at, participant_id),
        )
    return {
        "status": "screened_out",
        "screening_reason": reason,
        "screened_out_at": screened_out_at,
    }


def _decoded_events(connection: sqlite3.Connection, participant_id: str) -> list[dict]:
    events = []
    for row in connection.execute(
        "SELECT * FROM events WHERE participant_id = ? ORDER BY occurred_at, id",
        (participant_id,),
    ):
        event = dict(row)
        event["payload"] = json.loads(event.pop("payload_json") or "{}")
        events.append(event)
    return events


def _recorded_duration_ms(events: list[dict]) -> int:
    """Sum one terminal active-time value per page session, avoiding duplicate exits."""
    session_maxima: dict[str, int] = {}
    terminal_types = {
        "survey_submitted", "policy_exploration_finished", "policy_page_exit",
        "baseline_report_finished", "baseline_report_exit",
    }
    for event in events:
        if event["event_type"] not in terminal_types:
            continue
        payload = event.get("payload") or {}
        session_id = payload.get("page_session_id")
        if not session_id:
            continue
        value = payload.get("active_elapsed_ms")
        if value is None:
            value = event.get("elapsed_ms")
        if value is None:
            continue
        session_maxima[session_id] = max(session_maxima.get(session_id, 0), int(value))
    return sum(session_maxima.values())


def _interaction_summary(events: list[dict], chats: list[dict]) -> dict:
    complete_paths: set[str] = set()
    selected_node_paths: set[str] = set()
    opened_discussions: dict[tuple[str, str], list[dict]] = {}
    discussions = []

    for event in events:
        payload = event.get("payload") or {}
        path = payload.get("path")
        session_id = payload.get("page_session_id") or "unknown"
        if event["event_type"] == "node_selected" and path:
            selected_node_paths.add(path)
        if event["event_type"] == "complete_path_discovered" and path:
            complete_paths.add(path)
        if event["event_type"] == "policy_exploration_finished":
            complete_paths.update(payload.get("completed_paths") or [])
        if event["event_type"] == "discussion_opened" and path:
            opened_discussions.setdefault((session_id, path), []).append(event)
        elif event["event_type"] == "discussion_closed" and path:
            key = (session_id, path)
            opened = opened_discussions.get(key) or []
            start = opened.pop(0) if opened else None
            duration_ms = None
            if start:
                try:
                    began = datetime.fromisoformat(start["occurred_at"].replace("Z", "+00:00"))
                    ended = datetime.fromisoformat(event["occurred_at"].replace("Z", "+00:00"))
                    duration_ms = max(0, int((ended - began).total_seconds() * 1000))
                except (TypeError, ValueError):
                    duration_ms = None
            discussions.append({
                "path": path,
                "phase": (start or event).get("payload", {}).get("phase"),
                "phase_index": (start or event).get("payload", {}).get("phase_index"),
                "opened_at": start.get("occurred_at") if start else None,
                "closed_at": event.get("occurred_at"),
                "duration_ms": duration_ms,
            })

    for opened in opened_discussions.values():
        for event in opened:
            payload = event.get("payload") or {}
            discussions.append({
                "path": payload.get("path"),
                "phase": payload.get("phase"),
                "phase_index": payload.get("phase_index"),
                "opened_at": event.get("occurred_at"),
                "closed_at": None,
                "duration_ms": None,
            })

    return {
        "recorded_duration_ms": _recorded_duration_ms(events),
        "complete_paths": sorted(complete_paths),
        "complete_path_count": len(complete_paths),
        "selected_node_paths": sorted(selected_node_paths),
        "selected_node_count": len(selected_node_paths),
        "stakeholder_discussions": discussions,
        "stakeholder_discussion_count": len(discussions),
        "stakeholder_discussion_duration_ms": sum(
            item["duration_ms"] or 0 for item in discussions
        ),
        "chat_turns": chats,
        "chat_count": len(chats),
    }


def study_results() -> dict:
    """Return nested study data for the local results administration UI."""
    with _connect() as connection:
        participant_rows = connection.execute(
            "SELECT * FROM participants ORDER BY created_at DESC"
        ).fetchall()
        participants = []
        case_index: dict[str, dict] = {}

        for row in participant_rows:
            participant_id = row["participant_id"]
            assigned_policies = json.loads(row["assigned_policies_json"] or "[]")
            assigned_conditions = (
                json.loads(row["assigned_conditions_json"])
                if row["assigned_conditions_json"] else _legacy_conditions(participant_id)
            )
            surveys = []
            for survey in connection.execute(
                "SELECT * FROM survey_responses WHERE participant_id = ? ORDER BY submitted_at, id",
                (participant_id,),
            ):
                item = dict(survey)
                item["answers"] = json.loads(item.pop("answers_json") or "{}")
                surveys.append(item)
            all_events = _decoded_events(connection, participant_id)
            all_chats = [dict(item) for item in connection.execute(
                "SELECT * FROM chat_turns WHERE participant_id = ? ORDER BY asked_at, turn_id",
                (participant_id,),
            )]

            trials = []
            trial_rows = connection.execute(
                """
                SELECT * FROM policy_trials
                WHERE participant_id = ? ORDER BY policy_order_index
                """,
                (participant_id,),
            ).fetchall()
            if trial_rows:
                trial_source = [dict(item) for item in trial_rows]
            else:
                trial_source = [
                    {
                        "trial_id": f"{participant_id}:{index}",
                        "participant_id": participant_id,
                        "domain_id": row["domain_id"],
                        "condition_name": condition,
                        "policy_key": policy_key,
                        "policy_order_index": index,
                        "created_at": row["created_at"],
                    }
                    for index, (policy_key, condition) in enumerate(
                        zip(assigned_policies, assigned_conditions)
                    )
                ]

            for trial in trial_source:
                policy_key = trial["policy_key"]
                policy_surveys = [
                    survey for survey in surveys if survey["policy_key"] == policy_key
                ]
                policy_events = [
                    event for event in all_events if event["policy_key"] == policy_key
                ]
                policy_chats = [
                    chat for chat in all_chats if chat["policy_key"] == policy_key
                ]
                interactions = _interaction_summary(policy_events, policy_chats)
                trial_item = {
                    **trial,
                    "survey_responses": policy_surveys,
                    "chat_count": len(policy_chats),
                    "event_count": len(policy_events),
                    "interaction_summary": interactions,
                }
                trials.append(trial_item)
                case = case_index.setdefault(policy_key, {
                    "policy_key": policy_key,
                    "assigned_count": 0,
                    "introduction_count": 0,
                    "response_count": 0,
                    "completed_participant_count": 0,
                    "framework_count": 0,
                    "baseline_count": 0,
                    "participants": [],
                })
                stages = {survey["survey_stage"] for survey in policy_surveys}
                condition = trial.get("condition_name") or "unknown"
                case["assigned_count"] += 1
                case["introduction_count"] += int("policy_pre" in stages)
                case["response_count"] += int("policy" in stages)
                case["completed_participant_count"] += int(row["status"] == "completed")
                if condition in {"framework", "full"}:
                    case["framework_count"] += 1
                elif condition == "baseline":
                    case["baseline_count"] += 1
                case["participants"].append({
                    "participant_id": participant_id,
                    "created_at": row["created_at"],
                    "status": row["status"],
                    "prolific_pid": row["prolific_pid"],
                    "variant_id": row["variant_id"],
                    "condition": condition,
                    "policy_order_index": trial.get("policy_order_index"),
                    "survey_stages": sorted(stages),
                    "submitted_at": max(
                        (survey["submitted_at"] for survey in policy_surveys),
                        default=None,
                    ),
                    "chat_count": len(policy_chats),
                    "event_count": len(policy_events),
                    "recorded_duration_ms": interactions["recorded_duration_ms"],
                    "complete_path_count": interactions["complete_path_count"],
                    "stakeholder_discussion_count": interactions["stakeholder_discussion_count"],
                })

            participants.append({
                "participant_id": participant_id,
                "created_at": row["created_at"],
                "status": row["status"],
                "screening_reason": row["screening_reason"],
                "screened_out_at": row["screened_out_at"],
                "prolific_pid": row["prolific_pid"],
                "prolific_study_id": row["prolific_study_id"],
                "prolific_session_id": row["prolific_session_id"],
                "variant_id": row["variant_id"],
                "study_version": row["study_version"],
                "domain_id": row["domain_id"],
                "condition": row["condition_name"],
                "policy_order": row["policy_order"],
                "assigned_policies": assigned_policies,
                "recorded_duration_ms": _recorded_duration_ms(all_events),
                "trials": trials,
                "global_survey_responses": [
                    survey for survey in surveys if not survey["policy_key"]
                ],
            })

    cases = sorted(case_index.values(), key=lambda item: item["policy_key"])
    for case in cases:
        case["participants"].sort(
            key=lambda item: item.get("created_at") or "", reverse=True
        )
    return {
        "generated_at": _now(),
        "participant_count": len(participants),
        "completed_count": sum(item["status"] == "completed" for item in participants),
        "screened_out_count": sum(item["status"] == "screened_out" for item in participants),
        "case_count": len(cases),
        "response_count": sum(case["response_count"] for case in cases),
        "cases": cases,
        "participants": participants,
    }


def _trial_context(connection: sqlite3.Connection, participant_id: str, policy_key: str | None) -> dict:
    if not policy_key:
        row = connection.execute(
            "SELECT domain_id, condition_name FROM participants WHERE participant_id = ?",
            (participant_id,),
        ).fetchone()
        return dict(row) if row else {}
    row = connection.execute(
        """
        SELECT trial_id, domain_id, condition_name, policy_order_index
        FROM policy_trials
        WHERE participant_id = ? AND policy_key = ?
        """,
        (participant_id, policy_key),
    ).fetchone()
    return dict(row) if row else {}


def save_survey_response(response: dict) -> int:
    # SQLite treats NULL values as distinct in UNIQUE constraints, so the
    # study-level response uses an empty policy key to remain idempotent.
    policy_key = response.get("policy_key") or ""
    with _connect() as connection:
        context = _trial_context(connection, response["participant_id"], policy_key)
        cursor = connection.execute(
            """
            INSERT INTO survey_responses(
                participant_id, policy_key, survey_stage, submitted_at,
                trial_id, domain_id, condition_name, policy_order_index, answers_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(participant_id, policy_key, survey_stage) DO UPDATE SET
                submitted_at = excluded.submitted_at,
                trial_id = excluded.trial_id,
                domain_id = excluded.domain_id,
                condition_name = excluded.condition_name,
                policy_order_index = excluded.policy_order_index,
                answers_json = excluded.answers_json
            """,
            (
                response["participant_id"], policy_key, response["survey_stage"],
                response.get("submitted_at") or _now(),
                context.get("trial_id"), context.get("domain_id"), context.get("condition_name"),
                context.get("policy_order_index"),
                json.dumps(response.get("answers") or {}, ensure_ascii=False),
            ),
        )
        if response["survey_stage"] == "extended":
            connection.execute(
                "UPDATE participants SET status = 'completed' WHERE participant_id = ?",
                (response["participant_id"],),
            )
        return int(cursor.lastrowid)


def add_event(event: dict) -> int:
    with _connect() as connection:
        context = _trial_context(connection, event["participant_id"], event.get("policy_key"))
        cursor = connection.execute(
            """
            INSERT INTO events(
                participant_id, policy_key, event_type, occurred_at,
                server_received_at, elapsed_ms, trial_id, domain_id,
                condition_name, policy_order_index, payload_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                event["participant_id"],
                event.get("policy_key"),
                event["event_type"],
                event.get("occurred_at") or _now(),
                _now(),
                event.get("elapsed_ms"),
                context.get("trial_id"), context.get("domain_id"), context.get("condition_name"),
                context.get("policy_order_index"),
                json.dumps(event.get("payload") or {}, ensure_ascii=False),
            ),
        )
        return int(cursor.lastrowid)


def chat_turn_status(participant_id: str, policy_key: str, framework_limit: int = 5) -> dict:
    with _connect() as connection:
        context = _trial_context(connection, participant_id, policy_key)
        condition = context.get("condition_name")
        enabled = condition in {"baseline", "framework", "full"}
        used = int(connection.execute(
            """
            SELECT COUNT(*) AS n FROM chat_turns
            WHERE participant_id = ? AND policy_key = ?
            """,
            (participant_id, policy_key),
        ).fetchone()["n"])
        return {
            "enabled": enabled,
            "condition": condition,
            "used": used,
            "limit": framework_limit,
            "remaining": max(0, framework_limit - used) if enabled else None,
        }


def start_chat_turn(turn: dict, framework_limit: int | None = None) -> dict:
    with _connect() as connection:
        # Serialize the count-and-reserve operation so simultaneous browser
        # tabs cannot both claim the final available question.
        connection.execute("BEGIN IMMEDIATE")
        context = _trial_context(connection, turn["participant_id"], turn["policy_key"])
        condition = context.get("condition_name")
        limit_enabled = condition in {"baseline", "framework", "full"} and framework_limit is not None
        existing = connection.execute(
            "SELECT 1 FROM chat_turns WHERE turn_id = ?",
            (turn["turn_id"],),
        ).fetchone()
        used = int(connection.execute(
            """
            SELECT COUNT(*) AS n FROM chat_turns
            WHERE participant_id = ? AND policy_key = ?
            """,
            (turn["participant_id"], turn["policy_key"]),
        ).fetchone()["n"])
        if limit_enabled and not existing and used >= int(framework_limit):
            return {
                "accepted": False,
                "condition": condition,
                "used": used,
                "limit": int(framework_limit),
                "remaining": 0,
            }
        connection.execute(
            """
            INSERT OR REPLACE INTO chat_turns(
                turn_id, participant_id, policy_key, pathway, persona_name,
                question, asked_at, trial_id, domain_id, condition_name,
                policy_order_index
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                turn["turn_id"], turn["participant_id"], turn["policy_key"],
                turn["pathway"], turn["persona_name"], turn["question"],
                turn.get("asked_at") or _now(),
                context.get("trial_id"), context.get("domain_id"), context.get("condition_name"),
                context.get("policy_order_index"),
            ),
        )
        used_after = used if existing else used + 1
        return {
            "accepted": True,
            "condition": condition,
            "used": used_after,
            "limit": framework_limit,
            "remaining": (
                max(0, int(framework_limit) - used_after)
                if limit_enabled else None
            ),
        }


def finish_chat_turn(turn_id: str, answer: str | None, latency_ms: int | None, error: str | None) -> None:
    with _connect() as connection:
        connection.execute(
            """
            UPDATE chat_turns
            SET answer = ?, answered_at = ?, latency_ms = ?, error = ?
            WHERE turn_id = ?
            """,
            (answer, _now(), latency_ms, error, turn_id),
        )
