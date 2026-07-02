
const $=id=>document.getElementById(id);
let futures={}, photo="", selected="belonging", activeTool="bed", canvasObjects=[], canvasShapes=[], measurements=[], designVariants={}, activeVariant="A", clipboardDesign=null, undoStack=[], redoStack=[], selectedObj=null, selectedGroup=null, drawing=false, measuring=false, currentPoints=[], measureStart=null, scaleMetersPerPercent=null, gridSnap=false, visibleLayers={plants:true,paths:true,features:true}, inlineTool="bed", inlineDrawing=false, inlinePoints=[], inlineSelected=null, inlineUndo=[], inlineRedo=[], autosaveTimer=null, lastAutosave=0;
const sample="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 560'><defs><linearGradient id='a' x1='0' y1='0' x2='0' y2='1'><stop stop-color='#dfeecf'/><stop offset='.45' stop-color='#8cad66'/><stop offset='1' stop-color='#2d542b'/></linearGradient></defs><rect width='900' height='560' fill='url(#a)'/><path d='M0 390 C190 300 320 350 465 275 C595 210 720 230 900 178 L900 560 L0 560z' fill='#315c30'/><path d='M0 420 C130 375 260 395 390 340 C520 285 640 300 900 235 L900 330 C670 365 510 370 405 418 C270 480 145 455 0 500z' fill='#d5d2c6'/><path d='M0 438 C155 390 265 420 392 365 C520 310 663 310 900 254' stroke='#f8f8ef' stroke-width='8' fill='none'/><circle cx='470' cy='205' r='86' fill='#315920'/><circle cx='410' cy='220' r='70' fill='#486c25'/><circle cx='535' cy='226' r='76' fill='#274918'/><rect x='460' y='230' width='20' height='170' fill='#5b3b1f'/><path d='M445 370 C480 345 515 348 545 380 C515 405 475 405 445 370' fill='#8a5b2e'/><path d='M0 245 C80 210 150 205 220 230 L220 560 L0 560z' fill='#4c762e'/><path d='M700 150 h155 v20 H700z M700 200 h155 v20 H700z' fill='#fff'/></svg>`);
const img=()=>photo||sample;
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",1200)}
function card(id){const f=futures[id];return `<article class="future ${id===selected?'selected':''}" data-id="${id}"><div class="fh" style="background:${f.color}"><div class="ico">${f.icon}</div><div>${f.n}. ${f.title}<small>${f.subtitle}</small></div></div><div class="fi" style="background-image:url('${img()}');--tint:${f.tint};--fx:${f.fx}"></div><ul>${f.bullets.map(b=>`<li>${b}</li>`).join("")}</ul><div class="strap">${f.strap}</div></article>`}


function renderConceptBoardV48(){
 if(!$("v48ConceptCards")||!futures||!futures[selected])return;
 const image=img();
 const picks=[
  ["belonging","Practical"],
  ["possibility","Beautiful"],
  ["gathering","Unexpected"]
 ];
 $("v48ConceptCards").innerHTML=picks.map(([id,label])=>{
  const f=futures[id];
  return `<article class="v48-concept-card ${selected===id?"active":""}" data-v48-concept="${id}" style="background-image:url('${image}');--tint:${f.tint};--fx:${f.fx}">
    <div class="v48-concept-content">
      <span class="v48-concept-kicker">${label} Direction</span>
      <h3>${f.title}</h3>
      <p>${f.strap}</p>
      <ul>${f.bullets.slice(0,3).map(b=>`<li>${b}</li>`).join("")}</ul>
    </div>
  </article>`;
 }).join("");
 document.querySelectorAll("[data-v48-concept]").forEach(card=>card.onclick=()=>{selected=card.dataset.v48Concept;render();document.getElementById("v48ConceptBoard")?.scrollIntoView({behavior:"smooth",block:"start"})});
 const f=futures[selected];
 $("v48ChosenFuture").textContent=f.title;
 $("v48ConceptScore").textContent=(f.score||84)+"%";
 const actions={belonging:"Define arrival edges and warm lighting",possibility:"Add one memorable focal feature",gathering:"Create a destination seating zone",sanctuary:"Add habitat layers and water",productive:"Start with raised beds and herbs",maker:"Plan access, storage and work zones"};
 $("v48ConceptAction").textContent=actions[selected]||"Start with one small test zone";
}


let freeRating="";

let freeHasCompared=false;
let freeHasCopied=false;
function renderFreeProgress(){
 if(!$("testProgressPercent"))return;
 const done=[!!photo,!!selected,freeHasCompared,freeHasCopied].filter(Boolean).length;
 const pct=Math.max(25,done*25);
 $("testProgressPercent").textContent=pct+"%"; $("testProgressBar").style.width=pct+"%";
 $("checkPhoto").classList.toggle("done",!!photo); $("checkFuture").classList.toggle("done",!!selected); $("checkCompare").classList.toggle("done",freeHasCompared); $("checkSummary").classList.toggle("done",freeHasCopied);
}
function renderShareResult(){
 if(!$("shareResultTitle")||!futures[selected])return;
 const f=futures[selected];
 $("shareResultTitle").textContent=`${f.title} future selected`;
 $("shareResultText").textContent=`${f.strap} Copy this result and send it to someone for quick feedback.`;
}
function shortFreeResult(){const f=futures[selected];return `VerdeAI test result: ${f.title} future. ${f.strap}`;}



function resultCardData(){
 const f=futures[selected];
 const steps={
  belonging:["Define the arrival edge.","Add warm lighting.","Start with one layered garden bed."],
  sanctuary:["Protect existing shade.","Add habitat planting.","Include a small water point."],
  gathering:["Choose the seating zone.","Add evening lighting.","Keep movement paths simple."],
  productive:["Start with herbs or raised beds.","Improve soil first.","Expand only after the first crop works."],
  maker:["Plan access and storage.","Keep working areas clear.","Screen only where needed."],
  possibility:["Choose one strong focal point.","Keep surrounding areas simple.","Test the idea visually first."]
 };
 return {
  future:f.title,
  subtitle:f.subtitle,
  match:f.score||84,
  effort:["gathering","possibility","maker"].includes(selected)?"Higher":"Medium",
  start:["belonging","sanctuary","productive"].includes(selected)?"DIY":"Plan",
  text:f.strap,
  steps:steps[selected]||steps.belonging
 };
}



