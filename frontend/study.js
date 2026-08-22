const consent = document.getElementById("studyConsent");
const startButton = document.getElementById("startStudy");
const status = document.getElementById("startStatus");
const variantSummary = document.getElementById("studyVariantSummary");
const pageParams = new URLSearchParams(location.search);
const variantId = pageParams.get("variant") || "";
const previewMode = pageParams.get("previewStudy") === "1";
let selectedVariant = null;

consent.addEventListener("change", ()=>{ startButton.disabled = !consent.checked || !selectedVariant?.ready; });
startButton.addEventListener("click", async ()=>{
  startButton.disabled = true;
  if(previewMode){
    status.textContent = "Opening the study preview...";
    const query = new URLSearchParams({previewStudy:"1", stage:"pre"});
    if(variantId) query.set("variant", variantId);
    location.href = `survey.html?${query.toString()}`;
    return;
  }
  status.textContent = "Creating your study session...";
  try{
    const params = new URLSearchParams(location.search);
    const response = await fetch("/api/study/participants", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        variant_id:variantId || null,
        prolific_pid:params.get("PROLIFIC_PID") || null,
        study_id:params.get("STUDY_ID") || null,
        session_id:params.get("SESSION_ID") || null,
      }),
    });
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const participant = await response.json();
    localStorage.setItem("policy-study-participant", participant.participant_id);
    location.href = `survey.html?stage=pre&participant=${encodeURIComponent(participant.participant_id)}`;
  }catch(error){
    status.textContent = `The study could not be started: ${error.message}`;
    startButton.disabled = false;
  }
});

async function loadVariant(){
  if(!variantId){
    startButton.disabled = true;
    status.textContent = "This study link is incomplete. Please return to Prolific and contact the researcher.";
    return;
  }
  const response = await fetch(`/api/study/variants/${encodeURIComponent(variantId)}`);
  if(!response.ok) throw new Error(`Variant HTTP ${response.status}`);
  selectedVariant = await response.json();
  variantSummary.innerHTML = `<span>${selectedVariant.domain_label} · ${selectedVariant.condition_label}</span><b>${selectedVariant.order_label}</b>`;
  variantSummary.hidden = false;
  if(previewMode){
    document.querySelector(".study-start-panel > p").textContent = "Preview mode does not create a participant session or record responses and interactions.";
    document.querySelector(".study-confirm span").textContent = "I am ready to preview the complete study flow.";
    startButton.innerHTML = 'Start preview <i data-lucide="arrow-right"></i>';
    if(window.lucide) lucide.createIcons();
  }
  if(!selectedVariant.ready){
    startButton.disabled = true;
    status.textContent = "This study condition is not currently available. Please return to Prolific and contact the researcher.";
  }else{
    startButton.disabled = !consent.checked;
  }
}

loadVariant().catch(error=>{
  startButton.disabled = true;
  status.textContent = "This study link could not be loaded. Please return to Prolific and contact the researcher.";
});

if(window.lucide) lucide.createIcons();
