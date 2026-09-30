(()=>{
  "use strict";
  const WORKER="https://your-landscaping-future-v10-54-six-render-pilot.christiamhere.workers.dev";
  const INVITE_KEY="ylf_v10531_magic_invite";
  const FUTURES=[
    ["layered-garden-edge","Layered garden edge","Define one generous planting edge, then repeat a small palette in layers."],
    ["clear-welcoming-route","Clear welcoming route","Make the main path obvious and frame it with lower planting."],
    ["feature-garden-focus","Feature garden focus","Create one strong focal planting instead of scattering small changes."],
    ["soft-privacy-screen","Soft privacy screen","Use staggered evergreen structure with lighter planting in front."],
    ["habitat-rich-border","Habitat-rich border","Combine shelter, flowers and seed heads across the seasons."],
    ["calm-low-care-structure","Calm low-care structure","Use fewer plant types in repeated groups with a clean mulch edge."]
  ];
  let sourceFile=null;
  let attempted=false;
  const $=id=>document.getElementById(id);
  const updateRunButton=()=>{
    const button=$("ownerRun");
    if(button)button.disabled=attempted||!sourceFile||![...document.querySelectorAll(".owner-check")].every(item=>item.checked);
  };

  function install(){
    const input=$("photoInput");
    input.addEventListener("change",event=>{sourceFile=event.target.files?.[0]||null;attempted=false;updateRunButton();});
    const clues=document.querySelector("#clues .grid");
    if(clues){
      clues.insertAdjacentHTML("beforeend",`<label class="field"><span>Extra landscaping instructions or requests (optional)</span><textarea id="landscapeRequests" rows="4" maxlength="2000" placeholder="For example: keep the big tree, add seating, leave room for the dog, or use fewer plants." aria-describedby="landscapeRequestsHelp"></textarea></label><p id="landscapeRequestsHelp" style="margin:0;line-height:1.4">These requests will guide all six life-like concepts. Your text is sent with your photo only when you confirm a render.</p>`);
    }
    const gate=document.querySelector(".render-gate");
    if(!gate)return;
    const style=document.createElement("style");
    style.textContent=`.field textarea{width:100%;min-height:120px;padding:12px 14px;border:2px solid #9ab7aa;border-radius:14px;background:#fff;color:var(--ink);font:inherit;line-height:1.45;resize:vertical}.field textarea:focus{outline:3px solid #efca72;outline-offset:2px}.owner-consent{margin-top:14px;padding:14px;border:2px solid #8eb4a3;border-radius:16px}.owner-consent label{display:flex;gap:10px;margin:11px 0;line-height:1.35}.owner-consent input{margin-top:4px;transform:scale(1.25)}.owner-progress{margin-top:13px;padding:12px;border-radius:13px;background:#edf4ec;font-weight:850}.owner-results{display:grid;gap:14px;margin-top:16px}.owner-result{overflow:hidden;border:2px solid #c7d8ce;border-radius:16px}.owner-result img{display:block;width:100%;height:auto}.owner-result b,.owner-result small{display:block;padding:10px 12px}.owner-result small{padding-top:0}@media(min-width:620px){.owner-results{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(style);
    gate.insertAdjacentHTML("beforeend",`<div class="owner-consent" id="ownerConsent" hidden><b>Confirm this owner test</b><label><input type="checkbox" class="owner-check">I own or may use this photo.</label><label><input type="checkbox" class="owner-check">I allow temporary processing by the approved AI provider.</label><label><input type="checkbox" class="owner-check">I understand these are concepts, not final designs.</label><label><input type="checkbox" class="owner-check">I approve this six-image request, capped at US$0.90, within my US$12 total testing cap.</label><button class="primary small" id="ownerRun" type="button" disabled>Create my six life-like concepts</button></div><p class="owner-progress" id="ownerProgress" hidden></p><div class="owner-results" id="ownerResults"></div>`);
    document.querySelectorAll(".owner-check").forEach(box=>box.addEventListener("change",updateRunButton));
    $("ownerRun").addEventListener("click",run);
    $("checkRender").addEventListener("click",event=>{event.preventDefault();event.stopImmediatePropagation();check();},true);
    document.querySelectorAll(".version").forEach(el=>{if(el.closest("#results"))el.textContent="Owner-only testing · Frontend v10.55.6.2 · US$12 total cap · US$0.90 per request";});
  }

  function ready(h){
    return h?.ok&&h.version==="10.54.3"&&h.protocolVersion==="ylf.render.v3"&&h.realRenderingEnabled&&!h.killSwitchOn&&!h.testModeOn&&h.providerKeyPresent&&h.rateLimitSaltPresent&&h.inviteCodesConfigured&&Number(h.inviteCodeCount)===1&&h.retentionPolicy==="no-store"&&h.approvedProvider==="openai-gpt-image-2"&&h.approvedBackend==="cloudflare-worker"&&Number(h.pilotSpendCapUsd)===12&&Number(h.invitedTesterLimit)===1&&Number(h.perSessionLimit)===20&&Number(h.maxCostPerRenderUsd)===.9&&h.sixImagesPerRequest===true&&Number(h.imageCountPerRequest)===6&&h.serverImageStorage===false;
  }

  async function check(){
    const box=$("renderStatus"),button=$("checkRender");
    button.disabled=true;box.className="render-status";box.textContent="Checking the protected Worker…";
    try{
      const response=await fetch(WORKER+"/api/health",{headers:{accept:"application/json"},cache:"no-store"});
      const health=await response.json();
      if(!response.ok||!health.ok)throw new Error();
      const invite=Boolean(sessionStorage.getItem(INVITE_KEY));
      if(ready(health)&&invite){box.className="render-status ready";box.textContent="Owner-only rendering is ready. Confirm all four items below.";$("ownerConsent").hidden=false;}
      else{
        const reasons=[];
        if(!invite)reasons.push("no owner invite");
        if(!health.realRenderingEnabled)reasons.push("rendering disabled");
        if(health.killSwitchOn)reasons.push("kill switch on");
        if(health.testModeOn)reasons.push("test mode on");
        if(Number(health.pilotSpendCapUsd)!==12)reasons.push("US$12 total cap not active");
        if(Number(health.invitedTesterLimit)!==1)reasons.push("owner-only limit not active");
        box.className="render-status locked";box.textContent="Protected rendering remains safely locked: "+reasons.join(", ")+". No photo was sent.";
      }
    }catch{box.className="render-status locked";box.textContent="The protected Worker could not be verified. No photo was sent.";}
    finally{button.disabled=false;}
  }

  async function prepare(){
    if(!sourceFile)throw new Error("Choose a real photo first.");
    let image,release=()=>{};
    try{
      image=await createImageBitmap(sourceFile);
      release=()=>image.close?.();
    }catch{
      const url=URL.createObjectURL(sourceFile);
      release=()=>URL.revokeObjectURL(url);
      try{
        image=await new Promise((resolve,reject)=>{
          const photo=new Image();
          photo.onload=()=>resolve(photo);
          photo.onerror=()=>reject(new Error("This photo could not be opened. Try a JPG, PNG, or a screenshot of the photo."));
          photo.src=url;
        });
      }catch(error){release();throw error;}
    }
    const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
    if(!width||!height){release();throw new Error("The photo has no readable dimensions.");}
    const scale=Math.min(1,1536/Math.max(width,height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    try{canvas.getContext("2d").drawImage(image,0,0,canvas.width,canvas.height);}finally{release();}
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.84));
    if(!blob)throw new Error("The photo could not be prepared.");
    const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
    return{dataUrl,bytes:blob.size,width:canvas.width,height:canvas.height};
  }

  function futureRequests(){
    const sun=$("sun").selectedOptions[0].text;
    const goal=$("goal").selectedOptions[0].text;
    const effort=$("effort").selectedOptions[0].text;
    const style=$("style").selectedOptions[0].text;
    const requests=$("landscapeRequests")?.value.trim()||"";
    return FUTURES.map(([futureId,title,direction])=>({futureId,selectedFuture:title,firstMove:direction,prompt:`Create a photorealistic landscaping concept edit of this exact property photo for ${title}. ${direction} Preserve the building, boundaries, mature trees, camera position, perspective, access and recognisable property layout. Conditions: ${sun}. Priority: ${goal}. Upkeep: ${effort}. Desired feeling: ${style}. Use realistic plants and materials suitable for the conditions. ${requests ? "Additional landscaping requests from the property owner (apply where feasible while preserving the property and access): "+requests+"." : ""} Do not add text, labels, people or fantasy architecture.`}));
  }

  async function run(){
    if(attempted)return;
    attempted=true;$("ownerRun").disabled=true;
    const progress=$("ownerProgress");progress.hidden=false;progress.textContent="Preparing your photo…";
    try{
      const prepared=await prepare();
      const accessCode=sessionStorage.getItem(INVITE_KEY)||"";
      progress.textContent="Creating six life-like concepts. Keep this page open…";
      const response=await fetch(WORKER+"/api/render",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({provider:"openai-gpt-image-2",protocolVersion:"ylf.render.v3",appBuildVersion:"10.55.6.2",imageWidth:prepared.width,imageHeight:prepared.height,count:6,futures:futureRequests(),sessionId:crypto.randomUUID(),accessCode,imageDataUrl:prepared.dataUrl,imageBytes:prepared.bytes,metadataStripped:true,calibration:{usableGround:[{x:.1,y:.72},{x:.9,y:.72}],keepClearAreas:[],protectedAccessRoute:[{x:.1,y:.9},{x:.9,y:.9}],marker5:{x:.5,y:.68}},confirmRender:true,confirmPrivacy:true,confirmImageUse:true,confirmConceptOnly:true,confirmCost:true,maxCostUsd:.9})});
      const results=[];let complete={};
      if(response.ok&&String(response.headers.get("content-type")||"").includes("application/x-ndjson")&&response.body){
        const reader=response.body.getReader(),decoder=new TextDecoder();let pending="";
        const handle=line=>{if(!line.trim())return;const event=JSON.parse(line);if(event.type==="result"&&event.result){results.push(event.result);progress.textContent=`Received ${results.length} of six concepts…`;}if(event.type==="complete")complete=event;};
        while(true){const chunk=await reader.read();if(chunk.done)break;pending+=decoder.decode(chunk.value,{stream:true});const lines=pending.split("\n");pending=lines.pop()||"";lines.forEach(handle);}if(pending.trim())handle(pending);
      }else{complete=await response.json().catch(()=>({}));results.push(...(complete.results||complete.partialResults||[]));}
      if(!response.ok||!complete.ok||results.length!==6)throw new Error(complete.blockReason||complete.message||`${results.length} of six images returned.`);
      $("ownerResults").innerHTML=results.map(result=>`<article class="owner-result"><img src="${result.imageDataUrl||result.imageUrl}" alt="${result.selectedFuture||result.futureId} concept"><b>${result.selectedFuture||result.futureId}</b><small>AI concept render · not a final design</small></article>`).join("");
      progress.textContent="All six life-like concepts are ready. Choose another photo whenever you want to run the next owner test.";
    }catch(error){progress.textContent=`The request stopped safely: ${error.message} No automatic retry was made.`;}
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install,{once:true});else install();
})();
