"""Standalone deployment server for the branching policy-pathway user study."""
from __future__ import annotations

import json
import os
import re
import time
from pathlib import Path

import requests
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import precomputed_branch_store, study_store, study_variants


app = FastAPI(title="Policy Pathway Study", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
FRONTEND = Path(__file__).resolve().parents[1] / "frontend"
FRAMEWORK_CHAT_LIMIT = 5
NO_POLICY_EXPERIENCE = "no_policy_research_or_practice_experience"


class PersonaChatRequest(BaseModel):
    policy_key: str
    persona_name: str = Field(min_length=1)
    question: str = Field(min_length=1)
    history: list[dict] = Field(default_factory=list)
    participant_id: str | None = None
    pathway: str | None = None
    turn_id: str | None = None
    user_question: str | None = None


class StudyEventRequest(BaseModel):
    participant_id: str = Field(pattern=r"^policy_[a-f0-9]{8}$")
    policy_key: str | None = None
    event_type: str = Field(min_length=1, max_length=80)
    occurred_at: str | None = None
    elapsed_ms: int | None = Field(default=None, ge=0)
    payload: dict = Field(default_factory=dict)


class StudyParticipantRequest(BaseModel):
    variant_id: str | None = Field(default=None, max_length=100)
    prolific_pid: str | None = Field(default=None, max_length=100)
    study_id: str | None = Field(default=None, max_length=100)
    session_id: str | None = Field(default=None, max_length=100)


class StudySurveyRequest(BaseModel):
    participant_id: str = Field(pattern=r"^policy_[a-f0-9]{8}$")
    policy_key: str | None = None
    survey_stage: str = Field(pattern=r"^(pre_study|policy_pre|policy|post_study|extended)$")
    submitted_at: str | None = None
    answers: dict = Field(default_factory=dict)


@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse("/study_admin.html")


def _admin_access(x_admin_token: str | None) -> None:
    expected = os.getenv("ADMIN_TOKEN")
    if not expected:
        raise HTTPException(503, "Administrator access is not configured.")
    if x_admin_token != expected:
        raise HTTPException(401, "Administrator authorization is required.")


def _prolific_redirect_url(participant: dict, outcome: str) -> str:
    domain = re.sub(r"[^A-Z0-9]+", "_", str(participant.get("domain_id") or "").upper()).strip("_")
    prefix = "PROLIFIC_SCREENED_OUT_URL" if outcome == "screened_out" else "PROLIFIC_COMPLETION_URL"
    keys = [f"{prefix}_{domain}"] if domain else []
    keys.append(prefix)
    return next((os.getenv(key, "") for key in keys if os.getenv(key)), "")


def _persona_messages(context: dict, question: str, history: list[dict]) -> list[dict]:
    system = """You are a stakeholder persona in a policy-simulation user-study interface.
Respond in English and first person. Ground your answer in the supplied persona,
selected pathway, and earlier predictions. State the core answer first, explain one
mechanism or constraint and one limitation. Do not use headings, Markdown, or bullets.
Use 3-5 concise sentences in at most two paragraphs."""
    payload = {
        "policy_context": {"policy": context.get("policy"), "target": context.get("target_label"), "policy_inputs": context.get("policy_inputs")},
        "persona_profile": context.get("persona"),
        "toc_simulation_memory": context.get("toc_memory"),
        "recent_dialogue": history[-4:],
        "user_question": question,
    }
    return [{"role": "system", "content": system}, {"role": "user", "content": json.dumps(payload, ensure_ascii=False)}]


def _chat(messages: list[dict]) -> tuple[str, dict]:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise ValueError("DEEPSEEK_API_KEY is not configured.")
    response = requests.post(
        os.getenv("DEEPSEEK_API_URL", "https://api.deepseek.com/v1/chat/completions"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"model": os.getenv("DEEPSEEK_MODEL", "deepseek-chat"), "messages": messages, "temperature": 0.65, "max_tokens": 220},
        timeout=90,
    )
    response.raise_for_status()
    payload = response.json()
    return payload["choices"][0]["message"]["content"].strip(), payload.get("usage") or {}


@app.get("/api/pathway/policies")
def pathway_policies():
    return {"policies": precomputed_branch_store.list_policies()}


@app.get("/api/pathway/{country}/{program}/precomputed")
def pathway_tree(country: str, program: str):
    try:
        return precomputed_branch_store.get_tree(f"{country}/{program}")
    except KeyError:
        raise HTTPException(404, "Unknown pathway policy.")
    except FileNotFoundError:
        raise HTTPException(404, "The pathway result is not available.")


@app.get("/api/pathway/{country}/{program}/baseline-report")
def baseline_report(country: str, program: str):
    try:
        return precomputed_branch_store.get_baseline_report(f"{country}/{program}")
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(404, str(exc))


@app.get("/api/pathway/{country}/{program}/personas")
def personas(country: str, program: str):
    try:
        return {"policy": f"{country}/{program}", "personas": precomputed_branch_store.persona_profiles(f"{country}/{program}")}
    except (KeyError, FileNotFoundError) as exc:
        raise HTTPException(404, str(exc))


@app.get("/api/study/variants/{variant_id}")
def study_variant(variant_id: str):
    try:
        return study_variants.get_variant(variant_id, precomputed_branch_store.list_policies())
    except KeyError:
        raise HTTPException(404, "Study variant not found.")


@app.get("/api/study/variants")
def study_variants_list(x_admin_token: str | None = Header(default=None)):
    _admin_access(x_admin_token)
    counts = study_store.variant_counts()
    variants = study_variants.list_variants(precomputed_branch_store.list_policies())
    return {"study_version": study_variants.STUDY_VERSION, "variants": [{**variant, **counts.get(variant["variant_id"], {"participants": 0, "completed": 0})} for variant in variants]}


@app.post("/api/study/participants")
def create_participant(req: StudyParticipantRequest):
    if not req.variant_id:
        raise HTTPException(400, "A study variant is required.")
    try:
        variant = study_variants.get_variant(req.variant_id, precomputed_branch_store.list_policies())
    except KeyError:
        raise HTTPException(404, "Study variant not found.")
    if not variant["ready"]:
        raise HTTPException(409, "This policy pair is not ready for deployment.")
    context = {"variant_id":variant["variant_id"], "study_version":variant["study_version"], "domain_id":variant["domain_id"], "condition":variant["condition"], "policy_order":variant["policy_order"], "policy_keys":variant["policy_keys"]}
    return study_store.create_participant([], req.model_dump(), context)


@app.get("/api/study/participants/{participant_id}")
def participant(participant_id: str):
    result = study_store.get_participant(participant_id)
    if not result:
        raise HTTPException(404, "Participant session not found.")
    return result


@app.post("/api/study/events")
def study_event(req: StudyEventRequest):
    participant = study_store.get_participant(req.participant_id)
    if not participant:
        raise HTTPException(404, "Participant session not found.")
    if participant["status"] == "screened_out":
        raise HTTPException(403, "This participant is not eligible to continue the study.")
    return {"event_id": study_store.add_event(req.model_dump())}


@app.post("/api/study/surveys")
def study_survey(req: StudySurveyRequest):
    participant = study_store.get_participant(req.participant_id)
    if not participant:
        raise HTTPException(404, "Participant session not found.")
    if participant["status"] == "screened_out":
        raise HTTPException(403, "This participant is not eligible to continue the study.")
    if req.survey_stage == "pre_study":
        if req.policy_key:
            raise HTTPException(400, "Pre-study responses cannot specify a policy.")
    elif req.survey_stage in {"policy_pre", "policy"}:
        if not req.policy_key or req.policy_key not in participant["assigned_policies"]:
            raise HTTPException(400, "Policy is not assigned to this participant.")
        if not participant["pre_study_completed"]:
            raise HTTPException(409, "The pre-study survey must be completed first.")
        if req.survey_stage == "policy" and req.policy_key not in participant["introduced_policies"]:
            raise HTTPException(409, "The policy introduction survey must be completed first.")
    else:
        if req.policy_key or len(participant["completed_policies"]) < len(participant["assigned_policies"]):
            raise HTTPException(409, "Both assigned policy cases must be completed first.")
        if req.survey_stage == "extended" and not participant["post_study_completed"]:
            raise HTTPException(409, "The quantitative post-study survey must be completed first.")
    response_id = study_store.save_survey_response(req.model_dump())
    if req.survey_stage == "pre_study" and str(req.answers.get("policy_experience", "")).strip().lower() == "none":
        screening = study_store.mark_screened_out(req.participant_id, NO_POLICY_EXPERIENCE)
        participant = study_store.get_participant(req.participant_id) or participant
        return {
            "response_id": response_id,
            **screening,
            "redirect_url": _prolific_redirect_url(participant, "screened_out"),
        }
    return {"response_id": response_id, "status": "saved"}


@app.get("/api/study/chat-limit")
def chat_limit(participant_id: str, policy_key: str):
    participant = study_store.get_participant(participant_id)
    if not participant:
        raise HTTPException(404, "Participant session not found.")
    if participant["status"] == "screened_out":
        raise HTTPException(403, "This participant is not eligible to continue the study.")
    return study_store.chat_turn_status(participant_id, policy_key, FRAMEWORK_CHAT_LIMIT)


@app.post("/api/pathway/persona-chat")
def persona_chat(req: PersonaChatRequest):
    started = time.monotonic()
    if not (req.participant_id and req.turn_id and req.pathway):
        raise HTTPException(400, "A study participant, turn ID, and pathway are required.")
    participant = study_store.get_participant(req.participant_id)
    if not participant:
        raise HTTPException(404, "Participant session not found.")
    if participant["status"] == "screened_out":
        raise HTTPException(403, "This participant is not eligible to continue the study.")
    reserved = study_store.start_chat_turn({"turn_id":req.turn_id,"participant_id":req.participant_id,"policy_key":req.policy_key,"pathway":req.pathway,"persona_name":req.persona_name,"question":req.user_question or req.question}, FRAMEWORK_CHAT_LIMIT)
    if not reserved["accepted"]:
        raise HTTPException(429, detail={"code":"framework_chat_limit_reached", **reserved})
    try:
        context = precomputed_branch_store.persona_chat_context(req.persona_name, req.policy_key)
        answer, usage = _chat(_persona_messages(context, req.question.strip(), req.history))
    except ValueError as exc:
        study_store.finish_chat_turn(req.turn_id, None, None, str(exc))
        raise HTTPException(503, str(exc))
    except requests.RequestException as exc:
        study_store.finish_chat_turn(req.turn_id, None, None, str(exc))
        raise HTTPException(502, "The persona chat service is temporarily unavailable.")
    except Exception as exc:
        study_store.finish_chat_turn(req.turn_id, None, None, str(exc))
        raise HTTPException(500, "The persona response could not be generated.")
    study_store.finish_chat_turn(req.turn_id, answer, round((time.monotonic() - started) * 1000), None)
    return {"persona_name":req.persona_name, "answer":answer, "usage":usage}


@app.get("/api/study/results")
def study_results(x_admin_token: str | None = Header(default=None)):
    _admin_access(x_admin_token)
    payload = study_store.study_results()
    labels = {item["key"]: item for item in precomputed_branch_store.list_policies()}
    for case in payload["cases"]:
        policy = labels.get(case["policy_key"], {})
        case.update({"label":policy.get("label", case["policy_key"]), "short_label":policy.get("short_label", case["policy_key"]), "description":policy.get("description", ""), "goal":policy.get("goal", "")})
    return payload


@app.get("/api/study/completion-url")
def completion_url(participant_id: str | None = None):
    participant = study_store.get_participant(participant_id) if participant_id else {}
    return {"url": _prolific_redirect_url(participant or {}, "completed")}


app.mount("/", StaticFiles(directory=str(FRONTEND), html=True), name="frontend")
