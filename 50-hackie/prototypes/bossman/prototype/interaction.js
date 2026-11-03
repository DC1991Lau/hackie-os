/* ============================================================
   INTERACTION — gestures, physics and state.
   Gesture model v2: docs/decisions/2026-11-03-modelo-de-gestos.md
   Content comes from ui.js (window.OrbUI).
   ============================================================ */
(() => {
const UI=window.OrbUI;
const $ = s => document.querySelector(s);
const device=$('#device'), app=$('#app'), bg=$('#bg'), pager=$('#pager'), track=$('#track'), dotsEl=$('#dots');
const orb=$('#orb'), orbWrap=$('#orbWrap'), storiesBtn=$('#storiesBtn'), nbBtn=$('#nbBtn');
const live=$('#live');
const chat=$('#chat'), chatInner=$('#chatInner'), answer=$('#answer'), ansBody=$('#ansBody'), composer=$('#composer'), input=$('#chatInput');
const scrim=$('#scrim'), sheet=$('#sheet'), sClose=$('#sClose'), sheetBody=$('#sheetBody'), sheetInner=$('#sheetInner'), grab=$('#grab');
const storiesEl=$('#stories');
const notebook=$('#notebook'),nbBody=$('#nbBody'),nbInner=$('#nbInner'),nbGrid=$('#nbGrid'),nbClose=$('#nbClose'),nbEdit=$('#nbEdit');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let W=0,H=0;

/* ---------- gesture zones (D10, D11) ---------- */
const EDGE={top:24,side:24,bottom:34};   // reserved for the OS: drags starting here are ignored (taps still work)
const local=(x,y)=>{const r=device.getBoundingClientRect();return[x-r.left,y-r.top];};
const inSystemEdge=(x,y)=>{const[lx,ly]=local(x,y);return ly<EDGE.top||lx<EDGE.side||lx>W-EDGE.side||ly>H-EDGE.bottom;};
const inTopThird=(x,y)=>local(x,y)[1]<H/3;        // stories start zone
const inBottomThird=(x,y)=>local(x,y)[1]>H*2/3;   // notebook start zone

/* ---------- physics ---------- */
function spring({from,to,velocity=0,stiffness=320,damping=34,rest=[0.4,6],onUpdate,onDone}){
  let x=from,v=velocity,last=performance.now(),id=0,stopped=false;
  if(reduce){onUpdate(to);onDone&&onDone();return{stop(){}};}
  const step=now=>{
    if(stopped)return;
    const dt=Math.min(0.05,(now-last)/1000);last=now;
    const n=Math.max(1,Math.ceil(dt/0.004)),h=dt/n;
    for(let i=0;i<n;i++){const a=-stiffness*(x-to)-damping*v;v+=a*h;x+=v*h;}
    if(Math.abs(x-to)<rest[0]&&Math.abs(v)<rest[1]){onUpdate(to);onDone&&onDone();return;}
    onUpdate(x);id=requestAnimationFrame(step);
  };
  id=requestAnimationFrame(step);
  return{stop(){stopped=true;cancelAnimationFrame(id);}};
}
const rubber=(d,dim)=>Math.sign(d)*(1-1/(Math.abs(d)*0.55/dim+1))*dim;

function gesture(el,o){
  let s=null;
  el.addEventListener('pointerdown',e=>{
    if(e.button>0||s)return;
    if(o.shouldStart&&o.shouldStart(e)===false)return;
    s={id:e.pointerId,x0:e.clientX,y0:e.clientY,lx:e.clientX,ly:e.clientY,axis:null,target:e.target,pressed:false,pts:[]};
    s.pts.push([e.clientX,e.clientY,e.timeStamp]);
    try{el.setPointerCapture(e.pointerId);}catch(_){}
    o.onDown&&o.onDown(s);
    if(o.onPress){const me=s;s.timer=setTimeout(()=>{if(s===me&&!me.axis&&!me.pressed){me.pressed=true;o.onPress(me);}},o.pressDelay||200);}
  });
  el.addEventListener('pointermove',e=>{
    if(!s||e.pointerId!==s.id)return;
    const dx=e.clientX-s.x0,dy=e.clientY-s.y0,ddx=e.clientX-s.lx,ddy=e.clientY-s.ly;
    s.lx=e.clientX;s.ly=e.clientY;
    s.pts.push([e.clientX,e.clientY,e.timeStamp]);
    while(s.pts.length>2&&e.timeStamp-s.pts[0][2]>90)s.pts.shift();
    if(!s.axis){
      if(Math.hypot(dx,dy)<8)return;
      s.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
      clearTimeout(s.timer);
      if(o.onAxis&&o.onAxis(s.axis,dx,dy,s)===false)s.axis='none';
    }
    if(s.axis!=='none'&&o.onMove)o.onMove({dx,dy,ddx,ddy,axis:s.axis},s);
  });
  const end=e=>{
    if(!s||e.pointerId!==s.id)return;
    clearTimeout(s.timer);
    const st=s;s=null;
    const a=st.pts[0],b=st.pts[st.pts.length-1],dt=Math.max(1,b[2]-a[2])/1000;
    const vx=(b[0]-a[0])/dt,vy=(b[1]-a[1])/dt;
    o.onUp&&o.onUp(st);
    if(st.pressed&&o.onPressEnd)o.onPressEnd(st);
    if(!st.axis){if(!st.pressed&&e.type==='pointerup'&&o.onTap)o.onTap(st.target,e,st);return;}
    if(st.axis==='none')return;
    o.onEnd&&o.onEnd({dx:e.clientX-st.x0,dy:e.clientY-st.y0,vx,vy,axis:st.axis},st);
  };
  el.addEventListener('pointerup',end);
  el.addEventListener('pointercancel',end);
}
// keyboard activation of a <button> arrives as a click with detail 0; pointer taps go through gesture()
const onKeyClick=(el,fn)=>el.addEventListener('click',e=>{if(e.detail===0)fn(e);});

/* ---------- views ---------- */
track.innerHTML=UI.views.map(v=>`<section class="view">${v}</section>`).join('');
track.querySelectorAll('.c').forEach(c=>{c.setAttribute('role','button');c.tabIndex=0;if(!c.hasAttribute('aria-label'))c.setAttribute('aria-label','Abrir componente');});
const views=[...track.children],N=views.length;
dotsEl.innerHTML=views.map((_,i)=>`<button type="button" aria-label="View ${i+1}"><i></i></button>`).join('');
const dotBtns=[...dotsEl.children],dots=dotBtns.map(b=>b.firstElementChild);
dotsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(b)pagerTo(dotBtns.indexOf(b));});

