// "Toprağın Mirası" stone title rising out of the real cracked ground of the title artwork.
// Layers come from the artwork itself: a plate with the wall removed, the wall (with plants) as a cut-out.
// rise(canvas, plate, wall) returns { draw(t), play(), T } with t in seconds; drawn in 1584x672 image space.
(function () {
  const W = 1584, H = 672, T = 5;
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => 1 - Math.pow(1 - clamp(x), 3);
  const mix = (a, b, k) => a + (b - a) * k;
  function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

  window.tasamiRise = function (canvas, plate, wall, opt = {}) {
    const ctx = canvas.getContext('2d');
    const r = rnd(opt.seed || 7);
    // where the rising layer sits in artwork space; defaults fit the stone title
    const WX = opt.wx ?? 147, WY = opt.wy ?? 135, BY = opt.by ?? 521, X0 = opt.x0 ?? 150, X1 = opt.x1 ?? 1452;
    const V = opt.view || [0, 0, W, H], dens = Math.max(.4, (X1 - X0) / 1302);
    const off = document.createElement('canvas'); off.width = wall.width; off.height = wall.height;
    const ox = off.getContext('2d');

    // soil texture taken from the lit foreground of the artwork
    const soil = document.createElement('canvas'); soil.width = 600; soil.height = 100;
    soil.getContext('2d').drawImage(plate, 500, 568, 600, 100, 0, 0, 600, 100);

    // the fissure along the wall's base: jagged front lip
    const lip = [];
    for (let x = X0 - 30; x <= X1 + 30; x += 14) lip.push([x, BY + (r() - .5) * 5]);

    const mh = lip.map(() => r());
    const pat = ctx.createPattern(soil, 'repeat');
    // radial cracks running out over the ground (in perspective: flatter vertically)
    const cracks = [];
    for (let i = 0; i < 26 * dens; i++) {
      const sx = mix(X0, X1, r()), side = r() < .5 ? -1 : 1, front = r() < .7;
      let x = sx, y = BY + 2, a = front ? Math.PI / 2 + (r() - .5) * 2.2 : -Math.PI / 2 + (r() - .5) * 2.4;
      const pts = [[x, y]], n = 5 + (r() * 7 | 0);
      for (let k = 0; k < n; k++) {
        a += (r() - .5) * .9; const l = 10 + r() * 26;
        x += Math.cos(a) * l * 1.6; y += Math.sin(a) * l * (front ? .5 : .18);
        if (!front && y < BY - 40) break;
        pts.push([x, y]);
      }
      cracks.push({ pts, t0: .35 + r() * .7, w: 1 + r() * 2.2, side });
    }

    // soil clods thrown out of the fissure, cut from the real ground texture
    const clods = [];
    for (let i = 0; i < 230 * dens; i++) {
      const x = mix(X0 - 10, X1 + 10, r()), big = r() < .3;
      const s = big ? 10 + r() * 16 : 3 + r() * 6;
      const vy = -(140 + r() * 420), vx = (r() - .5) * 220, back = r() < .35;
      const pts = []; const n = 5 + (r() * 3 | 0);
      for (let k = 0; k < n; k++) { const an = k / n * Math.PI * 2; const rr = s * (.6 + r() * .5); pts.push([Math.cos(an) * rr, Math.sin(an) * rr * .75]); }
      clods.push({ x, t0: .55 + Math.pow(r(), 1.6) * 2.4, vx, vy, s, pts, tx: r() * 560, ty: r() * 80, rot: r() * 6, vr: (r() - .5) * 9, back,
        land: back ? BY - 4 - r() * 14 : BY + 6 + r() * 70 * (r() < .5 ? .4 : 1) });
    }
    // dust puffs
    const dust = [];
    for (let i = 0; i < 220 * dens; i++) dust.push({ x: mix(X0 - 40, X1 + 40, r()), t0: .45 + Math.pow(r(), 1.4) * 2.3, vx: (r() - .5) * 70, vy: -(10 + r() * 40),
      s: 30 + r() * 80, life: 1.4 + r() * 1.4, c: r() < .5 ? [150, 118, 84] : [118, 94, 70] });

    function shake(t) {
      const k = clamp((t - .15) / .4) * (1 - clamp((t - 2.9) / .8));
      return [Math.sin(t * 61) * 3.2 * k + Math.sin(t * 23) * 1.5 * k, Math.sin(t * 47 + 1) * 2.4 * k];
    }
    function riseK(t) { // 0 = buried, 1 = up
      const u = clamp((t - .75) / 2.45);
      return ease(u) + Math.sin(clamp((t - 3.2) / .5) * Math.PI) * -.006;
    }
    function clod(c, x, y, sh) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(c.rot);
      ctx.beginPath(); c.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      ctx.save(); ctx.clip(); ctx.drawImage(soil, c.tx, c.ty, c.s * 3, c.s * 3, -c.s * 1.5, -c.s * 1.5, c.s * 3, c.s * 3);
      ctx.fillStyle = 'rgba(255,214,160,.16)'; ctx.fillRect(-c.s * 2, -c.s * 2, c.s * 4, c.s * 2);
      ctx.fillStyle = `rgba(0,0,0,${sh})`; ctx.fillRect(-c.s * 2, 0, c.s * 4, c.s * 2); ctx.restore();
      ctx.restore();
    }

    function draw(t) {
      const cw = canvas.width, ch = canvas.height, sc = cw / V[2];
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cw, ch);
      const [sx, sy] = shake(t);
      const Z = 1.012; ctx.setTransform(sc * Z, 0, 0, sc * Z, (sx - V[0] * Z - V[2] * (Z - 1) / 2) * sc, (sy - V[1] * Z - V[3] * (Z - 1) / 2) * sc);
      ctx.drawImage(plate, 0, 0, W, H);

      // fissure opening
      const op = clamp((t - .3) / .5);
      if (op > 0) {
        ctx.fillStyle = `rgba(14,9,6,${.85 * op})`;
        ctx.beginPath(); ctx.moveTo(lip[0][0], BY);
        lip.forEach(p => ctx.lineTo(p[0], p[1] - 6 * op)); for (let i = lip.length - 1; i >= 0; i--) ctx.lineTo(lip[i][0], lip[i][1] + 5 * op);
        ctx.closePath(); ctx.fill();
      }
      // cracks spreading
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const c of cracks) {
        const k = clamp((t - c.t0) / .5); if (k <= 0) continue;
        const n = Math.max(2, Math.ceil(c.pts.length * k));
        ctx.strokeStyle = 'rgba(16,10,7,.85)'; ctx.lineWidth = c.w;
        ctx.beginPath(); for (let i = 0; i < n; i++) i ? ctx.lineTo(c.pts[i][0], c.pts[i][1]) : ctx.moveTo(c.pts[i][0], c.pts[i][1]); ctx.stroke();
      }

      // clods that land behind the wall line are drawn before the wall
      const g = 980;
      const clodPos = c => {
        const dt = t - c.t0; if (dt <= 0) return null;
        let x = c.x + c.vx * dt, y = BY - 2 + c.vy * dt + .5 * g * dt * dt;
        const tl = (-c.vy + Math.sqrt(c.vy * c.vy + 2 * g * Math.max(c.land - BY + 2, 0))) / g;
        if (dt > tl) { x = c.x + c.vx * tl; y = c.land; }
        return [x, y, dt > tl];
      };
      for (const c of clods) if (c.back) { const p = clodPos(c); if (p && p[2]) clod(c, p[0], p[1], .25); }

      // the wall itself, rising, clipped at the fissure's front lip
      const k = riseK(t);
      if (k > 0) {
        const dy = (1 - k) * (BY - WY + 12);
        ox.globalCompositeOperation = 'source-over'; ox.globalAlpha = 1; ox.clearRect(0, 0, off.width, off.height);
        ox.drawImage(wall, 0, 0);
        const dirt = 1 - clamp((t - 1.2) / 1.6);
        if (dirt > 0) { // soil still clinging to the stone, falling away
          ox.globalCompositeOperation = 'source-atop'; ox.globalAlpha = dirt * .4;
          ox.drawImage(soil, 0, 0, 600, 100, 0, 0, off.width, off.height * .9);
          ox.globalAlpha = dirt * .3; ox.fillStyle = '#2a1d12'; ox.fillRect(0, 0, off.width, off.height);
        }
        ctx.save();
        ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(W + 20, -20); ctx.lineTo(W + 20, BY);
        for (let i = lip.length - 1; i >= 0; i--) ctx.lineTo(lip[i][0], lip[i][1]);
        ctx.lineTo(-20, BY); ctx.closePath(); ctx.clip();
        const life = clamp((t - 2.2) / 1.6);
        ctx.filter = `saturate(${mix(.25, 1, life)}) brightness(${mix(.62, 1, life)})`;
        ctx.drawImage(off, WX, WY + dy);
        ctx.filter = 'none';
        ctx.restore();
        // shadow in the fissure right at the base while rising
        const gl = ctx.createLinearGradient(0, BY - 26, 0, BY + 2);
        gl.addColorStop(0, 'rgba(10,6,4,0)'); gl.addColorStop(1, `rgba(10,6,4,${.7 * (1 - clamp((t - 3) / 1))})`);
        ctx.fillStyle = gl; ctx.fillRect(X0, BY - 26, X1 - X0, 28);
      }

      // settle onto the untouched artwork
      const fin = clamp((t - 3.7) / .9);
      if (opt.full && fin > 0) { ctx.globalAlpha = fin; ctx.drawImage(opt.full, 0, 0, W, H); ctx.globalAlpha = 1; }
      // flying and landed clods in front
      for (const c of clods) {
        const p = clodPos(c); if (!p) continue;
        if (c.back && p[2]) continue;
        clod(c, p[0], p[1], p[2] ? .18 : .05);
        if (!p[2]) c.rot += 0; // rotation is time based below
      }
      // earth heaved up along the base
      const hv = clamp((t - .6) / 1.4);
      if (hv > 0) {
        ctx.save(); ctx.fillStyle = pat; ctx.beginPath(); ctx.moveTo(lip[0][0], BY + 4);
        lip.forEach((p, i) => ctx.lineTo(p[0], p[1] - (4 + mh[i] * 12) * hv));
        ctx.lineTo(lip[lip.length - 1][0], BY + 8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(20,12,7,.35)'; ctx.fill(); ctx.restore();
      }
    // dust
      for (const d of dust) {
        const dt = t - d.t0; if (dt <= 0 || dt > d.life) continue;
        const u = dt / d.life, rad = d.s * (.35 + u * 1.1);
        const x = d.x + d.vx * dt, y = BY - 6 + d.vy * dt - u * 30;
        const al = Math.sin(u * Math.PI) * .26 * (1 - clamp((t - 3.6) / 1));
        const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(${d.c},${al})`); gr.addColorStop(1, `rgba(${d.c},0)`);
        ctx.save(); ctx.translate(x, y); ctx.scale(1.9, .8); ctx.translate(-x, -y);
        ctx.fillStyle = gr; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); ctx.restore();
      }
      // overall grade: starts dim, ends on the artwork's own light
      const dim = 1 - clamp((t - 2.4) / 1.8);
      if (dim > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(0,0,0,${dim * .38})`; ctx.fillRect(0, 0, cw, ch); }
    }
    // clod rotation driven by time without state
    const baseDraw = draw;
    function drawT(t) { for (const c of clods) c.rot = c.rot0 === undefined ? (c.rot0 = c.rot) : c.rot0;
      for (const c of clods) { const dt = t - c.t0; if (dt > 0) c.rot = c.rot0 + c.vr * Math.min(dt, .9); }
      baseDraw(t); }
    function play(onDone) {
      let s = null;
      const step = ts => { if (s === null) s = ts; const t = (ts - s) / 1000; drawT(Math.min(t, T)); if (t < T) requestAnimationFrame(step); else onDone && onDone(); };
      requestAnimationFrame(step);
    }
    return { draw: drawT, play, T };
  };
})();