function renderDashboardRewrite(){
 if(!$("vdashTodayImage")||!futures[selected])return;
 const image=img();
 const f=futures[selected];
 $("vdashTodayImage").style.backgroundImage=`url('${image}')`;
 $("vdashTodayText").textContent=photo?"Photo loaded. Choose a future direction below.":"Demo photo active. Upload your own when ready.";
 $("vdashRecTitle").textContent=`${f.title} + Possibility Hybrid`;
 $("vdashRecText").textContent=`${f.strap} VerdeAI recommends this because it gives the property a clear, believable future while keeping the original photo understandable.`;
 $("vdashOracle").textContent=`The strongest opportunity is not adding more random features. It is choosing one direction and letting the whole property support it. ${f.title} currently gives the clearest story.`;
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("vdashFutures").innerHTML=order.map(id=>{
  const x=futures[id];
  return `<article class="vdash-future ${id===selected?"active":""}" data-vdash-future="${id}">
    <div class="vdash-future-head" style="background:${x.color}"><span>${x.icon}</span><div>${x.n}. ${x.title}<small>${x.subtitle}</small></div></div>
    <div class="vdash-future-img" style="background-image:url('${image}');--tint:${x.tint};--fx:${x.fx}"></div>
    <ul>${x.bullets.map(b=>`<li>${b}</li>`).join("")}</ul>
    <div class="vdash-strap">${x.strap}</div>
  </article>`;
 }).join("");
 document.querySelectorAll("[data-vdash-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.vdashFuture;render();});
 renderDashboardCompass();
 renderDashboardMovie();
 renderDashboardSteps();
}
function renderDashboardCompass(){
 if(!$("vdashCompass"))return;
 const rows=[["⌂","Belonging",84],["★","Possibility",82],["🦋","Sanctuary",71],["🔥","Gathering",58],["◔","Productive",29],["🔧","Maker",12]];
 $("vdashCompass").innerHTML=rows.map(([i,n,s])=>`<div class="vdash-compass-row"><span>${i}</span><b>${n}</b><span>${s}%</span><div class="vdash-compass-bar"><i style="width:${s}%"></i></div></div>`).join("");
}
function renderDashboardMovie(){
 if(!$("vdashMovie"))return;
 const f=futures[selected], image=img();
 const years=[["Year 0","Existing potential"],["Year 1","Define structure"],["Year 2","Layer planting"],["Year 3","Add destination"],["Year 5","Complete direction"]];
 $("vdashMovie").innerHTML=years.map(([y,t])=>`<div class="vdash-year"><div class="vdash-year-img" style="background-image:url('${image}');--tint:${f.tint};--fx:${f.fx}"></div><b>${y}</b><br><small>${t}</small></div>`).join("");
}
function renderDashboardSteps(){
 if(!$("vdashSteps"))return;
 const steps={
  belonging:["Define the arrival edge.","Add warm lighting.","Create one layered garden bed."],
  sanctuary:["Protect shade and calm areas.","Add habitat planting.","Use one water or wildlife feature."],
  gathering:["Choose the social zone.","Add seating and night lighting.","Keep the path obvious."],
  productive:["Start with one raised bed or herbs.","Improve soil first.","Expand only after it works."],
  maker:["Plan access and storage.","Keep working zones clear.","Screen only where useful."],
  possibility:["Choose one strong focal point.","Keep the rest simple.","Test the visual idea first."]
 };
 $("vdashSteps").innerHTML=(steps[selected]||steps.belonging).map(s=>`<li>${s}</li>`).join("");
}
function dashboardSummaryText(){
 const f=futures[selected];
 return `VerdeAI result: ${f.title} + Possibility Hybrid. ${f.strap}`;
}
function renderTesterNotes(){
 if(!$("testerNotesText")||!futures[selected])return;
 const f=futures[selected];
 const notes={
  belonging:["Belonging / arrival","Trying to solve the whole yard at once","Define one welcoming edge first"],
  sanctuary:["Habitat / calm","Over-clearing useful shade","Add one wildlife-friendly layer"],
  gathering:["Social destination","Buying furniture before choosing the zone","Mark the seating area first"],
  productive:["Food / usefulness","Starting too large","Begin with herbs or one raised bed"],
  maker:["Work / practical use","Mixing work zones with relaxation zones","Keep access and storage clear"],
  possibility:["Signature feature","Adding too many focal points","Choose one bold feature only"]
 };
 const n=notes[selected]||notes.belonging;
 $("testerNotesText").textContent=`The ${f.title.toLowerCase()} direction is strongest when the space has one clear job. Keep the first test small and obvious.`;
 $("notePattern").nextElementSibling.textContent=n[0];
 $("noteRisk").nextElementSibling.textContent=n[1];
 $("noteAction").nextElementSibling.textContent=n[2];
}
function renderAlphaStatus(){
 if(!$("freeAlphaStatusText"))return;
 const parts=[];
 if(photo)parts.push("photo loaded"); else parts.push("demo mode");
 if(selected&&futures[selected])parts.push(`${futures[selected].title} selected`);
 if(freeHasCopied)parts.push("result copied");
 $("freeAlphaStatusText").textContent=parts.join(" · ");
}
function renderShareableResultCard(){
 if(!$("shareableImage")||!futures[selected])return;
 const f=futures[selected], image=img(), data=resultCardData();
 $("shareableImage").style.backgroundImage=`url('${image}')`;
 $("shareableImage").style.setProperty("--tint",f.tint);
 $("shareableImage").style.setProperty("--fx",f.fx);
 $("shareableLabel").textContent=`${data.future} Future`;
 $("shareableTitle").textContent=`${data.future} could work here`;
 $("shareableText").textContent=data.text;
 $("shareableMatch").textContent=data.match+"%";
 $("shareableEffort").textContent=data.effort;
 $("shareableStart").textContent=data.start;
 $("shareableSteps").innerHTML=data.steps.map(s=>`<li>${s}</li>`).join("");
}
function resultCardText(){
 const data=resultCardData();
 return `VERDEAI FREE TEST RESULT

Future direction:
${data.future} — ${data.subtitle}

Why this could work:
${data.text}

Match:
${data.match}%

Effort:
${data.effort}

First steps:
${data.steps.map((s,i)=>`${i+1}. ${s}`).join("\\n")}
`;
}
function downloadResultCardJson(){
 const blob=new Blob([JSON.stringify({app:"VerdeAI",type:"free-test-result",selectedFuture:selected,result:resultCardData()},null,2)],{type:"application/json"});
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="verdeai-free-test-result.json";
 a.click();
 URL.revokeObjectURL(a.href);
 toast("Result downloaded");
}
function renderInstantResult(){
 if(!$("instantImage")||!futures[selected])return;
 const f=futures[selected], image=img();
 $("instantImage").style.backgroundImage=`url('${image}')`;
 $("instantImage").style.setProperty("--tint",f.tint);
 $("instantImage").style.setProperty("--fx",f.fx);
 $("instantBadge").textContent=`${f.title} Future`;
 $("instantTitle").textContent=`${f.title} could work here.`;
 $("instantText").textContent=`${f.strap} This gives testers a quick answer without needing to explore every tool first.`;
}
function renderQuickTestMode(){
 if(!$("quickImage")||!futures[selected])return;
 const image=img(), f=futures[selected];
 $("quickImage").style.backgroundImage=`url('${image}')`;
 $("quickImage").style.setProperty("--tint",f.tint);
 $("quickImage").style.setProperty("--fx",f.fx);
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("quickCards").innerHTML=order.map(id=>{const x=futures[id];return `<article class="quick-card ${id===selected?"active":""}" data-quick-future="${id}"><b>${x.icon} ${x.title}</b><span>${x.subtitle}</span></article>`}).join("");
 document.querySelectorAll("[data-quick-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.quickFuture;render()});
}
function renderFreeTestPage(){
 if(!$("freePreviewImage")||!futures||!futures[selected])return;
 const image=img();
 const f=futures[selected];
 $("freePreviewImage").style.backgroundImage=`url('${image}')`;
 $("freePreviewImage").style.setProperty("--tint",f.tint);
 $("freePreviewImage").style.setProperty("--fx",f.fx);
 $("freePreviewTitle").textContent=`${f.title} Future`;
 $("freePreviewSubtitle").textContent=f.subtitle;
 $("freeBefore").style.backgroundImage=`url('${image}')`;
 $("freeAfter").style.backgroundImage=`url('${image}')`;
 $("freeAfter").style.setProperty("--tint",f.tint);
 $("freeAfter").style.setProperty("--fx",f.fx);
 $("freeAfter").style.clipPath=`inset(0 ${100-Number($("freeSlider")?.value||55)}% 0 0)`;
 $("freePlanTitle").textContent=`${f.title} + Possibility Hybrid`;
 $("freePlanText").textContent=`${f.strap} This is a simple test concept, designed to help you decide whether this direction feels useful before spending time or money.`;
 $("freeMetricMatch").textContent=(f.score||84)+"%";
 $("freeMetricEffort").textContent=["gathering","possibility","maker"].includes(selected)?"Higher":"Medium";
 $("freeMetricCost").textContent=["belonging","sanctuary","productive"].includes(selected)?"DIY":"Plan";
 const steps={
  belonging:["Clean the arrival area and define the edges.","Add warm lighting or a simple seat.","Plant one layered garden bed first."],
  sanctuary:["Keep existing shade and add habitat planting.","Add a bird bath or small water point.","Use tough native layers before decoration."],
  gathering:["Pick the social zone before buying furniture.","Add seating and one evening-light feature.","Keep paths simple and obvious."],
  productive:["Start with herbs or one raised bed.","Add compost/mulch before expanding.","Choose food plants that match sunlight."],
  maker:["Decide access and storage first.","Keep work zones clear and practical.","Add screening only where useful."],
  possibility:["Choose one strong focal point.","Keep the rest simple so it stands out.","Test it visually before building."]
 };
 $("freeSteps").innerHTML=(steps[selected]||steps.belonging).map(s=>`<li>${s}</li>`).join("");
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("freeFutureGrid").innerHTML=order.map(id=>{
  const x=futures[id];
  return `<article class="free-card ${id===selected?"active":""}" data-free-future="${id}">
    <div class="free-card-img" style="background-image:url('${image}');--tint:${x.tint};--fx:${x.fx}"></div>
    <div class="free-card-body"><b>${x.title}</b><span>${x.subtitle}</span><p>${x.strap}</p></div>
  </article>`;
 }).join("");
  document.querySelectorAll("[data-free-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.freeFuture;render();document.getElementById("freeResults")?.scrollIntoView({behavior:"smooth",block:"start"})});renderFreeProgress();renderShareResult();
}
function freeSummaryText(){
 const f=futures[selected];
 return `VERDEAI FREE TEST SUMMARY

Selected Future:
${f.title} — ${f.subtitle}

Why:
${f.strap}

Simple First Steps:
${[...document.querySelectorAll("#freeSteps li")].map((li,i)=>`${i+1}. ${li.textContent}`).join("\n")}

Tester Rating:
${freeRating||"Not selected"}

Tester Notes:
${$("freeFeedbackText")?.value||"-"}
`;
}
function renderProductShellV49(){
 if(!$("v49HeroImage")||!futures||!futures[selected])return;
 const image=img(), f=futures[selected];
 $("v49HeroImage").style.backgroundImage=`url('${image}')`; $("v49HeroImage").style.setProperty("--tint",f.tint); $("v49HeroImage").style.setProperty("--fx",f.fx);
 $("v49HeroFuture").textContent=`${f.title} Future`; $("v49HeroScore").textContent=`${f.score||84}% match`;
 $("v49DecisionTitle").textContent=`${f.title} + Possibility Hybrid`;
 $("v49DecisionText").textContent=`${f.strap} This concept keeps the original property understandable while giving it a clear, testable landscape direction.`;
 $("v49MetricMatch").textContent=(f.score||84)+"%"; $("v49MetricItems").textContent=(canvasObjects.length+canvasShapes.length+measurements.length); $("v49MetricVariants").textContent=Object.keys(designVariants||{}).length;
 $("v49Before").style.backgroundImage=`url('${image}')`; $("v49After").style.backgroundImage=`url('${image}')`; $("v49After").style.setProperty("--tint",f.tint); $("v49After").style.setProperty("--fx",f.fx); $("v49After").style.clipPath=`inset(0 ${100-Number($("v49Slider")?.value||55)}% 0 0)`;
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("v49Futures").innerHTML=order.map(id=>{const x=futures[id];return `<article class="v49-future ${id===selected?"active":""}" data-v49-future="${id}"><div class="v49-future-img" style="background-image:url('${image}');--tint:${x.tint};--fx:${x.fx}"></div><div class="v49-future-body"><b>${x.title}</b><span>${x.subtitle}</span><div class="v49-score"><i style="width:${x.score||70}%"></i></div></div></article>`}).join("");
 document.querySelectorAll("[data-v49-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.v49Future;render();document.getElementById("v49ProductShell")?.scrollIntoView({behavior:"smooth",block:"start"})});
}
function renderCommercialDashboardV47(){
 if(!$("v47TodayImage")||!futures||!futures[selected])return;
 const image=img();
 const f=futures[selected];
 $("v47TodayImage").style.backgroundImage=`url('${image}')`;
 $("v47Recommendation").textContent=`${f.title} + Possibility Hybrid`;
 $("v47RecommendationText").textContent=`${f.strap} VerdeAI recommends this because it gives the property a clear, believable future while still respecting the existing photo.`;
 $("v47Oracle").textContent=`This property does not need random additions. It needs one strong direction. ${f.title} gives the site rhythm, purpose and a future people can picture.`;
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("v47FutureCards").innerHTML=order.map(id=>{
  const x=futures[id];
  return `<article class="v47-card ${id===selected?"active":""}" data-v47-future="${id}">
    <div class="v47-card-head" style="background:${x.color}"><span>${x.icon}</span><div>${x.n}. ${x.title}<small>${x.subtitle}</small></div></div>
    <div class="v47-card-img" style="background-image:url('${image}');--tint:${x.tint};--fx:${x.fx}"></div>
    <ul>${x.bullets.map(b=>`<li>${b}</li>`).join("")}</ul>
    <div class="v47-card-note">${x.strap}</div>
  </article>`;
 }).join("");
 document.querySelectorAll("[data-v47-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.v47Future;render()});
 renderV47Compass();
 renderV47Movie();
}
function renderV47Compass(){
 if(!$("v47Compass"))return;
 const rows=[["⌂","Belonging",84],["★","Possibility",82],["🦋","Sanctuary",71],["🔥","Gathering",58],["◔","Productive",29],["🔧","Maker",12]];
 $("v47Compass").innerHTML=rows.map(([i,n,s])=>`<div class="v47-compass-row"><span>${i}</span><b>${n}</b><span>${s}%</span><div class="v47-compass-bar"><i style="width:${s}%"></i></div></div>`).join("");
}
function renderV47Movie(){
 if(!$("v47Movie"))return;
 const f=futures[selected], image=img();
 const years=[["Year 0","Current potential"],["Year 1","Structure begins"],["Year 2","Layers establish"],["Year 3","Features emerge"],["Year 5","Complete direction"]];
 $("v47Movie").innerHTML=years.map(([y,t])=>`<div class="v47-year"><div class="v47-year-img" style="background-image:url('${image}');--tint:${f.tint};--fx:${f.fx}"></div><b>${y}</b><br><small>${t}</small></div>`).join("");
}
function render(){
 $("photoBox").style.backgroundImage=`url('${img()}')`;
 const ids=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("topCards").innerHTML=ids.slice(0,3).map(card).join("");
 $("bottomCards").innerHTML=ids.slice(4,6).map(card).join("");
 document.querySelector(".small-card").outerHTML=card("productive").replace('class="future','class="future small-card');
 document.querySelectorAll("[data-id]").forEach(el=>el.onclick=()=>{selected=el.dataset.id;loadVariantsFromStorage();render()});
 const f=futures[selected];
 $("recTitle").textContent=`${f.title} + Possibility Hybrid`;
 $("recText").textContent=`Your property already has useful structure and visual potential. The ${f.title.toLowerCase()} direction strengthens what exists while creating a memorable, realistic landscape future.`;
 $("oracle").textContent=`This property is not asking for random additions. The strongest opportunity is creating one clear direction. The ${f.title.toLowerCase()} path gives the space rhythm, purpose and a future people can picture.`;
 $("nextSteps").innerHTML=["Review your six futures","Choose your favorite direction","Get your custom 5-Year Plan","See your Property Movie"].map(x=>`<li>${x}</li>`).join("");
 renderCompass(); renderMovie(); renderReport(); renderCompare(); renderCommandCentre(); renderInlineDesigner(); renderTargetShowcase(); renderGuidedFlow(); renderCanvas();
}


function renderCompare(){
 const f=futures[selected];
 if(!$("beforeImg"))return;
 $("beforeImg").style.backgroundImage=`url('${img()}')`;
 $("afterImg").style.backgroundImage=`url('${img()}')`;
 $("afterImg").style.setProperty("--tint",f.tint);
 $("afterImg").style.setProperty("--fx",f.fx);
 $("afterImg").style.clipPath=`inset(0 ${100-Number($("compareSlider")?.value||50)}% 0 0)`;
 $("compareTitle").textContent=`${f.title} Future`;
 $("compareText").textContent=`This preview keeps the original property photo and overlays the ${f.title.toLowerCase()} direction so testers can understand the change before real AI renders are connected.`;
}



function snapValue(value){
 return gridSnap ? Math.round(value/5)*5 : value;
}
function toggleGrid(){
 gridSnap=!gridSnap;
 if($("gridLayer"))$("gridLayer").classList.toggle("show",gridSnap);
 toast(gridSnap?"Grid snap on":"Grid snap off");
}
function toggleSelectedLock(){
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj)return toast("Select an object first");
 obj.locked=!obj.locked;
 renderCanvas();saveCanvasAuto();scheduleAutosave();toast(obj.locked?"Object locked":"Object unlocked");
}
function renderCanvas(){
 if(!$("canvasBase"))return;
 $("canvasBase").style.backgroundImage=`url('${img()}')`;
 document.querySelectorAll("[data-tool]").forEach(b=>b.classList.toggle("active-tool",b.dataset.tool===activeTool));
 renderShapes();$("canvasLayer").innerHTML=canvasObjects.map(o=>`<div class="canvas-object obj-${o.type} ${selectedObj===o.id?"selected":""} ${o.groupId?"grouped":""} ${o.locked?"locked":""}" data-obj="${o.id}" style="left:${o.x}%;top:${o.y}%;--z:${o.z||2};transform:translate(-50%,-50%) rotate(${o.rotate||0}deg) scale(${o.scale||1})">${o.groupId?`<span class="group-badge">G</span>`:""}<span class="handle" data-handle="${o.id}"></span></div>`).join("");
 document.querySelectorAll("[data-obj]").forEach(el=>{
  el.onpointerdown=e=>{
   e.stopPropagation();
   selectedObj=Number(el.dataset.obj);
   const moving=el;
   moving.setPointerCapture(e.pointerId);
   moving.onpointermove=ev=>{
    const box=$("designCanvas").getBoundingClientRect();
    const obj=canvasObjects.find(x=>x.id===selectedObj);
    if(!obj||obj.locked)return;
    const newX=snapValue(Math.max(0,Math.min(100,((ev.clientX-box.left)/box.width)*100)));
    const newY=snapValue(Math.max(0,Math.min(100,((ev.clientY-box.top)/box.height)*100)));
    const dx=newX-obj.x, dy=newY-obj.y;
    if(!moveGroup(obj.id,dx,dy)){obj.x=newX;obj.y=newY;}
    renderCanvas();
   };
   moving.onpointerup=()=>{moving.onpointermove=null; saveCanvasAuto();scheduleAutosave(); renderCanvas(); renderReport();};
   renderCanvas();
  };
 });
 document.querySelectorAll("[data-handle]").forEach(h=>{
  h.onpointerdown=e=>{
   e.stopPropagation();
   const id=Number(h.dataset.handle);
   const obj=canvasObjects.find(x=>x.id===id);
   if(!obj||obj.locked)return;
   selectedObj=id;
   const startX=e.clientX,startY=e.clientY,startScale=obj.scale||1;
   h.setPointerCapture(e.pointerId);
   h.onpointermove=ev=>{
    const delta=(ev.clientX-startX + ev.clientY-startY)/180;
    obj.scale=Math.max(.35,Math.min(3,startScale+delta));
    renderCanvas();
   };
   h.onpointerup=()=>{h.onpointermove=null;saveCanvasAuto();scheduleAutosave();renderReport();};
  };
 });
 renderInspector(); renderDesignSummary(); renderProjectManager(); renderMeasurements(); renderMeasurementPanel(); renderRevisionPanel(); renderLabels(); renderSelectionBox(); applyLayerVisibility();
}

function snapshotCanvas(){
 undoStack.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes}));
 if(undoStack.length>50)undoStack.shift();
 redoStack=[];
}
function restoreCanvas(serialized){
 const data=JSON.parse(serialized);
 canvasObjects=data.objects||[];
 canvasShapes=data.shapes||[];
 selectedObj=null;
 renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
}
function undoCanvas(){
 if(!undoStack.length)return toast("Nothing to undo");
 redoStack.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes}));
 restoreCanvas(undoStack.pop());
}
function redoCanvas(){
 if(!redoStack.length)return toast("Nothing to redo");
 undoStack.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes}));
 restoreCanvas(redoStack.pop());
}
function renderShapes(){
 if(!$("drawLayer"))return;
 $("drawLayer").innerHTML=canvasShapes.map(s=>{
  if(s.type==="drawBed"){
   const pts=s.points.map(p=>`${p.x},${p.y}`).join(" ");
   return `<polygon class="draw-bed" data-layer="plants" points="${pts}"></polygon>`;
  }
  const d=s.points.map((p,i)=>`${i?"L":"M"} ${p.x} ${p.y}`).join(" ");
  return `<path class="draw-path" data-layer="paths" d="${d}"></path>`;
 }).join("");
}
function canvasPoint(e){
 const box=$("designCanvas").getBoundingClientRect();
 return {x:Math.max(0,Math.min(100,((e.clientX-box.left)/box.width)*100)),y:Math.max(0,Math.min(100,((e.clientY-box.top)/box.height)*100))};
}
function startDraw(e){
 if(!["drawBed","drawPath"].includes(activeTool))return false;
 snapshotCanvas();
 drawing=true;
 currentPoints=[canvasPoint(e)];
 $("designCanvas").classList.add("canvas-drawing");
 return true;
}
function moveDraw(e){
 if(!drawing)return;
 const p=canvasPoint(e);
 const last=currentPoints[currentPoints.length-1];
 if(Math.hypot(p.x-last.x,p.y-last.y)>.8){
  currentPoints.push(p);
  const temp={type:activeTool,points:currentPoints};
  const old=canvasShapes;
  canvasShapes=[...old,temp];
  renderShapes();
  canvasShapes=old;
 }
}
function endDraw(){
 if(!drawing)return;
 drawing=false;
 $("designCanvas").classList.remove("canvas-drawing");
 if(currentPoints.length>2){
  canvasShapes.push({id:Date.now(),type:activeTool,points:currentPoints});
 }
 currentPoints=[];
 renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
}

