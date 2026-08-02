/* VERDEAI_V10_4_1_MOCK_JS_START */
(function(){
  "use strict";
  const BUILD = "v10.4.1";
  const CONTRACT_BUILD = "v10.4.0";
  const POLICY = Object.freeze({
    mode: "local-mock-only",
    backendConnected: false,
    providerCallsEnabled: false,
    paidCallsLocked: true,
    killSwitch: true,
    networkAllowed: false,
    imageCount: 1,
    automaticRetries: 0,
    storeInput: false,
    storeOutput: false
  });
  const byId = (id) => document.getElementById(id);
  let timer = 0;

  function resultPhoto(){ return byId("ownPhotoResultImage"); }
  function resultFuture(){ return (byId("ownPhotoRecommendationTitle")?.textContent || "").trim(); }
  function sourceReady(){
    const src = resultPhoto()?.getAttribute("src") || "";
    return /^data:image\/(jpeg|png|webp);base64,/i.test(src);
  }
  function futureIdFromTitle(title){
    const key = String(title || "").toLowerCase();
    if (key.includes("wildlife")) return "wildlife-haven";
    if (key.includes("low-maintenance") || key.includes("low maintenance")) return "low-maintenance-haven";
    if (key.includes("food")) return "food-garden";
    if (key.includes("workshop") || key.includes("maker")) return "office-workshop";
    if (key.includes("minimal")) return "minimalist";
    return "feature-garden";
  }
  function textFromSelect(id){
    const el = byId(id);
    return el?.selectedOptions?.[0]?.textContent?.trim() || "Not supplied";
  }
  function syncProof(){
    const source = resultPhoto();
    const proof = byId("v1041MockPhoto");
    if (source && proof) {
      proof.src = source.getAttribute("src") || "";
      proof.alt = source.alt || "Uploaded property photo";
    }
    const title = resultFuture() || "Your VerdeAI recommendation";
    if (byId("v1041MockFuture")) byId("v1041MockFuture").textContent = title;
  }
  function setStep(active){
    ["Prepare","Consent","Lock"].forEach((name) => byId(`v1041Step${name}`)?.classList.toggle("is-active", name.toLowerCase() === active));
  }
  function setState(state, title, message){
    const box = byId("v1041State");
    if (box) box.dataset.state = state;
    if (byId("v1041StateTitle")) byId("v1041StateTitle").textContent = title;
    if (byId("v1041StateMessage")) byId("v1041StateMessage").textContent = message;
  }
  function consentsComplete(){
    return ["v1041ConsentOwn","v1041ConsentProcess","v1041ConsentConcept","v1041ConsentStorage"].every((id) => byId(id)?.checked === true);
  }
  function syncConsentButton(){
    const run = byId("v1041RunMock");
    if (run) run.disabled = !consentsComplete();
  }
  function approximateBytes(dataUrl){
    const payload = String(dataUrl || "").split(",")[1] || "";
    return Math.max(1, Math.floor(payload.length * 0.75));
  }
  function preparedRequest(){
    const src = resultPhoto()?.getAttribute("src") || "";
    const mime = (src.match(/^data:(image\/(?:jpeg|png|webp));base64,/i) || [])[1] || "image/jpeg";
    return {
      build: CONTRACT_BUILD,
      clientBuild: BUILD,
      sessionId: `local_session_${Date.now().toString(36)}`,
      futureId: futureIdFromTitle(resultFuture()),
      imageCount: 1,
      image: {
        mimeType: mime === "image/webp" ? "image/jpeg" : mime,
        byteCount: approximateBytes(src),
        metadataStripped: true,
        dataRef: "single-browser-image"
      },
      clues: {
        spaceType: textFromSelect("ownSpaceType"),
        mainProblem: textFromSelect("ownMainProblem"),
        desiredOutcome: textFromSelect("ownDesiredOutcome"),
        preserve: (byId("ownPhotoExtraNote")?.value || "").trim()
      },
      consents: {
        ownsOrMayUsePhoto: true,
        acceptsProviderProcessing: true,
        acceptsConceptOnlyResult: true,
        acceptsNoVerdeAIStorage: true
      },
      policy: POLICY
    };
  }
  function validateLocalRequest(request){
    const errors = [];
    if (!sourceReady()) errors.push("The exact uploaded photo is unavailable.");
    if (!resultFuture()) errors.push("The recommended future is unavailable.");
    if (request.imageCount !== 1) errors.push("Exactly one output image is required.");
    if (request.image.byteCount > 2500000) errors.push("Prepared image exceeds the 2.5 MB local contract limit.");
    if (!Object.values(request.consents).every(Boolean)) errors.push("All confirmations are required.");
    if (POLICY.networkAllowed || POLICY.providerCallsEnabled || !POLICY.paidCallsLocked || !POLICY.killSwitch) errors.push("The local safety lock is not intact.");
    return errors;
  }
  function openPanel(){
    syncProof();
    const panel = byId("v1041MockPanel");
    if (panel) panel.hidden = false;
    reset(false);
    panel?.scrollIntoView({behavior:"smooth", block:"nearest"});
  }
  function prepare(){
    window.clearTimeout(timer);
    syncProof();
    byId("v1041Fallback")?.setAttribute("hidden", "");
    byId("v1041Consents")?.setAttribute("hidden", "");
    setStep("prepare");
    setState("preparing", "Preparing locally", "Checking the exact uploaded photo, the one-image limit, and the current recommendation.");
    timer = window.setTimeout(() => {
      if (!sourceReady() || !resultFuture()) {
        setState("error", "Preparation stopped", "Return to the result and make sure your uploaded photo and VerdeAI recommendation are visible.");
        return;
      }
      setStep("consent");
      setState("consent", "Four confirmations needed", "Nothing leaves this browser. Confirm the local contract before running the safe-lock check.");
      if (byId("v1041Consents")) byId("v1041Consents").hidden = false;
      syncConsentButton();
    }, 450);
  }
  function runMock(){
    window.clearTimeout(timer);
    const request = preparedRequest();
    const errors = validateLocalRequest(request);
    if (errors.length) {
      setState("error", "Local contract check stopped", errors.join(" "));
      return;
    }
    setStep("lock");
    setState("preparing", "Checking the hard safety lock", "No request is being sent. The browser is testing the local SAFE_LOCKED response only.");
    timer = window.setTimeout(() => {
      const response = Object.freeze({status:423, ok:false, code:"SAFE_LOCKED", message:"Real same-property generation is not active.", fallback:"Keep the exact uploaded photo and concept directions available."});
      window.__VERDEAI_V1041_LAST_MOCK__ = Object.freeze({request:Object.freeze({...request, image:Object.freeze({...request.image})}), response, completedAt:new Date().toISOString()});
      setState("safe-locked", "Safe lock passed — no provider contacted", "The local contract accepted one recommended future and correctly returned SAFE_LOCKED. Your original result remains unchanged.");
      if (byId("v1041Fallback")) byId("v1041Fallback").hidden = false;
      syncProof();
    }, 650);
  }
  function showTimeout(){
    window.clearTimeout(timer);
    syncProof();
    setStep("lock");
    setState("preparing", "Simulating a local timeout", "This is a display test only. No network request exists to time out.");
    timer = window.setTimeout(() => {
      setState("timeout", "Timeout fallback shown", "The exact uploaded photo and concept result stay available. Automatic retries remain zero.");
      if (byId("v1041Fallback")) byId("v1041Fallback").hidden = false;
      syncProof();
    }, 900);
  }
  function reset(uncheck = true){
    window.clearTimeout(timer);
    setStep("prepare");
    setState("idle", "Ready to prepare", "The local mock will verify the current photo and one recommended future.");
    if (byId("v1041Consents")) byId("v1041Consents").hidden = true;
    if (byId("v1041Fallback")) byId("v1041Fallback").hidden = true;
    if (uncheck) ["v1041ConsentOwn","v1041ConsentProcess","v1041ConsentConcept","v1041ConsentStorage"].forEach((id) => { if (byId(id)) byId(id).checked = false; });
    syncConsentButton();
    syncProof();
  }
  function closePanel(){
    reset(true);
    if (byId("v1041MockPanel")) byId("v1041MockPanel").hidden = true;
    byId("v1041MockCard")?.scrollIntoView({behavior:"smooth", block:"center"});
  }
  function attach(){
    byId("v1041OpenMock")?.addEventListener("click", openPanel);
    byId("v1041PrepareMock")?.addEventListener("click", prepare);
    byId("v1041RunMock")?.addEventListener("click", runMock);
    byId("v1041TestTimeout")?.addEventListener("click", showTimeout);
    byId("v1041ResetMock")?.addEventListener("click", () => reset(true));
    byId("v1041CloseMock")?.addEventListener("click", closePanel);
    ["v1041ConsentOwn","v1041ConsentProcess","v1041ConsentConcept","v1041ConsentStorage"].forEach((id) => byId(id)?.addEventListener("change", syncConsentButton));
    const photo = resultPhoto();
    const title = byId("ownPhotoRecommendationTitle");
    if (photo) new MutationObserver(syncProof).observe(photo, {attributes:true, attributeFilter:["src"]});
    if (title) new MutationObserver(syncProof).observe(title, {childList:true, subtree:true, characterData:true});
    syncProof();
    window.__VERDEAI_V1041_POLICY__ = POLICY;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach, {once:true});
  else attach();
})();
/* VERDEAI_V10_4_1_MOCK_JS_END */