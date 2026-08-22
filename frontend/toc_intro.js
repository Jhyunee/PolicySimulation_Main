const tocParams = new URLSearchParams(location.search);
const tocParticipantId = tocParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const tocPolicyKey = tocParams.get("policy") || "";
const tocPolicyIndex = Math.max(0, Math.min(1, Number(tocParams.get("policyIndex") || 0)));
const tocPreviewMode = tocParams.get("previewStudy") === "1";
const tocVariantId = tocParams.get("variant") || "";
const tocStudyIntro = tocParams.get("stage") === "study_intro";
const tocStatus = document.getElementById("tocIntroStatus");
const tocContinue = document.getElementById("continueToAnalysis");
let tocCondition = "baseline";

function normalizedTocCondition(value){
  return ["framework", "full"].includes(String(value || "").toLowerCase()) ? "framework" : "baseline";
}

function frameworkGuideKey(){
  return `policy-framework-guide:${tocParticipantId || tocVariantId || "preview"}`;
}

function baselineGuideKey(){
  return `policy-baseline-guide:${tocParticipantId || tocVariantId || "preview"}`;
}

function analysisHref(){
  if(tocStudyIntro){
    const query = new URLSearchParams();
    if(tocParticipantId) query.set("participant",tocParticipantId);
    if(tocPreviewMode) query.set("previewStudy","1");
    if(tocVariantId) query.set("variant",tocVariantId);
    const nextPage = tocCondition === "framework" ? "task_instructions.html" : "feature_instructions.html";
    return `${nextPage}?${query.toString()}`;
  }
  const query = new URLSearchParams({policy:tocPolicyKey, policyIndex:String(tocPolicyIndex)});
  if(tocParticipantId) query.set("participant", tocParticipantId);
  if(tocPreviewMode) query.set("previewStudy", "1");
  if(tocVariantId) query.set("variant", tocVariantId);
  const guideKey = tocCondition === "framework" ? frameworkGuideKey() : baselineGuideKey();
  if(localStorage.getItem(guideKey) !== "1") query.set("guide", "1");
  const page = tocCondition === "framework" ? "pathway_tree.html" : "baseline_report.html";
  return `${page}?${query.toString()}`;
}

async function loadTocIntro(){
  if((!tocStudyIntro && !tocPolicyKey) || (!tocParticipantId && !tocPreviewMode)) throw new Error("A policy case and study session are required.");
  const policyRequest = tocStudyIntro ? Promise.resolve(null) : fetch("/api/pathway/policies").then(response=>{
    if(!response.ok) throw new Error(`Policies HTTP ${response.status}`);
    return response.json();
  });
  const assignmentRequest = tocPreviewMode
    ? fetch(`/api/study/variants/${encodeURIComponent(tocVariantId)}`).then(response=>{
        if(!response.ok) throw new Error(`Variant HTTP ${response.status}`);
        return response.json();
      })
    : fetch(`/api/study/participants/${encodeURIComponent(tocParticipantId)}`).then(response=>{
        if(!response.ok) throw new Error(`Participant HTTP ${response.status}`);
        return response.json();
      });
  const [policyPayload, assignment] = await Promise.all([policyRequest, assignmentRequest]);
  const policy = tocStudyIntro ? null : (policyPayload.policies || []).find(item=>item.key === tocPolicyKey);
  if(!tocStudyIntro && !policy) throw new Error("The assigned policy could not be found.");
  const trial = tocStudyIntro ? assignment.assigned_trials?.[0] : assignment.assigned_trials?.find(item=>item.policy_key === tocPolicyKey);
  tocCondition = normalizedTocCondition(trial?.condition || assignment.condition || assignment.condition_name);
  const tocCaseLabel = document.getElementById("tocCaseLabel");
  tocCaseLabel.hidden = tocStudyIntro;
  tocCaseLabel.textContent = tocStudyIntro ? "" : `Policy case ${tocPolicyIndex + 1} · Before the analysis`;
  document.getElementById("tocFooterLabel").textContent = tocStudyIntro ? "Next" : "Policy case";
  document.getElementById("tocPolicyName").textContent = tocStudyIntro ? "Policy Exploration Task Guide" : policy.label;
  tocContinue.innerHTML = tocStudyIntro
    ? `Continue to ${tocCondition === "framework" ? "task guide" : "key components"} <i data-lucide="arrow-right"></i>`
    : 'Continue to policy analysis <i data-lucide="arrow-right"></i>';
  document.getElementById("tocConditionCopy").textContent = tocCondition === "framework"
    ? (tocStudyIntro ? "The next guide explains how to select development conditions and explore multiple policy pathways." : "The next screen lets you select alternative developments at each phase.")
    : "The next screen presents one policy development across the same five phases so that you can review its conditions, explanations, and projected effects.";
  tocContinue.disabled = false;
  await PolicyStudy.event("toc_introduction_viewed", {condition:tocCondition, policy_index:tocStudyIntro ? null : tocPolicyIndex, scope:tocStudyIntro ? "study" : "policy"});
  if(window.lucide) lucide.createIcons();
}

tocContinue.addEventListener("click", async ()=>{
  tocContinue.disabled = true;
  await PolicyStudy.event("toc_introduction_completed", {condition:tocCondition, policy_index:tocStudyIntro ? null : tocPolicyIndex, scope:tocStudyIntro ? "study" : "policy"}, PolicyStudy.pageElapsed());
  location.href = analysisHref();
});

loadTocIntro().catch(error=>{
  tocStatus.textContent = `The Theory of Change introduction could not be loaded: ${error.message}`;
});

if(window.lucide) lucide.createIcons();
