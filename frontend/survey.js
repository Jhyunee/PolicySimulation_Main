const surveyParams = new URLSearchParams(location.search);
const previewMode = surveyParams.get("previewStudy") === "1";
const previewVariantId = surveyParams.get("variant") || "";
const participantId = surveyParams.get("participant") || localStorage.getItem("policy-study-participant") || "";
const policyKey = surveyParams.get("policy") || "";
const requestedStage = surveyParams.get("stage");
const stage = requestedStage === "pre" ? "pre_study" : requestedStage === "policy_intro" ? "policy_pre" : requestedStage === "extended" ? "extended" : requestedStage === "post" ? "post_study" : "policy";
const policyIndex = Number(surveyParams.get("policyIndex") || 0);

/* ── 응답 척도 (원논문 준수) ────────────────────────────────────────────────
   likert5   SCS(Holzinger 2020) · Coverage · Trust · Chat
   likert7   TAM Perceived Usefulness (Davis 1989 원문 granularity)
   load11    인지부하 (Leppink 2013 원문 0–10. 논문이 7개 미만 범주를 경고)      */
const anchors = ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"];
const anchors7 = ["Strongly disagree", "Disagree", "Somewhat disagree", "Neither agree nor disagree", "Somewhat agree", "Agree", "Strongly agree"];
const LOAD_INSTRUCTION = "For the following six statements, please respond on a scale from 0 (not at all the case) to 10 (completely the case).";

/* ── 조건 ──────────────────────────────────────────────────────────────────
   between-subjects. 참가자는 baseline 또는 framework 한 조건만 경험한다.
   조건 전용 섹션: rq2b_coverage(RQ2) · rq4_chat(RQ4)                       */
let studyCondition = "framework";
function isFramework(){ return studyCondition !== "baseline"; }
function forCondition(section){
  const allowed = section.conditions;
  return !allowed || allowed.includes(isFramework() ? "framework" : "baseline");
}

let loadedParticipant = null;
let previewParticipant = {
  participant_id:"preview",
  assigned_policies:["usa/chi_nsa","usa/chi_ctc"],
  assigned_trials:[
    {policy_key:"usa/chi_nsa",condition:"baseline"},
    {policy_key:"usa/chi_ctc",condition:"full"},
  ],
  introduced_policies:["usa/chi_nsa","usa/chi_ctc"],
  completed_policies:[],
  pre_study_completed:true,
  post_study_completed:true,
};

function previewHref(stageName, nextPolicyKey="", nextPolicyIndex=0){
  const query = new URLSearchParams({previewStudy:"1",stage:stageName});
  if(previewVariantId) query.set("variant",previewVariantId);
  if(nextPolicyKey){
    query.set("policy",nextPolicyKey);
    query.set("policyIndex",String(nextPolicyIndex));
  }
  return `survey.html?${query.toString()}`;
}

function policyAnalysisHref(nextPolicyKey, nextPolicyIndex){
  const query = new URLSearchParams({policy:nextPolicyKey, policyIndex:String(nextPolicyIndex)});
  if(previewMode){
    query.set("previewStudy","1");
    if(previewVariantId) query.set("variant",previewVariantId);
  }else{
    query.set("participant",participantId);
  }
  const framework = isFramework();
  const guideOwner = previewMode ? (previewVariantId || "preview") : participantId;
  const guideKey = framework ? `policy-framework-guide:${guideOwner}` : `policy-baseline-guide:${guideOwner}`;
  if(localStorage.getItem(guideKey) !== "1") query.set("guide","1");
  return `${framework ? "pathway_tree.html" : "baseline_report.html"}?${query.toString()}`;
}

function finishPreview(){
  document.querySelector(".survey-hero").innerHTML = '<span>Preview complete</span><h1>Interface review finished.</h1><p>No responses or interaction data were recorded.</p>';
  document.getElementById("studySurvey").innerHTML = '<section class="survey-section survey-complete"><i data-lucide="check-circle-2"></i><h2>Preview complete</h2><p>You may return to the study start page and begin another review.</p><a class="link-btn" href="study.html">Return to study home</a></section>';
  if(window.lucide) lucide.createIcons();
  window.scrollTo({top:0,behavior:"smooth"});
}

