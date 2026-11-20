/* =========================================================
   s_stroka.vid – spoločný skript pre všetky stránky
   VIDEÁ – stačí meniť linky.
   title nechaj prázdny ("") a názov sa načíta z YouTube,
   alebo ho prepíš vlastným (napr. "Lucia & Marek").
   ========================================================= */
const MAIN = { url: "https://youtu.be/8y20lmfLhx4", title: "", tag: "Svadobný zostrih" };   // veľké video navrchu Ukážok (hlavná stránka)

const WEDDINGS = [                                       // Ukážky na hlavnej stránke
  { url: "https://youtu.be/NfZvWCN1Ovk", title: "", tag: "Svadba" },
  { url: "https://youtu.be/-NL8N61UkHc", title: "", tag: "Svadba" },
  { url: "https://youtu.be/wPDf9qxcFjQ", title: "", tag: "Svadba" },
  { url: "https://youtube.com/shorts/E7v6Sv4AXLk", title: "", tag: "Svadba", vert: true },
];

const CLIPS = [                                          // Klipy & reklamy (prvé je veľké, potom po dvoch v riadku)
  { url: "https://youtube.com/shorts/LkNMF8eWs2o", title: "", tag: "Klip", vert: true },   // PILC LUKABRASSI10X
  { url: "https://youtu.be/mfZeQ9yOcvk", title: "", tag: "Reklama" },                      // kaderníctvo
  { url: "https://youtu.be/0djxHqN7wZE", title: "", tag: "Klip" },                         // FLAWED
  { url: "https://youtu.be/HYypxEE1ORM", title: "", tag: "Klip" },                         // LAD FN
  { url: "https://youtu.be/m-tcpSYJVyE", title: "", tag: "Zostrih" },                      // artofwow 2024
  { url: "https://youtu.be/xQUdTqUkajc", title: "", tag: "Zostrih" },                      // florbal
  { url: "https://youtube.com/shorts/eYWswE5Lhrk", title: "", tag: "Klip", vert: true },   // VID 1 BB V
];

const EMAIL = "samuel@stroka.sk";                       // sem chodia vyplnené formuláre

/* ---------- pomocné ---------- */
const ytId=u=>{const m=(u||"").match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);return m?m[1]:""};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* názov videa z YouTube (ak title nie je vyplnený) */
function loadTitle(v,h3){
  if(v.title){h3.textContent=v.title;return}
  h3.textContent=/Svad/.test(v.tag)?'Svadobný film':'s_stroka.vid';
  fetch('https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v='+ytId(v.url)))
    .then(r=>r.json()).then(d=>{if(d&&d.title)h3.textContent=d.title}).catch(()=>{});
}

function card(v,kind){
  const id=ytId(v.url), el=document.createElement('div');
  el.className='vid reveal'+(kind?' '+kind:'');
  const src = v.vert ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  el.innerHTML=`<div class="thumb"><img loading="lazy" src="${src}" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'" alt=""><div class="play"></div></div>
    <div class="row"><h3></h3><small>${esc(v.tag||'')}</small></div>
    <a class="yt" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Video sa nespustilo? Otvoriť na YouTube ↗</a>`;
  loadTitle(v,el.querySelector('h3'));
  el.querySelector('img').alt=(/Svad/.test(v.tag)?'Svadobné video':'Video')+' – kameraman Orava s_stroka.vid';
  el.querySelector('.thumb').onclick=()=>playInline(el,id);
  return el;
}

/* prehrá video priamo na mieste v stránke */
function stopInline(){
  document.querySelectorAll('.vid.playing').forEach(c=>{c.classList.remove('playing');c.querySelector('.thumb').innerHTML=c._thumb});
}
function playInline(el,id){
  if(el.classList.contains('playing')) return;
  stopInline();
  const t=el.querySelector('.thumb'); el._thumb=t.innerHTML; el.classList.add('playing');
  t.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen title="s_stroka.vid video"></iframe>`;
}

/* ---------- vykreslenie videí (len na stránkach, kde sú) ---------- */
if($('#weddingBig')) $('#weddingBig').appendChild(card(MAIN,'big'));
if($('#weddingVideos')) WEDDINGS.forEach(v=>$('#weddingVideos').appendChild(card(v)));
if($('#clipBig') && CLIPS.length){
  $('#clipBig').appendChild(card(CLIPS[0],'big'));
  CLIPS.slice(1).forEach(v=>$('#clipVideos').appendChild(card(v)));
}

/* ---------- menu ---------- */
$('#burger').onclick=()=>document.body.classList.toggle('menu-open');

/* ---------- animácie pri scrollovaní ---------- */
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');
  e.target.querySelectorAll('[data-count]').forEach(c=>{const n=+c.dataset.count;let i=0;const t=setInterval(()=>{i+=Math.ceil(n/40);if(i>=n){i=n;clearInterval(t)}c.textContent=i+'+'},30)});
  io.unobserve(e.target)}),{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));

/* ---------- formuláre → e-mail (FormSubmit) ---------- */
function tab(id){
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===id));
  document.querySelectorAll('form.order').forEach(f=>f.hidden=f.id!==id);
}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.tab));

/* predvyplnenie z odkazu, napr. /cenova-ponuka?typ=Reklama alebo ?typ=Svadba&auto=balik&vyzdoba=1 */
if($('#wForm')){
  const q=new URLSearchParams(location.search), typ=q.get('typ')||'';
  if(typ){
    if(/Svad/.test(typ)) tab('wForm');
    else{tab('oForm');const s=$('#typ');[...s.options].forEach(o=>{if(o.text===typ)s.value=o.value})}
  }
  if(q.get('vyzdoba')){const sv=document.querySelector('select[name="Výzdoba Svadby z Ateliéru"]');if(sv)sv.value='Áno, mám záujem'}
  if(q.get('auto')){const sa=document.querySelector('select[name="Svadobné auto"]');if(sa)sa.value=q.get('auto')==='balik'?'Áno – balíček svadobné video + kabriolet':'Áno, mám záujem'}
}

document.querySelectorAll('form.order').forEach(form=>{
  const msg=form.querySelector('.form-msg');
  form.addEventListener('submit',async e=>{
    e.preventDefault(); msg.className='form-msg'; msg.textContent='Odosielam…';
    const fd=new FormData(form); fd.append('_template','table'); fd.append('_captcha','false');
    try{
      const r=await fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',body:fd,headers:{Accept:'application/json'}});
      const d=await r.json().catch(()=>({}));
      if(!r.ok||String(d.success)!=='true') throw 0;
      form.reset(); msg.className='form-msg ok'; msg.textContent='Ďakujem! Dopyt odišiel, cenovú ponuku vám pošlem do 48 hodín. – s_stroka.vid';
    }catch(_){msg.className='form-msg err';msg.textContent='Niečo sa pokazilo. Zavolajte mi na 0949 098 880 alebo napíšte na samuel@stroka.sk.'}
  });
});

if($('#yr')) $('#yr').textContent=new Date().getFullYear();
