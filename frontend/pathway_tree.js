let TREE_PHASES = ["Inputs","Activities","Outputs","Outcomes","Impact"];
const TREE_PHASE_KO = {Inputs:"Inputs",Activities:"Activities",Outputs:"Outputs",Outcomes:"Outcomes",Impact:"Impact"};
const TREE_PHASE_FOCUS = {
  Inputs:"Resources, capacities, and assumptions available for implementation.",
  Activities:"Actions through which policy resources are put into practice.",
  Outputs:"Immediate and measurable products of policy implementation.",
  Outcomes:"Near- to medium-term changes resulting from those outputs.",
  Impact:"Long-term and broader effects on people, institutions, and society.",
};
let TREE_PHASE_SCHEMA = {
  Inputs:[
    ["federal_enforcement_budget_usd","Enforcement budget"],
    ["certified_idr_entity_count","IDR entities"],
    ["qpa_ready_plan_pct","QPA readiness"],
  ],
  Activities:[
    ["qpa_calculations_completed","QPA calculations"],
    ["timely_initial_payment_or_denial_rate","Timely payments / denials"],
    ["idr_cases_initiated","IDR cases"],
  ],
  Outputs:[
    ["protected_claims_correctly_processed_rate","Correctly processed claims"],
    ["notice_compliance_rate","Notice compliance"],
    ["timely_idr_determination_rate","Timely IDR"],
  ],
  Outcomes:[
    ["emergency_oon_bill_prevalence_reduction_pp","Emergency OON reduction"],
    ["nonemergency_oon_bill_prevalence_reduction_pp","Non-emergency OON reduction"],
    ["patient_savings_per_protected_claim_usd","Patient savings"],
  ],
  Impact:[
    ["systemic_oon_billing_prevalence_pct","OON billing prevalence"],
    ["network_adequacy_rate_pct","Network adequacy"],
    ["premium_change_attributable_to_nsa_pct","Premium change"],
  ],
};
const TREE_FIELD_LABELS = {
  monthly_cost_sharing_cap:"Monthly insulin cost-sharing cap",
  reimbursement_deadline_days:"Reimbursement deadline",
  total_stabilization_funding:"Child-care stabilization funding",
  tribal_base_amount:"Base amount per tribal lead agency",
  state_minimum_subgrant_percentage:"Minimum state subgrant share",
  additional_compliance_burden_for_business:"Additional business compliance burden",
  one_time_transition_cost_for_business:"One-time business transition cost",
  additional_administrative_compliance_cost:"Additional administrative cost",
  annual_program_budget_million_krw:"Annual program budget",
  future_talent_participating_graduate_students_count:"Future-talent graduate participants",
  innovative_talent_participating_graduate_students_count:"Innovative-talent graduate participants",
  max_co_funding_per_project_sgd:"Maximum co-funding per project",
  federal_enforcement_budget_usd:"Federal enforcement budget",
  certified_idr_entity_count:"Certified IDR entities",
  qpa_ready_plan_pct:"QPA-ready plans",
  qpa_calculations_completed:"QPA calculations completed",
  timely_initial_payment_or_denial_rate:"Timely payment or denial rate",
  idr_cases_initiated:"IDR cases initiated",
  protected_claims_correctly_processed_rate:"Protected claims correctly processed",
  notice_compliance_rate:"Notice compliance rate",
  timely_idr_determination_rate:"Timely IDR determination rate",
  emergency_oon_bill_prevalence_reduction_pp:"Emergency OON bill reduction",
  nonemergency_oon_bill_prevalence_reduction_pp:"Non-emergency OON bill reduction",
  patient_savings_per_protected_claim_usd:"Patient savings per protected claim",
  systemic_oon_billing_prevalence_pct:"Systemic OON billing prevalence",
  network_adequacy_rate_pct:"Network adequacy rate",
  premium_change_attributable_to_nsa_pct:"NSA-attributable premium change",
  irs_administrative_budget_usd:"IRS administrative budget",
  irs_staff_allocated_ftes:"IRS staff allocated",
  non_filer_outreach_budget_usd:"Non-filer outreach budget",
  irs_advance_payment_administration_funding:"IRS implementation funding",
  maximum_advance_payment_share:"Maximum advance-payment share",
  maximum_credit_per_child_under_age_6:"Maximum credit for children under 6",
  maximum_credit_per_child_age_6_to_17:"Maximum credit for children ages 6–17",
  bureau_of_fiscal_service_implementation_funding:"Fiscal Service implementation funding",
  advance_payment_period:"Advance-payment period",
  tribal_minimum_subgrant_percentage:"Minimum tribal subgrant share",
  obligation_deadline:"Fund obligation deadline",
  liquidation_deadline:"Fund liquidation deadline",
  advance_payment_disbursements_count:"Advance payments disbursed",
  portal_account_updates_processed:"Portal updates processed",
  non_filer_sign_up_tool_submissions_processed:"Non-filer registrations processed",
  average_monthly_payment_per_child_dollars:"Average monthly payment per child",
  eligible_families_receiving_at_least_one_payment:"Eligible families reached",
  non_filer_households_receiving_payments:"Non-filer households reached",
  spm_child_poverty_rate_2021_pct:"2021 child poverty rate",
  spm_child_poverty_relative_reduction_2020_2021_pct:"Child poverty reduction",
  low_income_food_insufficiency_relative_reduction_pct:"Food insufficiency reduction",
  spm_black_child_poverty_rate_2021_pct:"Black child poverty rate",
  spm_hispanic_child_poverty_rate_2021_pct:"Hispanic child poverty rate",
  intergenerational_income_mobility_index:"Intergenerational mobility",
  child_health_outcome_composite_score:"Child health outcomes",
  long_term_healthcare_cost_savings_usd:"Long-term healthcare savings",
  dealer_registration_count:"Registered dealers",
  manufacturer_certification_count:"Manufacturer certifications",
  advance_payment_claims_processed:"Advance payment claims",
  dealer_training_sessions_conducted:"Dealer training sessions",
  manufacturer_compliance_reports_submitted:"Compliance reports",
  dealer_participation_rate_pct:"Dealer participation rate",
  eligible_vehicle_models_count:"Eligible vehicle models",
  pos_transfer_transaction_count:"Point-of-sale transfers",
  section30d_return_count:"Section 30D returns",
  average_section30d_credit_per_return_usd:"Average credit per return",
  pos_credit_transfer_rate_pct:"Point-of-sale transfer rate",
  critical_mineral_import_dependency_pct:"Critical mineral import dependency",
  ev_market_share_pct:"EV market share",
  transportation_emissions_reduction_mtco2e:"Transportation emissions reduction",
  national_local_refund_budget_krw:"National and local refund budget",
  participating_local_governments_count:"Participating local governments",
  card_issuer_partners_count:"Card issuer partners",
  membership_applications_processed_count:"Membership applications processed",
  transit_usage_records_processed_count:"Transit usage records processed",
  refund_transactions_processed_count:"Refund transactions processed",
  active_members_monthly_count:"Monthly active members",
  total_refund_disbursement_krw:"Total refunds disbursed",
  average_rides_per_eligible_user_per_month:"Average monthly rides",
  cumulative_registered_kpass_users_count:"Cumulative registered users",
  avg_monthly_refund_per_user_krw:"Average monthly refund",
  avg_refund_share_of_transit_spending_pct:"Refund share of transit spending",
  low_income_avg_monthly_refund_per_user_krw:"Low-income monthly refund",
  annual_budget_krw:"연간 예산",
  annual_fellowship_slots:"선발 정원",
  regional_quota_percent:"지역 할당",
  applications_received:"지원서 접수",
  eligible_applicants:"적격 지원자 수",
  fellows_selected:"최종 선발 인원",
  fellows_starting_research:"연구 착수 인원",
  regional_fellows_count:"지역 펠로우",
  fellows_passing_stage_evaluation:"단계평가 통과 인원",
  number_of_sci_e_publications_in_2021_2022:"SCI(E) 논문",
  tenure_track_or_research_continuable_transition_rate:"경력 전환",
  regional_publication_share:"지역 논문 비중",
  young_researcher_retention_rate:"신진 연구자 유지율",
  independent_lab_or_faculty_headcount:"독립 연구자/교원",
  regional_research_gap_reduction:"지역 격차 완화",
};
const TREE_STANCES = {
  enabling:{label:"Enabling pathway", short:"Enabling", color:"#37A48A"},
  baseline:{label:"Baseline pathway", short:"Baseline", color:"#745BD6"},
  constraining:{label:"Constraining pathway", short:"Constraining", color:"#5A94DC"},
  // Legacy whole-run stance keys remain readable for comparison output.
  optimistic:{label:"Enabling pathway", short:"Enabling", color:"#37A48A"},
  neutral:{label:"Baseline pathway", short:"Baseline", color:"#745BD6"},
  conservative:{label:"Constraining pathway", short:"Constraining", color:"#5A94DC"},
};
const TREE_STANCE_ORDER = ["optimistic","neutral","conservative"];
const PRECOMPUTED_TRANSITION_ORDER = ["enabling","baseline","constraining"];
/* ⚠️ baseline 조건에서 전이 라벨 차단.
   경로가 하나뿐인데 "Baseline pathway"라고 표시하면 다른 선택지가 존재한다는 것을
   알려주는 셈이 되어 조작이 새어나간다. 중립 표현으로 대체한다. */
function stanceShortTree(node){
  if(node.col === 0) return "Policy Input";
  if(window.TREE_BASELINE_MODE === true) return "Projected";
  return (TREE_STANCES[node.stance] || TREE_STANCES.neutral).short;
}
function stanceLabelTree(node, fallback="selected pathway"){
  if(node.col === 0) return "policy input";
  if(window.TREE_BASELINE_MODE === true) return "projected development";
  return TREE_STANCES[node.stance]?.label || node.stance || fallback;
}
const TREE_NODE_WIDTH = 178;
const TREE_COMPACT_NODE_WIDTH = 178;
const TREE_COL_GAP = 310;
const PIXEL_COLORS = ["#9FA1FF","#B5BAFF","#8FCFDD","#7DB7F0","#6F6B78"];
let STAKEHOLDER_SEATS = [
  {role:"patient", color:"#9FA1FF", avatar:"ssf_p1_phd_avatar.png"},
  {role:"provider", color:"#B5BAFF", avatar:"ssf_p2_evalpanel_avatar.png"},
  {role:"payer", color:"#8FCFDD", avatar:"ssf_p3_nrf_avatar.png"},
  {role:"regulator", color:"#7DB7F0", avatar:"ssf_p4_ministry_avatar.png"},
  {role:"mediator", color:"#6F6B78", avatar:"ssf_p5_hostinst_avatar.png"},
];
let STAKEHOLDER_VIEWPOINTS = {
  patient:"patient",
  provider:"nonparticipating provider",
  payer:"health plan manager",
  regulator:"policy regulator",
  mediator:"IDR entity",
};
let CONSTRAINT_PATTERNS = [
  ["IDR backlog", /\bIDR\b.{0,35}\b(backlog|bottleneck|capacity|overload|delay)/i],
  ["Notice compliance gaps", /\bnotice\b.{0,35}\b(failure|gap|incomplete|noncompliance|compliance)/i],
  ["Waiver misuse", /\bwaiver\b.{0,30}\b(misuse|exploit|pressure|circumvent|unknow)/i],
  ["Claim reclassification", /\breclassif/i],
  ["QPA readiness gaps", /\bQPA\b.{0,35}\b(readiness|accuracy|error|dispute|limitation)/i],
  ["Processing errors", /\b(processing error|incorrectly processed|calculation error)/i],
  ["Payment delays", /\b(payment|denial).{0,25}\b(delay|late|timely)/i],
  ["Enforcement capacity", /\b(enforcement|audit).{0,35}\b(limited|insufficient|budget|capacity|gap)/i],
  ["Rural access gaps", /\brural\b.{0,35}\b(access|gap|limited|exposed|underserved)/i],
  ["Provider resistance", /\bprovider\b.{0,35}\b(resistance|confidence|incentive|participation|pushback)/i],
  ["Data and system limitations", /\b(data|system|infrastructure|legacy).{0,35}\b(limit|gap|delay|error|readiness)/i],
  ["High-cost service disputes", /\b(high-cost|air ambulance|anesthesia|radiology|specialized service)/i],
  ["Network adequacy pressure", /\bnetwork adequacy\b/i],
  ["Premium pressure", /\bpremium\b.{0,30}\b(increase|pressure|cost|change)/i],
];
let IMPACT_CONSTRAINT_PATTERNS = [
  ["Network adequacy pressure", /\b(network adequacy|narrow(?:er)? networks?|network gaps?|thin(?:ner)? networks?)\b/i],
  ["Premium pass-through risk", /\b(premium(?:s)? (?:increase|rise)|cost-shifting|costs? (?:are |being )?passed (?:on|through)|pass-through)\b/i],
  ["Persistent rural access gaps", /\brural\b.{0,45}\b(access|gap|underserved|shortage|network|exposed|scarcity)/i],
  ["Waiver loophole persistence", /\b(notice-and-consent waiver|waiver loophole|waivers? (?:persist|remain|exploit|strategic))/i],
  ["Provider consolidation risk", /\b(provider|market) consolidation\b/i],
  ["Long-term enforcement gaps", /\b(limited|reactive|insufficient|uneven) enforcement\b|\benforcement gaps?\b/i],
];

let treeData = null;
let precomputedTreeNodes = null;
let expandedPaths = new Set();
let treeNodes = new Map();
let focusedNode = null;
let focusedPath = "root";
let discussionNodeKey = "";
let savedPathways = [];
let discussionOpen = false;
let expandedRationaleIndex = null;
let reportPath = "";
let pathwayChatOpen = false;
let pathwayChatPath = "";
let pathwayChatPersona = "";
let pathwayChatTurns = [];
let newlyAddedPaths = new Set();
let completedPathSet = new Set();
let discussionOpenedAt = null;
let reportOpenedAt = null;
let chatOpenedAt = null;
let activeElapsedMs = 0;
let activeSegmentStartedAt = document.hidden ? null : performance.now();
const treeQuery = new URLSearchParams(window.location.search);
const treePreviewMode = treeQuery.get("previewStudy") === "1";
const treeDemoMode = treeQuery.get("demo") === "1";
let currentPolicyKey = treeQuery.get("policy") || "usa/chi_nsa";
const currentPolicyIndex = Math.max(0, Math.min(1, Number(treeQuery.get("policyIndex") || 0)));
const frameworkGuideStorageKey = `policy-framework-guide:${PolicyStudy.participantId || treeQuery.get("variant") || "preview"}`;
const baselineGuideStorageKey = `policy-baseline-guide:${PolicyStudy.participantId || treeQuery.get("variant") || "preview"}`;
let frameworkGuideStep = treeQuery.get("guide") === "1" ? 0 : -1;
let frameworkContextGuide = "";
const frameworkGuideIdentity = PolicyStudy.participantId || treeQuery.get("variant") || "preview";
const frameworkContextGuideKey = kind => `policy-${TREE_BASELINE_MODE ? "baseline" : "framework"}-feature-guide:${kind}:${frameworkGuideIdentity}`;

