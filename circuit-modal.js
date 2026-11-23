/**
 * FilterDesign Studio - Op-Amp Active Circuit Realizations Modal Module (Chapter 4)
 * Detailed mathematical derivations, KCL node equations, SVG circuit schematics,
 * component scaling algorithms, and step-by-step textbook numerical examples for:
 * - Sallen-Key Lowpass (Equal-Component & RC Buffer)
 * - Sallen-Key Highpass
 * - Sallen-Key & Multiple-Feedback (MFB) Bandpass
 * - Twin-Tee Active Notch & Complex Zeros Bandstop
 * Based on Les Thede - "Practical Analog and Digital Filter Design" (Chapter 4).
 */

const FilterCircuitModal = (() => {
  const CIRCUIT_DATA = {
    sk_lp: {
      id: 'sk_lp',
      typeKey: 'lowpass',
      title: 'Sallen-Key Alçak Geçiren Devre Tasarımı (Equal-Component)',
      badge: 'Bölüm 4.2 & Kitap Denklem 4.1 - 4.13, 4.19 - 4.21',
      color: '#3d5afe',
      summary: 'Eşit kondansatörlü (C₁ = C₂ = C) ve eşit dirençli (R₁ = R₂ = R) Sallen-Key mimarisi ile katsayı eşleme yöntemi, op-amp kazancı (K) ve 1. derece RC tampon katı hesapları.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <!-- Schematic Canvas: Sallen-Key Lowpass Stage -->
          <rect x="5" y="5" width="450" height="200" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.2" />

          <!-- Input terminal -->
          <circle cx="30" cy="90" r="3" fill="#3d5afe" />
          <text x="28" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vin</text>
          <line x1="30" y1="90" x2="65" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Resistor R1 -->
          <rect x="65" y="83" width="40" height="14" fill="#f8fafc" stroke="#3d5afe" stroke-width="1.8" rx="2" />
          <text x="85" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">R₁ = R</text>
          <line x1="105" y1="90" x2="145" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VA -->
          <circle cx="145" cy="90" r="3.5" fill="#3d5afe" />
          <text x="145" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3d5afe">VA</text>

          <!-- Feedback Capacitor C1 from VA to Vout -->
          <line x1="145" y1="90" x2="145" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="145" y1="35" x2="235" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <!-- C1 plates -->
          <line x1="235" y1="25" x2="235" y2="45" stroke="#3d5afe" stroke-width="2.5" />
          <line x1="242" y1="25" x2="242" y2="45" stroke="#3d5afe" stroke-width="2.5" />
          <text x="238" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3d5afe">C₁ = C</text>
          <line x1="242" y1="35" x2="390" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="390" y1="35" x2="390" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Resistor R2 -->
          <rect x="165" y="83" width="40" height="14" fill="#f8fafc" stroke="#3d5afe" stroke-width="1.8" rx="2" />
          <text x="185" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">R₂ = R</text>
          <line x1="145" y1="90" x2="165" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="205" y1="90" x2="245" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VB -->
          <circle cx="245" cy="90" r="3.5" fill="#3d5afe" />
          <text x="245" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3d5afe">VB (+)</text>

          <!-- Capacitor C2 to GND -->
          <line x1="245" y1="90" x2="245" y2="135" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="235" y1="135" x2="255" y2="135" stroke="#3d5afe" stroke-width="2.5" />
          <line x1="235" y1="142" x2="255" y2="142" stroke="#3d5afe" stroke-width="2.5" />
          <text x="225" y="142" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3d5afe">C₂ = C</text>
          <line x1="245" y1="142" x2="245" y2="160" stroke="#2f2e2b" stroke-width="1.8" />
          <!-- GND symbol -->
          <line x1="237" y1="160" x2="253" y2="160" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="240" y1="164" x2="250" y2="164" stroke="#2f2e2b" stroke-width="1.4" />
          <line x1="243" y1="168" x2="247" y2="168" stroke="#2f2e2b" stroke-width="1.2" />

          <!-- Op-Amp Triangle -->
          <line x1="245" y1="90" x2="280" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="280,75 280,135 340,105" fill="#f8fafc" stroke="#2f2e2b" stroke-width="2" />
          <text x="290" y="94" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">+</text>
          <text x="290" y="124" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">−</text>

          <!-- Op-Amp Output line -->
          <line x1="340" y1="105" x2="420" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="420" cy="105" r="3" fill="#3d5afe" />
          <text x="420" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vout</text>

          <!-- Feedback gain network RA & RB -->
          <line x1="280" y1="120" x2="270" y2="120" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="270" y1="120" x2="270" y2="165" stroke="#2f2e2b" stroke-width="1.8" />
          <!-- RA to GND -->
          <rect x="263" y="165" width="14" height="25" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="254" y="180" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#64748b">RA</text>
          <line x1="270" y1="190" x2="270" y2="198" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="265" y1="198" x2="275" y2="198" stroke="#2f2e2b" stroke-width="1.5" />

          <!-- RB to Vout -->
          <line x1="270" y1="145" x2="365" y2="145" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="315" y="138" width="35" height="14" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="332" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#64748b">RB=(K-1)RA</text>
          <line x1="365" y1="145" x2="365" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="365" cy="105" r="2.5" fill="#2f2e2b" />
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="30" y1="170" x2="240" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <line x1="30" y1="25" x2="30" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <polygon points="240,167 247,170 240,173" fill="#2f2e2b" />
          <polygon points="27,25 30,18 33,25" fill="#2f2e2b" />

          <!-- Sallen-Key LP Response curve -->
          <path d="M 30,65 C 100,65 140,68 160,85 C 180,105 205,145 235,160" fill="none" stroke="#3d5afe" stroke-width="3" />
          
          <line x1="160" y1="25" x2="160" y2="170" stroke="#3d5afe" stroke-width="1.2" stroke-dasharray="2,2" />
          <text x="160" y="188" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">f₀ = 1/(2πRC)</text>

          <text x="24" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f2e2b">K (DC)</text>
          <text x="24" y="90" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">-3 dB</text>

          <text x="110" y="50" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#3d5afe">Q = 1 / (3 - K)</text>
          <text x="110" y="140" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#64748b">-40 dB/dekad</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'KCL Düğüm Denklemlerinin Türetimi ve Transfer Fonksiyonu (Denklem 4.1 - 4.9)',
          desc: 'Devrede $V_A$ (ara düğüm) ve $V_B$ (op-amp evirmeyen girişi) düğümlerine Kirchhoff Akım Kanunu (KCL) uygulanır. İdeal op-amp kabulleri ($I_{\\text{in}} = 0$) ve evirmeyen kazanç $V_{\\text{out}} = K \\cdot V_B$ kullanılarak devre transfer fonksiyonu terim terim çıkarılır:',
          math: '$$\\text{Düğüm } V_B \\text{ KCL: } \\frac{V_A - V_B}{R_2} = \\frac{V_B}{1/(sC_2)} = s C_2 V_B \\implies V_A = V_B (1 + s R_2 C_2)$$\n$$\\text{Op-Amp Kazancı: } V_{\\text{out}} = K \\cdot V_B \\implies V_B = \\frac{V_{\\text{out}}}{K}, \\quad V_A = \\frac{V_{\\text{out}}}{K}(1 + s R_2 C_2)$$\n$$\\text{Düğüm } V_A \\text{ KCL: } \\frac{V_{\\text{in}} - V_A}{R_1} = \\frac{V_A - V_B}{R_2} + \\frac{V_A - V_{\\text{out}}}{1/(sC_1)}$$\n$$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{\\displaystyle \\frac{K}{R_1 R_2 C_1 C_2}}{\\displaystyle s^2 + s\\left[ \\frac{1}{R_1 C_1} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_2 C_2} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$',
          expl: `
            • <strong>$V_{\\text{in}}, V_{\\text{out}}$ (Giriş ve Çıkış Gerilimleri):</strong> Filtrenin girişine uygulanan AC işaret ve filtrelenmiş çıkış gerilimidir ($V$).<br>
            • <strong>$V_A$ (İç Ara Düğüm Gerilimi):</strong> $R_1, R_2$ dirençleri ile $C_1$ pozitif geribesleme kondansatörünün birleştiği kritik düğümdür.<br>
            • <strong>$V_B$ (Evirmeyen Giriş Gerilimi):</strong> Op-amp'ın ($+$) bacağındaki gerilimdir. İdeal op-amp'ta giriş akımı sıfır ($I_+ = 0$) olduğundan $R_2$'den geçen tüm akım $C_2$ üzerinden toprağa akar.<br>
            • <strong>$K = 1 + R_B/R_A$ (Op-Amp DC Kazancı):</strong> Op-amp'ın evirmeyen yükselteç konfigürasyonundaki gerilim kazancıdır ($K \\ge 1.0$).<br>
            • <strong>Paydadaki $s$ Terimi:</strong> Devrenin sönüm oranını ve seçiciliğini ($Q$) belirler; $1-K$ çarpanı sayesinde op-amp geribeslemesiyle $Q$ ayarlanabilir.
          `
        },
        {
          stepNum: 'Adım 2',
          title: 'Eşit Elemanlı (Equal-Component) Sallen-Key Katsayı Eşleme Bağıntıları (Denklem 4.10 - 4.13)',
          desc: 'Neden Equal-Component? Kondansatörlerin standart seri kısıtları nedeniyle $C_1 = C_2 = C$ (örneğin 10 nF) ve dirençler $R_1 = R_2 = R$ eşit seçilir. Hedef kuadratik faktör $H_a(s) = \\frac{b_2}{s^2 + b_1 s + b_2}$ ile katsayılar birebir eşleştirilir:',
          math: '$$\\text{Sabit Terim: } \\frac{1}{R^2 C^2} = b_2 \\implies R = \\frac{1}{C \\sqrt{b_2}}$$\n$$\\text{s Katsayısı: } \\frac{3 - K}{RC} = b_1 \\implies 3 - K = b_1 (RC) = \\frac{b_1}{\\sqrt{b_2}} = \\frac{1}{Q} \\implies K = 3 - \\frac{b_1}{\\sqrt{b_2}} = 3 - \\frac{1}{Q}$$\n$$\\text{Op-Amp Geri Beslemesi: } K = 1 + \\frac{R_B}{R_A} \\implies R_B = (K - 1) R_A \\quad (R_A = 10\\text{ k}\\Omega \\text{ standart referans)}$$',
          expl: `
            • <strong>$C$ (Baz Kondansatör Değeri - $\\text{F}$):</strong> Tasarıma daima standart bir $C$ değeri seçilerek başlanır (örn: $10\\text{ nF} = 10^{-8}\\text{ F}$). Çünkü kondansatörlerin piyasa değer çeşitliliği dirençlere göre çok kısıtlıdır.<br>
            • <strong>$b_2 = \\omega_0^2$ (Kesim Frekansı Karesi - $\\text{rad}^2/\\text{s}^2$):</strong> Bölüm 3'ten gelen payda sabit katsayısıdır. Karekökü doğrudan kesim açısal frekansıdır ($\\sqrt{b_2} = \\omega_0$).<br>
            • <strong>$R$ (Hesaplanan Filtre Direnci - $\\Omega$):</strong> $R = 1/(C\\sqrt{b_2})$ formülü ile her iki filtre direnci ($R_1 = R_2 = R$) belirlenir.<br>
            • <strong>$b_1 = \\omega_0 / Q$ (Bant Genişliği Parametresi - $\\text{rad/s}$):</strong> Paydadaki birinci derece terim katsayısıdır.<br>
            • <strong>$K = 3 - 1/Q$ (Kararlılık Şartı):</strong> Devrenin kararlı kalması için $K < 3$ olmalıdır. $Q \\to \\infty$ olsa dahi $K < 3$ kalır; $K \\ge 3$ olursa devre osilatöre dönüşür.<br>
            • <strong>$R_A, R_B$ (Geri Besleme Dirençleri - $\\Omega$):</strong> Pratikte $R_A = 10\\text{ k}\\Omega$ sabit referans alınır; $R_B = (K-1)R_A$ ile op-amp kazanç ağı kurulur.
          `
        },
        {
          stepNum: 'Adım 3',
          title: '1. Derece Pasif RC ve Tampon (Buffer) Katı (Denklem 4.19 - 4.21)',
          desc: 'Tek dereceli filtrelerde ($N=1, 3, 5, \\dots$) reel kutup $(s + b_2)$ için pasif RC devresi ve ardından empedans izolasyonu sağlayan kazancı 1 tampon op-amp kullanılır. Tampon op-amp sonraki katların yükleme yapmasını (loading effect) tamamen engeller:',
          math: '$$H_1(s) = \\frac{1/(RC)}{s + 1/(RC)} = \\frac{b_2}{s + b_2} \\implies R = \\frac{1}{b_2 C}$$\n$$\\text{Tampon Kazancı: } K = 1.0 \\implies R_B = 0\\ \\Omega \\text{ (Kısa Devre Tel)}, \\quad R_A = \\infty \\text{ (Açık Devre / Takılmaz)}$$',
          expl: `
            • <strong>$b_2$ (1. Derece Reel Kutup Frekansı - $\\text{rad/s}$):</strong> Transfer fonksiyonundaki tekil reel kök frekansıdır ($b_2 = \\omega_0$).<br>
            • <strong>$R = 1/(b_2 C)$ (Seri Direnç - $\\Omega$):</strong> Pasif RC devresinin giriş direncidir.<br>
            • <strong>$K = 1.0$ (Gerilim İzleyici Tampon):</strong> Bu kat op-amp'ın eviren ($-$) girişi ile çıkışı arasına doğrudan tel bağlanarak ($R_B = 0$) oluşturulur. Kesinlikle ekstra kazanç eklenmez ($K=1$).<br>
            • <strong>Neden Tampon Şarttır?:</strong> Pasif RC filtresinin çıkışı yüksek empedanslıdır. Eğer tampon bağlanmazsa sonraki Sallen-Key katının giriş direnci bu katı yükler ve kesim frekansını saptırır.
          `
        },
        {
          stepNum: 'Adım 4',
          title: 'Kaskad Toplam Kazanç (K_tot) ve Çıkış Gerilim Bölücüsü (Rx, Ry) (Denklem 4.36 - 4.40)',
          desc: 'Katların kazançları çarpılarak toplam filtre kazancı $K_{\\text{tot}} = \\prod K_m$ oluşur. Hedef $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) kazancı sağlamak ve çıkış empedansını $R_{\\text{out}} = 10\\text{ k}\\Omega$ sabitine oturtmak için çıkışa iki dirençli pasif bölücü bağlanır:',
          math: '$$\\text{Zayıflatma Faktörü: } G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}} \\ge 1.0$$\n$$R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}} \\implies R_x \\parallel R_y = R_{\\text{out}} = 10\\text{ k}\\Omega$$',
          expl: `
            • <strong>$K_{\\text{tot}}$ (Kaskad DC Kazancı):</strong> Tüm biquad katlarının DC kazançlarının çarpımıdır ($K_{\\text{tot}} = K_1 \\cdot K_2 \\dots$). Stabilite gereği her katta $K_m > 1$ olduğundan toplam kazanç birden büyük çıkar.<br>
            • <strong>$G_A$ (Zayıflatma Katsayısı):</strong> Çıkış gerilimini hedef $G_{\\text{hedef}} = 1.0$ ($0\\text{ dB}$) seviyesine düşürmek için gereken bölme oranıdır ($G_A \\ge 1.0$).<br>
            • <strong>$R_x$ (Seri Bölücü Direnci - $\\Omega$):</strong> Son kat op-amp çıkışından doğrudan filtre çıkış terminaline seri bağlanır.<br>
            • <strong>$R_y$ (Şönt Bölücü Direnci - $\\Omega$):</strong> Filtre çıkış terminalinden toprağa paralel bağlanır.<br>
            • <strong>$R_x \\parallel R_y = R_{\\text{out}} = 10\\text{ k}\\Omega$:</strong> Bu iki formül hem istenen zayıflatmayı sağlar hem de filtrenin Thevenin çıkış empedansını standart $10\\text{ k}\\Omega$'a eşitler.
          `
        }
      ],
      examples: [
        {
          id: 'ex4_1',
          badge: 'Örnek 4.1 (Kitap Sayfa 101-104) - Butterworth 5. Derece LP Aktif Devre',
          title: 'Butterworth 5. Derece Alçak Geçiren Sallen-Key Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 1000\\text{ Hz}, f_{\\text{stop}} = 4000\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -50.0\\text{ dB}, C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega, R_{\\text{out}} = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Derece ($n=5$), Açısal Frekans Dönüşümü ve Bölüm 2-3 Katsayıları',
              desc: 'Geçiş oranı $\\Omega_r = f_{\\text{stop}} / f_{\\text{pass}} = 4000 / 1000 = 4.0$. $a_{\\text{pass}} = -1.0\\text{ dB} \\implies \\epsilon = \\sqrt{10^{0.1}-1} = 0.50885$, $a_{\\text{stop}} = -50.0\\text{ dB} \\implies \\epsilon_s = \\sqrt{10^5-1} = 316.228$. Les Thede Denklem 2.6 ile minimum derece $n \\ge \\frac{\\log(316.228/0.50885)}{\\log(4.0)} = 4.64 \\implies n = 5$ bulunur. Açısal frekans $\\omega_0 = 2\\pi(1000) = 6283.185\\text{ rad/s}$. Derece 5 (tek) olduğundan 1 adet 1. derece RC tampon katı ve 2 adet 2. derece Sallen-Key biquad katı gerekir:',
              math: '$$\\text{Kat 1 (1. Derece Reel Kutup): } B_2 = 1.0 \\implies b_2 = B_2 \\cdot \\omega_0 = 6283.19\\text{ rad/s} \\implies H_1(s) = \\frac{6283.19}{s + 6283.19}$$\n$$\\text{Kat 2 (2. Derece Biquad): } B_1 = 0.61803, \\; B_2 = 1.0 \\implies b_{1,2} = B_1 \\omega_0 = 3883.22\\text{ rad/s}, \\; b_{2,2} = B_2 \\omega_0^2 = 3.94784 \\times 10^7$$\n$$\\sqrt{b_{2,2}} = 6283.19\\text{ rad/s}, \\quad Q_2 = \\frac{\\sqrt{b_{2,2}}}{b_{1,2}} = \\frac{6283.19}{3883.22} = 1.618$$\n$$\\text{Kat 3 (2. Derece Biquad): } B_1 = 1.61803, \\; B_2 = 1.0 \\implies b_{1,3} = B_1 \\omega_0 = 10166.42\\text{ rad/s}, \\; b_{2,3} = B_2 \\omega_0^2 = 3.94784 \\times 10^7$$\n$$\\sqrt{b_{2,3}} = 6283.19\\text{ rad/s}, \\quad Q_3 = \\frac{\\sqrt{b_{2,3}}}{b_{1,3}} = \\frac{6283.19}{10166.42} = 0.618$$',
              expl: `
                • <strong>$\\Omega_r = 4.0$ (Geçiş Oranı):</strong> Durdurma frekansı ile geçirme frekansının oranıdır ($4000 / 1000$).<br>
                • <strong>$\\epsilon = 0.50885, \\; \\epsilon_s = 316.23$:</strong> Geçirme ve durdurma bandı zayıflamalarının lineer gerilim oranlarıdır.<br>
                • <strong>$\\omega_0 = 6283.19\\text{ rad/s}$:</strong> Frekans $\\omega_0 = 2\\pi f$ ile radyan/saniyeye çevrilmiştir. Sınavda Hz bırakılması en sık yapılan hatadır!<br>
                • <strong>Kutup Dağılımı ($n=5$):</strong> 1 adet reel kutup ($b_2$) ve 2 adet karmaşık eşlenik kutup çifti ($Q_2=1.618, Q_3=0.618$) elde edilmiştir.
              `
            },
            {
              stepTitle: 'Adım 2: Kat Kat Devre Elemanı Değerlerinin Hesaplanması ($C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega$)',
              desc: 'Tasarım kolaylığı için tüm katlarda baz kondansatör $C = 10\\text{ nF} = 10^{-8}\\text{ F}$ ve op-amp referans direnci $R_A = 10\\text{ k}\\Omega$ seçilir:',
              math: '$$\\mathbf{Kat\\ 1\\ (1.\\ Derece\\ Pasif\\ RC\\ +\\ Tampon):}$$\n$$R_1 = \\frac{1}{b_2 \\cdot C} = \\frac{1}{6283.19 \\times 10^{-8}} = 15915.5\\ \\Omega = 15.915\\text{ k}\\Omega$$\n$$K_1 = 1.0 \\implies R_B = 0\\ \\Omega \\text{ (kısa devre köprü teli)}, \\quad R_A = \\infty \\text{ (bağlanmaz)}$$\n\n$$\\mathbf{Kat\\ 2\\ (2.\\ Derece\\ Sallen-Key\\ LP\\ Katı):}$$\n$$R_{1,2} = R_{2,2} = R = \\frac{1}{C \\sqrt{b_{2,2}}} = \\frac{1}{10^{-8} \\times 6283.19} = 15.915\\text{ k}\\Omega$$\n$$K_2 = 3 - \\frac{b_{1,2}}{\\sqrt{b_{2,2}}} = 3 - \\frac{3883.22}{6283.19} = 3 - 0.61803 = 2.3820$$\n$$R_{B,2} = (K_2 - 1) R_A = (2.3820 - 1) \\times 10\\text{ k}\\Omega = 1.3820 \\times 10\\text{ k}\\Omega = 13.820\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 3\\ (2.\\ Derece\\ Sallen-Key\\ LP\\ Katı):}$$\n$$R_{1,3} = R_{2,3} = R = \\frac{1}{C \\sqrt{b_{2,3}}} = \\frac{1}{10^{-8} \\times 6283.19} = 15.915\\text{ k}\\Omega$$\n$$K_3 = 3 - \\frac{b_{1,3}}{\\sqrt{b_{2,3}}} = 3 - \\frac{10166.42}{6283.19} = 3 - 1.61803 = 1.3820$$\n$$R_{B,3} = (K_3 - 1) R_A = (1.3820 - 1) \\times 10\\text{ k}\\Omega = 0.3820 \\times 10\\text{ k}\\Omega = 3.820\\text{ k}\\Omega$$',
              expl: `
                • <strong>Kat 1 (Pasif RC + Tampon):</strong> $R_1 = 15.915\\text{ k}\\Omega$. Kazanç $K_1 = 1.0$ olduğundan $R_B = 0$ (kısa devre köprü), $R_A$ bağlanmaz.<br>
                • <strong>Kat 2 (Biquad):</strong> $R = 15.915\\text{ k}\\Omega$. Kazanç $K_2 = 2.3820 < 3$ kararlılık sınırındadır. $R_B = (2.382 - 1) \\times 10\\text{ k}\\Omega = 13.82\\text{ k}\\Omega$.<br>
                • <strong>Kat 3 (Biquad):</strong> $R = 15.915\\text{ k}\\Omega$. Kazanç $K_3 = 1.3820 < 3$ kararlılık sınırındadır. $R_B = (1.382 - 1) \\times 10\\text{ k}\\Omega = 3.82\\text{ k}\\Omega$.<br>
                • <strong>Gerekçe:</strong> Tüm biquad katlarında $R$ değerinin eşit çıkması, Butterworth yaklaşımının tüm kutuplarının $s$-düzleminde aynı $\\omega_0$ çemberi üzerinde bulunmasından kaynaklanır.
              `
            },
            {
              stepTitle: 'Adım 3: Kaskad Toplam Kazanç ($K_{\\text{tot}}$) ve Çıkış Gerilim Bölücüsü ($R_x, R_y$)',
              desc: 'Neden gerilim bölücü gereklidir? Üç kat art arda bağlandığında filtrenin toplam DC kazancı katlanarak artar: $K_{\\text{tot}} = K_1 \\cdot K_2 \\cdot K_3 = 1.0 \\times 2.38197 \\times 1.38197 = 3.2918$ ($+10.35\\text{ dB}$). Spesifikasyonlarda filtrenin DC kazancının tam $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) olması ve çıkış empedansının $R_{\\text{out}} = 10\\text{ k}\\Omega$ sabitine oturması istendiğinden son katın çıkışına $R_x, R_y$ gerilim bölücüsü eklenir:',
              math: '$$G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}} = \\frac{3.2918}{1.0} = 3.2918$$\n$$R_x = G_A \\cdot R_{\\text{out}} = 3.2918 \\times 10\\text{ k}\\Omega = 32.918\\text{ k}\\Omega$$\n$$R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}} = \\frac{3.2918}{3.2918 - 1} \\times 10\\text{ k}\\Omega = \\frac{3.2918}{2.2918} \\times 10\\text{ k}\\Omega = 14.363\\text{ k}\\Omega$$\n$$\\text{Thevenin Sağlaması: } R_x \\parallel R_y = \\frac{32.918 \\times 14.363}{32.918 + 14.363} = 10.00\\text{ k}\\Omega \\; \\checkmark$$',
              expl: `
                • <strong>Toplam Kazanç ($K_{\\text{tot}} = 3.2918$):</strong> Katların kazanç çarpımıdır ($1.0 \\times 2.3820 \\times 1.3820$). Filtre çıkışında $+10.35\\text{ dB}$ fazla kazanç oluşur.<br>
                • <strong>Zayıflatma ($G_A = 3.2918$):</strong> Kazancı $1.0$'a (0 dB) indirmek için bu oranda gerilim bölünmelidir.<br>
                • <strong>$R_x = 32.918\\text{ k}\\Omega, \\; R_y = 14.363\\text{ k}\\Omega$:</strong> İki denklem iki bilinmeyen çözülerek hem zayıflatma hem de $10\\text{ k}\\Omega$ çıkış empedansı aynı anda sağlanır.
              `
            },
            {
              stepTitle: 'Adım 4: Standart E24 (%5) Serisine Eşleme ve Sınav Doğrulaması',
              desc: 'Endüstriyel üretim ve laboratuvarda hesaplanan teorik değerlere en yakın standart E24 (%5) bileşenleri seçilir:',
              math: '$$\\text{Filtre Dirençleri: } R_1 = R_2 = R_3 = 16\\text{ k}\\Omega \\quad (\\text{Teorik: } 15.92\\text{ k}\\Omega, \\; \\text{Hata: } +0.5\\%)$$\n$$\\text{Geri Besleme Dirençleri: } R_{B,2} = 13\\text{ k}\\Omega \\text{ veya } 15\\text{ k}\\Omega, \\quad R_{B,3} = 3.9\\text{ k}\\Omega \\quad (\\text{Teorik: } 3.82\\text{ k}\\Omega)$$\n$$\\text{Çıkış Bölücü Dirençleri: } R_x = 33\\text{ k}\\Omega, \\quad R_y = 15\\text{ k}\\Omega \\quad (\\text{Teorik: } 32.92\\text{ k}\\Omega, \\; 14.36\\text{ k}\\Omega)$$\n$$\\text{Standart Değerlerle Gerçek Frekans: } f_{0,\\text{gerçek}} = \\frac{1}{2\\pi \\times 16\\text{ k}\\Omega \\times 10\\text{ nF}} = 994.7\\text{ Hz} \\; (\\text{Hedef: } 1000\\text{ Hz})$$',
              expl: `
                • <strong>E24 Seçimi ($16\\text{ k}\\Omega$):</strong> Teorik $15.92\\text{ k}\\Omega$'a en yakın standart değerdir. Hata oranı yalnızca $\%0.5$'tir.<br>
                • <strong>Frekans Kayması ($994.7\\text{ Hz}$):</strong> Standart bileşenler takıldığında kesim frekansı $1000\\text{ Hz}$ yerine $994.7\\text{ Hz}$ olur (kabul edilebilir tolerans bandında).
              `
            }
          ]
        },
        {
          id: 'ex4_5',
          badge: 'Örnek 4.5 (Kitap Sayfa 114-115) - Ters Chebyshev 5. Derece LP Aktif Devre',
          title: 'Ters Chebyshev 5. Derece Alçak Geçiren Devre Tasarımı (Sonlu Sıfırlı Devre)',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 100\\text{ Hz}, f_{\\text{stop}} = 300\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -60.0\\text{ dB}, C = 100\\text{ nF}, R_A = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Normalize Olmayan Katsayılar ve İletim Sıfırları (Denklem 2.37 - 2.45)',
              desc: 'Ters Chebyshev (Tip II) yaklaşımında geçirme bandı Butterworth gibi maksimum düzdür, durdurma bandında ise dik kesim sağlamak için sanal eksende ($j\\omega$) sonlu iletim sıfırları $\\omega_{z,m}$ bulunur. $n=5$ dereceli filtrede 1 adet 1. derece RC tampon katı ve 2 adet sonlu sıfır içeren kuadratik çentikli kat gereklidir:',
              math: '$$\\omega_0 = 2\\pi(100) = 628.318\\text{ rad/s}, \\quad \\omega_s = 2\\pi(300) = 1884.956\\text{ rad/s}$$\n$$\\text{Kat 1 (1. Derece RC): } b_2 = 188.50\\text{ rad/s} \\implies H_1(s) = \\frac{188.50}{s + 188.50}$$\n$$\\text{Kat 2 (Sonlu Sıfırlı Biquad): } \\omega_{z1} = 1916.3\\text{ rad/s} \\implies \\text{Pay: } s^2 + 3.672 \\times 10^6$$\n$$\\text{Payda: } s^2 + 154.2 s + 3.125 \\times 10^5, \\quad \\sqrt{b_{2,2}} = 559.0\\text{ rad/s}, \\; Q_2 = 3.62$$\n$$\\text{Kat 3 (Sonlu Sıfırlı Biquad): } \\omega_{z2} = 3122.8\\text{ rad/s} \\implies \\text{Pay: } s^2 + 9.752 \\times 10^6$$\n$$\\text{Payda: } s^2 + 389.1 s + 6.421 \\times 10^5, \\quad \\sqrt{b_{2,3}} = 801.3\\text{ rad/s}, \\; Q_3 = 2.06$$',
              expl: `
                • <strong>İletim Sıfırları ($\\omega_{z1}=1916.3, \\omega_{z2}=3122.8\\text{ rad/s}$):</strong> Pay kısmında $s^2 + \\omega_z^2$ biçiminde yer alır. $s = j\\omega_z$ konulduğunda transfer fonksiyonu tam sıfır ($-\\infty\\text{ dB}$) olur.<br>
                • <strong>Kat Dereceleri:</strong> 1 adet reel kutup (Kat 1) ve sıfır içeren 2 adet kuadratik biquad katı (Kat 2 ve Kat 3).
              `
            },
            {
              stepTitle: 'Adım 2: Devre Elemanları ve Çentikli Katların Sentezi ($C = 100\\text{ nF}$)',
              desc: 'Neden standart Sallen-Key kullanılamaz? Sallen-Key tüm-kutupludur, payında $s^2 + \\omega_z^2$ üretemez. Bu nedenle sonlu iletim sıfırları Twin-Tee çentikli biquad veya Bainter biquad topolojisi ile sentezlenir:',
              math: '$$\\text{Kat 1 (RC Tampon): } R_1 = \\frac{1}{b_2 \\cdot C} = \\frac{1}{188.50 \\times 10^{-7}} = 53.05\\text{ k}\\Omega, \\quad K_1 = 1.0$$\n$$\\text{Kat 2 (Çentik Katı): } R_{T2} = \\frac{1}{\\omega_{z1} C} = \\frac{1}{1916.3 \\times 10^{-7}} = 5.218\\text{ k}\\Omega, \\quad K_2 = 2 - \\frac{b_{1,2}}{2\\sqrt{b_{2,2}}} = 1.862$$\n$$\\text{Kat 3 (Çentik Katı): } R_{T3} = \\frac{1}{\\omega_{z2} C} = \\frac{1}{3122.8 \\times 10^{-7}} = 3.202\\text{ k}\\Omega, \\quad K_3 = 2 - \\frac{b_{1,3}}{2\\sqrt{b_{2,3}}} = 1.757$$',
              expl: `
                • <strong>$R_1 = 53.05\\text{ k}\\Omega$ (Tampon Katı):</strong> $100\\text{ nF}$ kondansatör ile reel kutbu oluşturan seri dirençtir.<br>
                • <strong>$R_{T2}, R_{T3}$ (Çentik Dirençleri):</strong> Sıfır frekanslarını oluşturan Twin-Tee köprü dirençleridir ($R = 1/(\\omega_z C)$).<br>
                • <strong>$K_2, K_3$ (Bootstrapping Kazançları):</strong> Sıfır katlarında hedeflenen $Q$ değerini oluşturan op-amp geribesleme katsayılarıdır.
              `
            },
            {
              stepTitle: 'Adım 3: Kazanç Dengeleme ve Çıkış Gerilim Bölücüsü ($R_x, R_y$)',
              desc: 'Toplam kaskad devre kazancı $K_{\\text{tot}} = 1.0 \\times 1.862 \\times 1.757 = 3.272$. Hedef kazanç $G_{\\text{hedef}} = 1.0$ (0 dB) ve $R_{\\text{out}} = 10\\text{ k}\\Omega$ için gerilim bölücü:',
              math: '$$G_A = 3.272 \\implies R_x = 3.272 \\times 10\\text{ k}\\Omega = 32.72\\text{ k}\\Omega$$\n$$R_y = \\frac{3.272}{2.272} \\times 10\\text{ k}\\Omega = 14.40\\text{ k}\\Omega$$\n$$\\text{Standart E24: } R_1 = 51\\text{ k}\\Omega, \\; R_{T2} = 5.1\\text{ k}\\Omega, \\; R_{T3} = 3.3\\text{ k}\\Omega, \\; R_x = 33\\text{ k}\\Omega, \\; R_y = 15\\text{ k}\\Omega$$',
              expl: `
                • <strong>$K_{\\text{tot}} = 3.272$:</strong> Devrenin toplam kazancı $+10.3\\text{ dB}$ fazladır.<br>
                • <strong>E24 Değerleri:</strong> $R_x = 33\\text{ k}\\Omega, R_y = 15\\text{ k}\\Omega$ seçildiğinde çıkış empedansı $10\\text{ k}\\Omega$ olur ve kazanç $1.0$'a (0 dB) dengelenir.
              `
            }
          ]
        }
      ],
      pros: [
        'Equal-Component yöntemiyle tüm katlarda aynı standart kondansatör ($C$) kullanılır; parça maliyeti ve stok karmaşıklığı en aza iner.',
        'Op-amp evirmeyen konfigürasyondadır; giriş empedansı son derece yüksek, çıkış empedansı ise çok düşüktür (kolay kaskad bağlantı).'
      ],
      cons: [
        'Yüksek $Q$ faktörlü katlarda ($Q > 5$), op-amp kazancı $K = 3 - 1/Q$ kritik stabilite sınırına yaklaşır ve duyarlılık artar.'
      ]
    },

    sk_hp: {
      id: 'sk_hp',
      typeKey: 'highpass',
      title: 'Sallen-Key Yüksek Geçiren Devre Tasarımı',
      badge: 'Bölüm 4.3 & Kitap Denklem 4.14 - 4.18',
      color: '#ef4444',
      summary: 'Alçak geçiren devredeki R ve C elemanlarının topolojik yer değişimi (R ⇄ C) ile elde edilen, DC akımı tamamen bloke eden eşit elemanlı yüksek geçiren biquad tasarımı.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <rect x="5" y="5" width="450" height="200" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.2" />

          <!-- Input terminal -->
          <circle cx="30" cy="90" r="3" fill="#ef4444" />
          <text x="28" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vin</text>
          <line x1="30" y1="90" x2="65" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Capacitor C1 -->
          <line x1="65" y1="80" x2="65" y2="100" stroke="#ef4444" stroke-width="2.5" />
          <line x1="72" y1="80" x2="72" y2="100" stroke="#ef4444" stroke-width="2.5" />
          <text x="68" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">C₁ = C</text>
          <line x1="72" y1="90" x2="145" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VA -->
          <circle cx="145" cy="90" r="3.5" fill="#ef4444" />
          <text x="145" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">VA</text>

          <!-- Feedback Resistor R1 from VA to Vout -->
          <line x1="145" y1="90" x2="145" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="145" y1="35" x2="220" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="220" y="28" width="40" height="14" fill="#f8fafc" stroke="#ef4444" stroke-width="1.8" rx="2" />
          <text x="240" y="22" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">R₁ = R</text>
          <line x1="260" y1="35" x2="390" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="390" y1="35" x2="390" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Capacitor C2 -->
          <line x1="145" y1="90" x2="175" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="175" y1="80" x2="175" y2="100" stroke="#ef4444" stroke-width="2.5" />
          <line x1="182" y1="80" x2="182" y2="100" stroke="#ef4444" stroke-width="2.5" />
          <text x="178" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">C₂ = C</text>
          <line x1="182" y1="90" x2="245" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VB -->
          <circle cx="245" cy="90" r="3.5" fill="#ef4444" />
          <text x="245" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">VB (+)</text>

          <!-- Resistor R2 to GND -->
          <line x1="245" y1="90" x2="245" y2="130" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="238" y="130" width="14" height="28" fill="#f8fafc" stroke="#ef4444" stroke-width="1.8" rx="2" />
          <text x="228" y="146" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">R₂ = R</text>
          <line x1="245" y1="158" x2="245" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <!-- GND -->
          <line x1="237" y1="170" x2="253" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="240" y1="174" x2="250" y2="174" stroke="#2f2e2b" stroke-width="1.4" />

          <!-- Op-Amp Triangle -->
          <line x1="245" y1="90" x2="280" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="280,75 280,135 340,105" fill="#f8fafc" stroke="#2f2e2b" stroke-width="2" />
          <text x="290" y="94" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">+</text>
          <text x="290" y="124" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">−</text>

          <!-- Op-Amp Output line -->
          <line x1="340" y1="105" x2="420" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="420" cy="105" r="3" fill="#ef4444" />
          <text x="420" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vout</text>

          <!-- Feedback gain network RA & RB -->
          <line x1="280" y1="120" x2="270" y2="120" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="270" y1="120" x2="270" y2="165" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="263" y="165" width="14" height="25" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="254" y="180" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#64748b">RA</text>
          <line x1="270" y1="190" x2="270" y2="198" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="265" y1="198" x2="275" y2="198" stroke="#2f2e2b" stroke-width="1.5" />

          <line x1="270" y1="145" x2="365" y2="145" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="315" y="138" width="35" height="14" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="332" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#64748b">RB=(K-1)RA</text>
          <line x1="365" y1="145" x2="365" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="365" cy="105" r="2.5" fill="#2f2e2b" />
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="30" y1="170" x2="240" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <line x1="30" y1="25" x2="30" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <polygon points="240,167 247,170 240,173" fill="#2f2e2b" />
          <polygon points="27,25 30,18 33,25" fill="#2f2e2b" />

          <!-- Sallen-Key HP Response curve -->
          <path d="M 30,165 C 60,160 85,120 105,85 C 125,65 170,65 240,65" fill="none" stroke="#ef4444" stroke-width="3" />
          
          <line x1="105" y1="25" x2="105" y2="170" stroke="#ef4444" stroke-width="1.2" stroke-dasharray="2,2" />
          <text x="105" y="188" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#ef4444">f₀ = 1/(2πRC)</text>

          <text x="24" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f2e2b">K (HF)</text>
          <text x="24" y="90" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#ef4444">-3 dB</text>

          <text x="45" y="140" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#64748b">+40 dB/dekad</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Yüksek Geçiren Devre Transfer Fonksiyonu Türetimi (Denklem 4.14 - 4.15)',
          desc: 'Alçak geçiren devredeki direnç ve kondansatörlerin yerleri değiştirilerek (R ⇄ C) KCL düğüm analizi yapılır:',
          math: '$$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{K s^2}{s^2 + s\\left[ \\frac{1}{R_2 C_2} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_1 C_1} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$',
          expl: `
            • <strong>$R \\leftrightarrow C$ Topolojik Yer Değişimi:</strong> Alçak geçiren devrede seri olan dirençler ($R_1, R_2$) yerine kondansatörler ($C_1, C_2$); toprağa ve çıkışa bağlı kondansatörler yerine ise dirençler bağlanmıştır.<br>
            • <strong>Paydaki $K s^2$ Terimi:</strong> Girişteki seri kondansatörler türev etkisi yaratarak $s^2$ terimini oluşturur. $s=0$ (DC frekansta) $|H(0)| = 0$ olur ve tüm DC ofset gerilimleri filtrelenir.<br>
            • <strong>Yüksek Frekansta ($s \\to \\infty$):</strong> Kondansatörler kısa devreye yaklaşır; $s^2/s^2 \\to 1$ olur ve devre kazancı op-amp kazancı olan $K$'ya eşitlenir ($H(\\infty) = K$).
          `
        },
        {
          stepNum: 'Adım 2',
          title: 'Eşit Elemanlı Yüksek Geçiren Katsayı Eşleme Bağıntıları (Denklem 4.16 - 4.18)',
          desc: '$C_1 = C_2 = C$ ve $R_1 = R_2 = R$ eşitliği uygulandığında, alçak geçiren ile kusursuz bir katsayı simetrisi sağlanır:',
          math: '$$R = \\frac{1}{C \\sqrt{b_2}}, \\quad K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A$$\n$$\\text{Paydaki } s^2 \\text{ terimi orijinde } (s=0) \\text{ çift sıfır yaratarak DC akımını tamamen engeller.}$$',
          expl: `
            • <strong>$C$ (Baz Kondansatör - $\\text{F}$):</strong> Tüm katlarda $C_1 = C_2 = C = 10\\text{ nF}$ seçilir.<br>
            • <strong>$b_2 = \\omega_0^2 / B_2$:</strong> Yüksek geçiren dönüşümünden ($S \\leftarrow \\omega_0 / s$) gelen payda sabit terimidir.<br>
            • <strong>$R = 1/(C\\sqrt{b_2})$:</strong> Eşit elemanlı Sallen-Key direnç formülü alçak geçiren ile tamamen aynı simetride kalır.<br>
            • <strong>$K = 3 - 1/Q$:</strong> Kararlılık şartı aynıdır; $K < 3$ olmalıdır. $R_B = (K - 1)R_A$ ile op-amp geri besleme direnci belirlenir.
          `
        },
        {
          stepNum: 'Adım 3',
          title: '1. Derece Yüksek Geçiren Katı (Tek Dereceli Filtreler)',
          desc: 'Tek dereceli HP filtrelerde ($n=1, 3, 5, \\dots$), seri kondansatör ve toprağa bağlı direnç ile tampon op-amp kullanılır:',
          math: '$$H_c(s) = \\frac{s}{s + 1/(RC)} = \\frac{s}{s + b_2} \\implies R = \\frac{1}{b_2 C}, \\quad K = 1.0$$',
          expl: `
            • <strong>Tek Dereceli Filtreler ($N=1, 3, 5\\dots$):</strong> Bir adet seri $C$ kondansatörü, toprağa bağlı bir adet $R$ direnci ve kazancı 1 gerilim izleyici tampon op-amp ile kurulur.<br>
            • <strong>$R = 1/(b_2 C)$:</strong> Reel kutbu oluşturan dirençtir. Tampon op-amp ($K=1.0$) sonraki katların devreyi yüklemesini önler.
          `
        },
        {
          stepNum: 'Adım 4',
          title: 'Kazanç Dengeleme ve Gerilim Bölücüsü',
          desc: 'Yüksek frekans tepe kazancını $G_{\\text{hedef}}$ seviyesine kalibre etmek için son kat çıkışına $R_x, R_y$ eklenir:',
          math: '$$K_{\\text{tot}} = \\prod_{m=1}^{M} K_m, \\quad G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}}, \\quad R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} R_{\\text{out}}$$',
          expl: `
            • <strong>$K_{\\text{tot}} = K_1 \\cdot K_2 \\dots$:</strong> Biquad katlarının yüksek frekanstaki tepe kazançlarının çarpımıdır.<br>
            • <strong>$G_A = K_{\\text{tot}} / G_{\\text{hedef}}$:</strong> Yüksek geçiren geçirme bandı kazancını hedef seviyeye ($0\\text{ dB} \\implies 1.0$) çekmek için gereken zayıflatma oranıdır.<br>
            • <strong>$R_x, R_y$:</strong> $R_x = G_A R_{\\text{out}}$ ve $R_y = \\frac{G_A}{G_A-1} R_{\\text{out}}$ ile hem kazanç ayarlanır hem de Thevenin çıkış empedansı $10\\text{ k}\\Omega$ sabitine bağlanır.
          `
        }
      ],
      examples: [
        {
          id: 'ex4_2',
          badge: 'Örnek 4.2 (Kitap Sayfa 104-106) - Chebyshev 4. Derece HP Aktif Devre',
          title: 'Chebyshev 4. Derece Yüksek Geçiren Sallen-Key Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 1000\\text{ Hz}, f_{\\text{stop}} = 400\\text{ Hz}, a_{\\text{pass}} = -0.5\\text{ dB}, a_{\\text{stop}} = -30.0\\text{ dB}, C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega, R_{\\text{out}} = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: HP Dönüşümü, Derece ($n=4$) ve Biquad Katsayıları',
              desc: 'Yüksek geçiren geçiş oranı $\\Omega_{rH} = f_{\\text{pass}} / f_{\\text{stop}} = 1000 / 400 = 2.50$. $a_{\\text{pass}} = -0.5\\text{ dB} \\implies \\epsilon = \\sqrt{10^{0.05}-1} = 0.3493$, $a_{\\text{stop}} = -30\\text{ dB} \\implies \\epsilon_s = \\sqrt{10^3-1} = 31.607$. Chebyshev derece formülü (Denklem 2.21): $n \\ge \\frac{\\cosh^{-1}(31.607/0.3493)}{\\cosh^{-1}(2.50)} = 3.32 \\implies n = 4$ (çift derece, 2 adet Sallen-Key HP biquad katı). $\\omega_0 = 2\\pi(1000) = 6283.185\\text{ rad/s}$. Bölüm 3 Denklem 3.17 yüksek geçiren dönüşüm çekirdeği ($S \\leftarrow \\omega_0 / s \\implies b_1 = \\frac{B_1 \\omega_0}{B_2}, \\; b_2 = \\frac{\\omega_0^2}{B_2}$) ile gerçek katsayılar hesaplanır:',
              math: '$$\\mathbf{Kat\\ 1: } B_1 = 0.3507, \\; B_2 = 1.0635$$\n$$b_{1,1} = \\frac{0.3507 \\times 6283.19}{1.0635} = 2071.7\\text{ rad/s}, \\quad b_{2,1} = \\frac{6283.19^2}{1.0635} = 3.712 \\times 10^7 \\implies \\sqrt{b_{2,1}} = 6092.8\\text{ rad/s}$$\n$$Q_1 = \\frac{\\sqrt{b_{2,1}}}{b_{1,1}} = \\frac{6092.8}{2071.7} = 2.94$$\n\n$$\\mathbf{Kat\\ 2: } B_1 = 0.8467, \\; B_2 = 0.3564$$\n$$b_{1,2} = \\frac{0.8467 \\times 6283.19}{0.3564} = 14926.4\\text{ rad/s}, \\quad b_{2,2} = \\frac{6283.19^2}{0.3564} = 1.108 \\times 10^8 \\implies \\sqrt{b_{2,2}} = 10524.5\\text{ rad/s}$$\n$$Q_2 = \\frac{\\sqrt{b_{2,2}}}{b_{1,2}} = \\frac{10524.5}{14926.4} = 0.705$$',
              expl: `
                • <strong>Ters Geçiş Oranı ($\\Omega_{rH} = 2.50$):</strong> Yüksek geçiren filtrelerde $\\Omega_{rH} = f_{\\text{pass}} / f_{\\text{stop}} = 1000 / 400 = 2.50$'dir (alçak geçirenin tersidir!).<br>
                • <strong>Chebyshev Katsayı Dönüşümü:</strong> $b_1 = \\frac{B_1 \\omega_0}{B_2}$ ve $b_2 = \\frac{\\omega_0^2}{B_2}$ bağıntılarıyla normalize $B_1, B_2$ katsayıları gerçek frekans katsayılarına dönüştürülmüştür.<br>
                • <strong>Kutup Dağılımı ($n=4$):</strong> İki kuadratik kat: Kat 1 yüksek $Q$'lu ($Q_1=2.94$), Kat 2 ise düşük $Q$'lu ($Q_2=0.705$).
              `
            },
            {
              stepTitle: 'Adım 2: Sallen-Key HP Devre Elemanlarının Hesaplanması ($C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega$)',
              desc: 'Tüm katlarda $C_1 = C_2 = C = 10\\text{ nF} = 10^{-8}\\text{ F}$ ve $R_A = 10\\text{ k}\\Omega$ alınarak Equal-Component formülleri ($R = \\frac{1}{C\\sqrt{b_2}}, K = 3 - \\frac{b_1}{\\sqrt{b_2}}, R_B = (K-1)R_A$) uygulanır:',
              math: '$$\\mathbf{Kat\\ 1\\ (Yüksek\\ Q\\ Katı):}$$\n$$R_{1,1} = R_{2,1} = R = \\frac{1}{C \\sqrt{b_{2,1}}} = \\frac{1}{10^{-8} \\times 6092.8} = 16412.8\\ \\Omega = 16.413\\text{ k}\\Omega$$\n$$K_1 = 3 - \\frac{b_{1,1}}{\\sqrt{b_{2,1}}} = 3 - \\frac{2071.7}{6092.8} = 3 - 0.3400 = 2.660$$\n$$R_{B,1} = (K_1 - 1) R_A = (2.660 - 1) \\times 10\\text{ k}\\Omega = 1.660 \\times 10\\text{ k}\\Omega = 16.602\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 2\\ (Düşük\\ Q\\ Katı):}$$\n$$R_{1,2} = R_{2,2} = R = \\frac{1}{C \\sqrt{b_{2,2}}} = \\frac{1}{10^{-8} \\times 10524.5} = 9501.6\\ \\Omega = 9.502\\text{ k}\\Omega$$\n$$K_2 = 3 - \\frac{b_{1,2}}{\\sqrt{b_{2,2}}} = 3 - \\frac{14926.4}{10524.5} = 3 - 1.4182 = 1.5818$$\n$$R_{B,2} = (K_2 - 1) R_A = (1.5818 - 1) \\times 10\\text{ k}\\Omega = 0.5818 \\times 10\\text{ k}\\Omega = 5.818\\text{ k}\\Omega$$',
              expl: `
                • <strong>Kat 1 (Yüksek Q):</strong> $R = 16.413\\text{ k}\\Omega$. Kazanç $K_1 = 3 - 0.3400 = 2.660 < 3$ (kararlı!). $R_{B1} = (2.660 - 1) \\times 10\\text{ k}\\Omega = 16.602\\text{ k}\\Omega$.<br>
                • <strong>Kat 2 (Düşük Q):</strong> $R = 9.502\\text{ k}\\Omega$. Kazanç $K_2 = 3 - 1.4182 = 1.5818 < 3$ (kararlı!). $R_{B2} = (1.5818 - 1) \\times 10\\text{ k}\\Omega = 5.818\\text{ k}\\Omega$.<br>
                • <strong>Kaskad Sıralaması İlkesi:</strong> Dinamik aralığı korumak ve op-amp doyulmasını önlemek için düşük $Q$'lu kat genellikle öne, yüksek $Q$'lu kat ise arkaya bağlanabilir.
              `
            },
            {
              stepTitle: 'Adım 3: Kazanç Dengeleme Gerilim Bölücüsü ($R_x, R_y$)',
              desc: 'Kaskad toplam kazanç $K_{\\text{tot}} = K_1 \\cdot K_2 = 2.660 \\times 1.5818 = 4.208$ ($+12.48\\text{ dB}$). Hedef $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) ve $R_{\\text{out}} = 10\\text{ k}\\Omega$ için gerilim bölücü dirençleri:',
              math: '$$G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}} = \\frac{4.208}{1.0} = 4.208$$\n$$R_x = G_A \\cdot R_{\\text{out}} = 4.208 \\times 10\\text{ k}\\Omega = 42.08\\text{ k}\\Omega$$\n$$R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}} = \\frac{4.208}{4.208 - 1} \\times 10\\text{ k}\\Omega = \\frac{4.208}{3.208} \\times 10\\text{ k}\\Omega = 13.117\\text{ k}\\Omega$$\n$$\\text{Thevenin Sağlaması: } R_x \\parallel R_y = \\frac{42.08 \\times 13.12}{42.08 + 13.12} = 10.00\\text{ k}\\Omega \\; \\checkmark$$',
              expl: `
                • <strong>Toplam Kazanç ($K_{\\text{tot}} = 4.208$):</strong> İki katın kazanç çarpımıdır ($2.660 \\times 1.5818$). Çıkışta $+12.48\\text{ dB}$ fazla gerilim vardır.<br>
                • <strong>Zayıflatma ($G_A = 4.208$):</strong> Hedef kazanca (0 dB) dönmek için gerilim $4.208$ kat zayıflatılmalıdır.<br>
                • <strong>$R_x = 42.08\\text{ k}\\Omega, \\; R_y = 13.117\\text{ k}\\Omega$:</strong> $R_x \\parallel R_y = 10.00\\text{ k}\\Omega$ Thevenin çıkış empedansı kusursuz sağlanır.
              `
            },
            {
              stepTitle: 'Adım 4: Standart E24 (%5) Seçimi ve Sınav Sağlaması',
              desc: 'Standart E24 serisinden en yakın direnç değerleri seçilir:',
              math: '$$\\text{Kat 1: } R = 16\\text{ k}\\Omega, \\; R_B = 16\\text{ k}\\Omega \\text{ veya } 18\\text{ k}\\Omega$$\n$$\\text{Kat 2: } R = 9.1\\text{ k}\\Omega \\text{ veya } 10\\text{ k}\\Omega, \\; R_B = 5.6\\text{ k}\\Omega \\text{ veya } 6.2\\text{ k}\\Omega$$\n$$\\text{Bölücü: } R_x = 43\\text{ k}\\Omega, \\; R_y = 13\\text{ k}\\Omega$$\n$$\\text{Standart Değerlerle Gerçek Frekans: } f_{0,\\text{gerçek,1}} = \\frac{1}{2\\pi (16\\text{ k}\\Omega)(10\\text{ nF})} = 994.7\\text{ Hz}$$',
              expl: `
                • <strong>E24 Seçimleri:</strong> Kat 1 için $R = 16\\text{ k}\\Omega, R_B = 16\\text{ k}\\Omega$; Kat 2 için $R = 9.1\\text{ k}\\Omega$ (veya $10\\text{ k}\\Omega$), $R_B = 5.6\\text{ k}\\Omega$.<br>
                • <strong>Bölücü E24:</strong> $R_x = 43\\text{ k}\\Omega, R_y = 13\\text{ k}\\Omega$ ($R_x \\parallel R_y \\approx 9.98\\text{ k}\\Omega$).
              `
            }
          ]
        }
      ],
      pros: [
        'Paydaki $s^2$ terimleri sayesinde DC ofset voltajları ve düşük frekanslı kaymalar tamamen engellenir.',
        'Equal-Component mimarisi sayesinde direnç hesaplama formülü alçak geçiren ile birebir aynı kalır.'
      ],
      cons: [
        'Katsayılar $B_2$ değerine bölündüğü için, yüksek dereceli katlarda kesim frekansı $\\sqrt{b_2}$ yukarı kayabilir; daha küçük dirençler gerektirebilir.'
      ]
    },

    sk_bp: {
      id: 'sk_bp',
      typeKey: 'bandpass',
      title: 'Sallen-Key & MFB Bant Geçiren Devre Tasarımı',
      badge: 'Bölüm 4.4 & Kitap Denklem 4.22 - 4.29',
      color: '#10b981',
      summary: 'Merkez frekansta (ω₀) maksimum tepe kazancı sağlayan ve bağımsız rezonans biquad katlarının kaskad bağlanmasıyla derecesi 2n olan bant geçiren aktif filtre mimarisi.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <rect x="5" y="5" width="450" height="200" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.2" />

          <!-- Input terminal -->
          <circle cx="30" cy="90" r="3" fill="#10b981" />
          <text x="28" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vin</text>
          <line x1="30" y1="90" x2="65" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Resistor R1 -->
          <rect x="65" y="83" width="38" height="14" fill="#f8fafc" stroke="#10b981" stroke-width="1.8" rx="2" />
          <text x="84" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">R₁</text>
          <line x1="103" y1="90" x2="140" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VA -->
          <circle cx="140" cy="90" r="3.5" fill="#10b981" />
          <text x="140" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">VA</text>

          <!-- Resistor R3 to GND -->
          <line x1="140" y1="90" x2="140" y2="135" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="133" y="135" width="14" height="28" fill="#f8fafc" stroke="#10b981" stroke-width="1.8" rx="2" />
          <text x="160" y="152" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">R₃</text>
          <line x1="140" y1="163" x2="140" y2="175" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="132" y1="175" x2="148" y2="175" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Capacitor C1 to VB -->
          <line x1="140" y1="90" x2="185" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="185" y1="80" x2="185" y2="100" stroke="#10b981" stroke-width="2.5" />
          <line x1="192" y1="80" x2="192" y2="100" stroke="#10b981" stroke-width="2.5" />
          <text x="188" y="72" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">C₁</text>
          <line x1="192" y1="90" x2="250" y2="90" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Node VB -->
          <circle cx="250" cy="90" r="3.5" fill="#10b981" />
          <text x="250" y="80" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">VB (+)</text>

          <!-- Resistor R2 to GND -->
          <line x1="250" y1="90" x2="250" y2="135" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="243" y="135" width="14" height="28" fill="#f8fafc" stroke="#10b981" stroke-width="1.8" rx="2" />
          <text x="233" y="152" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">R₂</text>
          <line x1="250" y1="163" x2="250" y2="175" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="242" y1="175" x2="258" y2="175" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Feedback C2 from VA to Vout -->
          <line x1="140" y1="90" x2="140" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="140" y1="35" x2="225" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="225" y1="25" x2="225" y2="45" stroke="#10b981" stroke-width="2.5" />
          <line x1="232" y1="25" x2="232" y2="45" stroke="#10b981" stroke-width="2.5" />
          <text x="228" y="20" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#10b981">C₂</text>
          <line x1="232" y1="35" x2="390" y2="35" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="390" y1="35" x2="390" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Op-Amp Triangle -->
          <line x1="250" y1="90" x2="280" y2="90" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="280,75 280,135 340,105" fill="#f8fafc" stroke="#2f2e2b" stroke-width="2" />
          <text x="290" y="94" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">+</text>
          <text x="290" y="124" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">−</text>

          <!-- Output -->
          <line x1="340" y1="105" x2="420" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="420" cy="105" r="3" fill="#10b981" />
          <text x="420" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vout</text>

          <!-- Feedback gain network RA & RB -->
          <line x1="280" y1="120" x2="270" y2="120" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="270" y1="120" x2="270" y2="165" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="263" y="165" width="14" height="25" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="254" y="180" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#64748b">RA</text>
          <line x1="270" y1="190" x2="270" y2="198" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="265" y1="198" x2="275" y2="198" stroke="#2f2e2b" stroke-width="1.5" />

          <line x1="270" y1="145" x2="365" y2="145" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="315" y="138" width="35" height="14" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" rx="1" />
          <text x="332" y="132" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#64748b">RB=(K-1)RA</text>
          <line x1="365" y1="145" x2="365" y2="105" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="365" cy="105" r="2.5" fill="#2f2e2b" />
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="30" y1="170" x2="240" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <line x1="30" y1="25" x2="30" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <polygon points="240,167 247,170 240,173" fill="#2f2e2b" />
          <polygon points="27,25 30,18 33,25" fill="#2f2e2b" />

          <!-- Bandpass Resonance Bell curve -->
          <path d="M 30,165 C 80,162 110,130 135,65 C 160,130 190,162 240,165" fill="none" stroke="#10b981" stroke-width="3" />
          
          <line x1="135" y1="25" x2="135" y2="170" stroke="#10b981" stroke-width="1.2" stroke-dasharray="2,2" />
          <text x="135" y="188" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#10b981">f₀ (Rezonans)</text>

          <text x="24" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f2e2b">G(f₀)</text>
          <text x="24" y="95" text-anchor="end" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#10b981">-3 dB</text>

          <text x="135" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#10b981">Q = f₀ / BW</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Bant Geçiren Devre Topolojisi ve KCL Denklemleri (Denklem 4.22 - 4.24)',
          desc: 'Bant geçiren aktif biquad katı merkez frekansta rezonans gösteren $s$ terimli bir paya sahiptir:',
          math: '$$H_c(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2} = \\frac{G_0 \\cdot \\frac{\\omega_0}{Q} s}{s^2 + \\frac{\\omega_0}{Q} s + \\omega_0^2}$$\n$$\\omega_0 = \\sqrt{b_2}, \\quad Q = \\frac{\\sqrt{b_2}}{b_1}, \\quad BW = \\frac{\\omega_0}{Q} = b_1$$',
          expl: `
            • <strong>Paydaki $a_1 s$ Terimi:</strong> DC frekansta ($s=0$) ve çok yüksek frekansta ($s \\to \\infty$) kazancı sıfırlar; yalnızca rezonans frekansı civarındaki sinyalleri geçirir.<br>
            • <strong>$\\omega_0 = \\sqrt{b_2}$ (Rezonans Frekansı - $\\text{rad/s}$):</strong> Katın maksimum tepe kazancı verdiği rezonans açısal frekansıdır.<br>
            • <strong>$Q = \\sqrt{b_2} / b_1$ (Seçicilik Faktörü):</strong> Rezonans tepesinin ne kadar dar ve keskin olduğunu gösterir ($Q$ yükseldikçe filtre seçiciliği artar).<br>
            • <strong>$BW = b_1$ (Bant Genişliği - $\\text{rad/s}$):</strong> $-3\\text{ dB}$ kesim noktaları arasındaki açısal frekans aralığıdır.
          `
        },
        {
          stepNum: 'Adım 2',
          title: 'Bileşen Değerleri ve Katsayı Eşleme Bağıntıları (Denklem 4.25 - 4.29)',
          desc: '$C_1 = C_2 = C$ eşit kondansatör seçimi ile dirençler rezonans frekansı ve $Q$ faktörüne göre hesaplanır:',
          math: '$$R_1 = \\frac{Q}{G_0 \\omega_0 C}, \\quad R_2 = \\frac{2Q}{\\omega_0 C}, \\quad R_3 = \\frac{Q}{(2Q^2 - G_0) \\omega_0 C}$$\n$$\\text{Multiple-Feedback (MFB) yapısında stabilite ve bileşen duyarlılığı çok yüksektir.}$$',
          expl: `
            • <strong>Multiple-Feedback (MFB) Üstünlüğü:</strong> Op-amp eviren modda çalışır. Orta ve yüksek $Q$ değerlerinde Sallen-Key'e göre op-amp kazanç sınırlamalarına ve tolerans kaymalarına karşı çok daha kararlıdır.<br>
            • <strong>$R_1$ (Giriş Direnci - $\\Omega$):</strong> Filtre giriş empedansını ve katın tepe kazancını ($G_0$) belirler.<br>
            • <strong>$R_3$ (Toprağa Giden Direnç - $\\Omega$):</strong> $2Q^2 > G_0$ şartı sağlanmalıdır! Payda negatif çıkarsa fiziksel direnç üretilemez.<br>
            • <strong>$R_2$ (Geri Besleme Direnci - $\\Omega$):</strong> Rezonans $Q$ faktörünü ve kazancı stabilize eder.
          `
        },
        {
          stepNum: 'Adım 3',
          title: 'Kaskad Bağlantı ve Ayrık Merkez Frekansları',
          desc: 'Her bir 2. derece katın rezonans frekansı ($\\omega_{0,m}$) ve $Q_m$ değeri farklıdır. Katlar ardışık bağlanarak toplam $2n$ dereceli bant yanıtı elde edilir:',
          math: '$$H(s) = \\prod_{m=1}^{n} H_m(s) = H_1(s) \\cdot H_2(s) \\cdots H_n(s)$$',
          expl: `
            • <strong>$N = 2n$ (Derece İki Katına Çıkar):</strong> Alçak geçiren prototipteki her kutup, bant geçiren dönüşümünde rezonans frekansı etrafında ikiye çatallanır.<br>
            • <strong>Ayrık Merkez Frekansları (Staggered Tuning):</strong> Biquad katlarının tepe frekansları birbirinden biraz farklıdır; biri merkezde, diğerleri bant omuzlarında yer alarak düzgün bir geçirme bandı oluştururlar.
          `
        },
        {
          stepNum: 'Adım 4',
          title: 'Kazanç Ayarı ve Çıkış Bölücüsü',
          desc: 'Kaskad katların merkez frekanstaki tepe kazançlarının çarpımı $G_{\\text{tot}}$ olur; çıkış gerilim bölücüsü ile $0\\text{ dB}$ ($1.0$) seviyesine çekilir:',
          math: '$$R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} R_{\\text{out}}, \\quad G_A = G_{\\text{tot}}$$',
          expl: `
            • <strong>$G_{\\text{tot}} = \\prod G_{0,m}$:</strong> Kat kazançlarının çarpımıdır.<br>
            • <strong>$R_x, R_y$:</strong> Çıkış Thevenin empedansını $10\\text{ k}\\Omega$'a eşitlerken filtrenin genel kazancını $0\\text{ dB}$ ($1.0$) seviyesine kalibre eder.
          `
        }
      ],
      examples: [
        {
          id: 'ex4_3',
          badge: 'Örnek 4.3 (Kitap Sayfa 107-111) - Butterworth 6. Derece BP Aktif Devre',
          title: 'Butterworth 6. Derece Bant Geçiren Aktif Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 1000\\text{ Hz}, f_{\\text{p2}} = 2000\\text{ Hz}, f_{\\text{s1}} = 500\\text{ Hz}, f_{\\text{s2}} = 4000\\text{ Hz}, a_{\\text{pass}} = -1.5\\text{ dB}, a_{\\text{stop}} = -28.0\\text{ dB}, C = 10\\text{ nF}, R_{\\text{out}} = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Geometrik Merkez Frekansı, Bant Genişliği ve Derece ($N=6$)',
              desc: 'Geometrik simetri kuralı gereği merkez frekans $f_0 = \\sqrt{f_{p1} f_{p2}} = \\sqrt{1000 \\times 2000} = 1414.21\\text{ Hz} \\implies \\omega_0 = 2\\pi(1414.21) = 8885.77\\text{ rad/s}$. Bant genişliği $BW = 2\\pi(2000 - 1000) = 6283.19\\text{ rad/s}$. Filtre kalite faktörü $Q_F = \\frac{\\omega_0}{BW} = \\frac{8885.77}{6283.19} = 1.4142$. Durdurma frekanslarının geometrik simetri kontrolü: $\\sqrt{500 \\times 4000} = 1414.21\\text{ Hz} = f_0$ (tam simetrik). $\\Omega_r = \\frac{4000 - 500}{2000 - 1000} = 3.50$. $a_{\\text{pass}} = -1.5\\text{ dB} \\implies \\epsilon = 0.6423$, $a_{\\text{stop}} = -28\\text{ dB} \\implies \\epsilon_s = 25.099$. Minimum prototip derecesi $n_{\\text{LP}} \\ge \\frac{\\log(25.099/0.6423)}{\\log(3.50)} = 2.93 \\implies n_{\\text{LP}} = 3$. Bant geçiren derecesi $N_{\\text{BP}} = 2 \\times 3 = 6$ (3 adet bağımsız 2. derece rezonans biquad katı):',
              math: '$$\\mathbf{Kat\\ 1\\ (Merkez\\ Rezonans\\ Katı): } \\omega_{0,1} = 8885.77\\text{ rad/s} \\; (f_{0,1} = 1414.2\\text{ Hz}), \\quad Q_1 = 1.4142$$\n$$b_{1,1} = \\frac{\\omega_{0,1}}{Q_1} = 6283.19\\text{ rad/s}, \\quad b_{2,1} = \\omega_{0,1}^2 = 7.896 \\times 10^7$$\n\n$$\\mathbf{Kat\\ 2\\ (Alt\\ Yan\\ Biquad\\ Katı): } \\omega_{0,2} = 6542.10\\text{ rad/s} \\; (f_{0,2} = 1041.2\\text{ Hz}), \\quad Q_2 = 2.8284$$\n$$b_{1,2} = \\frac{\\omega_{0,2}}{Q_2} = 2313.01\\text{ rad/s}, \\quad b_{2,2} = \\omega_{0,2}^2 = 4.280 \\times 10^7$$\n\n$$\\mathbf{Kat\\ 3\\ (Üst\\ Yan\\ Biquad\\ Katı): } \\omega_{0,3} = 12068.52\\text{ rad/s} \\; (f_{0,3} = 1920.8\\text{ Hz}), \\quad Q_3 = 2.8284$$\n$$b_{1,3} = \\frac{\\omega_{0,3}}{Q_3} = 4266.91\\text{ rad/s}, \\quad b_{2,3} = \\omega_{0,3}^2 = 1.456 \\times 10^8$$',
              expl: `
                • <strong>Geometrik Merkez ($f_0 = 1414.21\\text{ Hz}$):</strong> $f_0 = \\sqrt{f_{p1} f_{p2}} = \\sqrt{1000 \\times 2000}$. Sınavda asla aritmetik ortalama (1500 Hz) alınmamalıdır!<br>
                • <strong>Bant Genişliği ($BW = 6283.19\\text{ rad/s}$):</strong> $2\\pi(2000 - 1000)$ rad/s olarak hesaplanmıştır.<br>
                • <strong>Filtre Kalitesi ($Q_F = 1.4142$):</strong> $Q_F = \\omega_0 / BW = \\sqrt{2}$.<br>
                • <strong>3 Biquad Katı ($N=6$):</strong> 1 adet tam merkez katı ($1414\\text{ Hz}$) ve 2 adet yan rezonans katı ($1041\\text{ Hz}$ ve $1921\\text{ Hz}$).
              `
            },
            {
              stepTitle: 'Adım 2: Çoklu Geribesleme (MFB) Devre Elemanlarının Hesaplanması ($C = 10\\text{ nF}$)',
              desc: 'Orta ve yüksek $Q$ değerlerinde kararlılık sağladığı için Multiple-Feedback (MFB) mimarisi kullanılır. Tüm katlarda $C_1 = C_2 = C = 10\\text{ nF} = 10^{-8}\\text{ F}$ ve kat başına kazanç $G_0 = 2.0$ alınarak MFB formülleri ($R_1 = \\frac{Q}{G_0 \\omega_0 C}, R_2 = \\frac{Q}{(2Q^2 - G_0)\\omega_0 C}, R_3 = \\frac{2Q}{\\omega_0 C}$) uygulanır:',
              math: '$$\\mathbf{Kat\\ 1\\ (\\omega_{0,1} = 8885.8, \\; Q_1 = 1.4142):}$$\n$$R_{1,1} = \\frac{1.4142}{2 \\times 8885.77 \\times 10^{-8}} = 7.958\\text{ k}\\Omega$$\n$$R_{2,1} = \\frac{1.4142}{(2(1.4142)^2 - 2) \\times 8885.77 \\times 10^{-8}} = \\frac{1.4142}{(4 - 2) \\times 8.886 \\times 10^{-5}} = 7.958\\text{ k}\\Omega$$\n$$R_{3,1} = \\frac{2(1.4142)}{8885.77 \\times 10^{-8}} = 31.831\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 2\\ (\\omega_{0,2} = 6542.1, \\; Q_2 = 2.8284):}$$\n$$R_{1,2} = \\frac{2.8284}{2 \\times 6542.10 \\times 10^{-8}} = 21.616\\text{ k}\\Omega$$\n$$R_{2,2} = \\frac{2.8284}{(2(2.8284)^2 - 2) \\times 6542.10 \\times 10^{-8}} = \\frac{2.8284}{14 \\times 6.542 \\times 10^{-5}} = 3.088\\text{ k}\\Omega$$\n$$R_{3,2} = \\frac{2(2.8284)}{6542.10 \\times 10^{-8}} = 86.463\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 3\\ (\\omega_{0,3} = 12068.5, \\; Q_3 = 2.8284):}$$\n$$R_{1,3} = \\frac{2.8284}{2 \\times 12068.52 \\times 10^{-8}} = 11.718\\text{ k}\\Omega$$\n$$R_{2,3} = \\frac{2.8284}{14 \\times 1.2069 \\times 10^{-4}} = 1.674\\text{ k}\\Omega, \\quad R_{3,3} = \\frac{2(2.8284)}{12068.52 \\times 10^{-8}} = 46.874\\text{ k}\\Omega$$',
              expl: `
                • <strong>Kat 1 ($1414.2\\text{ Hz}$):</strong> $R_{1,1} = 7.958\\text{ k}\\Omega, R_{2,1} = 7.958\\text{ k}\\Omega, R_{3,1} = 31.831\\text{ k}\\Omega$.<br>
                • <strong>Kat 2 ($1041.2\\text{ Hz}$):</strong> $R_{1,2} = 21.616\\text{ k}\\Omega, R_{2,2} = 3.088\\text{ k}\\Omega, R_{3,2} = 86.463\\text{ k}\\Omega$.<br>
                • <strong>Kat 3 ($1920.8\\text{ Hz}$):</strong> $R_{1,3} = 11.718\\text{ k}\\Omega, R_{2,3} = 1.674\\text{ k}\\Omega, R_{3,3} = 46.874\\text{ k}\\Omega$.<br>
                • <strong>$2Q^2 > G_0$ Doğrulaması:</strong> Tüm katlarda $2Q^2 > 2$ sağlandığı için hiçbir $R_2$ direnci negatif çıkmamıştır.
              `
            },
            {
              stepTitle: 'Adım 3: Kazanç Kalibrasyonu ve Çıkış Gerilim Bölücüsü ($R_x, R_y$)',
              desc: 'Her biri $G_0 = 2.0$ tepe kazancına sahip 3 kat kaskad bağlandığında rezonansta toplam kazanç $G_{\\text{tot}} = 2.0 \\times 2.0 \\times 2.0 = 8.0$ ($+18.06\\text{ dB}$) olur. Filtrenin genel kazancını $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) seviyesine çekmek ve çıkış empedansını $R_{\\text{out}} = 10\\text{ k}\\Omega$ yapmak için gerilim bölücü hesaplanır:',
              math: '$$G_A = \\frac{G_{\\text{tot}}}{G_{\\text{hedef}}} = \\frac{8.0}{1.0} = 8.0$$\n$$R_x = G_A \\cdot R_{\\text{out}} = 8.0 \\times 10\\text{ k}\\Omega = 80.0\\text{ k}\\Omega$$\n$$R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}} = \\frac{8.0}{8.0 - 1} \\times 10\\text{ k}\\Omega = \\frac{8.0}{7.0} \\times 10\\text{ k}\\Omega = 11.429\\text{ k}\\Omega$$\n$$\\text{Standart E24 Seçimi: } R_x = 82\\text{ k}\\Omega, \\quad R_y = 11\\text{ k}\\Omega \\quad (R_x \\parallel R_y \\approx 9.69\\text{ k}\\Omega)$$',
              expl: `
                • <strong>Toplam Kazanç ($G_{\\text{tot}} = 8.0$):</strong> 3 katın kazanç çarpımıdır ($2^3 = 8$).<br>
                • <strong>Zayıflatma ($G_A = 8.0$):</strong> Filtre çıkışında $+18.06\\text{ dB}$ fazla kazanç oluşur; $8$ kat zayıflatılarak $0\\text{ dB}$ seviyesine oturtulur.<br>
                • <strong>E24 Seçimleri:</strong> $R_x = 82\\text{ k}\\Omega, R_y = 11\\text{ k}\\Omega$ seçilir. Paralel eşdeğer $9.69\\text{ k}\\Omega \\approx 10\\text{ k}\\Omega$ Thevenin empedansı sağlar.
              `
            }
          ]
        },
        {
          id: 'ex4_6',
          badge: 'Örnek 4.6 (Kitap Sayfa 115-117) - Eliptik 6. Derece BP Aktif Devre',
          title: 'Eliptik 6. Derece Bant Geçiren Aktif Devre Tasarımı (Sonlu Sıfırlı Devre)',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 250\\text{ Hz}, f_{\\text{p2}} = 400\\text{ Hz}, f_{\\text{s1}} = 100\\text{ Hz}, f_{\\text{s2}} = 1000\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -60.0\\text{ dB}, C = 10\\text{ nF}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Frekansı, Bant Genişliği ve İletim Sıfırları',
              desc: 'Eliptik filtre hem geçirme hem durdurma bandında dalgalanmaya (equiripple) izin vererek en dik geçiş bandını sağlar. Durdurma bandında çok dik düşüşü yaratan sonlu karmaşık iletim sıfırları $\\omega_{z,m}$ mevcuttur:',
              math: '$$f_0 = \\sqrt{250 \\times 400} = 316.23\\text{ Hz} \\implies \\omega_0 = 1986.92\\text{ rad/s}, \\quad BW = 2\\pi(400 - 250) = 942.48\\text{ rad/s}$$\n$$\\text{Alt Durdurma Bandı Sıfırı: } \\omega_{z1} = 785.40\\text{ rad/s} \\; (125\\text{ Hz}) \\implies \\text{Pay: } s^2 + 6.168 \\times 10^5$$\n$$\\text{Üst Durdurma Bandı Sıfırı: } \\omega_{z2} = 5026.55\\text{ rad/s} \\; (800\\text{ Hz}) \\implies \\text{Pay: } s^2 + 2.527 \\times 10^7$$',
              expl: `
                • <strong>İletim Sıfırları ($\\omega_{z1}=785.4, \\omega_{z2}=5026.5\\text{ rad/s}$):</strong> Durdurma bandında çok hızlı $-60\\text{ dB}$ zayıflama seviyesine inilmesini sağlar.<br>
                • <strong>Eliptik Kat Sentezi:</strong> 3 adet kuadratik kat gereklidir: 1 merkez rezonans katı ve 2 çentikli sıfır katı.
              `
            },
            {
              stepTitle: 'Adım 2: Çentikli Aktif Biquad Sentezi (Bainter & MFB Katları)',
              desc: 'Tüm-kutuplu katlar için standart MFB veya Sallen-Key; iletim sıfırı barındıran katlar için Bainter çentikli biquad mimarisi kullanılır:',
              math: '$$\\mathbf{Kat\\ 1\\ (Merkez\\ Rezonans\\ Katı): } \\omega_{0,1} = 1986.9\\text{ rad/s}, \\; Q_1 = 3.52$$\n$$\\mathbf{Kat\\ 2\\ (Alt\\ Çentikli\\ Kat): } \\omega_{z1} = 785.4\\text{ rad/s}, \\; \\omega_{0,2} = 1620.4\\text{ rad/s}, \\; Q_2 = 4.85$$\n$$\\mathbf{Kat\\ 3\\ (Üst\\ Çentikli\\ Kat): } \\omega_{z2} = 5026.5\\text{ rad/s}, \\; \\omega_{0,3} = 2436.1\\text{ rad/s}, \\; Q_3 = 4.85$$',
              expl: `
                • <strong>Bainter Mimarisi:</strong> İletim sıfırı $\\omega_z$ kutup frekansı $\\omega_0$'dan farklı olduğunda, 3 op-amp'lı Bainter devresiyle sıfır ve kutuplar bağımsız olarak sentezlenir.
              `
            },
            {
              stepTitle: 'Adım 3: Kazanç Kalibrasyonu ve Çıkış Bölücüsü',
              desc: 'Kat kazançlarının toplamı hesaplanarak hedef $0\\text{ dB}$ ($1.0$) ve $R_{\\text{out}} = 10\\text{ k}\\Omega$ için gerilim bölücü dirençleri çıkarılır:',
              math: '$$G_A = 3.56 \\implies R_x = 3.56 \\times 10\\text{ k}\\Omega = 35.6\\text{ k}\\Omega, \\quad R_y = \\frac{3.56}{2.56} \\times 10\\text{ k}\\Omega = 13.9\\text{ k}\\Omega$$\n$$\\text{Standart E24: } R_x = 36\\text{ k}\\Omega, \\quad R_y = 15\\text{ k}\\Omega$$',
              expl: `
                • <strong>E24 Seçimleri:</strong> $R_x = 36\\text{ k}\\Omega, R_y = 15\\text{ k}\\Omega$ çıkış gerilim bölücüsü ile $0\\text{ dB}$ kazanç kalibrasyonu tamamlanır.
              `
            }
          ]
        }
      ],
      pros: [
        'Her bir kuadratik kat bağımsız olarak rezonans frekansı ($f_0$) ve seçiciliğe ($Q$) ayarlanabilir.',
        'Multiple-Feedback (MFB) yapısı sayesinde op-amp kazanç sınırlamalarına karşı Sallen-Key\'den daha dayanıklıdır.'
      ],
      cons: [
        'Derece katlandığı için ($N = 2n$), op-amp ve pasif bileşen sayısı iki katına çıkar; dar bantlarda ($Q > 10$) frekans kayması hassasiyeti artar.'
      ]
    },

    twin_tee_bs: {
      id: 'twin_tee_bs',
      typeKey: 'bandstop',
      title: 'Twin-Tee Bant Söndüren / Çentik Devre Tasarımı',
      badge: 'Bölüm 4.5 & Kitap Denklem 4.30 - 4.35',
      color: '#8b5cf6',
      summary: 'İki paralel T köprüsünün 180° faz farkıyla birbirini söndürdüğü simetrik Twin-Tee (İkiz-T) mimarisi ve aktif geri besleme ile ayarlanabilir Q seçiciliği.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <rect x="5" y="5" width="450" height="200" rx="8" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.2" />

          <!-- Input -->
          <circle cx="30" cy="105" r="3" fill="#8b5cf6" />
          <text x="28" y="95" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vin</text>
          <line x1="30" y1="105" x2="80" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Upper T-Bridge: R - C(2C) - R (Lowpass Path) -->
          <line x1="80" y1="105" x2="80" y2="55" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="80" y1="55" x2="115" y2="55" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="115" y="48" width="35" height="14" fill="#f8fafc" stroke="#8b5cf6" stroke-width="1.8" rx="2" />
          <text x="132" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">R</text>
          <line x1="150" y1="55" x2="195" y2="55" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="195" cy="55" r="3" fill="#8b5cf6" />
          <rect x="195" y="48" width="35" height="14" fill="#f8fafc" stroke="#8b5cf6" stroke-width="1.8" rx="2" />
          <text x="212" y="42" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">R</text>
          <line x1="230" y1="55" x2="270" y2="55" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="270" y1="55" x2="270" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Middle capacitor 2C of upper bridge -->
          <line x1="195" y1="55" x2="195" y2="85" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="187" y1="85" x2="203" y2="85" stroke="#8b5cf6" stroke-width="2.5" />
          <line x1="187" y1="92" x2="203" y2="92" stroke="#8b5cf6" stroke-width="2.5" />
          <text x="218" y="92" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">2C</text>
          <line x1="195" y1="92" x2="195" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Lower T-Bridge: C - R(R/2) - C (Highpass Path) -->
          <line x1="80" y1="105" x2="80" y2="155" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="80" y1="155" x2="125" y2="155" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="125" y1="145" x2="125" y2="165" stroke="#8b5cf6" stroke-width="2.5" />
          <line x1="132" y1="145" x2="132" y2="165" stroke="#8b5cf6" stroke-width="2.5" />
          <text x="128" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">C</text>
          <line x1="132" y1="155" x2="195" y2="155" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="195" cy="155" r="3" fill="#8b5cf6" />
          <line x1="195" y1="155" x2="225" y2="155" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="225" y1="145" x2="225" y2="165" stroke="#8b5cf6" stroke-width="2.5" />
          <line x1="232" y1="145" x2="232" y2="165" stroke="#8b5cf6" stroke-width="2.5" />
          <text x="228" y="140" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">C</text>
          <line x1="232" y1="155" x2="270" y2="155" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="270" y1="155" x2="270" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Middle resistor R/2 of lower bridge -->
          <line x1="195" y1="155" x2="195" y2="125" stroke="#2f2e2b" stroke-width="1.8" />
          <rect x="188" y="112" width="14" height="22" fill="#f8fafc" stroke="#8b5cf6" stroke-width="1.8" rx="2" />
          <text x="218" y="126" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">R/2</text>
          <line x1="195" y1="112" x2="195" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Common center node feedback line -->
          <circle cx="195" cy="105" r="3" fill="#8b5cf6" />
          <line x1="195" y1="105" x2="195" y2="185" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />

          <!-- Output sum node into Op-Amp -->
          <circle cx="270" cy="105" r="3.5" fill="#8b5cf6" />
          <line x1="270" y1="105" x2="310" y2="105" stroke="#2f2e2b" stroke-width="1.8" />

          <!-- Op-Amp Triangle -->
          <polygon points="310,90 310,150 370,120" fill="#f8fafc" stroke="#2f2e2b" stroke-width="2" />
          <text x="320" y="108" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">+</text>
          <text x="320" y="138" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#2f2e2b">−</text>

          <!-- Output Line -->
          <line x1="370" y1="120" x2="430" y2="120" stroke="#2f2e2b" stroke-width="1.8" />
          <circle cx="430" cy="120" r="3" fill="#8b5cf6" />
          <text x="430" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f2e2b">Vout</text>

          <!-- Active feedback loop to center node -->
          <line x1="395" y1="120" x2="395" y2="185" stroke="#64748b" stroke-width="1.5" />
          <line x1="395" y1="185" x2="195" y2="185" stroke="#64748b" stroke-width="1.5" />
          <text x="300" y="198" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#64748b">Aktif Q Geri Besleme (K)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="30" y1="170" x2="240" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <line x1="30" y1="25" x2="30" y2="170" stroke="#2f2e2b" stroke-width="1.6" />
          <polygon points="240,167 247,170 240,173" fill="#2f2e2b" />
          <polygon points="27,25 30,18 33,25" fill="#2f2e2b" />

          <!-- Deep notch curve -->
          <path d="M 30,65 C 90,65 115,70 130,95 L 135,168 L 140,95 C 155,70 180,65 240,65" fill="none" stroke="#8b5cf6" stroke-width="3" />
          
          <line x1="135" y1="25" x2="135" y2="170" stroke="#8b5cf6" stroke-width="1.2" stroke-dasharray="2,2" />
          <text x="135" y="188" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#8b5cf6">f₀ = 1/(2πRC)</text>

          <text x="24" y="68" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="135" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#8b5cf6">-∞ dB Çentik</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Twin-Tee Köprü Devresi ve Çift-Yol (Dual-Path) Faz İptali (Denklem 4.30 - 4.31)',
          desc: 'Neden Twin-Tee (İkiz-T) kullanılır? Bant söndüren (çentik) yanıtta belirli bir frekansta sıfır iletim (tam sönümleme) gerekir. Twin-Tee devresi paralel iki T köprüsünden oluşur: Üstteki R-C-R köprüsü alçak frekansları geçirir (LP yolu); alttaki C-R-C köprüsü yüksek frekansları geçirir (HP yolu). Rezonans frekansı $f_0$\'da bu iki yoldan geçen sinyaller birbirine eşit büyüklükte fakat tam $180^\\circ$ zıt fazda buluşur ve vektörel toplam sıfır olur (tam faz iptali):',
          math: '$$f_0 = \\frac{1}{2\\pi R C} \\quad \\Longleftrightarrow \\quad \\omega_0 = \\frac{1}{RC}$$\n$$H_{\\text{passive}}(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 4\\omega_0 s + \\omega_0^2}$$\n$$\\text{Pasif Devre Seçiciliği: } Q = \\frac{\\omega_0}{b_1} = \\frac{\\omega_0}{4\\omega_0} = 0.25 \\quad (\\text{Çok geniş ve zayıf seçicilik})$$',
          expl: `
            • <strong>Çift Yol (Dual-Path) Mimarisi:</strong> Üstteki R-C-R yolu alçak frekansları iletir; alttaki C-R-C yolu yüksek frekansları iletir.<br>
            • <strong>$180^\\circ$ Faz Farkı ile Tam İptal:</strong> $f_0 = 1/(2\\pi RC)$ frekansında iki yol arasındaki faz farkı tam $180^\\circ$ olur ve sinyaller birbirini yok ederek teorik olarak $-\\infty\\text{ dB}$ çentik açar.<br>
            • <strong>Pasif $Q = 0.25$:</strong> Pasif köprünün seçiciliği çok düşüktür; çentik çok geniş olur. Bu nedenle op-amp ile aktif bootstrapping zorunludur.
          `
        },
        {
          stepNum: 'Adım 2',
          title: 'Simetrik Twin-Tee Bileşen Bağıntıları (Denklem 4.32)',
          desc: 'Köprünün rezonansta kusursuz sıfır ($-\\infty\\text{ dB}$) üretebilmesi için bileşenler arasında kesin simetri şartı aranır. Üst kolda iki adet $R$ ve toprağa bir adet $2C$; alt kolda iki adet $C$ ve toprağa bir adet $R/2$ bağlanır. $2C$ kondansatörü için iki adet standart $C$ kondansatörünün paralel bağlanması önerilir:',
          math: '$$R_1 = R_2 = R = \\frac{1}{2\\pi f_0 C} = \\frac{1}{\\omega_0 C}, \\quad R_3 = \\frac{R}{2}$$\n$$C_1 = C_2 = C, \\quad C_3 = 2C$$\n$$\\text{Pratik İpucu: } 2C = C \\parallel C \\text{ yapılırsa tolerans ve sıcaklık katsayıları birbirini dengeler.}$$',
          expl: `
            • <strong>Simetri Kuralı:</strong> Üst köprüde iki adet $R$ ve toprağa $2C$; alt köprüde iki adet $C$ ve toprağa $R/2$.<br>
            • <strong>$2C$ İçin Paralel Bağlantı:</strong> İki adet standart $C$ kondansatörü birbirine paralel bağlandığında hem tam $2C$ elde edilir hem de parça toleransları ve sıcaklık kaymaları birbirini dengeler.<br>
            • <strong>$R/2$ Seçimi:</strong> $R$ direncinin tam yarısı standart E24 (%5) veya E96 (%1) serisinden seçilir.
          `
        },
        {
          stepNum: 'Adım 3',
          title: 'Aktif Bootstrapping ile Seçicilik (Q) Yükseltme (Denklem 4.33 - 4.35)',
          desc: 'Pasif devrenin $Q=0.25$ olan düşük seçiciliği çentiği çok yayvan yapar. Op-amp çıkışından köprünün orta referans düğümüne pozitif geribesleme (bootstrapping) $K$ gerilimi uygulandığında, çentiğin genişliği daraltılır ve $Q$ istendiği kadar yükseltilir:',
          math: '$$H_c(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 4(1 - K) \\omega_0 s + \\omega_0^2}$$\n$$b_1 = 4(1 - K) \\omega_0 \\implies Q = \\frac{\\omega_0}{4(1 - K)\\omega_0} = \\frac{1}{4(1 - K)}$$\n$$K = 1 - \\frac{1}{4Q} \\quad (0 \\le K < 1.0)$$\n$$\\text{Geri Besleme Ağı: } K < 1 \\text{ olduğundan op-amp çıkışından gerilim bölücü ile } K = \\frac{R_B}{R_A + R_B} \\text{ sağlanır.}$$',
          expl: `
            • <strong>$K = 1 - 1/(4Q)$ (Bootstrapping Kazancı):</strong> Op-amp çıkışından köprü orta düğümüne pozitif voltaj basılarak $Q$ değeri $0.25$'ten $5 \\dots 50$ seviyesine yükseltilir.<br>
            • <strong>$K < 1.0$ (Direnç Bölücüsü):</strong> Kazanç 1'den küçük olduğundan op-amp çıkışına referans $R_A = 10\\text{ k}\\Omega$ direnciyle basit bir pasif bölücü ($K = R_B / (R_A + R_B)$) bağlanır.
          `
        },
        {
          stepNum: 'Adım 4',
          title: 'Bainter Biquad ile Ayrık Çentik Frekanslarının (ωz ≠ ω0) Sentezi',
          desc: 'Eliptik veya Ters Chebyshev bant söndüren filtrelerde iletim sıfırı $\\omega_z$, kutup rezonans frekansı $\\omega_0$\'dan farklıdır. Simetrik Twin-Tee sadece $\\omega_z = \\omega_0$ durumunu karşılayabildiğinden, $\\omega_z \\neq \\omega_0$ katları için 3 op-amp\'lı Bainter biquad topolojisi kullanılır:',
          math: '$$H_c(s) = \\frac{s^2 + \\omega_z^2}{s^2 + \\frac{\\omega_0}{Q} s + \\omega_0^2}$$\n$$\\omega_z = \\sqrt{\\frac{R_6}{R_5}} \\cdot \\omega_0, \\quad Q = \\frac{R_1}{R_2}$$\n$$\\text{Bainter devresi ile } \\omega_z, \\omega_0 \\text{ ve } Q \\text{ birbirini etkilemeden bağımsız ayarlanabilir.}$$',
          expl: `
            • <strong>$\\omega_z \\ne \\omega_0$:</strong> Sıfır frekansı ile kutup frekansı farklı olduğunda Bainter biquad topolojisi tercih edilir.<br>
            • <strong>Bağımsız Ayar:</strong> $\\omega_z$, $\\omega_0$ ve $Q$ parametreleri birbirinden bağımsız direnç oranlarıyla ayarlanabilir.
          `
        }
      ],
      examples: [
        {
          id: 'ex4_4',
          badge: 'Örnek 4.4 (Kitap Sayfa 112-114) - Chebyshev 6. Derece BS Aktif Devre',
          title: 'Chebyshev 6. Derece Bant Söndüren (Notch) Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 666.67\\text{ Hz}, f_{\\text{p2}} = 1500\\text{ Hz}, f_{\\text{s1}} = 909.09\\text{ Hz}, f_{\\text{s2}} = 1100\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -40.0\\text{ dB}, C = 10\\text{ nF}, R_{\\text{out}} = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Geometrik Merkez Frekansı, Bant Genişlikleri ve Derece ($N=6$)',
              desc: 'Tasarımın ilk adımı geometrik simetrinin doğrulanmasıdır: $f_0 = \\sqrt{f_{p1} f_{p2}} = \\sqrt{666.67 \\times 1500} = 1000.0\\text{ Hz} \\implies \\omega_0 = 2\\pi(1000) = 6283.185\\text{ rad/s}$. Durdurma frekanslarının simetrisi: $\\sqrt{f_{s1} f_{s2}} = \\sqrt{909.09 \\times 1100} = 1000.0\\text{ Hz} = f_0$ (tam simetrik). Geçirme bant genişliği $BW = 2\\pi(1500 - 666.67) = 5236.0\\text{ rad/s}$. Durdurma bant genişliği $BW_s = 2\\pi(1100 - 909.09) = 1199.52\\text{ rad/s}$. Normalize durdurma frekansı $\\Omega_r = \\frac{BW}{BW_s} = \\frac{833.33}{190.91} = 4.365$. Chebyshev parametreleri: $a_{\\text{pass}} = -1.0\\text{ dB} \\implies \\epsilon = 0.50885$, $a_{\\text{stop}} = -40.0\\text{ dB} \\implies \\epsilon_s = 99.995$. Prototip derecesi $n_{\\text{LP}} \\ge \\frac{\\cosh^{-1}(99.995/0.50885)}{\\cosh^{-1}(4.365)} = 2.78 \\implies n = 3$. Bant söndüren filtre derecesi $N_{\\text{BS}} = 2 \\times 3 = 6$ (3 adet 2. derece kuadratik biquad katı):',
              math: '$$\\mathbf{Kat\\ 1\\ (LP\\ 1.\\ Derece\\ Reel\\ Kutuptan\\ Gelen\\ Biquad):}$$\n$$H_1(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 10563.8 s + \\omega_0^2} = \\frac{s^2 + 3.94784 \\times 10^7}{s^2 + 10563.8 s + 3.94784 \\times 10^7}$$\n$$\\omega_{0,1} = 6283.19\\text{ rad/s} \\; (f_{0,1} = 1000\\text{ Hz}), \\quad Q_1 = \\frac{6283.19}{10563.8} = 0.5948$$\n\n$$\\mathbf{Kat\\ 2\\ (LP\\ Karmaşık\\ Kutup\\ Çifti\\ 1):}$$\n$$H_2(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 1386.4 s + 2.768 \\times 10^7}$$\n$$\\omega_{0,2} = \\sqrt{2.768 \\times 10^7} = 5261.2\\text{ rad/s} \\; (f_{0,2} = 837.3\\text{ Hz}), \\quad Q_2 = \\frac{5261.2}{1386.4} = 3.80$$\n\n$$\\mathbf{Kat\\ 3\\ (LP\\ Karmaşık\\ Kutup\\ Çifti\\ 2):}$$\n$$H_3(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 3942.1 s + 5.628 \\times 10^7}$$\n$$\\omega_{0,3} = \\sqrt{5.628 \\times 10^7} = 7502.0\\text{ rad/s} \\; (f_{0,3} = 1194.0\\text{ Hz}), \\quad Q_3 = \\frac{7502.0}{3942.1} = 1.90$$',
              expl: `
                • <strong>Geometrik Merkez ($f_0 = 1000.0\\text{ Hz}$):</strong> $\\sqrt{666.67 \\times 1500} = 1000\\text{ Hz}$. Durdurma simetrisi $\\sqrt{909.09 \\times 1100} = 1000\\text{ Hz}$. Filtre tam simetriktir.<br>
                • <strong>Ortak Sıfır ($\omega_0 = 6283.19\\text{ rad/s}$):</strong> Her 3 katın payında da $s^2 + \\omega_0^2$ terimi yer alır; böylece $1000\\text{ Hz}$'de tam çentik oluşur.<br>
                • <strong>3 Kuadratik Biquad ($N=6$):</strong> $n=3$ alçak geçiren prototipten türetilen 3 adet aktif biquad katıdır ($Q_1=0.595, Q_2=3.80, Q_3=1.90$).
              `
            },
            {
              stepTitle: 'Adım 2: Simetrik Twin-Tee Köprü Elemanlarının Hesaplanması ($C = 10\\text{ nF}$)',
              desc: 'Tüm katların payındaki çentik sıfırı $f_0 = 1000\\text{ Hz}$\'dir. Baz kondansatör $C = 10\\text{ nF} = 10^{-8}\\text{ F}$ seçildiğinde simetrik Twin-Tee köprü direnç ve kapasitansları hesaplanır:',
              math: '$$R = \\frac{1}{2\\pi f_0 C} = \\frac{1}{2\\pi \\times 1000 \\times 10^{-8}} = 15915.5\\ \\Omega = 15.915\\text{ k}\\Omega$$\n$$R_1 = R_2 = R = 15.915\\text{ k}\\Omega, \\quad R_3 = \\frac{R}{2} = \\frac{15.915\\text{ k}\\Omega}{2} = 7.958\\text{ k}\\Omega$$\n$$C_1 = C_2 = C = 10\\text{ nF}, \\quad C_3 = 2C = 20\\text{ nF}$$\n$$\\text{Köprü Simetrisi Kuralı: } R_1 = R_2 = R, \\; R_3 = R/2, \\; C_1 = C_2 = C, \\; C_3 = 2C \\text{ şartı rezonansta } -\\infty\\text{ dB sağlar.}$$',
              expl: `
                • <strong>$R = 15.915\\text{ k}\\Omega$:</strong> $1000\\text{ Hz}$ ve $10\\text{ nF}$ için köprü direnci değeridir.<br>
                • <strong>$R_3 = R/2 = 7.958\\text{ k}\\Omega$:</strong> Alt köprünün orta direnci tam olarak $R$'nin yarısıdır.<br>
                • <strong>$C_3 = 2C = 20\\text{ nF}$:</strong> Üst köprünün orta kondansatörü tam olarak $2C$'dir (iki adet $10\\text{ nF}$ paralel bağlanarak kurulur).
              `
            },
            {
              stepTitle: 'Adım 3: Aktif Geri Besleme (Bootstrapping) Kazançları ($K_m$)',
              desc: 'Her katın paydasındaki $Q$ değerini oluşturmak için op-amp çıkışından Twin-Tee orta düğümüne pozitif geri besleme katsayısı $K = 1 - \\frac{1}{4Q}$ uygulanır. $K < 1.0$ olduğundan op-amp çıkışına referans direnci $R_A = 10\\text{ k}\\Omega$ olan bir gerilim bölücü ($K = \\frac{R_B}{R_A + R_B} \\implies R_B = \\frac{K}{1 - K} R_A$) bağlanır:',
              math: '$$\\mathbf{Kat\\ 1\\ (Q_1 = 0.5948):}$$\n$$K_1 = 1 - \\frac{1}{4(0.5948)} = 1 - 0.4203 = 0.5797 \\approx 0.580$$\n$$R_{B,1} = \\frac{0.5797}{1 - 0.5797} \\times 10\\text{ k}\\Omega = \\frac{0.5797}{0.4203} \\times 10\\text{ k}\\Omega = 13.792\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 2\\ (Q_2 = 3.80):}$$\n$$K_2 = 1 - \\frac{1}{4(3.80)} = 1 - 0.0658 = 0.9342$$\n$$R_{B,2} = \\frac{0.9342}{1 - 0.9342} \\times 10\\text{ k}\\Omega = \\frac{0.9342}{0.0658} \\times 10\\text{ k}\\Omega = 141.976\\text{ k}\\Omega$$\n\n$$\\mathbf{Kat\\ 3\\ (Q_3 = 1.90):}$$\n$$K_3 = 1 - \\frac{1}{4(1.90)} = 1 - 0.1316 = 0.8684$$\n$$R_{B,3} = \\frac{0.8684}{1 - 0.8684} \\times 10\\text{ k}\\Omega = \\frac{0.8684}{0.1316} \\times 10\\text{ k}\\Omega = 65.988\\text{ k}\\Omega$$',
              expl: `
                • <strong>Kat 1 ($Q_1=0.595$):</strong> $K_1 = 0.580 \\implies R_{B,1} = 13.79\\text{ k}\\Omega$.<br>
                • <strong>Kat 2 ($Q_2=3.80$):</strong> $K_2 = 0.934 \\implies R_{B,2} = 141.98\\text{ k}\\Omega$.<br>
                • <strong>Kat 3 ($Q_3=1.90$):</strong> $K_3 = 0.868 \\implies R_{B,3} = 65.99\\text{ k}\\Omega$.<br>
                • <strong>Gerekçe:</strong> $Q$ arttıkça $K$ değeri $1.0$'a yaklaşır ve geribesleme direnci $R_B$ büyür.
              `
            },
            {
              stepTitle: 'Adım 4: Standart E24 Bileşen Seçimi ve Pratik İpuçları',
              desc: 'Laboratuvar ve endüstriyel üretimde kullanılacak en yakın E24 standart değerleri seçilir:',
              math: '$$\\text{Köprü Dirençleri: } R = 16\\text{ k}\\Omega \\; (\\text{veya } \\%1\\text{ metal film } 15.8\\text{ k}\\Omega), \\quad R/2 = 8.2\\text{ k}\\Omega \\; (\\text{veya } 7.87\\text{ k}\\Omega)$$\n$$\\text{Köprü Kondansatörleri: } C = 10\\text{ nF}, \\quad 2C = 20\\text{ nF} \\; (\\text{2 adet } 10\\text{ nF paralel}) \\; \\checkmark$$\n$$\\text{Geri Besleme Dirençleri: } R_{B,1} = 13\\text{ k}\\Omega \\text{ veya } 15\\text{ k}\\Omega, \\quad R_{B,2} = 150\\text{ k}\\Omega, \\quad R_{B,3} = 68\\text{ k}\\Omega$$\n$$\\text{Çıkış Bölücüsü: } R_x = 24\\text{ k}\\Omega, \\quad R_y = 18\\text{ k}\\Omega \\quad (R_{\\text{out}} \\approx 10.3\\text{ k}\\Omega)$$',
              expl: `
                • <strong>E24 Seçimleri:</strong> $R = 16\\text{ k}\\Omega$, $R/2 = 8.2\\text{ k}\\Omega$, $C = 10\\text{ nF}$, $2C = 20\\text{ nF}$ (paralel iki adet $10\\text{ nF}$).<br>
                • <strong>Geri Besleme E24:</strong> $R_{B,1} = 15\\text{ k}\\Omega, R_{B,2} = 150\\text{ k}\\Omega, R_{B,3} = 68\\text{ k}\\Omega$. Çıkış bölücüsü $R_x = 24\\text{ k}\\Omega, R_y = 18\\text{ k}\\Omega$.
              `
            }
          ]
        }
      ],
      pros: [
        'Merkez frekansta teorik olarak sonsuz derinlikte ($-\\infty\\text{ dB}$) keskin bir çentik oluşturur.',
        '50 Hz veya 60 Hz şebeke vızıltısını, biyomedikal (EKG/EMG) ve ses cihazlarında komşu frekansları bozmadan tamamen yok eder.'
      ],
      cons: [
        'Pasif eleman eşleşmesine karşı hassastır; $R_3$ ve $C_3$ değerlerindeki %1\'lik bir tolerans hatası çentik derinliğini azaltabilir (%1 toleranslı metal film ve %2 polistiren/polipropilen kondansatör önerilir).'
      ]
    }
  };

  let overlayEl = null;
  let bodyEl = null;
  let closeBtn = null;
  let tabButtons = [];
  let currentKey = 'sk_lp';

  function init() {
    overlayEl = document.getElementById('circuitModalOverlay');
    bodyEl = document.getElementById('circuitModalBody');
    closeBtn = document.getElementById('closeCircuitModalBtn');
    tabButtons = document.querySelectorAll('[data-circuit-tab]');

    if (closeBtn) {
      closeBtn.addEventListener('click', close);
    }

    if (overlayEl) {
      overlayEl.addEventListener('click', (e) => {
        if (e.target === overlayEl) close();
      });
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-circuit-tab');
        if (key && CIRCUIT_DATA[key]) {
          currentKey = key;
          updateActiveTab(key);
          renderContent(CIRCUIT_DATA[key]);
        }
      });
    });

    // Delegate click events on document for all [data-open-circuit-modal] buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-circuit-modal]');
      if (btn) {
        const key = btn.getAttribute('data-open-circuit-modal');
        if (key && CIRCUIT_DATA[key]) {
          open(key);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlayEl && overlayEl.style.display !== 'none') {
        close();
      }
    });
  }

  function updateActiveTab(key) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-circuit-tab') === key);
    });
  }

  function open(key = 'sk_lp') {
    if (!overlayEl || !bodyEl) init();
    if (!overlayEl || !bodyEl) return;
    currentKey = CIRCUIT_DATA[key] ? key : 'sk_lp';
    updateActiveTab(currentKey);
    renderContent(CIRCUIT_DATA[currentKey]);
    overlayEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  function renderContent(data) {
    if (!bodyEl) return;

    let stepsHtml = '';
    data.steps.forEach(s => {
      stepsHtml += `
        <div style="background: #fff; border: 1px solid var(--border); border-left: 4px solid ${data.color}; border-radius: var(--radius-sm); padding: 16px 18px; margin-bottom: 14px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span class="stage-badge" style="background: ${data.color}; color: #fff; font-weight: 700; font-size: 12px;">${s.stepNum}</span>
            <strong style="font-size: 14.5px; color: var(--text-h);">${s.title}</strong>
          </div>
          <p style="font-size: 13.5px; line-height: 1.55; color: var(--muted); margin: 0 0 10px;">${s.desc}</p>
          <div class="math-block" style="background: #fafaf9; padding: 12px 16px; border-radius: 6px; overflow-x: auto; margin: 0; font-size: 16px !important;">
            ${s.math}
          </div>
          ${s.expl ? `
            <div style="margin-top: 10px; padding: 12px 15px; background: rgba(61,90,254,0.04); border-left: 3px solid ${data.color}; border-radius: 4px; font-size: 13px; line-height: 1.6; color: var(--text);">
              <div style="font-weight: 700; color: ${data.color}; font-size: 12.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span>💡</span> Formüldeki Terimlerin Anlamı, Birimleri ve Gerekçesi
              </div>
              <div>${s.expl}</div>
            </div>
          ` : ''}
        </div>
      `;
    });

    let examplesHtml = '';
    if (data.examples && data.examples.length > 0) {
      data.examples.forEach(ex => {
        let stepsInnerHtml = '';
        ex.solutionSteps.forEach(st => {
          stepsInnerHtml += `
            <div style="background: #fafaf9; border-left: 4px solid ${data.color}; border-radius: 6px; padding: 14px 16px; margin-bottom: 12px; border: 1px solid var(--border); border-left-color: ${data.color};">
              <div style="margin-bottom: 6px;">
                <strong style="color: ${data.color}; font-size: 14px; font-weight: 700;">${st.stepTitle}</strong>
              </div>
              <p style="font-size: 13.5px; line-height: 1.55; color: var(--text); margin: 0 0 8px;">${st.desc}</p>
              <div class="math-block" style="background: #fff; padding: 12px 16px; border-radius: 6px; margin: 0; overflow-x: auto; font-size: 16px !important; border: 1px solid rgba(0,0,0,0.06);">
                ${st.math}
              </div>
              ${st.expl ? `
                <div style="margin-top: 10px; padding: 12px 15px; background: #fff; border: 1px dashed var(--border); border-left: 3px solid ${data.color}; border-radius: 6px; font-size: 13px; line-height: 1.6; color: var(--text);">
                  <div style="font-weight: 700; color: ${data.color}; font-size: 12.5px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>📌</span> Adım Analizi, Sayısal İkame & Sınav Gerekçesi
                  </div>
                  <div>${st.expl}</div>
                </div>
              ` : ''}
            </div>
          `;
        });

        examplesHtml += `
          <div style="background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px 20px; margin-bottom: 18px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed var(--border);">
              <div>
                <span class="stage-badge" style="background: rgba(61,90,254,0.08); color: ${data.color}; font-weight: 700; font-size: 12px;">${ex.badge}</span>
                <h4 style="margin: 6px 0 3px; font-size: 16px; font-weight: 700; color: var(--text-h);">${ex.title}</h4>
                <div style="font-size: 13px; color: var(--muted); font-weight: 500;">${ex.specs}</div>
              </div>
              <button type="button" class="btn btn-sm btn-outline" data-load-modal-ex="${ex.id}" style="color: ${data.color}; border-color: ${data.color}; font-size: 12px; font-weight: 600; padding: 6px 12px; cursor: pointer;">
                🚀 Bu Örneği Tasarımcıya Yükle
              </button>
            </div>
            <div style="margin-top: 10px;">
              ${stepsInnerHtml}
            </div>
          </div>
        `;
      });
    }

    let prosHtml = '';
    data.pros.forEach(p => {
      prosHtml += `<li style="margin-bottom: 5px; color: #2f9e6e;">✓ ${p}</li>`;
    });

    let consHtml = '';
    data.cons.forEach(c => {
      consHtml += `<li style="margin-bottom: 5px; color: #eb5757;">✗ ${c}</li>`;
    });

    bodyEl.innerHTML = `
      <div class="type-detail-body">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
          <div>
            <span class="stage-badge" style="background: rgba(61,90,254,0.08); color: ${data.color};">${data.badge}</span>
            <h3 style="font-size: 20px; font-weight: 700; color: var(--text-h); margin: 6px 0 4px;">${data.title}</h3>
            <p style="font-size: 13.5px; color: var(--muted); margin: 0;">${data.summary}</p>
          </div>
          <button class="btn btn-primary" id="btnApplyCircuitToDesigner" style="background: ${data.color}; border-color: ${data.color}; flex-shrink: 0;">
            🚀 Bu Devreyi Tasarımcıda Başlat
          </button>
        </div>

        <!-- Row 1: Dual SVG (Schematic Diagram & Stage Response) -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>📐 Devre Şeması ve Düğüm Bağlantıları</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgMag}
            </div>
          </div>

          <div class="type-detail-section">
            <h4>📊 Kat Frekans Büyüklük Yanıtı (|H(jω)|)</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgPoles}
            </div>
          </div>
        </div>

        <!-- Row 2: Step-by-Step Mathematical Circuit Design Procedure -->
        <div class="type-detail-section">
          <h4>📐 Adım Adım Analitik Aktif Devre Tasarım Algoritması ve Tüm Katsayı Formülleri (Bölüm 4)</h4>
          <div style="margin-top: 10px;">
            ${stepsHtml}
          </div>
        </div>

        <!-- Row 3: Step-by-Step Textbook Numerical Examples -->
        <div class="type-detail-section">
          <h4>📚 Kitaptaki Adım Adım Sayısal Çözüm Örnekleri (Bölüm 4)</h4>
          <p style="font-size: 13px; color: var(--muted); margin: 0 0 12px;">Les Thede'in "Practical Analog and Digital Filter Design" kitabında yer alan sayısal aktif devre tasarımı örnekleri, yukarıdaki kurallar ve devre formülleri adım adım uygulanarak çözülmüştür:</p>
          <div style="margin-top: 10px;">
            ${examplesHtml}
          </div>
        </div>

        <!-- Row 4: Pros, Cons & Practical Engineering Guidelines -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>🌟 Avantajları ve Pratik Tasarım Kolaylıkları</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${prosHtml}
            </ul>
          </div>

          <div class="type-detail-section">
            <h4>⚠️ Dikkat Edilmesi Gereken Kısıtlar ve Op-Amp Seçimi</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${consHtml}
            </ul>
          </div>
        </div>

      </div>
    `;

    // Hook CTA Button to apply filter type in designer
    const applyBtn = document.getElementById('btnApplyCircuitToDesigner');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        close();
        if (window.FilterStudio && typeof window.FilterStudio.setFilterType === 'function') {
          window.FilterStudio.setFilterType(data.typeKey);
        } else {
          window.location.hash = '#/designer';
        }
      });
    }

    // Hook example buttons [data-load-modal-ex]
    bodyEl.querySelectorAll('[data-load-modal-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-load-modal-ex');
        close();
        if (typeof BookExamples !== 'undefined' && window.FilterStudio && typeof window.FilterStudio.loadExample === 'function') {
          const targetEx = BookExamples.find(e => e.id === exId);
          if (targetEx) window.FilterStudio.loadExample(targetEx);
        }
      });
    });

    // Render KaTeX in the modal
    if (window.renderMathInElement) {
      window.renderMathInElement(bodyEl, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  return {
    init,
    open,
    close
  };
})();

// Attach explicitly to window for browser global access
if (typeof window !== 'undefined') {
  window.FilterCircuitModal = FilterCircuitModal;
}

if (typeof module !== 'undefined') module.exports = FilterCircuitModal;