/* ---------- shared app transform ---------- */
let sheetK=0;
const pg={index:0,x:0,base:0,start:0,anim:null};
const st={open:0,pull:0,dragY:0,closing:false,g:0,seg:[],elapsed:0,cubeX:0,paused:false,dragging:false,cubeAnim:null,dAnim:null,pAnim:null};
const nb={p:0,open:false,anim:null,scroll:0,pull:0,mode:null,mom:0,lift:null,edit:false};
function renderApp(){
  const stK=Math.min(st.open,1)*(1-Math.min(st.dragY/(H*0.7),1));
  const n=Math.min(nb.p,1);
  const s=(1-0.07*sheetK-0.08*stK)*(1-0.08*n);
  app.style.transform=`translate3d(0,${st.pull*0.3+sheetK*8-n*70}px,0) scale(${s})`;
  app.style.opacity=1-n;
  app.style.borderRadius=(sheetK>0.005||stK>0.005||st.pull>0||n>0.005)?'var(--app-r)':'';
  notebook.style.visibility=nb.p<=0.001?'hidden':'visible';
  notebook.style.transform=`translate3d(0,${(1-n)*H*0.3+sheetK*8}px,0) scale(${(0.94+0.06*n)*(1-0.07*sheetK)})`;
  notebook.style.opacity=n;
  notebook.classList.toggle('live',nb.open);
  // D7: the orb stays over the sheet; it hides only for stories (unless the conversation was opened from a story)
  const hide=device.classList.contains('chat-top')?0:stK;
  orbWrap.style.transform=`translate3d(-50%,${hide*150}px,0)`;
  orbWrap.style.opacity=1-hide;
  dotsEl.style.opacity=1-Math.max(sheetK,stK);
  storiesBtn.style.setProperty('--pull',Math.min(st.pull,200)*0.35+'px');
}

