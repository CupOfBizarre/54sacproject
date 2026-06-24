/* ════════════════════════════════════════════════════════════════════
   splash.js — SAC Logo Splash Screen
   8 cols × 6 rows = 48 tiles
   Camera-pull-back effect via perspective + translateZ
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const COLS     = 8;
  const ROWS     = 6;
  const TOTAL    = COLS * ROWS; // 48
  const LOGO_SRC = 'logo-sac.png';

  /* ── Detect mobile ────────────────────────────────────────────── */
  const isMobile = () => window.innerWidth <= 768;

  /* ── Z values ─────────────────────────────────────────────────── */
  function randomFarZ() {
    // Must stay well under the CSS perspective value (2600px desktop /
    // 1800px mobile) or the projection becomes invalid and tiles vanish.
    const base     = isMobile() ? 500 : 700;
    const variance = isMobile() ? 350 : 600;
    return base + (Math.random() * variance);
  }

  /* ── Build splash DOM (entry state: far away + invisible) ──────── */
  function buildSplash() {
    const splash = document.getElementById('splash-screen');
    const stage  = document.getElementById('splash-stage');
    const grid   = document.getElementById('splash-grid');

    if (!splash || !stage || !grid) return;

    grid.innerHTML = '';

    for (let i = 0; i < TOTAL; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);

      const tile = document.createElement('div');
      tile.className = 'sp-tile';
      tile.dataset.index = i;
      tile.dataset.col   = col;
      tile.dataset.row   = row;

      // Slice the logo: full image spread across an 8×6 virtual canvas,
      // each tile reveals exactly 1/8 width × 1/6 height of it.
      tile.style.backgroundImage    = `url('${LOGO_SRC}')`;
      tile.style.backgroundSize     = `${COLS * 100}% ${ROWS * 100}%`;
      tile.style.backgroundPosition = `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`;
      tile.style.backgroundRepeat   = 'no-repeat';

      // Stable stacking order — prevents tiles occluding each other mid-flight
      tile.style.zIndex = String(100 + i);

      const farZ = randomFarZ();
      tile.dataset.farZ = farZ;

      // ── Entry state: far away AND fully invisible ──────────────
      // Nothing should be visible until runFlyIn begins moving things.
      tile.style.transition = 'none';
      tile.style.transform  = `translateZ(${farZ}px)`;
      tile.style.opacity    = '0';

      grid.appendChild(tile);
    }
  }

  /* ── Phase 1: Tiles dissolve-in while flying far → near (Z:0) ──── */
  function runFlyIn(onComplete) {
    const tiles = document.querySelectorAll('.sp-tile');

    tiles.forEach((tile) => {
      const delay    = 80 + Math.random() * 900;
      const duration = 900 + Math.random() * 400;
      // Opacity arrives quickly relative to the flight, so the tile
      // "dissolves into view" early in its journey rather than
      // popping at the very end.
      const fadeDuration = Math.min(500, duration * 0.55);

      setTimeout(() => {
        tile.style.transition =
          `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), ` +
          `opacity ${fadeDuration}ms ease`;
        tile.style.transform = 'translateZ(0px)';
        tile.style.opacity   = '1';
      }, delay);
    });

    if (onComplete) setTimeout(onComplete, 2400);
  }

  /* ── Phase 2: Dissolve tiles → full logo ─────────────────────── */
  function runCrossfade(onComplete) {
    const logoFull  = document.getElementById('splash-logo-full');
    const grid      = document.getElementById('splash-grid');
    const halftone  = document.getElementById('splash-halftone');

    if (!logoFull) { if (onComplete) onComplete(); return; }

    // Full logo dissolves in: fades + un-blurs. Transform is left out
    // of this transition string on purpose — it's controlled separately
    // by the cursor-follow parallax loop, which sets its own short
    // transform transition in CSS (#splash-logo-full base rule) so the
    // two never fight over the same property.
    logoFull.style.filter     = 'blur(8px)';
    logoFull.style.transition = 'opacity 0.9s ease, filter 0.9s ease';
    logoFull.style.opacity    = '1';

    requestAnimationFrame(() => {
      logoFull.style.filter = 'blur(0px)';
    });

    // Tile grid dissolves out: fades + blurs
    grid.style.transition = 'opacity 0.7s ease, filter 0.7s ease';
    grid.style.filter     = 'blur(6px)';
    grid.style.opacity    = '0';

    // Halftone field fades in alongside the logo settling into place
    if (halftone) halftone.classList.add('is-visible');

    if (onComplete) setTimeout(onComplete, 950);
  }

  /* ── Phase 3: Show enter button ───────────────────────────────── */
  function showEnterButton() {
    const btn = document.getElementById('splash-enter-btn');
    if (!btn) return;
    btn.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    btn.style.opacity    = '1';
    btn.style.transform  = 'translate(-50%, 0px)';
  }

