/* stream/layout.js — scene composition.
   Stories are grouped into scenes of ~10. A scene is a "gallery wall" hung around a gently
   waving spine: one row stands on the spine (bottom-aligned), one hangs from it (top-aligned),
   with an optional tall piece straddling it and an optional floater in the free space — all
   straight (no tilt), different sizes and shapes, small gaps, never overlapping, always inside
   the safe rectangle. Every random choice (sizes, shapes, order, offsets) is re-rolled per
   visit, so no two compositions repeat. New stories need no manual placement. */
(function (W) {
  'use strict';

  function rng(seed) {                      // mulberry32: tiny seeded PRNG
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // [start, end) story ranges: as even as possible, each close to `per`
  function groups(n, per) {
    let S = Math.max(1, Math.round(n / per));
    if (n / S > per * 1.3) S++;
    const out = [];
    let k = 0;
    for (let s = 0; s < S; s++) {
      const size = Math.floor(n / S) + (s < n % S ? 1 : 0);
      out.push([k, k + size]); k += size;
    }
    return out;
  }

  const hit = (a, b, pad) => a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y;

  // items: [{ a }] (a = image width/height). R: safe rect. Returns rects { i, x, y, w, h } (top-left).
  function wall(items, R, rnd) {
    const n = items.length;
    const gap = 14 + rnd() * 12;
    // frame shape: derived from the image's own shape but varied; mostly narrower than the image,
    // which leaves room for the content to pan sideways inside it as the stream moves
    const fa = items.map((it) => {
      let r = (rnd() - 0.65) * 0.8;
      if (Math.abs(r) < 0.1) r = r < 0 ? -0.1 : 0.1;
      return Math.max(0.4, Math.min(2.5, it.a * Math.exp(r)));
    });
    const pool = items.map((_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }

    function build(floatInRow) {
      const idx = pool.slice(), rects = [];
      const S = (n >= 8 && rnd() < 0.7) ? idx.pop() : -1;                    // straddler
      const Fl = (!floatInRow && n >= 9 && rnd() < 0.6) ? idx.pop() : -1;    // floater
      const nA = Math.round(idx.length * (0.42 + rnd() * 0.16));
      const A = idx.slice(0, nA), B = idx.slice(nA);
      const amp = 0.025 * R.h, ph = rnd() * 6.283, y0 = R.y + R.h * (0.5 + (rnd() - 0.5) * 0.08);
      const wave = (x) => amp * Math.sin((x - R.x) / R.w * 5 + ph);
      const wmin = (a, b) => { let m = Infinity; for (let k = 0; k <= 6; k++) m = Math.min(m, wave(a + (b - a) * k / 6)); return m; };
      const wmax = (a, b) => { let m = -Infinity; for (let k = 0; k <= 6; k++) m = Math.max(m, wave(a + (b - a) * k / 6)); return m; };
      let xmin = R.x, xmax = R.x + R.w;

      if (S >= 0) {
        const h = R.h * (0.5 + rnd() * 0.2);
        const w = Math.min(h * fa[S], R.w * 0.3), hh = w / fa[S], left = rnd() < 0.5;
        const x = left ? R.x : R.x + R.w - w;
        const y = Math.min(R.y + R.h - hh, Math.max(R.y, y0 + (rnd() - 0.5) * 0.08 * R.h - hh / 2));
        rects.push({ i: S, x: x, y: y, w: w, h: hh });
        if (left) xmin = x + w + gap * 1.5; else xmax = x - gap * 1.5;
      }

      const capA = Math.max(40, y0 - amp - gap / 2 - 8 - R.y);
      const capB = Math.max(40, R.y + R.h - (y0 + amp + gap / 2 + 8));
      function row(list, cap, standing) {
        if (!list.length) return;
        const hs = list.map(() => 0.45 + 0.55 * Math.pow(rnd(), 0.9));            // relative heights
        const ws = list.map((i, k) => hs[k] * fa[i]);
        const sumW = ws.reduce((a, b) => a + b, 0), g = gap * (0.8 + rnd() * 0.8);
        const avail = xmax - xmin;
        const s = Math.max(8, Math.min((avail - g * (list.length - 1)) / sumW, cap / Math.max.apply(null, hs)));
        const rowW = sumW * s + g * (list.length - 1);
        let x = xmin + Math.max(0, avail - rowW) * (0.3 + 0.4 * rnd());           // centred-ish, staggered per row
        list.forEach((i, k) => {
          const w = ws[k] * s, h = hs[k] * s, jit = rnd() * 8;                      // jitter only moves AWAY from the spine
          const base = standing ? y0 + wmin(x, x + w) - gap / 2 - jit : y0 + wmax(x, x + w) + gap / 2 + jit;
          rects.push({ i: i, x: x, y: standing ? base - h : base, w: w, h: h });
          x += w + g;
        });
      }
      row(A, capA, true); row(B, capB, false);

      if (Fl >= 0) {
        let placed = false;
        for (let sc = 0; sc < 6 && !placed; sc++) {
          const h = R.h * (0.14 + rnd() * 0.1) * Math.pow(0.8, sc), w = h * fa[Fl];
          if (w > R.w * 0.3) continue;
          for (let t = 0; t < 60; t++) {
            const r = { i: Fl, x: R.x + rnd() * (R.w - w), y: R.y + rnd() * (R.h - h), w: w, h: h };
            if (rects.every((o) => !hit(r, o, gap))) { rects.push(r); placed = true; break; }
          }
        }
        if (!placed) return null;
      }
      return rects;
    }

    let rects = null;
    for (let t = 0; t < 3 && !rects; t++) rects = build(false);
    return rects || build(true);
  }

  function valid(rects, R) {
    const minSide = 0.11 * Math.min(R.w, R.h);
    for (let i = 0; i < rects.length; i++) {
      const a = rects[i];
      if (Math.sqrt(a.w * a.h) < minSide) return false;
      if (a.x < R.x - 1 || a.y < R.y - 1 || a.x + a.w > R.x + R.w + 1 || a.y + a.h > R.y + R.h + 1) return false;
      for (let j = i + 1; j < rects.length; j++) if (hit(a, rects[j], 4)) return false;
    }
    return true;
  }

  // items: [{ idx, a }]. Returns placed items: centre (x, y), size (sw, sh), crop window, bob, depth.
  function placeScene(items, R, rnd) {
    const vertical = R.h > R.w * 1.15;                  // phones: hang the wall around a vertical spine
    const RR = vertical ? { x: R.y, y: R.x, w: R.h, h: R.w } : R;
    const its = vertical ? items.map((it) => ({ a: 1 / it.a })) : items;
    let best = null;
    for (let t = 0; t < 6; t++) {
      const rects = wall(its, RR, rnd);
      best = rects;
      if (valid(rects, RR)) break;
    }
    return best.map((r) => {
      const it = items[r.i];
      const x = vertical ? r.y : r.x, y = vertical ? r.x : r.y, w = vertical ? r.h : r.w, h = vertical ? r.w : r.h;
      const fa = w / h, a = it.a;
      const us = a >= fa ? fa / a : 1, vs = a >= fa ? 1 : a / fa;        // share of the image that is visible
      return { idx: it.idx, x: x + w / 2, y: y + h / 2, sw: w, sh: h, us: us, vs: vs, z: rnd() * 0.35,
               ph: rnd() * 6.283, fy: 0.3 + rnd() * 0.35, by: 1.5 + rnd() * 2.5, pn: [-1, -1, -1, -1] };
    });
  }

  W.layout = { rng: rng, groups: groups, placeScene: placeScene, valid: valid };
})(window.SACStream = window.SACStream || {});
