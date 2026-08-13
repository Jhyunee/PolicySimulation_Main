const baselineParams = new URLSearchParams(location.search);
const baselinePolicyKey = baselineParams.get("policy") || "";
const baselineParticipantId = baselineParams.get("participant") || PolicyStudy.participantId || "";
const baselinePolicyIndex = Number(baselineParams.get("policyIndex") || 0);
const baselinePreview = baselineParams.get("preview") === "1";
const baselineStudyPreview = baselineParams.get("previewStudy") === "1";
const ALL_BASELINE_PATH = "root/baseline/baseline/baseline/baseline";

const REPORT_SECTION_TITLES = [
  "Implementation context",
  "Operational response",
  "Immediate implementation results",
  "Near-term policy effects",
  "Long-term implications",
];

const REPORT_FIELD_LABELS = {
  federal_enforcement_budget_usd:"Federal enforcement budget", certified_idr_entity_count:"Certified IDR entities", qpa_ready_plan_pct:"QPA-ready plans",
  qpa_calculations_completed:"QPA calculations completed", timely_initial_payment_or_denial_rate:"Timely payment or denial rate", idr_cases_initiated:"IDR cases initiated",
  protected_claims_correctly_processed_rate:"Protected claims correctly processed", notice_compliance_rate:"Notice compliance rate", timely_idr_determination_rate:"Timely IDR determination rate",
  emergency_oon_bill_prevalence_reduction_pp:"Emergency OON bill reduction", nonemergency_oon_bill_prevalence_reduction_pp:"Non-emergency OON bill reduction", patient_savings_per_protected_claim_usd:"Patient savings per protected claim",
  systemic_oon_billing_prevalence_pct:"Systemic OON billing prevalence", network_adequacy_rate_pct:"Network adequacy rate", premium_change_attributable_to_nsa_pct:"NSA-attributable premium change",
  irs_administrative_budget_usd:"IRS administrative budget", irs_staff_allocated_ftes:"IRS staff allocated", non_filer_outreach_budget_usd:"Non-filer outreach budget",
  advance_payment_disbursements_count:"Advance payments disbursed", portal_account_updates_processed:"Portal updates processed", non_filer_sign_up_tool_submissions_processed:"Non-filer registrations processed",
  average_monthly_payment_per_child_dollars:"Average monthly payment per child", eligible_families_receiving_at_least_one_payment:"Eligible families reached", non_filer_households_receiving_payments:"Non-filer households reached",
  spm_child_poverty_rate_2021_pct:"2021 child poverty rate", spm_child_poverty_relative_reduction_2020_2021_pct:"Child poverty reduction", low_income_food_insufficiency_relative_reduction_pct:"Food insufficiency reduction",
  spm_black_child_poverty_rate_2021_pct:"Black child poverty rate", spm_hispanic_child_poverty_rate_2021_pct:"Hispanic child poverty rate", intergenerational_income_mobility_index:"Intergenerational mobility",
  child_health_outcome_composite_score:"Child health outcomes", long_term_healthcare_cost_savings_usd:"Long-term healthcare savings", dealer_registration_count:"Registered dealers",
  manufacturer_certification_count:"Manufacturer certifications", advance_payment_claims_processed:"Advance payment claims", dealer_training_sessions_conducted:"Dealer training sessions",
  manufacturer_compliance_reports_submitted:"Compliance reports", dealer_participation_rate_pct:"Dealer participation rate", eligible_vehicle_models_count:"Eligible vehicle models",
  pos_transfer_transaction_count:"Point-of-sale transfers", section30d_return_count:"Section 30D returns", average_section30d_credit_per_return_usd:"Average credit per return",
  pos_credit_transfer_rate_pct:"Point-of-sale transfer rate", critical_mineral_import_dependency_pct:"Critical mineral import dependency", ev_market_share_pct:"EV market share",
  transportation_emissions_reduction_mtco2e:"Transportation emissions reduction", national_local_refund_budget_krw:"National and local refund budget", participating_local_governments_count:"Participating local governments",
  card_issuer_partners_count:"Card issuer partners", membership_applications_processed_count:"Membership applications processed", transit_usage_records_processed_count:"Transit usage records processed",
  refund_transactions_processed_count:"Refund transactions processed", active_members_monthly_count:"Monthly active members", total_refund_disbursement_krw:"Total refunds disbursed",
  average_rides_per_eligible_user_per_month:"Average monthly rides", cumulative_registered_kpass_users_count:"Cumulative registered users", avg_monthly_refund_per_user_krw:"Average monthly refund",
  avg_refund_share_of_transit_spending_pct:"Refund share of transit spending", low_income_avg_monthly_refund_per_user_krw:"Low-income monthly refund",
};