/* ---------- pager ---------- */
function renderPager(){
  track.style.transform=`translate3d(${pg.x}px,0,0)`;
  const pos=-pg.x/(W||1);
  views.forEach((v,i)=>{const o=i-pos;v.style.setProperty('--o',o.toFixed(4));v.style.setProperty('--ao',Math.min(1,Math.abs(o)).toFixed(4));v.style.visibility=Math.abs(o)>1.05?'hidden':'visible';});
  bg.style.transform=`translate3d(${-pos*14}px,0,0)`;
  dots.forEach((d,i)=>{const a=Math.max(0,1-Math.abs(i-pos));d.style.width=(6+14*a)+'px';d.style.opacity=.3+.7*a;});
}
function setCurrentView(t){
  views.forEach((vw,i)=>vw.inert=i!==t);
  dotBtns.forEach((b,i)=>b.toggleAttribute('aria-current',i===t));
}
function pagerTo(t,v=0){
  pg.index=t;pg.anim&&pg.anim.stop();setCurrentView(t);
  pg.anim=spring({from:pg.x,to:-t*W,velocity:v,stiffness:300,damping:33,onUpdate:x=>{pg.x=x;renderPager();},onDone:()=>pg.anim=null});
}
let pressed=null;
const PULL=260;
gesture(pager,{
  onDown(s){pg.anim&&pg.anim.stop();pg.anim=null;pressed=s.target.closest('.c');pressed&&pressed.classList.add('press');},
  onUp(s){
    pressed&&pressed.classList.remove('press');pressed=null;
    // a stopped page animation must still land if this drag was rejected
    if(s.axis!=='x'&&!pg.anim&&Math.abs(pg.x+pg.index*W)>0.5)pagerTo(pg.index);
  },
  onAxis(axis,dx,dy,s){
    pressed&&pressed.classList.remove('press');
    if(inSystemEdge(s.x0,s.y0))return false;                         // D11
    if(axis==='x'){pg.base=pg.x;pg.start=Math.round(-pg.x/W);return true;}
    if(dy>0){                                                         // D10: stories from the top third
      if(!inTopThird(s.x0,s.y0))return false;
      st.pAnim&&st.pAnim.stop();resetStoriesState();pg.v='stories';return true;
    }
    if(!inBottomThird(s.x0,s.y0))return false;                        // D10 + D4: notebook from the bottom third, any view
    if(Math.abs(pg.x+pg.index*W)>1)return false;
    nb.anim&&nb.anim.stop();pg.v='nb';return true;
  },
  onMove({dx,dy,axis}){
    if(axis==='x'){
      let x=pg.base+dx;const min=-(N-1)*W;
      if(x>0)x=rubber(x,W);else if(x<min)x=min-rubber(min-x,W);
      pg.x=x;renderPager();
    }else if(pg.v==='nb'){
      const u=Math.max(0,-dy);nb.p=Math.min(1,u/NBD());renderApp();
    }else{
      const d=Math.max(0,dy);
      st.pull=d<PULL?d:PULL+(d-PULL)*0.3;
      st.open=Math.min(st.pull/PULL,1);
      renderStories();
    }
  },
  onEnd({vx,vy,axis}){
    if(axis==='x'){
      const proj=-(pg.x+vx*0.2)/W;
      pagerTo(clamp(Math.round(proj),Math.max(0,pg.start-1),Math.min(N-1,pg.start+1)),vx);
    }else if(pg.v==='nb'){
      nbTo(nb.p>0.35||vy<-700?1:0,-vy/NBD());
    }else{
      const open=st.pull>PULL*0.42||vy>700;
      pullStories(open,vy);
    }
  },
  onTap(target){const c=target.closest('.c');if(c)openSheet(c.dataset.accent,c);}
});
storiesBtn.addEventListener('click',()=>openStories(storiesBtn));
nbBtn.addEventListener('click',()=>{nbOrigin=nbBtn;nbTo(1);});

