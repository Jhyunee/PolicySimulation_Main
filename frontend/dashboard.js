const dashboardParams = new URLSearchParams(location.search);
const participantId = dashboardParams.get("participant") || "";
const dashboardPreview = dashboardParams.get("preview") === "1";
const assignedParam = dashboardParams.get("policies") || "";
const orderParam = dashboardParams.get("order") || "";
let serverAssignment = null;
let serverTrials = [];
let serverCompleted = new Set();
let serverIntroduced = new Set();

function dashboardEsc(value){
  return String(value ?? "").replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}
function completionKey(policyKey){ return `pathway-complete:${participantId || "local"}:${policyKey}`; }
function isComplete(policyKey){
  return serverCompleted.has(policyKey) || localStorage.getItem(completionKey(policyKey)) === "1";
}
function assignedKeys(allPolicies){
  const aliases = Object.fromEntries(allPolicies.flatMap(policy=>[
    [policy.key, policy.key],
    [policy.short_label.toLowerCase(), policy.key],
    [policy.key.split("/").pop(), policy.key],
  ]));
  const requested = assignedParam.split(",").map(item=>aliases[item.trim().toLowerCase()] || aliases[item.trim()]).filter(Boolean);
  const base = serverAssignment?.length
    ? serverAssignment
    : requested.length ? [...new Set(requested)]
    : dashboardPreview ? allPolicies.map(policy=>policy.key) : [];
  const order = orderParam.split(",").map(item=>aliases[item.trim().toLowerCase()] || aliases[item.trim()]).filter(Boolean);
  return order.length ? [...order.filter(key=>base.includes(key)), ...base.filter(key=>!order.includes(key))] : base;
}
function policyLink(policyKey, policyIndex){
  const introduced = serverIntroduced.has(policyKey);
  const trial = serverTrials.find(item=>item.policy_key === policyKey);
  const query = new URLSearchParams({policy:policyKey});
  if(participantId) query.set("participant", participantId);
  query.set("policyIndex", String(policyIndex));
  if(!introduced) query.set("stage", "policy_intro");
  if(!introduced) return `survey.html?${query.toString()}`;
  return `${trial?.condition === "baseline" ? "baseline_report.html" : "pathway_tree.html"}?${query.toString()}`;
}
function renderDashboard(policies){
  const keys = assignedKeys(policies);
  const byKey = new Map(policies.map(policy=>[policy.key, policy]));
  const assigned = keys.map(key=>byKey.get(key)).filter(policy=>policy?.available);
  const completed = assigned.filter(policy=>isComplete(policy.key)).length;
  document.getElementById("assignmentProgress").innerHTML = `<strong>${completed}/${assigned.length}</strong><span>cases completed</span>`;
  document.getElementById("policyCards").innerHTML = assigned.map((policy, index)=>{
    const done = isComplete(policy.key);
    const locked = index > 0 && !isComplete(assigned[index - 1].key);
    const details = [["Case","Policy analysis"],["Focus","Effects and constraints"],["Task","Review and assess"]];
    return `<article class="policy-choice-card ${done ? "complete" : ""} ${locked ? "locked" : ""}">
      <div class="policy-card-index">${String(index + 1).padStart(2,"0")}</div>
      <div class="policy-card-main">
        <div class="policy-card-kicker"><span>${dashboardEsc(policy.short_label)}</span>${done ? `<em><i data-lucide="check"></i>Explored</em>` : ""}</div>
        <h2>${dashboardEsc(policy.label)}</h2>
        <p>${dashboardEsc(policy.description)}</p>
        <dl>${details.map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}</dl>
      </div>
      ${locked
        ? `<span class="policy-open-link locked" aria-label="Complete the previous policy first"><i data-lucide="lock"></i></span>`
        : `<a class="policy-open-link" href="${policyLink(policy.key, index)}" aria-label="Open ${dashboardEsc(policy.label)}"><i data-lucide="arrow-right"></i></a>`}
    </article>`;
  }).join("") || `<div class="dashboard-loading">No assigned policy is available.</div>`;
  const finalCta = document.getElementById("finalSurveyCta");
  if(completed === assigned.length && assigned.length){
    finalCta.hidden = false;
    finalCta.innerHTML = `<div><span>Final step · RQ2, RQ3, and RQ4</span><h2>Complete the post-study questionnaire</h2><p>Reflect on both policy cases, overall branching usefulness, trust, stakeholder interaction, and practical limitations.</p></div>
      <a href="survey.html?stage=post&participant=${encodeURIComponent(participantId)}">Continue <i data-lucide="arrow-right"></i></a>`;
  }else{
    finalCta.hidden = true;
  }
  if(window.lucide) lucide.createIcons();
}

if(!participantId && !dashboardPreview){
  location.replace("study.html");
}else if(participantId){
  const badge = document.getElementById("participantBadge");
  if(badge){
    badge.hidden = false;
    badge.textContent = participantId;
  }
}
if(dashboardParams.get("completed")){
  localStorage.setItem(completionKey(dashboardParams.get("completed")), "1");
}

const assignmentRequest = participantId
  ? fetch(`/api/study/participants/${encodeURIComponent(participantId)}`)
      .then(response=>response.ok ? response.json() : Promise.reject(new Error(`Participant HTTP ${response.status}`)))
  : Promise.resolve(null);

Promise.all([
  fetch("/api/pathway/policies").then(response=>response.ok ? response.json() : Promise.reject(new Error(`Policies HTTP ${response.status}`))),
  assignmentRequest,
])
  .then(([payload, participant])=>{
    if(participant && !participant.pre_study_completed){
      location.href = `survey.html?stage=pre&participant=${encodeURIComponent(participantId)}`;
      return;
    }
    serverAssignment = participant?.assigned_policies || null;
    serverTrials = participant?.assigned_trials || [];
    serverCompleted = new Set(participant?.completed_policies || []);
    serverIntroduced = new Set(participant?.introduced_policies || []);
    if(window.StudyProgress && participant){
      StudyProgress.setStage(Math.min(4, 2 + serverCompleted.size));
    }
    PolicyStudy.event("dashboard_view", {assigned_policies:serverAssignment || [], assigned_trials:serverTrials});
    renderDashboard(payload.policies || []);
  })
  .catch(error=>{
    document.getElementById("policyCards").innerHTML = `<div class="dashboard-loading">Failed to load policies: ${dashboardEsc(error.message)}</div>`;
  });
if(window.lucide) lucide.createIcons();