function objectLayer(type){
 if(type==="tree"||type==="bed"||type==="drawBed")return "plants";
 if(type==="path"||type==="drawPath")return "paths";
 return "features";
}
function applyLayerVisibility(){
 document.querySelectorAll("[data-obj]").forEach(el=>{
  const obj=canvasObjects.find(o=>o.id===Number(el.dataset.obj));
  if(obj)el.classList.toggle("hidden-layer",!visibleLayers[objectLayer(obj.type)]);
 });
 if($("drawLayer")){
  [...$("drawLayer").children].forEach(el=>{
   const layer=el.dataset.layer;
   if(layer)el.classList.toggle("hidden-layer",!visibleLayers[layer]);
  });
 }
 document.querySelectorAll("[data-layer-toggle]").forEach(btn=>{
  btn.classList.toggle("layer-off",!visibleLayers[btn.dataset.layerToggle]);
 });
}
function renderLabels(){
 if(!$("labelLayer"))return;
 const names={bed:"Garden bed",path:"Path",tree:"Tree",seat:"Seating",light:"Light"};
 $("labelLayer").innerHTML=canvasObjects.map(o=>`<div class="canvas-label" style="left:${o.x}%;top:${o.y}%">${names[o.type]||o.type}</div>`).join("");
}
function toggleLayer(layer){
 visibleLayers[layer]=!visibleLayers[layer];
 applyLayerVisibility();
 toast((visibleLayers[layer]?"Show ":"Hide ")+layer);
}
function addCanvasObject(e){
 if(!$("designCanvas"))return;
 if(["drawBed","drawPath"].includes(activeTool))return; if(activeTool==="measure")return;
 snapshotCanvas();
 const box=$("designCanvas").getBoundingClientRect();
 const id=Date.now();
 canvasObjects.push({id,type:activeTool,x:snapValue(((e.clientX-box.left)/box.width)*100),y:snapValue(((e.clientY-box.top)/box.height)*100),scale:1,rotate:0,z:Math.max(2,...canvasObjects.map(o=>o.z||2))+1});
 selectedObj=id;
 renderCanvas(); renderReport(); saveCanvasAuto();scheduleAutosave();
}
function renderInspector(){
 if(!$("objectInspector"))return;
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj){$("objectInspector").innerHTML="<b>No object selected</b><br><small>Tap an object to edit it.</small>";return}
 const names={bed:"Garden bed",path:"Path",tree:"Tree",seat:"Seating",light:"Lighting"};
 $("objectInspector").innerHTML=`<b>Selected:</b> ${names[obj.type]||obj.type}<br><small>Scale: ${Math.round((obj.scale||1)*100)}% · Rotate: ${obj.rotate||0}° · ${obj.locked?"Locked":"Unlocked"}</small><br><button id="biggerObj">Bigger</button><button id="smallerObj">Smaller</button><button id="rotateObj">Rotate</button><button id="deleteObj" class="ghost">Delete</button><br><button id="inspectorDuplicate">Duplicate</button><button id="inspectorFront">Front</button><button id="inspectorBack">Back</button><button id="inspectorLock">Lock</button><button id="inspectorGroup">Group</button><button id="inspectorUngroup">Ungroup</button>`;
 $("biggerObj").onclick=()=>{obj.scale=Math.min(2.2,(obj.scale||1)+.15);renderCanvas();saveCanvasAuto()};
 $("smallerObj").onclick=()=>{obj.scale=Math.max(.45,(obj.scale||1)-.15);renderCanvas();saveCanvasAuto()};
 $("rotateObj").onclick=()=>{obj.rotate=((obj.rotate||0)+15)%360;renderCanvas();saveCanvasAuto()};
 $("deleteObj").onclick=()=>{snapshotCanvas();canvasObjects=canvasObjects.filter(x=>x.id!==obj.id);selectedObj=null;renderCanvas();renderReport();saveCanvasAuto()};$("inspectorDuplicate").onclick=duplicateSelectedObject;$("inspectorFront").onclick=bringSelectedForward;$("inspectorBack").onclick=sendSelectedBack;$("inspectorLock").onclick=toggleSelectedLock;$("inspectorGroup").onclick=groupNearbyObjects;$("inspectorUngroup").onclick=ungroupSelectedObjects;
}
function saveCanvasAuto(){try{localStorage.setItem("verdeai.canvas.layout",JSON.stringify({objects:canvasObjects,shapes:canvasShapes,visibleLayers,gridSnap,measurements,scaleMetersPerPercent}))}catch(e){}}
function saveCanvasLayout(){saveCanvasAuto();scheduleAutosave();toast("Canvas layout saved")}
function loadCanvasLayout(){try{const data=JSON.parse(localStorage.getItem("verdeai.canvas.layout")||"{}");canvasObjects=Array.isArray(data)?data:(data.objects||[]);canvasShapes=data.shapes||[];visibleLayers=data.visibleLayers||visibleLayers;gridSnap=!!data.gridSnap;measurements=data.measurements||measurements;scaleMetersPerPercent=data.scaleMetersPerPercent||scaleMetersPerPercent;if($("gridLayer"))$("gridLayer").classList.toggle("show",gridSnap);selectedObj=null;renderCanvas();renderReport();toast("Canvas layout loaded")}catch(e){toast("No saved canvas")}}
function canvasNotes(){
 if(!canvasObjects.length)return "-";
 const names={bed:"Garden bed",path:"Path",tree:"Tree",seat:"Seating",light:"Lighting"};
 return canvasObjects.map(o=>`- ${names[o.type]} at ${Math.round(o.x)}%, ${Math.round(o.y)}%`).join("\\n");
}