const allStudySections = [
  {
    title:"Understanding the policy's causal development",
    items:[
      ["rq1_1","The analysis included the main causal factors needed to understand the policy effects, such as resources, actions, intermediate results, and longer-term outcomes."],
      ["rq1_2","I could understand the causal process described by the analysis within the context of this policy."],
      ["rq1_3","The analysis provided an appropriate level of detail for understanding the policy's development."],
      ["rq1_4","I did not need additional assistance to understand the policy analysis."],
      ["rq1_5","The analysis helped me understand how the policy and its broader effects could unfold over time."],
      ["rq1_6","I could use the analysis together with my own knowledge of the policy domain."],
      ["rq1_7","I did not find contradictions within the explanations provided."],
      ["rq1_8","I think most people would be able to quickly understand the causal explanation presented in this analysis."],
      ["rq1_9","I did not feel that I needed additional references or supporting materials to understand the analysis."],
      ["rq1_10","The explanations needed to understand the policy's causal development were provided efficiently and at appropriate points."]
    ]
  },
  {
    // RQ3a — Perceived Usefulness (Davis 1989). 조건 중립화하여 양 조건 공통.
    // 참조 대상이 "이 도구·시스템"이므로 Trust·extended와 함께 RQ3에 속한다.
    title:"Usefulness of the policy analysis tool",
    scale:anchors7,
    items:[
      ["rq2_1","This tool helped me examine possible policy developments and outcomes more quickly."],
      ["rq2_2","This tool improved the quality of my analysis and review of the policy's development."],
      ["rq2_3","This tool increased my efficiency in examining the policy's development and the conditions affecting it."],
      ["attention_check_1","This is an attention check. Please select response 6 (Agree)."],
      ["rq2_4","This tool enabled me to assess the conditions and outcomes of the policy's development more effectively."],
      ["rq2_5","This tool made it easier to understand how the policy could unfold."],
      ["rq2_6","Overall, I found this tool useful for examining and discussing the policy's development."]
    ]
  },
  {
    title:"Trustworthiness, reliance, and verification",
    items:[
      ["rq3_trust_1","The system was able to generate plausible policy pathways."],
      ["rq3_trust_2","The system provided useful and trustworthy analysis for exploring policy scenarios."],
      ["rq3_trust_3","The system operated in an understandable way while presenting policy developments and alternatives."],
      ["rq3_trust_4","I felt that I could use this framework to support policy discussion and judgment."],
      ["rq3_risk_1","I would be cautious about relying on this framework's results when making policy judgments."],
      ["attention_check_2","This is an attention check. Please select response 2 (Disagree)."],
      ["rq3_risk_2","Some results made me question whether the framework sufficiently reflected the policy context."],
      ["rq3_risk_3","I felt that some policy pathways would require validation using additional evidence or expert review before being used in policy discussion."]
    ],
    text:[
      ["rq3_trust_verification","What aspects of the analysis increased or reduced your confidence in using this tool to support policy discussion or judgment? What, if anything, would you want to verify before relying on its results?","Describe the specific result, explanation, evidence, context, or expert review that shaped your confidence. If there is nothing you would verify, state that explicitly.",true]
    ]
  },
  {
    title:"Stakeholder discussion and persona chat",
    conditions:["framework"],
    items:[
      // 5 → 3. chat_1+chat_5 both asked what the interaction newly surfaced;
      // chat_2+chat_3 both asked whether it fit the selected pathway. chat_4 is a
      // separate construct (plausibility of the persona) and stays as it was.
      ["chat_new_considerations","The stakeholder discussion helped me identify concerns, constraints, or further questions about the pathway that I had not previously considered."],
      ["chat_perspective_fit","The persona's responses were relevant to the pathway I selected and helped me examine it from that stakeholder's perspective."],
      ["chat_4","The persona's responses felt natural and plausible for the represented stakeholder."]
    ],
    text:[
      ["chat_feedback","What, if anything, did the stakeholder discussion or persona chat add to your policy exploration? Please describe anything that felt useful, unconvincing, or potentially risky.","Refer to a specific persona, question, or response where possible. If it added nothing, explain why.",true]
    ]
  }
];