/* ── Fall-Toward-Viewer Flight — built from scratch ───────────────
     Distinct from runFlyIn entirely — not a mirror, a genuinely new
     piece of motion. The assembled logo (tiles at Z:0, fully visible)
     FALLS toward the viewer — each tile grows larger as it approaches
     the camera — and vanishes once it has grown past a believable
     "too close" size. This is the dedicated departure animation,
     used both by Enter Gallery and by the Home transition.          */
  function runFallToward(onComplete) {
    const tiles = document.querySelectorAll('.sp-tile');

    tiles.forEach((tile) => {
      // Falling toward viewer = increasing positive Z. Stays under
      // the perspective plane (2600px desktop / 1800px mobile) until
      // late in the flight — that close approach to the plane IS the
      // "growing huge" sensation.
      const fallZ        = isMobile() ? (1200 + Math.random() * 500) : (1900 + Math.random() * 600);
      const delay        = Math.random() * 260;
      const duration     = 650 + Math.random() * 420;
      // Fade resolves LATE — tile stays fully visible while it grows,
      // only disappearing once it's already large/close.
      const fadeDuration = Math.min(380, duration * 0.45);
      const fadeDelay    = Math.max(0, duration - fadeDuration);

      setTimeout(() => {
        tile.style.transition =
          `transform ${duration}ms cubic-bezier(0.45, 0, 0.85, 0.35), ` +
          `opacity ${fadeDuration}ms ease ${fadeDelay}ms`;
        tile.style.transform = `translateZ(${fallZ}px)`;
        tile.style.opacity   = '0';
      }, delay);
    });

    if (onComplete) setTimeout(onComplete, 1350);
  }

  /* ── Cursor-Follow Parallax + Tilt — applied to the settled flat
         logo image only, once it has fully dissolved into view.
         Subtle drift + a slight 3D tilt using the same perspective
         context already established by #splash-stage.             */
  let parallaxActive  = false;
  let parallaxHandler = null;

  function enableLogoParallax() {
    const logoFull = document.getElementById('splash-logo-full');
    const stage    = document.getElementById('splash-stage');
    if (!logoFull || !stage || parallaxActive) return;

    parallaxActive = true;

    const MAX_SHIFT = 10;   // px of translate drift
    const MAX_TILT  = 5;    // degrees of rotateX/rotateY

    parallaxHandler = function (e) {
      const rect = stage.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;

      // Normalized -1..1 offset from stage center
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width  / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));

      const shiftX = nx * MAX_SHIFT;
      const shiftY = ny * MAX_SHIFT;
      // Tilt direction: moving right tilts the top edge slightly away (rotateY),
      // moving down tilts the top edge slightly toward viewer (rotateX inverted)
      const tiltY  = nx * MAX_TILT;
      const tiltX  = -ny * MAX_TILT;

      logoFull.style.transform =
        `translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    window.addEventListener('mousemove', parallaxHandler);
  }

  function disableLogoParallax() {
    if (!parallaxActive) return;
    parallaxActive = false;

    if (parallaxHandler) {
      window.removeEventListener('mousemove', parallaxHandler);
      parallaxHandler = null;
    }

    const logoFull = document.getElementById('splash-logo-full');
    if (logoFull) {
      logoFull.style.transform = 'translate3d(0px, 0px, 0) rotateX(0deg) rotateY(0deg)';
    }
  }
  /* ── Reveal canvas (used after Enter Gallery) ─────────────────── */
  function revealCanvas() {
    const splash     = document.getElementById('splash-screen');
    const canvasRoot = document.getElementById('canvas-root');
    const macroBtn   = document.getElementById('macro-toggle-btn');

    splash.style.transition = 'opacity 0.5s ease';
    splash.style.opacity    = '0';

    setTimeout(() => {
      splash.style.display = 'none';

      if (canvasRoot) {
        canvasRoot.style.opacity    = '0';
        canvasRoot.style.transition = 'none';
        canvasRoot.style.display    = 'block';

        requestAnimationFrame(() => {
          canvasRoot.style.transition = 'opacity 0.6s ease';
          canvasRoot.style.opacity    = '1';
        });
      }

      if (macroBtn) {
        macroBtn.style.opacity    = '0';
        macroBtn.style.display    = 'flex';
        macroBtn.style.transition = 'opacity 0.6s ease 0.3s';
        requestAnimationFrame(() => { macroBtn.style.opacity = '1'; });
      }
    }, 500);
  }

function wireEnterBtn() {
    const btn      = document.getElementById('splash-enter-btn');
    const logoFull = document.getElementById('splash-logo-full');
    const grid     = document.getElementById('splash-grid');
    const halftone = document.getElementById('splash-halftone');
    if (!btn) return;

    if (btn.dataset.wired === 'true') return;
    btn.dataset.wired = 'true';

    btn.addEventListener('click', () => {
      btn.style.pointerEvents = 'none';
      disableLogoParallax();

      // Fade out the button immediately
      btn.style.transition = 'opacity 0.2s ease';
      btn.style.opacity    = '0';

      // ── Step 1: dissolve the halftone field FIRST, on its own ──
      // Explicit duration we control directly, rather than relying
      // on whatever transition is declared elsewhere in CSS.
      const HALFTONE_FADE_MS = 500;
      if (halftone) {
        halftone.style.transition = `opacity ${HALFTONE_FADE_MS}ms ease`;
        halftone.style.opacity    = '0';
      }

      // ── Step 2: only after the halftone has FULLY finished
      // dissolving do we touch the logo or split it into tiles. ──
      setTimeout(() => {
        if (logoFull) {
          logoFull.style.transition = 'opacity 0.2s ease';
          logoFull.style.opacity    = '0';
        }

        // Grid container was left at opacity:0 + blur(6px) by
        // runCrossfade — restore it now, right before the tiles
        // need to become visible and fall toward the viewer.
        if (grid) {
          grid.style.transition = 'opacity 0.2s ease, filter 0.2s ease';
          grid.style.filter     = 'blur(0px)';
          grid.style.opacity    = '1';
        }

        setTimeout(() => {
          runFallToward(revealCanvas);
        }, 220);
      }, HALFTONE_FADE_MS);
    });
  }
  /* ── Master sequence (first load) ────────────────────────────── */
  function startSequence() {
    buildSplash();

    setTimeout(() => {
      runFlyIn(() => {
        runCrossfade(() => {
          showEnterButton();
          wireEnterBtn();
          enableLogoParallax();
        });
      });
    }, 200);
  }

  /* ── Public replay hook — called from the HOME button on the
         gallery page (see infinite-canvas2.js).

         Mechanism requested: first a clean background transition
         from the dark gallery to the white splash background, THEN
         the exact same entry sequence used on first page load
         (buildSplash + runFlyIn + runCrossfade) — literally the
         same mechanism as the original startup animation.           */
  window.replaySplash = function () {
    const splash     = document.getElementById('splash-screen');
    const canvasRoot  = document.getElementById('canvas-root');
    const macroBtn    = document.getElementById('macro-toggle-btn');
    const logoFull    = document.getElementById('splash-logo-full');
    const btn         = document.getElementById('splash-enter-btn');
    const grid        = document.getElementById('splash-grid');
    const halftone    = document.getElementById('splash-halftone');

    disableLogoParallax();

    // Reset all splash internals to their pre-sequence baseline,
    // but keep #splash-screen itself transparent for a moment so we
    // can crossfade the background in cleanly rather than snapping.
    logoFull.style.transition = 'none';
    logoFull.style.opacity    = '0';
    logoFull.style.filter     = 'blur(0px)';

    btn.style.transition    = 'none';
    btn.style.opacity       = '0';
    btn.style.transform     = 'translate(-50%, 12px)';
    btn.style.pointerEvents = '';

    grid.style.transition = 'none';
    grid.style.opacity    = '0';   // tiles rebuilt invisible anyway, but
    grid.style.filter     = 'blur(0px)';

if (halftone) {
      halftone.classList.remove('is-visible');
      halftone.style.transition = 'none';
      halftone.style.opacity    = '';   // clear inline override so the
                                          // .is-visible class can take
                                          // effect again later
    }

    // Step 1 — bring the splash layer in OVER the dark gallery,
    // starting fully transparent, then crossfade its white background
    // in. This is the "clean transition between the dark gallery and
    // the white background" requested.
    splash.style.display    = 'flex';
    splash.style.transition = 'none';
    splash.style.opacity    = '0';

    requestAnimationFrame(() => {
      splash.style.transition = 'opacity 0.55s ease';
      splash.style.opacity    = '1';

      setTimeout(() => {
        // Gallery can now be fully hidden underneath
        if (canvasRoot) {
          canvasRoot.style.transition = 'none';
          canvasRoot.style.opacity    = '0';
          canvasRoot.style.display    = 'none';
        }
        if (macroBtn) macroBtn.style.display = 'none';

        // Step 2 — once the white background transition has resolved,
        // play the IDENTICAL first-load mechanism: rebuild tiles in
        // their far/invisible entry state, then runFlyIn + runCrossfade.
        //
        // The grid CONTAINER itself (not individual tiles) was left at
        // opacity:0 by the previous runCrossfade call and reset above —
        // restore it here before rebuilding, otherwise every tile
        // animates correctly underneath an invisible parent.
        grid.style.transition = 'none';
        grid.style.filter     = 'blur(0px)';
        grid.style.opacity    = '1';

        buildSplash();
        setTimeout(() => {
          runFlyIn(() => {
            runCrossfade(() => {
              showEnterButton();
              wireEnterBtn();
              enableLogoParallax();
            });
          });
        }, 150);
      }, 560);
    });
  };

  /* ── Init on DOM ready ────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startSequence);
  } else {
    startSequence();
  }

})();