function exportCanvasLayout(){
 const payload={version:"v31",photoAttached:!!photo,selectedFuture:selected,objects:canvasObjects,shapes:canvasShapes,visibleLayers,gridSnap,measurements,scaleMetersPerPercent,exportedAt:new Date().toISOString()};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="verdeai-canvas-layout.json";
 a.click();
 URL.revokeObjectURL(a.href);
 toast("Canvas layout exported");
}
function importCanvasLayout(file){
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const payload=JSON.parse(reader.result);
   canvasObjects=Array.isArray(payload.objects)?payload.objects:[]; canvasShapes=Array.isArray(payload.shapes)?payload.shapes:[]; visibleLayers=payload.visibleLayers||visibleLayers;gridSnap=!!payload.gridSnap;measurements=payload.measurements||measurements;scaleMetersPerPercent=payload.scaleMetersPerPercent||scaleMetersPerPercent;
   selectedObj=null;
   renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
   toast("Canvas layout imported");
  }catch(e){
   toast("Import failed");
  }
 };
 reader.readAsText(file);
}

function duplicateSelectedObject(){
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj)return toast("Select an object first");
 snapshotCanvas();
 const copy={...obj,id:Date.now(),x:Math.min(100,obj.x+4),y:Math.min(100,obj.y+4),z:(obj.z||2)+1};
 canvasObjects.push(copy);
 selectedObj=copy.id;
 renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();toast("Object duplicated");
}
function bringSelectedForward(){
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj)return toast("Select an object first");
 snapshotCanvas();
 obj.z=(Math.max(2,...canvasObjects.map(o=>o.z||2))+1);
 renderCanvas();saveCanvasAuto();scheduleAutosave();toast("Moved to front");
}
function sendSelectedBack(){
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj)return toast("Select an object first");
 snapshotCanvas();
 obj.z=1;
 renderCanvas();saveCanvasAuto();scheduleAutosave();toast("Sent to back");
}

function selectedGroupObjects(){
 if(!selectedObj)return [];
 const obj=canvasObjects.find(x=>x.id===selectedObj);
 if(!obj||!obj.groupId)return obj?[obj]:[];
 return canvasObjects.filter(x=>x.groupId===obj.groupId);
}
function groupNearbyObjects(){
 if(!selectedObj)return toast("Select an object first");
 const base=canvasObjects.find(x=>x.id===selectedObj);
 if(!base)return;
 snapshotCanvas();
 const groupId=Date.now();
 const near=canvasObjects.filter(o=>Math.hypot(o.x-base.x,o.y-base.y)<18);
 near.forEach(o=>o.groupId=groupId);
 selectedGroup=groupId;
 renderCanvas();saveCanvasAuto();scheduleAutosave();toast("Nearby objects grouped");
}
function ungroupSelectedObjects(){
 const objs=selectedGroupObjects();
 if(!objs.length)return toast("Select grouped object first");
 snapshotCanvas();
 objs.forEach(o=>delete o.groupId);
 selectedGroup=null;
 renderCanvas();saveCanvasAuto();scheduleAutosave();toast("Group removed");
}
function moveGroup(id,dx,dy){
 const obj=canvasObjects.find(x=>x.id===id);
 if(!obj||!obj.groupId)return false;
 const group=canvasObjects.filter(x=>x.groupId===obj.groupId&&!x.locked);
 group.forEach(o=>{
   o.x=snapValue(Math.max(0,Math.min(100,o.x+dx)));
   o.y=snapValue(Math.max(0,Math.min(100,o.y+dy)));
 });
 return true;
}
function renderSelectionBox(){
 if(!$("selectionBox"))return;
 const group=selectedGroupObjects();
 if(group.length<2){$("selectionBox").style.display="none";return}
 const minX=Math.min(...group.map(o=>o.x)), maxX=Math.max(...group.map(o=>o.x));
 const minY=Math.min(...group.map(o=>o.y)), maxY=Math.max(...group.map(o=>o.y));
 $("selectionBox").style.display="block";
 $("selectionBox").style.left=minX+"%";$("selectionBox").style.top=minY+"%";
 $("selectionBox").style.width=(maxX-minX)+"%";$("selectionBox").style.height=(maxY-minY)+"%";
}

