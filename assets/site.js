(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const body = document.body;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero title: wrap each word for the rise animation.
  $$('[data-split]').forEach(h => {
    h.innerHTML = h.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="w"><span style="--d:${i}">${w}</span></span>`).join(' ');
  });

  // Game name: letters rise like stone out of dry soil, turn green, grass spreads, a sprout opens.
  const growIt = el => {
    const text = el.textContent.trim();
    let n = 0;
    el.classList.add('grow');
    el.setAttribute('aria-label', text);
    el.innerHTML = '<span class="gr-words" aria-hidden="true">' + text.split(/\s+/).map(w =>
      `<span class="gw">${[...w].map(c => `<span class="gl" style="--d:${n++}">${c}</span>`).join('')}</span>`).join(' ') +
      '</span><span class="soil" aria-hidden="true"></span><span class="grass" aria-hidden="true"></span>' +
      '<svg class="sprout" viewBox="0 0 40 60" aria-hidden="true"><path class="stem" d="M20 60 C20 46 18 38 21 26"/>' +
      '<path class="lf l" d="M21 30 C12 30 5 24 3 15 C12 15 19 20 21 30Z"/><path class="lf r" d="M21 27 C27 20 34 18 39 19 C36 27 29 30 21 27Z"/></svg>';
    el.style.setProperty('--gd', (0.5 + n * 0.07 + 1.2).toFixed(2) + 's');
    // dirt bursting where each letter breaks through
    requestAnimationFrame(() => {
      const box = el.getBoundingClientRect();
      const cols = ['#b08a5a', '#8b6a43', '#c9a774', '#6d5232'];
      $$('.gl', el).forEach((g, i) => {
        const r = g.getBoundingClientRect(), cx = r.left + r.width / 2 - box.left;
        for (let k = 0; k < 3; k++) {
          const d = document.createElement('i'); d.className = 'dirt';
          const s = 3 + Math.random() * 5;
          d.style.cssText = `left:${cx + (Math.random() - .5) * r.width}px;--s:${s}px;--x:${(Math.random() - .5) * 90}px;--y:${-(25 + Math.random() * 70)}px;--t:${.8 + Math.random() * .6}s;--dl:${(0.5 + i * 0.07 + .1 + Math.random() * .15).toFixed(2)}s;--c:${cols[k % 4]}`;
          el.appendChild(d);
        }
      });
    });
  };
  $$('[data-grow]').forEach(growIt);
  const growIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('go'); growIO.unobserve(e.target); }
  }), { threshold: .5 });
  const startGrow = () => $$('[data-grow]').forEach(el => el.closest('.hero') ? el.classList.add('go') : growIO.observe(el));

  // Section headings: same word split, revealed with their parent.
  $$('.sec-head h2:not([data-grow]), .story-txt h2, .about h2, .contact h2').forEach(h => {
    h.innerHTML = h.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="w"><span style="--d:${i}">${w}</span></span>`).join(' ');
  });

  // Intro curtain (once per session)
  const ready = () => { root.classList.add('ready'); startGrow(); };
  if (root.classList.contains('intro-on')) {
    try { sessionStorage.setItem('tsm-intro', '1'); } catch (e) {}
    const intro = $('.intro');
    const go = () => {
      intro.classList.add('out');
      setTimeout(ready, 350);
      setTimeout(() => intro.remove(), 1200);
    };
    let done = false;
    const end = () => { if (!done) { done = true; go(); } };
    const v = $('.intro-vid', intro);
    // play the logo animation once; close the curtain when it ends (or on tap / key / if it can't play)
    if (v) {
      v.addEventListener('playing', () => v.classList.add('on'), { once: true });
      v.addEventListener('ended', end);
      v.addEventListener('error', end);
      const p = v.play(); if (p && p.catch) p.catch(end);
      setTimeout(() => { if (v.paused || v.readyState < 3) end(); }, 3500);
    }
    intro.addEventListener('click', end);
    addEventListener('keydown', end, { once: true });
    setTimeout(end, v ? 12500 : 2500);
  } else ready();

  // Counters
  const count = el => {
    const raw = el.dataset.count, end = parseInt(raw, 10), tail = raw.replace(/^\d+/, '');
    if (calm || !end) { el.textContent = raw; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e) + (k === 1 ? tail : '');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(count);
    if (e.target.matches('[data-count]')) count(e.target);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $$('.reveal, .feat-img, .stats-in').forEach(el => io.observe(el));

  // Header state, progress bar, active link, parallax
  const top = $('.top'), bar = $('.progress');
  const links = $$('#nav a[href^="#"]');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const par = $$('.parallax img');
  let lastY = scrollY, ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY, max = root.scrollHeight - innerHeight;
    top.classList.toggle('solid', y > 40);
    top.classList.toggle('hide', y > lastY && y > innerHeight * 0.8 && !root.classList.contains('menu-open'));
    lastY = y;
    bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    let cur = null;
    secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s.id; });
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
    if (!calm) par.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${Math.max(-15, Math.min(0, -7.5 + k * 9)).toFixed(2)}%)`;
    });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Mobile menu
  const burger = $('.burger');
  const setMenu = on => {
    root.classList.toggle('menu-open', on);
    body.classList.toggle('menu-open', on);
    burger.setAttribute('aria-expanded', on);
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Hero background video (desktop only, respects data saver / reduced motion)
  const hv = $('.hero-video');
  const save = navigator.connection && navigator.connection.saveData;
  if (hv && !calm && !save && matchMedia('(min-width: 861px)').matches) {
    hv.addEventListener('playing', () => hv.classList.add('on'), { once: true });
    setTimeout(() => {
      hv.src = hv.dataset.src;
      hv.play().catch(() => {});
    }, 1200);
  }

  // Modals
  let lastFocus = null;
  const openM = m => {
    lastFocus = document.activeElement;
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add('open'));
    body.classList.add('lock');
    $('.lb-x', m).focus();
  };
  const closeM = m => {
    m.classList.remove('open');
    body.classList.remove('lock');
    setTimeout(() => { m.hidden = true; }, 300);
    if (lastFocus) lastFocus.focus();
  };

  // Gallery lightbox
  const lb = $('#lb'), items = $$('.g-item a');
  const lbImg = $('img', lb), lbCap = $('figcaption', lb);
  let idx = 0;
  const show = i => {
    idx = (i + items.length) % items.length;
    const a = items[idx];
    lbImg.src = a.getAttribute('href');
    lbImg.alt = a.dataset.cap || '';
    lbCap.textContent = a.dataset.cap || '';
  };
  items.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); show(i); openM(lb); }));
  $('.lb-x', lb).addEventListener('click', () => closeM(lb));
  $('.lb-nav.prev', lb).addEventListener('click', () => show(idx - 1));
  $('.lb-nav.next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeM(lb); });
  let sx = null;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });

  // Trailer modal
  const vm = $('#vm'), vmv = $('video', vm);
  const closeV = () => { vmv.pause(); closeM(vm); };
  $$('[data-trailer]').forEach(b => b.addEventListener('click', () => {
    openM(vm);
    vmv.play().catch(() => {});
  }));
  $('.lb-x', vm).addEventListener('click', closeV);
  vm.addEventListener('click', e => { if (e.target === vm) closeV(); });

  addEventListener('keydown', e => {
    if (!lb.hidden) {
      if (e.key === 'Escape') closeM(lb);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === 'ArrowRight') show(idx + 1);
    } else if (!vm.hidden && e.key === 'Escape') closeV();
    else if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false);
  });

  // ---------- fx ----------
  const fine = matchMedia('(pointer: fine)').matches && innerWidth > 860;
  const hero = $('.hero'), heroMedia = $('.hero-media'), heroIn = $('.hero-in');

  // Floating pollen / fireflies / leaves over the hero
  const cv = $('.hero-fx');
  if (cv && !calm) {
    const cx = cv.getContext('2d');
    let W, H, dpr, parts = [], mx = -1e4, my = -1e4, on = true;
    const N = innerWidth < 700 ? 34 : 80;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const mk = init => {
      const leaf = Math.random() < .22;
      return {
        x: Math.random() * W, y: init ? Math.random() * H : (leaf ? -20 : H + 20),
        r: leaf ? 4 + Math.random() * 4 : .8 + Math.random() * 2.4,
        vx: (Math.random() - .5) * .3, vy: leaf ? .35 + Math.random() * .5 : -(.15 + Math.random() * .45),
        a: Math.random() * 6.28, s: .01 + Math.random() * .02, leaf,
        c: leaf ? (Math.random() < .5 ? '200,200,200' : '255,255,255') : (Math.random() < .7 ? '255,255,255' : '180,180,180')
      };
    };
    size();
    for (let i = 0; i < N; i++) parts.push(mk(true));
    addEventListener('resize', size);
    hero.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mx = my = -1e4; });
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) requestAnimationFrame(tick); }).observe(hero);
    function tick() {
      if (!on) return;
      cx.clearRect(0, 0, W, H);
      for (const p of parts) {
        p.a += p.s;
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { const f = (14000 - d2) / 14000 * 1.6; p.x += dx / Math.sqrt(d2 + 1) * f; p.y += dy / Math.sqrt(d2 + 1) * f; }
        p.x += p.vx + Math.sin(p.a) * (p.leaf ? .9 : .3);
        p.y += p.vy;
        if (p.y < -30 || p.y > H + 30 || p.x < -30 || p.x > W + 30) Object.assign(p, mk(false));
        if (p.leaf) {
          cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a * 1.5);
          cx.fillStyle = `rgba(${p.c},.75)`;
          cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .45, 0, 0, 6.28); cx.fill();
          cx.restore();
        } else {
          const tw = .28 + Math.sin(p.a * 3) * .22;
          const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          g.addColorStop(0, `rgba(${p.c},${tw})`); g.addColorStop(1, `rgba(${p.c},0)`);
          cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r * 4, 0, 6.28); cx.fill();
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Hero: mouse depth + scroll-out
  if (!calm) {
    if (fine) hero.addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      heroMedia.style.transform = `translate(${x * -26}px, ${y * -18}px) scale(1.05)`;
    });
    const heroScroll = () => {
      const k = Math.min(1, scrollY / innerHeight);
      heroIn.style.transform = `translateY(${k * -120}px)`;
      heroIn.style.opacity = 1 - k * 1.3;
      hero.style.setProperty('--hk', k);
    };
    addEventListener('scroll', () => requestAnimationFrame(heroScroll), { passive: true });
  }

  // Custom cursor
  const cur = $('.cursor');
  if (fine && !calm) {
    let tx = 0, ty = 0, x = 0, y = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.remove('on'));
    document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a, button, .g-item, input, label')));
    (function loop() { x += (tx - x) * .2; y += (ty - y) * .2; cur.style.transform = `translate(${x}px, ${y}px)`; requestAnimationFrame(loop); })();
  }

  // 3D tilt with light shine
  if (fine && !calm) $$('.ch, .feat-img, .g-item, .card, .about-logo, .story-img').forEach(el => {
    el.classList.add('tilt');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const sh = document.createElement('i'); sh.className = 'tilt-shine'; el.appendChild(sh);
    const max = el.matches('.g-item') ? 10 : 7;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.classList.add('tilting');
      el.style.transform = `perspective(900px) rotateY(${(x - .5) * max}deg) rotateX(${(.5 - y) * max}deg) translateZ(0) scale(1.02)`;
      el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.classList.remove('tilting'); el.style.transform = ''; });
  });

  // Magnetic buttons
  if (fine && !calm) $$('.btn, .lang').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  // Gallery: random tilt on entry
  $$('.g-item').forEach((g, i) => g.style.setProperty('--rot', (i % 2 ? 1 : -1) * (2 + (i * 7) % 5) + 'deg'));

  // Marquee skews with scroll speed; trailer frame straightens as it scrolls in
  const mq = $$('.mq-row'), vf = $('.video-frame');
  let py = scrollY, sk = 0;
  if (!calm) (function loop() {
    const v = scrollY - py; py = scrollY;
    sk += (Math.max(-12, Math.min(12, v * .35)) - sk) * .12;
    mq.forEach((r, i) => r.style.setProperty('--sk', (i ? -sk : sk).toFixed(2) + 'deg'));
    if (vf) {
      const r = vf.getBoundingClientRect();
      const k = Math.max(0, Math.min(1, 1 - (r.top - innerHeight * .15) / (innerHeight * .7)));
      vf.style.setProperty('--vx', ((1 - k) * 18).toFixed(2) + 'deg');
      vf.style.setProperty('--vs', (.84 + k * .16).toFixed(3));
    }
    requestAnimationFrame(loop);
  })();

  // Background music (Web Audio for a gapless loop; starts only on user request)
  const mb = $('.music');
  const music = (() => {
    let ctx, gain, buf, src, on = false, loading = null;
    const key = () => mb.dataset.key || 'tsm-music';
    const load = () => loading || (loading = (async () => {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (!gain) { gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination); }
      const data = await (await fetch(mb.dataset.src)).arrayBuffer();
      buf = await new Promise((ok, no) => ctx.decodeAudioData(data, ok, no));
    })());
    const set = v => {
      on = v; mb.classList.toggle('on', v); mb.setAttribute('aria-pressed', v);
      mb.setAttribute('aria-label', v ? mb.dataset.off : mb.dataset.on);
      try { localStorage.setItem(key(), v ? '1' : '0'); } catch (e) {}
    };
    const play = async () => {
      set(true); await load(); if (!on) return;
      await ctx.resume();
      if (!src) {
        src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        src.loopEnd = Math.min(buf.duration, 96); src.connect(gain); src.start();
      }
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(.55, ctx.currentTime, .8);
    };
    const pause = (remember = true) => {
      if (remember) set(false); else mb.classList.remove('on');
      if (ctx) gain.gain.setTargetAtTime(0, ctx.currentTime, .25);
    };
    // back to the regular track (used when a seasonal theme ends)
    const reset = () => {
      if (on) pause(false);
      on = false; mb.setAttribute('aria-pressed', false); mb.setAttribute('aria-label', mb.dataset.on);
      const old = src; src = null; buf = null; loading = null;
      if (old) setTimeout(() => { try { old.stop(); } catch (e) {} }, 1500);
      if (mb.dataset.orig) mb.dataset.src = mb.dataset.orig;
      if (mb.dataset.label) $('b', mb).textContent = mb.dataset.label;
      delete mb.dataset.key; delete mb.dataset.auto;
    };
    return { play, pause, reset, get on() { return on; } };
  })();
  if (mb) {
    window.tsmMusic = music;
    mb.addEventListener('click', () => music.on ? music.pause() : music.play());
    let pref = null; try { pref = localStorage.getItem(mb.dataset.key || 'tsm-music'); } catch (e) {}
    if (pref === '1' || (pref === null && mb.dataset.auto)) {
      // browsers need a gesture before sound: resume on the first one
      const go = e => { if (!e.target.closest('.music, [data-nomusic]')) music.play(); ['pointerdown', 'keydown'].forEach(t => removeEventListener(t, go, true)); };
      ['pointerdown', 'keydown'].forEach(t => addEventListener(t, go, true));
    } else if (pref === null) setTimeout(() => mb.classList.add('hint'), 4000);
  }
  let musicWas = false;
  $$('video[controls], #vm video, .video-frame video').forEach(v => {
    v.addEventListener('play', () => { musicWas = music.on; if (musicWas) music.pause(false); });
    v.addEventListener('pause', () => { if (musicWas) music.play(); musicWas = false; });
  });

  // Inline trailer: custom play button
  if (vf) {
    const v = $('video', vf), pb = $('.vf-play', vf);
    pb.addEventListener('click', () => { v.controls = true; vf.classList.add('playing'); v.play().catch(() => {}); });
    v.addEventListener('ended', () => { vf.classList.remove('playing'); v.controls = false; v.load(); });
  }

  // Chapters: drag to scroll with the mouse
  const tw = $('.ch-track-wrap');
  if (tw && fine) {
    let down = false, sx0 = 0, sl = 0, moved = false;
    tw.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx0 = e.clientX; sl = tw.scrollLeft; tw.style.scrollSnapType = 'none'; tw.style.cursor = 'grabbing'; });
    addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx0; if (Math.abs(d) > 4) moved = true; tw.scrollLeft = sl - d; });
    addEventListener('pointerup', () => { if (!down) return; down = false; tw.style.scrollSnapType = ''; tw.style.cursor = ''; });
    tw.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    tw.style.cursor = 'grab';
  }

  // Title artwork: the stone name rises out of the artwork's own cracked ground
  {
  const ta = $('.ta'), cv = ta && $('.ta-rise', ta);
  if (cv && window.tasamiRise && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ta.classList.add('rise');
    const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
    const full = $('img', ta);
    const parts = Promise.all([load(cv.dataset.zemin), load(cv.dataset.tas), full.decode ? full.decode().then(() => full) : load(full.currentSrc || full.src)]);
    let fx = null;
    parts.then(([p, w, f]) => { fx = tasamiRise(cv, p, w, { full: f }); fx.draw(0); ta.classList.add('ready'); }).catch(() => ta.classList.remove('rise'));
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      parts.then(() => fx && fx.play(() => ta.classList.add('done')));
    }, { threshold: .45 }).observe(ta);
  }
  }

  // Chapters journey map (inspired by motion-design map reveals): the board pops in, the route draws
  // itself from stop to stop, each pin bounces in, colour blooms around it and its photo card flies out.
  const jm = $('.jmap');
  if (jm) {
    const NS = 'http://www.w3.org/2000/svg';
    const el = (n, a, p) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p && p.appendChild(e); return e; };
    const P = jm.dataset.pins.split(';').map(s => s.split(',').map(Number));
    // Catmull-Rom through the stops -> cubic Béziers; remember the length up to each stop
    const seg = i => { const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, P.length - 1)];
      return `C${p1[0] + (p2[0] - p0[0]) / 7},${p1[1] + (p2[1] - p0[1]) / 7} ${p2[0] - (p3[0] - p1[0]) / 7},${p2[1] - (p3[1] - p1[1]) / 7} ${p2[0]},${p2[1]}`; };
    let d = `M${P[0][0]},${P[0][1]}`; const at = [0];
    const route = $('.jm-route', jm), sh = $('.jm-route-sh', jm);
    for (let i = 0; i < P.length - 1; i++) { d += seg(i); route.setAttribute('d', d); at.push(route.getTotalLength()); }
    sh.setAttribute('d', d);
    const L = at[at.length - 1];
    const blooms = $('.jm-blooms', jm), rings = $('.jm-rings', jm), pinsG = $('.jm-pins', jm), links = $('.jm-links', jm);
    const cards = $$('.jm-card', jm), chs = $$('.ch');
    const bl = P.map(([x, y]) => el('circle', { cx: x, cy: y, r: 0, fill: 'url(#jm-g)' }, blooms));
    const rg = P.map(([x, y]) => el('circle', { class: 'jm-ring', cx: x, cy: y, r: 0, opacity: 0 }, rings));
    const pins = P.map(([x, y], i) => {
      const g = el('g', { class: 'jm-pin', transform: `translate(${x},${y - 34})` }, pinsG);
      const s = el('g', { style: 'transform:scale(0)' }, g);
      el('path', { d: 'M0,34 L-14,10 A20,20 0 1 1 14,10 Z', fill: '#fff' }, s);
      el('circle', { class: 'b', r: 24 }, s); el('circle', { class: 'h', r: 18 }, s);
      el('text', {}, s).textContent = i + 1;
      return s;
    });
    const ln = cards.map((c, i) => {
      const cx = parseFloat(c.style.left) * 16, cy = parseFloat(c.style.top) * 9;
      return el('line', { x1: P[i][0], y1: P[i][1] - 30, x2: P[i][0], y2: P[i][1] - 30, 'data-x': cx, 'data-y': cy }, links);
    });
    const hl = (i, on) => { cards[i] && cards[i].classList.toggle('hl', on); pins[i].parentNode.classList.toggle('hl', on); chs[i] && chs[i].classList.toggle('hl', on); };
    const goCh = i => { const c = chs[i]; if (!c) return;
      c.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'nearest', inline: 'start' }); hl(i, true); setTimeout(() => hl(i, false), 1600); };
    pins.forEach((p, i) => { const g = p.parentNode; g.addEventListener('click', () => goCh(i)); g.addEventListener('mouseenter', () => hl(i, true)); g.addEventListener('mouseleave', () => hl(i, false)); });
    cards.forEach((c, i) => { c.addEventListener('click', e => { e.preventDefault(); goCh(i); }); c.addEventListener('mouseenter', () => hl(i, true)); c.addEventListener('mouseleave', () => hl(i, false)); });
    const ease = t => 1 - Math.pow(1 - t, 3), back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
    const cl = t => Math.min(Math.max(t, 0), 1);
    const R = 260, T0 = 700, DRAW = 4600, tStop = at.map(a => T0 + DRAW * a / L), END = tStop[P.length - 1];
    const popped = [];
    const frame = t => {
      // route: draw speed eases between stops so it "arrives" at each one
      const k = cl((t - T0) / DRAW); route.style.strokeDashoffset = L * (1 - k); sh.style.strokeDashoffset = L * (1 - k);
      P.forEach((_, i) => {
        const u = t - tStop[i];
        pins[i].style.transform = `scale(${u <= 0 ? 0 : back(cl(u / 520)) * (jm.clientWidth < 700 ? 1.9 : 1)})`;
        bl[i].setAttribute('r', u <= 0 ? 0 : R * ease(cl(u / 1400)));
        const q = cl(u / 900); rg[i].setAttribute('r', u <= 0 ? 0 : 30 + 150 * ease(q)); rg[i].setAttribute('opacity', u <= 0 ? 0 : 1 - q);
        if (ln[i]) { const v = ease(cl((u - 150) / 380)), x2 = +ln[i].dataset.x, y2 = +ln[i].dataset.y;
          ln[i].setAttribute('x2', P[i][0] + (x2 - P[i][0]) * v); ln[i].setAttribute('y2', P[i][1] - 30 + (y2 - P[i][1] + 30) * v); }
        if (u > 400 && !popped[i] && cards[i]) {
          popped[i] = 1; const c = cards[i], w = jm.clientWidth / 1600, dx = (P[i][0] - +ln[i].dataset.x) * w, dy = (P[i][1] - +ln[i].dataset.y) * w;
          c.animate([{ transform: `translate(-50%,-50%) translate(${dx}px,${dy}px) scale(.15)`, opacity: 0 },
                     { transform: 'translate(-50%,-50%) scale(1.08)', opacity: 1, offset: .7 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }],
                    { duration: calm ? 1 : 750, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
          c.classList.add('flash');
        }
      });
      if (t > END + 3000) pins.forEach(p => p.style.transform = `scale(${jm.clientWidth < 700 ? 1.9 : 1})`);
      // finale (Miras): colour spreads over the whole land
      const f = t - END - 900; if (f > 0) bl[P.length - 1].setAttribute('r', R + 1500 * ease(cl(f / 2200)));
    };
    route.style.strokeDasharray = L; sh.style.strokeDasharray = L; frame(0);
    new IntersectionObserver((es, o) => {
      if (!es[0].isIntersecting) return; o.disconnect(); jm.classList.add('on');
      if (calm) return frame(1e6);
      const s = performance.now(), tick = n => { const t = n - s; frame(t); if (t < END + 3200) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .35 }).observe(jm);
  }
})();
