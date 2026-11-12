"""tasami.com.tr alt sayfalarının metinleri: gizlilik, kullanım koşulları ve 404.
build.py bu dosyayı okur; metni değiştirince  python3 src/build.py  çalıştırın.
Her sayfa: (adres, başlık, açıklama, gövde HTML'i). Gövdede {mail}, {home}, {game_privacy}, {terms}, {privacy} kullanılabilir.
"""

UPDATED = {"tr": "12 Kasım 2026", "en": "12 November 2026"}

PRIVACY = {
    "tr": ("gizlilik/", "Gizlilik politikası ve KVKK aydınlatma metni | Tasami",
           "tasami.com.tr'de hangi verilerin neden toplandığı, nerede saklandığı ve KVKK kapsamındaki hakların.",
           """
<p class="doc-lead">Bu metin tasami.com.tr web sitesi içindir ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni yerine geçer. Toprağın Mirası oyununun kendi gizlilik politikası için <a href="{game_privacy}">buraya</a> bakabilirsin.</p>

<h2>Veri sorumlusu</h2>
<p>Tasami (kurucular Taha ve Sami). İletişim: <a href="mailto:{mail}">{mail}</a></p>

<h2>Hangi verileri topluyoruz?</h2>
<p>Sitede form, üyelik ya da hesap yoktur; senden ad, e-posta gibi bir bilgi istemeyiz.</p>
<p><b>Ziyaret istatistikleri.</b> Sitenin kaç kişi tarafından ve hangi sayfalardan ziyaret edildiğini Cloudflare Web Analytics ile ölçeriz. Bu araç çerez kullanmaz, seni tanımlamaz ve ziyaretleri yalnızca toplu sayılar olarak gösterir.</p>
<p><b>Sunucu kayıtları.</b> Site GitHub Pages üzerinde yayınlanır. GitHub, güvenlik amacıyla ziyaretçilerin IP adreslerini kısa süreli kaydedebilir. Yazı tipleri Google Fonts'tan yüklenir; bu sırada tarayıcın Google'a bağlanır.</p>

<h2>Neden topluyoruz?</h2>
<p>Ziyaret istatistiklerini yalnızca sitenin hangi bölümlerinin ilgi gördüğünü anlamak için kullanırız. Reklam ya da başka bir amaçla kullanmayız, kimseyle paylaşmayız.</p>

<h2>Eski kapalı test kayıtları</h2>
<p>Oyun Google Play'de yayına girmeden önce sitede bir kapalı test kayıt formu vardı. Oyun herkese açıldığı için formu kaldırdık. Formla bıraktığın e-posta adresi ve ad artık kullanılmaz; söz verdiğimiz gibi siliyoruz. Silindiğinden emin olmak istersen bize yazabilirsin.</p>

<h2 id="cerezler">Çerezler ve tarayıcıda saklanan bilgiler</h2>
<p>Sitede reklam veya takip çerezi yoktur. Tarayıcının yerel hafızasında yalnızca şu küçük tercihler tutulur: müziği açıp kapattığın, açılış animasyonunu bu oturumda görüp görmediğin, ve çerez bildirimini kapattığın. Bu bilgileri tarayıcı ayarlarından istediğin zaman silebilirsin.</p>

<h2>Hakların (KVKK madde 11)</h2>
<p>Kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini ya da yok edilmesini isteme, bu işlemlerin aktarıldığı kişilere bildirilmesini isteme, otomatik analiz sonucu aleyhine bir sonuç çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğradıysan zararın giderilmesini isteme hakların vardır.</p>
<p>Bu haklarını kullanmak için <a href="mailto:{mail}">{mail}</a> adresine yazman yeterli. En geç 30 gün içinde yanıt veririz.</p>

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
<p>The site has no forms, sign-ups or accounts; we never ask for your name, email or similar details.</p>
<p><b>Visit statistics.</b> We measure how many people visit the site and which pages they view with Cloudflare Web Analytics. It uses no cookies, does not identify you and only shows visits as totals.</p>
<p><b>Server logs.</b> The site is hosted on GitHub Pages. GitHub may briefly log visitors' IP addresses for security. Fonts are loaded from Google Fonts, so your browser connects to Google while loading them.</p>

<h2>Why we collect it</h2>
<p>We use visit statistics only to see which parts of the site people find interesting. We never use them for ads or any other purpose and never share them.</p>

<h2>Old closed test sign-ups</h2>
<p>Before the game launched on Google Play, the site had a closed test sign-up form. Now that the game is public we have removed it. The email addresses and names left through the form are no longer used and, as promised, we are deleting them. If you want confirmation that yours is gone, just write to us.</p>

<h2 id="cerezler">Cookies and data stored in your browser</h2>
<p>The site has no advertising or tracking cookies. Your browser's local storage only keeps a few small preferences: whether you turned the music on or off, whether you have seen the intro animation this session, and whether you dismissed the cookie notice. You can delete all of this in your browser settings at any time.</p>

<h2>Your rights</h2>
<p>You have the right to know whether we process your personal data, to get information about it, to know its purpose and who it is shared with, to have it corrected, deleted or destroyed, to have those changes passed on to anyone it was shared with, to object to automated decisions against you and to claim compensation for unlawful processing.</p>
<p>To use these rights, just write to <a href="mailto:{mail}">{mail}</a>. We reply within 30 days.</p>

<h2>Changes</h2>
<p>When we update this policy we also change the date at the bottom.</p>
"""),
}

