/**
 * FilterDesign Studio - Book Content & Theory Module (Chapters 1 - 4)
 * Based on "Practical Analog and Digital Filter Design" by Les Thede
 */

const BookContent = (() => {
  const chapters = [
    {
      id: 'ch1',
      num: 1,
      title: 'Bölüm 1: Filtrelere Giriş ve Filtre Seçicilikleri',
      sub: 'Introduction to Filters and Filter Selectivity',
      badge: 'Bölüm 1',
      summary: 'Filtre kavramı, frekans seçicilik sınıfları (LP, HP, BP, BS), yaklaşım teorisinin temelleri ve analog filtre uygulama teknolojileri.',
      sections: [
        {
          id: 'ch1-1',
          title: '1.1 Filtre Seçiciliği (Filter Selectivity)',
          content: `
            <p>Filtreleme, istenen frekans bileşenlerini geçirirken istenmeyen frekansları bastırma işlemidir. Frekans seçiciliğine göre filtreler temel olarak dört ana sınıfa ayrılır:</p>
            <div class="theory-grid-2">
              <div class="theory-card">
                <h4>1. Alçak Geçiren Filtre (Lowpass - LP)</h4>
                <p>DC'den belirli bir kesim frekansına ($f_{pass}$) kadar olan düşük frekansları geçirir, $f_{stop}$ üzerindeki yüksek frekansları zayıflatır. Şunlarla karakterize edilir: $a_{pass}$ (geçirme bandı zayıflaması dB), $a_{stop}$ (durdurma bandı zayıflaması dB).</p>
              </div>
              <div class="theory-card">
                <h4>2. Yüksek Geçiren Filtre (Highpass - HP)</h4>
                <p>Düşük frekansları zayıflatır ve $f_{pass}$ üzerindeki yüksek frekansları minimum kayıpla iletir. DC bileşenlerini ve şebeke gürültülerini (50/60 Hz) engellemede yaygın kullanılır.</p>
              </div>
              <div class="theory-card">
                <h4>3. Bant Geçiren Filtre (Bandpass - BP)</h4>
                <p>Belirli bir alt ($f_{pass1}$) ve üst ($f_{pass2}$) frekans aralığındaki bileşenleri geçirirken, bu bandın dışındaki düşük ve yüksek frekansları bastırır. Bant genişliği $B = f_{pass2} - f_{pass1}$, merkez frekans $f_0 = \\sqrt{f_{pass1} f_{pass2}}$.</p>
              </div>
              <div class="theory-card">
                <h4>4. Bant Söndüren / Çentik (Bandstop / Notch)</h4>
                <p>Belirli bir frekans bandını tamamen bloke eder (örneğin 50 Hz şebeke vızıltısı veya parazit frekansı) ve bu frekansın altındaki ve üstündeki tüm sinyalleri geçirir.</p>
              </div>
            </div>
          `
        },
        {
          id: 'ch1-2',
          title: '1.2 Filtre Yaklaşımları (Filter Approximation)',
          content: `
            <p>İdeal "tuğla duvar" (brick-wall) filtreler fiziksel olarak gerçekleştirilemez (nedensellik ve Paley-Wiener kriteri). Bu nedenle ideal genlik yanıtına matematiksel olarak en iyi yaklaşımı sunan polinom ve rasyonel fonksiyonlar geliştirilmiştir:</p>
            <ul>
              <li><strong>Butterworth:</strong> Geçirme bandında maksimum düzlük (maximally flat), monotonic düşüş.</li>
              <li><strong>Chebyshev Tip I:</strong> Geçirme bandında eşit dalgalanma (equiripple), daha dik geçiş bandı.</li>
              <li><strong>Ters Chebyshev (Tip II):</strong> Geçirme bandında düz, durdurma bandında dalgalı, sonlu frekanslarda sıfırlar ($j\\omega$).</li>
              <li><strong>Eliptik (Cauer):</strong> Hem geçirme hem durdurma bandında dalgalı, verilen derece için en dik geçiş bandı.</li>
            </ul>
          `
        },
        {
          id: 'ch1-3',
          title: '1.3 Filtre Uygulama Yöntemleri (Implementation)',
          content: `
            <p>Filtreler uygulamada farklı teknolojilerle hayata geçirilir:</p>
            <div class="theory-grid-2">
              <div class="theory-card">
                <h4>Aktif Filtreler (Op-Amp + RC)</h4>
                <p>Bölüm 4'ün ana konusu olan op-amp tabanlı aktif filtreler, bobin (endüktans) gerektirmez. Küçük boyut, düşük maliyet ve yüksek giriş empedansı / düşük çıkış empedansı sunar. Ses ve orta frekans aralığında (DC - 1 MHz) standart tercihtir.</p>
              </div>
              <div class="theory-card">
                <h4>Pasif Filtreler (R, L, C)</h4>
                <p>Yüksek frekans (RF/Mikrodalga) ve yüksek güç uygulamalarında kullanılır. Aktif eleman gürültüsü ve op-amp bant genişliği kısıtlaması yoktur.</p>
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'ch2',
      num: 2,
      title: 'Bölüm 2: Normalize Analog Filtre Yaklaşım Fonksiyonları',
      sub: 'Analog Filter Approximation Functions',
      badge: 'Bölüm 2',
      summary: 'Transfer fonksiyonu matematiği, s-düzlemi, kutup-sıfır dağılımları ve 4 temel yaklaşım metodunun (Butterworth, Chebyshev, Ters Chebyshev, Eliptik) normalize analizi.',
      sections: [
        {
          id: 'ch2-1',
          title: '2.1 Transfer Fonksiyonları ve s-Düzlemi',
          content: `
            <p>Lineer zamanla değişmeyen (LTI) bir filtrenin davranışı Laplace dönüşümündeki transfer fonksiyonu $H(s)$ ile tanımlanır:</p>
            <div class="math-block">
              $$H(s) = \\frac{N(s)}{D(s)} = \\frac{a_m s^m + a_{m-1} s^{m-1} + \\dots + a_0}{s^n + b_{n-1} s^{n-1} + \\dots + b_0}$$
            </div>
            <p>Sistemin kararlı (stable) olabilmesi için tüm kutupların $s$-düzleminin sol yarı düzleminde ($\\text{Re}(p_k) < 0$) bulunması zorunludur. Frekans yanıtı $s = j\\omega$ konularak elde edilir.</p>
          `
        },
        {
          id: 'ch2-2',
          title: '2.2 Butterworth Yaklaşımı (Maksimum Düz)',
          content: `
            <p>Butterworth filtresinin büyüklük karesi yanıtı Denklem 2.6 ile verilir:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\omega^{2n}}$$
            </div>
            <p><strong>Gereken Filtre Derecesi ($n$):</strong></p>
            <div class="math-block">
              $$n \\ge \\frac{\\log_{10}\\left[ \\frac{10^{-a_{stop}/10} - 1}{10^{-a_{pass}/10} - 1} \\right]}{2 \\log_{10}(\\omega_{stop} / \\omega_{pass})}$$
            </div>
            <p><strong>Kutup Konumları:</strong> Kutuplar $s$-düzleminde birim çember üzerinde eşit açılarla sol yarı düzleme dizilir:</p>
            <div class="math-block">
              $$s_k = -\\sin\\left( \\frac{2k - 1}{2n}\\pi \\right) + j \\cos\\left( \\frac{2k - 1}{2n}\\pi \\right), \\quad k = 1, 2, \\dots, n$$
            </div>
          `
        },
        {
          id: 'ch2-3',
          title: '2.3 Chebyshev Yaklaşımı (Tip I)',
          content: `
            <p>Geçirme bandında izin verilen $a_{pass}$ kadar dalgalanmaya izin vererek çok daha dik bir geçiş bandı elde eder:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\epsilon^2 C_n^2(\\omega)}, \\quad \\epsilon = \\sqrt{10^{-a_{pass}/10} - 1}$$
            </div>
            <p>Burada $C_n(\\omega)$ Chebyshev polinomudur. Kutuplar birim çember yerine elips üzerinde konumlanır:</p>
            <div class="math-block">
              $$\\gamma = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon}\\right)$$
              $$s_k = -\\sinh(\\gamma)\\sin(\\theta_k) + j \\cosh(\\gamma)\\cos(\\theta_k)$$
            </div>
          `
        },
        {
          id: 'ch2-4',
          title: '2.4 Ters Chebyshev (Tip II) ve 2.5 Eliptik Yaklaşımları',
          content: `
            <p><strong>Ters Chebyshev:</strong> Geçirme bandı Butterworth gibi tamamen düzdür (monotonik), durdurma bandında dalgalanma gösterir ve $j\\omega$ sanal ekseni üzerinde sıfırlar ($H(j\\omega) = 0$) barındırır.</p>
            <p><strong>Eliptik (Cauer):</strong> Hem geçirme hem durdurma bandında dalgalanmalıdır. Verilen bir geçiş bandı ve zayıflama için gereken minimum dereceyi ($n$) sağlar; analog devre tasarımında en az op-amp gerektiren yöntemdir ancak faz yanıtı en doğrusal olmayandır.</p>
          `
        },
        {
          id: 'ch2-examples',
          title: 'Bölüm 2: Kitaptaki Tüm Örnekler (Örnek 2.1 - 2.10)',
          content: `
            <p>Kitabın 2. bölümünde yer alan tüm normalize filtre yaklaşım örnekleri aşağıda listelenmiştir. Herhangi bir örneğe tıklayarak parametrelerini canlı tasarımcıya yükleyebilirsiniz:</p>
            <div class="theory-examples-grid" id="ch2ExamplesContainer"></div>
          `
        }
      ]
    },
    {
      id: 'ch3',
      num: 3,
      title: 'Bölüm 3: Normalize Olmayan Filtreler ve Frekans Dönüşümleri',
      sub: 'Unnormalized LP, HP, BP, and BS Filters',
      badge: 'Bölüm 3',
      summary: 'Normalize alçak geçiren prototipten gerçek frekanslardaki Alçak, Yüksek, Bant Geçiren ve Bant Söndüren filtrelere dönüşüm adımları, 2πf açısal frekans hesabı ve katsayılar.',
      sections: [
        {
          id: 'ch3-1',
          title: '3.1 Alçak Geçiren Ölçekleme (LP to LP) & 2πf Dönüşümü',
          content: `
            <p>Normalize frekans $\\omega_n = 1\\text{ rad/s}$ prototipi, gerçek kesim frekansı $\\omega_0 = 2\\pi f_0$ ile ölçeklenir:</p>
            <div class="math-block">
              $$\\omega = 2\\pi f \\quad \\Longleftrightarrow \\quad f = \\frac{\\omega}{2\\pi}$$
              $$S = \\frac{s}{\\omega_0} = \\frac{s}{2\\pi f_0}$$
            </div>
            <ul>
              <li><strong>1. Derece Faktör:</strong> $\\frac{1}{S + b_0} \\longrightarrow \\frac{b_2}{s + b_2}$, burada $b_2 = b_0 \\cdot \\omega_0$.</li>
              <li><strong>2. Derece Faktör:</strong> $\\frac{b_2}{S^2 + b_1 S + b_2} \\longrightarrow \\frac{b_{2,un}}{s^2 + b_{1,un} s + b_{2,un}}$, burada $b_{1,un} = b_1 \\cdot \\omega_0$, $b_{2,un} = b_2 \\cdot \\omega_0^2$.</li>
            </ul>
          `
        },
        {
          id: 'ch3-2',
          title: '3.2 Yüksek Geçiren Dönüşümü (LP to HP)',
          content: `
            <p>Frekans ters çevrilir: $S = \\frac{\\omega_0}{s} = \\frac{2\\pi f_0}{s}$</p>
            <ul>
              <li><strong>1. Derece Faktör:</strong> $\\frac{s}{s + \\omega_0 / b_0}$.</li>
              <li><strong>2. Derece Faktör:</strong> $\\frac{s^2}{s^2 + \\left(\\frac{b_1 \\omega_0}{b_2}\\right) s + \\left(\\frac{\\omega_0^2}{b_2}\\right)}$.</li>
            </ul>
          `
        },
        {
          id: 'ch3-3',
          title: '3.3 ve 3.4 Bant Geçiren ve Bant Söndüren Dönüşümleri',
          content: `
            <p><strong>Bant Geçiren:</strong> $S \\rightarrow \\frac{s^2 + \\omega_0^2}{B s}$ dönüşümü uygulanır. $\\omega_0 = 2\\pi \\sqrt{f_1 f_2}$, $B = 2\\pi (f_2 - f_1)$. Toplam filtre derecesi $2n$ olur.</p>
            <p><strong>Bant Söndüren (Notch):</strong> $S \\rightarrow \\frac{B s}{s^2 + \\omega_0^2}$ dönüşümü ile merkez frekansı $\\omega_0$ olan çentik transfer fonksiyonları elde edilir.</p>
          `
        },
        {
          id: 'ch3-examples',
          title: 'Bölüm 3: Kitaptaki Tüm Örnekler (Örnek 3.1 - 3.9)',
          content: `
            <p>Kitabın 3. bölümünde yer alan tüm normalize olmayan ölçekleme örnekleri (hem rad/s hem 2πf dönüşümlü Hz):</p>
            <div class="theory-examples-grid" id="ch3ExamplesContainer"></div>
          `
        }
      ]
    },
    {
      id: 'ch4',
      num: 4,
      title: 'Bölüm 4: Op-Amp Aktif Filtre Gerçekleştirmeleri',
      sub: 'Analog Filter Implementation Using Active Filters',
      badge: 'Bölüm 4',
      summary: 'Op-amp devre topolojileri, Sallen-Key mimarisi, Twin-Tee çentik devreleri, direnç ve kondansatör hesabı, E-serisi standart bileşenler ve kazanç dengelemesi.',
      sections: [
        {
          id: 'ch4-1',
          title: '4.1 Aktif Filtre Tasarım Prosedürü',
          content: `
            <p>Bölüm 4'teki ana ilke: Bölüm 3'te elde edilen ikinci derece faktörler ile op-amp devresinin transfer fonksiyonunun katsayılarını eşitlemektir:</p>
            <div class="math-block">
              $$H_c(s) = H_a(s) \\implies \\frac{K / (R^2 C^2)}{s^2 + s \\frac{3-K}{RC} + \\frac{1}{R^2 C^2}} = \\frac{b_2}{s^2 + b_1 s + b_2}$$
            </div>
          `
        },
        {
          id: 'ch4-2',
          title: '4.2 Sallen-Key Alçak Geçiren Devre Tasarımı',
          content: `
            <p>Equal-Component Sallen-Key tasarımında kondansatörler eşit seçilir ($C_1 = C_2 = C$, tipik olarak $0.01\\ \\mu\\text{F}$ veya $10\\text{ nF}$):</p>
            <div class="math-block">
              $$R_1 = R_2 = R = \\frac{1}{C \\sqrt{b_2}}$$
              $$K = 3 - \\frac{b_1}{\\sqrt{b_2}}$$
              $$R_B = (K - 1) R_A, \\quad (R_A = 10\\text{ k}\\Omega)$$
            </div>
            <p>Tek dereceli filtrelerdeki birinci derece kat ($s+b_2$) basit bir pasif RC ve tampon (buffer) op-amp ile gerçekleştirilir: $R = \\frac{1}{b_2 C}$.</p>
          `
        },
        {
          id: 'ch4-3',
          title: '4.3 Sallen-Key Yüksek Geçiren Devre Tasarımı',
          content: `
            <p>Yüksek geçiren devrede $R$ ve $C$ elemanlarının yerleri değiştirilir:</p>
            <div class="math-block">
              $$R_1 = R_2 = R = \\frac{1}{C \\sqrt{b_2}}, \\quad K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A$$
            </div>
            <p>Birinci derece HP için CR ağı ve tampon op-amp kullanılır.</p>
          `
        },
        {
          id: 'ch4-4',
          title: '4.4 - 4.6 Twin-Tee Çentik ve Kompleks Sıfırlar',
          content: `
            <p>Ters Chebyshev ve Eliptik filtrelerde $j\\omega$ ekseninde sıfırlar bulunur. Bu sıfırları gerçekleştirmek için Twin-Tee aktif çentik topolojisi kullanılır. Devre simetrik iki T yapısından (bir R-C-R ve bir C-R-C T köprüsü) ve geri beslemeli op-amp katından oluşur.</p>
          `
        },
        {
          id: 'ch4-5',
          title: '4.7 Kazanç Dengeleme Gerilim Bölücüsü',
          content: `
            <p>Her Sallen-Key katı $K_m > 1$ kazancına sahip olduğu için, tüm filtrenin toplam kazancı $K_{tot} = \\prod K_m$ olur. Filtrenin toplam DC veya tepe kazancını 1.0 (0 dB) seviyesine getirmek için çıkışa bir gerilim bölücü eklenir:</p>
            <div class="math-block">
              $$G_A = \\frac{K_{tot}}{G_{hedef}}$$
              $$R_x = G_A \\cdot R_{out}, \\quad R_y = \\frac{G_A}{G_A - 1} R_{out}, \\quad (R_{out} = 10\\text{ k}\\Omega)$$
            </div>
          `
        },
        {
          id: 'ch4-examples',
          title: 'Bölüm 4: Kitaptaki Tüm Aktif Devre Tasarımı Örnekleri (Örnek 4.1 - 4.6)',
          content: `
            <p>Bölüm 4'teki tüm op-amp Sallen-Key, Twin-Tee ve gerilim bölücü aktif devre tasarımı örnekleri:</p>
            <div class="theory-examples-grid" id="ch4ExamplesContainer"></div>
          `
        }
      ]
    }
  ];

  return {
    chapters
  };
})();

if (typeof module !== 'undefined') module.exports = BookContent;
