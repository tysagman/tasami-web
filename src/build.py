#!/usr/bin/env python3
"""tasami.com.tr sayfalarını üretir: Türkçe (/) ve İngilizce (/en/).
Metinleri değiştirmek için aşağıdaki T sözlüğünü düzenleyin, sonra:  python3 src/build.py
"""
import json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = (ROOT / "src" / "template.html").read_text(encoding="utf-8")

PLAY_URL = "https://tysagman.github.io/toprak-oyun/oyun/"
CONTACT = "info@tasami.com.tr"

SHOTS = ["ciftlik-genel", "koy-meydani", "gol-kiyisi", "ciftlik", "iskele", "sehir"]

T = {
    "tr": {
        "lang": "tr", "path": "", "base": "",
        "other_lang": "EN", "other_href": "en/",
        "title": "Tasami · Oyun ve uygulama stüdyosu · Toprağın Mirası",
        "desc": "Tasami, oyun ve mobil uygulama geliştiren bağımsız bir stüdyo. İlk oyunumuz Toprağın Mirası: Hazar Gölü kıyısında sıfırdan çiftlik ve köy kurduğun 3D çok oyunculu bir yaşam oyunu.",
        "nav": ["Oyun", "Özellikler", "Görseller", "Hakkımızda", "İletişim"],
        "kicker": "Tasami'nin ilk oyunu",
        "game": "Toprağın Mirası",
        "tagline": "Dedenden kalan toprağa boş elle gel. Çiftliğini kur, köyünü büyüt, Hazar Gölü kıyısında kendi hikâyeni yaz.",
        "android": "Google Play testine katıl",
        "t_h": "Erken erişim",
        "t_sub": "Toprağın Mirası yakında mağazalarda. İlk oynayanlardan olmak ister misin?",
        "t_and_h": "Google Play · Kapalı test",
        "t_and_p": "Android test sürümüne katılmak için Google Play'de kullandığın Gmail adresini bırak. Seni test listesine ekleyip davet bağlantısını e-postayla göndereceğiz.",
        "t_email": "Gmail adresin",
        "t_name": "Adın (isteğe bağlı)",
        "t_consent": "E-posta adresimin yalnızca test daveti için kullanılmasını kabul ediyorum.",
        "t_send": "Teste katıl",
        "t_ok": "Teşekkürler! Kaydın alındı. Davet e-postası geldiğinde Google Play'den testi indirebilirsin.",
        "t_dup": "Bu tarayıcıdan zaten kayıt oldun. Teşekkürler!",
        "t_err": "Kayıt gönderilemedi. Lütfen biraz sonra tekrar dene ya da bize e-posta gönder.",
        "t_bad": "Lütfen geçerli bir e-posta adresi yaz.",
        "t_ios_h": "App Store · iOS",
        "t_ios_p": "iPhone ve iPad sürümü üzerinde çalışıyoruz.",
        "t_soon": "Yakında",
        "watch": "Fragmanı izle",
        "facts": [("52", "hikâye görevi"), ("4", "perde"), ("7", "dil"), ("Ücretsiz", "Android · iOS yakında")],
        "story_h": "Bir köyün yeniden doğuşu",
        "story": [
            "Rahmetli Hasan Dede'nin torunusun. Elinde bir çanta, cebinde birkaç altınla Sivrice'ye, dedenin yıllardır bekleyen çiftliğine geliyorsun.",
            "Önce odun toplayıp ip örüyorsun, ilk tavuklarını alıyorsun. Sonra tarlalar, ahırlar, köy çeşmesi, kahvehane ve pansiyon geliyor. Köy büyüdükçe Kuzey Diyarı'nın yolları açılıyor ve sonunda dedenin konağını geri alıyorsun.",
        ],
        "acts": [("Boş Eller", "Odun, ip, sepet ve ilk tavuklar. Hayatta kalmayı öğren."),
                 ("Toprağa Kök", "Ahır, tarlalar, çalışanlar, turistler ve dalış merkezi."),
                 ("Kuzey Diyarı", "Çamlıbel, değirmen, taş ocağı, arıcılık ve okul."),
                 ("Büyük Miras", "Sulama kanalı, müze, göl festivali ve dede konağı.")],
        "act": "Perde",
        "feat_h": "Neler yapabilirsin?",
        "feats": [
            ("🌾", "Tarım ve hayvancılık", "Ek, sula, biç. Tavuk, inek, at ve eşek besle; ahırını ve kümesini büyüt."),
            ("🏘️", "Köyünü kur", "Çeşme, kahvehane, pansiyon, müze. Muhtarın isteklerini karşıla, köyü turistlerle doldur."),
            ("🎣", "Göl ve doğa", "Hazar Gölü'nde balık tut, dal, ormanda mantar ve meyve topla. Mevsimler ve hava değişir."),
            ("👥", "Çok oyunculu", "Arkadaşının köyünü ziyaret et, kooperatif kur, pazarda ticaret yap, bölge telsiziyle konuş."),
            ("🧑‍🌾", "Çalışanlar", "Murat hayvanlara, Ayşe tarlaya bakar. Sen oyunda değilken bile çalışmaya devam ederler."),
            ("🚌", "Koca bir dünya", "Otobüsle şehre in, taksiyle Kuzey Diyarı'na çık. Köyler, kasabalar ve yüzlerce insan."),
        ],
        "gallery_h": "Oyundan görüntüler",
        "gallery_sub": "Tümü oyunun içinden, gerçek görüntülerdir.",
        "captions": ["Dedenin çiftliği", "Köy meydanı", "Göl kıyısı", "İlk günler", "İskele", "Şehir"],
        "about_kicker": "Stüdyo",
        "about_h": "Tasami hakkında",
        "about": [
            "Tasami, oyun tasarlayan ve geliştiren, mobil ve web uygulamaları üreten bağımsız bir stüdyo. İki kimya mühendisi tarafından kuruldu.",
            "Mühendislikten gelen alışkanlıkla çalışıyoruz: önce sistemi kuruyoruz, sonra ölçüyor, deniyor ve iyileştiriyoruz. Oyunlarımızda bu yüzden ekonomi, üretim zinciri ve dünya birbirine bağlı ve tutarlı.",
            "Adımız kurucularımızın adlarından geliyor: Taha ve Sami.",
        ],
        "services": ["Oyun tasarımı ve geliştirme", "Mobil uygulamalar (Android)", "Web uygulamaları"],
        "contact_h": "Bize ulaşın",
        "contact": "Oyun hakkında görüşünüz, iş birliği teklifiniz ya da bir uygulama fikriniz mi var? Yazın, dönüş yapalım.",
        "mail": "E-posta gönder",
        "privacy": "Gizlilik politikası",
        "delete": "Hesap silme",
        "rights": "Tüm hakları saklıdır.",
        "video_note": "Oyun içinden çekilmiştir.",
    },
    "en": {
        "lang": "en", "path": "en/", "base": "../",
        "other_lang": "TR", "other_href": "../",
        "title": "Tasami · Game and app studio · Legacy of the Land",
        "desc": "Tasami is an independent studio making games and mobile apps. Our first game, Legacy of the Land (Toprağın Mirası), is a 3D multiplayer life sim where you build a farm and a village from scratch on the shores of Lake Hazar.",
        "nav": ["Game", "Features", "Screenshots", "About", "Contact"],
        "kicker": "Tasami's first game",
        "game": "Legacy of the Land",
        "tagline": "Arrive empty-handed on the land your grandfather left you. Build your farm, grow your village and write your own story on the shores of Lake Hazar.",
        "android": "Join the Google Play test",
        "t_h": "Early access",
        "t_sub": "Legacy of the Land is coming to the stores soon. Want to be among the first to play?",
        "t_and_h": "Google Play · Closed test",
        "t_and_p": "To join the Android test, leave the Gmail address you use on Google Play. We'll add you to the tester list and email you the invite link.",
        "t_email": "Your Gmail address",
        "t_name": "Your name (optional)",
        "t_consent": "I agree that my email address is used only for the test invitation.",
        "t_send": "Join the test",
        "t_ok": "Thanks! You're signed up. When the invite arrives, you can install the test from Google Play.",
        "t_dup": "You've already signed up from this browser. Thanks!",
        "t_err": "Couldn't send your sign-up. Please try again later or email us.",
        "t_bad": "Please enter a valid email address.",
        "t_ios_h": "App Store · iOS",
        "t_ios_p": "We're working on the iPhone and iPad version.",
        "t_soon": "Coming soon",
        "watch": "Watch the trailer",
        "facts": [("52", "story quests"), ("4", "acts"), ("7", "languages"), ("Free", "Android · iOS soon")],
        "story_h": "A village reborn",
        "story": [
            "You are the grandchild of the late Grandpa Hasan. With a bag and a few coins, you arrive in Sivrice, at the farm that has been waiting for years.",
            "First you gather wood, braid rope and buy your first chickens. Then come fields, barns, a village fountain, a tea house and a guesthouse. As the village grows, the roads to the Northlands open, and in the end you win back your grandfather's mansion.",
        ],
        "acts": [("Empty Hands", "Wood, rope, baskets and your first chickens. Learn to get by."),
                 ("Taking Root", "Barns, fields, workers, tourists and a diving centre."),
                 ("The Northlands", "Çamlıbel, the mill, the quarry, beekeeping and a school."),
                 ("The Great Legacy", "Irrigation, a museum, the lake festival and the family mansion.")],
        "act": "Act",
        "feat_h": "What can you do?",
        "feats": [
            ("🌾", "Farming & animals", "Sow, water, harvest. Raise chickens, cows, horses and donkeys; expand your barn and coop."),
            ("🏘️", "Build your village", "Fountain, tea house, guesthouse, museum. Meet the headman's requests and bring in tourists."),
            ("🎣", "Lake & nature", "Fish and dive in Lake Hazar, forage mushrooms and fruit. Seasons and weather change."),
            ("👥", "Multiplayer", "Visit friends' villages, form a co-op, trade at the market, talk on the regional radio."),
            ("🧑‍🌾", "Workers", "Murat tends the animals, Ayşe the fields. They keep working even while you're offline."),
            ("🚌", "A big world", "Take the bus to the city or a taxi to the Northlands. Villages, towns and hundreds of people."),
        ],
        "gallery_h": "Screenshots",
        "gallery_sub": "All captured in-game.",
        "captions": ["Grandpa's farm", "Village square", "Lakeshore", "First days", "The pier", "The city"],
        "about_kicker": "Studio",
        "about_h": "About Tasami",
        "about": [
            "Tasami is an independent studio that designs and develops games and builds mobile and web apps. It was founded by two chemical engineers.",
            "We work the way engineers do: build the system first, then measure, test and improve. That is why the economy, production chains and world in our games fit together.",
            "Our name comes from our founders' names: Taha and Sami.",
        ],
        "services": ["Game design & development", "Mobile apps (Android)", "Web apps"],
        "contact_h": "Get in touch",
        "contact": "Feedback on the game, a partnership offer or an app idea? Write to us and we'll get back to you.",
        "mail": "Send an email",
        "privacy": "Privacy policy",
        "delete": "Account deletion",
        "rights": "All rights reserved.",
        "video_note": "Captured in-game.",
    },
}


