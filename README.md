# tasami.com.tr

Tasami stüdyosunun web sitesi (Türkçe `/`, İngilizce `/en/`). GitHub Pages ile yayınlanır, alan adı `CNAME` dosyasında.

## Metni değiştirmek
1. `src/build.py` içindeki `T` sözlüğünü (tr / en) düzenleyin. Sayfa yapısı `src/template.html`, görünüm `assets/site.css`.
2. `python3 src/build.py` çalıştırın; `index.html` ve `en/index.html` yeniden üretilir.
3. Commit + push. Site birkaç dakikada güncellenir.

Görseller `assets/img/`, fragman `assets/video/` içinde; hepsi oyunun içinden çekildi.