function reportEsc(value){ return String(value ?? "").replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char])); }
function reportField(key){ return REPORT_FIELD_LABELS[key] || String(key || "").replaceAll("_", " ").replace(/\b\w/g, char=>char.toUpperCase()); }
function reportNumber(value){
  if(!Number.isFinite(Number(value))) return String(value ?? "-");
  const numeric = Number(value);
  return (Math.abs(numeric) >= 100 ? Math.round(numeric) : Math.round(numeric * 10) / 10).toLocaleString();
}
function reportValue(key, value){
  const numeric = reportNumber(value);
  if(key.endsWith("_pp")) return `${numeric} pp`;
  if(key.includes("_usd")) return `$${numeric}`;
  if(key.endsWith("_krw")) return `KRW ${numeric}`;
  if(key.endsWith("_pct") || key.endsWith("_rate") || key.endsWith("_percent")) return `${numeric}%`;
  return numeric;
}
function reportPosts(phase){ return phase?.posts || []; }
function reportValues(phase){
  const grouped = {};
  reportPosts(phase).forEach(post=>Object.entries(post.prediction_values || {}).forEach(([key,value])=>{
    if(typeof value === "number" && !Number.isNaN(value)) (grouped[key] ||= []).push(value);
  }));
  return Object.fromEntries(Object.entries(grouped).map(([key,values])=>[key,values.reduce((sum,value)=>sum + value, 0) / values.length]));
}
function reportMetrics(phase, limit=3){
  const values = Object.entries(reportValues(phase)).slice(0, limit);
  if(!values.length) return "";
  return `<dl class="report-metrics">${values.map(([key,value])=>`<div><dt title="${reportEsc(reportField(key))}">${reportEsc(reportField(key))}</dt><dd>${reportEsc(reportValue(key,value))}</dd></div>`).join("")}</dl>`;
}
/* Baseline 조건의 텍스트 정규화.
   목적 두 가지 —
   (1) ToC 어휘 차단: 단계명·phase·pathway 등이 baseline에 노출되면 RQ1의 조작이 무너진다.
   (2) 템플릿 해체: "The central causal mechanism is that ~ / This phase shifts the downstream
       pathway toward ~" 같은 반복 골격어를 산문으로 푼다. 정보는 삭제하지 않고 문장 구조만 바꾼다. */
