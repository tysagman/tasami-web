// Tasami emblem breaking up through dry, cracking soil. Drawn on a canvas.
// burst(canvas, img, {seed}) returns { draw(t) } where t is seconds since start;
// play() drives it with requestAnimationFrame.
(function () {
  function rnd(seed) {
    let s = seed >>> 0 || 1;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => 1 - Math.pow(1 - clamp(x), 3);
  const easeIO = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const mix = (a, b, k) => a + (b - a) * k;
  const mixc = (a, b, k) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], k))).join(',')})`;

  function burst(cv, img, opt = {}) {
    const R = rnd(opt.seed || 11);
    const W = 640, H = 420;                 // logical size
    const cx = W / 2, gy = 300;             // ground centre
    const RX = 300, RY = 62;                // ground ellipse
    const HX = 92, HY = 22;                 // hole
    const LOGO = 168;
    const ctx = cv.getContext('2d');
    const DRY = [178, 140, 92], DRY2 = [120, 88, 52], GREEN = [96, 140, 52], GREEN2 = [58, 92, 34];

    // soil texture (top view, squashed later)
    const tex = document.createElement('canvas'); tex.width = 640; tex.height = 640;
    const tc = tex.getContext('2d');
    for (let i = 0; i < 2600; i++) {
      const x = R() * 640, y = R() * 640, r = .6 + R() * 2.4;
      tc.fillStyle = `rgba(${R() < .5 ? '60,40,20' : '235,205,160'},${.06 + R() * .16})`;
      tc.beginPath(); tc.arc(x, y, r, 0, 7); tc.fill();
    }
    tc.strokeStyle = 'rgba(70,46,22,.55)'; tc.lineCap = 'round';
    for (let i = 0; i < 70; i++) {       // dry-mud cracks
      let x = R() * 640, y = R() * 640; tc.lineWidth = .6 + R() * 1.4; tc.beginPath(); tc.moveTo(x, y);
      for (let k = 0; k < 5; k++) { x += (R() - .5) * 40; y += (R() - .5) * 40; tc.lineTo(x, y); }
      tc.stroke();
    }

    // radial cracks from the centre
    const cracks = [];
    for (let i = 0; i < 13; i++) {
      const a = (i / 13) * Math.PI * 2 + (R() - .5) * .35, len = .55 + R() * .45, pts = [[0, 0]];
      let r = 0, ang = a;
      while (r < len) { r += .06 + R() * .07; ang += (R() - .5) * .35; pts.push([Math.cos(ang) * r, Math.sin(ang) * r]); }
      const br = [];
      if (R() < .7) { const j = 2 + Math.floor(R() * (pts.length - 3)); let [bx, by] = pts[j], ba = ang + (R() < .5 ? .9 : -.9); const b = [[bx, by]]; for (let k = 0; k < 3; k++) { bx += Math.cos(ba) * .07; by += Math.sin(ba) * .07; ba += (R() - .5) * .5; b.push([bx, by]); } br.push(b); }
      cracks.push({ pts, br, w: 1.2 + R() * 2.2, d: R() * .25 });
    }
    // chunks: wedges of the hole area (unit coords, 1 = ground radius)
    const chunks = [];
    const rings = [[0, .4, 6], [.4, .75, 10], [.75, 1.1, 14], [1.1, 1.45, 18]];
    const hr = HX / RX;
    for (const [r0, r1, n] of rings) {
      const off = R() * 6;
      for (let i = 0; i < n; i++) {
        const a0 = off + (i / n) * Math.PI * 2, a1 = off + ((i + 1) / n) * Math.PI * 2;
        const j = () => 1 + (R() - .5) * .18, ja = () => (R() - .5) * .12;
        const q = [[a0 + ja(), r0 * hr * j()], [a1 + ja(), r0 * hr * j()], [a1 + ja(), r1 * hr * j()], [(a0 + a1) / 2, r1 * hr * (1.05 + R() * .12)], [a0 + ja(), r1 * hr * j()]];
        const base = q.map(([a, r]) => [Math.cos(a) * r, Math.sin(a) * r]);
        const poly = [];
        base.forEach((p0, k) => { const p1 = base[(k + 1) % base.length]; poly.push(p0); poly.push([(p0[0] + p1[0]) / 2 + (R() - .5) * .012, (p0[1] + p1[1]) / 2 + (R() - .5) * .012]); });
        const am = (a0 + a1) / 2, rm = (r0 + r1) / 2 * hr, f = 1.25 - r0 * .45;
        chunks.push({ poly, am, rm, su: (.35 + R() * .4) * f, vh: (220 + R() * 240) * f, vr: (R() - .5) * 5, t0: 1.04 + r0 * .08 + R() * .1, th: 10 + R() * 8 });
      }
    }
    // small debris, dust, grass
    const debris = Array.from({ length: 90 }, () => {
      const a = R() * Math.PI * 2, sp = 80 + R() * 320;
      return { a, vx: Math.cos(a) * sp, vy: -(150 + R() * 420), s: 1.5 + R() * 4.5, t0: 1.0 + R() * .45, c: R() < .5 ? DRY : DRY2, rot: R() * 6 };
    });
    const dust = Array.from({ length: 46 }, () => {
      const a = R() * Math.PI * 2;
      return { a, sp: 30 + R() * 110, up: 20 + R() * 70, r: 18 + R() * 46, t0: .95 + R() * .5, life: 1.6 + R() * 1.4 };
    });
    const grass = Array.from({ length: 160 }, () => {
      const a = R() * Math.PI * 2, r = (HX / RX) * 1.05 + Math.pow(R(), 1.6) * .75;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r, h: 5 + R() * 13, lean: (R() - .5) * 6, c: [GREEN, GREEN2, [140, 190, 70], [110, 170, 60]][Math.floor(R() * 4)], t0: 2.55 + r * 1.1 + R() * .3 };
    });

    const P = (u, v) => [cx + u * RX, gy + v * RY]; // unit ground coords -> screen

    function groundPath() { ctx.beginPath(); ctx.ellipse(cx, gy, RX, RY, 0, 0, Math.PI * 2); }

    function drawChunks(front, t, bulge, green) {
      // chunks breaking off and tumbling away (drawn in front)
      for (const c of chunks) {
        if ((Math.sin(c.am) >= 0) !== front) continue;
        const dt = t - c.t0; if (dt <= 0) continue;
        // fly in ground-plane coordinates, land on the surface and stay
        const tl = 2 * c.vh / 900, ft = Math.min(dt, tl);
        const r = c.rm + c.su * ft, h = Math.max(0, c.vh * ft - 450 * ft * ft);
        const [x, y0] = P(Math.cos(c.am) * r, Math.sin(c.am) * r);
        const y = y0 - h - (dt < .1 ? bulge : 0), rot = c.vr * ft;
        const alpha = Math.min(clamp(1 - green * 1.3), r < .98 ? 1 : clamp((1.15 - r) / .17)); if (alpha <= 0) continue;
        ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot);
        const pts = c.poly.map(([u, v]) => [(u - Math.cos(c.am) * c.rm) * RX * .62, (v - Math.sin(c.am) * c.rm) * RX * .42]);
        ctx.fillStyle = 'rgb(74,50,26)';
        ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py + c.th) : ctx.moveTo(px, py + c.th)); ctx.closePath(); ctx.fill();
        for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(bx, by + c.th); ctx.lineTo(ax, ay + c.th); ctx.closePath(); ctx.fillStyle = i % 2 ? 'rgb(96,66,36)' : 'rgb(82,56,30)'; ctx.fill(); }
        ctx.fillStyle = mixc(DRY, DRY2, .15);
        ctx.beginPath(); pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath(); ctx.fill();
        ctx.save(); ctx.clip(); ctx.globalAlpha = alpha * .85; ctx.drawImage(tex, -50, -30, 100, 60); ctx.restore();
        ctx.strokeStyle = 'rgba(40,24,10,.6)'; ctx.lineWidth = 1; ctx.stroke();
        ctx.restore();
      }
    }

    function draw(t) {
      const dpr = cv.width / W;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // rumble before the break
      const shake = t > .25 && t < 1.15 ? (1.15 - t) * 4 * Math.sin(t * 90) : 0;
      ctx.save(); ctx.translate(shake, Math.abs(shake) * .4);

      const green = ease((t - 2.5) / 1.4);
      const top = mixc(DRY, GREEN, green), dark = mixc(DRY2, GREEN2, green);
      const bulge = t < 1.1 ? ease((t - .3) / .8) * 10 : Math.max(0, 10 - (t - 1.1) * 60);
      const open = ease((t - 1.05) / .35);       // hole opening
      const rise = easeIO((t - 1.1) / 1.25);    // logo rising
      const life = ease((t - 2.15) / 1.0);      // logo stone -> colour

      // ground body (side thickness) and top surface
      ctx.save();
      const g = ctx.createRadialGradient(cx, gy, 10, cx, gy, RX);
      g.addColorStop(0, top); g.addColorStop(.7, dark); g.addColorStop(1, 'rgba(0,0,0,0)');
      groundPath(); ctx.fillStyle = g; ctx.fill();
      groundPath(); ctx.clip();
      ctx.globalAlpha = .9 - green * .5;
      ctx.drawImage(tex, cx - RX, gy - RY, RX * 2, RY * 2);
      ctx.globalAlpha = 1;
      // bulge highlight
      if (bulge > 0) { const bg = ctx.createRadialGradient(cx, gy - bulge, 4, cx, gy, HX * 1.4); bg.addColorStop(0, 'rgba(255,230,190,.35)'); bg.addColorStop(1, 'rgba(255,230,190,0)'); ctx.fillStyle = bg; ctx.fillRect(cx - RX, gy - RY - 20, RX * 2, RY * 2 + 40); }
      // cracks spreading out
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const c of cracks) {
        const k = ease((t - .45 - c.d) / .7); if (k <= 0) continue;
        const n = Math.max(2, Math.ceil(c.pts.length * k));
        ctx.strokeStyle = `rgba(30,18,8,${.85 - green * .4})`; ctx.lineWidth = c.w * (1 + open * .6);
        ctx.beginPath(); c.pts.slice(0, n).forEach(([u, v], i) => { const [x, y] = P(u, v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
        if (k > .7) for (const b of c.br) { ctx.lineWidth = c.w * .6; ctx.beginPath(); b.forEach(([u, v], i) => { const [x, y] = P(u, v); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); }
      }
      // grass spreading from the rim
      for (const s of grass) {
        const k = ease((t - s.t0) / .6); if (k <= 0) continue;
        const [x, y] = P(s.x, s.y);
        ctx.strokeStyle = mixc(s.c, s.c, 0); ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s.lean * .3, y - s.h * k * .6, x + s.lean * k, y - s.h * k); ctx.stroke();
      }
      ctx.restore();

      // hole
      if (open > 0) {
        ctx.save();
        const hx = HX * open, hy = HY * open;
        ctx.beginPath(); ctx.ellipse(cx, gy, hx, hy, 0, 0, Math.PI * 2);
        const hg = ctx.createRadialGradient(cx, gy + 4, 2, cx, gy, hx);
        hg.addColorStop(0, '#000'); hg.addColorStop(.75, '#120a04'); hg.addColorStop(1, mixc([70, 46, 22], GREEN2, green));
        ctx.fillStyle = hg; ctx.fill();
        ctx.restore();
      }

      drawChunks(false, t, bulge, green);

      // logo rising out of the hole: clipped below the hole's front rim
      if (rise > 0) {
        const ly = mix(gy + LOGO * .55, gy - LOGO * .78 - 18, rise);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, W, gy);
        ctx.ellipse(cx, gy, HX * open + 2, HY * open + 1, 0, 0, Math.PI);
        ctx.clip();
        const tilt = (1 - rise) * .12 * Math.sin(t * 7);
        ctx.translate(cx, ly + LOGO / 2); ctx.rotate(tilt);
        ctx.filter = `grayscale(${1 - life}) sepia(${(1 - life) * .3}) brightness(${mix(.72, 1, life)}) contrast(${mix(1.15, 1, life)})`;
        ctx.shadowColor = `rgba(255,255,255,${life * .15})`; ctx.shadowBlur = 40 * life;
        ctx.save(); ctx.beginPath(); ctx.arc(0, 0, LOGO / 2 - 1, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, -LOGO / 2, -LOGO / 2, LOGO, LOGO); ctx.restore();
        ctx.filter = 'none';
        // soil still clinging to the logo, falling away
        if (life < 1) {
          ctx.globalAlpha = (1 - life) * .55;
          ctx.fillStyle = 'rgb(120,88,52)';
          ctx.beginPath(); ctx.arc(0, 0, LOGO / 2, 0, Math.PI * 2); ctx.clip();
          ctx.drawImage(tex, -LOGO / 2, -LOGO / 2, LOGO, LOGO);
        }
        ctx.restore();
      }

      drawChunks(true, t, bulge, green);
      // pebbles
      for (const d of debris) {
        const dt = t - d.t0; if (dt <= 0 || dt > 1.6) continue;
        const x = cx + Math.cos(d.a) * 20 + d.vx * dt, y = gy - 4 + d.vy * dt + 700 * dt * dt;
        if (y > gy + RY * .9) continue;
        ctx.save(); ctx.translate(x, y); ctx.rotate(d.rot + dt * 8); ctx.fillStyle = mixc(d.c, d.c, 0);
        ctx.globalAlpha = clamp(1.6 - dt); ctx.fillRect(-d.s / 2, -d.s / 2, d.s, d.s * .8); ctx.restore();
      }
      // dust cloud
      for (const d of dust) {
        const dt = t - d.t0; if (dt <= 0 || dt > d.life) continue;
        const k = dt / d.life;
        const x = cx + Math.cos(d.a) * (30 + d.sp * ease(k) * 1.6), y = gy - 6 - d.up * ease(k) + Math.sin(d.a) * 14;
        const r = d.r * (.4 + k * 1.3);
        const dg = ctx.createRadialGradient(x, y, 0, x, y, r);
        dg.addColorStop(0, `rgba(196,160,110,${.28 * (1 - k)})`); dg.addColorStop(1, 'rgba(196,160,110,0)');
        ctx.fillStyle = dg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.restore();
    }

    function play(onDone) {
      const t0 = performance.now(); let done = false;
      const step = now => {
        const t = (now - t0) / 1000; draw(t);
        if (t < 4.2) requestAnimationFrame(step); else if (!done) { done = true; onDone && onDone(); }
      };
      requestAnimationFrame(step);
    }
    return { draw, play, W, H };
  }
  window.tasamiBurst = burst;
})();
