const taskParams = new URLSearchParams(location.search);
const taskParticipantId = taskParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const taskVariantId = taskParams.get("variant") || "";
const taskPreviewMode = taskParams.get("previewStudy") === "1";
const taskStatus = document.getElementById("taskStatus");
const continueTask = document.getElementById("continueTask");

function normalizeCondition(value){
  return ["framework", "full"].includes(String(value || "").toLowerCase()) ? "framework" : "baseline";
}

function stepMarkup(items){
  return items.map((item,index)=>`<li><b>${String(index + 1).padStart(2,"0")}</b><div><strong>${item.title}</strong><span>${item.detail}</span></div></li>`).join("");
}

function renderTask(condition){
  const framework = condition === "framework";
  document.body.dataset.condition = condition;
  document.getElementById("taskModeLabel").textContent = framework ? "Exploring policy pathways" : "Reviewing a policy development";
  document.getElementById("taskModeTitle").textContent = framework ? "Explore and compare at least two complete policy pathways" : "Examine the complete pathway presented";
  const taskTermCopy = document.getElementById("taskTermCopy");
  taskTermCopy.hidden = !framework;
  taskTermCopy.textContent = framework
    ? "At each phase, select one of three branch conditions: Enabling, Baseline, or Constraining. The full sequence of selections from Inputs through Impact forms one complete policy pathway."
    : "";
  document.getElementById("taskFeatureCopy").textContent = framework
    ? "After completing a policy pathway through Impact, its Final Report becomes available. You can then ask a stakeholder persona questions; the persona responds from the perspective represented in that completed policy pathway."
    : "After reviewing the presented pathway through Impact, its Final Report becomes available. You can then ask a stakeholder persona questions; the persona responds from the perspective represented in that pathway.";
  const items = framework ? [
    {title:"Complete two distinct policy pathways", detail:"At each phase, select a branch condition and continue through Impact. Complete this process twice using different combinations of branch conditions."},
    {title:"Review stakeholder discussion", detail:"Each node includes a stakeholder discussion. Open the discussion for at least one node to examine the perspectives represented there."},
    {title:"Read both Final Reports", detail:"Review the Final Report for each of the two policy pathways you complete."},
    {title:"Ask a stakeholder a question", detail:"On a completed policy pathway, select a stakeholder persona whose responses reflect the position represented by that policy pathway, and ask at least one question."},
    {title:"Compare before continuing", detail:"Consider how the policy pathways differ in their development, constraints, and outcomes before finishing the case."},
  ] : [
    {title:"Review the complete pathway", detail:"Follow the presented analysis from Inputs through the Impact phase."},
    {title:"Review stakeholder discussion", detail:"Each node includes a stakeholder discussion. Open the discussion for at least one node to examine the perspectives represented there."},
    {title:"Read the Final Report", detail:"Review the report available after reaching the end of the pathway."},
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
  const query = new URLSearchParams({stage:"pre"});
  if(taskPreviewMode){
    query.set("previewStudy","1");
    query.set("variant",taskVariantId);
  }else{
    query.set("participant",taskParticipantId);
  }
  location.href = `survey.html?${query.toString()}`;
});

continueTask.disabled = true;
loadTaskCondition().catch(error=>{
  taskStatus.textContent = `The task instructions could not be loaded: ${error.message}`;
});

if(window.lucide) lucide.createIcons();
