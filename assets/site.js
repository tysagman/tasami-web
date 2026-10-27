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

  // Section headings: same word split, revealed with their parent.
  $$('.sec-head h2, .story-txt h2, .about h2, .contact h2').forEach(h => {
    h.innerHTML = h.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="w"><span style="--d:${i}">${w}</span></span>`).join(' ');
  });

  // Intro curtain (once per session)
  const ready = () => root.classList.add('ready');
  if (root.classList.contains('intro-on')) {
    try { sessionStorage.setItem('tsm-intro', '1'); } catch (e) {}
    const intro = $('.intro');
    const go = () => {
      intro.classList.add('out');
      setTimeout(ready, 350);
      setTimeout(() => intro.remove(), 1200);
    };
    let loaded = document.readyState === 'complete';
    addEventListener('load', () => { loaded = true; });
    const t0 = performance.now();
    const wait = () => (loaded && performance.now() - t0 > 1500) || performance.now() - t0 > 3200 ? go() : setTimeout(wait, 100);
    wait();
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
        c: leaf ? (Math.random() < .5 ? '140,198,63' : '242,185,48') : (Math.random() < .7 ? '255,214,102' : '255,255,255')
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
          const tw = .45 + Math.sin(p.a * 3) * .35;
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
})();