/* ── ③ 정책 사후 (정책마다) ────────────────────────────────────────────────
   RQ1  SCS 10 + 인지부하 6          — 양 조건 공통, 참조 대상 "이 분석"
   RQ2  Coverage 4 + 비교 지원 3     — framework 전용, 참조 대상 "분기 경로"
   정성 Coverage 1                    — framework 전용, 필수 응답               */
const cognitiveLoadSection = {
  title:"Complexity and clarity",
  instruction:LOAD_INSTRUCTION,
  scaleType:"load",
  items:[
    // Intrinsic (Leppink Items 1–3) — 조작 점검 겸용
    ["cl_int_1","The policy issue covered in this task was very complex."],
    ["cl_int_2","This task covered relationships between policy assumptions and outcomes that I perceived as very complex."],
    ["cl_int_3","This task covered policy concepts and conditions that I perceived as very complex."],
    // Extraneous (Leppink Items 4–6) — 제시 방식의 부담
    ["cl_ext_1","The explanations in this policy analysis were very unclear."],
    ["cl_ext_2","The explanations were, in terms of making sense of the policy's outcomes, very ineffective."],
    ["cl_ext_3","The explanations were full of unclear language."]
  ]
};

const coverageSection = {
  title:"Breadth of the pathways presented",
  conditions:["framework"],
  items:[
    ["rq2b_1","The pathways showed a sufficiently wide range of ways in which this policy could unfold."],
    ["rq2b_2","The pathways included not only successful outcomes but also possibilities of failure or deterioration."],
    ["rq2b_3","The pathways let me examine whether the policy could recover or adapt after unfavorable conditions."],
    ["rq2b_5","I felt that important conditions or possible developments were missing from the pathways."]
  ],
  text:[
    ["rq2b_missing","Were any important conditions or developments missing from the pathways? Please explain.","Describe the condition, stakeholder, or outcome you expected to see. If none were missing, state that explicitly.",true]
  ]
};

const comparisonSupportSection = {
  title:"Support for comparing policy pathways",
  conditions:["framework"],
  items:[
    ["rq2_compare_1","This tool helped me identify where and why possible policy developments diverged."],
    ["rq2_compare_2","This tool helped me compare the conditions, bottlenecks, and projected results associated with different policy developments."],
    ["rq2_compare_3","This tool made the differences among possible policy developments easier to understand."]
  ]
};

const policySections = [allStudySections[0], cognitiveLoadSection, coverageSection, comparisonSupportSection];

const comparisonReflectionSection = {
  title:"Value of pathway comparison",
  conditions:["framework"],
  text:[
    ["rq2_comparison_feedback","Did comparing multiple policy pathways help you assess the policy? Please explain what the comparison added, if anything, what remained difficult, and whether the additional time and information were worthwhile.","Describe what the comparison changed in your analysis. If it did not help, explain why.",true]
  ]
};

/* ── ⑤ 정성 설문 ───────────────────────────────────────────────────────────
   RQ3c  extended_4, 5, 8  — 양 조건 공통 (강점 · 개선점 · LLM 도입에 대한 견해)

   9 → 3. 제거한 것과 이유:
     extended_1  정책 의사결정 절차 서술    → 참가자 배경 조사에 가깝고 시스템 평가가 아님
     extended_2  어느 단계에서 유용한가     → extended_4(강점)와 응답이 겹침
     extended_3  어느 단계에서 부적절한가   → extended_5(개선점)와 응답이 겹침
     extended_6  단계 간 지표 연결의 타당성 ⚠️ 생성 품질에 대한 유일한 정성 점검이었음
     extended_7  페르소나 발화의 타당성     ⚠️ 위와 동일. §6 정량 평가로만 남음
     extended_9  기타 의견                  → extended_5·8이 사실상 흡수                */
const extendedSection = {
    title:"Practical use, limitations, and future implications",
    text:[
      ["extended_4","How did this tool affect the way you examined the two policies? Please describe anything you found useful, confusing, limiting, or missing.","Reflect freely on your overall experience with the analysis and interface.",true],
      ["extended_5","In what situations, if any, could this tool support real policy work? What evidence, safeguards, or improvements would be needed before it could be used?","Describe where it could or could not fit into policy work and why.",true],
      ["extended_8","What do you think about the growing use of LLM-based tools in policy decision-making? Please share both the opportunities and the concerns you see.","Consider both potential benefits and unintended consequences.",true]
    ]
};

