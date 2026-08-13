"""Domain-specific study variants shared by assignment and admin views."""
from __future__ import annotations

from typing import Iterable


STUDY_VERSION = "domain-condition-v1"
CONDITIONS = ("baseline", "framework")

DOMAINS = {
    "public_health": {
        "label": "Public Health",
        "policies": (
            {"key": "usa/chi_nsa", "label": "No Surprises Act", "short_label": "NSA"},
            {"key": "usa/chi_ira", "label": "Inflation Reduction Act Insulin Provisions", "short_label": "IRA"},
        ),
    },
    "welfare": {
        "label": "Welfare",
        "policies": (
            {"key": "usa/chi_ctc", "label": "Expanded Child Tax Credit", "short_label": "CTC"},
            {"key": "usa/chi_ccdf", "label": "Child Care and Development Fund", "short_label": "CCDF"},
        ),
    },
    "climate": {
        "label": "Climate",
        "policies": (
            {"key": "usa/chi_clean_vehicle", "label": "Clean Vehicle Credit", "short_label": "CVC"},
            {"key": "ger/chi_vg", "label": "German Packaging Act", "short_label": "VerpackG"},
        ),
    },
    "ai_talent": {
        "label": "AI Talent",
        "policies": (
            {"key": "kor/bk21", "label": "Brain Korea 21", "short_label": "BK21"},
            {"key": "singapore/nais_100e", "label": "100 Experiments", "short_label": "100E"},
        ),
    },
    "transportation": {
        "label": "Transportation",
        "policies": (
            {"key": "kor/chi_kpass", "label": "K-Pass Public Transit Subsidy", "short_label": "K-Pass"},
            {"key": "transportation/pending", "label": "Policy result in progress", "short_label": "TBD"},
        ),
    },
}


def _variant(domain_id: str, condition: str, order: str) -> dict:
    domain = DOMAINS[domain_id]
    policies = list(domain["policies"])
    if order == "ba":
        policies.reverse()
    return {
        "variant_id": f"{domain_id}--{condition}--{order}",
        "study_version": STUDY_VERSION,
        "domain_id": domain_id,
        "domain_label": domain["label"],
        "condition": condition,
        "condition_label": "Framework" if condition == "framework" else "Baseline",
        "policy_order": order,
        "policies": policies,
        "policy_keys": [policy["key"] for policy in policies],
        "order_label": " → ".join(policy["short_label"] for policy in policies),
    }


def list_variants(available_policies: Iterable[dict] = ()) -> list[dict]:
    availability = {
        policy["key"]: {
            "available": bool(policy.get("available")),
            "phase_count": int(policy.get("phase_count") or 0),
            "pathway_count": int(policy.get("pathway_count") or 0),
        }
        for policy in available_policies
    }
    variants = []
    for domain_id in DOMAINS:
        for condition in CONDITIONS:
            for order in ("ab", "ba"):
                item = _variant(domain_id, condition, order)
                policy_status = []
                for policy in item["policies"]:
                    status = availability.get(policy["key"], {})
                    phase_count = status.get("phase_count", 0)
                    ready = bool(status.get("available")) and phase_count >= 5
                    policy_status.append({**policy, **status, "ready": ready})
                item["policies"] = policy_status
                item["ready"] = all(policy["ready"] for policy in policy_status)
                item["status"] = "ready" if item["ready"] else "incomplete"
                variants.append(item)
    return variants


def get_variant(variant_id: str, available_policies: Iterable[dict] = ()) -> dict:
    variants = {item["variant_id"]: item for item in list_variants(available_policies)}
    if variant_id not in variants:
        raise KeyError(variant_id)
    return variants[variant_id]
