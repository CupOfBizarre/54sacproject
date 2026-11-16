/* stream/flow.js — the simulation (no drawing).
   ONE continuous stream: stories are composed in groups of ~10 (see layout.js), and each new group is
   tucked tight against the previous one — pairs of images that face each other keep the same small gap
   as images inside a group — so the wall never has empty "page breaks". The wall drifts left → right
   by itself; dragging steers; releasing eases back to the drift. After the last group the first one
   follows, so it loops forever. Each frame fills a reusable list of drawables, sorted far → near. */
(function (W) {
  'use strict';
  const IDLE_FRAC = 0.048;                            // idle drift: share of the screen width per second
  const TIGHT = 18;                                   // gap between neighbouring images across groups (px)
  const st = { f: 0, fT: 0, vel: 0, idle: 60, steer: 0, paused: false, hold: false, hover: -1, hidden: -1,
               tween: null, drag: false, started: false };
  let stories = [], groups = [], safe = null, vw = 1, vh = 1, S = 1, seed = 1, perScene = 10;
  let segs = [], composed = 0, LAM = 0, P0 = 0;       // segs[s] = { items, X, lo, hi }; LAM = loop length (px), 0 until known
  const pool = [], out = [], resident = new Set();
  let count = 0;
  const mod = (a, n) => ((a % n) + n) % n;

  function setSeed(s) { seed = s >>> 0; }

  function layout(w, h, list) {
    stories = list; vw = w; vh = h;
    perScene = w < 600 ? 6 : w < 1000 ? 8 : 10;
    const top = Math.max(72, h * 0.1), bottom = Math.max(76, h * 0.1);
    safe = { x: w * 0.07, y: top, w: w * 0.86, h: Math.max(160, h - top - bottom) };
    groups = W.layout.groups(stories.length, perScene);
    S = groups.length; segs = []; composed = 0; LAM = 0; st.started = false; st.idle = IDLE_FRAC * w;
    if (!st.vel) st.vel = st.idle;
  }

  /* ── building the chain ───────────────────────────────────────── */
  // x-offset for `items` so they sit TIGHT to the left of the already-placed segments `prevs`
  function tuck(prevs, items) {
    let X = Infinity;
    for (const p of prevs) for (const a of p.items) for (const b of items) {
      if (a.y - a.sh / 2 < b.y + b.sh / 2 + TIGHT && a.y + a.sh / 2 + TIGHT > b.y - b.sh / 2) {   // share a horizontal band
        const v = p.X + (a.x - a.sw / 2) - TIGHT - (b.x + b.sw / 2);
        if (v < X) X = v;
      }
    }
    return isFinite(X) ? X : prevs[0].X - 400;
  }

  // compose scenes 0..limit-1 in order, once their images' real shapes are known
  function advance(limit) {
    while (composed < Math.min(limit, S)) {
      const s = composed, g = groups[s], items = [];
      let ok = true;
      for (let i = g[0]; i < g[1]; i++) {
        if (!W.images.known(stories[i])) { ok = false; W.images.probe(stories[i]); }
        items.push({ idx: i, a: W.images.aspectOf(stories[i]) });
      }
      if (!ok) return false;
      const placed = W.layout.placeScene(items, safe, W.layout.rng(seed + s * 7919));
      let X = 0;
      if (s > 0) X = tuck([segs[s - 1]].concat(s > 1 ? [segs[s - 2]] : []), placed);
      let lo = Infinity, hi = -Infinity;
      placed.forEach((o) => { lo = Math.min(lo, o.x - o.sw / 2); hi = Math.max(hi, o.x + o.sw / 2); o.pj = [NaN, NaN, NaN, NaN]; });
      segs[s] = { items: placed, X: X, lo: lo, hi: hi };
      composed++;
      if (composed === S) {                              // close the loop: scene 0 follows the last scene
        const prevs = [segs[S - 1]].concat(S > 1 ? [segs[S - 2]] : []);
        LAM = -tuck(prevs, segs[0].items);               // segs[0].X is 0
        if (LAM < 50) LAM = 50;
      }
    }
    return true;
  }
  const sceneOf = (idx) => { for (let s = 0; s < S; s++) if (idx >= groups[s][0] && idx < groups[s][1]) return s; return 0; };

  // progress value that centres story idx on screen (nearest copy to where we are now), or null if not composed yet
  function targetFor(idx) {
    const s = sceneOf(idx);
    if (s >= composed) return null;
    const it = segs[s].items.find((o) => o.idx === idx);
    let P = vw / 2 - segs[s].X - it.x;
    if (LAM) P += Math.round((st.f - P) / LAM) * LAM;
    return P;
  }
  function prepare(idx) {                               // resolves when idx's group (and all before it) is composed
    const need = sceneOf(idx) + 1;
    return new Promise((res) => {
      let n = 0;
      const t = setInterval(() => { if (advance(need) || ++n > 100) { clearInterval(t); res(); } }, 60);
      if (advance(need)) { clearInterval(t); res(); }
    });
  }

  function goTo(target, ms) { st.tween = { from: st.f, to: target, t: 0, dur: ms || 900 }; st.vel = 0; }

  /* ── one simulation step ──────────────────────────────────────── */
  function step(dt, time) {
    // keep composing groups ahead of the stream (about 1.2 screens past the left edge)
    if (composed === 0) advance(1);
    else if (composed < S) { const L = segs[composed - 1]; if (st.f + L.X + L.lo > -vw * 1.2) advance(composed + 1); }
    if (!st.started && composed >= 1) {
      P0 = vw / 2 - (segs[0].lo + segs[0].hi) / 2; st.f = st.fT = P0; st.started = true;
    }
    if (!st.started) { out.length = count = 0; return 0; }

    if (st.tween) {
      const T = st.tween; T.t += dt * 1000;                // dt is seconds, dur is ms
      const p = Math.min(1, T.t / T.dur), e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      st.f = T.from + (T.to - T.from) * e;
      if (p >= 1) { st.tween = null; st.vel = 0; }
    } else if (st.drag) {
      st.f += (st.fT - st.f) * (1 - Math.exp(-dt / 0.22));          // frames trail the pointer
    } else {
      const target = (st.paused || st.hold) ? 0 : st.idle * (st.hover >= 0 ? 0.2 : 1);
      st.vel += (target - st.vel) * (1 - Math.exp(-dt / 0.9));
      st.f += st.vel * dt;
    }
    if (!LAM) {                                            // before the first full lap there is nothing "behind" the start
      const min = P0 - vw * 0.3;
      if (st.f < min) { st.f = min; if (st.vel < 0) st.vel = 0; }
      if (st.fT < min) st.fT = min;
    }
    st.steer *= Math.exp(-dt / 1.4);

    const lag = 1 - Math.exp(-dt / 0.45), nS = LAM ? S : composed;
    const cLo = LAM ? Math.floor((st.f - vw - 200) / LAM) - 1 : 0, cHi = LAM ? Math.ceil((st.f + 200) / LAM) + 1 : 0;
    count = 0; resident.clear();
    for (let c = cLo; c <= cHi; c++) {
      for (let s = 0; s < nS; s++) {
        const seg = segs[s], X = seg.X - c * LAM, left = st.f + X + seg.lo, right = st.f + X + seg.hi;
        if (right < -vw - 60 || left > vw * 2 + 60) continue;
        if (right > -vw && left < vw * 2) for (let i = 0; i < seg.items.length; i++) resident.add(seg.items[i].idx);
        if (right < -60 || left > vw + 60) continue;
        const j = c * S + s, slot = mod(j, 4);
        for (let i = 0; i < seg.items.length; i++) {
          const it = seg.items[i], x = st.f + X + it.x;
          // the image-track effect: content pans inside its frame as the frame moves across the screen,
          // trailing behind the frame (long ease) so it reads as depth
          const target = Math.max(0, Math.min(1, x / vw));
          if (it.pj[slot] !== j) { it.pj[slot] = j; it.pn[slot] = target; }
          else if (!st.hold) it.pn[slot] += (target - it.pn[slot]) * lag;
          if (x + it.sw / 2 < -40 || x - it.sw / 2 > vw + 40) continue;
          let d = pool[count];
          if (!d) d = pool[count] = {};
          d.idx = it.idx; d.scene = j; d.x = x;
          d.y = it.y + Math.cos(time * it.fy + it.ph) * it.by + st.steer * vh * 0.3;
          d.sw = it.sw; d.sh = it.sh; d.z = it.z; d.rot = 0; d.ph = it.ph; d.hide = (it.idx === st.hidden);
          d.us = it.us; d.vs = it.vs; d.pan = it.pn[slot];
          d.iw = it.us < 1 ? it.sw / it.us : it.sw;
          d.hv = (d.hv || 0) + (((it.idx === st.hover) ? 1 : 0) - (d.hv || 0)) * 0.12;
          d.vel = st.vel / vw;                              // in screens / second (shaders expect this scale)
          out[count++] = d;
        }
      }
    }
    out.length = count;
    out.sort((a, b) => b.z - a.z);                          // far first
    return count;
  }

  // nearest-first hit test in screen px
  function hit(px, py) {
    for (let i = count - 1; i >= 0; i--) {
      const d = out[i]; if (d.hide) continue;
      if (Math.abs(px - d.x) <= d.sw / 2 && Math.abs(py - d.y) <= d.sh / 2) return d;
    }
    return null;
  }
  // drawable of story idx closest to screen centre (for viewer open/close)
  function find(idx) {
    let best = null, bd = Infinity;
    for (let i = 0; i < count; i++) {
      const d = out[i]; if (d.idx !== idx) continue;
      const dist = Math.hypot(d.x - vw / 2, d.y - vh / 2);
      if (dist < bd) { bd = dist; best = d; }
    }
    return best;
  }
  function residentStories(set) { set.clear(); resident.forEach((v) => set.add(v)); }

  W.flow = { st: st, layout: layout, step: step, list: out, hit: hit, find: find, goTo: goTo, setSeed: setSeed,
             residentStories: residentStories, targetFor: targetFor, prepare: prepare, advance: advance, sceneOf: sceneOf,
             mod: mod, loop: () => LAM, composed: () => composed, segs: () => segs };
})(window.SACStream = window.SACStream || {});