/* ── ④ 최종 설문 ───────────────────────────────────────────────────────────
   RQ3a  TAM 6                    — 양 조건 공통
   RQ3b  Trust 7 + 검증 근거 1    — 양 조건 공통
   RQ2   비교 가치 정성 1         — framework 전용
   RQ4   Chat 3 + 정성 1          — framework 전용                            */
const postSections = [
  allStudySections[1],
  allStudySections[2],
  comparisonReflectionSection,
  allStudySections[3],
];

function esc(value){
  return String(value ?? "").replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}

function likertField(name, question, scaleAnchors=anchors){
  return `<fieldset data-likert name="${esc(name)}">
    <legend>${esc(question)}</legend>
    <div class="likert-scale${scaleAnchors.length === 7 ? " likert-scale-7" : ""}">${scaleAnchors.map((label,index)=>`
      <label>
        <input type="radio" name="${esc(name)}" value="${index+1}" required />
        <b>${index+1}</b><span>${esc(label)}</span>
      </label>`).join("")}
    </div>
  </fieldset>`;
}

/* Leppink et al. (2013) 원문 형식: 0–10, 11점.
   SCS(5점) 바로 다음에 오므로 시각적으로 분리하고 별도 지시문을 단다. */
function loadField(name, question){
  const points = Array.from({length:11}, (_,i)=>i);
  return `<fieldset data-likert data-load-scale name="${esc(name)}">
    <legend>${esc(question)}</legend>
    <div class="likert-scale load-scale">${points.map(value=>`
      <label>
        <input type="radio" name="${esc(name)}" value="${value}" required />
        <b>${value}</b><span>${value === 0 ? "not at all" : value === 10 ? "completely" : "&nbsp;"}</span>
      </label>`).join("")}
    </div>
  </fieldset>`;
}

function textField(name, question, placeholder, required=false){
  return `<label class="survey-text">
    <span>${esc(question)}${required ? ' <em>Required</em>' : ""}</span>
    <textarea name="${esc(name)}" rows="5" ${required ? "required" : ""} placeholder="${esc(placeholder)}"></textarea>
  </label>`;
}

function selectField(name, question, options, required=true){
  return `<label class="survey-select">
    <span>${esc(question)}${required ? ' <em>Required</em>' : ""}</span>
    <select name="${esc(name)}" ${required ? "required" : ""}>
      <option value="">Select one</option>
      ${options.map(option=>`<option value="${esc(option)}">${esc(option)}</option>`).join("")}
    </select>
  </label>`;
}

function ratingField(name, question, labels){
  return `<fieldset data-likert name="${esc(name)}">
    <legend>${esc(question)}</legend>
    <div class="likert-scale">${labels.map((label,index)=>`
      <label>
        <input type="radio" name="${esc(name)}" value="${index+1}" required />
        <b>${index+1}</b><span>${esc(label)}</span>
      </label>`).join("")}
    </div>
  </fieldset>`;
}

let surveyPageIndex = 0;
let surveyPages = [];

function validateSurveyPage(page){
  if(previewMode || !page) return true;
  const controls = [...page.querySelectorAll("input, select, textarea")];
  const invalid = controls.find(control=>!control.checkValidity());
  if(!invalid) return true;
  invalid.reportValidity();
  return false;
}

function showSurveyPage(nextIndex, focusHeading=false){
  if(!surveyPages.length) return;
  surveyPageIndex = Math.max(0, Math.min(surveyPages.length - 1, nextIndex));
  surveyPages.forEach((page,index)=>{
    page.hidden = index !== surveyPageIndex;
    page.setAttribute("aria-hidden", index === surveyPageIndex ? "false" : "true");
  });
  const current = surveyPages[surveyPageIndex];
  const progress = document.getElementById("surveyPageProgress");
  const previous = document.getElementById("surveyPrevious");
  const next = document.getElementById("surveyNext");
  const submit = document.getElementById("surveySubmit");
  const title = current.querySelector(".survey-section-title")?.textContent?.trim()
    || current.querySelector(".survey-section-head h2")?.textContent?.trim()
    || `Section ${surveyPageIndex + 1}`;
  progress.hidden = surveyPages.length <= 1;
  document.getElementById("surveyPageLabel").textContent = `Section ${surveyPageIndex + 1} of ${surveyPages.length}`;
  document.getElementById("surveyPageTitle").textContent = title;
  document.getElementById("surveyPageBar").style.width = `${((surveyPageIndex + 1) / surveyPages.length) * 100}%`;
  previous.hidden = surveyPageIndex === 0;
  next.hidden = surveyPageIndex === surveyPages.length - 1;
  submit.hidden = surveyPageIndex !== surveyPages.length - 1;
  if(focusHeading){
    current.querySelector("h2")?.focus?.({preventScroll:true});
    window.scrollTo({top:0,behavior:"smooth"});
  }
  if(window.lucide) lucide.createIcons();
}