TERMS = {
    "tr": ("kullanim-kosullari/", "Kullanım koşulları | Tasami",
           "tasami.com.tr web sitesinin kullanım koşulları.",
           """
<p class="doc-lead">tasami.com.tr'yi ziyaret ederek aşağıdaki koşulları kabul etmiş olursun.</p>

<h2>Site içeriği</h2>
<p>Sitedeki metinler, oyun görüntüleri, fragmanlar, müzik, Tasami ve Toprağın Mirası adları ve logoları Tasami'ye aittir. Haber, inceleme ya da tanıtım amacıyla, kaynak göstererek ve değiştirmeden paylaşabilirsin. Bunun dışında kopyalamak, satmak ya da başka bir ürünün tanıtımında kullanmak için önce bize yazmalısın.</p>

<h2>Oyun</h2>
<p>Oyunun kendisini kullanırken oyunun kendi kuralları ve <a href="{game_privacy}">gizlilik politikası</a> geçerlidir.</p>

<h2>Sorumluluk</h2>
<p>Siteyi doğru ve güncel tutmaya çalışırız, ancak oyunla ilgili bilgiler (özellikler, sayılar, çıkış tarihleri) önceden haber verilmeden değişebilir. Sitenin kesintisiz çalışacağını garanti etmeyiz. Sitedeki dış bağlantıların (YouTube, Google Play gibi) içeriğinden o siteler sorumludur.</p>

<h2>Kişisel veriler</h2>
<p>Hangi verileri neden topladığımızı <a href="{privacy}">gizlilik politikasında</a> anlatıyoruz.</p>

<h2>Uygulanacak hukuk</h2>
<p>Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Koşulları güncellediğimizde en alttaki tarihi değiştiririz. Sorun için <a href="mailto:{mail}">{mail}</a> adresine yazabilirsin.</p>
"""),
    "en": ("en/terms/", "Terms of use | Tasami",
           "Terms of use for the tasami.com.tr website.",
           """
<p class="doc-lead">By visiting tasami.com.tr you agree to the terms below.</p>

<h2>Site content</h2>
<p>The texts, game screenshots, trailers, music, the names Tasami and Legacy of the Land and their logos on this site belong to Tasami. You may share them unchanged, with credit, for news, reviews or promotion of the game. For any other use, such as copying, selling or promoting another product, please write to us first.</p>

<h2>The game</h2>
<p>While playing the game itself, the game's own rules and <a href="{game_privacy}">privacy policy</a> apply.</p>

<h2>Liability</h2>
<p>We try to keep the site accurate and up to date, but game details (features, numbers, release dates) may change without notice. We don't guarantee the site will always be available. Linked sites such as YouTube and Google Play are responsible for their own content.</p>

<h2>Personal data</h2>
<p>Our <a href="{privacy}">privacy policy</a> explains what data we collect and why.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of the Republic of Turkey. When we update them we change the date at the bottom. Questions: <a href="mailto:{mail}">{mail}</a></p>
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
