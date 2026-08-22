const featureParams = new URLSearchParams(location.search);
const featureParticipantId = featureParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const featureVariantId = featureParams.get("variant") || "";
const featurePreviewMode = featureParams.get("previewStudy") === "1";
const featureGuideStatus = document.getElementById("featureGuideStatus");
const continueFeatureGuide = document.getElementById("continueFeatureGuide");
let featureGuideCondition = "framework";

function normalizeFeatureCondition(value){
  return ["framework", "full"].includes(String(value || "").toLowerCase()) ? "framework" : "baseline";
}

async function validateFeatureGuideSession(){
  let response;
  if(featurePreviewMode){
    if(!featureVariantId) throw new Error("A study variant is required for preview.");
    response = await fetch(`/api/study/variants/${encodeURIComponent(featureVariantId)}`);
  }else{
    if(!featureParticipantId) throw new Error("A participant session could not be found.");
    response = await fetch(`/api/study/participants/${encodeURIComponent(featureParticipantId)}`);
  }
  if(!response.ok) throw new Error(`Study session HTTP ${response.status}`);
  const payload = await response.json();
  featureGuideCondition = normalizeFeatureCondition(payload.condition || payload.condition_name || payload.assigned_conditions?.[0]);
  document.body.dataset.condition = featureGuideCondition;
  document.getElementById("featureStepOne").textContent = featureGuideCondition === "framework" ? "04" : "01";
  document.getElementById("featureStepTwo").textContent = featureGuideCondition === "framework" ? "05" : "02";
  const footerCopy = document.querySelector(".task-instructions-footer p");
  if(featureGuideCondition === "framework"){
    footerCopy.textContent = "Try these features with illustrative example data before reviewing your assigned policy cases.";
    continueFeatureGuide.innerHTML = 'Continue to interactive practice <i data-lucide="arrow-right"></i>';
  }else{
    footerCopy.textContent = "Review these components while examining each assigned policy case.";
    continueFeatureGuide.innerHTML = 'Continue to assigned policies <i data-lucide="arrow-right"></i>';
  }
  await PolicyStudy.event("feature_instructions_viewed", {condition:featureGuideCondition});
  continueFeatureGuide.disabled = false;
  if(window.lucide) lucide.createIcons();
}

continueFeatureGuide.addEventListener("click", async ()=>{
  continueFeatureGuide.disabled = true;
  await PolicyStudy.event("feature_instructions_completed", {condition:featureGuideCondition}, PolicyStudy.pageElapsed());
  const query = new URLSearchParams();
  if(featurePreviewMode){
    query.set("previewStudy", "1");
    query.set("variant", featureVariantId);
  }else{
    query.set("participant", featureParticipantId);
  }
  if(featureGuideCondition === "framework"){
    query.set("practice", "1");
    query.set("policy", "usa/chi_ctc");
    location.href = `pathway_tree.html?${query.toString()}`;
  }else{
    location.href = `dashboard.html?${query.toString()}`;
  }
});

continueFeatureGuide.disabled = true;
validateFeatureGuideSession().catch(error=>{
  featureGuideStatus.textContent = `The feature guide could not be loaded: ${error.message}`;
});

if(window.lucide) lucide.createIcons();
