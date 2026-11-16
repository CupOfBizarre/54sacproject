/* map.js — interactive Vietnam region map (view #map inside the splash screen).
   API: window.SacMap.show() / .hide().  Geometry is a simplified approximation. */
(function(){'use strict';
const S=s=>s.trim().split(/\s+/).map(q=>q.split(',').map(Number));
const P=p=>[+((p[0]-101.6)*53.1).toFixed(1),+((23.8-p[1])*55).toFixed(1)];
const D=a=>'M'+a.map(P).join('L')+'Z';
const OUT=S(`102.14,22.40 102.40,22.72 102.80,22.60 103.10,22.45 103.40,22.70 103.65,22.78 103.97,22.50 104.28,22.78 104.60,22.84 104.85,23.12 105.25,23.36 105.55,23.10 105.85,22.95 106.15,22.95 106.55,22.90 106.76,22.82 106.68,22.55 106.62,22.30 106.73,22.00 107.10,21.90 107.45,21.65 107.95,21.50 107.97,21.45 107.75,21.40 107.45,21.30 107.30,21.05 107.05,20.95 106.80,20.93 106.78,20.75 106.82,20.65 106.62,20.45 106.52,20.22 106.15,20.05 105.95,19.93 105.90,19.75 105.82,19.45 105.75,19.20 105.70,18.95 105.72,18.78 105.82,18.55 105.92,18.40 106.10,18.20 106.35,18.05 106.45,17.90 106.60,17.60 106.80,17.30 107.05,17.00 107.25,16.90 107.55,16.65 107.90,16.45 108.10,16.25 108.25,16.10 108.35,15.95 108.50,15.65 108.70,15.50 108.85,15.20 109.00,14.85 109.05,14.55 109.15,14.10 109.25,13.80 109.22,13.55 109.28,13.25 109.35,12.90 109.45,12.88 109.30,12.60 109.20,12.25 109.20,11.95 109.15,11.75 109.00,11.55 109.05,11.30 108.75,11.10 108.40,10.97 108.10,10.90 107.85,10.70 107.55,10.55 107.25,10.40 107.08,10.35 106.92,10.45 106.78,10.27 106.70,10.22 106.55,9.95 106.45,9.65 106.20,9.40 105.95,9.25 105.70,9.05 105.45,8.80 105.15,8.65 104.85,8.60 104.78,8.85 104.82,9.10 104.95,9.45 105.05,9.85 105.00,10.05 104.80,10.25 104.55,10.35 104.48,10.42 104.85,10.55 105.15,10.85 105.60,10.95 105.95,11.20 106.10,11.45 106.40,11.65 106.65,11.95 106.95,12.15 107.40,12.30 107.60,12.75 107.45,13.15 107.50,13.70 107.35,14.20 107.55,14.70 107.40,15.05 107.50,15.45 107.20,15.95 107.15,16.25 106.60,16.62 106.50,16.95 106.20,17.30 105.78,17.68 105.15,18.35 104.65,18.95 104.20,19.30 103.95,19.65 104.20,19.95 104.50,20.30 104.15,20.65 103.70,20.70 103.35,21.05 102.85,21.22 102.45,21.55 102.20,21.90`);
// Shared internal boundaries (extended past the coast/border; everything is clipped to OUT)
const J1=[105.3,20.9],J2=[105.65,20.35],C1=[107.05,20.7],C2=[106.2,19.85],H=[108.12,16.2],S3=[108.45,16.25],W1=[103.8,20.6],W2=[106.9,16.1],W3=[107,15.5],W4=[106.9,12.45],W5=[105.6,11.3],J4=[107.85,11.3],S4=[107.4,10.3],M1=[106.95,10.1];
const rv=a=>[...a].reverse();
const B={tbdb:[[103.4,23.2],[103.65,22.6],[103.95,22.2],[104.2,21.8],[104.6,21.35],[104.95,21.1],J1],dbsh:[J1,[105.5,21.25],[105.9,21.35],[106.2,21.25],[106.55,21.15],[106.8,20.95],C1],tbsh:[J1,[105.45,20.65],J2],shbtb:[J2,[105.8,20.2],[105.95,20.05],C2],tbbtb:[J2,[105.2,20.35],[104.8,20.5],[104.4,20.5],W1],btbntb:[W2,[107.6,16.1],H,S3],ntbtn:[W3,[107.5,15.45],[108.2,15.2],[108.55,14.75],[108.8,14.1],[108.95,13.45],[108.85,12.85],[108.8,12.4],[108.65,12.05],[108.35,11.65],[108.1,11.45],J4],ntbdnb:[J4,[107.65,11],[107.55,10.65],S4],tndnb:[J4,[107.5,11.45],[107.6,11.9],[107.4,12.15],W4],dnbmk:[W5,[105.95,11.1],[106.25,10.9],[106.55,10.65],[106.7,10.45],[106.78,10.28],M1]};
const G=s=>s.split(',');
const REG=[
{id:'tay-bac',n:'Tây Bắc',e:'Northwest',h:200,g:G('Thái,Mường,H’Mông,Dao,Hà Nhì,La Hủ,Lự,Cống,Si La,Mảng,Khơ Mú,Xinh Mun,Kháng,Lào,Phù Lá,Lô Lô'),
 poly:[...B.tbdb,...B.tbsh.slice(1),...B.tbbtb.slice(1),[101.5,20.6],[101.5,23.2]]},
{id:'dong-bac',n:'Đông Bắc',e:'Northeast',h:150,g:G('Tày,Nùng,Dao,H’Mông,Sán Chay,Sán Dìu,Giáy,Pà Thẻn,Lô Lô,Pu Péo,La Chí,Cờ Lao,Bố Y,La Ha,Ngái'),
 poly:[...B.tbdb,...B.dbsh.slice(1),[109.8,20.7],[109.8,23.8],[103.4,23.8]]},
{id:'dong-bang-song-hong',n:'Đồng bằng sông Hồng',e:'Red River Delta',h:12,g:G('Kinh,Mường,Tày,Hoa,Nùng,Dao'),
 poly:[...B.dbsh,[107.5,20.4],[106.6,19.7],...rv(B.shbtb),B.tbsh[1]]},
{id:'bac-trung-bo',n:'Bắc Trung Bộ',e:'North Central Coast',h:42,g:G('Kinh,Thái,Mường,Thổ,Khơ Mú,Ơ Đu,Chứt,Bru–Vân Kiều,Pa Cô,Tà Ôi'),
 poly:[...B.shbtb,[106.7,19.3],[107.1,18.4],[107.6,17.6],[108.1,17],[108.6,16.6],...rv(B.btbntb),[103,16.1],[103,20.6],...rv(B.tbbtb)]},
{id:'nam-trung-bo',n:'Nam Trung Bộ',e:'South Central Coast',h:280,g:G('Kinh,Chăm,Cơ Tu,Hrê,Co,Cor,Ca Dong,Ra Glai,Giẻ Triêng,Xơ Đăng'),
 poly:[...B.btbntb,[108.9,15.8],[109.6,15],[110.1,13.8],[110,12.9],[109.9,12],[109.6,11.2],[108.8,10.4],[108,10.2],...rv(B.ntbdnb),...rv(B.ntbtn)]},
{id:'tay-nguyen',n:'Tây Nguyên',e:'Central Highlands',h:100,g:G('Ê Đê,Gia Rai,Ba Na,Xơ Đăng,M’Nông,Cơ Ho,Mạ,Giẻ Triêng,Brâu,Rơ Măm,Chu Ru'),
 poly:[...B.ntbtn,...B.tndnb.slice(1),[106.9,15.5]]},
{id:'dong-nam-bo',n:'Đông Nam Bộ',e:'Southeast',h:330,g:G('Kinh,Hoa,Xtiêng,Chơ Ro,Mạ,Khmer,Chăm,Nùng'),
 poly:[...B.tndnb,[105.6,12.45],...B.dnbmk,[107.4,10.1],...rv(B.ntbdnb)]},
{id:'dong-bang-song-cuu-long',n:'Đồng bằng sông Cửu Long',e:'Mekong Delta',h:178,g:G('Kinh,Khmer,Hoa,Chăm'),
 poly:[...B.dnbmk,[107,9.5],[106.4,8.7],[105.6,8.2],[104.8,8],[104.2,8.6],[104.3,9.6],[104.2,10.2],[104.25,10.6],[104.25,11.3]]}
];
const PL = window.SAC_PAL;
// every region takes one accent thread from the site palette; its resting tint is that thread diluted into the paper
const REGION_COLOR = {'tay-bac':'teal','dong-bac':'indigo','dong-bang-song-hong':'coral','bac-trung-bo':'ink','nam-trung-bo':'mint','tay-nguyen':'sand','dong-nam-bo':'sky','dong-bang-song-cuu-long':'coral'};
const COLR = {}; Object.keys(REGION_COLOR).forEach((id) => { COLR[id] = [PL.get(REGION_COLOR[id]), PL.mix(REGION_COLOR[id], 'paper', 0.8)]; });
REG.forEach(r=>{[r.c,r.t]=COLR[r.id]});
const HS=S('111.57,16.53 111.52,16.55 111.70,16.45 111.75,16.47 112.33,16.83 112.25,16.97 112.73,16.67 111.50,17.10 111.20,15.78 112.00,16.20 112.45,16.60');
const TS=S('111.92,8.64 114.33,9.88 114.33,11.43 114.37,10.18 114.35,10.38 113.85,10.80 113.50,10.20 114.10,9.60 113.90,8.90 112.90,8.80 112.30,9.15 111.60,10.20 112.50,10.40 113.25,11.10 114.60,10.60 115.00,10.10 113.00,9.60 112.60,8.95');
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const rng=seed=>{let r=hash(seed);return()=>((r=Math.imul(r^r>>>15,2246822507)>>>0)/4294967296)};
const inP=(p,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])c=!c}return c};
const PAL=['ink','paper','teal','sky','coral','sand','mint'].map((n)=>PL.get(n));
function mosaic(seed){const n=rng(seed);let s='';for(let y=0;y<9;y++)for(let x=0;x<16;x++){s+=`<rect x="${x*20}" y="${y*20}" width="20" height="20" fill="${PAL[(n()*PAL.length)|0]}"/>`}
 return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">${s}</svg>`)}`}

const $=id=>document.getElementById('m-'+id);const st=$('stage'),app=document.getElementById('map-view'),card=$('card'),tip=$('tip');let vis=false;
const outD=D(OUT),COL=[PL.get('teal'),PL.get('sky'),PL.get('coral'),PL.get('sand')];
let bars='';
REG.forEach((r,ri)=>{r.d=D(r.poly);const pp=r.poly.map(P),op=OUT.map(P),n=rng(r.id);let k=0,t=0;
 while(k<r.g.length*2&&t++<4000){const p=[101.6+n()*16,6+n()*18];const q=P(p);if(inP(q,pp)&&inP(q,op)){const h=6+n()*26;bars+=`<line class="b${n()<.3?' pulse':''}" style="--d:${(n()).toFixed(2)}" x1="${q[0]}" x2="${q[0]}" y1="${q[1]}" y2="${(q[1]-h).toFixed(1)}" stroke="${COL[(n()*4)|0]}"/>`;k++}}});
const isl=(a,x,y,lab,rx,ry)=>{const c=P([x,y]);return `<g class="isl"><ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}"/>${a.map(p=>{const q=P(p);return `<circle cx="${q[0]}" cy="${q[1]}" r="2.1"/>`}).join('')}<text x="${c[0]}" y="${+c[1]+ry+16}" text-anchor="middle">${lab}</text></g>`};
st.innerHTML=`
<svg class="L slab" viewBox="0 0 880 980"><path class="s2" transform="translate(0 14)" d="${outD}"/><path transform="translate(0 7)" d="${outD}"/></svg>
<svg class="L reg" viewBox="0 0 880 980"><defs><clipPath id="cp"><path d="${outD}"/></clipPath></defs>
${REG.map((r,i)=>`<g class="r" tabindex="0" role="button" aria-label="${r.n}" data-id="${r.id}" style="--c:${r.c};--t:${r.t};--i:${i}"><g clip-path="url(#cp)"><path d="${r.d}"/></g></g>`).join('')}
<path class="rim" pathLength="1" d="${outD}"/></svg>
<svg class="L bars" viewBox="0 0 880 980">${bars}</svg>
<svg class="L isl" viewBox="0 0 880 980">${isl(HS,112,16.5,'Quần đảo Hoàng Sa',46,34)}${isl(TS,113.4,9.9,'Quần đảo Trường Sa',72,52)}
<g class="sea"><text x="560" y="610">BIỂN ĐÔNG</text><text x="262" y="262" transform="rotate(-8 262 262)">Vịnh Bắc Bộ</text></g></svg>`;
$('chips').innerHTML=REG.map(r=>`<button data-id="${r.id}" style="--c:${r.c}"><i></i>${r.n}</button>`).join('');

// ---- modal ----
function showGroup(r,name){$('gs').querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.g===name));
 $('gd').innerHTML=`<img alt="" src="${mosaic(r.id+name)}"><div><h3>${name}</h3><p>Nhóm ngôn ngữ: placeholder · Dân số: 000.000 người</p><p>Đoạn mô tả giữ chỗ về đời sống, trang phục và lễ hội của dân tộc ${name}. Nội dung thật sẽ được bổ sung sau.</p></div>`}