/* ── Baseline 조건 ───────────────────────────────────────────────────────────
   유저스터디 baseline은 동일한 ToC 구조를 "단일 경로"로만 제시한다.
   유지: 5단계 stage view · pathway canvas 추적 · 노드별 stakeholder discussion  (DR2)
   제거: 분기 생성/선택 · 복수 경로 비교 · persona chat                          (DR3, DR4)
   대체: chat 버튼 → final report 버튼
   ⚠️ 선택되지 않은 분기의 존재를 어떤 방식으로도 노출하지 않는다.               */
const TREE_BASELINE_MODE = window.TREE_BASELINE_MODE === true
  || treeQuery.get("condition") === "baseline";
const BASELINE_TRANSITION = "baseline";
const FRAMEWORK_CHAT_LIMIT = 5;
let frameworkChatUsage = {
  enabled: true,
  used: 0,
  limit: FRAMEWORK_CHAT_LIMIT,
  remaining: FRAMEWORK_CHAT_LIMIT,
};
let TREE_VIEW_SCALE = 0.72;
const TREE_VIEW_SCALE_MIN = 0.44;
const TREE_VIEW_SCALE_MAX = 0.92;
const TREE_VIEW_SCALE_STEP = 0.08;
let currentPolicyMeta = {
  key:"usa/chi_nsa",
  label:"No Surprises Act",
  short_label:"NSA",
  title:"No Surprises Act Pathway Explorer",
  description:"Explore alternative implementation pathways.",
};

const TREE_ROLE_COLORS = ["#9FA1FF", "#B5BAFF", "#8FCFDD", "#7DB7F0", "#6F6B78"];
const NSA_AVATARS = {
  patient:"ssf_p1_phd_avatar.png",
  provider:"ssf_p2_evalpanel_avatar.png",
  payer:"ssf_p3_nrf_avatar.png",
  regulator:"ssf_p4_ministry_avatar.png",
  mediator:"ssf_p5_hostinst_avatar.png",
};
const CTC_PERSONA_AVATARS = {
  "Maria Gonzalez":"assets/persona_avatars/persona-1.svg",
  "Marlene K. Ashford":"assets/persona_avatars/persona-2.svg",
  "James Thompson":"assets/persona_avatars/persona-3.svg",
  "Linda Chen":"assets/persona_avatars/persona-4.svg",
  "James Thompson (iq3h88)":"assets/persona_avatars/persona-5.svg",
};
const PROFILE_AVATARS = [
  "assets/persona_avatars/persona-1.svg",
  "assets/persona_avatars/persona-2.svg",
  "assets/persona_avatars/persona-3.svg",
  "assets/persona_avatars/persona-4.svg",
  "assets/persona_avatars/persona-5.svg",
];
const CTC_CONSTRAINT_PATTERNS = [
  ["Administrative capacity", /\b(IRS|administrative|staff|capacity)\b.{0,45}\b(limit|constraint|shortage|insufficient|delay|burden)/i],
  ["Non-filer access barriers", /\b(non[- ]?filer|registration|sign[- ]?up)\b.{0,45}\b(barrier|access|documentation|identity|trust|language|digital)/i],
  ["Payment delivery risk", /\b(payment|disbursement|deposit)\b.{0,40}\b(delay|error|incorrect|missing|interruption|timing)/i],
  ["Portal and data errors", /\b(portal|data|record|address|bank account)\b.{0,40}\b(error|outdated|mismatch|access|failure)/i],
  ["Uneven outreach", /\b(outreach|community partner|awareness)\b.{0,40}\b(uneven|limited|gap|capacity|trust|reach)/i],
  ["Reconciliation burden", /\b(reconciliation|overpayment|tax filing)\b.{0,40}\b(risk|burden|repay|uncertainty|error)/i],
  ["Temporary policy horizon", /\b(temporary|one[- ]year|expiration|expires|not renewed|short[- ]term)/i],
  ["Unequal subgroup reach", /\b(Black|Hispanic|racial|subgroup|equity)\b.{0,45}\b(gap|unequal|disparity|barrier|reach)/i],
];
const CTC_IMPACT_CONSTRAINT_PATTERNS = [
  ["Temporary policy horizon", /\b(temporary|one[- ]year|expiration|not renewed|short[- ]term)/i],
  ["Long-term attribution uncertainty", /\b(long[- ]term|5[- ]year|10[- ]year|intergenerational)\b.{0,55}\b(uncertain|assumption|attribution|estimate|project)/i],
  ["Unequal access persistence", /\b(non[- ]?filer|racial|Black|Hispanic|underserved)\b.{0,55}\b(gap|barrier|unequal|persist|limited)/i],
  ["Health pathway uncertainty", /\b(health|healthcare|nutrition)\b.{0,55}\b(uncertain|indirect|lag|assumption|persist)/i],
];
const CV_CONSTRAINT_PATTERNS = [
  ["Dealer readiness", /\b(dealer|registration|training)\b.{0,45}\b(capacity|delay|burden|readiness|participation|constraint)/i],
  ["Vehicle eligibility", /\b(vehicle|model|eligib|qualification)\b.{0,45}\b(limit|uncertain|change|constraint|exclude)/i],
  ["Supply-chain compliance", /\b(battery|critical mineral|component|supply chain)\b.{0,50}\b(requirement|compliance|shortage|dependency|constraint)/i],
  ["Point-of-sale transfer", /\b(point.of.sale|POS|credit transfer|advance payment)\b.{0,45}\b(delay|error|uptake|processing|constraint)/i],
  ["Consumer affordability", /\b(buyer|consumer|income|price|affordability)\b.{0,45}\b(limit|barrier|uncertain|constraint|cost)/i],
];
const CV_IMPACT_CONSTRAINT_PATTERNS = [
  ["Critical-mineral dependency", /\bcritical mineral\b.{0,55}\b(import|dependency|supply|constraint|shortage)/i],
  ["Market adoption uncertainty", /\b(EV|electric vehicle|market share|adoption)\b.{0,55}\b(uncertain|slow|limit|constraint|price)/i],
  ["Emissions attribution", /\b(emission|CO2|carbon)\b.{0,55}\b(attribution|uncertain|grid|lifecycle|assumption)/i],
];
const KPASS_CONSTRAINT_PATTERNS = [
  ["Enrollment friction", /\b(enrollment|registration|membership|conversion|회원|가입|전환)\b.{0,45}\b(barrier|delay|friction|failure|제약|어려움|지연)/i],
  ["Usage-data processing", /\b(usage|record|data|이용.{0,6}기록|데이터)\b.{0,45}\b(delay|mismatch|error|latency|지연|오류|불일치)/i],
  ["Refund delivery", /\b(refund|settlement|환급|정산)\b.{0,45}\b(delay|error|failure|bottleneck|지연|오류|병목)/i],
  ["Minimum-use threshold", /\b(15 rides|15회|minimum.use|최소.{0,8}이용)\b/i],
  ["Regional coverage", /\b(local government|region|지역|지자체)\b.{0,45}\b(gap|uneven|capacity|budget|격차|불균형|재정)/i],
  ["Digital access", /\b(app|website|digital|앱|누리집|디지털)\b.{0,45}\b(access|barrier|literacy|접근|장벽)/i],
];

function configurePolicyTree(precomputed){
  currentPolicyMeta = precomputed.policy || currentPolicyMeta;
  currentPolicyKey = currentPolicyMeta.key || currentPolicyKey;
  TREE_PHASES = precomputed.available_phases?.length
    ? [...precomputed.available_phases]
    : [...(precomputed.phases || TREE_PHASES)];
  document.title = currentPolicyMeta.title || "Policy Pathway Explorer";
  const roles = currentPolicyMeta.roles || [];
  STAKEHOLDER_SEATS = roles.map((role, index)=>({
    role:role.key,
    color:TREE_ROLE_COLORS[index % TREE_ROLE_COLORS.length],
    avatar:currentPolicyKey === "usa/chi_nsa" ? NSA_AVATARS[role.key] : null,
  }));
  STAKEHOLDER_VIEWPOINTS = Object.fromEntries(roles.map(role=>[role.key, role.label]));
  const schema = {};
  (precomputed.phases || TREE_PHASES).forEach(phaseName=>{
    const node = (precomputed.nodes || []).find(item=>item.phase?.phase === phaseName);
    const post = node?.phase?.posts?.[0];
    schema[phaseName] = Object.keys(post?.prediction_values || {}).map(key=>[
      key,
      TREE_FIELD_LABELS[key] || key.replaceAll("_", " "),
    ]);
  });
  TREE_PHASE_SCHEMA = schema;
  if(currentPolicyKey === "usa/chi_ctc"){
    CONSTRAINT_PATTERNS = CTC_CONSTRAINT_PATTERNS;
    IMPACT_CONSTRAINT_PATTERNS = CTC_IMPACT_CONSTRAINT_PATTERNS;
  }else if(currentPolicyKey === "usa/chi_clean_vehicle"){
    CONSTRAINT_PATTERNS = CV_CONSTRAINT_PATTERNS;
    IMPACT_CONSTRAINT_PATTERNS = CV_IMPACT_CONSTRAINT_PATTERNS;
  }else if(currentPolicyKey === "kor/chi_kpass"){
    CONSTRAINT_PATTERNS = KPASS_CONSTRAINT_PATTERNS;
    IMPACT_CONSTRAINT_PATTERNS = KPASS_CONSTRAINT_PATTERNS;
  }
}

function dashboardHrefTree(markComplete=false){
  if(treePreviewMode) return "study.html";
  const query = new URLSearchParams();
  ["participant", "policies", "order"].forEach(key=>{
    const value = treeQuery.get(key);
    if(value) query.set(key, value);
  });
  if(markComplete) query.set("completed", currentPolicyKey);
  return `dashboard.html${query.toString() ? `?${query.toString()}` : ""}`;
}
function policySurveyHrefTree(){
  const query = new URLSearchParams({
    stage:"policy",
    participant:treeQuery.get("participant") || "",
    policy:currentPolicyKey,
    policyIndex:treeQuery.get("policyIndex") || "0",
  });
  if(treePreviewMode) query.set("previewStudy","1");
  if(treePreviewMode && treeQuery.get("variant")) query.set("variant",treeQuery.get("variant"));
  return `survey.html?${query.toString()}`;
}
function markPolicyCompleteTree(){
  // The standalone research demo is a free exploration surface, not a study task.
  if(treeDemoMode) return true;
  if(treePreviewMode) return true;
  const answeredChats = pathwayChatTurns.filter(turn=>!turn.answers.some(answer=>answer.pending || answer.error));
  // Baseline presents one fixed path, but keeps the common stakeholder-chat task.
  if(TREE_BASELINE_MODE){
    if(!answeredChats.length){
      alert("Please ask at least one stakeholder persona a question before continuing.");
      return false;
    }
    PolicyStudy.exitEvent("policy_exploration_finished", {
      completed_paths:[...completedPathSet],
      completed_path_count:completedPathSet.size,
      visible_node_count:treeNodes.size,
      chat_turn_count:answeredChats.length,
      active_elapsed_ms:Math.round(activePolicyElapsedTree()),
    });
    return true;
  }
  if(completedPathSet.size < 2){
    alert("Please explore at least two different complete pathways through the Impact phase before continuing.");
    return false;
  }
  if(!answeredChats.length){
    alert("Please open a completed pathway and ask at least one stakeholder persona a question before continuing.");
    return false;
  }
  PolicyStudy.exitEvent("policy_exploration_finished", {
    completed_paths:[...completedPathSet],
    completed_path_count:completedPathSet.size,
    visible_node_count:treeNodes.size,
    chat_turn_count:answeredChats.length,
    active_elapsed_ms:Math.round(activePolicyElapsedTree()),
  });
  return true;
}

function logTreeEvent(eventType, payload={}, elapsedMs=null){
  return PolicyStudy.event(eventType, payload, elapsedMs);
}

function activePolicyElapsedTree(){
  return activeElapsedMs + (activeSegmentStartedAt == null ? 0 : performance.now() - activeSegmentStartedAt);
}

function updateTreeZoom(nextScale){
  const canvas = document.querySelector(".tree-canvas");
  const stage = document.querySelector(".tree-canvas-stage");
  const content = document.querySelector(".tree-canvas-content");
  if(!canvas || !stage || !content) return;
  const oldScale = TREE_VIEW_SCALE;
  const centerX = (canvas.scrollLeft + canvas.clientWidth / 2) / oldScale;
  const centerY = (canvas.scrollTop + canvas.clientHeight / 2) / oldScale;
  TREE_VIEW_SCALE = Math.max(TREE_VIEW_SCALE_MIN, Math.min(TREE_VIEW_SCALE_MAX, Number(nextScale.toFixed(2))));
  const width = Number.parseFloat(content.style.width) || 0;
  const height = Number.parseFloat(content.style.height) || 0;
  content.style.setProperty("--tree-view-scale", TREE_VIEW_SCALE);
  stage.style.width = `${Math.ceil(width * TREE_VIEW_SCALE)}px`;
  stage.style.height = `${Math.ceil(height * TREE_VIEW_SCALE)}px`;
  const label = document.querySelector("[data-tree-zoom-label]");
  if(label) label.textContent = `${Math.round(TREE_VIEW_SCALE * 100)}%`;
  const zoomOut = document.querySelector("[data-tree-zoom-out]");
  const zoomIn = document.querySelector("[data-tree-zoom-in]");
  if(zoomOut) zoomOut.disabled = TREE_VIEW_SCALE <= TREE_VIEW_SCALE_MIN;
  if(zoomIn) zoomIn.disabled = TREE_VIEW_SCALE >= TREE_VIEW_SCALE_MAX;
  requestAnimationFrame(()=>{
    canvas.scrollLeft = Math.max(0, centerX * TREE_VIEW_SCALE - canvas.clientWidth / 2);
    canvas.scrollTop = Math.max(0, centerY * TREE_VIEW_SCALE - canvas.clientHeight / 2);
    updateTreeViewport();
  });
  logTreeEvent("tree_zoom_changed", {scale:TREE_VIEW_SCALE});
}