def render(t):
    b = t["base"]
    facts = "".join(f'<div class="fact"><strong>{n}</strong><span>{l}</span></div>' for n, l in t["facts"])
    story = "".join(f"<p>{p}</p>" for p in t["story"])
    acts = "".join(
        f'<li><span class="act-n">{t["act"]} {i+1}</span><h3>{h}</h3><p>{d}</p></li>'
        for i, (h, d) in enumerate(t["acts"]))
    feats = "".join(f'<li><span class="fi" aria-hidden="true">{e}</span><h3>{h}</h3><p>{d}</p></li>' for e, h, d in t["feats"])
    gallery = "".join(
        f'<figure><a href="{b}assets/img/{s}.webp" data-cap="{c}"><img src="{b}assets/img/{s}-k.webp" '
        f'alt="{t["game"]}: {c}" loading="lazy" width="800" height="450"></a><figcaption>{c}</figcaption></figure>'
        for s, c in zip(SHOTS, t["captions"]))
    about = "".join(f"<p>{p}</p>" for p in t["about"])
    services = "".join(f"<li>{s}</li>" for s in t["services"])
    nav_ids = ["oyun", "ozellikler", "gorseller", "hakkimizda", "iletisim"]
    nav = "".join(f'<a href="#{i}">{n}</a>' for i, n in zip(nav_ids, t["nav"]))
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "Organization", "name": "Tasami",
        "url": "https://tasami.com.tr/", "logo": "https://tasami.com.tr/assets/img/tasami-logo.png",
        "email": CONTACT,
    }, ensure_ascii=False)
    vals = dict(t, b=b, facts=facts, story=story, acts=acts, feats=feats, gallery=gallery, about=about,
                services=services, nav=nav, ld=ld,
                contact=t["contact"], mail_to=CONTACT,
                privacy_url=PLAY_URL + "gizlilik.html", delete_url=PLAY_URL + "hesap-sil.html",
                canonical="https://tasami.com.tr/" + t["path"])
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
