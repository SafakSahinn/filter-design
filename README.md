# FilterDesign Studio 🎛️⚡

**Analog Filtre Tasarımı, Analiz, Op-Amp Devre Sentezi ve MATLAB Kod Üretim Portalı**  
*Les Thede'in **"Practical Analog and Digital Filter Design"** (Bölüm 1 - 4) kitabına dayalı interaktif mühendislik ve eğitim platformu.*

🌐 **Canlı Web Sürümü (GitHub Pages):** [https://safaksahinn.github.io/filter-design/](https://safaksahinn.github.io/filter-design/)

---

## 📖 Kitap Kapsamı ve Matematiksel Temeller (Bölüm 1 - 4)

Bu proje, Les Thede tarafından yazılan **"Practical Analog and Digital Filter Design"** kitabının ilk dört bölümünü hem teorik hem de pratik/uygulamalı olarak kapsar:

* **Bölüm 1: Filtrelere Giriş ve Filtre Seçicilikleri (Introduction to Filters & Selectivity)**
  * Filtre seçicilik sınıfları: Alçak Geçiren (Lowpass), Yüksek Geçiren (Highpass), Bant Geçiren (Bandpass), Bant Söndüren / Çentik (Bandstop / Notch).
  * Tolerans özellikleri: $a_{\text{pass}}$ (dB), $a_{\text{stop}}$ (dB), $f_{\text{pass}}$ ve $f_{\text{stop}}$.
  * İdeal ve pratik filtre yaklaşımları, geçiş oranı ($r$).
  * Analog, aktif (Op-Amp RC), pasif (RLC), switched-capacitor ve $G_m\text{-C}$ uygulama teknolojileri.
* **Bölüm 2: Normalize Analog Filtre Yaklaşım Fonksiyonları (Approximation Functions)**
  * Transfer fonksiyonu $H(s)$, $s$-düzlemi, kutuplar ve sıfırlar, kararlılık kriteri ($\text{Re}(p_k) < 0$).
  * **Butterworth Yaklaşımı:** Maksimum düz genlik yanıtı ($|H(j\omega)|^2 = \frac{1}{1 + \epsilon^2 \omega^{2n}}$), minimum derece formülü, birim çember kutup açıları $\theta_m = \frac{2m + 1 + n}{2n}\pi$, $R = \epsilon^{-1/n}$.
  * **Chebyshev Tip I Yaklaşımı:** Geçirme bandında eşit dalgalanma (equiripple), Chebyshev polinomları $C_n(\omega)$, elips kutup dağılımı ($D = \frac{1}{n}\sinh^{-1}(1/\epsilon)$, $a = \sinh D$, $b = \cosh D$).
  * **Ters Chebyshev (Tip II) Yaklaşımı:** Geçirme bandında düz, durdurma bandında dalgalı, $j\omega$ sanal eksenindeki sonlu iletim sıfırları ($\omega_{z,m} = 1/\cos\phi_m$).
  * **Eliptik (Cauer) Yaklaşımı:** Hem geçirme hem durdurma bandında çift eşit dalgalı, en dik geçiş bandı ve Jacobi eliptik fonksiyonları $cd(u, k)$.
* **Bölüm 3: Normalize Olmayan Filtreler ve Frekans Dönüşümleri (Transformations)**
  * $2\pi f$ açısal frekans dönüşümü: $\omega = 2\pi f \iff f = \frac{\omega}{2\pi}$.
  * **Alçak Geçiren Dönüşümü ($S \leftarrow s/\omega_0$):** 1. ve 2. derece faktör katsayılarının ($b_1 = B_1 \omega_0, \; b_2 = B_2 \omega_0^2$) ölçeklenmesi.
  * **Yüksek Geçiren Dönüşümü ($S \leftarrow \omega_0/s$):** DC bloklama, orijinde sıfırlar, $b_1 = \frac{B_1 \omega_0}{B_2}, \; b_2 = \frac{\omega_0^2}{B_2}$.
  * **Bant Geçiren Dönüşümü ($S \leftarrow \frac{s^2 + \omega_0^2}{Bs}$):** Geometrik merkez frekansı $\omega_0 = \sqrt{\omega_1 \omega_2}$, bant genişliği $B = \omega_2 - \omega_1$, derecenin iki katına çıkması ($2n$).
  * **Bant Söndüren (Notch) Dönüşümü ($S \leftarrow \frac{Bs}{s^2 + \omega_0^2}$):** Çentik frekansı $\omega_0 = \sqrt{\omega_{s1}\omega_{s2}}$.
  * Frekans yanıtı matematiği: Büyüklük (dB), faz açısı ($\angle H(j\omega)$) ve grup gecikmesi.
* **Bölüm 4: Op-Amp Aktif Filtre Gerçekleştirmeleri (Active Filter Implementation)**
  * Katsayı eşleme yöntemi: $H_c(s) = H_a(s)$.
  * **Sallen-Key Alçak Geçiren (LP):** Equal-component ($C_1 = C_2 = C$) yöntemi:
    $$R_1 = R_2 = R = \frac{1}{C\sqrt{b_2}}, \quad K = 3 - \frac{b_1}{\sqrt{b_2}}, \quad R_B = (K - 1)R_A \quad (R_A = 10\text{ k}\Omega)$$
  * **1. Derece Tampon Katı:** Pasif RC + Op-Amp Buffer ($R = \frac{1}{b_2 C}, \; K = 1.0$).
  * **Sallen-Key Yüksek Geçiren (HP):** $C_1 = C_2 = C, \; R_1 = R_2 = R = \frac{1}{C\sqrt{b_2}}, \; K = 3 - \frac{b_1}{\sqrt{b_2}}$.
  * **Sallen-Key & MFB Bant Geçiren (BP):** Çoklu geribesleme ve Sallen-Key rezonans katları.
  * **Twin-Tee (İkiz-T) Aktif Çentik Katları:** Ters Chebyshev ve Eliptik filtrelerin sonlu karmaşık sıfırlarını ($j\omega_z$) gerçekleştiren aktif çentik topolojisi.
  * **Çıkış Kazanç Dengeleme Gerilim Bölücüsü:** Toplam kat kazancını ($K_{\text{tot}} = \prod K_m$) $0\text{ dB}$ ($G_{\text{hedef}} = 1.0$) seviyesine eşitleyen $R_x, R_y$ empedans bölücüsü:
    $$G_A = \frac{1}{K_{\text{tot}}}, \quad R_x = \frac{R_{\text{hedef}}}{G_A}, \quad R_y = \frac{R_{\text{hedef}}}{1 - G_A} \quad (R_{\text{hedef}} = 10\text{ k}\Omega)$$
  * **Standart Komponent Eşleme:** E12 (%10) ve E24 (%5) standart direnç ve kondansatör serilerine yuvarlama.

---

## ✨ Öne Çıkan Özellikler

### 1. 🎛️ İki Ayrı Tasarım ve Hesaplama Modu
* **Normalize Olmayan (Unnormalized) Filtre Tasarımı (Bölüm 3 & 4):**
  * Gerçek frekans girdileri ($\text{Hz}$ veya $\text{rad/s}$).
  * 4 Filtre Seçicilik Türü: Alçak Geçiren, Yüksek Geçiren, Bant Geçiren, Bant Söndüren.
  * 4 Yaklaşım Türü: Butterworth, Chebyshev Tip I, Ters Chebyshev, Eliptik.
  * Frekans dönüşümleri, transfer fonksiyonları ve op-amp aktif devre sentezi.
* **Normalize Prototip Tasarımı ($\Omega_p = 1.0\text{ rad/s}$ / Bölüm 2):**
  * $\Omega_p = 1.0\text{ rad/s}$ normalize alçak geçiren prototipe kilitli analiz.
  * $\Omega_s$ durdurma frekansı ve $r = \Omega_s / \Omega_p$ geçiş oranı ile doğrudan $S$-düzlemi analizi.
  * $0.1 \dots 10\text{ rad/s}$ normalize frekans eksenli Bode ve kutup-sıfır grafikleri.

### 2. 📐 Açılır-Kapanır Canlı Formül ve Analitik Çözüm Penceresi
* **Kullanıcının Girdiği Değerlerle Sayısal İkame:**
  * Parametreler değiştirildiği anda tüm adımlar formüllere canlı olarak yerleştirilir.
  * **Aşama 1 (Bölüm 2):** Dalgalanma faktörü ($\epsilon$), durdurma faktörü ($\epsilon_s$), geçiş oranı ($r$), minimum derece ($n$), yarıçap/elips parametreleri ($R, D$), kutup açıları ($\theta_m, \phi_m$), biquad katsayıları ($B_1, B_2$) ve normalize $H_m(S)$ tablosu.
  * **Aşama 2 (Bölüm 3):** Seçilen filtre tipine ait dönüşüm çekirdeği ($S \leftarrow s/\omega_0$ vb.), açısal frekans hesabı ($\omega_0 = 2\pi f$), gerçek katsayılar ($b_1, b_2$) ve gerçek $H(s)$ tablosu.
  * **Aşama 3 (Bölüm 4):** Taban kapasitör $C$ ile eşit elemanlı direnç formülleri ($R = \frac{1}{C\sqrt{b_2}}$), op-amp kazancı ($K = 3 - \frac{b_1}{\sqrt{b_2}}$), geribesleme dirençleri ($R_B = (K-1)R_A$), aşama bazlı eleman tablosu ve çıkış kazanç bölücüsü ($G_A, R_x, R_y$).
* **Gelişmiş KaTeX Tipografisi:**
  * Transfer fonksiyonları ve formüller büyük, net ve ferah `\displaystyle` modunda render edilir.
* **Akordeon & Tam Ekran Modal:**
  * Tek tıkla sayfa içi açılıp kapanabilir akordeon yapısı.
  * **`⤢ Tam Ekran Pencere`** butonu ile genişletilmiş modal raporu ve **`🖨️ Yazdır`** (PDF) desteği.

### 3. 🔍 4 Kapsamlı Derinlemesine Pop-up Modülü
Her bölümün konusu için bağımsız, ayrıntılı matematiksel türetimler, çift parametrik SVG diyagramları ve kitaptaki tüm adım adım sayısal çözümleri barındıran zengin pop-up modülleri:
1. **Filtre Türleri Rehberi Pop-up'ı (`filter-types-modal.js`):** Alçak Geçiren, Yüksek Geçiren, Bant Geçiren ve Bant Söndüren filtrelerin spektrum, kutup-sıfır ve mühendislik karşılaştırmaları.
2. **Normalize Yaklaşımlar Pop-up'ı (`approx-modal.js`):** Butterworth, Chebyshev I, Ters Chebyshev ve Eliptik filtrelerin tam matematiksel algoritmaları ve **Kitap Örnekleri 2.1 – 2.10**'un adım adım sayısal çözümleri.
3. **Frekans Dönüşümleri Pop-up'ı (`transform-modal.js`):** LP'den LP, HP, BP ve BS dönüşümlerinin analitik katsayı bağıntıları ve **Kitap Örnekleri 3.1 – 3.9**'un çözümleri.
4. **Aktif Devreler Pop-up'ı (`circuit-modal.js`):** Sallen-Key LP, HP, BP ve Twin-Tee BS devrelerinin KCL düğüm türetimleri ve **Kitap Örnekleri 4.1 – 4.6**'nın çözümleri.
* *Tüm pop-up sekmelerinde yer alan **"🚀 Bu Örneği Tasarımcıya Yükle"** butonları ile tek tıkla canlı tasarım başlatılabilir.*

### 4. 📚 Kitaptaki Tüm Örnekler Veritabanı (25 Örnek)
* Sol menüdeki **`Tümü (25) →`** butonu ile erişilen arama ve filtreleme modalı:
  * **Bölüm 2:** 10 Örnek (Örnek 2.1 – 2.10)
  * **Bölüm 3:** 9 Örnek (Örnek 3.1 – 3.9)
  * **Bölüm 4:** 6 Örnek (Örnek 4.1 – 4.6)
* Anlık arama kutusu ve tek tıkla tasarımcıya otomatik parametre yükleme.

### 5. 📈 4 Eşzamanlı Yüksek Çözünürlüklü Grafik Motoru (Canvas)
* **Bode Büyüklük Yanıtı (dB):** Logaritmik frekans ekseni, kesik çizgili $-a_{\text{pass}}$ ve $-a_{\text{stop}}$ tolerans limit çizgileri.
* **Bode Faz Yanıtı (Derece):** $-180^\circ \dots +180^\circ$ faz eğrisi.
* **s-Düzlemi Kutup-Sıfır Haritası:** $\sigma$ ve $j\omega$ eksenleri, birim çember / elips sınırları, kutuplar ($\times$) ve sıfırlar ($\circ$).
* **Birim Basamak Yanıtı ($h(t)$):** Bilinear dönüşüm IIR filtre simülasyonu ile zaman domeninde geçici yanıt, aşım ve yerleşme süresi.

### 6. 🔌 Vektörel SVG Aktif Devre Şematikleri
* Sallen-Key ve Twin-Tee devrelerinin kat kat parametrik şematik çizimi.
* Dirençler ($R_1, R_2, R_A, R_B$), kondansatörler ($C_1, C_2$), op-amp sembolleri ve çıkış kazanç dengeleme bölücüsü ($R_x, R_y$).
* E12 ve E24 standart ticari bileşen yuvarlama desteği.

### 7. 💻 MATLAB / GNU Octave & SPICE Kod Üreticisi
* Çalıştırılabilir `.m` scripti: frekans dönüşümü, transfer fonksiyonu tanımlama, `bode()`, `pzmap()` ve `step()` analizleri.
* LTSpice / PSpice uyumlu devre simülasyon netlisti (`.cir`).
* Tek tıkla panoya kopyalama ve `.m` dosyası olarak indirme.

### 8. ⚖️ Filtre Karşılaştırma Laboratuvarı
* Butterworth, Chebyshev Tip I, Ters Chebyshev ve Eliptik yaklaşımlarının aynı tolerans ve frekanslar altındaki frekans büyüklük eğrilerini tek kanvasta 4 farklı renkle üst üste bindirerek karşılaştırma.

---

## 📂 Proje Mimarisi ve Dosya Yapısı

```
Filter Design/
├── index.html              # Ana tek sayfa web uygulaması (SPA)
├── style.css               # Aydınlık, ferah minimalist tasarım sistemi & KaTeX tipografisi
├── app.js                  # Ana uygulama denetleyicisi, durum yönetimi, yönlendirme & canlı formül motoru
├── filter-engine.js        # Matematiksel filtre analiz, derece, kutup-sıfır, SOS ve dönüşüm motoru
├── circuit-engine.js       # Bölüm 4 aktif filtre sentezi ve vektörel SVG devre şematik çizici
├── matlab-engine.js        # MATLAB / GNU Octave scripti ve SPICE (.cir) netlist kod üreteci
├── book-examples.js        # Kitaptaki tüm 25 örneğin eksiksiz yapılandırılmış veritabanı
├── book-content.js         # Bölüm 1 - 4 Türkçe teorik ders notları, formülleri ve kart ızgaraları
├── filter-types-modal.js   # Filtre Türleri Kapsamlı Anlatım Pop-up Modülü (LP, HP, BP, BS)
├── approx-modal.js         # Klasik Normalize Yaklaşımlar Pop-up Modülü (Örnek 2.1 - 2.10)
├── transform-modal.js      # Frekans Dönüşümleri Pop-up Modülü (Örnek 3.1 - 3.9)
├── circuit-modal.js        # Op-Amp Aktif Devreler Pop-up Modülü (Örnek 4.1 - 4.6)
├── plotter.js              # Yüksek çözünürlüklü Canvas grafik çizim motoru (Bode, Kutup-Sıfır, Basamak)
└── README.md               # Proje belgelendirmesi
```

---

## 🚀 Kurulum ve Çalıştırma

Uygulama tamamen istemci taraflı (Vanilla HTML5, CSS3, JavaScript ES6+) olarak geliştirilmiştir. Herhangi bir derleyici, npm paketi veya harici backend sunucusu gerektirmez.

### Seçenek 1: Doğrudan Tarayıcıda Açma
Proje dizinindeki `index.html` dosyasına çift tıklayarak modern herhangi bir web tarayıcısında (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) doğrudan çalıştırabilirsiniz.

### Seçenek 2: Yerel HTTP Sunucusu ile Çalıştırma
```bash
# Python 3 ile:
python -m http.server 4173

# Veya Node.js ile (npx):
npx serve .
```
Ardından tarayıcınızda `http://localhost:4173` adresine gidiniz.

---

## 📚 Kaynakça

* **Les Thede**, *Practical Analog and Digital Filter Design*, Artech House Publishers.
* Matematik Dizgisi: [KaTeX](https://katex.org/)

---

## 📄 Lisans

MIT Lisansı ile korunmaktadır. Eğitim, araştırma ve mühendislik projelerinde serbestçe kullanılabilir.