/* ---------- bottom sheet ---------- */
const sh={ty:0,scroll:0,anim:null,mom:0,mode:'sheet',state:'closed',from:'closed'};
let FULL=0,HALF=0,CLOSED=0,sheetOrigin=null;
function sheetGeom(){FULL=0;HALF=H*0.5;CLOSED=H+30;}
const maxScroll=()=>Math.max(0,sheetInner.offsetHeight-sheetBody.clientHeight);
function renderSheet(){
  sheet.style.transform=`translate3d(0,${sh.ty}px,0)`;
  const f=clamp((HALF-sh.ty)/(HALF-FULL||1),0,1),m=8*(1-f);
  sheet.style.left=sheet.style.right=m+'px';
  sheet.style.height=(H-m)+'px';
  sheet.style.borderRadius=(34*(1-f))+'px';
  sheet.style.setProperty('--f',f.toFixed(3));
  grab.style.opacity=1-f;
  sheetInner.style.transform=`translate3d(0,${-sh.scroll}px,0)`;
  const k1=clamp((CLOSED-sh.ty)/(CLOSED-HALF||1),0,1),k2=clamp((HALF-sh.ty)/(HALF-FULL||1),0,1);
  sheetK=k1*0.6+k2*0.4;
  scrim.style.opacity=k1*0.7+k2*0.3;
  sheet.style.visibility=sh.ty>=CLOSED-1?'hidden':'visible';
  renderApp();
}
function sheetTo(to,v=0){
  sh.anim&&sh.anim.stop();cancelAnimationFrame(sh.mom);
  const wasOpen=sh.state!=='closed';
  sh.state=to===FULL?'full':to===HALF?'half':'closed';
  scrim.classList.toggle('on',to!==CLOSED);
  // keep keyboard focus inside the open sheet; the orb stays usable (D7)
  notebook.inert=to!==CLOSED;
  app.inert=to!==CLOSED||nb.open;
  if(to===CLOSED&&wasOpen&&sheetOrigin){sheetOrigin.focus({preventScroll:true});sheetOrigin=null;}
  sh.anim=spring({from:sh.ty,to,velocity:v,stiffness:380,damping:36,onUpdate:y=>{sh.ty=y;renderSheet();},
    onDone:()=>{sh.anim=null;if(to===CLOSED)sh.scroll=0;}});
}
function openSheet(acc,origin){
  sheetInner.innerHTML=UI.sheet(acc);
  sheetOrigin=origin||null;
  sh.scroll=0;sh.ty=CLOSED;renderSheet();sheetTo(HALF);
  setTimeout(()=>sheet.focus({preventScroll:true}),60);  // the sheet is visibility:hidden until the spring's first frame
}
const closeSheet=()=>sheetTo(CLOSED);
// the close button: full -> half (D5), half -> closed
const sheetCloseStep=()=>sh.state==='full'?sheetTo(HALF):closeSheet();
const toggleSheetSize=()=>sheetTo(sh.state==='full'?HALF:FULL);
scrim.addEventListener('click',closeSheet);
onKeyClick(sClose,sheetCloseStep);
function momentum(v){
  cancelAnimationFrame(sh.mom);let last=performance.now();const max=maxScroll();
  const f=now=>{const dt=Math.min(32,now-last);last=now;sh.scroll+=v*dt/1000;v*=Math.pow(0.996,dt);
    if(sh.scroll<0){sh.scroll=0;v=0;}if(sh.scroll>max){sh.scroll=max;v=0;}
    renderSheet();if(Math.abs(v)>15&&!reduce)sh.mom=requestAnimationFrame(f);};
  sh.mom=requestAnimationFrame(f);
}
gesture(sheet,{
  onDown(){sh.anim&&sh.anim.stop();sh.anim=null;cancelAnimationFrame(sh.mom);sh.from=sh.state;},
  onAxis:axis=>axis==='y',
  onMove({ddy}){
    let d=ddy;const max=maxScroll();
    if(d<0){
      if(sh.ty>FULL){const use=Math.max(d,FULL-sh.ty);sh.ty+=use;d-=use;sh.mode='sheet';}
      if(d<0&&sh.scroll<max){sh.scroll=Math.min(max,sh.scroll-d);sh.mode='scroll';}
    }else if(d>0){
      if(sh.scroll>0){const use=Math.min(d,sh.scroll);sh.scroll-=use;d-=use;sh.mode='scroll';}
      if(d>0){sh.ty+=d;sh.mode='sheet';}
    }
    renderSheet();
  },
  onEnd({vy}){
    if(sh.mode==='scroll'&&sh.ty<=FULL+0.5){sh.state='full';momentum(-vy);return;}
    const proj=sh.ty+vy*0.2;
    let to=[FULL,HALF,CLOSED].reduce((a,c)=>Math.abs(c-proj)<Math.abs(a-proj)?c:a);
    if(sh.from==='full'&&to===CLOSED)to=HALF;   // D5: from full screen, a swipe down stops at half
    sheetTo(to,clamp(vy,-3000,3000));            // a hard flick must not throw the sheet off screen before it settles
  },
  onTap(target){
    if(target.closest('.close'))sheetCloseStep();
    else if(target.closest('.grab'))toggleSheetSize();   // D12: tap the handle instead of dragging
  }
});