function designCounts(){
 const counts={plants:0,paths:0,features:0,drawnBeds:0,drawnPaths:0};
 canvasObjects.forEach(o=>{
  const layer=objectLayer(o.type);
  if(layer==="plants")counts.plants++;
  if(layer==="paths")counts.paths++;
  if(layer==="features")counts.features++;
 });
 canvasShapes.forEach(s=>{
  if(s.type==="drawBed")counts.drawnBeds++;
  if(s.type==="drawPath")counts.drawnPaths++;
 });
 return counts;
}
function renderDesignSummary(){
 if(!$("designSummary"))return;
 const c=designCounts();
 $("designSummary").innerHTML=`<b>Design Summary</b><br>Plants: ${c.plants} objects + ${c.drawnBeds} drawn beds<br>Paths: ${c.paths} objects + ${c.drawnPaths} drawn paths<br>Features: ${c.features} objects<br>Total editable items: ${canvasObjects.length+canvasShapes.length}`;
}
function copyDesign(){
 clipboardDesign=JSON.stringify({objects:canvasObjects,shapes:canvasShapes,visibleLayers,gridSnap});
 try{localStorage.setItem("verdeai.canvas.clipboard",clipboardDesign)}catch(e){}
 toast("Design copied");
}
function pasteDesign(){
 const raw=clipboardDesign||localStorage.getItem("verdeai.canvas.clipboard");
 if(!raw)return toast("Nothing copied");
 try{
  snapshotCanvas();
  const data=JSON.parse(raw);
  const stamp=Date.now();
  const objects=(data.objects||[]).map((o,i)=>({...o,id:stamp+i,x:Math.min(100,(o.x||50)+3),y:Math.min(100,(o.y||50)+3)}));
  const shapes=(data.shapes||[]).map((s,i)=>({...s,id:stamp+100+i,points:(s.points||[]).map(p=>({x:Math.min(100,p.x+3),y:Math.min(100,p.y+3)}))}));
  canvasObjects=[...canvasObjects,...objects];
  canvasShapes=[...canvasShapes,...shapes];
  renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();toast("Design pasted");
 }catch(e){toast("Paste failed")}
}
function exportDesignPng(){
 if(!$("designCanvas"))return;
 const canvas=document.createElement("canvas");
 const rect=$("designCanvas").getBoundingClientRect();
 canvas.width=Math.max(800,Math.round(rect.width)); canvas.height=Math.max(500,Math.round(rect.height));
 const ctx=canvas.getContext("2d");
 const image=new Image();
 image.onload=()=>{
  ctx.drawImage(image,0,0,canvas.width,canvas.height);
  canvasShapes.forEach(s=>{
    ctx.save();
    if(s.type==="drawBed"){
      ctx.fillStyle="rgba(70,145,55,.55)"; ctx.strokeStyle="rgba(18,95,35,.9)"; ctx.lineWidth=4;
      ctx.beginPath();
      s.points.forEach((p,i)=>{const x=p.x/100*canvas.width,y=p.y/100*canvas.height; i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }else{
      ctx.strokeStyle="rgba(230,220,190,.95)"; ctx.lineWidth=24; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath();
      s.points.forEach((p,i)=>{const x=p.x/100*canvas.width,y=p.y/100*canvas.height; i?ctx.lineTo(x,y):ctx.moveTo(x,y)});
      ctx.stroke();
    }
    ctx.restore();
  });
  canvasObjects.forEach(o=>{
   ctx.save();
   ctx.translate(o.x/100*canvas.width,o.y/100*canvas.height);
   ctx.rotate((o.rotate||0)*Math.PI/180);
   ctx.scale(o.scale||1,o.scale||1);
   const colors={bed:"rgba(70,145,55,.75)",path:"rgba(230,220,190,.9)",tree:"rgba(70,135,45,.9)",seat:"rgba(120,75,42,.85)",light:"rgba(255,220,80,.9)"};
   ctx.fillStyle=colors[o.type]||"rgba(20,90,35,.7)";
   if(o.type==="path"){ctx.fillRect(-80,-14,160,28)}
   else if(o.type==="seat"){ctx.fillRect(-40,-18,80,36)}
   else{ctx.beginPath();ctx.ellipse(0,0,o.type==="bed"?75:38,o.type==="bed"?35:38,0,0,Math.PI*2);ctx.fill()}
   ctx.restore();
  });
  const a=document.createElement("a");
  a.href=canvas.toDataURL("image/png");
  a.download="verdeai-design-preview.png";
  a.click();
 };
 image.src=img();
}

function safeReportText(){try{return reportText()}catch(e){return ""}}
function fullProjectPayload(){
 return {
  app:"VerdeAI",
  version:"v37",
  savedAt:new Date().toISOString(),
  selectedFuture:selected,
  photo,
  canvas:{objects:canvasObjects,shapes:canvasShapes,visibleLayers,gridSnap,measurements,scaleMetersPerPercent,designVariants,activeVariant},
  report:safeReportText()
 };
}
function saveProjectFile(){
 const blob=new Blob([JSON.stringify(fullProjectPayload(),null,2)],{type:"application/json"});
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download=`verdeai-project-${new Date().toISOString().slice(0,10)}.json`;
 a.click();
 URL.revokeObjectURL(a.href);
 toast("Project file saved");
}
function openProjectFile(file){
 const reader=new FileReader();
 reader.onload=()=>{
  try{
   const data=JSON.parse(reader.result);
   selected=data.selectedFuture||selected;
   photo=data.photo||photo;
   if(photo&&$("uploadCopy"))$("uploadCopy").style.display="none";
   const canvas=data.canvas||{};
   canvasObjects=canvas.objects||[];
   canvasShapes=canvas.shapes||[];
   visibleLayers=canvas.visibleLayers||visibleLayers;
   gridSnap=!!canvas.gridSnap;measurements=canvas.measurements||[];scaleMetersPerPercent=canvas.scaleMetersPerPercent||null;
   selectedObj=null;
   saveCanvasAuto();scheduleAutosave();
   render();
   toast("Project opened");scheduleAutosave();
  }catch(e){toast("Project open failed")}
 };
 reader.readAsText(file);
}
function saveProjectLocal(){
 const projects=JSON.parse(localStorage.getItem("verdeai.projects.full")||"[]");
 const payload=fullProjectPayload();
 payload.id=Date.now();
 payload.name=`${futures[selected]?.title||"VerdeAI"} project`;
 projects.unshift(payload);
 localStorage.setItem("verdeai.projects.full",JSON.stringify(projects.slice(0,8)));
 renderProjectManager();
 toast("Project saved locally");
}
function loadProjectLocal(id){
 const projects=JSON.parse(localStorage.getItem("verdeai.projects.full")||"[]");
 const data=projects.find(p=>p.id===id);
 if(!data)return;
 selected=data.selectedFuture||selected;
 photo=data.photo||photo;
 if(photo&&$("uploadCopy"))$("uploadCopy").style.display="none";
 const canvas=data.canvas||{};
 canvasObjects=canvas.objects||[];
 canvasShapes=canvas.shapes||[];
 visibleLayers=canvas.visibleLayers||visibleLayers;
 gridSnap=!!canvas.gridSnap;measurements=canvas.measurements||[];scaleMetersPerPercent=canvas.scaleMetersPerPercent||null;
 selectedObj=null;
 saveCanvasAuto();scheduleAutosave();
 render();
 toast("Local project loaded");scheduleAutosave();
}
function deleteProjectLocal(id){
 const projects=JSON.parse(localStorage.getItem("verdeai.projects.full")||"[]").filter(p=>p.id!==id);
 localStorage.setItem("verdeai.projects.full",JSON.stringify(projects));
 renderProjectManager();
 toast("Local project deleted");
}
function renderProjectManager(){
 if(!$("projectManager"))return;
 const projects=JSON.parse(localStorage.getItem("verdeai.projects.full")||"[]");
 $("projectManager").innerHTML=`<b>Project Manager</b><br><small>Save complete projects with photo, future, canvas and report data.</small>
 <div class="buttons"><button id="localSaveProject">Save Local</button><button id="downloadProjectFile" class="ghost">Download Project</button></div>
 ${projects.length?projects.map(p=>`<div class="project-row"><span>${p.name}<br><small>${new Date(p.savedAt).toLocaleString()}</small></span><button data-load-project="${p.id}">Open</button><button data-delete-project="${p.id}" class="ghost">Delete</button></div>`).join(""):"<p>No saved local projects yet.</p>"}`;
 $("localSaveProject").onclick=saveProjectLocal;
 $("downloadProjectFile").onclick=saveProjectFile;
 document.querySelectorAll("[data-load-project]").forEach(b=>b.onclick=()=>loadProjectLocal(Number(b.dataset.loadProject)));
 document.querySelectorAll("[data-delete-project]").forEach(b=>b.onclick=()=>deleteProjectLocal(Number(b.dataset.deleteProject)));
}

function percentDistance(a,b){
 const dx=b.x-a.x, dy=b.y-a.y;
 return Math.hypot(dx,dy);
}
function measurementLength(m){
 const dist=percentDistance(m.a,m.b);
 return scaleMetersPerPercent ? `${(dist*scaleMetersPerPercent).toFixed(2)} m` : `${dist.toFixed(1)}%`;
}
function renderMeasurements(){
 if(!$("drawLayer"))return;
 const existing=$("drawLayer").innerHTML;
 const measurementSvg=measurements.map(m=>`<line class="measure-line" data-layer="features" x1="${m.a.x}" y1="${m.a.y}" x2="${m.b.x}" y2="${m.b.y}"></line>`).join("");
 if(existing.includes("measure-line")){
   $("drawLayer").innerHTML=existing.replace(/<line class="measure-line"[\\s\\S]*?<\\/line>/g,"")+measurementSvg;
 }else{
   $("drawLayer").innerHTML=existing+measurementSvg;
 }
 renderMeasurementLabels();
}
function renderMeasurementLabels(){
 if(!$("labelLayer"))return;
 document.querySelectorAll(".measure-label").forEach(x=>x.remove());
 measurements.forEach(m=>{
  const div=document.createElement("div");
  div.className="measure-label";
  div.textContent=measurementLength(m);
  div.style.left=((m.a.x+m.b.x)/2)+"%";
  div.style.top=((m.a.y+m.b.y)/2)+"%";
  $("labelLayer").appendChild(div);
 });
}
function renderMeasurementPanel(){
 if(!$("measurementPanel"))return;
 const totalPercent=measurements.reduce((sum,m)=>sum+percentDistance(m.a,m.b),0);
 const total=scaleMetersPerPercent ? `${(totalPercent*scaleMetersPerPercent).toFixed(2)} m` : `${totalPercent.toFixed(1)}%`;
 $("measurementPanel").innerHTML=`<b>Measurement Tool</b><br>
 <small>Mode: ${activeTool==="measure"?"Measure active":"inactive"} · Scale: ${scaleMetersPerPercent?scaleMetersPerPercent.toFixed(3)+" m/%":"not set"}</small><br>
 Measurements: ${measurements.length}<br>
 Total measured length: ${total}<br>
 <div class="buttons"><button id="clearMeasurements" class="ghost">Clear Measurements</button></div>`;
 $("clearMeasurements").onclick=()=>{snapshotCanvas();measurements=[];renderCanvas();saveCanvasAuto();scheduleAutosave();toast("Measurements cleared")};
 if($("measureBtn"))$("measureBtn").classList.toggle("measure-active",activeTool==="measure");
}
function startMeasure(e){
 if(activeTool!=="measure")return false;
 const p=canvasPoint(e);
 if(!measureStart){measureStart=p;toast("Tap second point");return true}
 snapshotCanvas();
 measurements.push({id:Date.now(),a:measureStart,b:p});
 measureStart=null;
 renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
 toast("Measurement added");
 return true;
}
function openScaleModal(){
 if(!$("scaleModal"))return;
 $("scaleModal").classList.add("open");
}
function closeScaleModal(){
 if($("scaleModal"))$("scaleModal").classList.remove("open");
}
function applyScaleFromLastMeasurement(){
 const latest=measurements[measurements.length-1];
 const metres=Number($("scaleMetersInput")?.value||0);
 if(!latest||!metres)return toast("Draw a line and enter metres");
 const dist=percentDistance(latest.a,latest.b);
 scaleMetersPerPercent=metres/dist;
 closeScaleModal();
 renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
 toast("Scale applied");
}

function safeReportText(){try{return reportText()}catch(e){return ""}}
function coreProjectState(){
 return {
  selectedFuture:selected,
  photo,
  canvas:{objects:canvasObjects,shapes:canvasShapes,visibleLayers,gridSnap,measurements,scaleMetersPerPercent,designVariants,activeVariant},
  updatedAt:new Date().toISOString()
 };
}
function restoreProjectState(data){
 if(!data)return;
 selected=data.selectedFuture||selected;
 photo=data.photo||photo;
 if(photo&&$("uploadCopy"))$("uploadCopy").style.display="none";
 const c=data.canvas||{};
 canvasObjects=c.objects||[];
 canvasShapes=c.shapes||[];
 visibleLayers=c.visibleLayers||visibleLayers;
 gridSnap=!!c.gridSnap;
 measurements=c.measurements||[];
 scaleMetersPerPercent=c.scaleMetersPerPercent||null;designVariants=c.designVariants||designVariants;activeVariant=c.activeVariant||activeVariant;
 selectedObj=null;
 saveCanvasAuto();scheduleAutosave();
 render();
}
function autosaveProject(){
 try{
  localStorage.setItem("verdeai.autosave.current",JSON.stringify(coreProjectState()));
  lastAutosave=Date.now();
  renderRevisionPanel();
 }catch(e){}
}
function scheduleAutosave(){
 clearTimeout(autosaveTimer);
 autosaveTimer=setTimeout(autosaveProject,400);
}
function createRevisionSnapshot(label="Manual snapshot"){
 try{
  const revisions=JSON.parse(localStorage.getItem("verdeai.revisions")||"[]");
  const payload=coreProjectState();
  payload.id=Date.now();
  payload.label=label;
  revisions.unshift(payload);
  localStorage.setItem("verdeai.revisions",JSON.stringify(revisions.slice(0,20)));
  autosaveProject();
  renderRevisionPanel();
  toast("Snapshot saved");
 }catch(e){toast("Snapshot failed")}
}
function restoreRevision(id){
 const revisions=JSON.parse(localStorage.getItem("verdeai.revisions")||"[]");
 const rev=revisions.find(r=>r.id===id);
 if(!rev)return;
 restoreProjectState(rev);
 toast("Revision restored");
}
function deleteRevision(id){
 const revisions=JSON.parse(localStorage.getItem("verdeai.revisions")||"[]").filter(r=>r.id!==id);
 localStorage.setItem("verdeai.revisions",JSON.stringify(revisions));
 renderRevisionPanel();
 toast("Revision deleted");
}
function restoreAutosave(){
 try{
  const data=JSON.parse(localStorage.getItem("verdeai.autosave.current")||"null");
  if(data){restoreProjectState(data);toast("Autosave restored")}
 }catch(e){}
}
function renderRevisionPanel(){
 if(!$("revisionPanel"))return;
 const revisions=JSON.parse(localStorage.getItem("verdeai.revisions")||"[]");
 const auto=localStorage.getItem("verdeai.autosave.current");
 const autoText=lastAutosave?new Date(lastAutosave).toLocaleTimeString():(auto?"available":"not saved yet");
 $("revisionPanel").innerHTML=`<b>Revision History</b><br><small><span class="autosave-dot"></span>Autosave: ${autoText}</small>
 <div class="buttons"><button id="restoreAutosaveBtn" class="ghost">Restore Autosave</button><button id="makeSnapshotBtn">Snapshot Now</button></div>
 ${revisions.length?revisions.map(r=>`<div class="revision-row"><span>${r.label}<br><small>${new Date(r.updatedAt||r.id).toLocaleString()}</small></span><button data-restore-rev="${r.id}">Restore</button><button data-delete-rev="${r.id}" class="ghost">Delete</button></div>`).join(""):"<p>No snapshots yet.</p>"}`;
 $("restoreAutosaveBtn").onclick=restoreAutosave;
 $("makeSnapshotBtn").onclick=()=>createRevisionSnapshot();
 document.querySelectorAll("[data-restore-rev]").forEach(b=>b.onclick=()=>restoreRevision(Number(b.dataset.restoreRev)));
 document.querySelectorAll("[data-delete-rev]").forEach(b=>b.onclick=()=>deleteRevision(Number(b.dataset.deleteRev)));
}


function inlineSnapshot(){
 inlineUndo.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes,measurements}));
 if(inlineUndo.length>50)inlineUndo.shift();
 inlineRedo=[];
}
function restoreInlineState(raw){
 const data=JSON.parse(raw);
 canvasObjects=data.objects||[];
 canvasShapes=data.shapes||[];
 measurements=data.measurements||[];
 inlineSelected=null;
 renderCanvas();
 renderInlineDesigner();
 renderReport();
 saveCanvasAuto();
}
function inlineUndoAction(){
 if(!inlineUndo.length)return toast("Nothing to undo");
 inlineRedo.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes,measurements}));
 restoreInlineState(inlineUndo.pop());
}
function inlineRedoAction(){
 if(!inlineRedo.length)return toast("Nothing to redo");
 inlineUndo.push(JSON.stringify({objects:canvasObjects,shapes:canvasShapes,measurements}));
 restoreInlineState(inlineRedo.pop());
}
function inlinePoint(e){
 const box=$("inlineCanvas").getBoundingClientRect();
 return {x:Math.max(0,Math.min(100,((e.clientX-box.left)/box.width)*100)),y:Math.max(0,Math.min(100,((e.clientY-box.top)/box.height)*100))};
}
function renderInlineDesigner(){
 if(!$("inlineBase"))return;
 $("inlineBase").style.backgroundImage=`url('${img()}')`;
 document.querySelectorAll("[data-inline-tool]").forEach(b=>b.classList.toggle("active-tool",b.dataset.inlineTool===inlineTool));
 renderInlineShapes();
 renderInlineObjects();
 renderInlineLabels();
 renderInlineInspector();
 renderInlineVariants();
 renderInlineSummary();
 renderInlineMeasurements();
}
function renderInlineShapes(){
 if(!$("inlineDrawLayer"))return;
 $("inlineDrawLayer").innerHTML=canvasShapes.map(s=>{
  if(s.type==="drawBed"){
   return `<polygon class="inline-draw-bed" points="${s.points.map(p=>`${p.x},${p.y}`).join(" ")}"></polygon>`;
  }
  return `<path class="inline-draw-path" d="${s.points.map((p,i)=>`${i?"L":"M"} ${p.x} ${p.y}`).join(" ")}"></path>`;
 }).join("") + measurements.map(m=>`<line class="inline-measure" x1="${m.a.x}" y1="${m.a.y}" x2="${m.b.x}" y2="${m.b.y}"></line>`).join("");
}
function renderInlineObjects(){
 if(!$("inlineObjectLayer"))return;
 $("inlineObjectLayer").innerHTML=canvasObjects.map(o=>`<div class="inline-item inline-${o.type} ${inlineSelected===o.id?"selected":""}" data-inline-obj="${o.id}" style="left:${o.x}%;top:${o.y}%;--z:${o.z||2};transform:translate(-50%,-50%) rotate(${o.rotate||0}deg) scale(${o.scale||1})"><span class="inline-handle" data-inline-handle="${o.id}"></span></div>`).join("");
 document.querySelectorAll("[data-inline-obj]").forEach(el=>{
  el.onpointerdown=e=>{
   e.stopPropagation();
   const id=Number(el.dataset.inlineObj);
   const obj=canvasObjects.find(o=>o.id===id);
   if(!obj||obj.locked)return;
   inlineSnapshot();
   inlineSelected=id;
   const box=$("inlineCanvas").getBoundingClientRect();
   el.setPointerCapture(e.pointerId);
   el.onpointermove=ev=>{
    obj.x=Math.max(0,Math.min(100,((ev.clientX-box.left)/box.width)*100));
    obj.y=Math.max(0,Math.min(100,((ev.clientY-box.top)/box.height)*100));
    el.style.left=obj.x+"%";el.style.top=obj.y+"%";
   };
   el.onpointerup=()=>{el.onpointermove=null;selectedObj=inlineSelected;renderCanvas();renderInlineDesigner();renderReport();saveCanvasAuto();scheduleAutosave();};
   renderInlineDesigner();
  };
 });
 document.querySelectorAll("[data-inline-handle]").forEach(h=>{
  h.onpointerdown=e=>{
   e.stopPropagation();
   const obj=canvasObjects.find(o=>o.id===Number(h.dataset.inlineHandle));
   if(!obj||obj.locked)return;
   inlineSnapshot();
   inlineSelected=obj.id;
   const sx=e.clientX,sy=e.clientY,ss=obj.scale||1;
   h.setPointerCapture(e.pointerId);
   h.onpointermove=ev=>{obj.scale=Math.max(.35,Math.min(3,ss+((ev.clientX-sx)+(ev.clientY-sy))/180));renderInlineObjects();renderInlineInspector();};
   h.onpointerup=()=>{h.onpointermove=null;selectedObj=inlineSelected;renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();};
  };
 });
}
function renderInlineLabels(){
 if(!$("inlineLabelLayer"))return;
 const names={bed:"Bed",path:"Path",tree:"Tree",seat:"Seat",light:"Light"};
 $("inlineLabelLayer").innerHTML=canvasObjects.map(o=>`<div class="inline-label" style="left:${o.x}%;top:${o.y}%">${names[o.type]||o.type}</div>`).join("")+
 measurements.map(m=>`<div class="inline-label" style="left:${(m.a.x+m.b.x)/2}%;top:${(m.a.y+m.b.y)/2}%">${measurementLength(m)}</div>`).join("");
}
function renderInlineInspector(){
 if(!$("inlineInspector"))return;
 const obj=canvasObjects.find(o=>o.id===inlineSelected);
 if(!obj){$("inlineInspector").innerHTML="No object selected.";return}
 const names={bed:"Garden bed",path:"Path",tree:"Tree",seat:"Seating",light:"Lighting"};
 $("inlineInspector").innerHTML=`<div class="inline-card"><b>${names[obj.type]||obj.type}</b><br>Scale ${Math.round((obj.scale||1)*100)}% · Rotate ${obj.rotate||0}°<br><button id="inlineBigger">Bigger</button> <button id="inlineSmaller">Smaller</button> <button id="inlineRotate">Rotate</button> <button id="inlineDelete" class="ghost">Delete</button></div>`;
 $("inlineBigger").onclick=()=>{inlineSnapshot();obj.scale=Math.min(3,(obj.scale||1)+.15);renderInlineDesigner();renderCanvas();saveCanvasAuto()};
 $("inlineSmaller").onclick=()=>{inlineSnapshot();obj.scale=Math.max(.35,(obj.scale||1)-.15);renderInlineDesigner();renderCanvas();saveCanvasAuto()};
 $("inlineRotate").onclick=()=>{inlineSnapshot();obj.rotate=((obj.rotate||0)+15)%360;renderInlineDesigner();renderCanvas();saveCanvasAuto()};
 $("inlineDelete").onclick=()=>{inlineSnapshot();canvasObjects=canvasObjects.filter(o=>o.id!==obj.id);inlineSelected=null;selectedObj=null;renderInlineDesigner();renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave()};
}
function renderInlineSummary(){
 if(!$("inlineSummary"))return;
 const c=designCounts();
 $("inlineSummary").innerHTML=`<div class="inline-card"><b>${canvasObjects.length+canvasShapes.length}</b> editable design items<br>${c.plants} plants/features · ${c.paths} paths · ${c.drawnBeds+c.drawnPaths} drawn zones</div>`;
}
function renderInlineMeasurements(){
 if(!$("inlineMeasurements"))return;
 const total=measurements.reduce((sum,m)=>sum+percentDistance(m.a,m.b),0);
 const real=scaleMetersPerPercent?`${(total*scaleMetersPerPercent).toFixed(2)} m`:`${total.toFixed(1)}%`;
 $("inlineMeasurements").innerHTML=`<div class="inline-card">${measurements.length} lines<br>Total: <b>${real}</b></div>`;
}
function inlineCanvasClick(e){
 if(["drawBed","drawPath"].includes(inlineTool))return;
 if(inlineTool==="measure"){
   const p=inlinePoint(e);
   if(!measureStart){measureStart=p;toast("Tap second point");return}
   inlineSnapshot();
   measurements.push({id:Date.now(),a:measureStart,b:p});
   measureStart=null;
   renderInlineDesigner();renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();toast("Measurement added");
   return;
 }
 inlineSnapshot();
 const p=inlinePoint(e);
 const id=Date.now();
 canvasObjects.push({id,type:inlineTool,x:p.x,y:p.y,scale:1,rotate:0,z:Math.max(2,...canvasObjects.map(o=>o.z||2))+1});
 inlineSelected=id;selectedObj=id;
 renderInlineDesigner();renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
}
function inlineStartDraw(e){
 if(!["drawBed","drawPath"].includes(inlineTool))return false;
 inlineSnapshot();
 inlineDrawing=true;
 inlinePoints=[inlinePoint(e)];
 return true;
}
function inlineMoveDraw(e){
 if(!inlineDrawing)return;
 const p=inlinePoint(e), last=inlinePoints[inlinePoints.length-1];
 if(Math.hypot(p.x-last.x,p.y-last.y)>.8){
  inlinePoints.push(p);
  const saved=canvasShapes;
  canvasShapes=[...saved,{type:inlineTool,points:inlinePoints}];
  renderInlineShapes();
  canvasShapes=saved;
 }
}
function inlineEndDraw(){
 if(!inlineDrawing)return;
 inlineDrawing=false;
 if(inlinePoints.length>2){
  canvasShapes.push({id:Date.now(),type:inlineTool,points:inlinePoints});
 }
 inlinePoints=[];
 renderInlineDesigner();renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();
}
function inlineExportPng(){
 exportDesignPng();
}

