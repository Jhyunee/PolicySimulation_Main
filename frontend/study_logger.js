(function(){
  const params = new URLSearchParams(window.location.search);
  const participantId = params.get("participant") || localStorage.getItem("policy-study-participant") || "";
  const policyKey = params.get("policy") || "";
  const previewMode = params.get("previewStudy") === "1";
  const pageStartedAt = performance.now();
  const pageSessionId = globalThis.crypto?.randomUUID?.() || `page-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function event(eventType, payload={}, elapsedMs=null){
    if(previewMode || !participantId) return Promise.resolve(null);
    const body = {
      participant_id: participantId,
      policy_key: policyKey || null,
      event_type: eventType,
      occurred_at: new Date().toISOString(),
      elapsed_ms: elapsedMs == null ? null : Math.max(0, Math.round(elapsedMs)),
      payload:{page_session_id:pageSessionId, page_path:location.pathname, ...payload},
    };
    return fetch("/api/study/events", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body),
      keepalive:true,
    }).catch(()=>null);
  }

  function pageElapsed(){ return performance.now() - pageStartedAt; }

  function exitEvent(eventType="page_exit", payload={}){
    if(previewMode || !participantId) return;
    const body = JSON.stringify({
      participant_id:participantId,
      policy_key:policyKey || null,
      event_type:eventType,
      occurred_at:new Date().toISOString(),
      elapsed_ms:Math.round(pageElapsed()),
      payload:{page_session_id:pageSessionId, page_path:location.pathname, ...payload},
    });
    navigator.sendBeacon("/api/study/events", new Blob([body], {type:"application/json"}));
  }

  window.PolicyStudy = {participantId, policyKey, pageSessionId, event, pageElapsed, exitEvent};
})();