function renderTreeZoomControls(){
  if(TREE_BASELINE_MODE) return "";
  return `<div class="tree-zoom-controls" aria-label="Pathway zoom controls">
    <button type="button" data-tree-zoom-out title="Zoom out" aria-label="Zoom out"><i data-lucide="minus"></i></button>
    <span data-tree-zoom-label>${Math.round(TREE_VIEW_SCALE * 100)}%</span>
    <button type="button" data-tree-zoom-in title="Zoom in" aria-label="Zoom in"><i data-lucide="plus"></i></button>
  </div>`;
}

function closeTimedPanel(kind){
  const openedAt = kind === "discussion" ? discussionOpenedAt : kind === "report" ? reportOpenedAt : chatOpenedAt;
  if(openedAt == null) return;
  logTreeEvent(`${kind}_closed`, {
    path:kind === "chat" ? pathwayChatPath : kind === "report" ? reportPath : discussionNodeKey,
  }, performance.now() - openedAt);
  if(kind === "discussion") discussionOpenedAt = null;
  if(kind === "report") reportOpenedAt = null;
  if(kind === "chat") chatOpenedAt = null;
}

function captureTreeViewport(){
  const canvas = document.querySelector(".tree-canvas");
  return {
    canvasLeft: canvas?.scrollLeft || 0,
    canvasTop: canvas?.scrollTop || 0,
    pageX: window.scrollX || 0,
    pageY: window.scrollY || 0,
  };
}
function captureTreeAnchor(path){
  const canvas = document.querySelector(".tree-canvas");
  const node = [...document.querySelectorAll(".tree-node")]
    .find(element=>element.dataset.path === path);
  if(!canvas || !node) return null;
  const canvasRect = canvas.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  return {
    path,
    left:nodeRect.left - canvasRect.left,
    top:nodeRect.top - canvasRect.top,
  };
}
function restoreTreeViewport(viewport, anchor=null){
  if(!viewport) return;
  const apply = () => {
    const canvas = document.querySelector(".tree-canvas");
    if(canvas){
      canvas.scrollLeft = viewport.canvasLeft;
      canvas.scrollTop = viewport.canvasTop;
      if(anchor){
        const node = [...canvas.querySelectorAll(".tree-node")]
          .find(element=>element.dataset.path === anchor.path);
        if(node){
          const canvasRect = canvas.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();
          canvas.scrollLeft += (nodeRect.left - canvasRect.left) - anchor.left;
          canvas.scrollTop += (nodeRect.top - canvasRect.top) - anchor.top;
        }
      }
    }
    window.scrollTo(viewport.pageX, viewport.pageY);
  };
  apply();
}
function updateMiniMapViewport(){
  const canvas = document.querySelector(".tree-canvas");
  const svg = document.querySelector(".minimap-frame svg");
  const viewport = document.querySelector(".minimap-view");
  if(!canvas || !svg || !viewport) return;
  const mapWidth = Number(svg.dataset.mapWidth || 0);
  const mapHeight = Number(svg.dataset.mapHeight || 0);
  if(!mapWidth || !mapHeight) return;
  viewport.setAttribute("x", String(Math.max(0, canvas.scrollLeft / TREE_VIEW_SCALE)));
  viewport.setAttribute("y", String(Math.max(0, canvas.scrollTop / TREE_VIEW_SCALE)));
  viewport.setAttribute("width", String(Math.min(mapWidth, canvas.clientWidth / TREE_VIEW_SCALE)));
  viewport.setAttribute("height", String(Math.min(mapHeight, canvas.clientHeight / TREE_VIEW_SCALE)));
}
function moveCanvasFromMiniMap(event){
  const canvas = document.querySelector(".tree-canvas");
  const svg = event.currentTarget.querySelector("svg");
  if(!canvas || !svg || !svg.getScreenCTM()) return;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const mapped = point.matrixTransform(svg.getScreenCTM().inverse());
  canvas.scrollLeft = Math.max(0, mapped.x * TREE_VIEW_SCALE - canvas.clientWidth / 2);
  canvas.scrollTop = Math.max(0, mapped.y * TREE_VIEW_SCALE - canvas.clientHeight / 2);
  updateMiniMapViewport();
}

