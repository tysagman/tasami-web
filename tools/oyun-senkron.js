// Oyunun yayındaki sürümünü (toprak-oyun) okuyup src/game.json'u günceller.
// Kullanım: node tools/oyun-senkron.js <toprak-oyun klasörü>
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const dir = path.resolve(process.argv[2] || '../toprak-oyun'), oyun = path.join(dir, 'oyun');
const out = process.env.OUT || path.join(__dirname, '..', 'src', 'game.json');
(async () => {
  // v her yayında artar; pv oyunda görünen sürümdür (v1.00'dan itibaren yalnız büyük güncellemelerde değişir)
  const { v, pv } = JSON.parse(fs.readFileSync(path.join(oyun, 'version.json'), 'utf8'));
  const langs = 1 + fs.readdirSync(path.join(oyun, 'lang')).filter(f => f.endsWith('.json')).length; // + Türkçe
  const log = JSON.parse(fs.readFileSync(path.join(oyun, 'changelog.json'), 'utf8'));
  // oyundaki gibi: pv yalnız sürümün değiştiği girişte yazılı, sonraki düzeltmeler o sürüme aittir
  const pvOf = e => log.find(x => x.v <= e.v && x.pv)?.pv;
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage();
  p.on('pageerror', () => {});
  await p.goto('file://' + path.join(oyun, 'index.html'));
  await p.waitForFunction(() => typeof QUESTS !== 'undefined' && QUESTS.length > 0, null, { timeout: 60000 });
  const g = await p.evaluate(() => ({ quests: QUESTS.length, chapters: PNAMES.filter(Boolean).length }));
  await b.close();
  if (g.quests < 50 || g.chapters < 3) throw new Error('beklenmeyen değerler: ' + JSON.stringify(g));
  const data = { v, version: pv ? pv.replace(/^v/, '') : `${Math.floor(v / 100)}.${String(v % 100).padStart(2, '0')}`, quests: g.quests,
    chapters: g.chapters, languages: langs,
    changes: log.slice(0, 3).map(e => ({ v: e.v, ...(pvOf(e) && { pv: pvOf(e).replace(/^v/, '') }), d: e.d, tr: e.tr, en: e.en })) };
  fs.writeFileSync(out, JSON.stringify(data, null, 1) + '\n');
  console.log(JSON.stringify({ v: data.version, quests: data.quests, chapters: data.chapters, languages: langs }));
})().catch(e => { console.error(e); process.exit(1); });