function currentDesignState(){
 return {
  objects:JSON.parse(JSON.stringify(canvasObjects)),
  shapes:JSON.parse(JSON.stringify(canvasShapes)),
  measurements:JSON.parse(JSON.stringify(measurements)),
  visibleLayers:JSON.parse(JSON.stringify(visibleLayers)),
  gridSnap,
  scaleMetersPerPercent
 };
}
function applyDesignState(data){
 if(!data)return;
 canvasObjects=JSON.parse(JSON.stringify(data.objects||[]));
 canvasShapes=JSON.parse(JSON.stringify(data.shapes||[]));
 measurements=JSON.parse(JSON.stringify(data.measurements||[]));
 visibleLayers=data.visibleLayers||visibleLayers;
 gridSnap=!!data.gridSnap;
 scaleMetersPerPercent=data.scaleMetersPerPercent||scaleMetersPerPercent;
 selectedObj=null;
 inlineSelected=null;
 renderCanvas();
 renderInlineDesigner();
 renderReport();
 saveCanvasAuto();
 scheduleAutosave();
}
function saveVariant(slot){
 designVariants[slot]=currentDesignState();
 activeVariant=slot;
 try{localStorage.setItem("verdeai.design.variants",JSON.stringify(designVariants))}catch(e){}
 renderInlineVariants();
 toast(`Variant ${slot} saved`);
}
function loadVariant(slot){
 const data=designVariants[slot];
 if(!data)return toast(`Variant ${slot} is empty`);
 activeVariant=slot;
 applyDesignState(data);
 toast(`Variant ${slot} loaded`);
}
function loadVariantsFromStorage(){
 try{designVariants=JSON.parse(localStorage.getItem("verdeai.design.variants")||"{}")}catch(e){designVariants={}}
}
function renderInlineVariants(){
 if(!$("inlineVariants"))return;
 const labels={A:"Practical",B:"Beautiful",C:"Unexpected"};
 $("inlineVariants").innerHTML=["A","B","C"].map(slot=>{
  const v=designVariants[slot];
  const count=v?(v.objects?.length||0)+(v.shapes?.length||0):0;
  return `<div class="variant-card ${activeVariant===slot?"active":""}" data-variant="${slot}"><b>Variant ${slot}: ${labels[slot]}</b><small>${v?count+" design items saved":"Empty — save current design here"}</small></div>`;
 }).join("");
 document.querySelectorAll("[data-variant]").forEach(card=>card.onclick=()=>loadVariant(card.dataset.variant));
}


