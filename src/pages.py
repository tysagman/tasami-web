"""tasami.com.tr alt sayfalarının metinleri: gizlilik, kullanım koşulları, teşekkürler ve 404.
build.py bu dosyayı okur; metni değiştirince  python3 src/build.py  çalıştırın.
Her sayfa: (adres, başlık, açıklama, gövde HTML'i). Gövdede {mail}, {home}, {game_privacy}, {terms}, {privacy} kullanılabilir.
"""

UPDATED = {"tr": "10 Kasım 2026", "en": "10 November 2026"}

PRIVACY = {
    "tr": ("gizlilik/", "Gizlilik politikası ve KVKK aydınlatma metni | Tasami",
           "tasami.com.tr'de hangi verilerin neden toplandığı, nerede saklandığı ve KVKK kapsamındaki hakların.",
           """
<p class="doc-lead">Bu metin tasami.com.tr web sitesi içindir ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni yerine geçer. Toprağın Mirası oyununun kendi gizlilik politikası için <a href="{game_privacy}">buraya</a> bakabilirsin.</p>

<h2>Veri sorumlusu</h2>
<p>Tasami (kurucular Taha ve Sami). İletişim: <a href="mailto:{mail}">{mail}</a></p>

<h2>Hangi verileri topluyoruz?</h2>
<p><b>Kapalı test kayıt formu.</b> Formu doldurursan şunları kaydederiz: Gmail adresin, istersen yazdığın adın, sayfanın dili (Türkçe ya da İngilizce), kayıt zamanı ve formun gönderilmesi için tarayıcına otomatik verilen anonim bir kimlik numarası.</p>
<p><b>Ziyaret istatistikleri.</b> Sitenin kaç kişi tarafından ve hangi sayfalardan ziyaret edildiğini Cloudflare Web Analytics ile ölçeriz. Bu araç çerez kullanmaz, seni tanımlamaz ve ziyaretleri yalnızca toplu sayılar olarak gösterir.</p>
<p><b>Sunucu kayıtları.</b> Site GitHub Pages üzerinde yayınlanır. GitHub, güvenlik amacıyla ziyaretçilerin IP adreslerini kısa süreli kaydedebilir. Yazı tipleri Google Fonts'tan yüklenir; bu sırada tarayıcın Google'a bağlanır.</p>

<h2>Neden topluyoruz?</h2>
<p>Test formundaki e-posta adresini yalnızca seni Google Play kapalı testine eklemek ve davet bağlantısını göndermek için kullanırız. Reklam, bülten ya da başka bir amaçla kullanmayız, kimseye satmayız. Ziyaret istatistiklerini sitenin hangi bölümlerinin ilgi gördüğünü anlamak için kullanırız.</p>

<h2>Hukuki sebep ve yurt dışına aktarım</h2>
<p>Test kaydı, formdaki onay kutusuyla verdiğin <b>açık rızaya</b> dayanır. Kayıtlar Google'ın Firebase (Cloud Firestore) hizmetinde saklanır ve bu sunucular Türkiye dışında bulunabilir. Onay kutusunu işaretleyerek bu aktarıma da onay vermiş olursun. Rızanı istediğin zaman geri alabilirsin.</p>

<h2>Ne kadar süre saklıyoruz?</h2>
<p>Test kayıtlarını kapalı test sürdüğü müddetçe saklarız. Oyun mağazada herkese açıldığında ya da sen istediğinde kaydını sileriz.</p>

<h2 id="cerezler">Çerezler ve tarayıcıda saklanan bilgiler</h2>
<p>Sitede reklam veya takip çerezi yoktur. Tarayıcının yerel hafızasında yalnızca şu küçük tercihler tutulur: müziği açıp kapattığın, açılış animasyonunu bu oturumda görüp görmediğin, çerez bildirimini kapattığın ve test formunu daha önce gönderip göndermediğin. Formu gönderirken Firebase, anonim kimliği tarayıcında saklar. Bu bilgileri tarayıcı ayarlarından istediğin zaman silebilirsin.</p>

<h2>Hakların (KVKK madde 11)</h2>
<p>Kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini ya da yok edilmesini isteme, bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, otomatik analiz sonucu aleyhine bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğradıysan zararın giderilmesini isteme hakların vardır.</p>
<p>Bu haklarını kullanmak ya da kaydını sildirmek için <a href="mailto:{mail}">{mail}</a> adresine yazman yeterli. En geç 30 gün içinde yanıt veririz.</p>

<h2>Değişiklikler</h2>
<p>Bu metni güncellediğimizde en alttaki tarihi de değiştiririz.</p>
"""),
    "en": ("en/privacy/", "Privacy policy | Tasami",
           "What data tasami.com.tr collects, why, where it is stored and your rights.",
           """
<p class="doc-lead">This policy covers the tasami.com.tr website. It also serves as our notice under Turkey's Personal Data Protection Law No. 6698 (KVKK). For the privacy policy of the game Legacy of the Land, see <a href="{game_privacy}">this page</a>.</p>

<h2>Data controller</h2>
<p>Tasami (founders Taha and Sami). Contact: <a href="mailto:{mail}">{mail}</a></p>

<h2>What we collect</h2>
<p><b>Closed test sign-up form.</b> If you fill in the form we store your Gmail address, your name if you give it, the page language (Turkish or English), the time of sign-up and an anonymous ID that your browser is given automatically so the form can be sent.</p>
<p><b>Visit statistics.</b> We measure how many people visit the site and which pages they view with Cloudflare Web Analytics. It uses no cookies, does not identify you and only shows visits as totals.</p>
<p><b>Server logs.</b> The site is hosted on GitHub Pages. GitHub may briefly log visitors' IP addresses for security. Fonts are loaded from Google Fonts, so your browser connects to Google while loading them.</p>

<h2>Why we collect it</h2>
<p>We use the email address from the test form only to add you to the Google Play closed test and send you the invite link. We never use it for ads or newsletters and never sell it. We use visit statistics to see which parts of the site people find interesting.</p>

<h2>Legal basis and transfers abroad</h2>
<p>The test sign-up is based on the <b>explicit consent</b> you give with the checkbox on the form. Sign-ups are stored in Google's Firebase (Cloud Firestore) service, whose servers may be outside Turkey. By ticking the box you also agree to this transfer. You can withdraw your consent at any time.</p>

<h2>How long we keep it</h2>
<p>We keep test sign-ups while the closed test runs. We delete your sign-up when the game launches publicly or whenever you ask us to.</p>

<h2 id="cerezler">Cookies and data stored in your browser</h2>
<p>The site has no advertising or tracking cookies. Your browser's local storage only keeps a few small preferences: whether you turned the music on or off, whether you have seen the intro animation this session, whether you dismissed the cookie notice and whether you already sent the test form. When you send the form, Firebase keeps the anonymous ID in your browser. You can delete all of this in your browser settings at any time.</p>

<h2>Your rights</h2>
<p>You have the right to know whether we process your personal data, to get information about it, to know its purpose and who it is shared with, to have it corrected, deleted or destroyed, to have those changes passed on to anyone it was shared with, to object to automated decisions against you and to claim compensation for unlawful processing.</p>
<p>To use these rights or to have your sign-up deleted, just write to <a href="mailto:{mail}">{mail}</a>. We reply within 30 days.</p>

<h2>Changes</h2>
<p>When we update this policy we also change the date at the bottom.</p>
"""),
}