const REPORT_STAGE = "(?:Inputs|Activities|Outputs|Outcomes|Impact)";
const REPORT_REWRITES = [
  // 1. 메커니즘 골격어 해체 — 내용을 문장 주어로 승격
  [new RegExp(`^At the ${REPORT_STAGE} phase,\\s*the central causal mechanism is that\\s*`, "i"), ""],
  [new RegExp(`\\bThe central causal mechanism (?:at this phase|in this analysis) is that\\s*`, "gi"), ""],
  [new RegExp(`\\bThe central causal mechanism (?:at this phase|in this analysis) is the\\s*`, "gi"), "What matters here is the "],
  [new RegExp(`\\bThe ${REPORT_STAGE} phase (?:reveals|indicates|shows) that\\s*`, "gi"), "The analysis indicates that "],
  [new RegExp(`\\bThe transition from ${REPORT_STAGE} to ${REPORT_STAGE} is driven by\\s*`, "gi"), "What drives this is "],
  // 2. 가정 골격어 완화
  [/\bThe phase assumes that\s*/gi, "This assumes that "],
  [/\bThe key assumption (?:driving this analysis )?is that\s*/gi, "This assumes that "],
  [/\bAssumptions driving this analysis include that\s*/gi, "This assumes that "],
  // 3. 전방 연결(사슬) 은유 해체
  [/\b(?:This phase|These inputs|This)\s+(?:shifts?|changes?)\s+the downstream pathway\s+by establishing that\s*/gi, "Overall, this establishes that "],
  [/\b(?:This phase|These inputs|This)\s+(?:shifts?|changes?)\s+the downstream pathway\s+by indicating that\s*/gi, "Overall, this indicates that "],
  [/\b(?:This phase|These inputs|This)\s+(?:shifts?|changes?)\s+the downstream pathway\s+toward\s*/gi, "Overall, this points toward "],
  [/\b(?:This phase|These inputs|This)\s+(?:shifts?|changes?)\s+the downstream pathway\s+from\s*/gi, "Overall, the emphasis moves from "],
  [/\b(?:This phase|These inputs|This)\s+(?:shifts?|changes?)\s+the downstream pathway\s*/gi, "Overall, this points "],
  // 4. 잔여 ToC 어휘 차단
  [new RegExp(`\\bfrom the ${REPORT_STAGE} phase\\b`, "gi"), "from earlier implementation results"],
  [/\bfrom earlier phases\b/gi, "from earlier in the implementation process"],
  [/\b(?:the )?next phase\b/gi, "later developments"],
  [/\bat this phase\b/gi, "here"],
  [/\bThis phase\b/g, "This analysis"], [/\bthis phase\b/g, "this analysis"],
  [/\bThe phase\b/g, "This analysis"],  [/\bthe phase\b/g, "this analysis"],
  [/\bdownstream pathway\b/gi, "subsequent policy development"],
  [/\bpolicy pathway\b/gi, "policy development"],
];
// 마스킹 후에도 남은 ToC 어휘를 잡는 검사식. 단계명은 "Outputs phase"처럼 라벨로 쓰인 경우만 잡는다.
const REPORT_LEAK = new RegExp(`\\bphases?\\b|\\bpathway\\b|\\bbranch\\w*\\b|\\bToC\\b|Theory of Change|\\b${REPORT_STAGE}\\s+phase\\b`, "i");
function reportSummary(phase){
  let text = String(phase?.phase_summary || "No summary was provided for this part of the analysis.");
  text = text.replace(/\s+/g, " ").trim();
  REPORT_REWRITES.forEach(([pattern, replacement])=>{ text = text.replace(pattern, replacement); });
  text = text.replace(/\s+/g, " ").trim();
  // 골격어를 걷어낸 뒤 문장 첫 글자 대문자 복원
  text = text.replace(/(^|[.!?]\s+)([a-z])/g, (match, lead, letter)=>lead + letter.toUpperCase());
  const leak = text.match(REPORT_LEAK);
  if(leak) console.warn(`[baseline_report] ToC 어휘가 남아 있습니다: "${leak[0]}" — ${text.slice(0, 120)}...`);
  return text;
}
function reportConstraints(phase){
  const constraints = reportConstraintLabels(phase);
  if(!constraints.length) return "";
  return `<section class="report-constraints" aria-label="Key constraints"><div class="report-subhead">Key constraints</div><div class="report-constraint-tags">${constraints.map(item=>`<span>#${reportEsc(item.label)}${item.count > 1 ? ` <b>${item.count}</b>` : ""}</span>`).join("")}</div></section>`;
}
function reportConstraintLabels(phase){
  const counts = new Map();
  reportPosts(phase).forEach(post=>(post.rationale_summary?.key_constraints || []).forEach(raw=>{
    const label = String(raw || "").trim();
    if(!label || /^(explicit|implicit|none|n\/a|na)$/i.test(label)) return;
    const key = label.toLowerCase();
    const current = counts.get(key) || {label,count:0};
    counts.set(key, {...current,count:current.count + 1});
  }));
  return [...counts.values()].sort((a,b)=>b.count - a.count).slice(0,3);
}
function reportNarrativeParagraph(phase, index){
  const transitions = [
    "At the outset,",
    "As implementation proceeded,",
    "As these efforts translated into operational results,",
    "Over the following period,",
    "In the longer term,",
  ];
  const summary = reportSummary(phase).replace(/^([A-Z])(?=[a-z])/, letter=>letter.toLowerCase());
  const metrics = Object.entries(reportValues(phase)).slice(0,3)
    .map(([key,value])=>`${reportField(key)} was estimated at ${reportValue(key,value)}`);
  const constraints = reportConstraintLabels(phase).map(item=>item.label);
  const estimates = metrics.length ? ` The accompanying estimates indicated that ${metrics.join(", ")}.` : "";
  const limitations = constraints.length ? ` Important practical constraints included ${constraints.join(", ")}.` : "";
  return `${transitions[index] || "Subsequently,"} ${summary}${estimates}${limitations}`.replace(/\s+/g," ").trim();
}
function surveyHref(){
  if(baselinePreview) return "study.html";
  const query = new URLSearchParams({stage:"policy",participant:baselineParticipantId,policy:baselinePolicyKey,policyIndex:String(baselinePolicyIndex)});
  if(baselineStudyPreview) query.set("previewStudy","1");
  if(baselineStudyPreview && baselineParams.get("variant")) query.set("variant",baselineParams.get("variant"));
  return `survey.html?${query.toString()}`;
}
function renderBaselineReport(payload){
  const nodes = payload.nodes || [];
  if(payload.report_path !== ALL_BASELINE_PATH || nodes.length !== 5) throw new Error("The fixed policy report is incomplete.");
  const narrative = nodes.map((node,index)=>`<p>${reportEsc(reportNarrativeParagraph(node.phase,index))}</p>`).join("");
  document.title = `${payload.policy.label} · Policy Analysis Report`;
  document.getElementById("baselineReportApp").innerHTML = `
    <header class="baseline-report-toolbar"><a href="${baselinePreview || baselineStudyPreview ? "study.html" : `dashboard.html?participant=${encodeURIComponent(baselineParticipantId)}`}"><i data-lucide="layout-dashboard"></i><span>${baselinePreview || baselineStudyPreview ? "Study home" : "Policies"}</span></a><span>${baselinePreview ? "Baseline preview" : `Policy ${baselinePolicyIndex + 1} of 2`}</span></header>
    <article class="report-document baseline-report-document">
      <header class="report-document-head"><div><span>Policy scenario analysis</span><h1>Policy Analysis Report</h1><p>A narrative account of how this policy could unfold under the conditions examined.</p></div><div class="report-document-id"><span>Policy case</span><b>${reportEsc(payload.policy.label)}</b><em>Exploratory analysis</em></div></header>
      <section class="baseline-narrative" aria-label="Policy analysis narrative">${narrative}<p class="baseline-narrative-note">This account presents conditional exploratory estimates rather than a definitive forecast and should be considered alongside domain evidence and expert review.</p></section>
      <footer class="report-document-footer"><span>Policy simulation framework</span><span>Use alongside domain evidence and expert review.</span></footer>
    </article>
    <section class="baseline-report-complete"><div><span>${baselinePreview || baselineStudyPreview ? "Preview mode" : "Report reviewed"}</span><p>${baselinePreview || baselineStudyPreview ? "No responses or interaction data are recorded in this mode." : "Continue when you have finished examining the full report."}</p></div><a id="finishBaselineReport" href="${surveyHref()}">${baselinePreview ? "Return to study home" : "Continue to questionnaire"} <i data-lucide="arrow-right"></i></a></section>`;
  document.getElementById("finishBaselineReport").addEventListener("click", event=>{
    event.preventDefault();
    if(!baselinePreview && !baselineStudyPreview) PolicyStudy.exitEvent("baseline_report_finished", {condition:"baseline",report_variant:payload.report_variant,report_path:payload.report_path});
    location.href = surveyHref();
  });
  if(!baselinePreview && !baselineStudyPreview) PolicyStudy.event("baseline_report_opened", {condition:"baseline",report_variant:payload.report_variant,report_path:payload.report_path,assigned_order_index:baselinePolicyIndex});
  if(window.lucide) lucide.createIcons();
}
async function loadBaselineReport(){
  if(!baselinePolicyKey || (!baselineParticipantId && !baselinePreview && !baselineStudyPreview)){ location.href = "study.html"; return; }
  if(!baselinePreview && !baselineStudyPreview){
    const participantResponse = await fetch(`/api/study/participants/${encodeURIComponent(baselineParticipantId)}`);
    if(!participantResponse.ok) throw new Error(`Participant HTTP ${participantResponse.status}`);
    const participant = await participantResponse.json();
    const trial = participant.assigned_trials?.find(item=>item.policy_key === baselinePolicyKey);
    if(!trial || trial.condition !== "baseline") throw new Error("This report is not assigned to this study trial.");
  }
  const [country,program] = baselinePolicyKey.split("/");
  const reportResponse = await fetch(`/api/pathway/${encodeURIComponent(country)}/${encodeURIComponent(program)}/baseline-report`);
  if(!reportResponse.ok) throw new Error(`Policy report HTTP ${reportResponse.status}`);
  renderBaselineReport(await reportResponse.json());
}
loadBaselineReport().catch(error=>{
  document.getElementById("baselineReportApp").innerHTML = `<div class="path-loading">Failed to load policy report: ${reportEsc(error.message)}</div>`;
});
window.addEventListener("pagehide", ()=>{
  if(!baselinePreview && !baselineStudyPreview) PolicyStudy.exitEvent("baseline_report_exit", {condition:"baseline",report_path:ALL_BASELINE_PATH});
});
