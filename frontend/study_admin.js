const variantsRoot = document.getElementById("variantDomains");
const refreshButton = document.getElementById("refreshVariants");
const accessButton = document.getElementById("adminAccessButton");
const accessForm = document.getElementById("adminAccessForm");
const tokenInput = document.getElementById("adminTokenInput");
const accessMessage = document.getElementById("adminAccessMessage");
const ADMIN_TOKEN_KEY = "policy-study-admin-token";

function adminHeaders(){
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  return token ? {"X-Admin-Token":token} : {};
}

function showAccessForm(message="The token is kept only in this browser tab."){
  accessForm.hidden = false;
  accessMessage.textContent = message;
  tokenInput.value = "";
  tokenInput.focus();
}

function hideAccessForm(){
  accessForm.hidden = true;
}

function adminEsc(value){
  return String(value ?? "").replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}

function variantLink(variant, preview=false){
  const query = new URLSearchParams({variant:variant.variant_id});
  if(preview) query.set("previewStudy","1");
  return `study.html?${query.toString()}`;
}

function policyStatus(policy){
  const status = policy.ready
    ? `${policy.phase_count || 0}/5 phases · ${policy.pathway_count || 0} pathways`
    : policy.available
      ? `${policy.phase_count || 0}/5 phases`
      : "Missing";
  return `<li class="${policy.ready ? "ready" : "incomplete"}"><span>${adminEsc(policy.short_label)}</span><b>${adminEsc(policy.label)}</b><em>${status}</em></li>`;
}

function variantCard(variant){
  const disabled = variant.ready ? "" : "disabled";
  return `<article class="variant-card ${variant.status}">
    <header><span>${adminEsc(variant.condition_label)}</span><em>${variant.ready ? "Ready" : "Incomplete"}</em></header>
    <h3>${adminEsc(variant.order_label)}</h3>
    <code>${adminEsc(variant.variant_id)}</code>
    <ul>${variant.policies.map(policyStatus).join("")}</ul>
    <dl><div><dt>Participants</dt><dd>${variant.participants}</dd></div><div><dt>Completed</dt><dd>${variant.completed}</dd></div></dl>
    <footer>
      <a class="variant-launch ${disabled}" ${variant.ready ? `href="${variantLink(variant)}"` : 'aria-disabled="true"'}><i data-lucide="play"></i><span>Launch</span></a>
      <a class="variant-preview ${disabled}" ${variant.ready ? `href="${variantLink(variant,true)}"` : 'aria-disabled="true"'}><i data-lucide="eye"></i><span>Preview</span></a>
      <button type="button" data-copy="${adminEsc(variantLink(variant))}" ${variant.ready ? "" : "disabled"} title="Copy launch link"><i data-lucide="copy"></i></button>
    </footer>
  </article>`;
}

function renderVariants(payload){
  const grouped = new Map();
  payload.variants.forEach(variant=>{
    if(!grouped.has(variant.domain_id)) grouped.set(variant.domain_id,[]);
    grouped.get(variant.domain_id).push(variant);
  });
  variantsRoot.innerHTML = [...grouped.entries()].map(([domainId,variants])=>`
    <section class="variant-domain" data-domain="${adminEsc(domainId)}">
      <header><div><span>Domain</span><h2>${adminEsc(variants[0].domain_label)}</h2></div><b>${variants.filter(item=>item.ready).length}/4 ready</b></header>
      <div class="variant-grid">${variants.map(variantCard).join("")}</div>
    </section>`).join("");
  const ready = payload.variants.filter(item=>item.ready).length;
  document.getElementById("readyVariantCount").textContent = `${ready}/20`;
  document.querySelectorAll("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{
    await navigator.clipboard.writeText(new URL(button.dataset.copy,location.href).href);
    button.innerHTML = '<i data-lucide="check"></i>';
    if(window.lucide) lucide.createIcons();
  }));
  if(window.lucide) lucide.createIcons();
}

async function loadVariants(){
  if(!sessionStorage.getItem(ADMIN_TOKEN_KEY)){
    variantsRoot.innerHTML = '<div class="dashboard-loading">Enter the administrator token to load study variants.</div>';
    showAccessForm();
    return;
  }
  refreshButton.disabled = true;
  try{
    const response = await fetch("/api/study/variants", {headers:adminHeaders()});
    if(response.status === 401){
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      variantsRoot.innerHTML = '<div class="dashboard-loading">Administrator authorization is required.</div>';
      showAccessForm("That token was not accepted. Please try again.");
      return;
    }
    if(response.status === 503){
      variantsRoot.innerHTML = '<div class="dashboard-loading">Administrator access is not configured on this server.</div>';
      showAccessForm("Set ADMIN_TOKEN on the server before using this page.");
      return;
    }
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    hideAccessForm();
    renderVariants(await response.json());
  }catch(error){
    variantsRoot.innerHTML = `<div class="dashboard-loading">Failed to load variants: ${adminEsc(error.message)}</div>`;
  }finally{
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click",loadVariants);
accessButton.addEventListener("click",()=>{
  if(accessForm.hidden) showAccessForm();
  else hideAccessForm();
});
accessForm.addEventListener("submit",event=>{
  event.preventDefault();
  const token = tokenInput.value.trim();
  if(!token){
    accessMessage.textContent = "Enter the administrator token.";
    return;
  }
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  loadVariants();
});
loadVariants();
if(window.lucide) lucide.createIcons();