TERMS = {
    "tr": ("kullanim-kosullari/", "Kullanım koşulları | Tasami",
           "tasami.com.tr web sitesinin ve Toprağın Mirası kapalı testinin kullanım koşulları.",
           """
<p class="doc-lead">tasami.com.tr'yi ziyaret ederek ya da kapalı teste kaydolarak aşağıdaki koşulları kabul etmiş olursun.</p>

<h2>Site içeriği</h2>
<p>Sitedeki metinler, oyun görüntüleri, fragmanlar, müzik, Tasami ve Toprağın Mirası adları ve logoları Tasami'ye aittir. Haber, inceleme ya da tanıtım amacıyla, kaynak göstererek ve değiştirmeden paylaşabilirsin. Bunun dışında kopyalamak, satmak ya da başka bir ürünün tanıtımında kullanmak için önce bize yazmalısın.</p>

<h2>Kapalı test</h2>
<p>Kapalı test sürümü geliştirme aşamasındadır. Hatalar, veri kayıpları ve sık güncellemeler olabilir; test sırasındaki ilerlemen oyun mağazada açıldığında sıfırlanabilir. Teste katılım ücretsizdir ve kontenjan sınırlı olabilir; her kayda davet gönderilmesi garanti değildir. Test sürümünü yeniden dağıtmamanı rica ederiz.</p>
<p>Oyunun kendisini kullanırken oyunun kendi kuralları ve <a href="{game_privacy}">gizlilik politikası</a> geçerlidir.</p>

<h2>Sorumluluk</h2>
<p>Siteyi doğru ve güncel tutmaya çalışırız, ancak oyunla ilgili bilgiler (özellikler, sayılar, çıkış tarihleri) önceden haber verilmeden değişebilir. Sitenin kesintisiz çalışacağını garanti etmeyiz. Sitedeki dış bağlantıların (YouTube, Google Play gibi) içeriğinden o siteler sorumludur.</p>

<h2>Kişisel veriler</h2>
<p>Hangi verileri neden topladığımızı <a href="{privacy}">gizlilik politikasında</a> anlatıyoruz.</p>

<h2>Uygulanacak hukuk</h2>
<p>Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Koşulları güncellediğimizde en alttaki tarihi değiştiririz. Sorun için <a href="mailto:{mail}">{mail}</a> adresine yazabilirsin.</p>
"""),
    "en": ("en/terms/", "Terms of use | Tasami",
           "Terms of use for the tasami.com.tr website and the Legacy of the Land closed test.",
           """
<p class="doc-lead">By visiting tasami.com.tr or signing up for the closed test, you agree to the terms below.</p>

<h2>Site content</h2>
<p>The texts, game screenshots, trailers, music, the names Tasami and Legacy of the Land and their logos on this site belong to Tasami. You may share them unchanged, with credit, for news, reviews or promotion of the game. For any other use, such as copying, selling or promoting another product, please write to us first.</p>

<h2>Closed test</h2>
<p>The closed test build is still in development. Expect bugs, possible data loss and frequent updates; your test progress may be reset when the game launches. Joining the test is free and places may be limited, so an invite is not guaranteed for every sign-up. Please don't redistribute the test build.</p>
<p>While playing the game itself, the game's own rules and <a href="{game_privacy}">privacy policy</a> apply.</p>

<h2>Liability</h2>
<p>We try to keep the site accurate and up to date, but game details (features, numbers, release dates) may change without notice. We don't guarantee the site will always be available. Linked sites such as YouTube and Google Play are responsible for their own content.</p>

<h2>Personal data</h2>
<p>Our <a href="{privacy}">privacy policy</a> explains what data we collect and why.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of the Republic of Turkey. When we update them we change the date at the bottom. Questions: <a href="mailto:{mail}">{mail}</a></p>
"""),
}