function configureSurveyPagination(){
  surveyPages = [...document.querySelectorAll("#surveySections > .survey-section")];
  surveyPageIndex = 0;
  showSurveyPage(0);
}

function renderPreStudy(participant, policies){
  // 정책 코퍼스의 5개 도메인에 정렬 — 도메인 배정 근거로 사용
  const domains = ["Public health and healthcare","Welfare and social protection","Climate and environment","Transportation and urban mobility","Education and research policy","Other"];
  document.getElementById("surveySections").innerHTML = `
    <section class="survey-section">
      <div class="survey-section-head"><span>Background</span><h2>About you</h2></div>
      <div class="survey-field-grid">
        ${selectField("age_group","Age group",["18–24","25–34","35–44","45–54","55 or older","Prefer not to say"])}
        ${selectField("gender","Gender",["Woman","Man","Non-binary","Self-describe","Prefer not to say"],false)}
        ${selectField("education","Highest level of education",["Bachelor's degree in progress","Bachelor's degree completed","Master's degree in progress","Master's degree completed","Doctoral degree in progress","Doctoral degree completed","Other"])}
        ${selectField("current_role","Current primary role",["Graduate student","Academic researcher","Policy researcher or analyst","Public-sector policy practitioner","Think tank or NGO professional","Private-sector policy professional","Other"])}
        ${selectField("study_domain","Primary field or discipline",["Epidemiology & Health Policy","Social Policy","Environmental Policy & Governance","Urban Planning & Policy","Education Policy","Public Policy / Public Administration (general)","Other"])}
        ${selectField("policy_experience","Policy-related research or practice experience",["None","Less than 1 year","1–2 years","3–5 years","6–10 years","More than 10 years"])}
        ${selectField("llm_experience","Experience using LLM-based analysis or decision-support tools",["None","A little","Some","Substantial","Extensive"])}
        ${selectField("simulation_experience","Experience using policy simulation or scenario-analysis tools",["None","A little","Some","Substantial","Extensive"])}
      </div>
      <label class="survey-text"><span>Country or policy context you know best <em>Required</em></span><input class="survey-input" name="policy_context" required placeholder="e.g., United States federal policy, South Korean local policy" /></label>
      <fieldset class="survey-checkbox-group">
        <legend>Policy areas in which you have coursework, research, or practical experience <em>Required</em></legend>
        <div>${domains.map(domain=>`<label><input type="checkbox" name="domain_experience" value="${esc(domain)}" /><span>${esc(domain)}</span></label>`).join("")}</div>
      </fieldset>
    </section>`;
}

function renderPolicyIntroduction(policy){
  document.getElementById("surveySections").innerHTML = `
    <section class="survey-section policy-introduction">
      <div class="survey-section-head"><span>Policy overview</span><h2>${esc(policy.label)}</h2></div>
      <article class="policy-brief">
        <div><span>Policy goal</span><p>${esc(policy.goal || policy.description)}</p></div>
        <div><span>Overview</span><p>${esc(policy.overview || policy.description)}</p></div>
      </article>
    </section>
    <section class="survey-section">
      <div class="survey-section-head"><span>Before branch exploration</span><h2>Prior familiarity and perceived complexity</h2></div>
      ${ratingField("policy_familiarity",`How familiar were you with ${policy.label} before this study?`,["Not at all familiar","Slightly familiar","Moderately familiar","Very familiar","Extremely familiar"])}
      ${ratingField("policy_complexity",`Based on this overview, how complex does this policy issue appear to you?`,["Very simple","Somewhat simple","Moderate","Somewhat complex","Very complex"])}
      <input type="hidden" name="policy_key" value="${esc(policy.key)}" />
    </section>
    <aside class="policy-simulation-notice">
      <i data-lucide="info"></i>
      <p><strong>Simulation data</strong>This simulation was grounded in official policy implementation plans and government documents. The pathways and outcomes presented here are exploratory results generated by the simulation framework.</p>
    </aside>`;
}