let currentFlowStep="upload";
function renderGuidedFlow(){
 if(!$("flowImage")||!futures[selected])return;
 const f=futures[selected];
 const image=img();
 $("flowImage").style.backgroundImage=`url('${image}')`;
 $("flowImage").style.setProperty("--tint",f.tint);
 $("flowImage").style.setProperty("--fx",f.fx);
 document.querySelectorAll("[data-flow-step]").forEach(btn=>btn.classList.toggle("active",btn.dataset.flowStep===currentFlowStep));
 const content={
  upload:["Start with one property photo","Upload a photo from the tester's property, or use the demo image to explore the flow.",`<label>Upload Photo<input id="flowUploadInput" type="file" accept="image/*"></label><button class="ghost-action" id="flowUseDemo">Use Demo</button>`],
  generate:["Generate six possible futures","VerdeAI turns one image into six directions so the tester can compare what the property could become.",`<button id="flowGenerateBtn">Generate Futures</button><button class="ghost-action" id="flowJumpShowcase">View Showcase</button>`],
  compare:["Compare the directions visually","Choose the future that feels most useful, believable or exciting. The recommendation and timeline update instantly.",`<button id="flowPrevFuture" class="ghost-action">Previous Future</button><button id="flowNextFuture">Next Future</button>`],
  edit:["Edit the chosen direction","Open the production designer to draw beds, paths, measurements and landscape objects over the uploaded photo.",`<button id="flowEditBtn">Open Designer</button><button class="ghost-action" id="flowSaveVariant">Save Variant</button>`],
  export:["Export a tester-ready result","Save the project, export a PNG concept or copy the report so the idea can be shared.",`<button id="flowExportPng">Export PNG</button><button class="ghost-action" id="flowReportBtn">Open Report</button>`]
 };
 const [title,text,actions]=content[currentFlowStep];
 $("flowTitle").textContent=title;
 $("flowText").textContent=text;
 $("flowActions").innerHTML=actions;
 wireFlowActions();
}
function setFlowStep(step){
 currentFlowStep=step;
 renderGuidedFlow();
 document.getElementById("guidedAlphaFlow")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function wireFlowActions(){
 if($("flowUploadInput"))$("flowUploadInput").onchange=e=>{const f=e.target.files?.[0];if(f)load(f);currentFlowStep="generate";renderGuidedFlow()};
 if($("flowUseDemo"))$("flowUseDemo").onclick=()=>{currentFlowStep="generate";renderGuidedFlow();toast("Demo loaded")};
 if($("flowGenerateBtn"))$("flowGenerateBtn").onclick=async()=>{await analyse();currentFlowStep="compare";renderGuidedFlow()};
 if($("flowJumpShowcase"))$("flowJumpShowcase").onclick=()=>document.getElementById("targetShowcase")?.scrollIntoView({behavior:"smooth",block:"start"});
 if($("flowPrevFuture"))$("flowPrevFuture").onclick=()=>cycleFuture(-1);
 if($("flowNextFuture"))$("flowNextFuture").onclick=()=>cycleFuture(1);
 if($("flowEditBtn"))$("flowEditBtn").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};
 if($("flowSaveVariant"))$("flowSaveVariant").onclick=()=>saveVariant(activeVariant||"A");
 if($("flowExportPng"))$("flowExportPng").onclick=inlineExportPng;
 if($("flowReportBtn"))$("flowReportBtn").onclick=()=>{$("reportDrawer").classList.add("open");renderReport()};
}
function cycleFuture(direction){
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 const i=order.indexOf(selected);
 selected=order[(i+direction+order.length)%order.length];
 render();
}
function renderTargetShowcase(){
 if(!$("showTodayImg")||!futures||!futures[selected])return;
 const image=img();
 const f=futures[selected];
 $("showTodayImg").style.backgroundImage=`url('${image}')`;
 $("showRecTitle").textContent=`${f.title} + Possibility Hybrid`;
 $("showRecText").textContent=`This direction works because it builds on the existing photo instead of fighting it. ${f.title} gives the property a clear identity, practical next steps and a future testers can immediately understand.`;
 $("showOracle").textContent=`The strongest opportunity is not adding more random features. It is choosing one believable direction and letting every layer support it. ${f.title} is currently the clearest path.`;
 const order=["belonging","sanctuary","gathering","productive","maker","possibility"];
 $("showFutureGrid").innerHTML=order.map(id=>{
  const x=futures[id];
  return `<article class="show-future ${id===selected?"active":""}" data-show-future="${id}">
    <div class="show-future-head" style="background:${x.color}"><span>${x.icon}</span><div>${x.n}. ${x.title}<small>${x.subtitle}</small></div></div>
    <div class="show-future-img" style="background-image:url('${image}');--tint:${x.tint};--fx:${x.fx}"></div>
    <ul>${x.bullets.map(b=>`<li>${b}</li>`).join("")}</ul>
    <div class="show-strap">${x.strap}</div>
  </article>`;
 }).join("");
 document.querySelectorAll("[data-show-future]").forEach(card=>card.onclick=()=>{selected=card.dataset.showFuture;render();document.getElementById("targetShowcase")?.scrollIntoView({behavior:"smooth",block:"start"})});
 renderShowCompass();
 renderShowMovie();
}
function renderShowCompass(){
 if(!$("showCompass"))return;
 const rows=[["⌂","Belonging",84],["★","Possibility",82],["🦋","Sanctuary",71],["🔥","Gathering",58],["◔","Productive",29],["🔧","Maker",12]];
 $("showCompass").innerHTML=rows.map(([i,n,s])=>`<div class="show-compass-row"><span>${i}</span><b>${n}</b><span>${s}%</span><div class="bar"><span style="width:${s}%"></span></div></div>`).join("");
}
function renderShowMovie(){
 if(!$("showMovie"))return;
 const f=futures[selected];
 const image=img();
 const years=[["Year 0","Current property potential."],["Year 1","Structure and first layers."],["Year 2","Planting takes shape."],["Year 3","Features become useful."],["Year 5","Complete landscape direction."]];
 $("showMovie").innerHTML=years.map(([y,t])=>`<div class="show-year"><div class="show-year-img" style="background-image:url('${image}');--tint:${f.tint};--fx:${f.fx}"></div><b>${y}</b><br><small>${t}</small></div>`).join("");
}
function renderCommandCentre(){
 if(!$("cmdBefore"))return;
 const f=futures[selected];
 $("cmdBefore").style.backgroundImage=`url('${img()}')`;
 $("cmdAfter").style.backgroundImage=`url('${img()}')`;
 $("cmdAfter").style.setProperty("--tint",f.tint);
 $("cmdAfter").style.setProperty("--fx",f.fx);
 $("cmdFutureTitle").textContent=`${f.title} Future`;
 $("cmdFutureText").textContent=`${f.subtitle}. Use the editable canvas to draw beds, paths, place objects, measure areas, save projects and create a tester-ready concept.`;
 $("cmdPhotoStatus").textContent=photo?"Photo loaded":"Waiting for property photo";
 $("cmdDesignStatus").textContent=canvasObjects.length+canvasShapes.length?`${canvasObjects.length} placed objects · ${canvasShapes.length} drawn zones`:"Ready for landscape design";
 $("cmdMeasureStatus").textContent=scaleMetersPerPercent?`${measurements.length} measurements · scale set`:`${measurements.length} measurements · no scale`;
 $("cmdSaveStatus").textContent=localStorage.getItem("verdeai.autosave.current")?"Autosave available":"Autosave ready";
}
function reportText(){
 const f=futures[selected];
 return `VERDEAI TEST REPORT

Selected Future:
${f.title} — ${f.subtitle}

Recommendation:
${f.title} + Possibility Hybrid

Why:
Your property already has useful structure and visual potential. The ${f.title.toLowerCase()} direction strengthens what exists while creating a memorable, realistic landscape future.

Key Features:
${f.bullets.map(x=>"- "+x).join("\n")}

Editable Canvas Items:\n${canvasNotes()}\n\nDesign Summary:\n${JSON.stringify(designCounts())}\n\nSaved Variants:\n${Object.keys(designVariants).join(", ")||"-"}\n\nMeasurements:\n${measurements.map(m=>"- "+measurementLength(m)).join("\n")||"-"}\n\nFirst Practical Move:
Pick one small area and test the ${f.title.toLowerCase()} idea before spending serious money.

Next Steps:
- Review the six futures
- Choose the direction that feels most natural
- Start with a low-cost test zone
- Build the property in stages
`;
}
function renderReport(){
 if($("testReport"))$("testReport").textContent=reportText();
}

