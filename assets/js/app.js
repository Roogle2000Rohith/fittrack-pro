'use strict';
// FitTrack: no accounts, cookies, analytics, remote scripts, or backend.
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = (v, fallback=0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const uid = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const E = (name, group, sets, min, max, rest=90, notes='', unit='reps', optional=false) => ({id:slug(name),name,group,sets,min,max,rest,notes,unit,optional});
const defaultPlan = () => [
  {id:'push-a',short:'Push A',name:'Push A — Upper chest & triceps',focus:'Upper chest • triceps',type:'push',color:'green',exercises:[
    E('Incline cable chest press','Chest',3,6,10,150,'Press with control; avoid excessive arching.'),
    E('Neutral-grip chest press machine','Chest',3,8,12,150,'Keep shoulders stable against the pad.'),
    E('High-to-low cable fly','Chest',2,12,15,90,'Smooth arc; do not force shoulder range.'),
    E('Rope triceps pushdown','Triceps',2,10,15,90,'Keep upper arms mostly still.'),
    E('Overhead cable triceps extension','Triceps',2,10,15,90,'Comfortable elbow and shoulder position.')
  ]},
  {id:'pull-a',short:'Pull A',name:'Pull A — Lats, biceps & core',focus:'Lat emphasis • biceps • abs',type:'pull',color:'blue',exercises:[
    E('Close-grip lat pulldown','Back',3,8,12,150,'Pull with elbows; avoid swinging.'),
    E('Chest-supported machine row','Back',3,8,12,150,'Keep chest on pad and control return.'),
    E('Single-arm high-to-low cable lat pull','Back',2,10,15,90,'Perform both sides; log load used per side.'),
    E('EZ-bar biceps curl','Biceps',2,8,12,90,'Controlled lowering and stable torso.'),
    E('Rope hammer curl','Biceps',2,10,15,90,'Neutral grip for brachialis and forearms.'),
    E('Cable crunch','Core',3,10,15,75,'Curl ribs toward pelvis without yanking hips.'),
    E('Pallof press','Core',2,10,12,60,'Each side; resist twisting.')
  ]},
  {id:'legs-a',short:'Legs A',name:'Legs + Shoulders A',focus:'Quads • hamstrings • side/rear delts',type:'legs',color:'purple',exercises:[
    E('Hack squat','Quads',3,8,12,150,'Begin with 2 light working sets as you rebuild consistency; keep depth pain-free.'),
    E('Seated leg curl','Hamstrings',3,10,15,90,'Pause briefly in the contracted position.'),
    E('Hip thrust machine','Glutes',2,8,12,120,'Keep ribs down; finish without arching lower back.'),
    E('Leg-press calf raise','Calves',3,12,20,75,'Controlled full comfortable range.'),
    E('Cable lateral raise','Shoulders',3,12,20,75,'Lead gently with upper arm; do not swing.'),
    E('Reverse pec deck','Shoulders',3,12,20,75,'Rear delt focus; avoid shrugging.'),
    E('Seated shoulder press machine','Shoulders',2,8,12,120,'Optional if shoulders recover well; skip if pressing fatigues you.', 'reps',true)
  ]},
  {id:'push-b',short:'Push B',name:'Push B — Chest & triceps',focus:'Chest press • triceps',type:'push',color:'green',exercises:[
    E('Neutral-grip chest press machine','Chest',3,6,10,150,'Start with your strongest controlled presses.'),
    E('Incline cable chest press','Chest',2,8,12,120,'Adjust bench for a comfortable incline.'),
    E('Pec deck fly','Chest',2,12,15,90,'Controlled stretch and squeeze.'),
    E('Straight-bar triceps pushdown','Triceps',2,10,15,90,'Keep elbows stable.'),
    E('Dumbbell skull crusher','Triceps',2,10,15,90,'Use a comfortable elbow range and light load.')
  ]},
  {id:'pull-b',short:'Pull B',name:'Pull B — Upper back, arms & core',focus:'Upper back • forearms • abs',type:'pull',color:'blue',exercises:[
    E('Chest-supported wide-elbow row','Back',3,8,12,150,'Angle elbows slightly outward for upper-back emphasis.'),
    E('Lat pulldown','Back',3,8,12,150,'Use smooth repetitions without momentum.'),
    E('Straight-arm cable pulldown','Back',2,12,15,90,'Keep arms slightly bent; drive through shoulders.'),
    E('Cable drag curl','Biceps',2,10,15,90,'Move elbows a little behind body; no jerking.'),
    E('Reverse EZ-bar curl','Forearms',2,10,15,90,'Moderate load, wrists neutral.'),
    E('Reverse crunch','Core',3,10,15,75,'Curl pelvis gently; switch to dead bug if back dislikes it.'),
    E('Side plank','Core',2,20,40,60,'Seconds per side; log time in reps column.','sec')
  ]},
  {id:'legs-b',short:'Legs B',name:'Legs + Shoulders B',focus:'Quads • glutes • rear delts • traps',type:'legs',color:'purple',exercises:[
    E('45° leg press','Quads',3,10,15,150,'Keep hips supported; avoid rounding pelvis at bottom.'),
    E('Leg extension','Quads',2,12,15,90,'Controlled repetitions; no bouncing.'),
    E('Seated leg curl','Hamstrings',3,10,15,90,'Do not lift your hips off the seat.'),
    E('Hip thrust machine','Glutes',2,10,15,120,'Finish with glutes rather than lower-back extension.'),
    E('Hip adductor machine','Adductors',2,12,20,75,'Controlled range.'),
    E('Leg-press calf raise','Calves',3,12,20,75,'Avoid bouncing through ankles.'),
    E('Cable lateral raise','Shoulders',3,12,20,75,'Smooth reps with good side-delt tension.'),
    E('Chest-supported rear-delt row','Shoulders',2,10,15,90,'Elbows spread; chest supported.'),
    E('Cable shrugs','Traps',2,10,15,90,'Raise shoulders straight up; avoid rolling.')
  ]}
];
const mobilityItems = [
  ['hip-90','90/90 hip rotations','2 min'],['cat-camel','Gentle cat-camel','2 min'],['ankles','Knee-to-wall ankle mobility','3 min'],
  ['hip-flexor','Hip flexor stretch','3 min'],['t-spine','Thoracic open-book rotations','3 min'],['shoulders','Shoulder wall slides','3 min'],['deadbug','Dead bugs + steady breathing','4 min']
];
const warmups = {
  push:[['cardio','5 min easy cardio'],['shoulder','Arm circles + light band pull-aparts'],['ramp','2–3 increasing warm-up sets for your first chest press']],
  pull:[['cardio','5 min easy cardio'],['scap','Shoulder rotation + light band rows'],['ramp','2–3 increasing warm-up sets for first pulldown/row']],
  legs:[['cardio','5 min easy cycling'],['mobility','Comfortable bodyweight squats, ankles and hips'],['brace','Easy dead bugs / breathing for trunk control'],['ramp','2–3 increasing warm-up sets on first leg machine']]
};
const cooldowns = {
  push:['3–5 min easy walking','Gentle chest and triceps stretches (20–30 s each)'],
  pull:['3–5 min easy walking','Gentle lat and upper-back stretches (20–30 s each)'],
  legs:['3–5 min easy walking','Gentle quads, hips and calves stretches (20–30 s each)']
};
const emptyState = () => ({version:1,plan:defaultPlan(),history:[],draft:null,checklists:{},mobility:{},videoLinks:{},settings:{restTimer:true,autoRest:true},createdAt:new Date().toISOString()});
let state = emptyState();
let ui = {mediaStage:'warmup',mediaType:'push',activeVideo:'',view:'home',selectedPlan:'push-a',guideId:'',guideBack:'library',libraryQuery:'',libraryGroup:'All',trendExercise:'',prepOpen:false,restEnd:0,restInterval:null,toastTimeout:null,installPrompt:null,storageMode:'indexeddb',saveTimer:null};
let db=null;
const pad2 = x => String(x).padStart(2,'0');
function weightUnit(){return state.settings?.weightUnit==='lb'?'lb':'kg';}
function weightDisplay(kg){if(kg===''||kg===null||kg===undefined)return '';const n=Number(kg);return Number.isFinite(n)?+(n*(weightUnit()==='lb'?2.2046226218:1)).toFixed(1):'';}
function weightToKg(value){if(value===''||value===null||value===undefined)return '';const n=Number(value);return Number.isFinite(n)?+(n*(weightUnit()==='lb'?0.45359237:1)).toFixed(3):'';}
function displayVolume(kg){return Math.round(kg*(weightUnit()==='lb'?2.2046226218:1)).toLocaleString();}
function localDate(d=new Date()){return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;}
function fromDateKey(s){const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d);}
function prettyDate(d=new Date()){return d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});}
function datePrettyKey(k){return fromDateKey(k).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
function monday(d=new Date()){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x;}
function dateShift(d,days){const x=new Date(d);x.setDate(x.getDate()+days);return x;}
const calendarMap = {1:'push-a',2:'pull-a',3:'legs-a',4:'push-b',5:'pull-b',6:'legs-b',0:null};
const todayPlan = () => calendarMap[new Date().getDay()];
const getPlan = id => state.plan.find(p=>p.id===id);
const isInWeek = (date,base=monday())=> date>=localDate(base) && date<=localDate(dateShift(base,6));
const working = sets => (sets||[]).filter(s=>s.done && s.type!=='warmup');
const countTarget = p => p.exercises.reduce((n,e)=>n+(e.optional?0:num(e.sets)),0);
function workoutStatus(){const p=todayPlan();return p && state.draft?.planId===p ? 'Resume workout' : 'Start workout';}
function formatTime(total){const secs=Math.max(0,Math.floor(total));return `${Math.floor(secs/60)}:${pad2(secs%60)}`;}
function timeAgo(ts){return new Date(ts).toLocaleDateString(undefined,{month:'short',day:'numeric'});}
function storageGet(){return new Promise((resolve,reject)=>{try{const req=indexedDB.open('fittrack-v1',1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('kv'))req.result.createObjectStore('kv');};req.onsuccess=()=>{db=req.result;const r=db.transaction('kv','readonly').objectStore('kv').get('state');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);};req.onerror=()=>reject(req.error);req.onblocked=()=>reject(new Error('Database blocked'));}catch(e){reject(e);}});}
async function loadState(){try{const saved=await storageGet();if(saved){const val=typeof saved==='string'?JSON.parse(saved):saved;state=validateState(val);}}catch(e){ui.storageMode='localStorage';try{const raw=localStorage.getItem('fittrack-state-v1');if(raw)state=validateState(JSON.parse(raw));}catch{ui.storageMode='memory';}console.warn('IndexedDB unavailable:',e);}}
function validateState(value){if(!value||!Array.isArray(value.plan)||!Array.isArray(value.history)||value.version!==1)throw Error('Invalid or unsupported backup');for(const p of value.plan){if(typeof p.id!=='string'||typeof p.name!=='string'||!Array.isArray(p.exercises))throw Error('Invalid plan data');for(const ex of p.exercises){if(typeof ex.id!=='string'||typeof ex.name!=='string')throw Error('Invalid exercise');}}return {...emptyState(),...value,checklists:value.checklists||{},mobility:value.mobility||{},videoLinks:value.videoLinks||{},mediaOverrides:value.mediaOverrides||{},settings:{...emptyState().settings,...value.settings}};}
async function persistNow(){try{if(ui.storageMode==='indexeddb'&&db){const serialized=JSON.stringify(state);await new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(serialized,'state');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}else if(ui.storageMode==='localStorage'){localStorage.setItem('fittrack-state-v1',JSON.stringify(state));}
const el=$('#saveStatus');if(el)el.textContent=ui.storageMode==='memory'?'⚠ Data not saving':'✓ Saved locally';}catch(e){console.warn('Could not save:',e);ui.storageMode='memory';const el=$('#saveStatus');if(el)el.textContent='⚠ Data not saving';toast('Saving is unavailable. Please export your data.',true);}}
function queueSave(){const el=$('#saveStatus');if(el)el.textContent='● Saving…';clearTimeout(ui.saveTimer);ui.saveTimer=setTimeout(()=>persistNow(),250);}
function immediateSave(){clearTimeout(ui.saveTimer);return persistNow();}
function toast(msg,warning=false){const el=$('#toast');el.textContent=msg;el.style.background=warning?'#ffe4b8':'';el.style.color=warning?'#4b2d08':'';el.classList.add('show');clearTimeout(ui.toastTimeout);ui.toastTimeout=setTimeout(()=>{el.classList.remove('show');el.style.background='';el.style.color='';},3000);}
function go(view){ui.view=view;history.replaceState(null,'',`#${view}`);render();window.scrollTo({top:0,behavior:'instant'});}
function todayCompleted(){const id=todayPlan();return id?state.history.some(h=>h.date===localDate()&&h.planId===id):false;}
function getLastSets(exerciseId){for(let i=state.history.length-1;i>=0;i--){const h=state.history[i];const sets=(h.sets||[]).filter(s=>s.exerciseId===exerciseId && s.type!=='warmup');if(sets.length)return sets;}return [];}
function getBestWeight(exId){const a=getLastSets(exId);return a.length?num(a[0].weight):0;}
function totalDone(draft=state.draft){if(!draft)return 0;return draft.exercises.reduce((n,ex)=>n+working(ex.sets).length,0);}
function totalPlanned(draft=state.draft){return draft?draft.exercises.reduce((n,ex)=>n+(ex.optional?0:ex.sets.filter(s=>s.type==='working').length),0):0;}
function workoutDoneDays(){const key=new Set(state.history.map(h=>h.date));return key;}
function stats(){const total=state.history.length;const week=state.history.filter(h=>isInWeek(h.date)).length;const allSets=state.history.reduce((n,h)=>n+(h.sets||[]).filter(s=>s.type!=='warmup').length,0);const volume=Math.round(state.history.reduce((sum,h)=>sum+(h.sets||[]).reduce((acc,s)=>acc+(s.type!=='warmup'?num(s.weight)*num(s.reps):0),0),0));return {total,week,allSets,volume};}
// Exercise guides are local schematic motion references with written coaching cues.
const GUIDES = window.FITTRACK_GUIDES || {};
function mediaMatchTier(id){return MEDIA_MATCH_TIER[id]||'exact';}
function visibleRelated(id){return !!state.mediaOverrides?.[id];}
function safeExerciseVideo(value){
 try{const u=new URL(String(value||''));if(u.protocol!=='https:'||u.username||u.password||u.href.length>1500)return '';
 const h=u.hostname.toLowerCase().replace(/^www\./,'');
 if((h==='vimeo.com'||h==='player.vimeo.com')&&/^(?:\/video)?\/962614569(?:\/|$)/.test(u.pathname))return '';
 return u.href;
 }catch{return '';}
}
const VIDEO_EXACT_FIXES={};
function chosenVideo(id){return null;}
function licensedMedia(ex){return REPDB_VISUALS[String(ex?.id||ex?.exerciseId||'')]||null;}
function mediaImg(path){return REPDB_SOURCE+path;}
function exerciseMediaGallery(ex){
 const id=String(ex?.id||ex?.exerciseId||'');const m=licensedMedia(ex);if(!m)return '<div class="guide-blank">No approved illustration for this exercise. Use the written cues and choose an exact exercise video.</div>';
 const tier=mediaMatchTier(id);const isRelated=tier!=='exact',revealed=visibleRelated(id),hidden=!!state.mediaOverrides?.['hidden:'+id];
 const note=m.d||'Actual machine setup and attachments can vary.';
 if(hidden||isRelated&&!revealed)return `<section class="match-warning"><span class="match-badge">⚠ EXERCISE MATCH REVIEW</span><h3>No exact illustration for this variation</h3><p>Your exercise is <strong>${esc(ex.name)}</strong>. The available source image is <strong>${esc(m.n)}</strong>. ${esc(note)}</p><p>We will not display that related image as if it were exact.</p><button class="btn secondary small" data-action="show-reference-media" data-guide="${esc(id)}">Show related illustration</button><a href="${esc(exerciseVideoSearch(ex))}" class="btn ghost small" target="_blank" rel="noopener noreferrer">Find exact video ↗</a></section>`;
 const frames=m.s===m.p?[['MOVEMENT POSITION',m.s]]:[['01 · START',m.s],['02 · FINISH',m.p]];
 return `<section class="media-reference"><span class="match-badge ${isRelated?'':'match-exact'}">${isRelated?'⚠ RELATED MOVEMENT · NOT EXACT':'✓ MATCHED MOVEMENT PATTERN'}</span>${isRelated?`<p class="match-warning-note">This image demonstrates ${esc(m.n)} instead of ${esc(ex.name)}. ${esc(note)}</p>`:''}<div class="pose-grid repdb-gallery">${frames.map(([label,path])=>`<figure><div class="repdb-image-wrap"><div class="repdb-image-fallback">Picture needs internet</div><img src="${esc(mediaImg(path))}" alt="${esc(m.n+' — '+label)}" loading="lazy" onerror="this.style.display='none'"/></div><figcaption>${label}</figcaption></figure>`).join('')}</div><p class="repdb-attribution">Exercise images by <a target="_blank" rel="noopener noreferrer" href="https://repdb.co/">RepDB</a>, used inside FitTrack with attribution.</p><button class="btn ghost small" data-action="hide-reference-media" data-guide="${esc(id)}">Wrong image? Hide it</button></section>`;
}
function exerciseMediaThumb(ex){
 const id=String(ex?.id||ex?.exerciseId||''),m=licensedMedia(ex);
 if(!m)return '<span class="exercise-thumb empty-thumb" title="No approved illustration">?</span>';
 if(state.mediaOverrides?.['hidden:'+id])return '<span class="exercise-thumb empty-thumb" title="Illustration hidden by you">?</span>';
 const variant=mediaMatchTier(id)!=='exact';
 return `<span class="exercise-thumb repdb-thumb ${variant?'reference-variant':'reference-exact'}" title="${esc(variant?'Similar reference: '+m.n+' — not an exact match':'Exercise form reference: '+m.n)}"><span>Image needs internet</span><img src="${esc(mediaImg(m.s))}" loading="lazy" decoding="async" alt="${esc(variant?'Related movement: '+m.n:m.n)}" onerror="this.style.display='none'"/><span class="image-match-label ${variant?'variant':'exact'}">${variant?'SIMILAR':'GUIDE'}</span></span>`;
}

