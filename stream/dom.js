/* stream/dom.js — flat fallback renderer (no WebGL / no manifest / slow device).
   Same simulation and placement; each drawable is a positioned <img> with a transform. */
(function (W) {
  'use strict';
  function create(host) {
    host.textContent = '';
    const els = new Map(), free = [];
    let stories = [], stamp = 0;

    function make() {
      const el = document.createElement('div'); el.className = 's-card';
      const img = document.createElement('img'); img.alt = ''; img.draggable = false; img.decoding = 'async';
      el.appendChild(img);
      return { el: el, img: img, idx: -1 };
    }

    function draw(list, w, h) {
      stamp++;
      for (let i = 0; i < list.length; i++) {
        const d = list[i], key = d.scene * 100003 + d.idx;
        let c = els.get(key);
        if (!c) {
          c = free.pop() || make(); c.key = key; els.set(key, c);
          const vs = W.images.variants(stories[d.idx]);
          c.img.src = vs.length ? W.images.pick(vs, d.iw * (window.devicePixelRatio || 1)).u : '';
          c.el.style.background = W.images.colorOf(stories[d.idx]);
          c.el.style.width = d.sw + 'px'; c.el.style.height = d.sh + 'px';
          host.appendChild(c.el);
        }
        c.stamp = stamp;
        const hv = 1 + (d.hv || 0) * 0.04;
        c.el.style.transform = 'translate3d(' + (d.x - d.sw / 2) + 'px,' + (d.y - d.sh / 2) + 'px,0) scale(' + hv + ')';
        // the image-track effect: the picture pans inside its frame (object-position) as the frame moves
        c.img.style.objectPosition = (d.us < 1 ? d.pan * 100 : 50) + '% ' + (d.vs < 1 ? d.pan * 100 : 50) + '%';
        c.el.style.opacity = d.hide ? '0' : String(0.55 + 0.45 * (1 - d.z));
        c.el.style.zIndex = String(i);
      }
      els.forEach((c, k) => { if (c.stamp !== stamp) { c.el.remove(); els.delete(k); free.push(c); } });
    }
    return { draw: draw, setStories: (s) => { stories = s; }, setViewport: () => {}, release: () => {}, destroy: () => { host.textContent = ''; els.clear(); } };
  }
  W.dom = { create: create };
})(window.SACStream = window.SACStream || {});
