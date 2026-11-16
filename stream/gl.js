/* stream/gl.js — WebGL renderer: the one intentional heavy effect.
   Each image is a small bendable mesh. The vertex shader ripples it like water, bows it in depth
   (so edges curve and foreshorten), and leans it with the current's speed; the fragment shader
   adds a faint refraction wobble, caustic shimmer, depth fog and soft edges. A single shader
   program draws everything (≤ ~30 draws/frame). Needs same-origin images (images/manifest.js). */
(function (W) {
  'use strict';
  const N = 14;                                         // mesh cells per side

  const VS = `
attribute vec2 a_uv;
uniform vec2 u_res, u_center, u_size;
uniform float u_rot, u_time, u_phase, u_amp, u_z, u_flow, u_lite;
varying vec2 v_uv; varying float v_depth;
void main(){
  vec2 p = (a_uv - 0.5) * u_size;
  float w = sin(a_uv.x*5.0 + u_time*0.9 + u_phase)*0.6 + sin(a_uv.y*3.0 - u_time*0.7 + u_phase*1.7)*0.4;
  p.y += w * u_amp;
  p.x += sin(a_uv.y*4.0 + u_time*0.8 + u_phase) * u_amp * 0.35;
  float zl = (sin(a_uv.x*3.14159) * 0.10 + w * 0.03 * (1.0 - u_lite)) * u_flow;   // flat at rest, bows as the stream speeds up
  float sc = (1.0 + 0.45*u_z) / (1.0 + 0.45*(u_z + zl));
  float c = cos(u_rot), s = sin(u_rot);
  vec2 q = vec2(p.x*c - p.y*s, p.x*s + p.y*c) * sc;
  vec2 sp = u_center + q;
  gl_Position = vec4(sp.x/u_res.x*2.0 - 1.0, 1.0 - sp.y/u_res.y*2.0, 0.0, 1.0);
  v_uv = a_uv; v_depth = clamp(u_z + zl*1.5, 0.0, 1.0);
}`;

  const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_tex;
uniform float u_time, u_alpha, u_phase, u_vel, u_hover, u_ready, u_lite;
uniform vec2 u_uvs, u_uvo;
uniform vec3 u_fog, u_tint;
varying vec2 v_uv; varying float v_depth;
void main(){
  float k = (1.0 - u_lite) * (1.0 + u_vel * 5.0);
  vec2 wob = vec2(sin(v_uv.y*14.0 + u_time*1.1 + u_phase), cos(v_uv.x*12.0 + u_time*0.9 + u_phase)) * 0.0025 * k;
  vec2 uv = clamp(u_uvo + (v_uv + wob) * u_uvs, 0.001, 0.999);   // frame shows a moving window of the image
  vec3 col = texture2D(u_tex, uv).rgb;
  col = mix(u_tint * 0.55, col, u_ready);
  float cs = sin(v_uv.x*18.0 + u_time*1.3 + u_phase) * sin(v_uv.y*15.0 - u_time*1.1 + u_phase*2.0);
  col += vec3(0.25, 0.55, 0.55) * max(cs, 0.0) * 0.07 * (1.0 - v_depth) * (1.0 - u_lite);
  vec2 e = min(v_uv, 1.0 - v_uv);
  float edge = smoothstep(0.0, 0.04, min(e.x, e.y));
  col = mix(col, u_fog, v_depth * 0.38);
  col *= 1.0 + u_hover * 0.2;
  float a = u_alpha * edge * mix(0.55, 1.0, u_ready);
  gl_FragColor = vec4(col * a, a);
}`;

  const BG_VS = `attribute vec2 a_uv; varying vec2 v_uv; void main(){ v_uv = a_uv; gl_Position = vec4(a_uv*2.0-1.0, 0.0, 1.0); }`;
  const BG_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform float u_time, u_lite; uniform vec2 u_res; uniform vec3 u_c0, u_c1, u_glow; varying vec2 v_uv;
void main(){
  vec2 p = v_uv; float t = u_time * 0.05;
  vec3 col = mix(u_c0, u_c1, p.y*0.75 + 0.1);
  float c = sin(p.x*9.0 + t*6.0 + sin(p.y*7.0 + t*4.0)*2.0) * sin(p.y*8.0 - t*5.0 + sin(p.x*6.0 + t*3.0)*2.0);
  col += u_glow * pow(max(c, 0.0), 3.0) * 0.1 * (1.0 - u_lite);
  float v = smoothstep(1.05, 0.25, length((p - 0.5) * vec2(1.25, 1.0)));
  gl_FragColor = vec4(col * (0.35 + 0.65*v), 1.0);
}`;

  function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }

  function create(canvas, onLost) {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, premultipliedAlpha: true }) ||
               canvas.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: true });
    if (!gl) return null;
    const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

    const prog = (vs, fs) => {
      const mk = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
      const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
      gl.bindAttribLocation(p, 0, 'a_uv'); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      const U = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; U[nm] = gl.getUniformLocation(p, nm); }
      return { p: p, U: U };
    };
    let A, B;
    try { A = prog(VS, FS); B = prog(BG_VS, BG_FS); } catch (e) { console.warn('[stream] WebGL shader error, using the flat renderer:', e.message); return null; }

    // shared mesh (N×N grid) + a fullscreen quad
    const uv = [], idx = [];
    for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) uv.push(i / N, j / N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
    const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    const ibo = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    const qbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, qbo); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost && onLost(); });

    /* ── textures: 1×1 colour first, real image when decoded; only resident stories keep one ── */
    const tex = new Map();                            // story idx → { t, ready, fade, tint, loading, url, w }
    let loading = 0, stories = [], dpr = 1;
    const MAXLOAD = 3;

    function ensure(i, needW) {
      let T = tex.get(i);
      if (!T) {
        const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
        const c = hex(W.images.colorOf(stories[i]));
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([c[0]*255, c[1]*255, c[2]*255, 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        T = { t: t, ready: 0, fade: 0, tint: c, loading: false, w: 0, dead: false };
        tex.set(i, T);
      }
      const vs = W.images.variants(stories[i]);
      if (!vs.length || T.loading || loading >= MAXLOAD) return T;
      const v = W.images.pick(vs, needW * dpr);
      if (T.w >= (v.w || 1)) return T;                 // already as sharp as needed
      T.loading = true; loading++;
      const im = new Image(); im.decoding = 'async'; im.crossOrigin = 'anonymous'; im.src = v.u;
      (im.decode ? im.decode() : new Promise((res, rej) => { im.onload = res; im.onerror = rej; })).then(() => {
        if (T.dead) return;
        gl.bindTexture(gl.TEXTURE_2D, T.t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        if (isGL2) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
        T.w = v.w || im.naturalWidth; T.ready = 1;
      }).catch(() => {}).then(() => { T.loading = false; loading--; });
      return T;
    }

    function release(keep) {
      tex.forEach((T, i) => { if (!keep.has(i)) { T.dead = true; gl.deleteTexture(T.t); tex.delete(i); } });
    }

    function setViewport(w, h, ratio) {
      dpr = ratio;
      canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    const PAL = window.SAC_PAL, FOG = PAL.vec3('night-1'), C0 = PAL.vec3('night-0'), C1 = PAL.vec3('night-1'), GLOW = PAL.vec3('teal', 0.65);

    function draw(list, w, h, time, vel, lite) {
      gl.disable(gl.BLEND);
      gl.useProgram(B.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, qbo); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(B.U.u_time, time); gl.uniform1f(B.U.u_lite, lite); gl.uniform2f(B.U.u_res, w, h);
      gl.uniform3f(B.U.u_c0, C0[0], C0[1], C0[2]); gl.uniform3f(B.U.u_c1, C1[0], C1[1], C1[2]); gl.uniform3f(B.U.u_glow, GLOW[0], GLOW[1], GLOW[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.enable(gl.BLEND);
      gl.useProgram(A.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      const U = A.U;
      gl.uniform2f(U.u_res, w, h); gl.uniform1f(U.u_time, time); gl.uniform1f(U.u_lite, lite);
      gl.uniform3f(U.u_fog, FOG[0], FOG[1], FOG[2]);
      gl.activeTexture(gl.TEXTURE0); gl.uniform1i(U.u_tex, 0);
      const speed = Math.min(1, Math.abs(vel) / 0.5);
      for (let i = 0; i < list.length; i++) {
        const d = list[i]; if (d.hide) continue;
        const T = ensure(d.idx, d.iw);
        if (T.ready && T.fade < 1) T.fade = Math.min(1, T.fade + 0.03);
        const amp = (0.5 + 6 * speed) * (1 - lite * 0.8);
        gl.uniform2f(U.u_center, d.x, d.y); gl.uniform2f(U.u_size, d.sw, d.sh);
        gl.uniform1f(U.u_rot, d.rot); gl.uniform1f(U.u_phase, d.ph); gl.uniform1f(U.u_amp, amp);
        gl.uniform1f(U.u_z, d.z); gl.uniform1f(U.u_flow, speed);
        gl.uniform2f(U.u_uvs, d.us, d.vs); gl.uniform2f(U.u_uvo, d.us < 1 ? d.pan * (1 - d.us) : 0, d.vs < 1 ? d.pan * (1 - d.vs) : 0);
        gl.uniform1f(U.u_alpha, 0.72 + 0.28 * Math.min(1, T.fade + 0.4)); gl.uniform1f(U.u_vel, speed);
        gl.uniform1f(U.u_hover, d.hv || 0); gl.uniform1f(U.u_ready, T.fade);
        gl.uniform3f(U.u_tint, T.tint[0], T.tint[1], T.tint[2]);
        gl.bindTexture(gl.TEXTURE_2D, T.t);
        gl.drawElements(gl.TRIANGLES, N * N * 6, gl.UNSIGNED_SHORT, 0);
      }
    }

    return { gl: gl, setStories: (s) => { stories = s; }, setViewport: setViewport, draw: draw, release: release,
             destroy: () => { tex.forEach((T) => { T.dead = true; }); } };
  }

  W.gl = { create: create };
})(window.SACStream = window.SACStream || {});