function open(id){const r=REG.find(x=>x.id===id);if(!r)return;card.style.setProperty('--c',r.c);
 $('hero').style.backgroundImage=`url("${mosaic(r.id)}")`;$('ct').textContent=r.n;
 $('cm').textContent=`${r.e} · ${r.g.length} dân tộc (placeholder)`;
 $('cb').textContent='Đoạn giới thiệu giữ chỗ về vùng: địa hình, khí hậu và đời sống văn hóa. Nội dung thật sẽ được thay vào sau.';
 $('gs').innerHTML=r.g.map(g=>`<button data-g="${g}">${g}</button>`).join('');
 $('gs').onclick=e=>{const b=e.target.closest('button');if(b)showGroup(r,b.dataset.g)};showGroup(r,r.g[0]);
 card.classList.add('open');app.classList.add('open');card.scrollTop=0;
 document.querySelectorAll('.r,#m-chips button').forEach(el=>el.classList.toggle('on',el.dataset.id===id))}
function shut(){card.classList.remove('open');app.classList.remove('open');app.querySelectorAll('.on').forEach(el=>el.classList.remove('on'))   /* scoped: other parts of the page use .on too */}
const route=()=>{const m=/^#map(?:-([a-z-]+))?$/.exec(location.hash);m&&m[1]?open(m[1]):shut()};
const go=id=>{location.hash='map-'+id};
addEventListener('hashchange',()=>{if(vis)route()});
$('x').onclick=()=>{location.hash='map'};
addEventListener('keydown',e=>{if(vis&&e.key==='Escape'&&card.classList.contains('open'))location.hash='map'});
app.addEventListener('click',e=>{const t=e.target.closest('.r,#m-chips button');if(t)go(t.dataset.id);else if(!card.contains(e.target)&&card.classList.contains('open'))location.hash='map'});
st.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.dataset.id){e.preventDefault();go(e.target.dataset.id)}});
st.addEventListener('pointerover',e=>{const r=e.target.closest('.r');st.classList.toggle('has-hover',!!r);if(r){tip.textContent=REG.find(x=>x.id===r.dataset.id).n;tip.style.opacity=1}else tip.style.opacity=0});
st.addEventListener('pointerleave',()=>{st.classList.remove('has-hover');tip.style.opacity=0});

// ---- tilt that follows the cursor (rAF sleeps when settled) ----
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;let tx=0,ty=0,cx=0,cy=0,raf=0;
function tick(){cx+=(tx-cx)*.08;cy+=(ty-cy)*.08;
 st.style.setProperty('--ry',(cx*9).toFixed(2)+'deg');st.style.setProperty('--rx',(-cy*7).toFixed(2)+'deg');
 st.style.setProperty('--ryn',cx.toFixed(3));st.style.setProperty('--rxn',cy.toFixed(3));
 raf=(Math.abs(tx-cx)+Math.abs(ty-cy)>.002)?requestAnimationFrame(tick):0}
addEventListener('pointermove',e=>{tip.style.left=e.clientX+'px';tip.style.top=e.clientY+'px';if(still)return;
 tx=e.clientX/innerWidth*2-1;ty=e.clientY/innerHeight*2-1;if(!raf)raf=requestAnimationFrame(tick)});
window.SacMap={show(){vis=true;app.classList.remove('play');void app.offsetWidth;app.classList.add('play');route()},hide(){vis=false;shut()}};
})();
