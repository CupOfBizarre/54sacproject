/* palette.js — reads the colour tokens from base.css so JavaScript (map regions, woven bands, WebGL
   background, placeholders) uses exactly the same palette as the stylesheets. */
(function () {
  'use strict';
  const FALLBACK = { paper: '#F4EFE4', 'paper-hi': '#FBF8F2', 'paper-2': '#E9E2D2', 'paper-3': '#D8CFBB', ink: '#123A4A', 'ink-soft': '#5B7580',
    'night-0': '#030D12', 'night-1': '#06181E', 'night-2': '#0B2A30', teal: '#1F8A84', mint: '#8CC9B8', sky: '#5B9BD0',
    indigo: '#2C5F8A', coral: '#E8806A', sand: '#C9A35E' };
  const cache = {};
  function get(name) {
    if (!cache[name]) {
      let v = '';
      try { v = getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim(); } catch (_) {}
      cache[name] = /^#[0-9a-f]{6}$/i.test(v) ? v.toUpperCase() : FALLBACK[name];
    }
    return cache[name];
  }
  const rgb = (name) => { const n = parseInt(get(name).slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const vec3 = (name, k) => rgb(name).map((c) => c / 255 * (k || 1));
  function mix(a, b, t) {                       // t = share of b (0..1); a, b = token names
    const A = rgb(a), B = rgb(b);
    return '#' + A.map((c, i) => Math.round(c * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join('');
  }
  window.SAC_PAL = { get: get, rgb: rgb, vec3: vec3, mix: mix };
})();
