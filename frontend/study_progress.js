(function(){
  const params = new URLSearchParams(location.search);
  if(params.get("demo") === "1") return;
  const previewMode = params.get("previewStudy") === "1";
  const path = location.pathname.split("/").pop() || "study.html";
  const policyIndex = Math.max(0, Math.min(1, Number(params.get("policyIndex") || 0)));
  const participantId = path === "study.html" || previewMode
    ? ""
    : params.get("participant") || localStorage.getItem("policy-study-participant") || "";
  const stages = ["Start", "Background", "Policy case 1", "Policy case 2", "Final feedback"];
  const policyNames = {
    "usa/chi_nsa": "No Surprises Act",
    "usa/chi_ctc": "Expanded Child Tax Credit",
    "usa/chi_ccdf": "Child Care and Development Fund",
    "usa/chi_clean_vehicle": "Clean Vehicle Credit",
    "ger/chi_vg": "German Packaging Act",
    "kor/chi_kpass": "K-Pass Public Transit Subsidy",
  };

  function stageLabel(index){
    if(index !== 2 && index !== 3) return stages[index];
    const policyName = policyNames[params.get("policy") || ""];
    return policyName ? `Policy Case ${index - 1}: ${policyName}` : `Policy Case ${index - 1}`;
  }

  function inferredStage(){
    if(path === "study.html" || path === "") return 0;
    if(path === "task_instructions.html") return 0;
    if(path === "survey.html"){
      const stage = params.get("stage");
      if(stage === "pre") return 1;
      if(stage === "post" || stage === "extended") return 4;
      return 2 + policyIndex;
    }
    if(path === "toc_intro.html" && params.get("stage") === "study_intro") return 0;
    if(path === "toc_intro.html" || path === "pathway_tree.html" || path === "baseline_report.html") return 2 + policyIndex;
    if(path === "dashboard.html") return 2;
    return 0;
  }

  function render(activeStage){
    const active = Math.max(0, Math.min(stages.length - 1, Number(activeStage) || 0));
    const existing = document.getElementById("studyProgressChrome");
    const markup = `<div id="studyProgressChrome" class="study-progress-chrome">
      <header class="study-global-header">
        <a class="study-global-brand" href="${participantId ? `dashboard.html?participant=${encodeURIComponent(participantId)}` : "study.html"}">
          <i data-lucide="waypoints"></i><span>POLICY EXPLORATION STUDY</span>
        </a>
        <div class="study-global-context"><span>Current stage</span><b>${stageLabel(active)}</b></div>
        ${participantId ? `<div class="study-global-participant"><i data-lucide="user-round"></i><span>${participantId}</span></div>` : `<div class="study-global-status"><i data-lucide="${previewMode ? "eye" : "circle"}"></i><span>${previewMode ? "Preview mode" : "Study session"}</span></div>`}
      </header>
      <nav class="study-global-steps" aria-label="Study progress">
        ${stages.map((label,index)=>`<div class="study-global-step ${index === active ? "active" : ""} ${index < active ? "complete" : ""}" ${index === active ? 'aria-current="step"' : ""}><b>${String(index + 1).padStart(2,"0")}</b><span>${index === active ? stageLabel(index) : label}</span></div>`).join("")}
      </nav>
    </div>`;
    if(existing) existing.outerHTML = markup;
    else document.body.insertAdjacentHTML("afterbegin", markup);
    if(window.lucide) lucide.createIcons();
  }

  window.StudyProgress = {setStage:render, currentStage:inferredStage()};
  render(window.StudyProgress.currentStage);
})();