const VERIFIED_EXERCISE_VIDEOS={};
const REFERENCE_VIDEOS = {
  'incline-cable-chest-press': {title:'Related incline press movement',url:'https://commons.wikimedia.org/wiki/File:Incline_press_-_exercise_demonstration_video.webm',author:'FitnessScape',license:'CC BY 3.0',note:'This demonstration may use different equipment from your incline cable press.'},
  'ez-bar-biceps-curl': {title:'EZ-bar curl technique video',url:'https://commons.wikimedia.org/wiki/File:Video_of_EZ_Bar_Curl_and_Straight_Bar_Curl.webm',author:'Colossus Fitness',license:'CC BY 3.0',note:'Video compares EZ-bar and straight-bar curls.'},
  'seated-shoulder-press-machine': {title:'Related shoulder press movement',url:'https://commons.wikimedia.org/wiki/File:Shoulder_press_-_exercise_demonstration_video.webm',author:'FitnessScape',license:'CC BY 3.0',note:'This is a general shoulder press demonstration, not your exact machine.'},
  '45-leg-press': {title:'Leg press technique video',url:'https://commons.wikimedia.org/wiki/File:How_to_properly_leg_press.webm',author:'Colossus Fitness',license:'CC BY 3.0 (license review pending on Commons)',note:'Long-form leg press tutorial; use the correct setup for your machine.'}
};
function verifiedVideoCard(ref,id){
 if(!ref)return '';
 const isRelated=ref.match==='related';
 const label=isRelated?'RELATED VARIATION — CHECK EQUIPMENT':'SOURCE-REVIEWED EXERCISE';
 const note=ref.note||'Use your machine instructions and the technique cues below.';
 const playing=ui.activeVideo==='reviewed-'+id;
 let content='';
 if(ref.kind==='commons'&&ref.video){
   content='<video class="verified-demo-video" controls playsinline preload="none" src="'+esc(ref.video)+'" aria-label="'+esc(ref.title)+'"></video><p class="video-help">Tap the video play control. If it fails to load, use the source link below.</p>';
 }else if(ref.kind==='youtube'){
   const url=embedUrl(ref.url);
   content=playing&&url?'<div class="video-embed"><iframe title="'+esc(ref.title)+'" src="'+esc(url)+'" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>':'<button class="video-load-control" data-action="play-reviewed-video" data-id="'+esc(id)+'"><span class="video-load-play">▶</span><strong>Play demo in FitTrack</strong><span>Opens the publisher-hosted player</span></button>';
 }else{
   content='<div class="video-guide-source"><span class="video-load-play">▶</span><strong>Video demonstration on the source website</strong><p>Tap “Watch exercise video” below to view the provider-hosted video and form instructions.</p></div>';
 }
 return '<section class="featured-exercise-video" id="featuredExerciseVideo"><div class="verified-video-head"><span class="verified-video-chip '+(isRelated?'is-related':'')+'">'+esc(label)+'</span><h3>'+esc(ref.title)+'</h3><p>'+esc(note)+'</p></div>'+content+
 '<div class="featured-video-actions"><a class="btn" href="'+esc(ref.url)+'" target="_blank" rel="noopener noreferrer">▶ Watch exercise video ↗</a>'+
 (ref.kind==='youtube'&&playing?'<button class="btn secondary" data-action="play-reviewed-video" data-id="'+esc(id)+'">Close player</button>':'')+
 '</div><p class="video-source-credit">Source: '+esc(ref.provider)+' · '+(ref.license?esc(ref.license)+' · ':'')+'Externally hosted. Availability can change.</p></section>';
}
function videoGuide(id){
 const ex=allExercises().find(e=>e.id===id)||state.draft?.exercises.find(e=>e.exerciseId===id);if(!ex)return '';
 const custom=safeExerciseVideo((state.videoLinks||{})[id]);
 const curated=VERIFIED_PUBLIC_VIDEO_LINKS[id];
 const curatedHtml=curated?verifiedVideoCard(curated,id):'<div class="video-unreviewed-notice"><strong>Direct exercise video not reviewed yet.</strong><p>We are not attaching a random or mismatched video. Use the exact-exercise searches below or save your preferred source.</p></div>';
 const personal=custom?videoPreviewCard({title:'Your saved exercise video',detail:'Personal video link. Check that it matches your exact exercise.'},id,{query:ex.name+' exercise demo'}):'';
 return '<section class="panel guide-video video-coach-guide"><div class="guide-section-title"><span class="guide-marker">▶</span><h3>Exercise video demonstrations</h3></div>'+
 curatedHtml+personal+sourceVideoLinks(ex.name+' '+ex.group+' exercise proper form')+
 '<label for="customVideoUrl" class="video-label">My preferred video (YouTube, Wikimedia, Vimeo or other HTTPS publisher)</label>'+
 '<div class="video-input-row"><input id="customVideoUrl" type="url" value="'+esc(custom)+'" placeholder="Paste a video URL" aria-label="Your technique video" /><button class="btn secondary small" data-action="save-video-link">Save</button>'+(custom?'<button class="btn ghost small" data-action="clear-video-link">Remove</button>':'')+'</div>'+
 '<p class="video-source">Source-hosted videos need internet. If a source disappears, choose another demonstration.</p></section>';
}

