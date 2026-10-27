#!/usr/bin/env python3
"""tasami.com.tr sayfalarını üretir: Türkçe (/) ve İngilizce (/en/).
Metinleri değiştirmek için aşağıdaki T sözlüğünü düzenleyin, sonra:  python3 src/build.py
Görseller assets/img/oyun/<ad>.webp (1920x1080) ve <ad>-k.webp (960x540); hepsi oyunun içinden çekildi.
"""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "src" / "template.html").read_text(encoding="utf-8")

PLAY_URL = "https://tysagman.github.io/toprak-oyun/oyun/"
CONTACT = "info@tasami.com.tr"
YOUTUBE_ID = "VAp9sWofOYo"  # resmî fragman
YOUTUBE = "https://www.youtube.com/watch?v=" + YOUTUBE_ID
# Oyundan otomatik gelir (tools/oyun-senkron.js, .github/workflows/oyun-senkron.yml)
GAME = json.loads((ROOT / "src" / "game.json").read_text(encoding="utf-8"))
VERSION = GAME["version"]
TRAILER_VERSION = "3.65"  # fragmanın çekildiği sürüm

# (görsel, TR başlık, EN başlık) — galeri sırası
GALLERY = [
    ("genel", "Hazar Gölü kıyısında köy ve çiftlik", "Village and farm on the shores of Lake Hazar"),
    ("koy-meydani", "Köy meydanı", "The village square"),
    ("meralar", "İnek, koyun ve keçi meraları", "Cow, sheep and goat pastures"),
    ("fabrikalar", "Fabrikalar ve cami", "Factories and the mosque"),
    ("gece", "Gece meydan", "The square at night"),
    ("iskele", "İskele", "The pier"),
    ("inek-merasi", "İnek merası", "The cow pasture"),
    ("kuzey-diyari", "Kuzey Diyarı · Çamlıbel", "The Northlands · Çamlıbel"),
    ("sehir", "Şehir", "The city"),
    ("ciftlik-evi", "Dedenin çiftliği", "Grandpa's farm"),
    ("koy-ve-sanayi", "Köy ve sanayi", "Village and industry"),
    ("gol-kiyisi", "Göl kıyısı", "The lakeshore"),
]

CHAPTER_IMG = ["ciftlik-evi", "inek-merasi", "kuzey-diyari", "fabrikalar", "sehir", "genel"]
FEATURE_IMG = ["ciftlik-evi", "meralar", "koy-meydani", "fabrikalar", "iskele", "gece"]

