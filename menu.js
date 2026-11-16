/* menu.js — the logo menu. Click the SẮC logo (intro) or the MENU button (map): the screen darkens and
   the woven menu appears. While it is open the logo stops tracing the cursor. Esc, the lozenge × or a
   click on the dark background closes it. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const menu = $('sac-menu'), screen = $('splash-screen');
  if (!menu || !screen) return;
  const items = Array.prototype.slice.call(menu.querySelectorAll('.sac-item'));
  let isOn = false, hideT = 0, back = null;

  // woven bands: one seeded brocade tile per row, and a vertical rail down the edge
  (function skin() {
    const S = window.SACStream;
    if (!S || !S.weave) return;
    items.forEach((b, i) => { b.nextElementSibling.style.backgroundImage = S.weave.tile(11 + i * 12); });
    $('sac-rail').style.backgroundImage = S.weave.tile(77, true);
  })();

  function open() {
    if (isOn) return;
    isOn = true; clearTimeout(hideT);
    if (window.SacSplash) window.SacSplash.pauseLogo();           // the logo stops following the cursor
    const view = window.SacSplash ? window.SacSplash.view() : 'intro';
    items.forEach((b) => { if (b.dataset.act === 'map') b.setAttribute('aria-current', view === 'map' ? 'true' : 'false'); });
    back = document.activeElement;
    menu.classList.add('on'); menu.setAttribute('aria-hidden', 'false'); screen.classList.add('menu-open');
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('show')));   // darken first, then weave in
    setTimeout(() => { if (isOn) (menu.querySelector('.sac-item:not([data-soon])') || $('sac-close')).focus({ preventScroll: true }); }, 500);
  }

  function close(quick) {
    if (!isOn) return;
    isOn = false;
    menu.classList.remove('show'); screen.classList.remove('menu-open');
    hideT = setTimeout(() => { menu.classList.remove('on'); menu.setAttribute('aria-hidden', 'true'); }, quick ? 280 : 650);
    if (window.SacSplash) window.SacSplash.resumeLogo();
    if (back && back.focus && !quick) back.focus({ preventScroll: true });
  }

  items.forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.soon !== undefined) return;                      // not built yet
    const S = window.SacSplash;
    if (S) { if (b.dataset.act === 'gallery') S.gallery(); else if (b.dataset.act === 'map') S.map(); }
    close(true);
  }));
  $('sac-close').addEventListener('click', () => close());
  menu.addEventListener('click', (e) => { if (e.target === menu || e.target.id === 'sac-veil' || e.target.id === 'sac-lattice') close(); });
  const mb = $('map-menu-btn'); if (mb) mb.addEventListener('click', open);

  window.addEventListener('keydown', (e) => {
    if (!isOn) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const live = items.filter((b) => b.dataset.soon === undefined), i = live.indexOf(document.activeElement);
      live[(i + (e.key === 'ArrowDown' ? 1 : -1) + live.length) % live.length].focus();
    }
  });

  window.SacMenu = { open: open, close: close, isOpen: () => isOn };
})();