function renderSections(sections){
  document.getElementById("surveySections").innerHTML = sections
    .filter(forCondition)
    .map(section=>{
      const useLoad = section.scaleType === "load";
      const scaleAnchors = section.scale || anchors;
      return `
    <section class="survey-section${useLoad ? " survey-section-load" : ""}">
      <div class="survey-section-head">
        <h2 class="survey-section-title">${esc(section.title)}</h2>
        ${section.instruction ? `<p class="survey-scale-instruction">${esc(section.instruction)}</p>` : ""}
      </div>
      ${(section.items || []).map(item=>useLoad ? loadField(item[0],item[1]) : likertField(item[0],item[1],scaleAnchors)).join("")}
      ${(section.text || []).map(item=>textField(item[0],item[1],item[2],Boolean(item[3]))).join("")}
    </section>`;
    }).join("");
  configureSurveyPagination();
}

async function loadSurvey(){
  if(!participantId && !previewMode){
    location.href = "study.html";
    return;
  }
  if(previewMode && previewVariantId){
    const variantResponse = await fetch(`/api/study/variants/${encodeURIComponent(previewVariantId)}`);
    if(!variantResponse.ok) throw new Error(`Variant HTTP ${variantResponse.status}`);
    const variant = await variantResponse.json();
    previewParticipant = {
      ...previewParticipant,
      variant_id:variant.variant_id,
      domain_id:variant.domain_id,
      condition:variant.condition,
      policy_order:variant.policy_order,
      assigned_policies:variant.policy_keys,
      assigned_conditions:variant.policy_keys.map(()=>variant.condition),
      assigned_trials:variant.policy_keys.map((policy_key,index)=>({policy_key,condition:variant.condition,policy_index:index})),
      introduced_policies:variant.policy_keys,
    };
  }
  const participant = previewMode
    ? previewParticipant
    : await fetch(`/api/study/participants/${encodeURIComponent(participantId)}`).then(response=>{
        if(!response.ok) throw new Error(`Participant HTTP ${response.status}`);
        return response.json();
      });
  loadedParticipant = participant;
  // 조건 확정 — 조건 전용 섹션(Coverage · Chat)의 노출을 좌우한다.
  // between 설계이므로 참가자의 모든 trial이 같은 조건을 갖는다.
  studyCondition = participant.condition
    || participant.assigned_trials?.[0]?.condition
    || participant.assigned_conditions?.[0]
    || "framework";
  if(previewMode){
    document.getElementById("studySurvey").noValidate = true;
    document.getElementById("surveyStatus").textContent = "Preview mode: responses are optional and will not be saved.";
  }
  if(stage === "pre_study"){
    document.getElementById("surveyKicker").textContent = "Pre-study questionnaire";
    document.getElementById("surveyTitle").textContent = "Background and prior experience";
    document.getElementById("surveyIntro").textContent = "Tell us about your background and prior experience before reviewing the assigned policy cases.";
    renderPreStudy(participant, []);
    document.getElementById("surveySubmit").innerHTML = 'Continue to assigned policies <i data-lucide="arrow-right"></i>';
  }else if(stage === "policy_pre"){
    if(!previewMode && !participant.pre_study_completed){
      location.href = `survey.html?stage=pre&participant=${encodeURIComponent(participantId)}`;
      return;
    }
    if(!policyKey || !participant.assigned_policies.includes(policyKey)) throw new Error("This policy is not assigned to this participant.");
    const policies = await fetch("/api/pathway/policies").then(item=>item.json());
    const policy = (policies.policies || []).find(item=>item.key === policyKey);
    if(!policy) throw new Error("Policy information is unavailable.");
    document.getElementById("surveyKicker").textContent = `Policy ${policyIndex + 1} of ${participant.assigned_policies.length} · Before exploration`;
    document.getElementById("surveyTitle").textContent = policy.label;
    document.getElementById("surveyIntro").textContent = "Review the policy goal and overview, then answer two questions before examining its policy analysis.";
    renderPolicyIntroduction(policy);
    document.getElementById("surveySubmit").innerHTML = 'Begin policy analysis <i data-lucide="arrow-right"></i>';
  }else if(stage === "policy"){
    if(!previewMode && !participant.pre_study_completed){
      location.href = `survey.html?stage=pre&participant=${encodeURIComponent(participantId)}`;
      return;
    }
    if(!policyKey || !participant.assigned_policies.includes(policyKey)) throw new Error("This policy is not assigned to this participant.");
    if(!previewMode && !participant.introduced_policies.includes(policyKey)){
      location.href = `survey.html?stage=policy_intro&participant=${encodeURIComponent(participantId)}&policy=${encodeURIComponent(policyKey)}&policyIndex=${policyIndex}`;
      return;
    }
    const expectedPolicy = participant.assigned_policies[participant.completed_policies.length];
    if(!previewMode && !participant.completed_policies.includes(policyKey) && policyKey !== expectedPolicy){
      location.href = `dashboard.html?participant=${encodeURIComponent(participantId)}`;
      return;
    }
    const policies = await fetch("/api/pathway/policies").then(item=>item.json());
    const policy = (policies.policies || []).find(item=>item.key === policyKey);
    document.getElementById("surveyKicker").textContent = `Policy ${policyIndex + 1} of ${participant.assigned_policies.length} · Post-exploration survey`;
    document.getElementById("surveyTitle").textContent = policy?.label || "Policy pathway feedback";
    document.getElementById("surveyIntro").textContent = "Please answer these questions based only on the policy analysis you just examined.";
    renderSections(policySections);
  }else if(stage === "post_study"){
    document.getElementById("surveyKicker").textContent = "Final questionnaire";
    document.getElementById("surveyTitle").textContent = "Overall exploration and decision-support feedback";
    document.getElementById("surveyIntro").textContent = "Reflect on both policy cases, the branching interface, trust in the system, and the stakeholder interactions.";
    renderSections(postSections);
    document.getElementById("surveySubmit").innerHTML = 'Continue to qualitative feedback <i data-lucide="arrow-right"></i>';
  }else{
    if(!previewMode && !participant.post_study_completed){
      location.href = `survey.html?stage=post&participant=${encodeURIComponent(participantId)}`;
      return;
    }
    document.getElementById("surveyKicker").textContent = "Final step · Qualitative feedback";
    document.getElementById("surveyTitle").textContent = "Practical use, limitations, and future implications";
    document.getElementById("surveyIntro").textContent = "Please provide detailed feedback about how the framework could be used, verified, and improved in real policy decision-making.";
    renderSections([extendedSection]);
    document.getElementById("surveySubmit").innerHTML = 'Complete study <i data-lucide="check"></i>';
  }
  PolicyStudy.event("survey_started", {survey_stage:stage, policy_index:policyIndex});
  if(window.lucide) lucide.createIcons();
}

