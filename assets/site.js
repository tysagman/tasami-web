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
})();
