const featureParams = new URLSearchParams(location.search);
const featureParticipantId = featureParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const featureVariantId = featureParams.get("variant") || "";
const featurePreviewMode = featureParams.get("previewStudy") === "1";
const featureGuideStatus = document.getElementById("featureGuideStatus");
const continueFeatureGuide = document.getElementById("continueFeatureGuide");

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
  const condition = String(payload.condition || payload.condition_name || payload.assigned_conditions?.[0] || "").toLowerCase();
  if(!["framework", "full"].includes(condition)) throw new Error("This guide is available for the pathway exploration condition.");
  await PolicyStudy.event("feature_instructions_viewed", {condition:"framework"});
  continueFeatureGuide.disabled = false;
}

continueFeatureGuide.addEventListener("click", async ()=>{
  continueFeatureGuide.disabled = true;
  await PolicyStudy.event("feature_instructions_completed", {condition:"framework"}, PolicyStudy.pageElapsed());
  const query = new URLSearchParams();
  if(featurePreviewMode){
    query.set("previewStudy", "1");
    query.set("variant", featureVariantId);
  }else{
    query.set("participant", featureParticipantId);
  }
  query.set("practice", "1");
  query.set("policy", "usa/chi_ctc");
  location.href = `pathway_tree.html?${query.toString()}`;
});

continueFeatureGuide.disabled = true;
validateFeatureGuideSession().catch(error=>{
  featureGuideStatus.textContent = `The feature guide could not be loaded: ${error.message}`;
});

if(window.lucide) lucide.createIcons();