/* ---------- conversation ---------- */
let chatOpen=false,ansT=0;
function openChat(){
  if(chatOpen)return;chatOpen=true;
  answer.classList.remove('show');ansBody.innerHTML='';answer.style.height='';
  device.classList.add('chat-open');renderApp();
  input.value='';input.focus({preventScroll:true});
}
function closeChat(){
  if(!chatOpen)return;chatOpen=false;input.blur();clearTimeout(ansT);orb.classList.remove('think');
  chatInner.style.transform='';chatInner.style.transition='';chat.firstElementChild.style.opacity='';
  answer.classList.remove('show');
  device.classList.remove('chat-open');
  if(device.classList.contains('chat-top')){device.classList.remove('chat-top');st.paused=false;}
  renderApp();
}
function openChatFromStory(){st.paused=true;device.classList.add('chat-top');openChat();}
orb.addEventListener('click',()=>chatOpen?closeChat():openChat());
// D2: the card keeps the session's turns; it grows to its max height, then scrolls
function updateAnswer(mutate){
  const shown=answer.classList.contains('show'),from=answer.offsetHeight;
  mutate();
  const to=Math.min(ansBody.offsetHeight+3,H-210);
  if(shown){answer.style.height=from+'px';void answer.offsetHeight;}
  answer.style.height=to+'px';
  answer.classList.add('show');
  answer.scrollTop=answer.scrollHeight;
}
composer.addEventListener('submit',e=>{
  e.preventDefault();
  const len=input.value.trim().length;
  input.value='';clearTimeout(ansT);orb.classList.add('think');
  live.textContent='A pensar…';
  const turn=document.createElement('div');turn.className='turn';
  updateAnswer(()=>{ansBody.querySelector('.turn:last-child .typing')?.remove();turn.innerHTML=UI.answer.ask(len)+UI.answer.typing();ansBody.append(turn);});
  ansT=setTimeout(()=>{
    orb.classList.remove('think');
    live.textContent='Resposta pronta.';
    updateAnswer(()=>{turn.querySelector('.typing')?.remove();turn.insertAdjacentHTML('beforeend',UI.answer.reply());});
  },1100);
});
function saveAnswer(btn){
  if(btn.classList.contains('done'))return;
  btn.classList.add('done');btn.setAttribute('aria-label','Guardado no notebook');
  nbGrid.insertAdjacentHTML('afterbegin',nbCardHTML(1));
  live.textContent='Guardado no notebook.';
}
answer.addEventListener('click',e=>{const s=e.target.closest('[data-act="save"]');if(s)saveAnswer(s);});
gesture(chat,{
  // a scrollable card scrolls natively; swipe-down-to-close works outside it
  shouldStart:e=>chatOpen&&!e.target.closest('.composer')&&!(e.target.closest('.answer')&&answer.scrollHeight>answer.clientHeight+1),
  onAxis:(axis,dx,dy)=>axis==='y'&&dy>0,
  onMove({dy}){const y=Math.max(0,dy);chatInner.style.transition='none';chatInner.style.transform=`translate3d(0,${y}px,0)`;chat.firstElementChild.style.opacity=1-Math.min(y/400,0.8);},
  onEnd({dy,vy}){
    if(dy>110||vy>700){closeChat();return;}
    chatInner.style.transition='';chatInner.style.transform='';chat.firstElementChild.style.opacity='';
  },
  onTap(target){
    const s=target.closest('[data-act="save"]');
    if(s){saveAnswer(s);return;}
    if(!target.closest('.answer'))closeChat();
  }
});
if(window.visualViewport){
  const kb=()=>{const v=visualViewport;const k=chatOpen?Math.max(0,innerHeight-v.height-v.offsetTop):0;device.style.setProperty('--kb',k+'px');};
  visualViewport.addEventListener('resize',kb);visualViewport.addEventListener('scroll',kb);
}

/* ---------- stories ---------- */
const SEGS=UI.stories.groups,G=SEGS.length,DUR=4500;
let storiesOrigin=null;
storiesEl.innerHTML=SEGS.map((n,gi)=>`<div class="face">
  <div class="slides">${Array.from({length:n},(_,si)=>UI.stories.slide(gi,si)).join('')}</div>
  <div class="chrome"><div class="bars">${'<span><b></b></span>'.repeat(n)}</div>
    <div class="who"><button class="close" type="button" aria-label="Fechar stories"></button>${UI.stories.header(gi)}</div></div>
  <div class="foot"><button class="reply" type="button" aria-label="Perguntar ao orb sobre este story"></button><span class="ic"></span><span class="ic"></span></div>
  <div class="shade"></div></div>`).join('');