function sourceVideoSearches(query){
 const q=String(query||'fitness exercise technique').trim();
 return [
  {name:'YouTube · coaching sources',url:'https://www.youtube.com/results?search_query='+encodeURIComponent(q+' Jeff Nippard E3 Rehab Renaissance Periodization')},
  {name:'Wikimedia Commons · licensed videos',url:'https://commons.wikimedia.org/w/index.php?search='+encodeURIComponent(q)+'&title=Special:MediaSearch&type=video'},
  {name:'Vimeo search',url:'https://vimeo.com/search?q='+encodeURIComponent(q)}
 ];
}
function sourceVideoLinks(query){return '<div class="video-search-choices">'+sourceVideoSearches(query).map(x=>'<a target="_blank" rel="noopener noreferrer" href="'+esc(x.url)+'">'+esc(x.name)+' ↗</a>').join('')+'</div>';}
function videoSearchUrl(query){return 'https://www.youtube.com/results?search_query='+encodeURIComponent(query+' exercise proper form tutorial');}
function exerciseVideoSearch(ex){return videoSearchUrl((ex?.name||'gym exercise')+' '+(ex?.group||''));}
function embedUrl(url){const safe=safeExerciseVideo(url);if(!safe)return '';try{const u=new URL(safe),h=u.hostname.toLowerCase().replace(/^www\./,'');const t=String(u.searchParams.get('start')||u.searchParams.get('t')||'');const m=t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i);const seconds=m?Number(m[1]||0)*3600+Number(m[2]||0)*60+Number(m[3]||0):0;if(['youtube.com','m.youtube.com','youtube-nocookie.com','youtu.be'].includes(h)){let id=h==='youtu.be'?u.pathname.split('/')[1]:u.searchParams.get('v');if(!id&&/^\/(shorts|embed|live)\//.test(u.pathname))id=u.pathname.split('/')[2];return /^[\w-]{11}$/.test(id||'')?'https://www.youtube-nocookie.com/embed/'+id+'?rel=0&playsinline=1'+(seconds?'&start='+seconds:''):'';}if(h==='vimeo.com'||h==='player.vimeo.com'){const m=u.pathname.match(/(?:\/video)?\/(\d+)(?:\/|$)/);return m?'https://player.vimeo.com/video/'+m[1]:'';}}catch{}return '';}
function videoPreviewCard(item,key,opts={}){
 const userVideo=safeExerciseVideo((state.videoLinks||{})[key]||'');
 const selected=userVideo||safeExerciseVideo(item?.url||'');
 const title=item?.title||'Find exercise video';
 const query=opts.query||item?.query||title+' exercise correct technique';
 const embed=embedUrl(selected),playing=ui.activeVideo===key;
 let youtubePoster='';
 try{if(selected){const u=new URL(selected),h=u.hostname.toLowerCase().replace(/^www\./,'');const id=h==='youtu.be'?u.pathname.split('/')[1]:u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];if(/^[\w-]{11}$/.test(id||''))youtubePoster='https://i.ytimg.com/vi/'+id+'/hqdefault.jpg';}}catch{}
 let media='';
 if(!selected)media=`<div class="video-source-empty"><span class="video-source-mark">⌕</span><strong>Find a trusted demonstration</strong><p>Choose a video showing this exact movement. Results are not automatically certified or guaranteed to work.</p></div>`;
 else if(playing&&embed){
   media=/\.(?:mp4|webm)$/i.test(embed)?`<video class="video-direct-player" src="${esc(embed)}" controls playsinline preload="none"></video>`:`<div class="video-embed"><iframe title="${esc(title)}" src="${esc(embed)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
 }else media=`<a class="video-placeholder clickable-video" href="${esc(selected)}" target="_blank" rel="noopener noreferrer" aria-label="Watch video at its original publisher">${youtubePoster?`<img class="video-poster" alt="" src="${esc(youtubePoster)}" loading="lazy" onerror="this.style.display='none'"/>`:''}<span class="video-hero-play">▶</span><span class="video-bottom-note">Open on the publisher's website ↗</span></a>`;
 return `<section class="video-feature-card" data-video-key="${esc(key)}">
 <div class="video-feature-top"><div><span class="mini-label">${selected?(userVideo?'YOUR SAVED REFERENCE':'COACH VIDEO · '+esc(item?.provider||'Video source')):'CHOOSE A SOURCE · NO UNREVIEWED DIRECT VIDEOS'}</span><h3>${esc(title)}</h3>${item?.detail?`<p>${esc(item.detail)}</p>`:''}</div></div>
 ${media}
 <div class="video-actions">
 ${selected?`<a class="btn watch-demo" href="${esc(selected)}" target="_blank" rel="noopener noreferrer">↗ Watch original</a>`:''}
 ${selected&&embed?`<button class="btn secondary" data-action="play-media" data-key="${esc(key)}">${playing?'■ Close player':'▶ Play in FitTrack'}</button>`:''}
 ${userVideo?`<button class="btn ghost" data-action="report-video" data-key="${esc(key)}">✕ Broken link</button>`:''}
 </div>
 ${sourceVideoLinks(query)}
 <p class="video-source video-source-disclaimer">Prefer a qualified coach or clinician, and match the machine, attachment and movement. Publisher links may become unavailable.</p>
 </section>`;
}

function mediaClipLink(key,stage,type){ui.mediaStage=stage;ui.mediaType=type;ui.activeVideo=key;go('media');}
function videoPack(type,stage){return FEATURED_MEDIA[stage]?.[type]||[];}
function personalVideoCard(key,current,searchUrl){const url=(state.videoLinks||{})[key]||'';
 return `<div class="panel personal-video"><div class="guide-section-title"><span class="guide-marker">＋</span><h3>Your preferred video</h3></div><p class="muted small">Paste an HTTPS link from a trusted publisher. FitTrack opens the original source, and offers a player only when supported.</p><div class="video-input-row"><input type="url" id="personal-video-input" aria-label="Personal technique video" placeholder="https://www.youtube.com/watch?v=…" value="${esc(url)}"/><button class="btn secondary small" data-action="save-media-custom" data-key="${esc(key)}">Save link</button>${url?`<button class="btn ghost small" data-action="clear-media-custom" data-key="${esc(key)}">Remove</button>`:''}</div>${url?videoPreviewCard({title:'Your saved reference video',provider:'Personal link'},key,{search:searchUrl}):''}</div>`;
}
function mediaNavigation(){return `<div class="media-tabs" role="group" aria-label="Training phase">${[['warmup','01 · Warm-up'],['exercise','02 · Exercise guides'],['cooldown','03 · Cool-down'],['mobility','04 · Mobility']].map(([id,label])=>`<button class="media-tab ${ui.mediaStage===id?'selected':''}" data-action="media-stage" data-stage="${id}">${label}</button>`).join('')}</div>`;}
function renderMedia(){
 const stage=ui.mediaStage||'warmup';const p=getPlan(ui.selectedPlan)||state.plan[0];const type=ui.mediaType||p?.type||'push';let content='';
 if(stage==='warmup'||stage==='cooldown'){
   const items=videoPack(type,stage);
   const checklist=stage==='warmup'?warmups[type]:cooldowns[type].map((x,i)=>[String(i),x]);
   const checklistKey=`${localDate()}|${stage}|${type}`;const checked=state.checklists[checklistKey]||[];
   content=`<div class="phase-hero"><span class="mini-label">${stage==='warmup'?'01 · BEFORE YOUR SETS':'03 · AFTER YOUR SESSION'}</span><h2>${stage==='warmup'?'Prepare to lift':'Recover & move comfortably'}</h2><p>${stage==='warmup'?'Start with 5 minutes easy cardio and brief dynamic mobility. Finish with gradually heavier warm-up sets of your first exercise.':'Cool down with a few minutes easy movement, then gentle optional stretching. Stretching does not guarantee soreness prevention.'}</p></div><div class="media-type-tabs">${[['push','Push'],['pull','Pull'],['legs','Legs + Shoulders']].map(([id,label])=>`<button class="filter-chip ${id===type?'active':''}" data-action="media-type" data-type="${id}">${label}</button>`).join('')}</div><div class="video-feature-grid">${items.map((v,i)=>videoPreviewCard(v,stage+'-'+type+'-'+i)).join('')}</div><div class="panel media-checklist"><h3>${stage==='warmup'?'Your warm-up checklist':'Your cooldown checklist'}</h3>${checklist.map(([id,label])=>`<label class="checkbox-row ${checked.includes(id)?'checked':''}"><input type="checkbox" data-action="check-phase" data-key="${esc(checklistKey)}" data-id="${esc(id)}" ${checked.includes(id)?'checked':''}/><span>${esc(label)}</span></label>`).join('')}</div>${personalVideoCard('custom-'+stage+'-'+type,'',videoSearchUrl(type+' gym '+stage))}`;
 }else if(stage==='exercise'){
  content=`<div class="phase-hero"><span class="mini-label">02 · MOVEMENT LIBRARY</span><h2>See it. Learn it. Log it.</h2><p>Every programmed exercise has licensed start/finish illustrations, form cues and links to real movement demonstrations. Illustrations need internet. Save your preferred video inside each guide.</p></div><div class="video-library-grid">${allExercises().map(ex=>{const g=guideFor(ex);return `<button class="video-library-item" data-action="open-guide" data-guide="${esc(ex.id)}"><div class="video-library-art">${exerciseMediaThumb(ex)}<span>▶</span></div><span><strong>${esc(ex.name)}</strong><small>${esc(g?.primary||ex.group)} · View demo + track sets</small></span><b>›</b></button>`;}).join('')}</div>`;
 }else{
   const vids=FEATURED_MEDIA.mobility;
   content=`<div class="phase-hero"><span class="mini-label">04 · SUNDAY / RECOVERY</span><h2>20-minute mobility reset</h2><p>Follow the videos when useful, then complete your existing weekly mobility checklist. Gentle control matters more than forcing a deep stretch.</p></div><div class="video-feature-grid">${vids.map((v,i)=>videoPreviewCard(v,'mobility-'+i)).join('')}</div>${renderMobility()}${personalVideoCard('custom-mobility','',videoSearchUrl('20 minute full body mobility routine'))}`;
 }
 return `${head('FITTRACK VIDEO COACH','Watch. Move. Track.','A video-first guide integrated with your PPL routine and logs.')}${mediaNavigation()}${content}<p class="footline">Official videos stream from their publishers and require internet. They may be unavailable if the publisher disables embedding. Your written cues, history and timers work offline; remote exercise illustrations need internet. No video copies are distributed with FitTrack.</p>`;
}

const guideFor = ex => GUIDES[String(ex?.id||ex?.exerciseId||'')] || GUIDES[slug(ex?.name||'')] || null;
function allExercises(){const unique = new Map();for (const p of state.plan){for (const ex of p.exercises){if(!unique.has(ex.id))unique.set(ex.id,ex);}}return Array.from(unique.values());}
// Training illustration: schematic anatomy, not individual muscle EMG data.
function anatomyDiagram(view,primary,secondary){
 const shape=REGION_SHAPES[view];
 const base='<g fill="#403a58" stroke="#6e6587" stroke-width="1.2"><circle cx="90" cy="26" r="14"/><path d="M84 38 L96 38 L99 52 L81 52 Z"/><path d="M64 51 Q90 44 116 51 L119 107 L111 143 L107 156 L73 156 L69 143 L61 107 Z"/><path d="M61 55 Q48 51 45 69 L34 126 L29 151 L40 156 L47 129 L64 80 Z"/><path d="M119 55 Q132 51 135 69 L146 126 L151 151 L140 156 L133 129 L116 80 Z"/><path d="M73 150 Q66 159 59 189 L60 231 L82 236 L90 171 Z"/><path d="M107 150 Q114 159 121 189 L120 231 L98 236 L90 171 Z"/><path d="M61 229 L83 234 L75 279 L77 289 L60 289 L58 280 Z"/><path d="M119 229 L97 234 L105 279 L103 289 L120 289 L122 280 Z"/></g>';
 const order=Object.keys(shape).filter(k=>secondary.includes(k)||primary.includes(k));
 const regions=order.map(k=>shape[k].map(d=>'<path d="'+d+'" fill="'+(primary.includes(k)?'#aa83ff':'#eead66')+'" fill-opacity="'+(primary.includes(k)?'.96':'.8')+'" stroke="#151327" stroke-width="1.25"><title>'+esc(ANATOMY_REGION_NAMES[k]||k)+'</title></path>').join('')).join('');
 return '<svg class="anatomy-figure" viewBox="20 8 140 293" role="img" aria-label="'+(view==='front'?'Front':'Back')+' body muscle areas" xmlns="http://www.w3.org/2000/svg">'+base+regions+'</svg>';
}
function anatomyCard(ex){
 const id=String(ex?.id||ex?.exerciseId||'');const guide=guideFor(ex);
 const raw=EXERCISE_ANATOMY[id]||[[],[]],main=raw[0]||[],support=raw[1]||[];
 const primary=guide?.primary||ex.group||'Muscle group',secondary=guide?.secondary&&guide.secondary!=='—'?guide.secondary:'None specifically highlighted';
 return '<section class="panel anatomy-card"><div class="anatomy-head"><div><span class="mini-label">MOVEMENT ANATOMY</span><h2>Muscles worked</h2><p>What the movement mainly trains, and what assists.</p></div><span class="anatomy-info-badge">FRONT + BACK</span></div><div class="anatomy-layout"><div class="anatomy-body-pair"><figure><div class="anatomy-silhouette">'+anatomyDiagram('front',main,support)+'</div><figcaption>FRONT</figcaption></figure><figure><div class="anatomy-silhouette">'+anatomyDiagram('back',main,support)+'</div><figcaption>BACK</figcaption></figure></div><div class="anatomy-data"><div class="anatomy-target"><span class="muscle-dot primary"></span><div><span class="anatomy-label">PRIMARY TARGET</span><strong>'+esc(primary)+'</strong></div></div><div class="anatomy-target"><span class="muscle-dot supporting"></span><div><span class="anatomy-label">SUPPORTING / STABILIZING</span><strong>'+esc(secondary)+'</strong></div></div><p class="anatomy-disclaimer">Highlighted areas are approximate training regions, not measurements of muscle activation. Grip, equipment, and technique may shift emphasis.</p></div></div></section>';
}
function demoDestination(ex){
 const id=String(ex?.id||ex?.exerciseId||'');
 const custom=safeExerciseVideo((state.videoLinks||{})[id]);
 const reviewed=VERIFIED_PUBLIC_VIDEO_LINKS[id];
 return custom?{url:custom,label:'My video',curated:true}:reviewed?{url:reviewed.url,label:reviewed.match==='related'?'Related demo':'Watch demo',curated:true}:{url:exerciseVideoSearch(ex),label:'Find demo',curated:false};
}
function exerciseQuickActions(ex,compact=false){
 const id=String(ex?.id||ex?.exerciseId||''),dest=demoDestination(ex);
 return `<div class="exercise-quick-actions ${compact?'compact':''}">
 <a class="btn small watch-demo" href="${esc(dest.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(dest.label+' for '+ex.name)}">▶ ${esc(dest.label)} ↗</a>
 <button class="btn secondary small show-form" data-action="open-guide" data-guide="${esc(id)}" aria-label="${esc('Show technique for '+ex.name)}">☑ Form & tips</button></div>`;
}
function guideThumb(ex){return exerciseMediaThumb(ex);}
function splitCues(value){return String(value||'').split(/;\s*/).map(v=>v.trim()).filter(Boolean);}
function guideLink(ex,label='Technique guide',kind='secondary'){return `<button class="btn ${kind} small guide-button" data-action="open-guide" data-guide="${esc(ex.id||ex.exerciseId||slug(ex.name))}">${esc(label)} ↗</button>`;}
function guideReturn(){const back=ui.guideBack||'library';go(back==='guide'?'library':back);if(back==='session'&&state.draft){const i=state.draft.exercises.findIndex(x=>x.exerciseId===ui.guideId);if(i>=0)setTimeout(()=>document.getElementById(`exercise-${i}`)?.scrollIntoView({block:'start',behavior:'smooth'}),50);}}
function goGuide(id,back=ui.view){ui.guideId=String(id);ui.guideBack=back==='guide'?'library':back;ui.view='guide';history.replaceState(null,'',`#guide/${encodeURIComponent(ui.guideId)}`);render();window.scrollTo({top:0,behavior:'instant'});}
const LIBRARY_TABS=['All','Chest','Back','Legs','Shoulders','Arms','Core'];
function exerciseCategoryMatch(ex,category){
 if(category==='All')return true;
 const g=String(ex.group||'');
 return ({
 Chest:['Chest'],
 Back:['Back','Traps'],
 Legs:['Quads','Hamstrings','Glutes','Calves','Adductors'],
 Shoulders:['Shoulders','Traps'],
 Arms:['Biceps','Triceps','Forearms'],
 Core:['Core']
 })[category]?.includes(g)||false;
}
function libraryResults(){
 const filter=LIBRARY_TABS.includes(ui.libraryGroup)?ui.libraryGroup:'All';
 const text=ui.libraryQuery.trim().toLowerCase();
 return allExercises().filter(ex=>{
  const g=guideFor(ex);
  const terms=[ex.name,ex.group,g?.primary,g?.secondary].filter(Boolean).join(' ').toLowerCase();
  return exerciseCategoryMatch(ex,filter)&&terms.includes(text);
 });
}
function libraryRow(ex){
 const g=guideFor(ex);
 return `<button class="library-exercise modern-library-item" data-action="open-guide" data-guide="${esc(ex.id)}" aria-label="${esc('View '+ex.name+' form and muscle anatomy')}">
  <span class="library-thumb">${guideThumb(ex)}</span><span class="library-exercise-copy"><strong>${esc(ex.name)}</strong>
  <small>${esc(g?.primary||ex.group)}${g?.secondary&&g.secondary!=='—'?' · '+esc(g.secondary):''}</small>
  <span class="library-card-meta">View anatomy · Technique · Video sources</span></span><span class="library-chevron">›</span>
 </button>`;
}
function renderLibraryList(){
 const el=$('#guideLibraryResults');if(!el)return;
 const results=libraryResults();
 el.innerHTML=results.length?results.map(libraryRow).join(''):`<div class="empty library-empty"><strong>No matching exercises</strong><p>Try All muscles, another muscle group, or clear the search field.</p></div>`;
 const count=$('#guideResultsCount');if(count)count.textContent=results.length+' exercise'+(results.length===1?'':'s')+' · '+(ui.libraryGroup||'All');
}
function renderLibrary(){
 const list=libraryResults();
 return `${head('EXERCISE LIBRARY','Find your movement.','Explore muscle anatomy, correct technique and reference videos for every programmed exercise.')}
 <div class="library-hero"><div><span class="mini-label">34 EXERCISES · SIX-DAY PPL</span><h2>Train with intention.</h2><p>Choose a muscle group, find an exercise, and see exactly what it trains.</p></div><span class="library-hero-icon">◉</span></div>
 <label class="library-search modern-search"><span aria-hidden="true">⌕</span><input id="librarySearch" autocomplete="off" aria-label="Search exercise library" placeholder="Search by exercise or muscle…" value="${esc(ui.libraryQuery)}" /></label>
 <div class="library-filters modern-tabs" role="group" aria-label="Filter exercises by muscle group">
 ${LIBRARY_TABS.map(t=>`<button type="button" class="filter-chip ${ui.libraryGroup===t?'active':''}" data-action="guide-filter" data-group="${esc(t)}" aria-pressed="${ui.libraryGroup===t}">
 ${esc(t)}<span class="tab-count">${allExercises().filter(ex=>exerciseCategoryMatch(ex,t)).length}</span></button>`).join('')}</div>
 <div class="library-summary"><span id="guideResultsCount">${list.length} exercises · ${esc(ui.libraryGroup||'All')}</span><span>Choose one to view anatomy</span></div>
 <div id="guideLibraryResults" class="library-results modern-library-grid">${list.length?list.map(libraryRow).join(''):'<div class="empty">No matching exercises</div>'}</div>`;
}
function renderGuide(){const id=ui.guideId;const ex=allExercises().find(e=>e.id===id) || state.draft?.exercises.find(e=>e.exerciseId===id);if(!ex)return `${head('EXERCISE GUIDES','Guide not found','This movement might have been removed from your routine.')}<button class="btn" data-action="return-guide">← Back</button>`;const g=guideFor(ex);const sets=getLastSets(ex.id||ex.exerciseId);const activeIndex=state.draft?.exercises.findIndex(e=>e.exerciseId===(ex.id||ex.exerciseId))??-1;const focus=g?.primary||ex.group;
const b=`<button class="back-link" data-action="return-guide">← ${ui.guideBack==='session'?'Back to workout':ui.guideBack==='plan'?'Back to plan':'Exercise library'}</button>`;
const picture=exerciseMediaGallery(ex);
const steps=g?splitCues(g.cues):splitCues(ex.notes);const mistakes=g?splitCues(g.mistakes):[];
const previous=sets.length?sets.slice(0,3).map(s=>`${weightDisplay(s.weight)} ${weightUnit()} × ${num(s.reps)} ${ex.unit==='sec'?'sec':'reps'}`).join(' · '):'No completed sets yet';
return `<div class="guide-page">${b}<div class="guide-heading"><div class="eyebrow">EXERCISE TECHNIQUE · YOUR PPL PLAN</div><h1>${esc(ex.name)}</h1><p>${esc(focus)}${g&&g.secondary&&g.secondary!=='—'?' · Supporting: '+esc(g.secondary):''}</p></div>${anatomyCard(ex)}${videoGuide(id)}${picture}${g?`<div class="guide-warning-inline">ⓘ Images show exercise patterns, not always your exact machine or cable attachment. Follow the technique notes, and stop if a movement causes pain.</div>`:''}<div class="guide-detail-layout"><div class="guide-main"><div class="panel guide-panel"><div class="guide-section-title"><span class="guide-marker">01</span><h3>Set up correctly</h3></div><p>${esc(g?.setup||ex.notes||'Choose a load you can move comfortably with good control.')}</p></div><div class="panel guide-panel"><div class="guide-section-title"><span class="guide-marker">02</span><h3>Key technique points</h3></div><ul class="coaching-list">${(steps.length?steps:['Use controlled repetitions','Move through a comfortable range','Avoid using momentum']).map(item=>`<li><span class="good-mark">✓</span><span>${esc(item)}</span></li>`).join('')}</ul></div><div class="panel guide-panel mistake-panel"><div class="guide-section-title"><span class="guide-marker error">03</span><h3>Common mistakes to avoid</h3></div>${mistakes.length?`<ul class="coaching-list">${mistakes.map(x=>`<li><span class="bad-mark">×</span><span>${esc(x)}</span></li>`).join('')}</ul>`:'<p>Focus on stable posture and avoid momentum or painful ranges.</p>'}</div>${['hack-squat','45-leg-press','hip-thrust-machine'].includes(id)?`<div class="alert warning guide-alert"><strong>Lower-back consideration:</strong> Start light, keep your trunk supported and stable, and stay within a comfortable range. If symptoms return, stop the movement and seek qualified guidance.</div>`:''}</div><div class="guide-aside"><div class="panel coach-panel"><div class="mini-label">YOUR TRAINING TARGET</div><h3>${num(ex.sets)} sets × ${num(ex.min)}–${num(ex.max)} ${ex.unit==='sec'?'sec':'reps'}</h3><div class="coach-facts"><span>◎ ${num(ex.rest)}s rest</span><span>◉ 1–3 reps in reserve</span></div><div class="coach-divider"></div><div class="mini-label">LAST COMPLETED SESSION</div><p class="guide-previous">${esc(previous)}</p><div class="coach-divider"></div><h4>Progressive overload</h4><p>Hit the top of your rep range with good technique and 1–3 reps left. Then try the smallest reasonable weight increase next session.</p>${activeIndex>=0?`<button class="btn full" data-action="go-active-exercise" data-guide="${esc(id)}">↗ Continue logging this exercise</button>`:`<button class="btn full" data-action="return-guide">← Back to ${ui.guideBack==='plan'?'your plan':'exercise list'}</button>`}</div><div class="panel brief-panel"><strong>Breathing & tempo</strong><p>Breathe normally and avoid unnecessary breath-holding. Lift deliberately and control the lowering phase, typically around 2 seconds, rather than chasing a specific tempo.</p></div></div></div></div>`;
}
function navHeader(){const names={home:'Dashboard',session:'Workout tracker',plan:'Training plan',library:'Exercise guides',guide:'Exercise technique',media:'Video coach',progress:'Progress & history',settings:'Settings & backup'};$('#headerTitle').textContent=names[ui.view]||'Dashboard';$('#headerDate').textContent=prettyDate();$('#storageChip').textContent=ui.storageMode==='indexeddb'?'● Saved on device':ui.storageMode==='localStorage'?'● Basic browser storage':'● Storage unavailable';$$('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===(ui.view==='guide'?'library':ui.view)));}
function render(){document.documentElement.dataset.textSize=state.settings?.largeText?'large':'normal';document.documentElement.dataset.contrast=state.settings?.highContrast?'high':'normal';navHeader();const pages={home:renderHome,session:renderSession,plan:renderPlan,library:renderLibrary,guide:renderGuide,media:renderMedia,progress:renderProgress,settings:renderSettings};$('#app').innerHTML=(pages[ui.view]||renderHome)();renderTimer();}
function head(eyebrow,title,subtitle='',action=''){return `<div class="page-heading"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div>${action}</div>`;}
function pill(text,color=''){return `<span class="pill ${color}">${esc(text)}</span>`;}
function planRow(ex,i,actions=false){
 const id=String(ex.id||ex.exerciseId),m=licensedMedia(ex),similar=mediaMatchTier(id)!=='exact';
 return `<div class="exercise-plan">
  <div class="exercise-number">${pad2(i+1)}</div>
  <button class="media-quick-view" data-action="open-guide" data-guide="${esc(id)}" aria-label="${esc('Open '+ex.name+' technique guide')}">${guideThumb(ex)}</button>
  <div class="exercise-plan-info"><strong>${esc(ex.name)}</strong><p>${num(ex.sets)} sets · ${num(ex.min)}–${num(ex.max)} ${ex.unit==='sec'?'sec':'reps'} · ${num(ex.rest)}s rest${ex.optional?' · Optional':''}</p>
  ${ex.notes?`<p class="exercise-cue">${esc(ex.notes)}</p>`:''}
  ${similar?'<small class="exercise-variant-note">Illustration is a similar variation, not exact</small>':''}
  ${exerciseQuickActions(ex,true)}
  ${bestLoadLabel(id)?`<small class="best-load-label">★ ${esc(bestLoadLabel(id))}</small>`:''}
  </div>
  ${actions?`<div class="plan-actions"><button class="btn ghost small icon-btn" title="Move up" aria-label="Move ${esc(ex.name)} up" data-action="move-exercise" data-index="${i}" data-dir="-1">↑</button><button class="btn ghost small icon-btn" title="Move down" aria-label="Move ${esc(ex.name)} down" data-action="move-exercise" data-index="${i}" data-dir="1">↓</button><button class="btn secondary small icon-btn" title="Edit ${esc(ex.name)}" aria-label="Edit ${esc(ex.name)}" data-action="edit-exercise" data-index="${i}">✎</button><button class="btn ghost small icon-btn" title="Remove ${esc(ex.name)}" aria-label="Remove ${esc(ex.name)}" data-action="delete-exercise" data-index="${i}">×</button></div>`:''}
 </div>`;
}
function weeklyStrip(){const base=monday();const done=workoutDoneDays();return `<div class="week-strip">${Array.from({length:7},(_,i)=>{const date=dateShift(base,i);const k=localDate(date);const pid=calendarMap[date.getDay()];const pl=pid?getPlan(pid):null;return `<button class="week-day ${k===localDate()?'today':''} ${done.has(k)?'done':''}" title="${esc(pid?pl?.name||pid:'Recovery day')}" data-action="choose-week-day" data-day="${date.getDay()}"><strong>${['MON','TUE','WED','THU','FRI','SAT','SUN'][i]}</strong><div class="week-symbol">${done.has(k)?'✓':pid?(pl?.type==='legs'?'◈':pl?.type==='pull'?'↙':'↗'):'☾'}</div><span>${pid?esc(pl?.short||'Workout'):'Rest'}</span></button>`;}).join('')}</div>`;}
function warmupChecklist(p){const arr=warmups[p.type]||warmups.push;const key=`${localDate()}|${p.id}|warmup`;const done=state.checklists[key]||[];return `<div class="panel"><div class="panel-header"><div><h3>Before you lift</h3><p>Dynamic warm-up · 8–15 min</p></div>${pill(`${done.length}/${arr.length}`,'green')}</div>${arr.map(([id,label])=>`<label class="checkbox-row ${done.includes(id)?'checked':''}"><input type="checkbox" data-action="check-warmup" data-key="${esc(key)}" data-id="${esc(id)}" ${done.includes(id)?'checked':''}/><span>${esc(label)}</span></label>`).join('')}<button class="btn secondary small full coach-video-cta" data-action="open-media" data-stage="warmup" data-type="${esc(p.type)}">▶ Watch warm-up videos</button><p class="muted-note">Warm-up sets prepare you for working weight; they don't count toward your programmed sets.</p></div>`;}
function cooldownBox(p){return `<div class="panel"><div class="panel-header"><div><h3>After training</h3><p>5–10 min cooldown</p></div><span class="pill">Recovery</span></div>${(cooldowns[p.type]||[]).map(item=>`<div class="checkbox-row">✓ <span>${esc(item)}</span></div>`).join('')}<button class="btn secondary small full coach-video-cta" data-action="open-media" data-stage="cooldown" data-type="${esc(p.type)}">▶ Watch cooldown video</button><p class="muted-note">Gentle stretching supports flexibility but is not required to prevent soreness.</p></div>`;}
function renderHome(){const p=getPlan(todayPlan());const date=prettyDate();const s=stats();const done=workoutDoneDays();const todayName=p?p.name:'Recovery & mobility day';const hero=p?`<div class="hero"><div class="hero-content"><div class="eyebrow">${esc(date.toUpperCase())} · TODAY'S PLAN</div><h2>${esc(todayName)}</h2><p>${esc(p.focus)}. Follow your sets, log your weights, and build strength with a repeatable system.</p><div class="hero-tags">${pill(`${p.exercises.length} exercises`)}${pill(`${countTarget(p)} planned sets`)}${pill('6:00–8:00 AM window')}${todayCompleted()?pill('Completed today','green'):''}</div><div class="btn-row"><button class="btn" data-action="start-workout" data-plan="${esc(p.id)}">${state.draft?.planId===p.id?'↗ Resume workout':'↗ Start workout'}</button><button class="btn ghost" data-action="preview-today">View exercises →</button><button class="btn ghost" data-nav="library">◧ Exercise guides</button><button class="btn ghost" data-action="open-media" data-stage="warmup" data-type="${esc(p.type)}">▶ Video coach</button></div></div></div>`:`<div class="hero"><div class="hero-content"><div class="eyebrow">${esc(date.toUpperCase())} · REST DAY</div><h2>Recovery is part of progress.</h2><p>Sunday is for gentle mobility, easy walking, good food and enough sleep. You don't need to lift every day to improve.</p><div class="hero-tags">${pill('20-min mobility')}${pill('No heavy training')}</div><button class="btn" data-action="scroll-mobility">Open mobility checklist ↓</button></div></div>`;
return `${head('YOUR TRAINING HUB','Make every rep count.','Your six-day Push / Pull / Legs plan, organized for repeatable progress.')}${state.draft?`<section class="resume-workout panel" role="status"><div><span class="mini-label">● WORKOUT IN PROGRESS</span><h3>${esc(state.draft.name)}</h3><p>${totalDone(state.draft)}/${totalPlanned(state.draft)} planned sets complete · Session is saved locally</p></div><button class="btn" data-nav="session">↗ Resume workout</button></section>`:''}${hero}<div class="grid four-col" style="margin-bottom:18px"><div class="panel stat"><div class="stat-title">WORKOUTS THIS WEEK</div><div class="stat-value">${s.week}<span class="muted"> / 6</span></div><div class="stat-foot">Monday to Sunday</div></div><div class="panel stat"><div class="stat-title">TOTAL SESSIONS</div><div class="stat-value">${s.total}</div><div class="stat-foot">All recorded workouts</div></div><div class="panel stat"><div class="stat-title">SETS COMPLETED</div><div class="stat-value">${s.allSets}</div><div class="stat-foot">Working + drop sets</div></div><div class="panel stat"><div class="stat-title">TRAINING VOLUME</div><div class="stat-value">${displayVolume(s.volume)}</div><div class="stat-foot">${weightUnit()} × reps, logged loads</div></div></div><div class="grid two-col"><div><div class="panel"><div class="panel-header"><div><h3>Your training week</h3><p>Tap a day to review or start that plan</p></div></div>${weeklyStrip()}</div><div class="panel" style="margin-top:16px"><div class="panel-header"><div><h3>${p?'Today’s exercises':'Next session preview'}</h3><p>${p?esc(p.short):'Monday · Push A'}</p></div><button class="btn ghost small" data-action="preview-today">Full plan →</button></div>${(p||getPlan('push-a')).exercises.slice(0,5).map((ex,i)=>`<div class="workout-mini"><div class="num">${i+1}</div><div class="mini-body"><strong>${esc(ex.name)}</strong><small>${ex.sets} × ${ex.min}–${ex.max} ${ex.unit==='sec'?'sec':'reps'} · ${esc(ex.group)}</small></div><span class="muted">›</span></div>`).join('')}</div></div><div><div id="mobilityAnchor">${p?warmupChecklist(p):renderMobility(true)}</div><div style="margin-top:16px">${p?cooldownBox(p):`<div class="panel"><h3>Next up: Push A</h3><p class="muted small">Monday · Chest and triceps. Resume your split after your recovery day.</p><button class="btn secondary small" data-action="choose-plan" data-plan="push-a">Open Monday plan →</button></div>`}</div></div></div>${state.draft?`<div class="alert" style="margin-top:17px">You have an unfinished <strong>${esc(state.draft.name)}</strong> workout. Your completed and unfinished sets are being saved locally. <button class="btn small secondary" data-nav="session">Resume it →</button></div>`:''}<p class="footline">Your logged workouts stay on this device. Export a JSON backup regularly from Settings so browser cleanup or phone replacement doesn't erase your history.</p>`;}
function renderMobility(isHome=false){const key=localDate();const done=state.mobility[key]||[];return `<div class="panel"><div class="panel-header"><div><h3>Sunday mobility reset</h3><p>7 movements · 20 minutes · no forcing</p></div>${pill(`${done.length}/7 done`,'purple')}</div><div class="progress-bar" style="margin-bottom:8px"><div style="width:${Math.round(done.length/mobilityItems.length*100)}%"></div></div>${mobilityItems.map(([id,name,time])=>`<div class="mobi-row"><label class="checkbox-row ${done.includes(id)?'checked':''}"><input type="checkbox" data-action="check-mobility" data-key="${esc(key)}" data-id="${id}" ${done.includes(id)?'checked':''}/><span>${esc(name)}</span></label><span class="mobi-time">${esc(time)}</span></div>`).join('')}<button class="btn secondary small full coach-video-cta" data-action="open-media" data-stage="mobility">▶ Watch mobility guides</button><p class="muted-note">This checklist is dated today. You can use it on any rest day; the plan remains Sunday-focused.</p></div>`;}
function planSelector(active){return `<div class="day-selector">${state.plan.map(p=>`<button class="day-button ${p.id===active?'selected':''}" data-action="choose-plan" data-plan="${esc(p.id)}">${esc(p.short)}</button>`).join('')}</div>`;}
function renderPlan(){const p=getPlan(ui.selectedPlan)||state.plan[0];if(!p)return '<div class="empty">No training plans available</div>';ui.selectedPlan=p.id;return `${head('YOUR PROGRAM','Six days. Full-body coverage.','A & B workouts balance training quality and weekly volume.')}${planSelector(p.id)}<div class="grid two-col"><div><div class="panel"><div class="panel-header"><div><div class="mini-label">${esc(p.focus)}</div><h3 style="margin-top:6px">${esc(p.name)}</h3><p>${p.exercises.length} exercises · ${countTarget(p)} planned working sets (excludes optional)</p></div></div><div class="btn-row" style="margin-bottom:12px"><button class="btn" data-action="start-workout" data-plan="${esc(p.id)}">Start ${esc(p.short)} ↗</button><button class="btn secondary" data-action="add-exercise">+ Add exercise</button></div>${p.exercises.map((ex,i)=>planRow(ex,i,true)).join('')||'<div class="empty">No exercises yet. Add one to this workout.</div>'}</div><p class="muted-note" style="margin:14px 0 0">Edit sets, rep targets, rests and exercise order here. Changes affect future sessions, not your logged history.</p></div><div>${warmupChecklist(p)}<div style="height:16px"></div>${cooldownBox(p)}<div class="alert warning" style="margin-top:16px"><strong>Lower-back note:</strong> You've recovered from previous squat discomfort. Keep hack squat and leg press loading progressive and within comfortable ranges. Stop exercises that reproduce pain.</div></div></div>`;}
function newSession(planId){const p=getPlan(planId);if(!p)return;return {id:uid(),planId:p.id,name:p.name,startedAt:new Date().toISOString(),exercises:p.exercises.map(e=>({exerciseId:e.id,name:e.name,group:e.group,notes:e.notes,unit:e.unit||'reps',rest:e.rest,optional:!!e.optional,min:e.min,max:e.max,sets:Array.from({length:Number(e.sets)},()=>({id:uid(),type:'working',weight:getBestWeight(e.id)||'',reps:'',rir:2,done:false}))})),notes:''};}
function startWorkout(planId){if(state.draft){if(state.draft.planId===planId){go('session');return;}if(!confirm(`You still have an unfinished ${state.draft.name} session. Replace it with a new session? Your unfinished entries will be lost.`))return;}const p=getPlan(planId);if(!p){toast('Workout plan unavailable',true);return;}state.draft=newSession(planId);queueSave();go('session');toast(`${p.short} started. You've got this!`);}
function prevText(exerciseId,unit='reps'){const vals=getLastSets(exerciseId);if(!vals.length)return 'No previous sets logged';return `Last: ${vals.slice(0,3).map(s=>`${weightDisplay(s.weight)}${weightUnit()} × ${num(s.reps)}${unit==='sec'?'s':''}`).join(' · ')}`;}
function setEntryWeight(set){
  if(!set?.done && (set?.weight===0||set?.weight==='0'))return '';
  return weightDisplay(set?.weight);
}
function setEntryReps(set){
  if(!set?.done && (set?.reps===0||set?.reps==='0'))return '';
  return set?.reps??'';
}
function renderSetRow(ex,ei,set,si){
 const prev=getLastSets(ex.exerciseId).filter(v=>v.type===set.type);
 const sameTypeIndex=ex.sets.slice(0,si+1).filter(v=>v.type===set.type).length-1;
 const pv=prev[sameTypeIndex]||null;
 const label=set.type==='warmup'?'W':set.type==='drop'?'D':si+1;
 const prevLabel=pv?`${weightDisplay(pv.weight)} ${weightUnit()} × ${num(pv.reps)}`:'No previous set';
 return `<tr class="set-row ${set.done?'complete':''}" data-set-type="${esc(set.type)}">
 <td class="set-type-cell" data-label="Set"><button class="set-label ${esc(set.type==='drop'?'drop':set.type==='warmup'?'warmup':'')}" data-action="cycle-set-type" data-ex="${ei}" data-set="${si}" title="Tap to change: working → warm-up → drop">${label}</button></td>
 <td class="set-prev-cell" data-label="Previous">${pv?`<button class="previous-fill" data-action="copy-previous-set" data-ex="${ei}" data-set="${si}" title="Copy previous values for this set" aria-label="Copy previous ${esc(ex.name)} set: ${esc(prevLabel)}">↶ ${esc(prevLabel)}</button>`:`<span class="muted tiny">—</span>`}</td>
 <td class="set-weight-cell" data-label="${weightUnit()}"><input aria-label="${esc(ex.name)} set ${si+1} weight in ${weightUnit()}" inputmode="decimal" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" data-ex="${ei}" data-set="${si}" data-field="weight" value="${esc(setEntryWeight(set))}" placeholder="—" /></td>
 <td class="set-reps-cell" data-label="${ex.unit==='sec'?'Seconds':'Reps'}"><input aria-label="${esc(ex.name)} set ${si+1} ${ex.unit==='sec'?'seconds':'repetitions'}" inputmode="numeric" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" data-ex="${ei}" data-set="${si}" data-field="reps" value="${esc(setEntryReps(set))}" placeholder="—" /></td>
 <td class="set-rir-cell" data-label="RIR"><select aria-label="${esc(ex.name)} set ${si+1} reps in reserve" data-ex="${ei}" data-set="${si}" data-field="rir">${[0,1,2,3,4,5].map(v=>`<option ${num(set.rir)===v?'selected':''} value="${v}">${v}${v===5?'+':''}</option>`).join('')}</select></td>
 <td class="set-complete-cell" data-label="Done"><button class="complete-set ${set.done?'yes':''}" data-action="toggle-set" data-ex="${ei}" data-set="${si}" title="${set.done?'Mark set incomplete':'Complete this set'}" aria-label="${set.done?'Mark set incomplete':'Mark set complete'}" aria-pressed="${set.done}">${set.done?'✓':'○'}</button></td></tr>`;
}
function progressionHint(ex){const prev=getLastSets(ex.exerciseId).filter(s=>s.type==='working');if(!prev.length)return 'First time? Pick a load you can control with about 2 reps left in reserve.';const repMax=num(ex.max);const required=ex.sets.filter(s=>s.type==='working').length;const qualified=prev.length>=required && prev.slice(0,required).every(s=>num(s.reps)>=repMax && num(s.rir)>=1 && num(s.weight)>0);return qualified?'Previous session reached the rep ceiling on all working sets: consider the smallest available weight increase if form stays solid.':'Use your previous working weight and try to add a good rep before increasing the load.';}
function bestLoggedSet(exerciseId){
 let best=null;
 for(const session of state.history||[])for(const set of session.sets||[]){
 if(set.exerciseId!==exerciseId||set.type!=='working'||set.unit==='sec'||!Number.isFinite(+set.weight)||+set.weight<=0)continue;
 if(!best||+set.weight>+best.weight||(+set.weight===+best.weight&&num(set.reps)>num(best.reps)))best=set;
 }
 return best;
}
function bestLoadLabel(exerciseId){const best=bestLoggedSet(exerciseId);return best?`Personal best load: ${weightDisplay(best.weight)} ${weightUnit()} × ${num(best.reps)} reps`:'';}
function renderExerciseCard(ex,i){const done=working(ex.sets).length;const target=ex.sets.filter(s=>s.type==='working').length;return `<section class="exercise-card" id="exercise-${i}"><div class="exercise-head"><div class="idx">${i+1}</div><button class="media-quick-view" data-action="open-guide" data-guide="${esc(ex.exerciseId)}" aria-label="${esc('Open '+ex.name+' technique guide')}">${guideThumb(ex)}</button><div class="exercise-namebox"><h3>${esc(ex.name)}</h3><p>${esc(ex.group)} · ${num(ex.min)}–${num(ex.max)} ${ex.unit==='sec'?'seconds':'reps'} · ${num(ex.rest)}s rest ${ex.optional?'· Optional':''}</p><p>${esc(ex.notes||'')}</p></div>${pill(`${done}/${target} done`,done>=target&&target?'green':'')}</div>
 <div class="exercise-guide-cta">${exerciseQuickActions(ex)}</div>
 <div class="last-badge">↶ ${esc(prevText(ex.exerciseId,ex.unit))}</div>${bestLoadLabel(ex.exerciseId)?`<div class="best-load-label">★ ${esc(bestLoadLabel(ex.exerciseId))}</div>`:''}<div class="set-note">↗ ${esc(progressionHint(ex))}</div>
 <div class="set-table-wrap"><table class="set-table"><thead><tr><th>Set</th><th>Previous</th><th>${weightUnit()}</th><th>${ex.unit==='sec'?'Sec':'Reps'}</th><th>RIR</th><th>✓</th></tr></thead><tbody>${ex.sets.map((s,si)=>renderSetRow(ex,i,s,si)).join('')}</tbody></table></div>
 <div class="exercise-foot"><div class="buttons"><button class="btn secondary small" data-action="add-set" data-ex="${i}" data-type="working">+ Set</button><button class="btn ghost small" data-action="add-set" data-ex="${i}" data-type="warmup">+ Warm-up</button><button class="btn ghost small" data-action="add-set" data-ex="${i}" data-type="drop">+ Drop</button><button class="btn ghost small" data-action="remove-set" data-ex="${i}">− Last</button></div><span class="muted tiny">${ex.rest}s rest</span></div></section>`;}

function readinessCard(draft){
 const c=draft.checkin||{};
 const choices=(current,opts)=>opts.map(([v,label])=>`<option value="${esc(v)}" ${String(current||'')===v?'selected':''}>${esc(label)}</option>`).join('');
 return `<div class="session-readiness panel"><div class="readiness-title"><span class="mini-label">OPTIONAL · SESSION CHECK-IN</span><span id="saveStatus" class="save-indicator" role="status" aria-live="polite">✓ Local saving active</span></div><div class="readiness-fields">
 <label>Energy today<select data-action="checkin-energy" aria-label="Energy today">${choices(c.energy,[['','Skip'],['1','1 · Very low'],['2','2 · Low'],['3','3 · Normal'],['4','4 · Good'],['5','5 · High']])}</select></label>
 <label>Muscle soreness<select data-action="checkin-soreness" aria-label="Muscle soreness">${choices(c.soreness,[['','Skip'],['none','None'],['mild','Mild'],['moderate','Moderate'],['high','High']])}</select></label></div>
 <p class="muted-note">Personal training context only. Adjust intensity when unusually fatigued; avoid training through pain.</p></div>`;}
function renderSession(){const draft=state.draft;if(!draft){const today=todayPlan();return `${head('WORKOUT TRACKER','Ready to train?','Choose a session below. Your active workout autosaves after each change.')}<div class="hero"><div class="hero-content"><div class="eyebrow">YOUR NEXT WORKOUT</div><h2>${esc(getPlan(today)?.name||'Pick your training day')}</h2><p>Log weight, reps, RIR, warm-ups and drop sets. Your last workout loads will be suggested automatically.</p>${today?`<button class="btn" data-action="start-workout" data-plan="${esc(today)}">Start today’s workout ↗</button>`:''}</div></div>${planSelector('')}<div class="grid three-col">${state.plan.map(p=>`<div class="panel"><div class="mini-label">${esc(p.focus)}</div><h3 style="margin:10px 0">${esc(p.short)}</h3><p class="muted small">${p.exercises.length} exercises · ${countTarget(p)} working sets</p><button class="btn secondary small full" data-action="start-workout" data-plan="${esc(p.id)}">Start ${esc(p.short)}</button></div>`).join('')}</div>`;}
const elapsed=Math.max(0,Math.floor((Date.now()-new Date(draft.startedAt).getTime())/1000));const total=totalPlanned();const done=totalDone();const p=getPlan(draft.planId)||{type:'push',id:draft.planId,name:draft.name};
return `<div class="eyebrow" style="margin-bottom:12px">● LIVE WORKOUT · LOG YOUR SETS</div><div class="session-banner"><div><div class="mini-label">ACTIVE WORKOUT · ${esc(new Date(draft.startedAt).toLocaleDateString(undefined,{weekday:'long'}))}</div><h2>${esc(draft.name)}</h2><div class="session-summary"><span><strong>${done}/${total}</strong> sets done</span><span><strong id="elapsedClock">${formatTime(elapsed)}</strong> elapsed</span><span><strong>${draft.exercises.length}</strong> exercises</span></div></div><div class="btn-row"><button class="btn ghost small" data-action="open-media" data-stage="warmup" data-type="${esc(p.type)}">▶ Warm-up video</button><button class="btn ghost small" data-action="manual-rest" data-seconds="90">⏱ 90s rest</button><button class="btn ghost small" data-action="next-incomplete">↓ Next unfinished</button><button class="btn secondary small" data-action="finish-workout">Finish workout ✓</button></div></div>${readinessCard(draft)}<div class="progress-bar" style="margin:0 0 17px"><div style="width:${Math.min(100,Math.round(done/Math.max(total,1)*100))}%"></div></div><details id="prepDetails" class="session-prep" ${ui.prepOpen?'open':''}><summary><span>☀ Warm-up & training tips <small>8–15 min • tap to ${ui.prepOpen?'hide':'expand'}</small></span><span class="prep-chevron">⌄</span></summary><div class="grid two-col" style="margin-top:13px"><div>${warmupChecklist(p)}</div><div class="panel"><div class="panel-header"><div><h3>Workout rules</h3><p>Simple progression, not endless sets</p></div></div><div class="muted small" style="line-height:1.9">• Most sets: <strong style="color:var(--text)">1–3 RIR</strong><br/>• Heavy compound sets: 2–3 min rest<br/>• Isolation sets: 60–120 s rest<br/>• Reach the top of the rep range on quality sets before adding weight.<br/>• Optional drop set on a safe isolation exercise.</div></div></div></details><div class="grid" style="gap:0">${draft.exercises.map(renderExerciseCard).join('')}</div><div class="panel" style="margin-bottom:15px"><div class="panel-header"><h3>Session notes</h3></div><textarea id="sessionNotes" placeholder="Energy, form notes, discomfort, how the session felt…">${esc(draft.notes||'')}</textarea></div>${cooldownBox(p)}<div class="btn-row" style="margin-top:18px"><button class="btn" data-action="finish-workout">✓ Finish & save workout</button><button class="btn danger" data-action="discard-workout">Discard session</button></div><p class="footline">Autosaved to your phone browser. If the app or tab closes, return to the Workout tab to resume. Back up regularly via Settings.</p>`;}
function finishWorkout(){const d=state.draft;if(!d)return;const all=d.exercises.flatMap(ex=>ex.sets.filter(s=>s.done).map(s=>({...s,exerciseId:ex.exerciseId,name:ex.name,group:ex.group,unit:ex.unit})));const strength=all.filter(s=>s.type!=='warmup');if(!strength.length){toast('Complete at least one working set before finishing.',true);return;}const incomplete=d.exercises.reduce((n,ex)=>n+ex.sets.filter(s=>!s.done&&s.type==='working'&&!ex.optional).length,0);if(incomplete && !confirm(`${incomplete} planned working sets are unfinished. Save this workout anyway?`))return;const endedAt=new Date().toISOString();state.history.push({id:d.id,planId:d.planId,name:d.name,date:localDate(),startedAt:d.startedAt,endedAt,durationSec:Math.round((Date.now()-new Date(d.startedAt).getTime())/1000),sets:all,notes:d.notes||'',checkin:d.checkin||{}});state.draft=null;stopRest();immediateSave();go('progress');toast(`Saved ${strength.length} working sets. Strong work!`);}
function timerBeep(){try{const AudioCtx=window.AudioContext||window.webkitAudioContext;if(AudioCtx){const context=new AudioCtx();const osc=context.createOscillator(),gain=context.createGain();osc.connect(gain);gain.connect(context.destination);osc.frequency.setValueAtTime(880,context.currentTime);gain.gain.setValueAtTime(0.04,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.16);osc.start();osc.stop(context.currentTime+.17);osc.onended=()=>context.close();}if(navigator.vibrate)navigator.vibrate([100,60,100]);}catch{}}
function startRest(seconds){ui.restEnd=Date.now()+Math.max(5,num(seconds,90))*1000;state.restEndsAt=ui.restEnd;queueSave();clearInterval(ui.restInterval);ui.restInterval=setInterval(()=>{renderTimer();const c=$('#elapsedClock');if(c&&state.draft)c.textContent=formatTime((Date.now()-new Date(state.draft.startedAt).getTime())/1000);},1000);renderTimer();}
function stopRest(){ui.restEnd=0;state.restEndsAt=0;queueSave();clearInterval(ui.restInterval);ui.restInterval=null;renderTimer();}
function renderTimer(){const el=$('#restTimer');if(!el)return;if(!ui.restEnd){el.classList.add('hidden');return;}const rem=Math.ceil((ui.restEnd-Date.now())/1000);if(rem<=0){stopRest();timerBeep();toast('Rest complete — ready for the next set');return;}el.classList.remove('hidden');el.innerHTML=`<span class="muted tiny">REST TIMER</span><strong>${formatTime(rem)}</strong><button class="btn small secondary" data-action="add-rest">+30s</button><button class="close" data-action="stop-rest" title="End rest">✕</button>`;}

function setDone(exIndex,setIndex){const ex=state.draft?.exercises[exIndex];const s=ex?.sets[setIndex];if(!s)return;if(!s.done && (!Number.isInteger(Number(s.reps))||num(s.reps)<=0||num(s.reps)>500)){toast(`Enter ${ex.unit==='sec'?'seconds':'reps'} before completing this set.`,true);return;}if(!s.done && (!Number.isFinite(Number(s.weight))||num(s.weight)<0||num(s.weight)>2000)){toast('Enter a valid non-negative weight.',true);return;}s.done=!s.done;s.completedAt=s.done?new Date().toISOString():undefined;queueSave();render();if(s.done && state.settings.autoRest)startRest(ex.rest);}
function setType(exIndex,setIndex){const s=state.draft?.exercises[exIndex]?.sets[setIndex];if(!s)return;s.type=({working:'warmup',warmup:'drop',drop:'working'})[s.type]||'working';queueSave();render();}
function addSet(exIndex,type){const ex=state.draft?.exercises[exIndex];if(!ex)return;const last=ex.sets.at(-1);const lastWeight=last?.weight;const weight=lastWeight===''||lastWeight==null?'':type==='drop'?+(num(lastWeight)*.75).toFixed(1):lastWeight;ex.sets.push({id:uid(),type,weight,reps:'',rir:type==='warmup'?4:2,done:false});queueSave();render();const card=$(`#exercise-${exIndex}`);card?.scrollIntoView({block:'center'});}
function removeSet(exIndex){const ex=state.draft?.exercises[exIndex];if(!ex||ex.sets.length<=1){toast('At least one set must remain.',true);return;}const s=ex.sets.at(-1);if(s.done&&!confirm('Remove the last completed set?'))return;ex.sets.pop();queueSave();render();}
function barChart(weekly){const w=640,h=240,left=30,top=20,bottom=198,chartH=bottom-top;const max=Math.max(3,...weekly.map(x=>x.count));return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Weekly completed workouts chart">${[0,1,2,3].map(i=>{const yy=bottom-i/3*chartH;return `<line x1="${left}" y1="${yy}" x2="620" y2="${yy}" stroke="#344247" stroke-dasharray="3 6"/><text x="22" y="${yy+4}" fill="#81918a" font-size="10" text-anchor="end">${Math.round(max*i/3)}</text>`;}).join('')}${weekly.map((v,i)=>{const bw=42;const x=left+16+i*74;const hh=v.count/max*(chartH-8);return `<rect x="${x}" y="${bottom-hh}" width="${bw}" height="${hh||2}" rx="7" fill="${i===weekly.length-1?'#a68aff':'#625291'}"/><text x="${x+bw/2}" y="${bottom+20}" fill="#aaa2c5" font-size="10" text-anchor="middle">${esc(v.label)}</text>${v.count?`<text x="${x+bw/2}" y="${bottom-hh-9}" fill="#e8f4e6" font-size="11" text-anchor="middle">${v.count}</text>`:''}`;}).join('')}</svg>`;}
function lineChart(data){const w=640,h=230,left=40,right=612,top=24,bottom=180;if(!data.length)return '<div class="empty"><strong>No history yet</strong>Log this exercise in a finished workout to see your trend.</div>';const vals=data.map(x=>x.value);let lo=Math.min(...vals),hi=Math.max(...vals);if(lo===hi){lo=Math.max(0,lo-5);hi+=5;}const xy=data.map((d,i)=>({x:data.length===1?(left+right)/2:left+(right-left)*i/(data.length-1),y:bottom-(d.value-lo)/(hi-lo)*(bottom-top)}));const path=xy.map((p,i)=>`${i===0?'M':'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Estimated exercise strength trend">${[0,1,2,3].map(i=>{const y=bottom-(bottom-top)*i/3;return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#354144" stroke-dasharray="4 5"/><text x="${left-8}" y="${y+4}" text-anchor="end" fill="#96a8a0" font-size="10">${(lo+(hi-lo)*i/3).toFixed(0)}</text>`;}).join('')}<path d="${path}" fill="none" stroke="#a68aff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>${xy.map((p,i)=>`<circle cx="${p.x}" cy="${p.y}" r="5" fill="#a68aff" stroke="#17221c" stroke-width="2"/><text x="${p.x}" y="${p.y-13}" fill="#e6dcff" text-anchor="middle" font-size="10">${data[i].value.toFixed(1)}</text>`).join('')}<text x="${left}" y="${bottom+30}" fill="#91a198" font-size="11">${esc(data[0].label)}</text><text x="${right}" y="${bottom+30}" text-anchor="end" fill="#91a198" font-size="11">${esc(data.at(-1).label)}</text></svg>`;}
function renderProgress(){const s=stats();const base=monday();const weekly=Array.from({length:8},(_,i)=>{const start=dateShift(base,(i-7)*7);const end=dateShift(start,6);return {label:start.toLocaleDateString(undefined,{month:'short',day:'numeric'}),count:state.history.filter(h=>h.date>=localDate(start)&&h.date<=localDate(end)).length};});const available=new Map();state.plan.forEach(p=>p.exercises.forEach(ex=>available.set(ex.id,ex.name)));state.history.forEach(h=>h.sets.forEach(s=>available.set(s.exerciseId,s.name)));const opts=Array.from(available.entries()).sort((a,b)=>a[1].localeCompare(b[1]));if(!available.has(ui.trendExercise))ui.trendExercise=opts[0]?.[0]||'';const trend=state.history.map(h=>{const group=h.sets.filter(s=>s.exerciseId===ui.trendExercise && s.type==='working' && s.unit!=='sec' && num(s.weight)>0 && num(s.reps)>0 && num(s.reps)<=10);if(!group.length)return null;return {label:datePrettyKey(h.date),value:weightDisplay(Math.max(...group.map(s=>num(s.weight)*(1+num(s.reps)/30))))};}).filter(Boolean).slice(-12);
const byGroup={};state.history.forEach(h=>{if(!isInWeek(h.date))return;h.sets.forEach(s=>{if(s.type==='warmup')return;byGroup[s.group]=(byGroup[s.group]||0)+1;});});const maxSets=Math.max(1,...Object.values(byGroup));
return `${head('TRAINING ANALYTICS','Progress that you can see.','Your workout logs power these charts. No remote service receives the data.')}<div class="grid four-col" style="margin-bottom:16px"><div class="panel stat"><div class="stat-title">ALL WORKOUTS</div><div class="stat-value">${s.total}</div><div class="stat-foot">Completed sessions</div></div><div class="panel stat"><div class="stat-title">THIS WEEK</div><div class="stat-value">${s.week} <span class="muted">/ 6</span></div><div class="stat-foot">Sessions logged</div></div><div class="panel stat"><div class="stat-title">WORKING SETS</div><div class="stat-value">${s.allSets}</div><div class="stat-foot">Including drop sets</div></div><div class="panel stat"><div class="stat-title">TOTAL VOLUME</div><div class="stat-value">${displayVolume(s.volume)}</div><div class="stat-foot">${weightUnit()} × reps (not bodyweight)</div></div></div><div class="grid two-col"><div><div class="panel"><div class="panel-header"><div><h3>Workout consistency</h3><p>Completed sessions per week · last 8 weeks</p></div></div>${barChart(weekly)}</div><div class="panel" style="margin-top:16px"><div class="panel-header"><div><h3>Exercise strength trend</h3><p>Estimated 1RM (${weightUnit()}) = load × (1 + reps / 30)</p></div></div><select aria-label="Choose an exercise for strength chart" data-action="trend-exercise" style="width:100%;margin-bottom:14px">${opts.map(([id,name])=>`<option value="${esc(id)}" ${id===ui.trendExercise?'selected':''}>${esc(name)}</option>`).join('')}</select>${lineChart(trend)}<p class="muted-note">Estimated 1RM is only a rough trend, especially for machines and isolation movements. Never attempt a true 1-rep max to fill this chart.</p></div></div><div><div class="panel"><div class="panel-header"><div><h3>Weekly sets by muscle focus</h3><p>Direct working sets, not indirect overlap</p></div></div>${Object.keys(byGroup).length?Object.entries(byGroup).sort((a,b)=>b[1]-a[1]).map(([name,value])=>`<div class="volume-row"><strong style="min-width:78px">${esc(name)}</strong><div class="meter"><div style="width:${value/maxSets*100}%"></div></div><strong>${value}</strong></div>`).join(''):'<div class="empty">Complete your first session to see weekly muscle-group coverage.</div>'}<p class="muted-note">Compound lifts also train other muscles; these categories are simplified for tracking.</p></div><div class="panel" style="margin-top:16px"><div class="panel-header"><div><h3>Workout history</h3><p>${state.history.length} finished sessions</p></div></div>${state.history.length?state.history.slice().reverse().map(h=>{const volume=Math.round(h.sets.reduce((n,s)=>n+(s.type==='warmup'?0:num(s.weight)*num(s.reps)),0));return `<details class="history-item"><summary><div><strong>${esc(h.name)}</strong><small>${esc(datePrettyKey(h.date))} · ${h.sets.filter(s=>s.type!=='warmup').length} sets · ${Math.round((h.durationSec||0)/60)} min</small></div><span class="pill">${displayVolume(volume)} ${weightUnit()}</span></summary><div class="history-rows">${h.sets.map(s=>`<div><span>${esc(s.name)} <span class="muted">(${esc(s.type||'working')})</span></span><strong>${weightDisplay(s.weight)} ${weightUnit()} × ${num(s.reps)} ${s.unit==='sec'?'sec':'reps'} · ${num(s.rir,2)} RIR</strong></div>`).join('')}</div>${h.checkin?.energy||h.checkin?.soreness?`<p class="muted small">Session check-in: ${h.checkin.energy?'Energy '+esc(h.checkin.energy)+'/5':''}${h.checkin.soreness?' · Soreness '+esc(h.checkin.soreness):''}</p>`:''}${h.notes?`<p class="muted small">Notes: ${esc(h.notes)}</p>`:''}<div class="btn-row" style="margin-top:10px"><button class="btn danger small" data-action="delete-history" data-history="${esc(h.id)}">Delete workout</button></div></details>`;}).join(''):'<div class="empty"><strong>Nothing logged yet</strong>Start a workout and complete a set, then finish your session. It will appear here.</div>'}</div></div></div>`;}
function renderSettings(){return `${head('YOUR DATA','Make the tracker yours.','No login. No subscription. Your history is stored in this browser.')}<div class="grid two-col"><div><div class="panel setting-section"><div class="setting-title"><div><h3>Keep your workout history safe</h3><p>Export and restore your entire plan, logs and preferences</p></div>${pill('Offline','green')}</div><div class="btn-row"><button class="btn" data-action="export-data">↓ Export JSON backup</button><button class="btn secondary" data-action="export-csv">↓ Export sets (CSV)</button><button class="btn secondary" data-action="import-data">↑ Restore backup</button></div><p class="muted-note">Backup files are saved to your downloads. Restoring replaces all current data. Store a copy in your phone files or personal cloud drive.</p></div><div class="panel setting-section"><div class="setting-title"><div><h3>Install as a phone app</h3><p>Works from your home screen when hosted on HTTPS</p></div></div><div class="btn-row"><button class="btn secondary" data-action="install-pwa" id="installBtn">↗ Install FitTrack</button></div><p class="muted-note">Android Chrome: open the hosted website → menu (⋮) → Add to Home screen / Install app. iPhone Safari: Share → Add to Home Screen. Installation options depend on browser and hosting.</p></div><div class="panel setting-section"><div class="setting-title"><div><h3>Browser storage</h3><p id="storageStatus">${ui.storageMode==='indexeddb'?'IndexedDB ready — private to this browser origin':ui.storageMode==='localStorage'?'Using basic browser storage':'Storage unavailable — export data now'}</p></div><button class="btn secondary" data-action="persistent-storage">Request durable storage</button><p class="muted-note">Browsers may still delete site data, and changing browsers/devices does not transfer workouts. Export backups regularly.</p></div></div><div><div class="panel setting-section"><div class="setting-title"><div><h3>Workout preferences</h3><p>Customize your logging experience</p></div></div><label class="field"><span class="setting-label">Weight unit</span><select id="weightUnitSelect" data-action="setting-weight-unit" aria-label="Preferred weight unit"><option value="kg" ${weightUnit()==='kg'?'selected':''}>Kilograms (kg)</option><option value="lb" ${weightUnit()==='lb'?'selected':''}>Pounds (lb)</option></select></label><p class="muted-note">Only the display changes. Data is stored in kilograms, so switching units never rewrites your workout history.</p><div class="setting-preference"><label class="checkbox-row"><input type="checkbox" data-action="setting-text-size" ${state.settings.largeText?'checked':''}/><span>Larger text and touch controls</span></label><label class="checkbox-row"><input type="checkbox" data-action="setting-contrast" ${state.settings.highContrast?'checked':''}/><span>High contrast mode</span></label></div><label class="checkbox-row"><input type="checkbox" data-action="setting-rest" ${state.settings.autoRest?'checked':''}/><span>Start rest timer automatically after each completed set</span></label><p class="muted-note">The timer uses the rest time saved with each exercise. You can extend or dismiss it at any time.</p></div><div class="panel setting-section"><div class="setting-title"><div><h3>Training reminder</h3><p>Protect your recovered lower back</p></div></div><ul class="help-list"><li>Return to leg training gradually with a comfortable depth and controlled loads.</li><li>Rest and recovery matter more than doing extra sets just to feel exhausted.</li><li>Persistent or recurring back pain deserves evaluation by a qualified clinician.</li><li>If you have sudden weakness, saddle numbness or bowel/bladder changes, seek urgent care.</li></ul></div><div class="panel setting-section"><div class="setting-title"><div><h3>Reset everything</h3><p>Remove all workouts, history and settings from this browser</p></div></div><button class="btn danger" data-action="reset-data">Erase my local data</button></div></div></div><p class="footline">FitTrack v1.0 • Local-first PWA • No trackers or cloud sync. If you use private browsing, local data may be cleared when the session ends.</p>`;}
function modalOpen(html){$('#modalBody').innerHTML=html;$('#modal').showModal();}
function modalClose(){$('#modal').close();}
function exerciseModal(index=null){const p=getPlan(ui.selectedPlan);if(!p)return;const editing=index!==null;const ex=editing?p.exercises[index]:E('','Back',3,8,12,90,'');if(!ex)return;const groups=['Chest','Back','Triceps','Biceps','Forearms','Quads','Hamstrings','Glutes','Adductors','Calves','Shoulders','Traps','Core','Other'];modalOpen(`<div class="eyebrow">${editing?'EDIT EXERCISE':'NEW EXERCISE'}</div><h2>${editing?'Update your movement':'Add to '+esc(p.short)}</h2><p>Changes to your program affect future sessions only.</p><form id="exerciseForm" data-index="${editing?index:''}"><div class="field"><label for="exName">Exercise name</label><input id="exName" name="name" maxlength="90" value="${esc(ex.name)}" required/></div><div class="fields-row"><div class="field"><label for="exGroup">Muscle group</label><select name="group" id="exGroup">${groups.map(g=>`<option value="${g}" ${g===ex.group?'selected':''}>${g}</option>`).join('')}</select></div><div class="field"><label for="exSets">Working sets</label><input id="exSets" type="number" name="sets" min="1" max="12" value="${num(ex.sets)}" required/></div></div><div class="fields-row"><div class="field"><label for="exMin">Minimum reps / seconds</label><input id="exMin" type="number" name="min" min="1" max="300" value="${num(ex.min)}" required/></div><div class="field"><label for="exMax">Maximum reps / seconds</label><input id="exMax" type="number" name="max" min="1" max="300" value="${num(ex.max)}" required/></div></div><div class="fields-row"><div class="field"><label for="exRest">Rest seconds</label><input id="exRest" type="number" name="rest" min="0" max="600" step="5" value="${num(ex.rest)}" required/></div><div class="field"><label for="exUnit">Reps or seconds</label><select id="exUnit" name="unit"><option value="reps" ${ex.unit==='reps'?'selected':''}>Repetitions</option><option value="sec" ${ex.unit==='sec'?'selected':''}>Seconds</option></select></div></div><div class="field"><label for="exNotes">Technique cues (optional)</label><textarea name="notes" id="exNotes" maxlength="350">${esc(ex.notes||'')}</textarea></div><label class="checkbox-row"><input type="checkbox" name="optional" ${ex.optional?'checked':''}/><span>Optional exercise (does not count as a required set)</span></label><div class="modal-footer"><button type="button" class="btn ghost" data-action="close-modal">Cancel</button><button type="submit" class="btn">${editing?'Save changes':'Add exercise'}</button></div></form>`);$('#exName').focus();}
function saveExerciseForm(form){const p=getPlan(ui.selectedPlan);if(!p)return;const f=new FormData(form);const name=String(f.get('name')||'').trim();const min=num(f.get('min')),max=num(f.get('max')),sets=num(f.get('sets')),rest=num(f.get('rest'));if(!name||name.length>90||min<1||max<min||sets<1||sets>12||rest<0||rest>600){toast('Please check the name, sets and rep range.',true);return;}const idx=form.dataset.index!==''?Number(form.dataset.index):null;const original=idx===null?null:p.exercises[idx];const ex={id:original?.id||slug(name)||uid(),name,group:String(f.get('group')),sets,min,max,rest,notes:String(f.get('notes')||''),unit:f.get('unit')==='sec'?'sec':'reps',optional:f.has('optional')};if(idx===null)p.exercises.push(ex);else p.exercises[idx]=ex;queueSave();modalClose();render();toast(idx===null?'Exercise added to your plan.':'Exercise updated.');}
function csvCell(x){const text=String(x??'');const safe=/^[=+\-@\t\r]/.test(text)?"'"+text:text;return '"'+safe.replace(/"/g,'""')+'"';}
function exportCSV(){const headings=['date','workout','exercise','muscle','set_type','weight_kg','reps_or_seconds','unit','RIR','completed_at','session_notes'];const rows=[headings];for(const h of state.history){for(const set of h.sets||[]){rows.push([h.date,h.name,set.name,set.group,set.type,set.weight,set.reps,set.unit||'reps',set.rir,set.completedAt||'',h.notes||'']);}}
 const text=rows.map(row=>row.map(csvCell).join(',')).join('\r\n');const blob=new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='fittrack-sets-'+localDate()+'.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('Workout CSV export started. Weights exported in kilograms.');}
function exportBackup(){const backup={...state,exportedAt:new Date().toISOString(),app:'FitTrack v1'};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`fittrack-backup-${localDate()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);toast('JSON backup download started.');}
async function importBackup(file){if(!file)return;try{if(file.size>20*1024*1024)throw new Error('Backup file is too large');const content=await file.text();const parsed=JSON.parse(content);const validated=validateState(parsed);if(!confirm(`Restore backup containing ${validated.history.length} completed workouts? This replaces your current plans, draft, and history.`))return;state=validated;ui.selectedPlan=state.plan[0]?.id||'push-a';await immediateSave();go('home');toast('Workout history and plan restored.');}catch(e){console.error(e);toast('Backup could not be restored. Check that it is a FitTrack JSON file.',true);}finally{$('#restoreFile').value='';}}
function resetApp(){if(!confirm('This will permanently erase your local workout history, plans and active session. Have you exported a backup?'))return;if(!confirm('Confirm again: erase all local FitTrack data?'))return;state=emptyState();ui.selectedPlan='push-a';stopRest();immediateSave();go('home');toast('Local FitTrack data reset.');}
async function durableStorage(){try{if(!navigator.storage?.persist){toast('Persistent storage is unavailable in this browser.',true);return;}const granted=await navigator.storage.persist();toast(granted?'Persistent storage granted on this browser.':'Browser did not grant persistence. Keep exporting backups.',!granted);}catch{toast('Persistent storage could not be requested.',true);}}
function installApp(){if(ui.installPrompt){const p=ui.installPrompt;ui.installPrompt=null;p.prompt();p.userChoice.then(c=>toast(c.outcome==='accepted'?'Install accepted!':'Use your browser menu to install later.'));return;}modalOpen(`<h2>Add FitTrack to your phone</h2><p>To install and get reliable offline use, first host this folder as an HTTPS website (for example via GitHub Pages).</p><div class="alert"><strong>Android Chrome:</strong> open your hosted URL → ⋮ menu → Install app or Add to Home screen.</div><div class="alert"><strong>iPhone Safari:</strong> open your hosted URL → Share → Add to Home Screen.</div><p>Opening an HTML file directly from Downloads is useful for a preview, but app installation and storage may not work reliably that way.</p><div class="modal-footer"><button class="btn" data-action="close-modal">Got it</button></div>`);}
function toggleArrayValue(obj,key,item,checked){const a=Array.isArray(obj[key])?obj[key]:[];obj[key]=checked?Array.from(new Set([...a,item])):a.filter(x=>x!==item);queueSave();render();}
function act(button){const action=button.dataset.action;const exIndex=Number(button.dataset.ex),setIndex=Number(button.dataset.set);switch(action){
  case 'open-media':{ui.mediaStage=button.dataset.stage||'warmup';ui.mediaType=button.dataset.type||getPlan(ui.selectedPlan)?.type||'push';ui.activeVideo='';go('media');return;}
  case 'media-stage':ui.mediaStage=button.dataset.stage||'warmup';ui.activeVideo='';render();return;
  case 'media-type':ui.mediaType=button.dataset.type||'push';ui.activeVideo='';render();return;
  case 'play-reviewed-video':{const id=button.dataset.id;ui.activeVideo=ui.activeVideo==='reviewed-'+id?'':'reviewed-'+id;render();document.getElementById('featuredExerciseVideo')?.scrollIntoView({block:'center'});return;}
  case 'play-media':ui.activeVideo=ui.activeVideo===button.dataset.key?'':button.dataset.key;render();return;
  case 'save-media-custom':{const value=($('#personal-video-input')?.value||'').trim(),url=safeExerciseVideo(value),key=button.dataset.key;
 if(!url){toast('Please enter a working HTTPS video or exercise reference URL.',true);return;}
 state.videoLinks=state.videoLinks||{};state.videoLinks[key]=url;ui.activeVideo='';queueSave();render();toast('Video reference saved in this browser.');return;}
  case 'report-video':{const key=button.dataset.key;if(state.videoLinks)delete state.videoLinks[key];ui.activeVideo='';queueSave();render();toast('Broken link removed. Choose a different source.');return;}
  case 'clear-media-custom':{if(state.videoLinks)delete state.videoLinks[button.dataset.key];ui.activeVideo='';queueSave();render();toast('Personal video removed.');return;}
  case 'save-video-link':{const value=($('#customVideoUrl')?.value||'').trim();if(!value){toast('Paste a video URL to save it.',true);return;}try{const u=new URL(value);if(!safeExerciseVideo(u.href))throw Error('Use a valid HTTPS reference URL');state.videoLinks=state.videoLinks||{};state.videoLinks[ui.guideId]=u.href;ui.activeVideo=ui.guideId;queueSave();render();toast('Technique video link saved.');}catch{toast('Enter a valid https:// video link.',true);}return;}
  case 'clear-video-link':{if(state.videoLinks)delete state.videoLinks[ui.guideId];queueSave();render();toast('Saved video link removed.');return;}
  case 'show-reference-media':{state.mediaOverrides=state.mediaOverrides||{};state.mediaOverrides[button.dataset.guide]=true;delete state.mediaOverrides['hidden:'+button.dataset.guide];queueSave();render();return;}
 case 'hide-reference-media':{state.mediaOverrides=state.mediaOverrides||{};state.mediaOverrides[button.dataset.guide]=false;state.mediaOverrides['hidden:'+button.dataset.guide]=true;queueSave();render();return;}
 case 'open-guide':goGuide(button.dataset.guide,ui.view);return;
  case 'return-guide':guideReturn();return;
  case 'go-active-exercise':ui.guideId=button.dataset.guide;guideReturn();return;
  case 'guide-filter':ui.libraryGroup=LIBRARY_TABS.includes(button.dataset.group)?button.dataset.group:'All';render();return;
  case 'choose-week-day':{const id=calendarMap[Number(button.dataset.day)];if(!id){go('home');setTimeout(()=>$('#mobilityAnchor')?.scrollIntoView({behavior:'smooth'}),100);return;}ui.selectedPlan=id;go('plan');return;}
  case 'scroll-mobility':$('#mobilityAnchor')?.scrollIntoView({behavior:'smooth'});return;
  case 'choose-plan':ui.selectedPlan=button.dataset.plan;go('plan');return;
  case 'preview-today':ui.selectedPlan=todayPlan()||'push-a';go('plan');return;
  case 'start-workout':startWorkout(button.dataset.plan);return;
  case 'copy-previous-set':{
 const ex=state.draft?.exercises[exIndex],set=ex?.sets[setIndex];if(!set)return;
 const sameTypeIndex=ex.sets.slice(0,setIndex+1).filter(v=>v.type===set.type).length-1;
 const prior=getLastSets(ex.exerciseId).filter(v=>v.type===set.type)[sameTypeIndex];
 if(!prior){toast('No previous set available for this exercise.',true);return;}
 set.weight=num(prior.weight);set.reps=num(prior.reps);set.rir=num(prior.rir,2);queueSave();render();toast('Previous set copied. Check your form and reps before marking done.');return;}
  case 'next-incomplete':{
 const i=state.draft?.exercises.findIndex(ex=>!ex.optional&&ex.sets.some(set=>set.type==='working'&&!set.done))??-1;
 if(i<0){toast('All planned working sets are completed.');return;}
 const el=document.getElementById('exercise-'+i);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('next-exercise-focus');setTimeout(()=>el.classList.remove('next-exercise-focus'),1700);}return;
 }
 case 'toggle-set':setDone(exIndex,setIndex);return;
  case 'cycle-set-type':setType(exIndex,setIndex);return;
  case 'add-set':addSet(exIndex,button.dataset.type);return;
  case 'remove-set':removeSet(exIndex);return;
  case 'finish-workout':finishWorkout();return;
  case 'discard-workout':if(confirm('Discard your unfinished session? It will not appear in history.')){state.draft=null;stopRest();immediateSave();go('home');toast('Session discarded.');}return;
  case 'manual-rest':startRest(num(button.dataset.seconds,90));return;
  case 'stop-rest':stopRest();return;
  case 'add-rest':ui.restEnd+=30000;state.restEndsAt=ui.restEnd;queueSave();renderTimer();return;
  case 'add-exercise':exerciseModal();return;
  case 'edit-exercise':exerciseModal(Number(button.dataset.index));return;
  case 'delete-exercise':{const p=getPlan(ui.selectedPlan);const i=Number(button.dataset.index);if(p&&p.exercises[i]&&confirm(`Remove ${p.exercises[i].name} from this plan? Past logs stay unchanged.`)){p.exercises.splice(i,1);queueSave();render();}return;}
  case 'move-exercise':{const p=getPlan(ui.selectedPlan);const i=Number(button.dataset.index),next=i+Number(button.dataset.dir);if(p && next>=0 && next<p.exercises.length){[p.exercises[i],p.exercises[next]]=[p.exercises[next],p.exercises[i]];queueSave();render();}return;}
  case 'delete-history':{const h=state.history.find(h=>h.id===button.dataset.history);if(h&&confirm(`Delete your completed ${h.name} workout from ${datePrettyKey(h.date)}?`)){state.history=state.history.filter(x=>x.id!==h.id);queueSave();render();toast('Workout deleted.');}return;}
  case 'close-modal':modalClose();return;
  case 'export-data':exportBackup();return;
  case 'export-csv':exportCSV();return;
  case 'import-data':$('#restoreFile').click();return;
  case 'install-pwa':installApp();return;
  case 'persistent-storage':durableStorage();return;
  case 'reset-data':resetApp();return;
}}
function initEvents(){document.addEventListener('click',e=>{const nav=e.target.closest('[data-nav]');if(nav){go(nav.dataset.nav);return;}const action=e.target.closest('[data-action]');if(!action||action.matches('input,select,textarea'))return;act(action);});
  document.addEventListener('focusin',e=>{
    const el=e.target;
    if(el.matches?.('input[data-field="weight"],input[data-field="reps"]')){
      try{el.select();}catch{}
    }
  });
  document.addEventListener('input',e=>{const el=e.target;if(el.matches('[data-field]')){const s=state.draft?.exercises[Number(el.dataset.ex)]?.sets[Number(el.dataset.set)];if(!s)return;const field=el.dataset.field;const raw=el.value.trim();
if(field==='weight')s[field]=raw===''?'':/^(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)$/.test(raw)?weightToKg(raw):raw;
else s[field]=raw;
queueSave();}else if(el.id==='librarySearch'){ui.libraryQuery=el.value;renderLibraryList();}else if(el.id==='sessionNotes'&&state.draft){state.draft.notes=el.value;queueSave();}});
  document.addEventListener('change',e=>{const el=e.target;if(['check-warmup','check-phase'].includes(el.dataset.action)){toggleArrayValue(state.checklists,el.dataset.key,el.dataset.id,el.checked);}else if(el.dataset.action==='check-mobility'){toggleArrayValue(state.mobility,el.dataset.key,el.dataset.id,el.checked);}else if(el.dataset.action==='trend-exercise'){ui.trendExercise=el.value;render();}else if(el.dataset.action==='setting-rest'){state.settings.autoRest=el.checked;queueSave();render();}else if(el.dataset.action==='setting-weight-unit'){state.settings.weightUnit=el.value==='lb'?'lb':'kg';queueSave();render();}else if(['checkin-energy','checkin-soreness'].includes(el.dataset.action)&&state.draft){state.draft.checkin=state.draft.checkin||{};state.draft.checkin[el.dataset.action==='checkin-energy'?'energy':'soreness']=el.value;queueSave();}else if(el.dataset.action==='setting-text-size'){state.settings.largeText=el.checked;queueSave();render();}else if(el.dataset.action==='setting-contrast'){state.settings.highContrast=el.checked;queueSave();render();}else if(el.matches('select[data-field]')){const s=state.draft?.exercises[Number(el.dataset.ex)]?.sets[Number(el.dataset.set)];if(s){s[el.dataset.field]=el.value;queueSave();}}});
  document.addEventListener('toggle',e=>{if(e.target.id==='prepDetails'&&document.contains(e.target))ui.prepOpen=e.target.open;},true);
  document.addEventListener('submit',e=>{if(e.target.id==='exerciseForm'){e.preventDefault();saveExerciseForm(e.target);}});
  $('#restoreFile').addEventListener('change',e=>importBackup(e.target.files?.[0]));
  $('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))modalClose();});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();ui.installPrompt=e;});
  window.addEventListener('pagehide',()=>{if(ui.saveTimer)persistNow();});
  window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(v.startsWith('guide/')){ui.guideId=decodeURIComponent(v.slice(6));ui.view='guide';render();return;}if(['home','session','plan','progress','settings','library','media'].includes(v)){ui.view=v;render();}});
  setInterval(()=>{if(state.draft){const el=$('#elapsedClock');if(el)el.textContent=formatTime((Date.now()-new Date(state.draft.startedAt).getTime())/1000);}},30000);
}
async function boot(){initEvents();try{await loadState();}catch(e){console.error(e);ui.storageMode='memory';}const hash=location.hash.replace('#','');ui.view=hash.startsWith('guide/')?'guide':(['home','session','plan','progress','settings','library','media'].includes(hash)?hash:'home');if(hash.startsWith('guide/'))ui.guideId=decodeURIComponent(hash.slice(6));ui.selectedPlan=state.plan[0]?.id||'push-a';if(state.restEndsAt>Date.now()){ui.restEnd=state.restEndsAt;ui.restInterval=setInterval(renderTimer,1000);}else{state.restEndsAt=0;}render();if('serviceWorker' in navigator&&location.protocol!=='file:'&&location.hostname!==''){navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Offline registration unavailable',err));}if(ui.storageMode==='memory')toast('Browser storage disabled — backup your data.',true);}
boot();
