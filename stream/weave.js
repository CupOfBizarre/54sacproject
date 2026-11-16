/* stream/weave.js — procedural thổ cẩm (brocade) motifs for the viewer.
   Each story gets its own pattern (diamond / zigzag / stepped / cross) and colour pair, seeded by
   its id, so the modal reads as a woven textile: one thread per story, a thousand ways to weave. */
(function (W) {
  'use strict';
  const PAL = ['teal', 'coral', 'sand', 'ink', 'sky', 'mint'].map((n) => window.SAC_PAL.get(n));   // site palette (base.css)
  const CREAM = window.SAC_PAL.get('paper');
  const MOTIFS = [
    (a, b) => '<polygon points="12,3 21,12 12,21 3,12" fill="' + a + '"/><polygon points="12,8 16,12 12,16 8,12" fill="' + b + '"/>',
    (a, b) => '<polyline points="0,15 6,7 12,15 18,7 24,15" fill="none" stroke="' + a + '" stroke-width="3"/><circle cx="12" cy="20" r="1.8" fill="' + b + '"/>',
    (a, b) => '<path d="M3 20h6v-6h6v-6h6" fill="none" stroke="' + a + '" stroke-width="3"/><rect x="2" y="4" width="4" height="4" fill="' + b + '"/>',
    (a, b) => '<rect x="9" y="3" width="6" height="18" fill="' + a + '"/><rect x="3" y="9" width="18" height="6" fill="' + a + '"/><rect x="10.5" y="10.5" width="3" height="3" fill="' + b + '"/>'
  ];
  const hash = (n) => { n = Math.imul((n | 0) ^ 61, 0x45d9f3b); n = Math.imul(n ^ (n >>> 16), 0x45d9f3b); return (n ^ (n >>> 16)) >>> 0; };

  // 24×24 repeating tile as a CSS background-image value
  function tile(seed, vertical) {
    const h = hash(seed), a = PAL[h % PAL.length];
    let b = PAL[(h >>> 3) % PAL.length]; if (b === a) b = PAL[(h % PAL.length + 2) % PAL.length];
    const rim = PAL[(h >>> 6) % PAL.length];
    const body = '<rect width="24" height="24" fill="' + CREAM + '"/>' + MOTIFS[(h >>> 9) % MOTIFS.length](a, b) +
      '<rect width="24" height="2" fill="' + rim + '"/><rect y="22" width="24" height="2" fill="' + rim + '"/>';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      (vertical ? '<g transform="rotate(90 12 12)">' + body + '</g>' : body) + '</svg>';
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }
  W.weave = { tile: tile, hash: hash };
})(window.SACStream = window.SACStream || {});
