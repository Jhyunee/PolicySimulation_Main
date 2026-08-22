const taskParams = new URLSearchParams(location.search);
const taskParticipantId = taskParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const taskVariantId = taskParams.get("variant") || "";
const taskPreviewMode = taskParams.get("previewStudy") === "1";
const taskStatus = document.getElementById("taskStatus");
const continueTask = document.getElementById("continueTask");

function normalizeCondition(value){
  const condition = String(value || "").toLowerCase();
  if(["framework", "full"].includes(condition)) return "framework";
  return condition === "3path" ? "3path" : "baseline";
}

function conditionLegendMarkup(){
  return `<div class="task-condition-legend task-step-condition-legend" aria-label="Development condition definitions">
    <span class="enabling"><b>Enabling</b> Positive development and recovery from bottlenecks</span>
    <span class="baseline"><b>Baseline</b> Continuation under typical conditions</span>
    <span class="constraining"><b>Constraining</b> Intensified bottlenecks and potential failure to meet policy goals</span>
  </div>`;
}

function stepMarkup(items){
  return items.map((item,index)=>`<li><b>${String(index + 1).padStart(2,"0")}</b><div><strong>${item.title}</strong><span>${item.detail}</span>${item.legend ? conditionLegendMarkup() : ""}${item.note ? `<span class="task-step-note"><b aria-hidden="true">→</b>${item.note}</span>` : ""}</div></li>`).join("");
}

function renderTask(condition){
  const framework = condition === "framework";
  const threePath = condition === "3path";
  const exploratory = framework || threePath;
  document.body.dataset.condition = condition;
  document.getElementById("taskModeHeader").hidden = exploratory;
  document.getElementById("taskTitle").hidden = !exploratory;
  document.getElementById("taskModeLabel").textContent = framework ? "Exploring policy pathways" : threePath ? "Comparing fixed policy pathways" : "Reviewing a policy development";
  document.getElementById("taskModeTitle").textContent = framework ? "Explore how a policy unfolds under different conditions" : threePath ? "Compare three policy developments under consistent conditions" : "Examine the complete pathway presented";
  const taskTermCopy = document.getElementById("taskTermCopy");
  taskTermCopy.hidden = true;
  taskTermCopy.textContent = "";
  document.getElementById("taskFrameworkGuide").hidden = !framework;
  continueTask.innerHTML = exploratory
    ? 'Continue <i data-lucide="arrow-right"></i>'
    : 'Continue to assigned policies <i data-lucide="arrow-right"></i>';
  const items = framework ? [
    {title:"Choose how the policy develops", detail:"At each phase, select an Enabling, Baseline, or Constraining development condition."},
    {title:"Build a pathway to Impact", detail:"Continue the selected development through Impact and review its projected effects."},
    {title:"Explore different pathways", detail:"Repeat the process to examine how the policy unfolds under different conditions."},
  ] : threePath ? [
    {title:"Compare three different developments", detail:"Review Enabling-only, Baseline-only, and Constraining-only pathways presented side by side.", legend:true},
    {title:"Follow each pathway to Impact", detail:"Trace how each condition continues from Inputs through Activities, Outputs, Outcomes, and Impact."},
    {title:"Review and compare results", detail:"Open at least two Impact reports, examine stakeholder perspectives, and compare projected effects."},
  ] : [
    {title:"Review the complete pathway", detail:"Follow the presented analysis from Inputs through the Impact phase."},
    {title:"Review stakeholder discussion", detail:"Each node includes a stakeholder discussion. Open the discussion for at least one node to examine the perspectives represented there."},
    {title:"Ask a stakeholder a question", detail:"Select a stakeholder persona whose responses reflect the position represented by the presented pathway, and ask at least one question."},
    {title:"Complete your review", detail:"Consider the policy development, constraints, and outcomes before finishing the case."},
  ];
  document.getElementById("taskSteps").innerHTML = stepMarkup(items);
  if(window.lucide) lucide.createIcons();
}

async function loadTaskCondition(){
  let payload;
  if(taskPreviewMode){
    if(!taskVariantId) throw new Error("A study variant is required for preview.");
    const response = await fetch(`/api/study/variants/${encodeURIComponent(taskVariantId)}`);
    if(!response.ok) throw new Error(`Variant HTTP ${response.status}`);
    payload = await response.json();
  }else{
    if(!taskParticipantId) throw new Error("A participant session could not be found.");
    const response = await fetch(`/api/study/participants/${encodeURIComponent(taskParticipantId)}`);
    if(!response.ok) throw new Error(`Participant HTTP ${response.status}`);
    payload = await response.json();
  }
  const condition = normalizeCondition(payload.condition || payload.condition_name || payload.assigned_conditions?.[0]);
  renderTask(condition);
  await PolicyStudy.event("task_instructions_viewed", {condition});
  continueTask.disabled = false;
  return condition;
}

continueTask.addEventListener("click", async ()=>{
  continueTask.disabled = true;
  const condition = document.body.dataset.condition || "baseline";
  await PolicyStudy.event("task_instructions_completed", {condition}, PolicyStudy.pageElapsed());
  const query = new URLSearchParams();
  if(taskPreviewMode){
    query.set("previewStudy","1");
    query.set("variant",taskVariantId);
  }else{
    query.set("participant",taskParticipantId);
  }
  const nextPage = ["framework","3path"].includes(condition) ? "feature_instructions.html" : "dashboard.html";
  location.href = `${nextPage}?${query.toString()}`;
});

continueTask.disabled = true;
loadTaskCondition().catch(error=>{
  taskStatus.textContent = `The task instructions could not be loaded: ${error.message}`;
});

if(window.lucide) lucide.createIcons();