T = {
    "tr": {
        "lang": "tr", "path": "", "base": "",
        "other_lang": "EN", "other_href": "en/", "other_name": "English",
        "title": "Toprağın Mirası · Tasami oyun ve uygulama stüdyosu",
        "desc": "Toprağın Mirası: Hazar Gölü kıyısında dedenden kalan topraklarda çiftlik, köy, fabrika ve holding kurduğun 3D çok oyunculu yaşam oyunu. Tasami, oyun ve mobil uygulama geliştiren bağımsız bir stüdyo.",
        "nav": ["Oyun", "Hikâye", "Özellikler", "Görüntüler", "Erken erişim", "Stüdyo"],
        "menu": "Menü",
        "kicker": "Tasami'nin ilk oyunu",
        "game": "Toprağın Mirası",
        "tagline": "Dedenden kalan toprağa boş elle gel. Çiftliğini kur, köyünü büyüt, fabrikalarını işlet ve Hazar Gölü kıyısında kendi mirasını bırak.",
        "cta_test": "Kapalı teste katıl",
        "cta_watch": "Fragmanı izle",
        "badge": f"Sürüm {VERSION} · Android kapalı test",
        "scroll": "Keşfet",
        "presents": "sunar", "yt_btn": "YouTube'da izle", "upd_k": "Oyunla eş zamanlı", "upd_h": "Son güncellemeler", "upd_v": "Sürüm", "slogan": "Topraktan Sanayiye",
        "trailer": "toprak-mirasi-fragman.mp4",
        "marquee": ["Tarla", "Ahır", "Mandıra", "Koyun &amp; keçi", "Fabrika", "Liman", "Holding", "Balıkçılık", "Kooperatif", "Güneş paneli"],
        "play_tr": "Fragmanı oynat",
        "stats": [(str(GAME["quests"]), "hikâye görevi"), (str(GAME["chapters"]), "bölüm"), (str(GAME["languages"]), "dil"), ("400+", "yaşayan köylü")],
        "story_k": "Hikâye",
        "story_h": "Bir köyün yeniden doğuşu",
        "story": [
            "Rahmetli Hasan Dede'nin torunusun. Elinde bir çanta, cebinde birkaç altınla Sivrice'ye, yıllardır seni bekleyen çiftliğe geliyorsun.",
            "Önce odun toplayıp ip örüyor, ilk tavuklarını alıyorsun. Sonra tarlalar, ahırlar, meralar ve köy çeşmesi geliyor. Köy büyüdükçe mandıra ve kooperatif kuruluyor, ardından fabrikalar, kamyonlar ve ihracat gemileri.",
            "Sonunda kendi holdingini kurup Hasan Dede'nin mirasını bir vakıfla köye devrediyorsun.",
        ],
        "ch_k": "6 bölüm", "ch_h": "Boş ellerden holdinge",
        "chapter": "Bölüm",
        "chapters": [
            ("Boş Eller", "Odun, ip, sepet ve ilk tavuklar. Dedenin evini onar, hayatta kalmayı öğren."),
            ("Toprağa Kök", "Ahır, tarlalar, ilk çalışanların, turistler ve göldeki dalış merkezi."),
            ("Köyün Umudu", "Kuzey Diyarı açılıyor: süt ve mandıra, kooperatif, banka ve Demirkol'la fiyat savaşı."),
            ("Fabrika Dumanı", "Un, yem ve şeker fabrikaları, tekstil atölyesi, toptancıyla sözleşmeler."),
            ("Yollar ve Limanlar", "Meslek okulu, bursiyerler, kamyon filosu, soğuk hava deposu ve ilk ihracat gemisi."),
            ("Miras", "Holding ve şirketlerin, köye hastane ve kütüphane, Hasan Dede Vakfı."),
        ],
        "feat_k": "Özellikler", "feat_h": "Yaşayan bir dünya",
        "feats": [
            ("Sıfırdan bir çiftlik", "Ekip biç, sula, hasat et. Ahır, kümes, sera, sulama kanalı ve güneş panelleriyle çiftliğini adım adım büyüt; evini, tarlanı, ahırını istediğin yere yerleştir.", ["Tarla ve sera", "Serbest yerleşim", "Güneş paneli"]),
            ("Hayvancılık", "İnek, koyun ve keçi meraları; kuzular, oğlaklar, Veteriner Elif. Mandırada yoğurt, ayran, peynir, kaşar ve tereyağı üret.", ["İnek · koyun · keçi", "Mandıra", "Veteriner"]),
            ("Yaşayan bir köy", "Yüzlerce köylü kendi işinde: kahvehane, cami, pansiyon, turistler. Gece dışarıdakilere neden orada olduklarını sor.", ["400+ köylü", "Turistler", "Köy projeleri"]),
            ("Fabrikadan limana", "Un, yem ve şeker fabrikaları kur, toptancıyla sözleşme yap, kamyonlarla taşı, Mersin limanından ihracat yap.", ["Fabrikalar", "Lojistik", "İhracat"]),
            ("Göl ve doğa", "Hazar Gölü'nde balık tut: iri balık zor çekilir ama pahalı satılır. Kuzey yamacındaki şelaleyi keşfet, dal, mantar topla, mevsimlere ve kurtlara hazırlıklı ol.", ["Balıkçılık", "Şelale", "Mevsimler"]),
            ("Birlikte oyna", "Arkadaşının köyünü ziyaret et, kooperatif kur, pazarda ticaret yap, bölge telsiziyle ve sesli aramayla konuş.", ["Kooperatif", "Pazar", "Telsiz"]),
        ],
        "gal_k": "Görüntüler", "gal_h": "Oyundan kareler", "gal_sub": "Tümü oyunun içinden, gerçek görüntülerdir.",
        "tr_k": "Resmî fragman", "tr_h": "Toprağın Mirası'nı izle", "tr_note": f"Oyun içinden çekilmiştir · Sürüm {TRAILER_VERSION}",
        "t_k": "Erken erişim", "t_h": "İlk oynayanlardan ol",
        "t_sub": "Toprağın Mirası yakında mağazalarda. Android kapalı testine şimdi katılabilirsin.",
        "t_and_h": "Google Play · Kapalı test",
        "t_and_p": "Google Play'de kullandığın Gmail adresini bırak. Seni test listesine ekleyip davet bağlantısını e-postayla göndereceğiz.",
        "t_email": "Gmail adresin", "t_name": "Adın (isteğe bağlı)",
        "t_consent": "E-posta adresimin yalnızca test daveti için kullanılmasını kabul ediyorum.",
        "t_send": "Teste katıl",
        "t_ok": "Teşekkürler! Kaydın alındı. Davet e-postası geldiğinde Google Play'den testi indirebilirsin.",
        "t_dup": "Bu tarayıcıdan zaten kayıt oldun. Teşekkürler!",
        "t_err": "Kayıt gönderilemedi. Lütfen biraz sonra tekrar dene ya da bize e-posta gönder.",
        "t_bad": "Lütfen geçerli bir e-posta adresi yaz.",
        "t_ios_h": "App Store · iOS", "t_ios_p": "iPhone ve iPad sürümü üzerinde çalışıyoruz.", "t_soon": "Yakında",
        "about_k": "Stüdyo", "about_h": "Tasami hakkında",
        "about": [
            "Tasami, oyun tasarlayan ve geliştiren, mobil ve web uygulamaları üreten bağımsız bir stüdyo. İki kimya mühendisi tarafından kuruldu.",
            "Mühendislikten gelen alışkanlıkla çalışıyoruz: önce sistemi kuruyor, sonra ölçüyor, deniyor ve iyileştiriyoruz. Oyunlarımızda ekonomi, üretim zinciri ve dünya bu yüzden birbirine bağlı ve tutarlı.",
            "Adımız kurucularımızın adlarından geliyor: Taha ve Sami.",
        ],
        "services": ["Oyun tasarımı ve geliştirme", "Mobil uygulamalar", "Web uygulamaları"],
        "contact_h": "Bize ulaşın",
        "contact": "Oyun hakkında görüşünüz, iş birliği teklifiniz ya da bir uygulama fikriniz mi var? Yazın, dönüş yapalım.",
        "mail": "E-posta gönder",
        "privacy": "Gizlilik politikası", "delete": "Hesap silme", "rights": "Tüm hakları saklıdır.", "music": "Müzik", "music_on": "Müziği aç", "music_off": "Müziği kapat", "credit": "Müzikteki enstrüman sesleri: FluidR3 GM (Frank Wen, CC BY 3.0)",
        "close": "Kapat", "prev": "Önceki", "next": "Sonraki",
    },
    "en": {
        "lang": "en", "path": "en/", "base": "../",
        "other_lang": "TR", "other_href": "../", "other_name": "Türkçe",
        "title": "Legacy of the Land · Tasami game and app studio",
        "desc": "Legacy of the Land (Toprağın Mirası): a 3D multiplayer life sim where you build a farm, a village, factories and a holding company on the land your grandfather left you by Lake Hazar. Tasami is an independent game and app studio.",
        "nav": ["Game", "Story", "Features", "Screenshots", "Early access", "Studio"],
        "menu": "Menu",
        "kicker": "Tasami's first game",
        "game": "Legacy of the Land",
        "tagline": "Arrive empty-handed on the land your grandfather left you. Build your farm, grow your village, run your factories and leave your own legacy on the shores of Lake Hazar.",
        "cta_test": "Join the closed test",
        "cta_watch": "Watch the trailer",
        "badge": f"Version {VERSION} · Android closed test",
        "scroll": "Explore",
        "presents": "presents", "yt_btn": "Watch on YouTube", "upd_k": "Live from the game", "upd_h": "Latest updates", "upd_v": "Version", "slogan": "From Soil to Industry",
        "trailer": "legacy-of-the-land-trailer.mp4",
        "marquee": ["Fields", "Barns", "Dairy", "Sheep &amp; goats", "Factories", "Harbour", "Holding", "Fishing", "Co-op", "Solar power"],
        "play_tr": "Play trailer",
        "stats": [(str(GAME["quests"]), "story quests"), (str(GAME["chapters"]), "chapters"), (str(GAME["languages"]), "languages"), ("400+", "living villagers")],
        "story_k": "Story",
        "story_h": "A village reborn",
        "story": [
            "You are the grandchild of the late Grandpa Hasan. With a bag and a few coins, you arrive in Sivrice, at the farm that has been waiting for you for years.",
            "First you gather wood, braid rope and buy your first chickens. Then come fields, barns, pastures and a village fountain. As the village grows come a dairy and a co-op, then factories, trucks and export ships.",
            "In the end you build your own holding company and pass Grandpa Hasan's legacy on to the village through a foundation.",
        ],
        "ch_k": "6 chapters", "ch_h": "From empty hands to a holding",
        "chapter": "Chapter",
        "chapters": [
            ("Empty Hands", "Wood, rope, baskets and your first chickens. Repair grandpa's house and learn to get by."),
            ("Taking Root", "Barns, fields, your first workers, tourists and a diving centre on the lake."),
            ("The Village's Hope", "The Northlands open up: milk and a dairy, a co-op, the bank and a price war with Demirkol."),
            ("Factory Smoke", "Flour, feed and sugar factories, a textile workshop and contracts with wholesalers."),
            ("Roads and Harbours", "A vocational school, scholarships, a truck fleet, cold storage and the first export ship."),
            ("Legacy", "A holding and its companies, a hospital and library for the village, the Hasan Dede Foundation."),
        ],
        "feat_k": "Features", "feat_h": "A living world",
        "feats": [
            ("A farm from scratch", "Sow, water and harvest. Grow your farm step by step with barns, a coop, a greenhouse, irrigation and solar panels, and place your house, fields and barns wherever you like.", ["Fields & greenhouse", "Free placement", "Solar"]),
            ("Livestock", "Cow, sheep and goat pastures; lambs, kids and Elif the vet. Make yoghurt, ayran, cheese, kashar and butter at your dairy.", ["Cows · sheep · goats", "Dairy", "Vet"]),
            ("A living village", "Hundreds of villagers going about their day: tea house, mosque, guesthouse, tourists. Ask the night owls why they're still out.", ["400+ villagers", "Tourists", "Village projects"]),
            ("From factory to harbour", "Build flour, feed and sugar factories, sign wholesale contracts, haul goods by truck and export from the port of Mersin.", ["Factories", "Logistics", "Exports"]),
            ("Lake and nature", "Fish Lake Hazar: big fish fight harder but sell for more. Find the waterfall on the northern slope, dive, forage mushrooms and be ready for the seasons and the wolves.", ["Fishing", "Waterfall", "Seasons"]),
            ("Play together", "Visit friends' villages, form a co-op, trade at the market, talk on the regional radio or by voice call.", ["Co-op", "Market", "Radio"]),
        ],
        "gal_k": "Screenshots", "gal_h": "Scenes from the game", "gal_sub": "All captured in-game.",
        "tr_k": "Official trailer", "tr_h": "Watch Legacy of the Land", "tr_note": f"Captured in-game · Version {TRAILER_VERSION}",
        "t_k": "Early access", "t_h": "Be among the first to play",
        "t_sub": "Legacy of the Land is coming to the stores soon. You can join the Android closed test now.",
        "t_and_h": "Google Play · Closed test",
        "t_and_p": "Leave the Gmail address you use on Google Play. We'll add you to the tester list and email you the invite link.",
        "t_email": "Your Gmail address", "t_name": "Your name (optional)",
        "t_consent": "I agree that my email address is used only for the test invitation.",
        "t_send": "Join the test",
        "t_ok": "Thanks! You're signed up. When the invite arrives, you can install the test from Google Play.",
        "t_dup": "You've already signed up from this browser. Thanks!",
        "t_err": "Couldn't send your sign-up. Please try again later or email us.",
        "t_bad": "Please enter a valid email address.",
        "t_ios_h": "App Store · iOS", "t_ios_p": "We're working on the iPhone and iPad version.", "t_soon": "Coming soon",
        "about_k": "Studio", "about_h": "About Tasami",
        "about": [
            "Tasami is an independent studio that designs and develops games and builds mobile and web apps. It was founded by two chemical engineers.",
            "We work the way engineers do: build the system first, then measure, test and improve. That is why the economy, production chains and world in our games fit together.",
            "Our name comes from our founders' names: Taha and Sami.",
        ],
        "services": ["Game design & development", "Mobile apps", "Web apps"],
        "contact_h": "Get in touch",
        "contact": "Feedback on the game, a partnership offer or an app idea? Write to us and we'll get back to you.",
        "mail": "Send an email",
        "privacy": "Privacy policy", "delete": "Account deletion", "rights": "All rights reserved.", "music": "Music", "music_on": "Play music", "music_off": "Mute music", "credit": "Instrument samples in the music: FluidR3 GM (Frank Wen, CC BY 3.0)",
        "close": "Close", "prev": "Previous", "next": "Next",
    },
}

