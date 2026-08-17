const resultsBody = document.getElementById("resultsBody");
const refreshResults = document.getElementById("refreshResults");
let resultsData = null;
let selectedCase = "";
let selectedCondition = "";
let selectedParticipant = "";
let responseFilter = "submitted";
const ADMIN_TOKEN_KEY = "policy-study-admin-token";

function adminHeaders(){
  let token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if(!token){
    token = window.prompt("Enter the study administrator token:") || "";
    if(token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  }
  return token ? {"X-Admin-Token":token} : {};
}

const QUESTION_LABELS = {
  age_group:"Age group", gender:"Gender", education:"Highest level of education",
  current_role:"Current primary role", study_domain:"Primary field or discipline", discipline:"Primary field or discipline",
  policy_experience:"Policy-related research or practice experience",
  llm_experience:"Experience using LLM-based analysis or decision-support tools",
  simulation_experience:"Experience using policy simulation or scenario-analysis tools",
  policy_context:"Country or policy context known best", domain_experience:"Policy areas with experience", familiar_domains:"Policy areas with experience",
  policy_familiarity:"Prior familiarity with this policy", policy_complexity:"Perceived policy complexity",
  rq1_1:"The analysis included the main causal factors needed to understand policy effects.",
  rq1_2:"The causal process was understandable within the policy context.",
  rq1_3:"The analysis provided an appropriate level of detail.",
  rq1_4:"No additional assistance was needed to understand the analysis.",
  rq1_5:"The analysis clarified how the policy and broader effects could unfold over time.",
  rq1_6:"The analysis could be used together with the participant's domain knowledge.",
  rq1_7:"No contradictions were found within the explanations.",
  rq1_8:"Most people could quickly understand the causal explanation.",
  rq1_9:"No additional references were needed to understand the analysis.",
  rq1_10:"Explanations were provided efficiently and at appropriate points.",
  cl_int_1:"The policy issue was very complex.", cl_int_2:"Relationships between assumptions and outcomes were very complex.",
  cl_int_3:"Policy concepts and conditions were very complex.", cl_ext_1:"The explanations were very unclear.",
  cl_ext_2:"The explanations were ineffective for understanding outcomes.", cl_ext_3:"The explanations contained unclear language.",
  rq2b_1:"The pathways showed a sufficiently wide range of policy developments.",
  rq2b_2:"The pathways included failure or deterioration as well as success.",
  rq2b_3:"The pathways supported examination of recovery after unfavorable conditions.",
  rq2b_5:"Important conditions or developments were missing.", rq2b_missing:"Missing conditions or developments",
  rq2_1:"The tool supported faster examination of policy developments and outcomes.",
  rq2_2:"The tool improved the quality of policy analysis and review.", rq2_3:"The tool increased exploration efficiency.",
  rq2_4:"The tool enabled more effective assessment of conditions and outcomes.", rq2_5:"The tool made policy development easier to understand.",
  rq2_6:"Overall usefulness for examining and discussing policy development.",
  attention_check_1:"Attention check: select response 6 (Agree).",
  attention_check_2:"Attention check: select response 2 (Disagree).",
  rq3_trust_1:"The system generated plausible policy pathways.", rq3_trust_2:"The system provided useful and trustworthy scenario analysis.",
  rq3_trust_3:"The system operated understandably.", rq3_trust_4:"The framework could support policy discussion and judgment.",
  rq3_risk_1:"Caution about relying on results for policy judgments.", rq3_risk_2:"Some results may not sufficiently reflect policy context.",
  rq3_risk_3:"Some pathways require additional evidence or expert validation.", rq3_context_concern:"Results that did not reflect policy context",
  rq3_validation_need:"Pathways or claims requiring additional validation",
  chat_1:"Stakeholder discussion surfaced previously unconsidered concerns or constraints.",
  chat_2:"Persona chat supported exploration from a stakeholder perspective.", chat_3:"Persona responses were relevant.",
  chat_4:"Persona responses felt natural and plausible.", chat_5:"Interaction surfaced additional questions or evidence needs.",
  chat_new_considerations:"Stakeholder interaction surfaced previously unconsidered concerns, constraints, or further questions.",
  chat_perspective_fit:"Persona responses were relevant to the selected pathway and supported exploration from that stakeholder's perspective.",
  chat_feedback:"Value and limitations of stakeholder discussion or persona chat",
  extended_1:"Typical policy decision-making process", extended_2:"Stages where the interface could be useful",
  extended_3:"Stages or decisions where the interface would be inappropriate", extended_4:"Main strengths as a decision-support tool",
  extended_5:"Improvements needed for real policy use", extended_6:"Credibility of connections between predicted indicators",
  extended_7:"Naturalness and credibility of stakeholder persona statements",
  extended_8:"Opportunities and concerns of LLM-based policy tools", extended_9:"Other feedback"
};

function resultEsc(value){
  return String(value ?? "").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}
function formatDate(value){
  if(!value) return "Not submitted";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? value : date.toLocaleString();
}
function conditionLabel(value){ return ["framework","full"].includes(value) ? "Framework" : value === "baseline" ? "Baseline" : "Unknown"; }
function normalizedCondition(value){ return ["framework","full"].includes(value) ? "framework" : value === "baseline" ? "baseline" : "unknown"; }
function participantState(person){
  if(person.status === "screened_out") return {label:"Screened out",className:"screened"};
  if(person.survey_stages.includes("policy")) return {label:"Submitted",className:"done"};
  return {label:"Pending",className:"pending"};
}
function formatDuration(value){
  const milliseconds = Number(value || 0);
  if(!milliseconds) return "0m";
  const totalSeconds = Math.round(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours ? `${hours}h ${minutes}m` : minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}
function pathLabel(path){
  const labels={enabling:"E",baseline:"B",constraining:"C",optimistic:"E",neutral:"B",conservative:"C"};
  const steps=String(path || "").split("/").filter(step=>step && step!=="root");
  return steps.length ? steps.map(step=>labels[step] || step).join(" → ") : "Policy input";
}
function stageLabel(stage){
  return ({pre_study:"Background",policy_pre:"Before exploration",policy:"After exploration",post_study:"Final questionnaire",extended:"Qualitative feedback"})[stage] || stage;
}
function answerValue(value){
  if(Array.isArray(value)) return value.join(", ");
  if(value && typeof value === "object") return JSON.stringify(value,null,2);
  return String(value ?? "");
}

function renderSummary(){
  document.getElementById("resultsSummary").innerHTML = [
    [resultsData.case_count,"Policy cases"], [resultsData.participant_count,"Participants"],
    [resultsData.response_count,"Case responses"], [resultsData.completed_count,"Completed studies"],
    [resultsData.screened_out_count || 0,"Screened out"]
  ].map(([value,label])=>`<article><strong>${value}</strong><span>${label}</span></article>`).join("");
}

function caseCards(){
  if(!resultsData.cases.length) return '<div class="results-empty">No study cases have been assigned yet.</div>';
  return `<div class="results-case-grid">${resultsData.cases.map(item=>{
    const rate = item.assigned_count ? Math.round(item.response_count / item.assigned_count * 100) : 0;
    return `<button class="results-case-card" data-case="${resultEsc(item.policy_key)}" type="button">
      <header><span>${resultEsc(item.short_label)}</span><em>${rate}% responded</em></header>
      <h2>${resultEsc(item.label)}</h2><code>${resultEsc(item.policy_key)}</code>
      <div class="case-progress"><i style="width:${rate}%"></i></div>
      <dl><div><dt>Assigned</dt><dd>${item.assigned_count}</dd></div><div><dt>Responses</dt><dd>${item.response_count}</dd></div><div><dt>Framework</dt><dd>${item.framework_count}</dd></div><div><dt>Baseline</dt><dd>${item.baseline_count}</dd></div></dl>
      <footer>View participant responses <i data-lucide="arrow-right"></i></footer>
    </button>`;
  }).join("")}</div>`;
}

function participantRecord(id){ return resultsData.participants.find(item=>item.participant_id===id); }
function currentCase(){ return resultsData.cases.find(item=>item.policy_key===selectedCase); }
function caseTrial(participant){ return participant?.trials.find(item=>item.policy_key===selectedCase); }

function responseBlock(response){
  if(!response) return '<div class="results-no-response">No response submitted for this stage.</div>';
  const entries = Object.entries(response.answers || {}).filter(([key])=>key!=="policy_key");
  return `<section class="participant-response-block"><header><div><span>${stageLabel(response.survey_stage)}</span><b>${formatDate(response.submitted_at)}</b></div><em>${entries.length} answers</em></header>
    ${entries.length ? `<div class="response-answer-list">${entries.map(([key,value])=>`<article><span>${resultEsc(QUESTION_LABELS[key] || key.replaceAll("_"," "))}</span><p>${resultEsc(answerValue(value))}</p><code>${resultEsc(key)}</code></article>`).join("")}</div>` : '<div class="results-no-response">Empty response.</div>'}
  </section>`;
}

function participantDetail(participant){
  if(!participant) return '<div class="results-empty">Select a participant.</div>';
  const trial = caseTrial(participant);
  const policyResponses = trial?.survey_responses || [];
  const global = participant.global_survey_responses || [];
  const interactions = trial?.interaction_summary || {};
  const discussions = interactions.stakeholder_discussions || [];
  const chats = interactions.chat_turns || [];
  const paths = interactions.complete_paths || [];
  return `<article class="results-participant-detail">
    <header class="participant-detail-head"><div><span>Participant response</span><h2>${resultEsc(participant.participant_id)}</h2><p>${resultEsc(participant.prolific_pid || "No Prolific ID")} · ${resultEsc(participant.variant_id || "Legacy assignment")}</p></div><div class="participant-detail-badges"><em class="${trial?.condition_name || "unknown"}">${conditionLabel(trial?.condition_name)}</em><b>${resultEsc(participant.status)}</b></div></header>
    <dl class="participant-facts"><div><dt>Prolific ID</dt><dd>${resultEsc(participant.prolific_pid || "Not provided")}</dd></div><div><dt>Study ID</dt><dd>${resultEsc(participant.prolific_study_id || "Not provided")}</dd></div><div><dt>Session ID</dt><dd>${resultEsc(participant.prolific_session_id || "Not provided")}</dd></div><div><dt>Case time</dt><dd>${formatDuration(interactions.recorded_duration_ms)}</dd></div><div><dt>Total study time</dt><dd>${formatDuration(participant.recorded_duration_ms)}</dd></div><div><dt>Policy order</dt><dd>${Number(trial?.policy_order_index ?? 0)+1}</dd></div><div><dt>Case events</dt><dd>${trial?.event_count || 0}</dd></div><div><dt>Persona questions</dt><dd>${trial?.chat_count || 0}</dd></div><div><dt>Joined</dt><dd>${formatDate(participant.created_at)}</dd></div>${participant.status === "screened_out" ? `<div><dt>Screening result</dt><dd>${resultEsc(participant.screening_reason || "Ineligible")}</dd></div><div><dt>Screened out</dt><dd>${formatDate(participant.screened_out_at)}</dd></div>` : ""}</dl>
    <div class="interaction-audit-grid">
      <section class="interaction-audit-card"><header><div><span>Stakeholder discussion</span><b>${discussions.length} views · ${formatDuration(interactions.stakeholder_discussion_duration_ms)}</b></div><i data-lucide="messages-square"></i></header>
        ${discussions.length ? `<div class="interaction-records">${discussions.map(item=>`<article><strong>${resultEsc(item.phase || "Unknown phase")}</strong><span>${resultEsc(pathLabel(item.path))}</span><em>${item.duration_ms==null?"Duration unavailable":formatDuration(item.duration_ms)}</em><code>${resultEsc(item.path)}</code></article>`).join("")}</div>` : '<div class="results-no-response">No stakeholder discussion was opened.</div>'}
      </section>
      <section class="interaction-audit-card"><header><div><span>Persona conversation</span><b>${chats.length} questions</b></div><i data-lucide="message-circle"></i></header>
        ${chats.length ? `<div class="chat-audit-list">${chats.map(turn=>`<article><div><strong>${resultEsc(turn.persona_name)}</strong><span>${resultEsc(pathLabel(turn.pathway))}</span><em>${formatDuration(turn.latency_ms)}</em></div><p class="chat-question"><b>Q</b>${resultEsc(turn.question)}</p><p class="chat-answer"><b>A</b>${resultEsc(turn.answer || turn.error || "No answer recorded")}</p><code>${resultEsc(turn.pathway)}</code></article>`).join("")}</div>` : '<div class="results-no-response">No persona conversation was recorded.</div>'}
      </section>
    </div>
    ${normalizedCondition(trial?.condition_name)==="framework" ? `<section class="path-audit-section"><header><div><span>Framework pathway exploration</span><h3>${paths.length} complete pathway${paths.length===1?"":"s"}</h3></div><b>${interactions.selected_node_count || 0} unique nodes selected</b></header>
      ${paths.length ? `<div class="path-audit-list">${paths.map((path,index)=>`<article><i>${index+1}</i><div><strong>${resultEsc(pathLabel(path))}</strong><code>${resultEsc(path)}</code></div></article>`).join("")}</div>` : '<div class="results-no-response">No complete Framework pathway was recorded.</div>'}
    </section>` : ""}
    <div class="response-stage-group"><h3>Case-specific responses</h3>${["policy_pre","policy"].map(stage=>responseBlock(policyResponses.find(item=>item.survey_stage===stage))).join("")}</div>
    <div class="response-stage-group"><h3>Participant-wide responses</h3>${["pre_study","post_study","extended"].map(stage=>responseBlock(global.find(item=>item.survey_stage===stage))).join("")}</div>
  </article>`;
}

function conditionSelection(){
  const item=currentCase();
  const cards=["framework","baseline"].map(condition=>{
    const people=item.participants.filter(person=>normalizedCondition(person.condition)===condition);
    const submitted=people.filter(person=>person.survey_stages.includes("policy")).length;
    const timedPeople=people.filter(person=>Number(person.recorded_duration_ms || 0)>0);
    const totalDuration=timedPeople.reduce((sum,person)=>sum+Number(person.recorded_duration_ms || 0),0);
    const averageDuration=timedPeople.length ? totalDuration/timedPeople.length : 0;
    const chats=people.reduce((sum,person)=>sum+Number(person.chat_count || 0),0);
    const discussions=people.reduce((sum,person)=>sum+Number(person.stakeholder_discussion_count || 0),0);
    const paths=people.reduce((sum,person)=>sum+Number(person.complete_path_count || 0),0);
    const screenedOut=people.filter(person=>person.status === "screened_out").length;
    return `<button class="condition-result-card ${condition}" type="button" data-condition="${condition}">
      <header><span>${conditionLabel(condition)}</span><i data-lucide="${condition==="framework"?"git-branch":"file-text"}"></i></header>
      <h2>${condition==="framework"?"Branching pathway interface":"Baseline policy analysis"}</h2>
      <p>${condition==="framework"?"Responses and interactions from the exploratory EBC pathway condition.":"Responses and interactions from the single-path baseline condition."}</p>
      <dl><div><dt>Assigned</dt><dd>${people.length}</dd></div><div><dt>Submitted</dt><dd>${submitted}</dd></div><div><dt>Screened out</dt><dd>${screenedOut}</dd></div><div><dt>Avg. time</dt><dd>${formatDuration(averageDuration)}</dd></div><div><dt>Chats</dt><dd>${chats}</dd></div><div><dt>Discussions</dt><dd>${discussions}</dd></div><div><dt>Paths</dt><dd>${paths}</dd></div></dl>
      <footer>View ${conditionLabel(condition)} participants <i data-lucide="arrow-right"></i></footer>
    </button>`;
  }).join("");
  return `<div class="results-condition-view"><header class="case-view-head"><button type="button" data-back-cases><i data-lucide="arrow-left"></i> All cases</button><div><span>${resultEsc(item.short_label)}</span><h1>${resultEsc(item.label)}</h1><p>Select a study condition to review participant results.</p></div></header><div class="condition-result-grid">${cards}</div></div>`;
}

function caseDetail(){
  const item = currentCase();
  const conditionPeople = item.participants.filter(person=>normalizedCondition(person.condition)===selectedCondition);
  let people = conditionPeople;
  if(responseFilter==="submitted") people = people.filter(person=>person.survey_stages.includes("policy"));
  if(responseFilter==="pending") people = people.filter(person=>person.status !== "screened_out" && !person.survey_stages.includes("policy"));
  if(responseFilter==="screened_out") people = people.filter(person=>person.status === "screened_out");
  if(!selectedParticipant || !people.some(person=>person.participant_id===selectedParticipant)) selectedParticipant = people[0]?.participant_id || "";
  const participant = participantRecord(selectedParticipant);
  const conditionResponses=conditionPeople.filter(person=>person.survey_stages.includes("policy")).length;
  return `<div class="results-case-view">
    <header class="case-view-head"><button type="button" data-back-conditions><i data-lucide="arrow-left"></i> Conditions</button><div><span>${resultEsc(item.short_label)} · ${conditionLabel(selectedCondition)}</span><h1>${resultEsc(item.label)}</h1><p>${conditionResponses} responses from ${conditionPeople.length} ${conditionLabel(selectedCondition)} participants</p></div>
      <select id="responseFilter" aria-label="Filter participants"><option value="all" ${responseFilter==="all"?"selected":""}>All participants</option><option value="submitted" ${responseFilter==="submitted"?"selected":""}>Submitted only</option><option value="pending" ${responseFilter==="pending"?"selected":""}>Pending only</option><option value="screened_out" ${responseFilter==="screened_out"?"selected":""}>Screened out only</option></select></header>
    <div class="results-participant-layout"><aside class="results-participant-list">${people.length ? people.map(person=>{const state=participantState(person);return `<button type="button" data-participant="${resultEsc(person.participant_id)}" class="${person.participant_id===selectedParticipant?"active":""}"><span class="result-status ${state.className}"></span><div><b>${resultEsc(person.participant_id)}</b><small>${conditionLabel(person.condition)} · ${state.label}</small></div><time>${formatDate(person.submitted_at)}</time></button>`;}).join("") : '<div class="results-empty">No participants match this filter.</div>'}</aside>
      <div>${participantDetail(participant)}</div></div>
  </div>`;
}

function render(){
  resultsBody.innerHTML = selectedCase ? (selectedCondition ? caseDetail() : conditionSelection()) : caseCards();
  resultsBody.querySelectorAll("[data-case]").forEach(button=>button.onclick=()=>{selectedCase=button.dataset.case;selectedCondition="";selectedParticipant="";render();});
  resultsBody.querySelectorAll("[data-condition]").forEach(button=>button.onclick=()=>{selectedCondition=button.dataset.condition;selectedParticipant="";responseFilter="submitted";render();});
  resultsBody.querySelector("[data-back-cases]")?.addEventListener("click",()=>{selectedCase="";selectedCondition="";selectedParticipant="";render();});
  resultsBody.querySelector("[data-back-conditions]")?.addEventListener("click",()=>{selectedCondition="";selectedParticipant="";render();});
  resultsBody.querySelectorAll("[data-participant]").forEach(button=>button.onclick=()=>{selectedParticipant=button.dataset.participant;render();});
  resultsBody.querySelector("#responseFilter")?.addEventListener("change",event=>{responseFilter=event.target.value;selectedParticipant="";render();});
  if(window.lucide) lucide.createIcons();
}

async function loadResults(){
  refreshResults.disabled=true;
  try{
    const response=await fetch(`/api/study/results?t=${Date.now()}`,{cache:"no-store",headers:adminHeaders()});
    if(response.status === 401){ sessionStorage.removeItem(ADMIN_TOKEN_KEY); throw new Error("Administrator token was not accepted."); }
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    resultsData=await response.json(); renderSummary(); render();
  }catch(error){ resultsBody.innerHTML=`<div class="results-empty">Failed to load results: ${resultEsc(error.message)}</div>`; }
  finally{ refreshResults.disabled=false; }
}
refreshResults.addEventListener("click",loadResults);
document.getElementById("exportResults").addEventListener("click",()=>{
  if(!resultsData) return;
  const link=document.createElement("a");
  link.href=URL.createObjectURL(new Blob([JSON.stringify(resultsData,null,2)],{type:"application/json"}));
  link.download=`policy_study_results_${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href);
});
loadResults(); if(window.lucide) lucide.createIcons();