const faces=[...storiesEl.children];
function renderFace(i){
  const f=faces[i],seg=st.seg[i]||0;
  [...f.querySelectorAll('.slide')].forEach((s,j)=>s.classList.toggle('on',j===seg));
  [...f.querySelectorAll('.bars b')].forEach((bb,j)=>bb.style.width=j<seg?'100%':j>seg?'0%':(i===st.g?Math.min(100,st.elapsed/DUR*100):0)+'%');
}
function renderCube(){
  const pos=st.cubeX/(W||1);
  faces.forEach((f,i)=>{
    const o=i-pos;
    if(Math.abs(o)>=0.999){f.style.visibility='hidden';return;}
    f.style.visibility='visible';
    f.inert=Math.abs(o)>0.5;
    if(reduce){f.style.opacity=1-Math.abs(o);return;}  // reduced motion: cross-fade instead of the 3D cube
    f.style.transformOrigin=o<0?'100% 50%':'0% 50%';
    f.style.transform=`translate3d(${o*100}%,0,0) rotateY(${o*90}deg)`;
    f.lastElementChild.style.opacity=Math.abs(o)*0.7;
  });
}
function renderStories(){
  const p=Math.min(st.open,1),y=st.dragY;
  storiesEl.style.visibility=p<=0.001?'hidden':'visible';
  const scale=(0.9+0.1*p)*(1-Math.min(y/H,1)*0.3);
  storiesEl.style.transform=`translate3d(0,${(p-1)*70+y*0.9}px,0) scale(${scale})`;
  storiesEl.style.opacity=Math.min(1,p*1.6)*(1-clamp((y-H*0.3)/(H*0.5),0,1));
  storiesEl.style.borderRadius=(p<1||y>0)?'var(--app-r)':'0px';
  storiesEl.classList.toggle('live',p>=1&&!st.closing);
  renderApp();
}
function resetStoriesState(){
  st.g=0;st.seg=SEGS.map(()=>0);st.elapsed=0;st.cubeX=0;st.dragY=0;st.closing=false;st.paused=false;
  storiesEl.classList.remove('hold');renderCube();faces.forEach((_,i)=>renderFace(i));
}
function pullStories(open,v=0){
  st.pAnim&&st.pAnim.stop();
  st.pAnim=spring({from:st.pull,to:open?PULL:0,velocity:v,stiffness:280,damping:30,
    onUpdate:p=>{st.pull=p;st.open=Math.min(p/PULL,1);renderStories();},
    onDone:()=>{st.pull=0;st.open=open?1:0;renderStories();if(open)storiesEl.focus({preventScroll:true});}});
}
function openStories(origin){storiesOrigin=origin||null;resetStoriesState();pullStories(true);}
function closeStories(v=0){
  st.closing=true;st.dAnim&&st.dAnim.stop();
  st.dAnim=spring({from:st.dragY,to:H*1.1,velocity:Math.max(0,v),stiffness:200,damping:26,rest:[2,40],
    onUpdate:y=>{st.dragY=y;renderStories();},
    onDone:()=>{st.open=0;st.dragY=0;st.closing=false;renderStories();if(storiesOrigin){storiesOrigin.focus({preventScroll:true});storiesOrigin=null;}}});
}
function goGroup(t,v=0){
  st.g=t;st.elapsed=0;faces.forEach((_,i)=>renderFace(i));
  st.cubeAnim&&st.cubeAnim.stop();
  st.cubeAnim=spring({from:st.cubeX,to:t*W,velocity:v,stiffness:260,damping:32,onUpdate:x=>{st.cubeX=x;renderCube();},onDone:()=>st.cubeAnim=null});
}
function nextSeg(){
  const g=st.g;
  if(st.seg[g]<SEGS[g]-1){st.seg[g]++;st.elapsed=0;renderFace(g);}
  else if(g<G-1)goGroup(g+1);
  else closeStories();
}
function prevSeg(){
  const g=st.g;
  if(st.seg[g]>0){st.seg[g]--;st.elapsed=0;renderFace(g);}
  else if(g>0)goGroup(g-1);
  else{st.elapsed=0;renderFace(g);}
}
let cubeBase=0;
gesture(storiesEl,{
  shouldStart:()=>st.open>=1&&!st.closing,
  onDown(){st.dragging=true;},
  onUp(){st.dragging=false;},
  onPress(){st.paused=true;storiesEl.classList.add('hold');},
  onPressEnd(){st.paused=false;storiesEl.classList.remove('hold');},
  onAxis(axis,dx,dy,s){
    if(inSystemEdge(s.x0,s.y0))return false;   // D11
    if(axis==='x'){st.cubeAnim&&st.cubeAnim.stop();cubeBase=st.cubeX;return true;}
    return dy>0;
  },
  onMove({dx,dy,axis}){
    if(axis==='x'){
      let x=cubeBase-dx;const max=(G-1)*W;
      if(x<0)x=-rubber(-x,W);else if(x>max)x=max+rubber(x-max,W);
      st.cubeX=x;renderCube();
    }else{st.dragY=Math.max(0,dy);renderStories();}
  },
  onEnd({dx,dy,vx,vy,axis}){
    if(axis==='x'){
      let t=st.g;
      if(dx<-W*0.25||vx<-500)t++;else if(dx>W*0.25||vx>500)t--;
      t=clamp(t,0,G-1);
      if(t!==st.g)goGroup(t,-vx);
      else{st.cubeAnim=spring({from:st.cubeX,to:t*W,velocity:-vx,stiffness:260,damping:32,onUpdate:x=>{st.cubeX=x;renderCube();},onDone:()=>st.cubeAnim=null});}
    }else{
      if(dy>120||vy>800)closeStories(vy);
      else{st.dAnim&&st.dAnim.stop();st.dAnim=spring({from:st.dragY,to:0,velocity:vy,stiffness:340,damping:32,onUpdate:y=>{st.dragY=y;renderStories();}});}
    }
  },
  onTap(target,e){
    if(target.closest('.close')){closeStories();return;}
    if(target.closest('.reply')){openChatFromStory();return;}   // D6: ask the orb about this story
    const r=storiesEl.getBoundingClientRect();
    (e.clientX-r.left<r.width*0.3)?prevSeg():nextSeg();
  }
});
storiesEl.addEventListener('click',e=>{
  if(e.detail!==0)return;
  if(e.target.closest('.close'))closeStories();
  else if(e.target.closest('.reply'))openChatFromStory();
});
let lastT=performance.now();
(function tick(now){
  const dt=now-lastT;lastT=now;
  if(st.open>=1&&!st.closing&&!st.paused&&!st.dragging&&!st.cubeAnim&&st.dragY===0){
    st.elapsed+=dt;
    if(st.elapsed>=DUR)nextSeg();else renderFace(st.g);
  }
  requestAnimationFrame(tick);
})(lastT);