NAV_IDS = ["oyun", "hikaye", "ozellikler", "goruntuler", "test", "studyo"]


def img(b, name, alt, cls="", eager=False, big=False):
    src = f"{b}assets/img/oyun/{name}{'' if big else '-k'}.webp"
    srcset = f"{b}assets/img/oyun/{name}-k.webp 960w, {b}assets/img/oyun/{name}.webp 1920w"
    lazy = "" if eager else ' loading="lazy" decoding="async"'
    return (f'<img src="{src}" srcset="{srcset}" sizes="(max-width: 900px) 100vw, 60vw" '
            f'alt="{alt}" width="1920" height="1080"{lazy}{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}>')


def render(t):
    b = t["base"]
    en = t["lang"] == "en"
    stats = "".join(
        f'<div class="stat reveal"><strong data-count="{n}">{n}</strong><span>{l}</span></div>' for n, l in t["stats"])
    story = "".join(f"<p>{p}</p>" for p in t["story"])
    chapters = "".join(
        f'<li class="ch reveal" style="--i:{i}"><figure>{img(b, CHAPTER_IMG[i], h)}</figure>'
        f'<div class="ch-body"><span class="ch-n">{t["chapter"]} {i+1}</span><h3>{h}</h3><p>{d}</p></div></li>'
        for i, (h, d) in enumerate(t["chapters"]))
    feats = "".join(
        f'<article class="feat{" flip" if i % 2 else ""}"><figure class="feat-img reveal">{img(b, FEATURE_IMG[i], h)}</figure>'
        f'<div class="feat-txt reveal"><span class="feat-n">0{i+1}</span><h3>{h}</h3><p>{d}</p>'
        f'<ul class="tags">{"".join(f"<li>{x}</li>" for x in tags)}</ul></div></article>'
        for i, (h, d, tags) in enumerate(t["feats"]))
    gallery = "".join(
        f'<figure class="g-item reveal{" wide" if i in (0, 4) else ""}" style="--i:{i % 4}"><a href="{b}assets/img/oyun/{n}.webp" data-cap="{(ce if en else ct)}">'
        f'{img(b, n, t["game"] + ": " + (ce if en else ct))}</a><figcaption>{ce if en else ct}</figcaption></figure>'
        for i, (n, ct, ce) in enumerate(GALLERY))
    about = "".join(f"<p>{p}</p>" for p in t["about"])
    mon = (["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"] if not en else
           ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    def day(d):
        y, m, g = d.split("-"); return f"{int(g)} {mon[int(m) - 1]} {y}"
    updates = "".join(
        f'<li class="upd reveal" style="--i:{i}"><div class="upd-m"><b>{t["upd_v"]} {c["v"] // 100}.{c["v"] % 100:02d}</b>'
        f'<time datetime="{c["d"]}">{day(c["d"])}</time></div><p>{html.escape(c["en"] if en else c["tr"])}</p></li>'
        for i, c in enumerate(GAME["changes"]))
    services = "".join(f"<li>{s}</li>" for s in t["services"])
    mq = "".join(f"<span>{w}</span><i>✦</i>" for w in t["marquee"])
    marquee = f'<div class="mq-row"><div class="mq-in">{mq}{mq}</div></div><div class="mq-row rev"><div class="mq-in">{mq}{mq}</div></div>'
    nav = "".join(f'<a href="#{i}">{n}</a>' for i, n in zip(NAV_IDS, t["nav"]))
    ld = json.dumps([
        {"@context": "https://schema.org", "@type": "Organization", "name": "Tasami",
         "url": "https://tasami.com.tr/", "logo": "https://tasami.com.tr/assets/img/tasami-logo.png", "email": CONTACT},
        {"@context": "https://schema.org", "@type": "VideoGame", "name": t["game"], "alternateName": "Toprağın Mirası",
         "description": t["desc"], "genre": ["Simulation", "Farming"], "gamePlatform": ["Android"],
         "playMode": ["SinglePlayer", "MultiPlayer"], "author": {"@type": "Organization", "name": "Tasami"},
         "inLanguage": ["tr", "en", "de", "fr", "es", "ru", "ku"],
         "image": "https://tasami.com.tr/assets/img/oyun/baslik-og.jpg",
         "trailer": {"@type": "VideoObject", "name": t["game"] + " | " + t["tr_k"], "description": t["tagline"],
                     "embedUrl": "https://www.youtube.com/embed/" + YOUTUBE_ID, "url": YOUTUBE,
                     "thumbnailUrl": f"https://i.ytimg.com/vi/{YOUTUBE_ID}/hqdefault.jpg", "uploadDate": "2026-10-27"}},
    ], ensure_ascii=False)
    vals = dict(t, b=b, yt=YOUTUBE, stats=stats, updates=updates, story=story, chapters=chapters, feats=feats, gallery=gallery, about=about,
                services=services, nav=nav, marquee=marquee, ld=ld, mail_to=CONTACT,
                privacy_url=PLAY_URL + "gizlilik.html", delete_url=PLAY_URL + "hesap-sil.html",
                canonical="https://tasami.com.tr/" + t["path"],
                hero_img=img(b, "genel", "", eager=True, big=True),
                story_img=img(b, "koy-meydani", t["game"]))
    out = TEMPLATE
    for k, v in vals.items():
        if isinstance(v, str):
            out = out.replace("{{" + k + "}}", v)
    assert "{{" not in out, out[out.find("{{"):out.find("{{") + 40]
    return out


for t in T.values():
    p = ROOT / t["path"] / "index.html"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(render(t), encoding="utf-8")
    print("yazıldı:", p.relative_to(ROOT))
