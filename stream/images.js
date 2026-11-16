/* stream/images.js — image helpers shared by the renderers.
   images/manifest.js (tools/build-images.mjs) gives each story's real size, dominant colour and
   WebP variants; without it we fall back to story.src / story.aspect. */
(function (W) {
  'use strict';
  const M = () => window.SAC_IMAGES || {};
  const GLOW = ['teal', 'sky', 'coral', 'sand', 'mint'].map((n) => window.SAC_PAL.get(n));   // placeholder colours (site palette)

  function variants(story) {
    const m = M()[story.id];
    if (m) return m.v.map((v) => ({ u: v.u, w: v.w }));
    return story.src ? [{ u: story.src, w: 0 }] : [];
  }
  function pick(vs, needW) {                 // smallest variant at least needW px wide
    for (let k = 0; k < vs.length; k++) if (!vs[k].w || vs[k].w >= needW) return vs[k];
    return vs[vs.length - 1];
  }
  const colorOf = (st) => (M()[st.id] ? M()[st.id].color : GLOW[st.id % GLOW.length]);

  // The image's REAL size: from the manifest, else probed from the file itself. The story's `aspect`
  // field is only a last resort — trusting it is what used to stretch/crop images to a wrong ratio.
  const probed = {}, pending = {};
  function fallbackSize(st) {
    const p = String(st.aspect || '2:3').split(':').map(Number);
    return { w: 1000 * ((p[0] / p[1]) || 0.667), h: 1000, guess: true };
  }
  function sizeOf(st) { const m = M()[st.id]; return m ? { w: m.w, h: m.h } : (probed[st.id] || null); }
  const known = (st) => !!sizeOf(st);
  const aspectOf = (st) => { const s = sizeOf(st) || fallbackSize(st); return s.w / s.h; };
  function probe(st) {                          // resolves once the natural size is known (or gave up)
    if (known(st)) return Promise.resolve();
    if (pending[st.id]) return pending[st.id];
    return (pending[st.id] = new Promise((res) => {
      const vs = variants(st);
      let fin = false;
      const done = (ok, im) => { if (fin) return; fin = true; probed[st.id] = ok && im.naturalWidth ? { w: im.naturalWidth, h: im.naturalHeight } : fallbackSize(st); res(); };
      if (!vs.length) return done(false);
      const im = new Image();
      im.onload = () => done(true, im); im.onerror = () => done(false);
      im.src = vs[0].u;
      setTimeout(() => done(false), 3500);
    }));
  }
  const hasManifest = (st) => !!M()[st.id];
  function preload(url) {
    return new Promise((res) => {
      const im = new Image(); im.decoding = 'async'; im.src = url;
      (im.decode ? im.decode() : Promise.resolve()).then(() => res(url), () => res(null));
    });
  }
  W.images = { variants: variants, pick: pick, colorOf: colorOf, aspectOf: aspectOf, sizeOf: sizeOf, known: known, probe: probe, hasManifest: hasManifest, preload: preload };
})(window.SACStream = window.SACStream || {});