THANKS = {
    "tr": ("tesekkurler/", "Teşekkürler, kaydın alındı | Tasami",
           "Toprağın Mirası kapalı test kaydın alındı.",
           """
<div class="ty-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
<h1>Teşekkürler, kaydın alındı!</h1>
<p class="doc-lead">Toprağın Mirası kapalı test listesine eklendin. Bundan sonrası şöyle:</p>
<ol class="ty-steps">
  <li><b>Davet e-postasını bekle.</b> Seni test listesine eklediğimizde Gmail adresine bir davet bağlantısı göndereceğiz. Birkaç gün sürebilir; gelmezse spam klasörüne de bak.</li>
  <li><b>Daveti kabul et.</b> Bağlantıyı Google Play'de kullandığın hesapla açıp "Test kullanıcısı ol"a dokun.</li>
  <li><b>Oyunu indir.</b> Toprağın Mirası Google Play'de karşına çıkacak. İyi hasatlar!</li>
</ol>
<p class="ty-cta"><a class="btn primary" href="{home}">Ana sayfaya dön</a> <a class="btn glass" href="{home}#fragman">Fragmanı izle</a></p>
<p class="ty-note">Bir sorun mu var? <a href="mailto:{mail}">{mail}</a></p>
"""),
    "en": ("en/thanks/", "Thanks, you're signed up | Tasami",
           "You're signed up for the Legacy of the Land closed test.",
           """
<div class="ty-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
<h1>Thanks, you're signed up!</h1>
<p class="doc-lead">You're on the Legacy of the Land closed test list. Here's what happens next:</p>
<ol class="ty-steps">
  <li><b>Wait for the invite.</b> When we add you to the tester list, we'll send an invite link to your Gmail address. It can take a few days; check your spam folder too.</li>
  <li><b>Accept the invite.</b> Open the link with the account you use on Google Play and tap "Become a tester".</li>
  <li><b>Install the game.</b> Legacy of the Land will show up for you on Google Play. Happy harvesting!</li>
</ol>
<p class="ty-cta"><a class="btn primary" href="{home}">Back to the home page</a> <a class="btn glass" href="{home}#fragman">Watch the trailer</a></p>
<p class="ty-note">Something wrong? <a href="mailto:{mail}">{mail}</a></p>
"""),
}

NOT_FOUND = """
<div class="nf-code" aria-hidden="true">404</div>
<h1>Bu tarla henüz ekilmemiş</h1>
<p class="doc-lead">Aradığın sayfa yok ya da taşınmış olabilir.</p>
<p class="ty-cta"><a class="btn primary" href="/">Ana sayfaya dön</a></p>
<hr class="nf-sep">
<h2 lang="en">Nothing has been planted here yet</h2>
<p lang="en">The page you're looking for doesn't exist or has moved.</p>
<p class="ty-cta" lang="en"><a class="btn glass" href="/en/">Go to the English home page</a></p>
"""
