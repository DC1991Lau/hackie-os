/* ============================================================
   UI — content templates. Diogo's file: change freely.
   Everything here is markup only. interaction.js wires it up.

   Contract with interaction.js:
   - views[]          one HTML string per View. Tappable components need class "c";
                      data-accent is passed to sheet(). --d (0..1) = parallax depth.
   - sheet(accent)    HTML inside the bottom sheet.
   - stories.groups   number of slides per theme (one cube face per theme).
   - stories.slide()  HTML of one slide.  stories.header() HTML of the theme row.
   - notebook.cards   one entry per card; notebook.card(entry) returns its inner HTML.
   - answer.ask(len), answer.typing(), answer.reply()  pieces of the answer card.
   ============================================================ */
(() => {
const rnd=(a,b)=>Math.round(a+Math.random()*(b-a));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const b=(w,s)=>`<i class="b${s?' s':''}" style="width:${w}%"></i>`;
const card=(cls,acc,d,inner)=>`<div class="c ${cls}" data-accent="${acc}" style="--d:${d};--fd:${(d*3.1).toFixed(2)}s">${inner}</div>`;
const spark=()=>`<div class="spark">${[40,70,55,90,65].map(h=>`<i style="height:${h}%"></i>`).join('')}</div>`;
const ACC=['g1','g2','g3','g4'];

/* The 4 Views = 4 data patterns (docs/decisions/2026-11-03-views.md) */
const views=[
  // 1. Destaque
  card('hero','g1',.12,`<div class="art ph"></div><div class="rows">${b(55,1)}${b(80)}</div>`)+
  `<div class="grid2">${card('sq','g2',.4,`<span class="dot"></span><div class="rows" style="flex:none">${b(70,1)}${b(45)}</div>`)}${card('sq','g3',.58,`<span class="dot"></span><div class="rows" style="flex:none">${b(60,1)}${b(80)}</div>`)}</div>`+
  card('pill','g4',.85,`<span class="dot sm"></span><div class="rows">${b(55,1)}</div><span class="chev"></span>`),

  // 2. Lista
  `<div class="head">${b(42,1)}${b(24)}</div>`+
  [[62,40],[48,70],[70,35],[55,60],[40,52]].map((w,i)=>card('row',ACC[i%4],.15+i*.17,`<span class="dot"></span><div class="rows">${b(w[0],1)}${b(w[1])}</div><span class="chip"></span>`)).join(''),

  // 3. Mural
  `<div class="mason"><div class="col">${card('tall','g3',.15,`<div class="tile-art ph"></div><div class="rows">${b(75,1)}${b(50)}</div>`)}${card('short','g4',.5,`<div class="tile-art ph"></div><div class="rows">${b(60,1)}</div>`)}</div>`+
  `<div class="col">${card('short','g2',.3,`<div class="tile-art ph"></div><div class="rows">${b(65,1)}</div>`)}${card('tall','g1',.65,`<div class="tile-art ph"></div><div class="rows">${b(80,1)}${b(45)}</div>`)}</div></div>`+
  card('wide','g1',.9,`<span class="stack"><span style="background:var(--g1)"></span><span style="background:var(--g2)"></span><span style="background:var(--g3)"></span></span><div class="rows" style="margin-left:16px">${b(60,1)}${b(35)}</div>`),

  // 4. Indicadores
  card('ring','g3',.15,`<svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="54" style="stroke:var(--bone)"></circle>
    <circle cx="70" cy="70" r="54" style="stroke:var(--g1)" stroke-dasharray="120 400"></circle>
    <circle cx="70" cy="70" r="54" style="stroke:var(--g2)" stroke-dasharray="70 400" stroke-dashoffset="-136"></circle>
    <circle cx="70" cy="70" r="54" style="stroke:var(--g3)" stroke-dasharray="60 400" stroke-dashoffset="-222"></circle></svg>`)+
  `<div class="grid3">${['g4','g2','g1'].map((a,i)=>card('stat',a,.4+i*.2,`<div class="rows" style="flex:none">${b(70,1)}${b(45)}</div>${spark()}`)).join('')}</div>`+
  card('pill','g2',.95,`<span class="dot sm"></span><div class="rows">${b(48,1)}</div><span class="chev"></span>`)
];

const sheet=()=>`<div class="s-hero ph"></div>
  <div class="s-head"><span class="dot"></span><div class="rows">${b(62,1)}${b(38)}</div><span class="s-btn"></span></div>
  <div class="chips"><i style="width:70px"></i><i style="width:92px"></i><i style="width:60px"></i><i style="width:80px"></i></div>
  ${[70,50,64,42,58,74,46,60].map(w=>`<div class="s-row"><span class="sq-ic ph"></span><div class="rows">${b(w,1)}${b(w-20)}</div></div>`).join('')}
  <div class="s-block ph"></div><div class="s-block ph"></div>`;

/* Stories: one group per theme (docs/decisions/2026-11-03-stories-origem.md) */
const stories={
  groups:[3,2,4,3,2],
  header:()=>`<span class="av"></span><i style="width:${rnd(70,110)}px"></i><i style="width:28px"></i>`,
  slide(gi,si){
    const tone=6+((gi*3+si*5)%5)*4,v=(gi+si)%3;
    let inner='';
    if(v===0)inner=`<span class="s1" style="width:260px;height:260px;left:50%;top:26%;margin-left:-130px"></span><span class="s1" style="width:70px;height:70px;right:40px;top:18%"></span>`;
    else if(v===1)inner=`<span class="s2 ph" style="left:14%;right:14%;top:20%;height:46%;transform:rotate(-4deg)"></span><span class="s1" style="width:84px;height:84px;right:24px;top:58%"></span>`;
    else inner=`<div class="g4"><i class="ph"></i><i class="ph"></i><i class="ph"></i><i class="ph"></i></div>`;
    return `<div class="slide" style="--t:${tone}%">${inner}<div class="s3"><i style="width:${rnd(60,90)}%"></i><i style="width:${rnd(35,60)}%"></i></div></div>`;
  }
};

/* Notebook cards: kind 0 = image, 1 = text, 2 = icon */
const notebook={
  cards:[0,1,2,0,0,1,2,0,1,0,2,0,1,0,0,2,1,0,2,0,1],
  card(k){
    const top=k===0?'<div class="t ph"></div>':k===2?'<span class="cd"></span>':'';
    const rows=k===1?`${b(rnd(55,90),1)}${b(rnd(50,90))}${b(rnd(30,70))}`:`${b(rnd(45,85),1)}${b(rnd(30,60))}`;
    return `${top}<div class="rows">${rows}</div>`;
  }
};

const answer={
  ask(len){
    const n=clamp(Math.ceil(len/30),1,2);
    return `<div class="ask">${Array.from({length:n},(_,i)=>`<i style="width:${i===n-1?clamp(30+len*4,50,170):170}px"></i>`).join('')}</div>`;
  },
  typing:()=>'<div class="typing"><i></i><i></i><i></i></div>',
  // the first action (data-act="save") saves the answer to the notebook
  reply(){
    const k=rnd(3,6),img=Math.random()<0.45?'<div class="ans-ph ph"></div>':'';
    const lines=Array.from({length:k},(_,i)=>`<i style="width:${i===k-1?rnd(30,60):rnd(82,100)}%;animation-delay:${i*60}ms"></i>`).join('');
    return img+`<div class="ans-lines">${lines}</div><div class="ans-acts"><button type="button" data-act="save" aria-label="Guardar no notebook"></button><span></span><span></span></div>`;
  }
};

window.OrbUI={views,sheet,stories,notebook,answer};
})();
