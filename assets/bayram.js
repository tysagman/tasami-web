/* 29 Ekim Cumhuriyet Bayramı teması · 30 Ekim 00:00 (TR) itibarıyla kendiliğinden kapanır */
(() => {
  const START = Date.UTC(2026, 9, 28, 21), END = Date.UTC(2026, 9, 29, 21); // 29 Ekim 00:00 – 30 Ekim 00:00, UTC+3
  const preview = /[?&]bayram=1/.test(location.search);
  const root = document.documentElement;
  if (!preview && (Date.now() < START || Date.now() >= END)) { root.classList.remove('bayram'); return; }
  root.classList.add('bayram');

  const $ = (s, r = document) => r.querySelector(s);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const en = root.lang === 'en';
  const me = $('script[src$="assets/bayram.js"]');
  const base = me ? me.getAttribute('src').replace('assets/bayram.js', '') : '/';
  const T = en ? {
    eyebrow: '29 October 1923 — 29 October 2026', years: 'years', h: 'Happy Republic Day, Türkiye!',
    quote: '“The Republic wants generations that are free in thought, free in conscience and free in knowledge.”',
    by: 'Mustafa Kemal Atatürk', sign: 'With love, the Tasami family',
    go: 'Continue with the march', quiet: 'Continue without sound',
    chip: 'The Republic turns 103', music: 'Republic Day march', close: 'Close',
  } : {
    eyebrow: '29 Ekim 1923 — 29 Ekim 2026', years: 'yıl', h: 'Cumhuriyet Bayramımız Kutlu Olsun!',
    quote: '“Cumhuriyet, fikri hür, vicdanı hür, irfanı hür nesiller ister.”',
    by: 'Mustafa Kemal Atatürk', sign: 'Sevgiyle, Tasami ailesi',
    go: 'Marşla devam et', quiet: 'Sessiz devam et',
    chip: 'Cumhuriyetimiz 103 yaşında', music: 'Bayram marşı', close: 'Kapat',
  };
  const YEARS = 2026 - 1923;

  // Music: during the day the button plays the Republic march and starts on the first tap.
  const mb = $('.music');
  if (mb) {
    mb.dataset.orig = mb.dataset.src;
    mb.dataset.src = base + 'assets/audio/cumhuriyet.mp3';
    mb.dataset.key = 'tsm-bayram-music';
    mb.dataset.auto = '1';
    mb.dataset.label = $('b', mb).textContent;
    $('b', mb).textContent = T.music;
  }

  // Turkish flag (official proportions, 3:2), drawn once and waved by columns.
  const flagTex = (() => {
    const c = document.createElement('canvas'); c.width = 1200; c.height = 800;
    const g = c.getContext('2d');
    g.fillStyle = '#E30A17'; g.fillRect(0, 0, 1200, 800);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(425, 400, 200, 0, 7); g.fill();
    g.fillStyle = '#E30A17'; g.beginPath(); g.arc(475, 400, 160, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath();
    [[583.334, 400], [764.235, 458.779], [652.431, 304.894], [652.431, 495.106], [764.235, 341.221]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
    g.closePath(); g.fill();
    return c;
  })();
  const waveFlag = (cv, { pole = true } = {}) => {
    const g = cv.getContext('2d');
    let w = 0, h = 0, raf = 0, t0 = performance.now(), alive = true;
    const size = () => {
      const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = Math.max(1, r.width * d); h = cv.height = Math.max(1, r.height * d);
    };
    const draw = now => {
      const t = (now - t0) / 1000;
      g.clearRect(0, 0, w, h);
      const px = pole ? w * .035 : 0, fw = (w - px) * .94, fh = Math.min(h * .78, fw / 1.5), fy = h * .08;
      const amp = fh * .055, cols = Math.ceil(fw / 3);
      if (pole) {
        const pg = g.createLinearGradient(0, 0, px * .7, 0);
        pg.addColorStop(0, '#6b5a3a'); pg.addColorStop(.45, '#f3e2b0'); pg.addColorStop(1, '#7a6440');
        g.fillStyle = pg; g.fillRect(px * .15, fy - h * .03, px * .55, h);
        g.fillStyle = '#f2b930'; g.beginPath(); g.arc(px * .42, fy - h * .035, px * .55, 0, 7); g.fill();
      }
      for (let i = 0; i < cols; i++) {
        const u = i / cols, x = px + u * fw, k = Math.min(1, u * 2.5);
        const ph = u * 9.5 - t * 3.6;
        const dy = Math.sin(ph) * amp * k + Math.sin(ph * .53 + 1.3) * amp * .5 * k;
        const sx = u * 1200, sw = 1200 / cols + .6;
        g.drawImage(flagTex, sx, 0, sw, 800, x, fy + dy, fw / cols + .8, fh);
        const sh = Math.cos(ph) * k;
        g.fillStyle = sh > 0 ? `rgba(255,255,255,${sh * .16})` : `rgba(0,0,0,${-sh * .3})`;
        g.fillRect(x, fy + dy, fw / cols, fh);
      }
      if (alive && !calm) raf = requestAnimationFrame(draw);
    };
    size(); addEventListener('resize', size);
    raf = requestAnimationFrame(draw);
    return { stop() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', size); } };
  };

  // Fireworks + falling confetti (crescent-and-star sparks in red, white and gold)
  const COLS = ['#ffffff', '#E30A17', '#ff4d5a', '#ffd166', '#f2b930'];
  const sky = (cv, { fireworks = true, confetti = true, rate = 1, fade = null } = {}) => {
    const g = cv.getContext('2d');
    let w, h, d, raf = 0, alive = true, last = performance.now(), nextFw = 300;
    const P = [], C = [];
    const size = () => {
      const r = cv.getBoundingClientRect(); d = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = Math.max(1, r.width * d); h = cv.height = Math.max(1, r.height * d);
    };
    const burst = () => {
      const x = w * (.15 + Math.random() * .7), y = h * (.12 + Math.random() * .3);
      const n = 70 + Math.random() * 40 | 0, sp = (2.2 + Math.random() * 1.6) * d, c = COLS[Math.random() * COLS.length | 0];
      const ring = Math.random() < .5;
      for (let i = 0; i < n; i++) {
        const a = i / n * Math.PI * 2, v = sp * (ring ? 1 : .35 + Math.random() * .75);
        P.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: Math.random() < .3 ? '#fff' : c, s: (1.2 + Math.random()) * d });
      }
    };
    const drop = () => C.push({
      x: Math.random() * w, y: -20 * d, vy: (.6 + Math.random() * 1.2) * d, vx: (Math.random() - .5) * .6 * d,
      r: Math.random() * 6, vr: (Math.random() - .5) * .12, s: (5 + Math.random() * 6) * d, c: COLS[Math.random() * 4 | 0],
      star: Math.random() < .18, sw: Math.random() * 6,
    });
    const star = (x, y, r) => {
      g.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
      g.closePath(); g.fill();
    };
    const draw = now => {
      const dt = Math.min(50, now - last); last = now;
      // trails: erode what was drawn instead of painting over the page behind
      if (fade) { g.globalCompositeOperation = 'destination-out'; g.fillStyle = fade; g.fillRect(0, 0, w, h); } else g.clearRect(0, 0, w, h);
      if (fireworks && (nextFw -= dt) < 0) { burst(); nextFw = (900 + Math.random() * 1600) / rate; }
      if (confetti && C.length < 70 * rate && Math.random() < .35 * rate) drop();
      g.globalCompositeOperation = 'lighter';
      for (let i = P.length; i--;) {
        const p = P[i];
        p.vx *= .985; p.vy = p.vy * .985 + .035 * d; p.x += p.vx; p.y += p.vy; p.l -= .011;
        if (p.l <= 0) { P.splice(i, 1); continue; }
        g.globalAlpha = Math.min(1, p.l * 1.4); g.fillStyle = p.c;
        g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.fill();
      }
      g.globalCompositeOperation = 'source-over';
      for (let i = C.length; i--;) {
        const c = C[i];
        c.y += c.vy; c.sw += .03; c.x += c.vx + Math.sin(c.sw) * .5 * d; c.r += c.vr;
        if (c.y > h + 30 * d) { C.splice(i, 1); continue; }
        g.globalAlpha = .9; g.fillStyle = c.c;
        if (c.star) star(c.x, c.y, c.s * .7);
        else { g.save(); g.translate(c.x, c.y); g.rotate(c.r); g.scale(1, Math.cos(c.sw * 2)); g.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); g.restore(); }
      }
      g.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(draw);
    };
    size(); addEventListener('resize', size);
    if (!calm) raf = requestAnimationFrame(draw);
    return { stop() { alive = false; cancelAnimationFrame(raf); removeEventListener('resize', size); } };
  };

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const stoppers = [];

  // Hero: waving flag, fireworks, confetti and a gold ribbon line
  const hero = $('.hero');
  if (hero) {
    const fl = el('canvas', 'byr-flag'); fl.setAttribute('aria-hidden', 'true');
    const fx = el('canvas', 'byr-sky'); fx.setAttribute('aria-hidden', 'true');
    hero.append(fx, fl);
    const rib = el('p', 'byr-ribbon', `<span class="byr-moon" aria-hidden="true"></span><b>29 EKİM</b><span>${T.h}</span>`);
    if (en) rib.querySelector('b').textContent = '29 OCTOBER';
    const hin = $('.hero-in', hero); if (hin) hin.prepend(rib);
    stoppers.push(waveFlag(fl), sky(fx, { rate: .8 }));
  }

  // Corner chip: reopens the greeting
  const chip = el('button', 'byr-chip', `<i class="byr-mini" aria-hidden="true"></i><span>${T.chip}</span>`);
  chip.type = 'button';
  document.body.append(chip);

  // Greeting screen (once per session, after the logo intro)
  let open = null;
  const splash = (auto) => {
    if (open) return;
    const s = el('div', 'byr-splash');
    s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); s.setAttribute('aria-label', T.h);
    s.innerHTML = `<canvas class="byr-splash-sky" aria-hidden="true"></canvas>
      <div class="byr-rays" aria-hidden="true"></div>
      <button class="byr-x" type="button" aria-label="${T.close}" data-nomusic>✕</button>
      <div class="byr-card">
        <canvas class="byr-splash-flag" aria-hidden="true"></canvas>
        <p class="byr-eyebrow">${T.eyebrow}</p>
        <div class="byr-num" aria-hidden="true"><span class="byr-count">0</span><small>${T.years}</small></div>
        <h2 class="byr-h">${T.h.split(' ').map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ')}</h2>
        <blockquote class="byr-q">${T.quote}<cite>${T.by}</cite></blockquote>
        <div class="byr-btns">
          <button class="byr-go" type="button" data-nomusic><span class="byr-eq" aria-hidden="true"><i></i><i></i><i></i></span>${T.go}</button>
          <button class="byr-quiet" type="button" data-nomusic>${T.quiet}</button>
        </div>
        <p class="byr-sign">${T.sign}</p>
      </div>`;
    document.body.append(s);
    document.body.classList.add('byr-lock');
    const st = [sky($('.byr-splash-sky', s), { rate: 1.6, confetti: true, fade: 'rgba(0,0,0,.25)' }), waveFlag($('.byr-splash-flag', s), { pole: false })];
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add('in')));
    // count up to 103
    const cnt = $('.byr-count', s), t0 = performance.now() + 700;
    const tick = now => {
      const k = Math.max(0, Math.min(1, (now - t0) / 1800));
      cnt.textContent = Math.round(YEARS * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    calm ? (cnt.textContent = YEARS) : requestAnimationFrame(tick);
    const close = withMusic => {
      if (!open) return;
      open = null;
      try { sessionStorage.setItem('tsm-bayram', '1'); } catch (e) {}
      const m = window.tsmMusic;
      if (m && withMusic === true) m.play();
      if (m && withMusic === false) m.pause();
      s.classList.add('out'); document.body.classList.remove('byr-lock');
      setTimeout(() => { st.forEach(x => x.stop()); s.remove(); }, 900);
      chip.focus({ preventScroll: true });
    };
    open = close;
    $('.byr-go', s).addEventListener('click', () => close(true));
    $('.byr-quiet', s).addEventListener('click', () => close(false));
    $('.byr-x', s).addEventListener('click', () => close());
    s.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    setTimeout(() => $('.byr-go', s).focus({ preventScroll: true }), 50);
  };
  chip.addEventListener('click', () => splash(false));
  let seen = false; try { seen = !!sessionStorage.getItem('tsm-bayram'); } catch (e) {}
  if (!seen) {
    const show = () => setTimeout(() => splash(true), 650);
    if (root.classList.contains('ready')) show();
    else {
      const mo = new MutationObserver(() => { if (root.classList.contains('ready')) { mo.disconnect(); show(); } });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // Midnight (TR): the site quietly goes back to normal
  const finish = () => {
    if (open) open();
    root.classList.add('byr-ending');
    window.tsmMusic && window.tsmMusic.reset && window.tsmMusic.reset();
    setTimeout(() => {
      stoppers.forEach(x => x.stop());
      document.querySelectorAll('.byr-flag,.byr-sky,.byr-ribbon,.byr-chip').forEach(e => e.remove());
      root.classList.remove('bayram', 'byr-ending');
    }, 1200);
  };
  if (!preview) setTimeout(finish, Math.max(0, END - Date.now()));
})();