function renderCompass(){const order=[["⌂","Belonging",84],["★","Possibility",82],["🦋","Sanctuary",71],["🔥","Gathering",58],["◔","Productive",29],["🔧","Maker",12]];$("compass").innerHTML=order.map(([i,n,s])=>`<div class="compass-row"><span>${i}</span><b>${n}</b><span>${s}%</span><div class="bar"><span style="width:${s}%"></span></div></div>`).join("")}
function renderMovie(){const f=futures[selected];const years=[["Year 0 - Today","Well maintained and full of potential."],["Year 1","Lighting, key plantings and definition."],["Year 2","Layers build in. The garden takes shape."],["Year 3","Outdoor rooms and features emerge."],["Year 5","A complete, thriving arrival experience."]];$("movie").innerHTML=years.map(([y,t])=>`<div class="year"><div class="thumb" style="background-image:url('${img()}');--tint:${f.tint};--fx:${f.fx}"></div><b>${y}</b><br><small>${t}</small></div>`).join("")}
function load(file){const r=new FileReader();r.onload=()=>{photo=r.result;$("uploadCopy").style.display="none";render();toast("Photo loaded");scheduleAutosave()};r.readAsDataURL(file)}
async function analyse(){for(const [p,t] of [[25,"Reading photo"],[55,"Building property DNA"],[80,"Generating futures"],[100,"Ready"]]){await new Promise(r=>setTimeout(r,220));$("progressText").textContent=t;$("progressPct").textContent=p+"%";$("bar").style.width=p+"%"}document.body.classList.add("generated");toast("Futures generated")}
async function boot(){futures=await(await fetch("data/futures.json")).json();["photoInput","photoInput2","v47Upload"].forEach(id=>{if($(id))$(id).onchange=e=>{const f=e.target.files?.[0];if(f)load(f)}});["vdashUpload","vdashUpload2"].forEach(id=>{if($(id))$(id).onchange=e=>{const f=e.target.files?.[0];if(f)load(f)}});if($("vdashGenerate"))$("vdashGenerate").onclick=analyse;if($("vdashCopy"))$("vdashCopy").onclick=async()=>{await navigator.clipboard.writeText(dashboardSummaryText());toast("Dashboard result copied")};if($("freeScrollQuick"))$("freeScrollQuick").onclick=()=>document.getElementById("quickTestMode")?.scrollIntoView({behavior:"smooth",block:"start"});if($("copyResultCard"))$("copyResultCard").onclick=async()=>{freeHasCopied=true;await navigator.clipboard.writeText(resultCardText());renderFreeProgress();toast("Result card copied")};if($("downloadResultCard"))$("downloadResultCard").onclick=downloadResultCardJson;if($("instantCopy"))$("instantCopy").onclick=async()=>{freeHasCopied=true;await navigator.clipboard.writeText(shortFreeResult());renderFreeProgress();toast("Instant result copied")};if($("instantJump"))$("instantJump").onclick=()=>document.getElementById("freeResults")?.scrollIntoView({behavior:"smooth",block:"start"});if($("quickUpload"))$("quickUpload").onchange=e=>{const f=e.target.files?.[0];if(f)load(f)};if($("quickDemo"))$("quickDemo").onclick=()=>{render();toast("Demo ready")};if($("quickCopy"))$("quickCopy").onclick=async()=>{await navigator.clipboard.writeText(typeof shortFreeResult==="function"?shortFreeResult():freeSummaryText());toast("Quick result copied")};if($("freeSlider"))$("freeSlider").oninput=()=>{freeHasCompared=true;renderFreeTestPage()};if($("freeUpload"))$("freeUpload").onchange=e=>{const f=e.target.files?.[0];if(f){load(f);setTimeout(renderFreeProgress,80)}};if($("freeGenerate"))$("freeGenerate").onclick=async()=>{await analyse();document.getElementById("freeResults")?.scrollIntoView({behavior:"smooth",block:"start"})};if($("freeSkipDemo"))$("freeSkipDemo").onclick=()=>{render();renderFreeProgress();document.getElementById("freeResults")?.scrollIntoView({behavior:"smooth",block:"start"});toast("Demo ready")};if($("freeCopySummary"))$("freeCopySummary").onclick=async()=>{freeHasCopied=true;await navigator.clipboard.writeText(freeSummaryText());renderFreeProgress();toast("Summary copied")};if($("shareCopyShort"))$("shareCopyShort").onclick=async()=>{freeHasCopied=true;await navigator.clipboard.writeText(shortFreeResult());renderFreeProgress();toast("Short result copied")};if($("shareCopyFull"))$("shareCopyFull").onclick=async()=>{freeHasCopied=true;await navigator.clipboard.writeText(freeSummaryText());renderFreeProgress();toast("Full summary copied")};document.querySelectorAll("[data-free-rating]").forEach(b=>b.onclick=()=>{freeRating=b.dataset.freeRating;toast("Rating saved: "+freeRating)});if($("freeCopyFeedback"))$("freeCopyFeedback").onclick=async()=>{await navigator.clipboard.writeText(freeSummaryText());toast("Feedback copied")};if($("v49Slider"))$("v49Slider").oninput=renderProductShellV49;if($("v49Upload"))$("v49Upload").onchange=e=>{const f=e.target.files?.[0];if(f)load(f)};if($("v49UploadBtn"))$("v49UploadBtn").onclick=()=>$("v49Upload")?.click();if($("v49DesignerBtn"))$("v49DesignerBtn").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner&&renderInlineDesigner()};if($("v49Generate"))$("v49Generate").onclick=analyse;if($("v49CompareAll"))$("v49CompareAll").onclick=()=>document.getElementById("v49ProductShell")?.scrollIntoView({behavior:"smooth",block:"start"});if($("v49EditDirection"))$("v49EditDirection").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner&&renderInlineDesigner()};if($("v48ScrollDesigner"))$("v48ScrollDesigner").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner&&renderInlineDesigner()};if($("v47StartBtn"))$("v47StartBtn").onclick=()=>$("v47Upload")?.click();$("analyseBtn").onclick=analyse;if($("openCanvas"))$("openCanvas").onclick=()=>{$("canvasDrawer").classList.add("open");renderCanvas()};if($("closeCanvas"))$("closeCanvas").onclick=()=>$("canvasDrawer").classList.remove("open");document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>{activeTool=b.dataset.tool;renderCanvas();toast("Tool: "+b.textContent)});if($("designCanvas")){$("designCanvas").onclick=e=>{if(startMeasure(e))return;addCanvasObject(e)};$("designCanvas").onpointerdown=e=>{if(activeTool==="measure")return;if(startDraw(e))$("designCanvas").setPointerCapture(e.pointerId)};$("designCanvas").onpointermove=moveDraw;$("designCanvas").onpointerup=endDraw;}if($("clearCanvas"))$("clearCanvas").onclick=()=>{snapshotCanvas();canvasObjects=[];canvasShapes=[];selectedObj=null;renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();toast("Canvas cleared")};if($("undoCanvas"))$("undoCanvas").onclick=undoCanvas;if($("redoCanvas"))$("redoCanvas").onclick=redoCanvas;if($("togglePlants")){$("togglePlants").dataset.layerToggle="plants";$("togglePlants").onclick=()=>toggleLayer("plants")}if($("togglePaths")){$("togglePaths").dataset.layerToggle="paths";$("togglePaths").onclick=()=>toggleLayer("paths")}if($("toggleFeatures")){$("toggleFeatures").dataset.layerToggle="features";$("toggleFeatures").onclick=()=>toggleLayer("features")}document.querySelectorAll("[data-flow-step]").forEach(btn=>btn.onclick=()=>setFlowStep(btn.dataset.flowStep));if($("showUploadInput"))$("showUploadInput").onchange=e=>{const f=e.target.files?.[0];if(f)load(f)};if($("jumpDesignerFromShowcase"))$("jumpDesignerFromShowcase").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};if($("scrollDesignerBtn"))$("scrollDesignerBtn").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};if($("openCanvasFromCommand"))$("openCanvasFromCommand").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};document.querySelectorAll("[data-inline-tool]").forEach(b=>b.onclick=()=>{inlineTool=b.dataset.inlineTool;activeTool=inlineTool==="measure"?"measure":inlineTool;renderInlineDesigner();toast("Tool: "+b.textContent)});if($("inlineCanvas")){$("inlineCanvas").onclick=inlineCanvasClick;$("inlineCanvas").onpointerdown=e=>{if(inlineStartDraw(e))$("inlineCanvas").setPointerCapture(e.pointerId)};$("inlineCanvas").onpointermove=inlineMoveDraw;$("inlineCanvas").onpointerup=inlineEndDraw;}if($("inlineUndo"))$("inlineUndo").onclick=inlineUndoAction;if($("inlineRedo"))$("inlineRedo").onclick=inlineRedoAction;if($("inlineClear"))$("inlineClear").onclick=()=>{inlineSnapshot();canvasObjects=[];canvasShapes=[];measurements=[];inlineSelected=null;selectedObj=null;renderInlineDesigner();renderCanvas();renderReport();saveCanvasAuto();scheduleAutosave();toast("Designer cleared")};if($("inlineExportPng"))$("inlineExportPng").onclick=inlineExportPng;if($("inlineVariantA"))$("inlineVariantA").onclick=()=>saveVariant("A");if($("inlineVariantB"))$("inlineVariantB").onclick=()=>saveVariant("B");if($("inlineVariantC"))$("inlineVariantC").onclick=()=>saveVariant("C");document.querySelectorAll("[data-flow-step]").forEach(btn=>btn.onclick=()=>setFlowStep(btn.dataset.flowStep));if($("showUploadInput"))$("showUploadInput").onchange=e=>{const f=e.target.files?.[0];if(f)load(f)};if($("jumpDesignerFromShowcase"))$("jumpDesignerFromShowcase").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};if($("scrollDesignerBtn"))$("scrollDesignerBtn").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};if($("openCanvasFromCommand"))$("openCanvasFromCommand").onclick=()=>{document.querySelector(".inline-designer")?.scrollIntoView({behavior:"smooth",block:"start"});renderInlineDesigner()};if($("snapshotBtn"))$("snapshotBtn").onclick=()=>createRevisionSnapshot();if($("measureBtn"))$("measureBtn").onclick=()=>{activeTool=activeTool==="measure"?"bed":"measure";measureStart=null;renderCanvas();toast(activeTool==="measure"?"Measurement mode":"Measurement off")};if($("scaleBtn"))$("scaleBtn").onclick=openScaleModal;if($("applyScaleBtn"))$("applyScaleBtn").onclick=applyScaleFromLastMeasurement;if($("cancelScaleBtn"))$("cancelScaleBtn").onclick=closeScaleModal;if($("saveProjectBtn"))$("saveProjectBtn").onclick=saveProjectFile;if($("openProjectInput"))$("openProjectInput").onchange=e=>{const f=e.target.files?.[0];if(f)openProjectFile(f)};if($("copyDesignBtn"))$("copyDesignBtn").onclick=copyDesign;if($("pasteDesignBtn"))$("pasteDesignBtn").onclick=pasteDesign;if($("exportPngBtn"))$("exportPngBtn").onclick=exportDesignPng;if($("groupBtn"))$("groupBtn").onclick=groupNearbyObjects;if($("ungroupBtn"))$("ungroupBtn").onclick=ungroupSelectedObjects;if($("snapGridBtn"))$("snapGridBtn").onclick=toggleGrid;if($("lockObjBtn"))$("lockObjBtn").onclick=toggleSelectedLock;if($("duplicateObj"))$("duplicateObj").onclick=duplicateSelectedObject;if($("bringFrontObj"))$("bringFrontObj").onclick=bringSelectedForward;if($("sendBackObj"))$("sendBackObj").onclick=sendSelectedBack;if($("saveCanvas"))$("saveCanvas").onclick=saveCanvasLayout;if($("loadCanvas"))$("loadCanvas").onclick=loadCanvasLayout;if($("exportCanvas"))$("exportCanvas").onclick=exportCanvasLayout;if($("importCanvas"))$("importCanvas").onchange=e=>{const f=e.target.files?.[0];if(f)importCanvasLayout(f)};if($("openCompare"))$("openCompare").onclick=()=>{$("compareDrawer").classList.add("open");renderCompare()};if($("closeCompare"))$("closeCompare").onclick=()=>$("compareDrawer").classList.remove("open");if($("compareSlider"))$("compareSlider").oninput=renderCompare;if($("openReport"))$("openReport").onclick=()=>{$("reportDrawer").classList.add("open");renderReport()};if($("closeReport"))$("closeReport").onclick=()=>$("reportDrawer").classList.remove("open");if($("copyReport"))$("copyReport").onclick=async()=>{await navigator.clipboard.writeText(reportText());toast("Report copied")};if($("printReport"))$("printReport").onclick=()=>window.print();$("resetBtn").onclick=()=>{photo="";$("uploadCopy").style.display="flex";$("bar").style.width="0%";$("progressPct").textContent="0%";$("progressText").textContent="Ready";loadVariantsFromStorage();render()};loadVariantsFromStorage();render()}
boot();