/* ---------- notebook ---------- */
const NBD=()=>H*0.42;
let nbOrigin=null;
const nbCardHTML=k=>`<div class="nb-card k${k}" role="button" tabindex="0" aria-label="Abrir cartão">${UI.notebook.card(k)}</div>`;
nbGrid.innerHTML=UI.notebook.cards.map(nbCardHTML).join('');
const nbMax=()=>Math.max(0,nbInner.offsetHeight-nbBody.clientHeight);
const renderNb=()=>{nbInner.style.transform=`translate3d(0,${-nb.scroll}px,0)`;};
function nbTo(t,v=0){
  nb.anim&&nb.anim.stop();nb.pull=0;
  if(t===0){nb.open=false;setEdit(false);}
  else nb.open=true;   // live from the first frame, so taps never fall through to the view behind
  app.inert=nb.open;
  nb.anim=spring({from:nb.p,to:t,velocity:v,stiffness:240,damping:28,rest:[0.002,0.02],
    onUpdate:p=>{nb.p=p;renderApp();},
    onDone:()=>{
      nb.anim=null;if(t===0){nb.scroll=0;renderNb();}renderApp();
      if(t===1&&nbOrigin)notebook.focus({preventScroll:true});
      if(t===0&&nbOrigin){nbOrigin.focus({preventScroll:true});nbOrigin=null;}
    }});
}
function setEdit(on){
  nb.edit=on;notebook.classList.toggle('editing',on);nbEdit.setAttribute('aria-pressed',on);
}
function flip(els,mutate,{dur=420,stagger=0,skip=null}={}){
  const first=new Map(els.map(e=>[e,e.getBoundingClientRect()]));
  mutate();
  els.forEach((e,i)=>{
    if(e===skip)return;
    const a=first.get(e),c=e.getBoundingClientRect();
    if(!c.width||!c.height)return;
    const dx=a.left-c.left,dy=a.top-c.top,sx=a.width/c.width,sy=a.height/c.height;
    if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5&&Math.abs(sx-1)<0.01&&Math.abs(sy-1)<0.01)return;
    e.animate([{transformOrigin:'0 0',transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`},{transformOrigin:'0 0',transform:'none'}],
      {duration:reduce?1:dur,delay:reduce?0:stagger*i,easing:'cubic-bezier(.2,.9,.25,1)',fill:'backwards'});
  });
}
function setLayout(l){
  if(nbGrid.dataset.l===l)return;
  flip([...nbGrid.children],()=>{nbGrid.className='nb-grid '+l;nbGrid.dataset.l=l;nb.scroll=Math.min(nb.scroll,nbMax());renderNb();},{stagger:12});
  document.querySelectorAll('[data-layout]').forEach(x=>x.classList.toggle('on',x.dataset.layout===l));
}
function liftCard(c,x,y){
  if(nb.lift)return;
  c.getAnimations().forEach(a=>a.finish());
  const r=c.getBoundingClientRect();
  nb.lift={el:c,gx:x-(r.left+r.width/2),gy:y-(r.top+r.height/2),tx:0,ty:0,over:null};
  c.classList.add('lift');
  try{navigator.vibrate&&navigator.vibrate(8);}catch(_){}   // Android only; iOS gets the visual lift
}
function placeLift(x,y){
  const L=nb.lift,r=L.el.getBoundingClientRect();
  const bx=r.left+r.width/2-L.tx,by=r.top+r.height/2-L.ty;
  L.tx=x-L.gx-bx;L.ty=y-L.gy-by;
  L.el.style.transform=`translate3d(${L.tx}px,${L.ty}px,0)`;
}
function moveLift(x,y){
  const L=nb.lift,c=L.el;placeLift(x,y);
  const cards=[...nbGrid.children];
  const over=cards.find(o=>{if(o===c)return false;const q=o.getBoundingClientRect();return x>q.left&&x<q.right&&y>q.top&&y<q.bottom;});
  if(!over){L.over=null;return;}
  if(over===L.over)return;
  L.over=over;
  const i=cards.indexOf(c),j=cards.indexOf(over);
  flip(cards,()=>{
    nbGrid.insertBefore(c,i<j?over.nextSibling:over);
  },{skip:c,dur:300});
  placeLift(x,y);
}
function dropLift(){
  const L=nb.lift;if(!L)return;nb.lift=null;
  const c=L.el;c.classList.remove('lift');c.style.transform='';
  c.animate([{transform:`translate3d(${L.tx}px,${L.ty}px,0)`},{transform:'none'}],{duration:reduce?1:380,easing:'cubic-bezier(.2,.9,.25,1)'});
}
function nbMomentum(v){
  cancelAnimationFrame(nb.mom);let last=performance.now();const max=nbMax();
  const f=now=>{const dt=Math.min(32,now-last);last=now;nb.scroll+=v*dt/1000;v*=Math.pow(0.996,dt);
    if(nb.scroll<0){nb.scroll=0;v=0;}if(nb.scroll>max){nb.scroll=max;v=0;}
    renderNb();if(Math.abs(v)>15&&!reduce)nb.mom=requestAnimationFrame(f);};
  nb.mom=requestAnimationFrame(f);
}
gesture(notebook,{
  pressDelay:400,   // D9
  shouldStart:()=>nb.open,
  onDown(s){
    cancelAnimationFrame(nb.mom);nb.mode=null;nb.pull=0;
    // D12 edit mode: a card lifts on touch, no long press needed
    const c=nb.edit&&s.target.closest('.nb-card');
    if(c){s.pressed=true;liftCard(c,s.x0,s.y0);}
  },
  onPress(s){const c=s.target.closest('.nb-card');if(c)liftCard(c,s.x0,s.y0);},
  onPressEnd(){dropLift();},
  onAxis(axis,dx,dy,s){
    if(nb.lift){nb.mode='reorder';return true;}
    if(inSystemEdge(s.x0,s.y0))return false;   // D11
    if(axis!=='y')return false;
    nb.mode='y';return true;
  },
  onMove({ddy},s){
    if(nb.mode==='reorder'){if(nb.lift)moveLift(s.lx,s.ly);return;}
    let d=ddy;const max=nbMax();
    if(d>0){
      if(nb.scroll>0){const u=Math.min(d,nb.scroll);nb.scroll-=u;d-=u;}
      if(d>0)nb.pull+=d;
    }else if(d<0){
      if(nb.pull>0){const u=Math.max(d,-nb.pull);nb.pull+=u;d-=u;}
      if(d<0&&nb.scroll<max)nb.scroll=Math.min(max,nb.scroll-d);
    }
    nb.p=1-nb.pull/NBD();renderNb();renderApp();
  },
  onEnd({vy}){
    if(nb.mode==='reorder')return;
    if(nb.pull>0){nbTo(nb.pull>110||vy>700?0:1,-vy/NBD());return;}
    nbMomentum(-vy);
  },
  onTap(target){
    const l=target.closest('[data-layout]');if(l){setLayout(l.dataset.layout);return;}
    if(target.closest('#nbClose')){nbTo(0);return;}
    if(target.closest('#nbEdit')){setEdit(!nb.edit);return;}
    const c=target.closest('.nb-card');
    if(c&&!nb.edit)openSheet('g1',c);
  }
});
onKeyClick(nbClose,()=>nbTo(0));
onKeyClick(nbEdit,()=>setEdit(!nb.edit));
document.querySelectorAll('[data-layout]').forEach(b=>onKeyClick(b,()=>setLayout(b.dataset.layout)));

/* ---------- keyboard ---------- */
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.c,.nb-card')){
    if(nb.edit&&e.target.matches('.nb-card'))return;
    e.preventDefault();openSheet(e.target.dataset.accent||'g1',e.target);return;
  }
  if((e.key==='Enter'||e.key===' ')&&e.target===grab){e.preventDefault();toggleSheetSize();return;}
  const idle=st.open<1&&!chatOpen&&sh.state==='closed'&&!nb.open;
  if(idle&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){pagerTo(clamp(pg.index+(e.key==='ArrowRight'?1:-1),0,N-1));return;}
  if(e.key!=='Escape')return;
  if(chatOpen)closeChat();else if(st.open>=1)closeStories();else if(sh.state!=='closed')closeSheet();else if(nb.open)nbTo(0);
});
device.addEventListener('contextmenu',e=>e.preventDefault());
// focus moves (Tab, scrollIntoView) can scroll overflow:hidden layers; all motion here is transforms, so pin them
[device,app,pager,sheet,sheetBody,notebook,nbBody,storiesEl].forEach(el=>el.addEventListener('scroll',()=>{el.scrollTop=0;el.scrollLeft=0;}));

function measure(){
  const r=device.getBoundingClientRect();W=r.width;H=r.height;
  sheetGeom();
  pg.anim&&pg.anim.stop();pg.x=-pg.index*W;renderPager();
  sh.ty=sh.state==='full'?FULL:sh.state==='half'?HALF:CLOSED;renderSheet();
  st.cubeX=st.g*W;renderCube();renderStories();
}
addEventListener('resize',measure);
resetStoriesState();
measure();
setCurrentView(0);
})();
