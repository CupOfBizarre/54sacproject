/* stream/main.js — wiring: renderer choice, sizing, input, controls, quality governor, deep links. */
(function (W) {
  'use strict';
  const stories = window.SAC_STORIES || [];
  const $ = (id) => document.getElementById(id);
  const root = $('canvas-root');
  if (!root || !stories.length) return;
  const F = W.flow, st = F.st;
  const params = new URLSearchParams(location.search);

  // one seed per visit → a different composition every time (?seed=N pins it for debugging)
  F.setSeed(params.has('seed') ? +params.get('seed') : (Math.random() * 2147483647) | 0);

  /* ── DOM scaffold ── */
  root.textContent = '';
  const canvas = document.createElement('canvas'); canvas.id = 's-canvas';
  const host = document.createElement('div'); host.id = 's-dom';
  const ui = document.createElement('div'); ui.id = 's-ui';
  ui.innerHTML = '<div class="s-bar"><button id="s-play" type="button" aria-label="Tạm dừng">❚❚</button></div>' +
    '<p id="s-hint">Kéo để lái dòng chảy · chạm vào ảnh để xem</p>';
  root.append(canvas, host, ui);

  /* ── renderer: WebGL when possible, flat DOM otherwise ── */
  const allLocal = stories.every((s) => W.images.hasManifest(s));
  let R = null, mode = 'dom', lite = 0, ratio = 1, dprCap = 2;
  function useDom() { if (R && R.destroy) R.destroy(); R = W.dom.create(host); R.setStories(stories); canvas.style.display = 'none'; host.style.display = 'block'; mode = 'dom'; }
  function useGL() {
    const r = W.gl.create(canvas, () => { useDom(); resize(true); });
    if (!r) return false;
    R = r; R.setStories(stories); canvas.style.display = 'block'; host.style.display = 'none'; mode = 'gl'; return true;
  }
  if (params.get('renderer') === 'dom' || !allLocal || !useGL()) useDom();

  /* ── sizing: relayout only when the width changes (phone URL bars change the height) ── */
  let vw = 0, vh = 0;
  function resize(force) {
    const w = root.clientWidth, h = root.clientHeight;
    if (!w || !h) return false;
    if (!force && w === vw && h === vh) return false;
    const widthChanged = w !== vw;
    vw = w; vh = h;
    ratio = Math.min(window.devicePixelRatio || 1, dprCap);
    R.setViewport(w, h, ratio);
    if (widthChanged) F.layout(w, h, stories);                // quality changes (force) only touch the render size, never the wall
    return true;
  }
  new ResizeObserver(() => resize(false)).observe(root);

  /* ── controls ── */
  const playBtn = $('s-play');
  playBtn.onclick = () => { st.paused = !st.paused; playBtn.textContent = st.paused ? '▶' : '❚❚'; playBtn.setAttribute('aria-label', st.paused ? 'Phát' : 'Tạm dừng'); };

  /* ── input: drag steers (horizontal = scrub, vertical = lean); tap opens; wheel nudges ── */
  let drag = null;
  root.addEventListener('pointerdown', (e) => {
    if (W.viewer.isOpen() || e.target.closest('#s-ui') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    try { root.setPointerCapture(e.pointerId); } catch (_) {}
    drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t0: e.timeStamp, tl: e.timeStamp, moved: 0 };
    st.drag = true; st.tween = null; st.fT = st.f; root.classList.add('dragging');
  });
  root.addEventListener('pointermove', (e) => {
    if (!drag) { hover(e.clientX, e.clientY); return; }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, dtm = Math.max(1, e.timeStamp - drag.tl);
    st.fT += dx;                                               // frames trail this target (see flow.js)
    st.steer = Math.max(-0.12, Math.min(0.12, st.steer + dy / vh * 0.4));
    drag.moved += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; drag.tl = e.timeStamp;
  });
  const end = (e) => {
    if (!drag) return;
    const tap = e.type === 'pointerup' && drag.moved < 8 && e.timeStamp - drag.t0 < 400;
    // keep the momentum of the trailing gap, unless the pointer rested before lifting
    st.vel = (e.timeStamp - drag.tl > 90) ? st.idle : Math.max(-2 * vw, Math.min(2 * vw, (st.fT - st.f) / 0.22 * 0.6));
    const d0 = drag; drag = null; st.drag = false; root.classList.remove('dragging');
    if (tap) { const d = F.hit(d0.x0, d0.y0); if (d) W.viewer.open(d.idx, d); }
  };
  root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
  root.addEventListener('wheel', (e) => {
    if (W.viewer.isOpen()) return; e.preventDefault();
    st.tween = null; st.f += (e.deltaY + e.deltaX) * 0.5; st.vel += (e.deltaY + e.deltaX) * 0.25;
  }, { passive: false });
  function hover(x, y) {
    const d = F.hit(x, y);
    st.hover = d ? d.idx : -1;
    root.style.cursor = d ? 'pointer' : '';
  }
  root.addEventListener('pointerleave', () => { st.hover = -1; });
  window.addEventListener('keydown', (e) => {
    if (!root.offsetParent || W.viewer.isOpen()) return;
    if (e.key === 'ArrowRight') st.vel += st.idle * 6; else if (e.key === 'ArrowLeft') st.vel -= st.idle * 6;
    else if (e.key === ' ') { e.preventDefault(); playBtn.click(); }
  });

  /* ── viewer + HOME ── */
  W.viewer.init(stories, {
    hold: (on, idx) => { st.hold = on; st.hidden = on ? idx : -1; if (on) st.vel = 0; },
    reveal: (i) => {                                          // the stream carries the story into view
      st.hidden = i;
      F.prepare(i).then(() => { const P = F.targetFor(i); if (P != null) F.goTo(P, 800); });
    }
  });
  const home = $('macro-toggle-btn');
  if (home) home.addEventListener('click', (e) => {
    e.stopPropagation();
    const go = () => { if (typeof window.replaySplash === 'function') window.replaySplash(); };
    if (W.viewer.isOpen()) { W.viewer.close(); setTimeout(go, 700); } else go();
  });

  /* ── frame loop (runs only while the gallery is on screen) ── */
  const resident = new Set();
  let last = 0, running = false, time = 0, frames = [], tier = 0;
  function frame(now) {
    if (!root.offsetParent || document.hidden) { running = false; last = 0; return; }
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    if (last) frames.push(now - last);
    last = now; time += dt;
    F.step(dt, time);
    if (W.viewer.settled()) { requestAnimationFrame(frame); return; }   // hidden behind the opaque viewer: don't draw
    if (mode === 'gl') {
      F.residentStories(resident); R.release(resident);
      R.draw(F.list, vw, vh, time, st.vel / vw, lite);
    } else R.draw(F.list, vw, vh);
    governor();
    requestAnimationFrame(frame);
  }
  // quality governor: if frames are slow, shed cost step by step (DPR → lite shaders → flat DOM)
  function governor() {
    if (frames.length < 150) return;
    const s = frames.slice().sort((a, b) => a - b), med = s[s.length >> 1];
    frames = [];
    if (mode !== 'gl' || med < 26) return;
    tier++;
    if (tier === 1) { dprCap = 1; resize(true); }
    else if (tier === 2) lite = 1;
    else if (tier >= 3) { useDom(); resize(true); }
  }
  function start() { if (!running && root.offsetParent && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }
  new ResizeObserver(() => { resize(false); start(); }).observe(root);
  document.addEventListener('visibilitychange', start);

  /* ── deep link: #story-<id> opens that story over its scene ── */
  function openFromHash() {
    const mm = /^#story-(\d+)$/.exec(location.hash);
    if (!mm) return;
    resize(false);
    const idx = stories.findIndex((s) => s.id === +mm[1]);
    if (idx < 0 || !vw) return;
    F.prepare(idx).then(() => {
      F.step(0.016, time);                                    // initialise the stream, then centre the story
      const P = F.targetFor(idx);
      if (P != null) { st.f = st.fT = P; st.vel = 0; }
      start();
      let tries = 0;
      const wait = setInterval(() => {                        // open once the story's frame has been drawn
        F.step(0.016, time); tries++;
        const d = F.find(idx);
        if (d || tries > 80) { clearInterval(wait); W.viewer.open(idx, d || null); }
      }, 60);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openFromHash); else openFromHash();
  resize(false); start();
  W.stream = { mode: () => mode, resize: resize, start: start };
})(window.SACStream = window.SACStream || {});
