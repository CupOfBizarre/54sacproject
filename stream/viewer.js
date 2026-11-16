/* stream/viewer.js — story viewer ("thổ cẩm" brocade design).
   • The image is ALWAYS shown whole at its real aspect ratio (contain-fit, never stretched).
   • Opening is a distortion-free fly-in: the full image is scaled/translated so the part visible in
     its stream frame lands exactly on that frame, then a clip-path reveals the rest (no layout, no crop).
   • A strip of threads (one per story, in the image's own colour) navigates the whole collection. */
(function (W) {
  'use strict';
  let stories = [], hooks = {}, cur = -1, isOpen = false, busy = false, opener = null;
  const el = {};
  const $ = (id) => document.getElementById(id);
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHash(id) {
    try { history.replaceState(null, '', id == null ? location.pathname + location.search : '#story-' + id); } catch (_) {}
  }

  // contain-fit the whole image inside the stage, by its REAL size
  function place(i) {
    const s = W.images.sizeOf(stories[i]) || { w: 2, h: 3 }, a = s.w / s.h;
    const r = el.stage.getBoundingClientRect(), w = Math.min(r.width, r.height * a), h = w / a;
    const L = r.left + (r.width - w) / 2, T = r.top + (r.height - h) / 2;
    Object.assign(el.img.style, { left: L + 'px', top: T + 'px', width: w + 'px', height: h + 'px' });
    // woven strip around the image: top, right, bottom, left (gap g from the image, thickness t)
    const g = 9, t = 16, S = el.frame.children;
    const set = (n, x, y, ww, hh) => Object.assign(S[n].style, { left: x + 'px', top: y + 'px', width: ww + 'px', height: hh + 'px' });
    set(0, L - g - t, T - g - t, w + 2 * (g + t), t); set(1, L + w + g, T - g, t, h + 2 * g);
    set(2, L - g - t, T + h + g, w + 2 * (g + t), t); set(3, L - g - t, T - g, t, h + 2 * g);
    return { L: L, T: T, W: w, H: h };
  }

  function fill(i) {
    const s = stories[i], tile = W.weave.tile(s.id);
    el.tag.textContent = s.tag || ''; el.title.textContent = s.title || ''; el.sub.textContent = s.subtitle || '';
    el.body.innerHTML = s.content || ''; el.panel.scrollTop = 0; el.like.classList.remove('liked');
    el.bandTop.style.backgroundImage = tile; el.bandBot.style.backgroundImage = W.weave.tile(s.id + 7);
    const S = el.frame.children, hz = W.weave.tile(s.id), vt = W.weave.tile(s.id, true);
    S[0].style.backgroundImage = hz; S[2].style.backgroundImage = hz; S[1].style.backgroundImage = vt; S[3].style.backgroundImage = vt;
    el.threads.querySelectorAll('.v-th').forEach((b, k) => b.classList.toggle('on', k === i));
  }

  function load(i, F) {
    const vs = W.images.variants(stories[i]);
    if (!vs.length) return;
    el.img.src = W.images.pick(vs, 480).u;
    const hi = W.images.pick(vs, F.W * (window.devicePixelRatio || 1)).u;
    if (hi !== el.img.getAttribute('src')) W.images.preload(hi).then((u) => { if (u && isOpen && cur === i) el.img.src = u; });
  }

  // Fly the full image between its viewer rect F and a stream frame d (position, size, crop window, pan).
  function flip(d, F, dir, done) {
    const Wd = d.sw / d.us, Hd = d.sh / d.vs, k = Wd / F.W;                    // on-screen size of the whole image in the frame
    const u0 = d.us < 1 ? d.pan * (1 - d.us) : 0, v0 = d.vs < 1 ? d.pan * (1 - d.vs) : 0;
    const tx = d.x - d.sw / 2 - u0 * Wd - F.L, ty = d.y - d.sh / 2 - v0 * Hd - F.T;
    const clip = 'inset(' + v0 * F.H + 'px ' + (1 - u0 - d.us) * F.W + 'px ' + (1 - v0 - d.vs) * F.H + 'px ' + u0 * F.W + 'px)';
    const f = [{ transform: 'translate(' + tx + 'px,' + ty + 'px) scale(' + k + ')', clipPath: clip },
               { transform: 'none', clipPath: 'inset(0px 0px 0px 0px)' }];
    if (dir === 'out') f.reverse();
    const a = el.img.animate(f, { duration: reduce() ? 1 : 700, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' });
    a.onfinish = () => { if (dir === 'in') a.cancel(); done && done(); };
  }

  function open(i, d) {
    if (isOpen || busy || i < 0) return;
    busy = isOpen = true; cur = i; opener = document.activeElement;
    fill(i);
    el.root.classList.add('open'); el.root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-open');                       // HOME steps aside so it never covers the close button
    const F = place(i);
    el.img.style.opacity = 1; load(i, F);
    setHash(stories[i].id);
    hooks.hold && hooks.hold(true, i);
    requestAnimationFrame(() => el.root.classList.add('show'));
    if (d) flip(d, F, 'in', () => { busy = false; }); else busy = false;
    el.close.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen || busy) return;
    busy = true;
    el.root.classList.remove('show'); setHash(null);
    const d = W.flow.find(cur), F = place(cur);
    const finish = () => {
      el.root.classList.remove('open'); el.root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('viewer-open');
      el.img.removeAttribute('src');
      isOpen = busy = false; hooks.hold && hooks.hold(false, -1);
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
    if (d) flip(d, F, 'out', finish); else { el.img.style.opacity = 0; setTimeout(finish, 260); }
  }

  function goTo(i) {
    if (!isOpen || busy || i === cur) return;
    busy = true;
    el.img.style.opacity = 0;
    hooks.reveal && hooks.reveal(i);                      // carries the stream to that story's scene
    setTimeout(() => {
      cur = i; fill(i);
      const F = place(i); load(i, F);
      el.img.style.opacity = 1; setHash(stories[i].id); busy = false;
    }, reduce() ? 1 : 220);
  }
  const go = (dir) => goTo((cur + dir + stories.length) % stories.length);

  function init(list, h) {
    stories = list; hooks = h || {};
    ['viewer', 'v-stage', 'v-img', 'v-frame', 'v-panel', 'v-close', 'v-tag', 'v-title', 'v-sub', 'v-body', 'v-like', 'v-threads', 'v-band-top', 'v-band-bot']
      .forEach((id) => { el[id.replace(/^v-/, '').replace(/-(\w)/g, (_, c) => c.toUpperCase())] = $(id); });
    el.root = $('viewer'); el.stage = $('v-stage');
    // one thread per story, coloured by its image (the whole collection as a woven strip)
    stories.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'v-th'; b.title = s.title || ''; b.setAttribute('aria-label', s.title || ('Story ' + (i + 1)));
      b.style.setProperty('--c', W.images.colorOf(s)); b.style.setProperty('--i', Math.min(i, 70));
      b.onclick = () => goTo(i);
      el.threads.appendChild(b);
    });
    el.close.onclick = close; $('v-scrim').onclick = close;
    $('v-prev').onclick = () => go(-1); $('v-next').onclick = () => go(1);
    el.like.onclick = () => el.like.classList.toggle('liked');
    $('v-share').onclick = () => { try { navigator.clipboard.writeText(location.href); } catch (_) {} };
    window.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') go(1); else if (e.key === 'ArrowLeft') go(-1);
    });
    let sx = 0, sy = 0;
    el.root.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
    el.root.addEventListener('pointerup', (e) => {
      if (!isOpen || el.panel.contains(e.target)) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 50) go(dx < 0 ? 1 : -1);
    });
    window.addEventListener('resize', () => { if (isOpen && !busy) place(cur); });
  }
  W.viewer = { init: init, open: open, close: close, isOpen: () => isOpen, settled: () => isOpen && !busy };
})(window.SACStream = window.SACStream || {});
