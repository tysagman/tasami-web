// Tüm sayfalar: çerez bildirimi (bir kez) ve mobilde sabit "Kapalı teste katıl" butonu.
(() => {
  const get = k => { try { return localStorage.getItem(k) } catch (e) { return null } };
  const set = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} };

  // Cookie notice: informational only (the site sets no tracking cookies), shown until dismissed.
  const ck = document.querySelector('.cookie');
  if (ck && !get('tsm-cerez')) {
    ck.hidden = false;
    document.body.classList.add('ck-on');
    ck.querySelector('.ck-ok').addEventListener('click', () => {
      set('tsm-cerez', '1');
      ck.classList.add('out');
      document.body.classList.remove('ck-on');
      setTimeout(() => { ck.hidden = true; }, 300);
    });
  }

  // Mobile sticky CTA: visible after the hero, hidden while the sign-up section is on screen
  // and for visitors who already signed up.
  const cta = document.querySelector('.m-cta');
  const hero = document.querySelector('.hero');
  const test = document.getElementById('test');
  if (!cta || !hero || !test) return;
  let pastHero = false, atTest = false;
  const update = () => {
    const on = pastHero && !atTest && !get('tasami-test-kayit');
    cta.classList.toggle('show', on);
    cta.setAttribute('aria-hidden', on ? 'false' : 'true');
    cta.tabIndex = on ? 0 : -1;
    document.body.classList.toggle('mcta-on', on);
  };
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; update(); }, { threshold: 0.15 }).observe(hero);
  new IntersectionObserver(([e]) => { atTest = e.isIntersecting; update(); }, { rootMargin: '0px 0px -30% 0px' }).observe(test);
})();
