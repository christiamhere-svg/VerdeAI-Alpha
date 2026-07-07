const qs=s=>document.querySelector(s), qsa=s=>[...document.querySelectorAll(s)];
let photo=localStorage.getItem('verde_photo')||'';
let selectedGoal=localStorage.getItem('verde_goal')||'low';
let postcode=localStorage.getItem('verde_postcode')||'';
let chosen='retreat', feedback='Not answered';
let layers={path:true,seat:true,plant:true,focus:true};

function image(){return photo||demo}
function profile(){return goalProfiles[selectedGoal]||goalProfiles.low}
function matchingFutures(){
  const all=Object.entries(futures);
  const preferred=all.filter(([,f])=>f.goal===selectedGoal);
  const support=all.filter(([,f])=>f.goal!==selectedGoal).slice(0,2);
  return [...preferred,...support].slice(0,3);
}
function show(id){qsa('.screen').forEach(s=>s.classList.add('hidden'));qs('#'+id).classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function setToast(text='Copied'){const t=qs('#toast');t.textContent=text;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1300)}
function savePrefs(){localStorage.setItem('verde_goal',selectedGoal);localStorage.setItem('verde_postcode',postcode)}
function renderGoals(){
  qs('#goalChips').innerHTML=goals.map(g=>`<button class="goalChip ${g.id===selectedGoal?'selected':''}" data-goal="${g.id}">${g.icon} ${g.label}</button>`).join('');
  qsa('.goalChip').forEach(btn=>btn.onclick=()=>{selectedGoal=btn.dataset.goal;savePrefs();render()});
  qs('#postcodeInput').value=postcode;
}
function start(file){
  postcode=qs('#postcodeInput').value.trim();
  savePrefs();
  if(file){
    const r=new FileReader();
    r.onload=e=>{photo=e.target.result;try{localStorage.setItem('verde_photo',photo)}catch(err){};render();scan()};
    r.readAsDataURL(file);
  }else{render();scan()}
}
function scan(){
  show('scan');
  const goalLabel=(goals.find(g=>g.id===selectedGoal)||goals[0]).label;
  const steps=['📷 Photo received',`🎯 Reading for ${goalLabel.toLowerCase()}`,'🌿 Reading edges and open space','☀ Looking for light and shade','💡 Finding the first useful opportunity','✨ Creating three possible futures'];
  let i=0;qs('#scanSteps').innerHTML=steps.map(x=>`<div class="scanStep">${x}</div>`).join('');
  const t=setInterval(()=>{const els=qsa('.scanStep');if(els[i])els[i].classList.add('done');i++;if(i>steps.length){clearInterval(t);setTimeout(()=>show('reveal'),500)}},430)
}
function card(icon,title,text){return `<div class="simpleCard"><b>${icon}</b><strong>${title}</strong><p>${text}</p></div>`}
function renderStory(){
  const p=profile();
  qs('#storyTitle').textContent=`${p.personality}: the story VerdeAI sees`;
  qs('#storyBody').innerHTML=`${p.story}<br><br>${postcode?`Postcode ${postcode} is being used as a placeholder for future local climate and plant guidance.`:'Add a postcode later to unlock more local climate-aware suggestions.'}`;
}
function renderNoticed(){const p=profile();qs('#noticedGrid').innerHTML=p.noticed.map((x,i)=>card(['👀','🪑','🌿'][i]||'💡',['Pattern','Opportunity','Warning'][i]||'Observation',x)).join('')}
function renderDNA(){
  const p=profile();
  qs('#dnaTitle').textContent=`This place reads as ${p.personality.toLowerCase()}.`;
  qs('#personalityBadge').textContent=`✨ Property Personality: ${p.personality}`;
  const cards=[['🏡','Personality',p.personality,'Goal-aware read based on your chosen direction.',88],['🌳','Strongest pattern','Underused edge','The edge can become useful before the whole space changes.',91],['💡','Hidden opportunity','Create one anchor','One useful place will make everything else easier.',89],['⚠','Biggest risk','Random additions','Buying things first may create clutter instead of purpose.',74]];
  qs('#dnaGrid').innerHTML=cards.map(x=>`<div class="dnaCard"><b>${x[0]}</b><strong>${x[1]}</strong><p>${x[2]}</p><small>${x[3]}</small><div class="score"><i style="width:${x[4]}%"></i></div></div>`).join('')
}
function renderMeter(){
  const p=profile();
  qs('#meterGrid').innerHTML=p.meters.map(x=>`<div class="simpleCard"><strong>${x[0]}</strong><p>Now: ${x[1]}% · Potential: ${x[2]}%</p><div class="score"><i style="width:${x[1]}%"></i></div><div class="score potential"><i style="width:${x[2]}%"></i></div><small>${x[3]}</small></div>`).join('')
}
function renderTimeline(){
  const p=profile();
  const rows=[['Now',`The space reads as ${p.personality.toLowerCase()}.`],['This weekend','Test one small, reversible change.'],['One month','Keep what naturally gets used.'],['Six months','Build the anchor area properly.'],['Two years','The whole place grows around a clear purpose.'],['Future','It feels intentional, not random.']];
  qs('#timelineGrid').innerHTML=rows.map(x=>`<div class="simpleCard"><strong>${x[0]}</strong><p>${x[1]}</p></div>`).join('')
}
function overlayHTML(){return Object.entries(layers).filter(x=>x[1]).map(([k])=>`<span class="overlay ${k}"></span>`).join('')}
function futureCard(id,f){return `<article class="futureCard" tabindex="0" onclick="choose('${id}')" onkeydown="if(event.key==='Enter')choose('${id}')"><div class="futureImage" style="background-image:url('${image()}');--tint:${f.tint};--fx:${f.fx}"><span class="overlay path"></span><span class="overlay seat"></span><span class="overlay plant"></span></div><div class="futureBody"><h3>${f.title}</h3><p>${f.short}</p><small>Confidence: ${f.confidence}%</small></div></article>`}
function renderFutures(){
  const list=matchingFutures();
  chosen=list[0][0];
  qs('#futureGrid').innerHTML=list.map(([id,f])=>futureCard(id,f)).join('')
}
function choose(id){chosen=id;renderChosen();show('detail')}
function renderChosen(){
  const f=futures[chosen]||matchingFutures()[0][1];
  qs('#detailPhoto').style.backgroundImage=`url('${image()}')`;
  qs('#detailPhoto').style.setProperty('--tint',f.tint);
  qs('#detailPhoto').style.setProperty('--fx',f.fx);
  qs('#overlayLayer').innerHTML=overlayHTML();
  qs('#futureTitle').textContent=f.title;
  qs('#futureDescription').textContent=f.desc;
  qs('#futureWhy').textContent=f.why;
  qs('#confidenceTitle').textContent=`Confidence: ${f.confidence}%`;
  qs('#confidenceText').textContent=f.confidenceText;
  qs('#futureMeta').innerHTML=`<span>${f.difficulty}</span><span>${f.cost}</span><span>${f.time}</span>`
}
function renderBudget(){
  const f=futures[chosen]||matchingFutures()[0][1];
  qs('#budgetGrid').innerHTML=[['$100 test',f.budgets[0]],['$1,000 upgrade',f.budgets[1]],['$10,000 vision',f.budgets[2]]].map(x=>`<div class="simpleCard"><strong>${x[0]}</strong><p>${x[1]}</p></div>`).join('')
}
function renderExperiment(){
  const f=futures[chosen]||matchingFutures()[0][1];
  qs('#experimentText').innerHTML=`<strong>${f.action}</strong><br><br><span class="muted">This is a test, not a permanent decision. If it feels useful after a week, then build around it.</span>`
}
function renderResult(){
  const f=futures[chosen]||matchingFutures()[0][1];
  const note=qs('#feedbackNote')?qs('#feedbackNote').value.trim():'';
  const p=profile();
  qs('#resultPhoto').style.backgroundImage=`url('${image()}')`;
  qs('#resultTitle').textContent=f.title;
  qs('#resultLines').innerHTML=[
    ['Main goal',(goals.find(g=>g.id===selectedGoal)||goals[0]).label],
    ['Postcode',postcode||'Not supplied yet'],
    ['Property story',p.story],
    ['Property personality',p.personality],
    ['Chosen future',f.title],
    ['Confidence',f.confidence+'% — '+f.confidenceText],
    ['Weekend experiment',f.action],
    ['Tester feedback',feedback+(note?` — ${note}`:'')]
  ].map(x=>`<div class="resultLine"><strong>${x[0]}</strong>${x[1]}</div>`).join('')
}
function render(){
  renderGoals();
  ['hero','scanPhoto','revealPhoto','detailPhoto','resultPhoto'].forEach(id=>qs('#'+id).style.backgroundImage=`url('${image()}')`);
  renderStory();renderNoticed();renderDNA();renderMeter();renderTimeline();renderFutures();renderChosen();renderBudget();renderExperiment();renderResult()
}
qsa('[data-go]').forEach(b=>b.onclick=()=>{const id=b.dataset.go;if(id==='budget')renderBudget();if(id==='experiment')renderExperiment();if(id==='result')renderResult();show(id)});
qsa('.chip').forEach(b=>b.onclick=()=>{const key=b.dataset.layer;layers[key]=!layers[key];b.classList.toggle('on');renderChosen()});
qsa('.feedbackBtn').forEach(b=>b.onclick=()=>{feedback=b.dataset.feedback;qsa('.feedbackBtn').forEach(x=>x.classList.remove('selected'));b.classList.add('selected')});
qs('#photoInput').onchange=e=>start(e.target.files[0]);
qs('#demoBtn').onclick=()=>start();
qs('#postcodeInput').oninput=e=>{postcode=e.target.value.replace(/\D/g,'').slice(0,4);e.target.value=postcode;savePrefs()};
qs('#restartBtn').onclick=()=>{localStorage.removeItem('verde_photo');photo='';feedback='Not answered';render();show('hero')};
qs('#copyBtn').onclick=()=>{const f=futures[chosen]||matchingFutures()[0][1];navigator.clipboard.writeText(`VerdeAI Tester Beta v1.26\nGoal: ${(goals.find(g=>g.id===selectedGoal)||goals[0]).label}\nFuture: ${f.title}\nConfidence: ${f.confidence}%\nWeekend experiment: ${f.action}\nFeedback: ${feedback}`);setToast()}
qs('#testerTextBtn').onclick=()=>{navigator.clipboard.writeText('I am testing a new AI property ideas tool called VerdeAI. It takes one property photo and suggests what the space could become. Honest feedback would help a lot.');setToast()}
render();