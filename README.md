# FilterDesign Studio 🎛️⚡

**Analog Filtre Tasarımı, Analiz, Op-Amp Devre Sentezi ve MATLAB Kod Üretim Portalı**  
*Les Thede'in **"Practical Analog and Digital Filter Design"** (Bölüm 1 - 4) kitabına dayalı interaktif mühendislik aracı.*

🌐 **Canlı Web Sürümü (GitHub Pages):** [https://safaksahinn.github.io/filter-design/](https://safaksahinn.github.io/filter-design/)

Arayüz stili ve kullanıcı deneyimi, minimalist ve ferah yapısıyla [Thalamus](https://safaksahinn.github.io/thalamus/) tasarım sisteminden esinlenerek geliştirilmiştir.

---

## 📖 Kitap Kapsamı (Bölüm 1 - 4)

Bu proje, Les Thede tarafından yazılan **"Practical Analog and Digital Filter Design"** kitabının ilk dört bölümünü hem teorik hem de pratik/uygulamalı olarak kapsar:

* **Bölüm 1: Filtrelere Giriş ve Filtre Seçicilikleri (Introduction to Filters & Selectivity)**
  * Filtre seçicilik sınıfları: Alçak Geçiren (Lowpass), Yüksek Geçiren (Highpass), Bant Geçiren (Bandpass), Bant Söndüren / Çentik (Bandstop / Notch).
  * Tolerans özellikleri: $a_{pass}$ (dB), $a_{stop}$ (dB), $f_{pass}$ ve $f_{stop}$.
  * İdeal ve pratik filtre yaklaşımları.
  * Analog, aktif (Op-Amp RC), pasif (RLC), switched-capacitor ve Gm-C uygulama teknolojileri.
* **Bölüm 2: Normalize Analog Filtre Yaklaşım Fonksiyonları (Approximation Functions)**
  * Transfer fonksiyonu $H(s)$, $s$-düzlemi, kutuplar ve sıfırlar, kararlılık kriteri.
  * **Butterworth Yaklaşımı:** Maksimum düz genlik yanıtı ($|H(j\omega)|^2 = \frac{1}{1 + \omega^{2n}}$), minimum derece formülü, birim çember kutup açıları.
  * **Chebyshev Tip I Yaklaşımı:** Geçirme bandında eşit dalgalanma (equiripple), Chebyshev polinomları $C_n(\omega)$, elips üzerindeki kutup dağılımı.
  * **Ters Chebyshev (Tip II) Yaklaşımı:** Geçirme bandında düz, durdurma bandında dalgalı, $j\omega$ sanal eksenindeki sıfırlar ($H(j\omega)=0$).
  * **Eliptik (Cauer) Yaklaşımı:** Hem geçirme hem durdurma bandında dalgalı, en dik geçiş bandı ve Jacobi eliptik fonksiyonları.
* **Bölüm 3: Normalize Olmayan Filtreler ve Frekans Dönüşümleri (Transformations)**
  * $2\pi f$ açısal frekans dönüşümü: $\omega = 2\pi f \iff f = \frac{\omega}{2\pi}$.
  * Alçak Geçiren Ölçekleme ($S \rightarrow s/\omega_0$): 1. ve 2. derece faktör katsayılarının ($b_1, b_2, a_0, a_2$) ölçeklenmesi.
  * Yüksek Geçiren Dönüşümü ($S \rightarrow \omega_0/s$).
  * Bant Geçiren Dönüşümü ($S \rightarrow \frac{s^2 + \omega_0^2}{Bs}$): Geometrik merkez frekansı $\omega_0 = \sqrt{\omega_1 \omega_2}$, bant genişliği $B = \omega_2 - \omega_1$, derecenin iki katına çıkması ($2n$).
  * Bant Söndüren (Notch) Dönüşümü ($S \rightarrow \frac{Bs}{s^2 + \omega_0^2}$).
  * Frekans yanıtı matematiği: Büyüklük (dB), faz açısı ($\angle H(j\omega)$) ve grup gecikmesi.
* **Bölüm 4: Op-Amp Aktif Filtre Gerçekleştirmeleri (Active Filter Implementation)**
  * Katsayı eşleme yöntemi: $H_c(s) = H_a(s)$.
  * **Sallen-Key Alçak Geçiren (LP):** Equal-component ($C_1 = C_2 = C$) yöntemi:
    $$R_1 = R_2 = R = \frac{1}{C\sqrt{b_2}}, \quad K = 3 - \frac{b_1}{\sqrt{b_2}}, \quad R_B = (K - 1)R_A \quad (R_A = 10\text{ k}\Omega)$$
  * **1. Derece Tampon Katı:** Pasif RC + Op-Amp Buffer ($R = \frac{1}{b_2 C}$).
  * **Sallen-Key Yüksek Geçiren (HP):** $C_1 = C_2 = C$, $R_1 = R_2 = R = \frac{1}{C\sqrt{b_2}}$, $K = 3 - \frac{b_1}{\sqrt{b_2}}$.
  * **Sallen-Key Bant Geçiren (BP):** Çoklu geribesleme ve Sallen-Key rezonans katları.
  * **Twin-Tee (İkiz-T) Aktif Çentik Katları:** Ters Chebyshev ve Eliptik filtrelerin sonlu karmaşık sıfırlarını ($j\omega_z$) gerçekleştiren aktif çentik topolojisi.
  * **Çıkış Kazanç Dengeleme Gerilim Bölücüsü:** Toplam kat kazancını ($K_{tot} = \prod K_m$) $0\text{ dB}$ (1.0) seviyesine eşitleyen $R_x, R_y$ empedans bölücüsü:
    $$G_A = \frac{K_{tot}}{G_{hedef}}, \quad R_x = G_A \cdot R_{out}, \quad R_y = \frac{G_A}{G_A - 1} \cdot R_{out} \quad (R_{out} = 10\text{ k}\Omega)$$
  * **Standart Komponent Eşleme:** E12 (%10) ve E24 (%5) standart direnç ve kondansatör serilerine yuvarlama.

---

## ✨ Temel Özellikler

1. **⚡ Canlı ve Dinamik Filtre Tasarım Motoru:**
   * Giriş değerleri değiştirildiği anda minimum filtre derecesi ($N$), kutuplar, sıfırlar, biquad ikinci derece faktörler ($SOS$) ve devre elemanları anında hesaplanır.
   * Kullanıcı ister otomatik minimum dereceyi kullanabilir ister manuel derece seçebilir.
2. **🔄 2πf Frekans Dönüşüm Sistemi:**
   * Üst bardan tek tıkla **Hz** veya **rad/s ($\omega$)** birimi seçimi.
   * Giriş kutularının altında anlık $2\pi f$ eşdeğer rozetleri (`f = 1000 Hz ⇄ ω = 6283.19 rad/s (2π · f)`).
3. **📈 4 Eşzamanlı Yüksek Hassasiyetli Grafik:**
   * **Bode Büyüklük Yanıtı (dB):** Logaritmik frekans ekseni, kesik çizgili $-a_{pass}$ ve $-a_{stop}$ tolerans limit çizgileri.
   * **Bode Faz Yanıtı (Derece):** $-180^\circ \dots +180^\circ$ faz eğrisi.
   * **s-Düzlemi Kutup-Sıfır Haritası:** $\sigma$ ve $j\omega$ eksenleri, birim kesim çemberi, kutuplar ($\times$) ve sıfırlar ($\circ$).
   * **Birim Basamak Yanıtı ($h(t)$):** Bilinear IIR simülasyonu ile zaman domeninde geçici yanıt, aşım ve yerleşme süresi.
4. **🔌 Vektörel SVG Devre Şematiği:**
   * Kitaptaki çizim stiline sadık kalarak her kat için yüksek çözünürlüklü vektörel SVG devre şeması çizimi.
   * Dirençler ($R_1, R_2, R_A, R_B$), kondansatörler ($C_1, C_2$), op-amp sembolleri ve çıkış gerilim bölücüsü ($R_x, R_y$).
   * Standart E24/E12 direnç serisi dönüştürme desteği.
5. **💻 MATLAB / GNU Octave & SPICE Kod Üreticisi:**
   * Tek tıkla kopyalanabilir ve `.m` dosyası olarak indirilebilir çalıştırılabilir script.
   * `butter`, `cheby1`, `cheby2`, `ellip`, `tf`, `zp2sos`, `freqs`, `pzmap`, `step` fonksiyonları.
   * LTSpice / PSpice uyumlu devre simülasyon netlisti (`.cir`).
6. **📚 Kitaptaki Tüm Örnekler Veritabanı (25 Örnek):**
   * Bölüm 2 (Örnek 2.1 – 2.10)
   * Bölüm 3 (Örnek 3.1 – 3.9)
   * Bölüm 4 (Örnek 4.1 – 4.6)
   * Modal arama ve filtreleme penceresi ile dilediğiniz örneği tek tıkla tasarımcıya yükleme.
   * Teori sayfalarında her örneğin adım adım çözümü ve **"⚡ Bu Örneği Tasarımcıda Aç"** butonu.
7. **⚖️ Filtre Karşılaştırma Laboratuvarı:**
   * Butterworth, Chebyshev Tip I, Ters Chebyshev ve Eliptik filtrelerin aynı frekans ve toleranslar altındaki genlik yanıtlarını tek grafikte üst üste bindirerek karşılaştırma.

---

## 📂 Dosya Yapısı

```
Filter Design/
├── index.html            # Ana tek sayfa web uygulaması (SPA)
├── style.css             # Thalamus aydınlık/ferah minimalist tasarım sistemi
├── filter-engine.js      # Matematiksel filtre analiz, derece, SOS ve frekans dönüşüm motoru
├── circuit-engine.js     # Bölüm 4 aktif filtre sentezi ve vektörel SVG devre çizici
├── matlab-engine.js      # MATLAB / GNU Octave ve SPICE netlist kod üreteci
├── book-examples.js      # Kitaptaki tüm 25 örneğin eksiksiz veritabanı
├── book-content.js       # Bölüm 1 - 4 Türkçe teorik ders notları ve formülleri
├── plotter.js            # Yüksek çözünürlüklü Canvas grafik çizim motoru
└── app.js                # UI durumu, etkileşimler, canlı hesaplama ve yönlendirme
```

---

## 🚀 Kurulum ve Çalıştırma

Uygulama tamamen istemci taraflı (Vanilla HTML5, CSS3, JavaScript) olarak geliştirilmiştir. Herhangi bir derleyici, npm paketi veya backend sunucusu gerektirmez.

### Seçenek 1: Doğrudan Tarayıcıda Açma
Proje klasöründeki `index.html` dosyasına çift tıklayarak modern herhangi bir web tarayıcısında (Chrome, Edge, Firefox, Safari) doğrudan çalıştırabilirsiniz.

### Seçenek 2: Yerel HTTP Sunucusu ile Çalıştırma
```bash
# Python ile:
python -m http.server 4173

# Veya Node.js ile (npx):
npx serve .
```
Ardından tarayıcınızda `http://localhost:4173` adresine gidebilirsiniz.

---

## 📚 Kaynakça

* **Les Thede**, *Practical Analog and Digital Filter Design*, Artech House Publishers.
* Tasarım ve Arayüz Referansı: [Thalamus Knowledge System](https://safaksahinn.github.io/thalamus/)

---

## 📄 Lisans

MIT Lisansı ile korunmaktadır. Eğitim, araştırma ve mühendislik projelerinde serbestçe kullanılabilir.