document.getElementById("studySurvey").addEventListener("submit", async event=>{
  event.preventDefault();
  const form = event.currentTarget;
  if(!previewMode && !form.reportValidity()) return;
  const button = document.getElementById("surveySubmit");
  const status = document.getElementById("surveyStatus");
  button.disabled = true;
  status.textContent = "Saving your responses...";
  const answers = {};
  for(const [key,value] of new FormData(form).entries()){
    if(Object.hasOwn(answers,key)){
      answers[key] = Array.isArray(answers[key]) ? [...answers[key],value] : [answers[key],value];
    }else{
      answers[key] = value;
    }
  }
  if(previewMode){
    if(stage === "pre_study"){
      const query = new URLSearchParams({previewStudy:"1",stage:"study_intro"});
      if(previewVariantId) query.set("variant",previewVariantId);
      location.href = `toc_intro.html?${query.toString()}`;
    }else if(stage === "policy_pre"){
      location.href = policyAnalysisHref(policyKey,policyIndex);
    }else if(stage === "policy"){
      location.href = policyIndex === 0
        ? previewHref("policy_intro",previewParticipant.assigned_policies[1],1)
        : previewHref("post");
    }else if(stage === "post_study"){
      location.href = previewHref("extended");
    }else{
      finishPreview();
    }
    return;
  }
  if(stage === "pre_study" && !answers.domain_experience){
    status.textContent = "Please select at least one policy area in which you have experience.";
    button.disabled = false;
    return;
  }
  try{
    const response = await fetch("/api/study/surveys", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        participant_id:participantId,
        policy_key:(stage === "policy" || stage === "policy_pre") ? policyKey : null,
        survey_stage:stage,
        submitted_at:new Date().toISOString(),
        answers,
      }),
    });
    if(!response.ok){
      let message = `HTTP ${response.status}`;
      try{
        const payload = await response.json();
        if(payload.detail) message = payload.detail;
      }catch(_error){
        // Keep the HTTP fallback when the server does not return JSON.
      }
      throw new Error(message);
    }
    const saveResult = await response.json();
    if(saveResult.status === "screened_out"){
      localStorage.removeItem("policy-study-participant");
      document.querySelector(".survey-hero").innerHTML = '<span>Screening complete</span><h1>Thank you for your interest.</h1><p>Based on your responses, you are not eligible to continue with this study.</p>';
      form.innerHTML = '<section class="survey-section survey-complete"><i data-lucide="log-out"></i><h2>You will now return to Prolific.</h2><p>Your screening response has been saved.</p></section>';
      if(window.lucide) lucide.createIcons();
      window.scrollTo({top:0,behavior:"smooth"});
      if(saveResult.redirect_url){
        setTimeout(()=>{ location.href = saveResult.redirect_url; }, 1500);
      }else{
        document.querySelector(".survey-section.survey-complete p").textContent = "Your screening response has been saved. Please return to Prolific.";
      }
      return;
    }
    PolicyStudy.event("survey_submitted", {
      survey_stage:stage,
      response_item_count:Object.keys(answers).length,
      screening_status:saveResult.status,
    }, PolicyStudy.pageElapsed());
    if(stage === "pre_study"){
      location.href = `toc_intro.html?stage=study_intro&participant=${encodeURIComponent(participantId)}`;
    }else if(stage === "policy_pre"){
      location.href = policyAnalysisHref(policyKey,policyIndex);
    }else if(stage === "policy"){
      const participant = await fetch(`/api/study/participants/${encodeURIComponent(participantId)}`).then(item=>item.json());
      if(participant.completed_policies.length >= participant.assigned_policies.length){
        location.href = `survey.html?stage=post&participant=${encodeURIComponent(participantId)}`;
      }else{
        location.href = `dashboard.html?participant=${encodeURIComponent(participantId)}`;
      }
    }else if(stage === "post_study"){
      location.href = `survey.html?stage=extended&participant=${encodeURIComponent(participantId)}`;
    }else{
      document.querySelector(".survey-hero").innerHTML = '<span>Study complete</span><h1>Thank you for your participation.</h1><p>Your responses and interaction data have been saved. You may now return to Prolific to complete your submission.</p>';
      form.innerHTML = '<section class="survey-section survey-complete"><i data-lucide="check-circle-2"></i><h2>Your study session is complete.</h2><p>Please use the completion link or code provided with this study.</p></section>';
      if(window.lucide) lucide.createIcons();
      window.scrollTo({top:0,behavior:"smooth"});
      if(loadedParticipant?.prolific_pid){
        const completion = await fetch(`/api/study/completion-url?participant_id=${encodeURIComponent(participantId)}`).then(item=>item.ok ? item.json() : null);
        if(completion?.url){
          document.querySelector(".survey-section.survey-complete p").textContent = "Returning you to Prolific to complete your submission...";
          setTimeout(()=>{ location.href = completion.url; }, 1500);
        }
      }
    }
  }catch(error){
    status.textContent = `Your response could not be saved: ${error.message}`;
    button.disabled = false;
  }
});

document.getElementById("surveyPrevious").addEventListener("click",()=>{
  showSurveyPage(surveyPageIndex - 1, true);
});

document.getElementById("surveyNext").addEventListener("click",()=>{
  const current = surveyPages[surveyPageIndex];
  if(!validateSurveyPage(current)) return;
  showSurveyPage(surveyPageIndex + 1, true);
});

loadSurvey().catch(error=>{
  document.getElementById("surveyTitle").textContent = "Questionnaire unavailable";
  document.getElementById("surveyIntro").textContent = error.message;
  document.getElementById("studySurvey").hidden = true;
});