function bindTreeCanvasPan(canvas){
  if(!canvas) return;
  let drag = null;
  canvas.addEventListener("pointerdown", event=>{
    if(event.button !== 0 || event.target.closest("button, a, input, textarea, select")) return;
    drag = {
      pointerId:event.pointerId,
      x:event.clientX,
      y:event.clientY,
      left:canvas.scrollLeft,
      top:canvas.scrollTop,
    };
    canvas.classList.add("is-panning");
    canvas.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  canvas.addEventListener("pointermove", event=>{
    if(!drag || event.pointerId !== drag.pointerId) return;
    canvas.scrollLeft = drag.left - (event.clientX - drag.x);
    canvas.scrollTop = drag.top - (event.clientY - drag.y);
    updateMiniMapViewport();
  });
  const endPan = event=>{
    if(!drag || event.pointerId !== drag.pointerId) return;
    drag = null;
    canvas.classList.remove("is-panning");
    if(canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener("pointerup", endPan);
  canvas.addEventListener("pointercancel", endPan);
}

function escTree(s){ return String(s ?? "").replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function fmtTree(x){ if(x==null||isNaN(x)) return "-"; return (Math.abs(x)>=100?Math.round(x):Math.round(x*10)/10).toLocaleString(); }
function stanceTree(key){ return treeData.stances.find(s=>s.key===key); }
function phasePostsTree(phase){ return phase?.posts || phase?.revised_posts || phase?.initial_posts || []; }
function phaseValuesTree(phase){
  const out = {};
  Object.entries(phase?.grounded_values || {}).forEach(([k,v])=>{
    if(typeof v === "number" && !Number.isNaN(v)) out[k] = [v];
  });
  phasePostsTree(phase).forEach(p=>{
    Object.entries(p.prediction_values || {}).forEach(([k,v])=>{
      if(typeof v === "number" && !Number.isNaN(v)) (out[k] ||= []).push(v);
    });
  });
  return Object.fromEntries(Object.entries(out).map(([k,arr])=>[k, arr.reduce((a,b)=>a+b,0)/arr.length]));
}
function fieldTree(k){ return TREE_FIELD_LABELS[k] || String(k || "").replaceAll("_"," "); }
const TREE_SOURCE_LABELS = {
  "ARPA_Sec9611_plus_IRS_2021_Child_Tax_Credit_Toolkit.pdf":"American Rescue Plan Act §9611 and IRS 2021 Child Tax Credit Toolkit",
  "us_ccdf.pdf":"ARP Act Child Care Stabilization Grants Guidance",
};
function groundedSourcesTree(phase){
  const parameterEvidence = (phase?.grounded_policy_parameters || []).flatMap(item=>item?.evidence || []);
  return [...new Set([...(phase?.grounded_evidence || []), ...parameterEvidence]
    .map(item=>String(item?.source || "").trim())
    .filter(Boolean))]
    .map(source=>TREE_SOURCE_LABELS[source] || source.replace(/\.pdf$/i, "").replaceAll("_", " "));
}
function sentenceTree(s, n=1){
  return summarySentencesTree(s).slice(0,n).join(" ");
}
function nodeId(node){ return node.path; }
function rootNode(){
  if(precomputedTreeNodes?.has("root")) return precomputedTreeNodes.get("root");
  return {path:"root", parent:null, stance:"neutral", col:0, phase:stanceTree("neutral").phases[0], x:82, y:260};
}
function nodeFromPath(path){
  if(path === "root") return rootNode();
  if(precomputedTreeNodes?.has(path)) return precomputedTreeNodes.get(path);
  const parts = path.split("/").slice(1);
  const stance = parts[parts.length - 1];
  const col = parts.length;
  return {path, parent:parts.length === 1 ? "root" : `root/${parts.slice(0,-1).join("/")}`, stance, col, phase:stanceTree(stance).phases[col]};
}
function childPaths(path){
  if(precomputedTreeNodes){
    // baseline 조건: all-baseline 경로의 다음 노드 하나만 노출 (형제 분기 비노출)
    const transitions = TREE_BASELINE_MODE ? [BASELINE_TRANSITION] : PRECOMPUTED_TRANSITION_ORDER;
    return transitions
      .map(transition=>`${path}/${transition}`)
      .filter(childPath=>precomputedTreeNodes.has(childPath));
  }
  const node = nodeFromPath(path);
  if(node.col >= TREE_PHASES.length - 1) return [];
  if(TREE_BASELINE_MODE) return [`${path}/${BASELINE_TRANSITION}`];
  return TREE_STANCE_ORDER.map(stance=>`${path}/${stance}`);
}
/* baseline 경로 전체(root → Impact)를 한 번에 펼친다.
   Ours는 사용자가 조건을 골라가며 확장하지만, baseline은 선택 행위가 없으므로
   단일 궤적을 처음부터 전부 제시한다. */
function expandBaselineChain(){
  let path = "root";
  let guard = 0;
  while(guard < TREE_PHASES.length + 2){
    const children = childPaths(path);
    if(!children.length) break;
    addChildren(path);
    path = children[0];
    guard += 1;
  }
  return path;
}
function addChildren(path){
  const parent = treeNodes.get(path) || nodeFromPath(path);
  // 114px-tall cards with 146px center spacing leave a 32px visual gap,
  // approximately half of the previous 66px gap.
  const siblingGap = 146;
  const groupGap = 160;
  const offsets = [-siblingGap, 0, siblingGap];
  const childCol = parent.col + 1;
  const existing = [...treeNodes.values()]
    .filter(n => n.col === childCol && n.parent !== path)
    .map(n => n.y);
  let groupTop = Math.max(116, parent.y + offsets[0]);
  let guard = 0;
  const groupConflicts = top => offsets.some(offset =>
    existing.some(otherY => Math.abs(otherY - (top - offsets[0] + offset)) < groupGap)
  );
  while(groupConflicts(groupTop) && guard < 80){
    groupTop += groupGap;
    guard += 1;
  }
  const baseY = groupTop - offsets[0];
  childPaths(path).forEach((childPath, i)=>{
    if(treeNodes.has(childPath)) return;
    const child = nodeFromPath(childPath);
    treeNodes.set(childPath, {
      ...child,
      x:parent.x + 245,
      y:baseY + offsets[i],
    });
    newlyAddedPaths.add(childPath);
  });
  expandedPaths.add(path);
}
function visibleNodes(){
  return [...treeNodes.values()].sort((a,b)=>a.col-b.col || a.y-b.y || a.path.localeCompare(b.path));
}
function layoutNodes(nodes){
  const nodeMap = new Map(nodes.map(n=>[n.path,n]));
  const positions = new Map();
  let cursorY = 132;
  // Keep 114px cards separated by a compact 32px unscaled visual gap.
  // This gives E/B/C siblings roughly half the previous whitespace without
  // allowing card borders or shadows to overlap.
  const leafGap = 146;
  const colX = col => 82 + col * TREE_COL_GAP;
  const childOrder = precomputedTreeNodes
    ? PRECOMPUTED_TRANSITION_ORDER
    : TREE_STANCE_ORDER;
  const orderedVisibleChildren = path => childOrder
    .map(stance=>`${path}/${stance}`)
    .filter(childPath=>nodeMap.has(childPath));
  const place = path => {
    const node = nodeMap.get(path);
    if(!node) return {top:cursorY, bottom:cursorY, y:cursorY};
    const children = orderedVisibleChildren(path);
    if(!children.length){
      const y = cursorY;
      positions.set(path, {x:colX(node.col), y});
      cursorY += leafGap;
      return {top:y, bottom:y, y};
    }
    const ranges = children.map(place);
    const first = ranges[0];
    const last = ranges[ranges.length - 1];
    const y = (first.y + last.y) / 2;
    positions.set(path, {x:colX(node.col), y});
    return {
      top:Math.min(y, first.top),
      bottom:Math.max(y, last.bottom),
      y,
    };
  };
  place("root");
  nodes.forEach(n=>{
    if(!positions.has(n.path)){
      const y = cursorY;
      positions.set(n.path, {x:colX(n.col), y});
      cursorY += leafGap;
    }
  });
  const minY = Math.min(...[...positions.values()].map(p=>p.y), 80);
  const shiftY = Math.max(0, 88 - minY);
  if(shiftY){
    positions.forEach((pos, path)=>positions.set(path, {...pos, y:pos.y + shiftY}));
  }
  const maxX = Math.max(...[...positions.values()].map(p=>p.x), 1040);
  if(TREE_BASELINE_MODE){
    const nodeHalfHeight = 64;
    const verticalPadding = 72;
    const nodeTop = Math.min(...[...positions.values()].map(p=>p.y)) - nodeHalfHeight;
    const nodeBottom = Math.max(...[...positions.values()].map(p=>p.y)) + nodeHalfHeight;
    const baselineShift = verticalPadding - nodeTop;
    positions.forEach((pos, path)=>positions.set(path, {...pos, y:pos.y + baselineShift}));
    return {
      positions,
      height:nodeBottom + baselineShift + verticalPadding,
      width:maxX + 280,
      minY:verticalPadding,
    };
  }
  const maxY = Math.max(...[...positions.values()].map(p=>p.y), 720);
  // Keep enough scrollable space below the tree for viewport anchoring when
  // an expanded subtree recenters its ancestors.
  return {positions, height:maxY + 520, width:maxX + 280, minY:minY + shiftY};
}
function focusedTreeNode(){
  return treeNodes.get(focusedPath) || nodeFromPath(focusedPath || "root");
}
function nodeFieldLabelTree(label, maxWords=3){
  const words = String(label || "").trim().split(/\s+/).filter(Boolean);
  return words.length > maxWords ? `${words.slice(0, maxWords).join(" ")}…` : words.join(" ");
}
function metricRowsTree(phase, limit=3, compactInput=false, compactNodeLabel=false){
  const useFullLabel = phase?.phase === "Outcomes";
  return Object.entries(phaseValuesTree(phase)).slice(0, limit).map(([k,v])=>{
    const fullLabel = useFullLabel ? fieldTree(k) : (COMPACT_PREDICTION_LABELS[k] || fieldTree(k));
    const label = compactNodeLabel ? nodeFieldLabelTree(fullLabel) : fullLabel;
    return `<span class="tree-metric"><small title="${escTree(fieldTree(k))}">${escTree(label)}</small><b>${compactInput ? compactInputValueTree(k, v) : escTree(predictionValueTree(k, v))}</b></span>`;
  }).join("");
}
function verifiedInputRowsTree(phase, limit=6){
  const fields = Object.entries(phase?.grounded_values || {}).map(([key,value])=>({key,value}));
  const seen = new Set(fields.map(item=>item.key));
  (phase?.grounded_policy_parameters || [])
    .filter(item=>item?.validation_status === "validated" && !seen.has(item.name))
    .slice(0, Math.max(0, limit - fields.length))
    .forEach(item=>{
      seen.add(item.name);
      fields.push({key:item.name, value:item.value});
    });
  const capacityFields = new Set([
    "irs_advance_payment_administration_funding",
    "bureau_of_fiscal_service_implementation_funding",
    "total_stabilization_funding",
    "tribal_base_amount",
  ]);
  const timelineFields = new Set([
    "advance_payment_period",
    "arp_act_enactment_date",
    "obligation_deadline",
    "liquidation_deadline",
  ]);
  const groups = [
    {label:"Implementation capacity", items:[]},
    {label:"Policy design", items:[]},
    {label:"Implementation timeline", items:[]},
  ];
  fields.slice(0, limit).forEach(item=>{
    const group = capacityFields.has(item.key) ? groups[0] : timelineFields.has(item.key) ? groups[2] : groups[1];
    group.items.push(item);
  });
  return groups.filter(group=>group.items.length).map(group=>`<section class="verified-input-group">
    <h4>${escTree(group.label)}</h4>
    ${group.items.map(({key,value})=>`<span class="tree-metric"><small title="${escTree(fieldTree(key))}">${escTree(fieldTree(key))}</small><b>${escTree(predictionValueTree(key, value))}</b></span>`).join("")}
  </section>`).join("");
}
function hideNodeMetricsTree(phase){
  return ["Activities","Outputs"].includes(String(phase?.phase || ""));
}
function nodeWidthTree(nodeOrPhase){
  const phase = nodeOrPhase?.phase ? nodeOrPhase.phase : nodeOrPhase;
  return hideNodeMetricsTree(phase) ? TREE_COMPACT_NODE_WIDTH : TREE_NODE_WIDTH;
}
function constraintTagsTree(phase, limit=2){
  const counts = new Map();
  phasePostsTree(phase).forEach(p=>{
    (p.rationale_summary?.key_constraints || []).forEach(x=>{
      const key = String(x || "").trim();
      if(key) counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).slice(0, limit).map(([tag])=>`<em>${escTree(tag)}</em>`).join("");
}
function compactInputValueTree(key, value){
  if(key === "annual_budget_krw" && Number.isFinite(Number(value))) return `${fmtTree(Number(value) / 100000000)}억`;
  if(key === "regional_quota_percent" && Number.isFinite(Number(value))) return `${fmtTree(value)}%`;
  if(key.endsWith("_usd") && Number.isFinite(Number(value))){
    const amount = Number(value);
    if(Math.abs(amount) >= 1000000) return `$${fmtTree(amount / 1000000)}M`;
    if(Math.abs(amount) >= 1000) return `$${fmtTree(amount / 1000)}K`;
  }
  return escTree(predictionValueTree(key, value));
}
function dominantConstraintsTree(phase, limit=2){
  const constraintCounts = new Map();
  phasePostsTree(phase).forEach(post=>{
    cleanConstraintTagsTree(post, 2).forEach(tag=>
      constraintCounts.set(tag, (constraintCounts.get(tag) || 0) + 1)
    );
  });
  return [...constraintCounts.entries()]
    .sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag])=>tag);
}
function processPhaseContentTree(phase){
  const constraints = dominantConstraintsTree(phase, 2);
  const fallbacks = phase.phase === "Activities"
    ? ["Operational capacity", "Implementation readiness"]
    : ["Delivery reliability", "Implementation gaps"];
  return `<span class="tree-node-constraint-list">${(constraints.length ? constraints : fallbacks).map(tag=>
    `<em title="${escTree(tag)}">${escTree(tag)}</em>`
  ).join("")}</span>`;
}
function impactConstraintsTree(phase, limit=2){
  const documents = [phase.phase_summary || "", ...phasePostsTree(phase).map(stakeholderTakeTree)];
  return IMPACT_CONSTRAINT_PATTERNS.map(([tag, pattern], order)=>({
    tag,
    order,
    count:documents.reduce((total, document)=>total + (pattern.test(String(document || "")) ? 1 : 0), 0),
  }))
    .filter(item=>item.count > 0)
    .sort((a,b)=>b.count-a.count || a.order-b.order)
    .slice(0, limit)
    .map(item=>item.tag);
}
function impactPhaseContentTree(phase){
  const constraints = impactConstraintsTree(phase, 2);
  const fallbacks = currentPolicyKey === "usa/chi_ctc"
    ? ["Long-term attribution uncertainty", "Temporary policy horizon"]
    : ["Long-term enforcement gaps", "Persistent rural access gaps"];
  return `<span class="tree-node-constraint-list">${(constraints.length ? constraints : fallbacks).map(tag=>
    `<em title="${escTree(tag)}">${escTree(tag)}</em>`
  ).join("")}</span>`;
}
function topPredictionTree(p){
  const entries = Object.entries(p.prediction_values || {}).filter(([,v])=>typeof v === "number" && !Number.isNaN(v));
  if(!entries.length) return null;
  const preferred = entries.find(([k])=>k.includes("sci_e") || k.includes("transition") || k.includes("fellows")) || entries[0];
  return {field:fieldTree(preferred[0]), value:fmtTree(preferred[1])};
}
function stakeholderTakeTree(p){
  return p.rationale_summary?.narrative_rationale || p.narrative || "";
}
function stakeholderViewpointTree(p){
  return STAKEHOLDER_VIEWPOINTS[String(p.stakeholder_type || "").toLowerCase()]
    || String(p.stakeholder_type || "stakeholder").replaceAll("_", " ");
}
function summarySentencesTree(text){
  const decimalMark = "\uE000";
  const protectedText = String(text || "")
    .replace(/\s+/g," ")
    .replace(/(\d)\.\s*(?=\d)/g, `$1${decimalMark}`);
  return (protectedText.match(/[^.!?。]+[.!?。]+|[^.!?。]+$/g) || [])
    .map(sentence=>sentence.replaceAll(decimalMark, ".").trim());
}
function stakeholderSummaryTree(p){
  return sentenceTree(stakeholderTakeTree(p), 4);
}
function stakeholderOpinionTree(p){
  return stakeholderSummaryTree(p);
}
function stakeholderBriefOpinionTree(p){
  return sentenceTree(stakeholderTakeTree(p), 1);
}
function cleanConstraintTagsTree(p, limit=2){
  const blocked = /^(explicit|implicit|none|n\/a|na)$/i;
  const seen = new Set();
  const explicit = (p.rationale_summary?.key_constraints || [])
    .map(x=>String(x || "").trim())
    .filter(x=>x && !blocked.test(x) && !/explicit/i.test(x))
    .filter(x=>{
      const key = x.toLowerCase();
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const narrative = stakeholderTakeTree(p);
  const derived = CONSTRAINT_PATTERNS
    .filter(([, pattern])=>pattern.test(narrative))
    .map(([tag])=>tag)
    .filter(tag=>{
      const key = tag.toLowerCase();
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return [...explicit, ...derived].slice(0, limit);
}
function constraintPillsForPostTree(p, preparedTags=null){
  const tags = preparedTags || cleanConstraintTagsTree(p, 1);
  if(!tags.length) return "";
  return `<section class="discussion-constraints">
    <b>Key constraints</b>
    <span class="speech-tags">${tags.map(t=>`<i>${escTree(t)}</i>`).join("")}</span>
  </section>`;
}
function predictionValueTree(key, value){
  if(!Number.isFinite(Number(value))) return String(value ?? "-");
  const numeric = fmtTree(Number(value));
  if(["monthly_cost_sharing_cap","total_stabilization_funding","tribal_base_amount","irs_advance_payment_administration_funding","maximum_credit_per_child_under_age_6","maximum_credit_per_child_age_6_to_17","bureau_of_fiscal_service_implementation_funding"].includes(key)) return `$${numeric}`;
  if(key === "maximum_advance_payment_share") return `${numeric}%`;
  if(["additional_compliance_burden_for_business","one_time_transition_cost_for_business","additional_administrative_compliance_cost"].includes(key)) return `€${numeric}`;
  if(key === "annual_program_budget_million_krw") return `${numeric} million KRW`;
  if(key === "max_co_funding_per_project_sgd") return `S$${numeric}`;
  if(key === "reimbursement_deadline_days") return `${numeric} days`;
  if(key.endsWith("_pp")) return `${numeric} pp`;
  if(key.includes("_usd")) return `$${numeric}`;
  if(key.endsWith("_pct") || key.endsWith("_rate") || key.endsWith("_percent") || key.endsWith("_percentage")) return `${numeric}%`;
  return numeric;
}
const COMPACT_PREDICTION_LABELS = {
  federal_enforcement_budget_usd:"Budget",
  certified_idr_entities:"IDR entities",
  certified_idr_entity_count:"IDR entities",
  qpa_ready_plan_pct:"QPA ready",
  qpa_calculations_completed:"QPA completed",
  idr_cases_initiated:"IDR cases",
  timely_initial_payment_or_denial_rate:"Timely decisions",
  protected_claims_correctly_processed_rate:"Correct claims",
  notice_compliance_rate:"Notice compliance",
  timely_idr_determination_rate:"Timely IDR",
  emergency_oon_bill_prevalence_reduction_pp:"Emergency reduction",
  nonemergency_oon_bill_prevalence_reduction_pp:"Non-emergency reduction",
  patient_savings_per_protected_claim_usd:"Patient savings",
  network_adequacy_rate_pct:"Network adequacy",
  systemic_oon_billing_prevalence_pct:"OON prevalence",
  premium_change_attributable_to_nsa_pct:"Premium change",
  irs_administrative_budget_usd:"IRS budget",
  irs_staff_allocated_ftes:"IRS staff",
  non_filer_outreach_budget_usd:"Outreach budget",
  advance_payment_disbursements_count:"Payments",
  portal_account_updates_processed:"Portal updates",
  non_filer_sign_up_tool_submissions_processed:"Non-filer sign-ups",
  average_monthly_payment_per_child_dollars:"Payment / child",
  eligible_families_receiving_at_least_one_payment:"Families reached",
  non_filer_households_receiving_payments:"Non-filers reached",
  spm_child_poverty_rate_2021_pct:"Child poverty",
  spm_child_poverty_relative_reduction_2020_2021_pct:"Poverty reduction",
  low_income_food_insufficiency_relative_reduction_pct:"Food reduction",
  spm_black_child_poverty_rate_2021_pct:"Black children",
  spm_hispanic_child_poverty_rate_2021_pct:"Hispanic children",
  intergenerational_income_mobility_index:"Mobility",
  child_health_outcome_composite_score:"Child health",
  long_term_healthcare_cost_savings_usd:"Health savings"
};
function discussionPredictionsTree(p){
  const entries = Object.entries(p.prediction_values || {});
  if(!entries.length) return "";
  return `<section class="discussion-predictions">
    <b>Predictions</b>
    <dl>${entries.map(([key, value])=>`
      <div>
        <dt title="${escTree(fieldTree(key))}">${escTree(COMPACT_PREDICTION_LABELS[key] || fieldTree(key))}</dt>
        <dd>${escTree(predictionValueTree(key, value))}</dd>
      </div>
    `).join("")}</dl>
  </section>`;
}
function isPathAncestorTree(path, target=focusedPath){
  if(path === "root") return true;
  return target === path || target.startsWith(`${path}/`);
}
function pathStancesTree(path){
  return path === "root" ? [] : path.split("/").slice(1);
}
function pathLabelTree(path){
  const node = treeNodes.get(path) || nodeFromPath(path);
  if(path === "root") return "Policy Input";
  const parts = pathStancesTree(path).map(k=>TREE_STANCES[k]?.short || k);
  return `${node.col+1}. ${TREE_PHASE_KO[node.phase?.phase] || node.phase?.phase} · ${parts.join(" → ")}`;
}
function miniPathTree(path){
  const parts = pathStancesTree(path);
  return `<span class="mini-path">
    <i style="--dot:#C079D8">1</i>
    ${parts.map((k,i)=>`<i style="--dot:${TREE_STANCES[k]?.color || "#999"}">${i+2}</i>`).join("")}
  </span>`;
}
function pathMetricPreviewTree(path){
  const node = treeNodes.get(path) || nodeFromPath(path);
  const values = Object.entries(phaseValuesTree(node.phase || {})).slice(0,2);
  if(!values.length) return "No predictions yet";
  return values.map(([k,v])=>`${fieldTree(k)} ${fmtTree(v)}`).join(" · ");
}
function pathNodesTree(path){
  const parts = pathStancesTree(path);
  const paths = ["root"];
  parts.forEach((_, i)=>paths.push(`root/${parts.slice(0, i + 1).join("/")}`));
  return paths.map(p=>treeNodes.get(p) || nodeFromPath(p));
}
function phaseMetricListTree(phase, limit=3){
  const values = Object.entries(phaseValuesTree(phase || {})).slice(0, limit);
  if(!values.length) return "";
  return `<dl class="report-metrics">${values.map(([k,v])=>`
    <div><dt>${escTree(fieldTree(k))}</dt><dd>${fmtTree(v)}</dd></div>
  `).join("")}</dl>`;
}
function phaseConstraintDataTree(phase, limit=3){
  const counts = new Map();
  phasePostsTree(phase || {}).forEach(post=>{
    cleanConstraintTagsTree(post, limit).forEach(tag=>{
      const key = tag.toLowerCase();
      const current = counts.get(key) || {tag, count:0};
      counts.set(key, {...current, count:current.count + 1});
    });
  });
  return [...counts.values()]
    .sort((a,b)=>b.count - a.count || a.tag.localeCompare(b.tag, "ko"))
    .slice(0, limit);
}
function reportConstraintSummaryTree(phase, constraints){
  const summary = String(phase?.phase_summary || "").replace(/\s+/g, " ").trim();
  const sentences = summarySentencesTree(summary);
  const constraintSentence = sentences.find(sentence=>/constraint|bottleneck|insufficient|shortage|delay|gap|limit|risk/i.test(sentence));
  if(constraintSentence) return constraintSentence.trim();
  if(constraints.length) return `Key constraints identified at this phase: ${constraints.map(({tag})=>tag).join(", ")}.`;
  return "No shared constraint was explicitly identified at this phase.";
}
function reportConstraintsTree(phase, limit=3){
  const constraints = phaseConstraintDataTree(phase, limit);
  return `<section class="report-constraints" aria-label="Key constraints">
    <div class="report-subhead">Key constraints</div>
    <p>${escTree(reportConstraintSummaryTree(phase, constraints))}</p>
    ${constraints.length ? `<div class="report-constraint-tags">${constraints.map(({tag, count})=>
      `<span>#${escTree(tag)}${count > 1 ? ` <b>${count}</b>` : ""}</span>`
    ).join("")}</div>` : ""}
  </section>`;
}
function reportPhaseTextTree(nodes, index){
  const node = nodes[index];
  const phase = node.phase || {};
  const stance = stanceLabelTree(node);
  const summary = sentenceTree(phase.phase_summary || "", 2);
  const lead = [
    "The pathway begins with the policy resources and implementation capacity available at launch.",
    "These inputs shape the actions taken by implementing organizations and affected stakeholders.",
    "Implementation activity produces direct delivery, coverage, and reach outputs.",
    "These outputs shape the policy's near-term target outcomes.",
    "The final phase considers whether near-term outcomes extend into durable systemic effects.",
  ][index] || "";
  return `${lead} Under the ${stance}, ${summary}`;
}
function reportFinalPredictionTextTree(nodes){
  const finalNode = nodes[nodes.length - 1] || {};
  const values = phaseValuesTree(finalNode.phase || {});
  const stance = stanceLabelTree(finalNode);
  const metrics = Object.entries(values).slice(0,3).map(([key,value])=>`${fieldTree(key)} ${predictionValueTree(key,value)}`);
  const closing = window.TREE_BASELINE_MODE === true
    ? "These are exploratory estimates rather than definitive forecasts."
    : "These are exploratory results conditioned on the selected pathway rather than definitive forecasts.";
  if(metrics.length){
    return `The ${stance} projects ${metrics.join(", ")}. ${closing}`;
  }
  return window.TREE_BASELINE_MODE === true
    ? "The final estimates describe whether near-term policy outcomes persist over time."
    : "The final estimates describe whether near-term policy outcomes persist under the selected exploratory pathway.";
}
function renderPathReportModal(){
  if(!reportPath) return "";
  const nodes = pathNodesTree(reportPath);
  const finalNode = nodes[nodes.length - 1] || focusedTreeNode();
  const finalTone = TREE_STANCES[finalNode.stance] || TREE_STANCES.neutral;
  const route = nodes.map((node, i)=>{
    const phase = TREE_PHASE_KO[node.phase?.phase] || node.phase?.phase || TREE_PHASES[i];
    // baseline: 경로 요약에서 전이 라벨을 생략 (단계명만 표시)
    if(window.TREE_BASELINE_MODE === true) return `${i + 1}. ${phase}`;
    const stance = node.col === 0 ? "Input" : TREE_STANCES[node.stance]?.label || node.stance;
    return `${i + 1}. ${phase}${i === 0 ? "" : ` (${stance})`}`;
  }).join(" → ");
  const sections = nodes.map((node, i)=>{
    const phase = node.phase || {};
    const tone = node.col === 0 ? TREE_STANCES.neutral : (TREE_STANCES[node.stance] || TREE_STANCES.neutral);
    return `<article class="report-phase" style="--lane:${tone.color}">
      <div class="report-phase-head">
        <span>${i + 1}</span>
        <div>
          <b>${escTree(TREE_PHASE_KO[phase.phase] || phase.phase)}</b>
          <em>${node.col === 0 ? "Policy Input" : escTree(tone.label)}</em>
        </div>
      </div>
      <div class="report-phase-content">
        <div class="report-subhead">Quantitative estimates</div>
        ${phaseMetricListTree(phase, 3)}
        <p>${escTree(reportPhaseTextTree(nodes, i))}</p>
        ${reportConstraintsTree(phase, 3)}
      </div>
    </article>`;
  }).join("");
  return `<div class="tree-modal-backdrop" data-close-report="1">
    <section class="tree-report-modal report-document" style="--lane:${finalTone.color}" role="dialog" aria-modal="true" aria-label="Pathway report">
      <header class="report-document-head">
        <div>
          <span>Exploratory policy simulation</span>
          <h2>Pathway Outcome Report</h2>
          <p>Scenario-specific analysis of conditions, projected outcomes, and constraints across the selected policy pathway.</p>
        </div>
        <div class="report-document-actions"><div class="report-document-id"><span>Policy case</span><b>${escTree(currentPolicyMeta.label || currentPolicyMeta.title || "Policy case")}</b><em>Exploratory result</em></div><button data-close-report="1" type="button">Close</button></div>
      </header>
      <section class="report-route"><span>Selected pathway</span><p>${escTree(route)}</p></section>
      <section class="report-summary-grid">
        <div class="report-overview">
          <span class="report-section-label">Outcome overview</span>
          <h3>Final prediction summary</h3>
          <p>${escTree(reportFinalPredictionTextTree(nodes))}</p>
          ${phaseMetricListTree(finalNode.phase, 3)}
        </div>
        <aside class="report-use-note"><span>Interpretation note</span><p>These results support comparison and discussion of pathways. They are conditional exploratory simulations, not definitive policy forecasts.</p></aside>
      </section>
      <section class="report-analysis"><div class="report-analysis-head"><span>01</span><div><b>Phase-by-phase analysis</b><p>Mechanisms, quantitative estimates, and constraints along the selected route.</p></div></div><div class="report-flow">${sections}</div></section>
      <footer class="report-document-footer"><span>Policy simulation framework</span><span>Use alongside domain evidence and expert review.</span></footer>
    </section>
  </div>`;
}
function rememberCompletedPath(path){
  const node = treeNodes.get(path) || nodeFromPath(path);
  if(node.col !== TREE_PHASES.length - 1) return;
  savedPathways = [path, ...savedPathways.filter(p=>p !== path)].slice(0, 4);
}
function renderSelectedSummaryTree(){
  const node = focusedTreeNode();
  const phase = node.phase || {};
  const tone = TREE_STANCES[node.stance] || TREE_STANCES.neutral;
  const verifiedInput = phase.phase === "Inputs" && phase.state_type === "document_grounded";
  const groundedSources = groundedSourcesTree(phase);
  return `<section class="storage-summary" style="--lane:${tone.color}">
    <span>${node.col === 0 ? "Selected phase" : tone.label}</span>
    <h3>${node.col+1}. ${escTree(TREE_PHASE_KO[phase.phase] || phase.phase)}</h3>
    <div class="toc-phase-focus"><b>What this phase examines</b><p>${escTree(TREE_PHASE_FOCUS[phase.phase] || "")}</p></div>
    ${verifiedInput
      ? `<div class="verified-input-heading input-use-heading"><b>How these inputs are used</b><p>These values define the policy’s initial resources, policy rules, and implementation timeline. Subsequent pathways explore how implementation conditions and stakeholder responses shape their translation into outcomes.</p></div>`
      : `<p>${escTree(phase.phase_summary || "")}</p>`}
    <div class="storage-summary-values ${verifiedInput ? "verified-input-slots" : ""}">${verifiedInput ? verifiedInputRowsTree(phase, 6) : metricRowsTree(phase, 5)}</div>
    ${verifiedInput ? `<div class="verified-input-heading verified-input-evidence"><b>Verified from Official Policy Document</b><p>Structured through the framework’s document-processing pipeline and verified against the cited text.</p>${groundedSources.length ? `<p class="verified-input-source"><b>Source</b> ${groundedSources.map(escTree).join("; ")}</p>` : ""}</div>` : ""}
  </section>`;
}
function renderPhaseInspector(nodes, layout){
  return `<aside class="tree-phase-inspector" aria-label="Selected phase details">
    ${renderSelectedSummaryTree()}
  </aside>`;
}
function renderMiniMapTree(nodes, layout){
  const miniLines = [];
  nodes.forEach(n=>{
    if(!n.parent) return;
    const a = layout.positions.get(n.parent);
    const b = layout.positions.get(n.path);
    if(!a || !b) return;
    const selected = isPathAncestorTree(n.parent) && isPathAncestorTree(n.path) ? "selected" : "";
    const parentWidth = nodeWidthTree(treeNodes.get(n.parent) || nodeFromPath(n.parent));
    miniLines.push(`<path class="${n.stance} ${selected}" d="M${a.x+parentWidth} ${a.y} C${a.x+parentWidth+64} ${a.y}, ${b.x-58} ${b.y}, ${b.x} ${b.y}"></path>`);
  });
  const miniNodes = nodes.map(n=>{
    const pos = layout.positions.get(n.path);
    const tone = TREE_STANCES[n.stance] || TREE_STANCES.neutral;
    const focused = n.path === focusedPath ? "focused" : "";
    const w = nodeWidthTree(n);
    return `<rect class="${focused}" x="${pos.x}" y="${pos.y-63}" width="${w}" height="126" rx="10" style="--lane:${tone.color}"></rect>`;
  }).join("");
  return `<section class="tree-minimap">
    <div class="minimap-head">
      <span>Tree overview</span>
      <b>${nodes.length} nodes</b>
    </div>
    <button class="minimap-frame" data-minimap="1" type="button" aria-label="Move around the pathway tree">
      <svg viewBox="0 0 ${layout.width} ${layout.height}" preserveAspectRatio="xMidYMid meet" data-map-width="${layout.width}" data-map-height="${layout.height}" aria-hidden="true">
        <g class="minimap-lines">${miniLines.join("")}</g>
        <g class="minimap-nodes">${miniNodes}</g>
        <rect class="minimap-view" x="0" y="0" width="0" height="0" rx="8"></rect>
      </svg>
    </button>
  </section>`;
}
function renderStoragePanel(nodes, layout){
  const candidates = savedPathways;
  const savedCards = candidates.length ? candidates.map(path=>`
    <div class="saved-path-card ${path===focusedPath?"active":""}">
      <button class="saved-path-main" data-focus-path="${path}" type="button">
        ${miniPathTree(path)}
        <strong>${escTree(pathLabelTree(path))}</strong>
        <span>${escTree(pathMetricPreviewTree(path))}</span>
      </button>
      <button class="saved-path-report" data-report-path="${path}" type="button" aria-label="Open final report">
        Final Report
      </button>
    </div>
  `).join("") : `<div class="saved-path-empty">Completed pathways will appear here for comparison.</div>`;
  return `<aside class="tree-storage">
    <div class="storage-head">
      <span>F3 Path storage</span>
      <h2>Compared pathways</h2>
    </div>
    <div class="storage-list">${savedCards}</div>
    ${renderSelectedSummaryTree()}
    ${renderMiniMapTree(nodes, layout)}
  </aside>`;
}
function renderTreeNode(node, pos){
  const phase = node.phase || {};
  const isFocused = focusedNode && nodeId(focusedNode) === nodeId(node);
  const isSelectedPath = isPathAncestorTree(node.path);
  const tone = TREE_STANCES[node.stance] || TREE_STANCES.neutral;
  const expanded = expandedPaths.has(node.path);
  const isNew = newlyAddedPaths.has(node.path);
  const hideMetrics = hideNodeMetricsTree(phase);
  const isImpact = phase.phase === "Impact";
  const nodeWidth = nodeWidthTree(node);
  return `<button class="tree-node ${hideMetrics||isImpact?"process-node":""} ${phase.phase==="Outcomes"?"outcome-node":""} ${isImpact?"impact-node":""} ${expanded?"expanded":""} ${isSelectedPath?"selected-path":""} ${isFocused?"focused":""} ${isNew?"is-new":""}"
    data-path="${node.path}" data-phase-index="${node.col}" style="--x:${pos.x}px;--y:${pos.y}px;--lane:${tone.color};--node-width:${nodeWidth}px;">
    <span class="tree-node-head">
      <em>${stanceShortTree(node)}</em>
      <i>${node.col+1}</i>
    </span>
    <strong>${escTree(TREE_PHASE_KO[phase.phase] || phase.phase)}</strong>
    ${hideMetrics
      ? processPhaseContentTree(phase)
      : isImpact
        ? impactPhaseContentTree(phase)
        : `<span class="tree-node-values">${metricRowsTree(phase, 2, phase.phase === "Inputs", true)}</span>`}
  </button>`;
}
function renderTreeLines(nodes, positions, height, width){
  const lines = [];
  nodes.forEach(n=>{
    if(!n.parent) return;
    const a = positions.get(n.parent);
    const b = positions.get(n.path);
    if(!a || !b) return;
    const focused = isPathAncestorTree(n.parent) && isPathAncestorTree(n.path) ? "selected" : "";
    const isNew = newlyAddedPaths.has(n.path) ? "is-new" : "";
    const parentWidth = nodeWidthTree(treeNodes.get(n.parent) || nodeFromPath(n.parent));
    lines.push(`<path class="${n.stance} ${focused} ${isNew}" d="M${a.x+parentWidth} ${a.y} C${a.x+parentWidth+64} ${a.y}, ${b.x-58} ${b.y}, ${b.x} ${b.y}"></path>`);
  });
  return `<svg class="tree-link-layer" viewBox="0 0 ${width} ${height}" aria-hidden="true">${lines.join("")}</svg>`;
}
function pixelPerson(name, i, active=false){
  const variant = i % 5;
  return `<i class="pixel-person sprite-${variant} ${active?"active":""}" style="--px:${PIXEL_COLORS[i % PIXEL_COLORS.length]}">
    <i class="hair"></i><i class="head"></i><i class="body"></i><i class="arm left"></i><i class="arm right"></i><i class="leg left"></i><i class="leg right"></i>
    <b>${escTree(String(name || "?").slice(0,1))}</b>
  </i>`;
}
function stakeholderSeatTree(post){
  const role = String(post?.stakeholder_type || "");
  return STAKEHOLDER_SEATS.find(seat=>new RegExp(seat.role, "i").test(role));
}
function orderedStakeholderPostsTree(posts){
  const used = new Set();
  const ordered = STAKEHOLDER_SEATS.map(seat=>{
    const index = posts.findIndex((p, idx)=>!used.has(idx) && new RegExp(seat.role, "i").test(String(p.stakeholder_type || "")));
    if(index < 0) return null;
    used.add(index);
    return {post:posts[index], seat};
  }).filter(Boolean);
  posts.forEach((post, idx)=>{
    if(!used.has(idx)) ordered.push({post, seat:null});
  });
  return ordered.slice(0,5);
}
function stakeholderAvatarTree(post, i){
  const seat = stakeholderSeatTree(post);
  const ctcAvatar = currentPolicyKey === "usa/chi_ctc" ? CTC_PERSONA_AVATARS[post?.persona_name] : null;
  const avatar = ctcAvatar || PROFILE_AVATARS[i % PROFILE_AVATARS.length];
  return `<img class="persona-image profile-avatar" src="${avatar}" alt="${escTree(post?.persona_name || seat?.role || "Stakeholder")}" />`;
}
function answerParagraphsTree(text){
  return String(text || "")
    .split(/\n{2,}|\n/)
    .map(x=>x.trim())
    .filter(Boolean)
    .map(x=>`<p>${escTree(x)}</p>`)
    .join("");
}
function pathwayContextText(path){
  return pathNodesTree(path).map((node, i)=>{
    const phase = node.phase || {};
    const stance = stanceLabelTree(node);
    const metrics = Object.entries(phaseValuesTree(phase)).slice(0,3)
      .map(([k,v])=>`${fieldTree(k)}=${fmtTree(v)}`)
      .join(", ");
    return `${i+1}. ${TREE_PHASE_KO[phase.phase] || phase.phase} (${stance}): ${phase.phase_summary || ""} ${metrics ? `Prediction values: ${metrics}` : ""}`;
  }).join("\n");
}
function personaPathwayContextText(post){
  if(!post) return "";
  const prediction = Object.entries(post.prediction_values || {})
    .map(([k,v])=>`${fieldTree(k)}=${fmtTree(v)}`)
    .join(", ");
  const constraints = cleanConstraintTagsTree(post, 3).join(", ");
  const rationale = post.rationale_summary?.narrative_rationale || post.narrative || "";
  return [
    `Persona: ${post.persona_name || ""} (${post.stakeholder_type || ""})`,
    prediction ? `Persona prediction values: ${prediction}` : "",
    constraints ? `Key constraints identified by this persona: ${constraints}` : "",
    rationale ? `Prior rationale from this persona: ${rationale}` : "",
  ].filter(Boolean).join("\n");
}
function renderDiscussionButton(positions){
  const node = focusedNode || focusedTreeNode();
  const pos = positions.get(nodeId(node));
  const postCount = phasePostsTree(node.phase || {}).length;
  if(!pos || !postCount || node.col === 0) return "";
  const w = nodeWidthTree(node);
  return `<button class="node-discussion-button" data-open-discussion="1" type="button"
    style="--x:${pos.x + w - 40}px;--y:${pos.y - 65}px;">
    <span>Stakeholder</span><span>discussion</span>
  </button>`;
}
function renderPathwayChatButton(positions){
  const node = TREE_BASELINE_MODE
    ? [...treeNodes.values()].find(n=>n.col === TREE_PHASES.length - 1)
    : (focusedNode || focusedTreeNode());
  if(!node) return "";
  const pos = positions.get(nodeId(node));
  const postCount = phasePostsTree(node.phase || {}).length;
  if(!pos || !postCount || node.col !== TREE_PHASES.length - 1) return "";
  const w = nodeWidthTree(node);
  const yOffset = TREE_BASELINE_MODE ? 31 : -24;
  return `<button class="pathway-chat-button" data-open-path-chat="1" type="button"
    style="--x:${pos.x + w + 18}px;--y:${pos.y + yOffset}px;">
    Chat!
  </button>`;
}
// Baseline keeps both report and persona chat available for the presented path.
// Keep the report button anchored to the actual Impact node regardless of focus.
function renderFinalReportButtonTree(positions){
  if(!TREE_BASELINE_MODE) return "";
  const impactNode = [...treeNodes.values()].find(n=>n.col === TREE_PHASES.length - 1);
  if(!impactNode) return "";
  const pos = positions.get(impactNode.path);
  const postCount = phasePostsTree(impactNode.phase || {}).length;
  if(!pos || !postCount) return "";
  const w = nodeWidthTree(impactNode);
  return `<button class="pathway-report-button" data-open-final-report="1" data-report-node-path="${impactNode.path}" type="button"
    style="--x:${pos.x + w + 18}px;--y:${pos.y - 23}px;">
    Final report
  </button>`;
}
function renderPathwayChatModal(){
  if(!pathwayChatOpen) return "";
  const node = treeNodes.get(pathwayChatPath) || focusedTreeNode();
  const tone = TREE_STANCES[node.stance] || TREE_STANCES.neutral;
  const posts = orderedStakeholderPostsTree(phasePostsTree(node.phase || {}));
  const selectedPersona = posts.some(({post})=>post.persona_name === pathwayChatPersona)
    ? pathwayChatPersona
    : (posts[0]?.post?.persona_name || "");
  const selectedPost = posts.find(({post})=>post.persona_name === selectedPersona)?.post || posts[0]?.post || {};
  const selectedSeat = stakeholderSeatTree(selectedPost);
  const personaTabs = posts.map(({post}, i)=>{
    const active = post.persona_name === selectedPersona ? "active" : "";
    const seat = stakeholderSeatTree(post);
    return `<button class="${active}" type="button" data-path-chat-persona="${escTree(post.persona_name || "")}" style="--persona:${seat?.color || PIXEL_COLORS[i % PIXEL_COLORS.length]}">
      ${stakeholderAvatarTree(post, i)}
      <span>${escTree(post.persona_name || "Stakeholder")}</span>
      <small>${escTree(post.stakeholder_type || "")}</small>
    </button>`;
  }).join("");
  const chatLimitReached = frameworkChatUsage.enabled
    && frameworkChatUsage.used >= frameworkChatUsage.limit;
  const starters = [
    "What is the most important policy risk in this pathway?",
    "How should I interpret this predicted impact?",
    "Which condition should be verified first in a real policy discussion?",
  ].map(q=>`<button type="button" data-path-chat-q="${escTree(q)}" ${chatLimitReached ? "disabled" : ""}>${escTree(q)}</button>`).join("");
  const visibleTurns = pathwayChatTurns.filter(t=>t.path === (pathwayChatPath || node.path) && t.personaName === selectedPersona);
  const turns = visibleTurns.length ? visibleTurns.map(turn=>{
    const answers = turn.answers.map((a, i)=>{
      const post = posts.find(({post:p})=>p.persona_name === a.personaName)?.post || {};
      const seat = stakeholderSeatTree(post);
      const body = a.pending
        ? `<p>Preparing a response...</p>`
        : a.error
          ? `<p>Error: ${escTree(a.error)}</p>`
          : answerParagraphsTree(a.answer);
      return `<div class="path-chat-message persona" style="--bubble:${seat?.color || PIXEL_COLORS[i % PIXEL_COLORS.length]}">
        <div class="path-chat-avatar">${stakeholderAvatarTree(post, i)}</div>
        <div class="path-chat-stack">
          <div class="path-chat-meta"><b>${escTree(a.personaName || post.persona_name || "Stakeholder")}</b><span>${escTree(post.stakeholder_type || "")}</span></div>
          <div class="path-chat-bubble">${body}</div>
        </div>
      </div>`;
    }).join("");
    return `<section class="path-chat-turn">
      <div class="path-chat-message user">
        <div class="path-chat-bubble"><p>${escTree(turn.question)}</p></div>
      </div>
      ${answers}
    </section>`;
  }).join("") : `<div class="path-chat-empty">Ask ${escTree(selectedPersona || "the selected stakeholder")} about the evidence, risks, or practical use of this complete pathway.</div>`;
  return `<div class="tree-modal-backdrop" data-close-path-chat="1">
    <section class="tree-chat-modal" style="--lane:${tone.color}" role="dialog" aria-modal="true" aria-label="Pathway stakeholder chat">
      <div class="tree-modal-head">
        <div>
          <span>Pathway stakeholder chat</span>
          <h2>Discuss this pathway with a stakeholder</h2>
        </div>
        <button data-close-path-chat="1" type="button">Close</button>
      </div>
      <div class="path-chat-route">${escTree(pathLabelTree(pathwayChatPath || node.path))}</div>
      <div class="path-chat-persona-picker">${personaTabs}</div>
      <div class="path-chat-current" style="--persona:${selectedSeat?.color || tone.color}">
        <b>${escTree(selectedPost.persona_name || "Stakeholder")}</b>
        <span>${escTree(selectedPost.stakeholder_type || "")}</span>
        <em>${frameworkChatUsage.used} / ${frameworkChatUsage.limit} questions</em>
      </div>
      <div class="path-chat-starters">${starters}</div>
      <div class="path-chat-list">${turns}</div>
      <form id="pathwayChatForm" class="path-chat-compose">
        <input name="question" autocomplete="off" ${chatLimitReached ? "disabled" : ""} placeholder="${chatLimitReached ? "Question limit reached for this policy case" : `Ask ${escTree(selectedPost.persona_name || "this stakeholder")} about this complete pathway...`}" />
        <button type="submit" ${chatLimitReached ? "disabled" : ""}>Send</button>
      </form>
      ${chatLimitReached ? '<p class="path-chat-limit-note">You have used all 5 stakeholder-chat questions for this policy case.</p>' : ""}
    </section>
  </div>`;
}
function renderDiscussionModal(){
  if(!discussionOpen) return "";
  const node = focusedNode || focusedTreeNode();
  const currentKey = nodeId(node);
  if(discussionNodeKey !== currentKey){
    discussionNodeKey = currentKey;
    expandedRationaleIndex = null;
  }
  const phase = node.phase || {};
  const tone = node.col === 0 ? TREE_STANCES.baseline : (TREE_STANCES[node.stance] || TREE_STANCES.baseline);
  const entries = orderedStakeholderPostsTree(phasePostsTree(phase));
  const people = entries.map(({post:p, seat},i)=>`
    <button class="round-person seat-${i} revealed" type="button" style="--bubble:${seat?.color || PIXEL_COLORS[i % PIXEL_COLORS.length]};--delay:${i*.68}s">
      ${stakeholderAvatarTree(p, i)}
      <span>${escTree(p.persona_name || seat?.role || "Stakeholder")}</span>
    </button>
  `).join("");
  const speechCards = entries.map(({post:p, seat},i)=>{
    const opinion = stakeholderOpinionTree(p);
    const constraintTags = cleanConstraintTagsTree(p, 1);
    const constraintClass = constraintTags.length ? "has-constraints" : "no-constraints";
    return `<article class="discussion-card ${constraintClass} card-${i}" style="--bubble:${seat?.color || PIXEL_COLORS[i % PIXEL_COLORS.length]};--delay:${i*.68}s">
      <b>${escTree(stakeholderViewpointTree(p))}</b>
      ${constraintPillsForPostTree(p, constraintTags)}
      <p>${escTree(opinion)}</p>
      <button class="discussion-rationale-toggle" data-rationale-index="${i}" type="button">Show full rationale</button>
    </article>`;
  }).join("");
  const expandedEntry = Number.isInteger(expandedRationaleIndex) ? entries[expandedRationaleIndex] : null;
  const expandedPost = expandedEntry?.post;
  const expandedConstraints = expandedPost ? cleanConstraintTagsTree(expandedPost, 1) : [];
  const rationaleReader = expandedPost ? `<aside class="discussion-rationale-reader" style="--bubble:${expandedEntry?.seat?.color || PIXEL_COLORS[expandedRationaleIndex % PIXEL_COLORS.length]}">
    <div class="discussion-rationale-head">
      <div>
        <span>${escTree(stakeholderViewpointTree(expandedPost))}</span>
        <h3>${escTree(expandedPost.persona_name || "Stakeholder")}</h3>
      </div>
      <button data-close-rationale="1" type="button">Hide full rationale</button>
    </div>
    ${constraintPillsForPostTree(expandedPost, expandedConstraints)}
    <p>${escTree(stakeholderTakeTree(expandedPost))}</p>
  </aside>` : "";
  return `<div class="tree-modal-backdrop" data-close-discussion="1">
    <section class="tree-discussion-modal" style="--lane:${tone.color}" role="dialog" aria-modal="true" aria-label="Stakeholder discussion">
      <div class="tree-modal-head">
        <div>
          <span>F2 Stakeholder rationale</span>
          <h2>${node.col+1}. ${escTree(TREE_PHASE_KO[phase.phase] || phase.phase)} · ${escTree(tone.label)}</h2>
        </div>
        <button data-close-discussion="1" type="button">Close</button>
      </div>
      <div class="tree-roundtable">
        <svg class="discussion-network" viewBox="0 0 1340 720" preserveAspectRatio="none" aria-hidden="true">
          <path d="M670 258 L833 360 L778 610 L562 610 L507 360 Z"></path>
          <circle cx="670" cy="258" r="7"></circle><circle cx="833" cy="360" r="7"></circle>
          <circle cx="778" cy="610" r="7"></circle><circle cx="562" cy="610" r="7"></circle>
          <circle cx="507" cy="360" r="7"></circle>
        </svg>
        ${people}
        ${speechCards}
        ${rationaleReader}
      </div>
    </section>
  </div>`;
}
function syncDiscussionNetwork(){
  const roundtable=document.querySelector(".tree-roundtable");
  const network=roundtable?.querySelector(".discussion-network");
  if(!roundtable||!network) return;
  const frame=roundtable.getBoundingClientRect();
  const avatars=[...roundtable.querySelectorAll(".round-person .persona-image.profile-avatar")].slice(0,5);
  if(avatars.length !== 5 || !frame.width || !frame.height) return;
  const points=avatars.map(avatar=>{
    const rect=avatar.getBoundingClientRect();
    return {x:rect.left-frame.left+rect.width/2,y:rect.top-frame.top+rect.height/2};
  });
  network.setAttribute("viewBox",`0 0 ${frame.width} ${frame.height}`);
  const profileRadius=33;
  const segments=points.map((from,index)=>{
    const to=points[(index+1)%points.length];
    const length=Math.hypot(to.x-from.x,to.y-from.y)||1;
    const dx=(to.x-from.x)/length, dy=(to.y-from.y)/length;
    return `M${from.x+dx*profileRadius} ${from.y+dy*profileRadius} L${to.x-dx*profileRadius} ${to.y-dy*profileRadius}`;
  }).join(" ");
  network.querySelector("path")?.setAttribute("d",segments);
}
function renderProgress(){
  const maxCol = Math.max(...visibleNodes().map(n=>n.col));
  const steps = TREE_PHASES.map((p,i)=>{
    const selected = i <= maxCol;
    const current = focusedTreeNode().col === i;
    return `<span class="${selected?"done":""} ${current?"current":""}">${i+1}. ${TREE_PHASE_KO[p]}</span>`;
  }).join("");
  return `<div class="tree-progress">${steps}</div>`;
}
const FRAMEWORK_GUIDE_STEPS = [
  {target:'.tree-node[data-phase-index="0"]', title:"Select a node to continue", copy:"Begin with the policy input node. Selecting a node reveals the possible developments available in the next phase, while the panel on the left updates with its detailed explanation."},
  {
    target:'.tree-phase-inspector',
    title:"Review the selected node summary",
    copy:"The panel on the left summarizes the node you selected. It explains what the phase examines and shows the relevant conditions, assumptions, quantitative values, and supporting details for that point in the pathway.",
  },
  {
    target:'.tree-node[data-phase-index="1"]',
    title:"Compare three development conditions",
    copy:"At every phase, the pathway can develop under one of three implementation conditions.",
    details:[
      ["Enabling", "Core implementation conditions and causal links hold or strengthen, supporting progress toward the policy goal."],
      ["Baseline", "Implementation follows typical or expected conditions, generally continuing the current direction."],
      ["Constraining", "Key assumptions, capacity, or causal links weaken, moving results away from the intended goal."],
    ],
  },
];

const BASELINE_GUIDE_STEPS = [
  {
    target:'.tree-node[data-phase-index="0"]',
    title:"Follow one projected policy development",
    copy:"This view presents one fixed development from Inputs through Impact. Select any phase node to examine what happens at that point in the policy process.",
  },
  {
    target:'.tree-phase-inspector',
    title:"Review the selected phase summary",
    copy:"The summary panel below the pathway explains the selected node's role, assumptions, constraints, quantitative values, and supporting details. It updates whenever you select another phase.",
  },
];

const FRAMEWORK_CONTEXT_GUIDES = {
  discussion:{
    target:".node-discussion-button",
    title:"Examine stakeholder reasoning",
    copy:"Stakeholder discussion appears above an explored node. Open it to compare how different personas interpret the selected phase, its predicted values, and its key constraints.",
  },
  report:{
    target:".report-document-head",
    title:"Review the completed pathway",
    copy:"Reaching Impact opens a final report for the selected route. It summarizes the phase-by-phase mechanisms, quantitative estimates, and constraints without treating the result as a definitive forecast.",
  },
  chat:{
    target:".pathway-chat-button",
    title:"Question a stakeholder about this route",
    copy:"Use Chat to ask a persona about the completed pathway. The route is also saved in the left panel, where its final report can be reopened and compared with other completed pathways.",
  },
};

const BASELINE_CONTEXT_GUIDES = {
  discussion:{
    target:".node-discussion-button",
    title:"Examine stakeholder reasoning",
    copy:"Stakeholder discussion is available for each phase after Inputs. Open it to compare how different personas interpret the projected values, mechanisms, and constraints at the selected node.",
  },
  report:{
    target:".report-document-head",
    title:"Review the complete projected pathway",
    copy:"The Final report summarizes the fixed pathway phase by phase, including its mechanisms, quantitative estimates, and constraints. Treat it as an exploratory policy analysis rather than a definitive forecast.",
  },
  chat:{
    target:".pathway-chat-button",
    title:"Question a stakeholder about the pathway",
    copy:"Use Chat to ask a persona about the complete projected pathway. The persona responds from its represented stakeholder perspective using the pathway context.",
  },
};

function activeGuideSteps(){
  return TREE_BASELINE_MODE ? BASELINE_GUIDE_STEPS : FRAMEWORK_GUIDE_STEPS;
}

function activeContextGuides(){
  return TREE_BASELINE_MODE ? BASELINE_CONTEXT_GUIDES : FRAMEWORK_CONTEXT_GUIDES;
}

function activeGuideStorageKey(){
  return TREE_BASELINE_MODE ? baselineGuideStorageKey : frameworkGuideStorageKey;
}

function activeFrameworkGuide(){
  const steps = activeGuideSteps();
  if(frameworkGuideStep >= 0){
    return {
      ...steps[frameworkGuideStep],
      kind:"initial",
      label:`Guide ${frameworkGuideStep + 1} of ${steps.length}`,
      action:frameworkGuideStep === steps.length - 1
        ? (TREE_BASELINE_MODE ? "Start reviewing" : "Start exploring")
        : "Next",
    };
  }
  const guide = activeContextGuides()[frameworkContextGuide];
  return guide ? {...guide, kind:"context", label:"Feature guide", action:"Got it"} : null;
}

function renderFrameworkGuide(){
  const step = activeFrameworkGuide();
  if(treeDemoMode || !step) return "";
  return `<div class="framework-guide-layer" data-guide-layer="1">
    <div class="framework-guide-focus" aria-hidden="true"></div>
    <article class="framework-guide-bubble" role="dialog" aria-modal="true" aria-label="Policy analysis guide">
      <span>${escTree(step.label)}</span>
      <h2>${escTree(step.title)}</h2>
      <p>${escTree(step.copy)}</p>
      ${step.details ? `<dl class="framework-guide-conditions">${step.details.map(([label,copy])=>`<div><dt>${escTree(label)}</dt><dd>${escTree(copy)}</dd></div>`).join("")}</dl>` : ""}
      <footer>${step.kind === "initial" ? '<button type="button" data-guide-skip="1">Skip guide</button>' : '<span></span>'}<button type="button" data-guide-next="1">${escTree(step.action)} <i data-lucide="arrow-right"></i></button></footer>
    </article>
  </div>`;
}

function guideTargetRect(){
  const step = activeFrameworkGuide();
  if(!step) return null;
  const targets = [...document.querySelectorAll(step.target)].filter(element=>{
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if(!targets.length) return null;
  const rects = targets.map(element=>element.getBoundingClientRect());
  return {
    left:Math.min(...rects.map(rect=>rect.left)),
    top:Math.min(...rects.map(rect=>rect.top)),
    right:Math.max(...rects.map(rect=>rect.right)),
    bottom:Math.max(...rects.map(rect=>rect.bottom)),
  };
}

function positionFrameworkGuide(){
  if(!activeFrameworkGuide()) return;
  const focus = document.querySelector(".framework-guide-focus");
  const bubble = document.querySelector(".framework-guide-bubble");
  const target = guideTargetRect();
  if(!focus || !bubble || !target) return;
  const padding = 8;
  const focusLeft = Math.max(8, target.left - padding);
  const focusTop = Math.max(8, target.top - padding);
  const focusRight = Math.min(innerWidth - 8, target.right + padding);
  const focusBottom = Math.min(innerHeight - 8, target.bottom + padding);
  focus.style.left = `${focusLeft}px`;
  focus.style.top = `${focusTop}px`;
  focus.style.width = `${Math.max(0, focusRight - focusLeft)}px`;
  focus.style.height = `${Math.max(0, focusBottom - focusTop)}px`;
  const bubbleRect = bubble.getBoundingClientRect();
  const below = target.bottom + 18;
  const top = below + bubbleRect.height <= innerHeight - 16
    ? below
    : Math.max(16, target.top - bubbleRect.height - 18);
  const left = Math.max(16, Math.min(innerWidth - bubbleRect.width - 16, target.left + (target.right - target.left - bubbleRect.width) / 2));
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
  bubble.classList.toggle("points-up", top >= target.bottom);
}

function closeFrameworkGuide(completed=false){
  if(frameworkContextGuide){
    const completedContext = frameworkContextGuide;
    localStorage.setItem(frameworkContextGuideKey(completedContext), "1");
    logTreeEvent("framework_feature_guide_completed", {feature:completedContext});
    if(completedContext === "report"){
      if(reportPath) closeTimedPanel("report");
      const completedPath = reportPath;
      reportPath = "";
      const completedNode = treeNodes.get(completedPath) || treeNodes.get(focusedPath) || focusedTreeNode();
      const chatAvailable = completedNode.col === TREE_PHASES.length - 1 && phasePostsTree(completedNode.phase || {}).length > 0;
      frameworkContextGuide = chatAvailable && localStorage.getItem(frameworkContextGuideKey("chat")) !== "1" ? "chat" : "";
    }else{
      frameworkContextGuide = "";
    }
    renderTree();
    return;
  }
  if(!completed){
    Object.keys(activeContextGuides()).forEach(kind=>{
      localStorage.setItem(frameworkContextGuideKey(kind), "1");
    });
  }
  localStorage.setItem(activeGuideStorageKey(), "1");
  logTreeEvent(completed ? "policy_guide_completed" : "policy_guide_skipped", {
    condition:TREE_BASELINE_MODE ? "baseline" : "framework",
    step:frameworkGuideStep + 1,
  });
  frameworkGuideStep = -1;
  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete("guide");
  history.replaceState({}, "", cleanUrl);
  renderTree();
}
function renderTree(preserveViewport=true, viewportAnchor=null){
  const viewport = preserveViewport ? captureTreeViewport() : null;
  const root = document.getElementById("pathwayTreeApp");
  const nodes = visibleNodes();
  const layout = layoutNodes(nodes);
  const canvasSection = `<section class="tree-layout">
      ${renderTreeZoomControls()}
      <div class="tree-canvas"${TREE_BASELINE_MODE ? ` style="height:${Math.ceil(layout.height * TREE_VIEW_SCALE)}px;"` : ""}>
        <div class="tree-canvas-stage" style="width:${Math.ceil(layout.width * TREE_VIEW_SCALE)}px;height:${Math.ceil(layout.height * TREE_VIEW_SCALE)}px;--tree-scaled-width:${Math.ceil(layout.width * TREE_VIEW_SCALE)}px;">
          <div class="tree-canvas-content" style="--tree-height:${layout.height}px;--tree-width:${layout.width}px;width:${layout.width}px;height:${layout.height}px;--tree-view-scale:${TREE_VIEW_SCALE};">
            ${renderTreeLines(nodes, layout.positions, layout.height, layout.width)}
            ${nodes.map(n=>renderTreeNode(n, layout.positions.get(n.path))).join("")}
            ${renderDiscussionButton(layout.positions)}
            ${renderPathwayChatButton(layout.positions)}
            ${renderFinalReportButtonTree(layout.positions)}
          </div>
        </div>
      </div>
    </section>`;
  // baseline 조건: 캔버스 → 하단 패널 순서. Ours(framework)는 원래의
  // 좌측 사이드바(인스펙터) → 캔버스 순서를 그대로 유지한다.
  const workspaceBody = TREE_BASELINE_MODE
    ? `${canvasSection}${renderPhaseInspector(nodes, layout)}`
    : `${renderPhaseInspector(nodes, layout)}${canvasSection}`;
  const studyToolbar = treeDemoMode ? "" : `<header class="baseline-report-toolbar tree-study-toolbar"><a href="${dashboardHrefTree(false)}"><i data-lucide="layout-dashboard"></i><span>Policies</span></a><span>Policy ${currentPolicyIndex + 1} of 2</span></header>`;
  const studyCompletion = treeDemoMode ? "" : `<section class="baseline-report-complete tree-exploration-complete"><a class="finish-link" data-finish-policy="1" href="${policySurveyHrefTree()}">${TREE_BASELINE_MODE ? "Finish Reviewing" : "Finish Exploring"} <i data-lucide="arrow-right"></i></a></section>`;
  root.innerHTML = `${studyToolbar}
  <section class="tree-workspace">
    ${workspaceBody}
    ${renderDiscussionModal()}
    ${renderPathReportModal()}
    ${renderPathwayChatModal()}
  </section>
  ${studyCompletion}
  ${renderFrameworkGuide()}`;
  if(reportPath && window.parent !== window){
    window.parent.postMessage({type:"policy-demo-report-open"}, window.location.origin);
  }
  root.querySelectorAll(".tree-node").forEach(btn=>btn.onclick=()=>{
    if(discussionOpen) closeTimedPanel("discussion");
    if(pathwayChatOpen) closeTimedPanel("chat");
    if(reportPath) closeTimedPanel("report");
    const path = btn.dataset.path;
    const anchor = captureTreeAnchor(path);
    const node = nodeFromPath(path);
    focusedNode = treeNodes.get(path) || node;
    focusedPath = path;
    discussionOpen = false;
    pathwayChatOpen = false;
    if(node.col < TREE_PHASES.length - 1) addChildren(path);
    rememberCompletedPath(path);
    const isCompletePath = node.col === TREE_PHASES.length - 1;
    logTreeEvent("node_selected", {
      path,
      parent_path:node.parent,
      phase:node.phase?.phase,
      phase_index:node.col,
      transition:node.stance,
      complete_path:isCompletePath,
      expanded_child_count:childPaths(path).length,
    }, PolicyStudy.pageElapsed());
    if(isCompletePath && !completedPathSet.has(path)){
      completedPathSet.add(path);
      logTreeEvent("complete_path_discovered", {
        path,
        transitions:pathStancesTree(path),
        final_phase:node.phase?.phase,
      }, PolicyStudy.pageElapsed());
    }
    reportPath = node.col === TREE_PHASES.length - 1 ? path : "";
    if(isCompletePath){
      reportOpenedAt = performance.now();
      logTreeEvent("report_opened", {path});
    }
    if(frameworkGuideStep < 0 && !frameworkContextGuide){
      if(!TREE_BASELINE_MODE && isCompletePath && localStorage.getItem(frameworkContextGuideKey("report")) !== "1"){
        frameworkContextGuide = "report";
      }else if(node.col > 0 && phasePostsTree(node.phase || {}).length > 0 && localStorage.getItem(frameworkContextGuideKey("discussion")) !== "1"){
        frameworkContextGuide = "discussion";
      }
    }
    renderTree(true, anchor);
  });
  const reset = root.querySelector("[data-reset-tree]");
  if(reset) reset.onclick=()=>{
    logTreeEvent("tree_reset", {completed_paths_before_reset:[...completedPathSet]}, PolicyStudy.pageElapsed());
    expandedPaths = new Set(["root"]);
    treeNodes = new Map();
    savedPathways = [];
    treeNodes.set("root", rootNode());
    addChildren("root");
    focusedPath = "root";
    focusedNode = rootNode();
    discussionOpen = false;
    reportPath = "";
    pathwayChatOpen = false;
    pathwayChatPath = "";
    pathwayChatPersona = "";
    pathwayChatTurns = [];
    completedPathSet = new Set();
    renderTree(false);
  };
  const finish = root.querySelector("[data-finish-policy]");
  if(finish) finish.onclick=event=>{
    event.preventDefault();
    if(markPolicyCompleteTree()) location.href = policySurveyHrefTree();
  };
  const guideNext = root.querySelector("[data-guide-next]");
  if(guideNext) guideNext.onclick=()=>{
    if(frameworkContextGuide){
      closeFrameworkGuide(true);
      return;
    }
    if(frameworkGuideStep >= activeGuideSteps().length - 1){
      closeFrameworkGuide(true);
      return;
    }
    frameworkGuideStep += 1;
    logTreeEvent("framework_guide_advanced", {step:frameworkGuideStep + 1});
    renderTree();
  };
  const guideSkip = root.querySelector("[data-guide-skip]");
  if(guideSkip) guideSkip.onclick=()=>closeFrameworkGuide(false);
  const zoomOut = root.querySelector("[data-tree-zoom-out]");
  const zoomIn = root.querySelector("[data-tree-zoom-in]");
  if(zoomOut){
    zoomOut.disabled = TREE_VIEW_SCALE <= TREE_VIEW_SCALE_MIN;
    zoomOut.onclick=()=>updateTreeZoom(TREE_VIEW_SCALE - TREE_VIEW_SCALE_STEP);
  }
  if(zoomIn){
    zoomIn.disabled = TREE_VIEW_SCALE >= TREE_VIEW_SCALE_MAX;
    zoomIn.onclick=()=>updateTreeZoom(TREE_VIEW_SCALE + TREE_VIEW_SCALE_STEP);
  }
  // baseline 조건: final report 버튼 → 경로 보고서 모달
  const finalReport = root.querySelector("[data-open-final-report]");
  if(finalReport) finalReport.onclick=()=>{
    if(discussionOpen) closeTimedPanel("discussion");
    reportPath = finalReport.dataset.reportNodePath || (focusedNode || focusedTreeNode()).path;
    reportOpenedAt = performance.now();
    logTreeEvent("report_opened", {path:reportPath, condition:"baseline"});
    if(frameworkGuideStep < 0 && !frameworkContextGuide && localStorage.getItem(frameworkContextGuideKey("report")) !== "1"){
      frameworkContextGuide = "report";
    }
    renderTree();
  };
  root.querySelectorAll("[data-focus-path]").forEach(btn=>btn.onclick=()=>{
    if(discussionOpen) closeTimedPanel("discussion");
    if(pathwayChatOpen) closeTimedPanel("chat");
    if(reportPath) closeTimedPanel("report");
    const path = btn.dataset.focusPath;
    if(!treeNodes.has(path)) return;
    focusedPath = path;
    focusedNode = treeNodes.get(path);
    discussionOpen = false;
    reportPath = "";
    pathwayChatOpen = false;
    renderTree();
  });
  root.querySelectorAll("[data-report-path]").forEach(btn=>btn.onclick=()=>{
    if(discussionOpen) closeTimedPanel("discussion");
    if(pathwayChatOpen) closeTimedPanel("chat");
    if(reportPath) closeTimedPanel("report");
    const path = btn.dataset.reportPath;
    if(!treeNodes.has(path)) return;
    focusedPath = path;
    focusedNode = treeNodes.get(path);
    discussionOpen = false;
    pathwayChatOpen = false;
    reportPath = path;
    reportOpenedAt = performance.now();
    logTreeEvent("report_opened", {path});
    renderTree();
  });
  root.querySelectorAll("[data-open-discussion]").forEach(btn=>btn.onclick=()=>{
    if(pathwayChatOpen) closeTimedPanel("chat");
    if(reportPath) closeTimedPanel("report");
    discussionOpen = true;
    expandedRationaleIndex = null;
    reportPath = "";
    pathwayChatOpen = false;
    discussionOpenedAt = performance.now();
    logTreeEvent("discussion_opened", {
      path:focusedTreeNode().path,
      phase:focusedTreeNode().phase?.phase,
      phase_index:focusedTreeNode().col,
    });
    renderTree();
  });
  root.querySelectorAll("[data-open-path-chat]").forEach(btn=>btn.onclick=()=>{
    if(discussionOpen) closeTimedPanel("discussion");
    if(reportPath) closeTimedPanel("report");
    const node = TREE_BASELINE_MODE
      ? [...treeNodes.values()].find(n=>n.col === TREE_PHASES.length - 1)
      : focusedTreeNode();
    if(!node) return;
    pathwayChatPath = node.path;
    const posts = orderedStakeholderPostsTree(phasePostsTree(node.phase || {}));
    pathwayChatPersona = posts[0]?.post?.persona_name || "";
    pathwayChatOpen = true;
    discussionOpen = false;
    reportPath = "";
    chatOpenedAt = performance.now();
    logTreeEvent("chat_opened", {path:pathwayChatPath, persona:pathwayChatPersona});
    renderTree();
  });
  root.querySelectorAll("[data-close-discussion]").forEach(el=>el.onclick=(event)=>{
    if(event.target !== el && !el.matches("button")) return;
    closeTimedPanel("discussion");
    discussionOpen = false;
    expandedRationaleIndex = null;
    renderTree();
  });
  root.querySelectorAll("[data-rationale-index]").forEach(btn=>btn.onclick=()=>{
    expandedRationaleIndex = Number(btn.dataset.rationaleIndex);
    logTreeEvent("stakeholder_rationale_expanded", {
      path:discussionNodeKey,
      persona_index:expandedRationaleIndex,
    });
    renderTree();
  });
  root.querySelectorAll("[data-close-rationale]").forEach(btn=>btn.onclick=()=>{
    logTreeEvent("stakeholder_rationale_collapsed", {
      path:discussionNodeKey,
      persona_index:expandedRationaleIndex,
    });
    expandedRationaleIndex = null;
    renderTree();
  });
  root.querySelectorAll("[data-close-report]").forEach(el=>el.onclick=(event)=>{
    if(event.target !== el && !el.matches("button")) return;
    closeTimedPanel("report");
    reportPath = "";
    renderTree();
  });
  root.querySelectorAll("[data-close-path-chat]").forEach(el=>el.onclick=(event)=>{
    if(event.target !== el && !el.matches("button")) return;
    closeTimedPanel("chat");
    pathwayChatOpen = false;
    renderTree();
  });
  root.querySelectorAll("[data-path-chat-q]").forEach(btn=>btn.onclick=()=>{
    submitPathwayChat(btn.dataset.pathChatQ);
  });
  root.querySelectorAll("[data-path-chat-persona]").forEach(btn=>btn.onclick=()=>{
    pathwayChatPersona = btn.dataset.pathChatPersona || "";
    logTreeEvent("chat_persona_selected", {path:pathwayChatPath, persona:pathwayChatPersona});
    renderTree();
  });
  const chatForm = root.querySelector("#pathwayChatForm");
  if(chatForm) chatForm.onsubmit=(event)=>{
    event.preventDefault();
    const input = chatForm.querySelector("input[name='question']");
    const question = input?.value?.trim();
    if(input) input.value = "";
    submitPathwayChat(question);
  };
  const canvas = root.querySelector(".tree-canvas");
  if(canvas){
    canvas.onscroll = updateMiniMapViewport;
    bindTreeCanvasPan(canvas);
  }
  root.querySelectorAll("[data-minimap]").forEach(btn=>btn.onclick=moveCanvasFromMiniMap);
  restoreTreeViewport(viewport, viewportAnchor);
  updateMiniMapViewport();
  if(window.lucide) lucide.createIcons();
  if(discussionOpen) requestAnimationFrame(syncDiscussionNetwork);
  if(activeFrameworkGuide()) requestAnimationFrame(positionFrameworkGuide);
  newlyAddedPaths = new Set();
}

async function submitPathwayChat(question){
  question = String(question || "").trim();
  if(!question || !pathwayChatOpen) return;
  if(frameworkChatUsage.enabled && frameworkChatUsage.used >= frameworkChatUsage.limit){
    logTreeEvent("chat_limit_reached", {
      policy_key:currentPolicyKey,
      used:frameworkChatUsage.used,
      limit:frameworkChatUsage.limit,
    });
    renderTree();
    return;
  }
  const node = treeNodes.get(pathwayChatPath) || focusedTreeNode();
  const posts = orderedStakeholderPostsTree(phasePostsTree(node.phase || {})).map(({post})=>post).filter(Boolean);
  if(!posts.length) return;
  const selectedPost = posts.find(p=>p.persona_name === pathwayChatPersona) || posts[0];
  pathwayChatPersona = selectedPost.persona_name || pathwayChatPersona;
  const id = `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const askedAt = performance.now();
  const turn = {
    id,
    path:pathwayChatPath || node.path,
    personaName:selectedPost.persona_name,
    question,
    answers:[{personaName:selectedPost.persona_name, pending:true, answer:"", error:""}],
  };
  pathwayChatTurns = [...pathwayChatTurns, turn].slice(-12);
  if(frameworkChatUsage.enabled){
    frameworkChatUsage.used += 1;
    frameworkChatUsage.remaining = Math.max(0, frameworkChatUsage.limit - frameworkChatUsage.used);
  }
  logTreeEvent("chat_question_submitted", {
    turn_id:id,
    path:turn.path,
    persona:turn.personaName,
    question,
  }, PolicyStudy.pageElapsed());
  renderTree();

  const context = pathwayContextText(turn.path);
  const personaContext = personaPathwayContextText(selectedPost);
  await Promise.all(turn.answers.map(async answer=>{
    const history = pathwayChatTurns
      .filter(t=>t.id !== id && t.path === turn.path && t.personaName === answer.personaName)
      .flatMap(t=>{
        const prior = t.answers.find(a=>a.personaName === answer.personaName && !a.pending && !a.error);
        return prior ? [
          {role:"user", content:t.question},
          {role:"assistant", content:prior.answer},
        ] : [];
      })
      .slice(-6);
    try{
      const res = await fetch("/api/pathway/persona-chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          persona_name:answer.personaName,
          policy_key:currentPolicyKey,
          question:`The user selected the following complete policy pathway:\n${context}\n\nYour prior position and rationale within this pathway are:\n${personaContext}\n\nUser question: ${question}\n\nRespond in English from your stakeholder perspective. Ground your response in the selected pathway and your prior predictions, rationale, and constraints. State your core position first, then explain only one key mechanism or constraint and one limitation. Use no more than two paragraphs and 3-5 concise sentences. Do not repeat the pathway description or numeric values at length.`,
          history,
          participant_id:PolicyStudy.participantId || null,
          pathway:turn.path,
          turn_id:id,
          user_question:question,
        }),
      });
      if(!res.ok){
        const errorPayload = await res.json().catch(()=>({}));
        if(res.status === 429 && errorPayload.detail){
          frameworkChatUsage.used = Number(errorPayload.detail.used ?? frameworkChatUsage.limit);
          frameworkChatUsage.remaining = 0;
        }
        throw new Error(errorPayload.detail?.message || `Chat request failed (${res.status})`);
      }
      const data = await res.json();
      answer.answer = data.answer || "";
      logTreeEvent("chat_answer_received", {
        turn_id:id,
        path:turn.path,
        persona:answer.personaName,
        question,
        answer:answer.answer,
      }, performance.now() - askedAt);
    }catch(err){
      answer.error = err.message || "Failed to generate answer.";
      logTreeEvent("chat_answer_failed", {
        turn_id:id,
        path:turn.path,
        persona:answer.personaName,
        question,
        error:answer.error,
      }, performance.now() - askedAt);
    }finally{
      answer.pending = false;
      renderTree();
    }
  }));
}

async function refreshFrameworkChatUsage(){
  if(!PolicyStudy.participantId) return;
  try{
    const query = new URLSearchParams({
      participant_id:PolicyStudy.participantId,
      policy_key:currentPolicyKey,
    });
    const response = await fetch(`/api/study/chat-limit?${query.toString()}`);
    if(!response.ok) return;
    const status = await response.json();
    frameworkChatUsage = {
      enabled:Boolean(status.enabled),
      used:Number(status.used || 0),
      limit:Number(status.limit || FRAMEWORK_CHAT_LIMIT),
      remaining:status.remaining == null ? null : Number(status.remaining),
    };
    if(pathwayChatOpen) renderTree();
  }catch(error){
    console.warn("Unable to load stakeholder-chat usage", error);
  }
}

window.addEventListener("resize", ()=>{
  if(activeFrameworkGuide()) positionFrameworkGuide();
});

const [treeCountry, treeProgram] = currentPolicyKey.split("/");
fetch(`/api/pathway/${encodeURIComponent(treeCountry)}/${encodeURIComponent(treeProgram)}/precomputed`)
  .then(response=>{
    if(!response.ok) throw new Error(`precomputed pathway: ${response.status}`);
    return response.json();
  })
  .then(precomputed=>{
    configurePolicyTree(precomputed);
    treeData = {stances:[]};
    if(precomputed?.nodes?.length){
      precomputedTreeNodes = new Map(precomputed.nodes.map(node=>[
        node.node_id,
        {
          path:node.node_id,
          parent:node.parent_id,
          stance:node.transition_mode || "neutral",
          col:node.phase_index,
          phase:node.phase,
          parentContextHash:node.parent_context_hash,
          x:82 + node.phase_index * TREE_COL_GAP,
          y:260,
        },
      ]));
    }
    expandedPaths = new Set();
    treeNodes = new Map();
    treeNodes.set("root", rootNode());
    if(TREE_BASELINE_MODE){
      // baseline: 단일 궤적 전체를 처음부터 제시 (선택 행위가 없으므로 점진적 공개가 불필요)
      expandBaselineChain();
    }else{
      addChildren("root");
    }
    newlyAddedPaths = new Set();
    focusedPath = "root";
    focusedNode = rootNode();
    logTreeEvent("policy_exploration_started", {
      policy_label:currentPolicyMeta.label,
      available_phases:TREE_PHASES,
      condition:TREE_BASELINE_MODE ? "baseline" : "framework",
      assigned_order_index:Number(treeQuery.get("policyIndex") || 0),
    });
    renderTree();
    refreshFrameworkChatUsage();
  })
  .catch(err=>{
    document.getElementById("pathwayTreeApp").innerHTML = `<div class="path-loading">Failed to load tree data: ${escTree(err.message)}</div>`;
  });

window.addEventListener("pagehide", ()=>{
  PolicyStudy.exitEvent("policy_page_exit", {
    completed_paths:[...completedPathSet],
    visible_node_count:treeNodes.size,
    focused_path:focusedPath,
    discussion_open:discussionOpen,
    report_open:Boolean(reportPath),
    chat_open:pathwayChatOpen,
    active_elapsed_ms:Math.round(activePolicyElapsedTree()),
  });
});

document.addEventListener("visibilitychange", ()=>{
  if(document.hidden){
    if(activeSegmentStartedAt != null){
      activeElapsedMs += performance.now() - activeSegmentStartedAt;
      activeSegmentStartedAt = null;
    }
    logTreeEvent("page_hidden", {active_elapsed_ms:Math.round(activeElapsedMs)}, PolicyStudy.pageElapsed());
  }else{
    activeSegmentStartedAt = performance.now();
    logTreeEvent("page_visible", {active_elapsed_ms:Math.round(activeElapsedMs)}, PolicyStudy.pageElapsed());
  }
});
