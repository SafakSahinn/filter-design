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
          title: 'KCL Düğüm Denklemlerinin Türetimi (Denklem 4.1 - 4.9)',
          desc: 'Devrede $V_A$ ve $V_B$ iç düğümlerine Kirchhoff Akım Kanunu (KCL) uygulanır. Op-amp giriş akımı sıfır ve evirmeyen kazanç $V_{\\text{out}} = K \\cdot V_B$ olduğundan devre transfer fonksiyonu elde edilir:',
          math: '$$V_A \\text{ Düğümü: } \\frac{V_{\\text{in}} - V_A}{R_1} = \\frac{V_A - V_B}{R_2} + \\frac{V_A - V_{\\text{out}}}{1/(sC_1)}$$\n$$V_B \\text{ Düğümü: } \\frac{V_A - V_B}{R_2} = \\frac{V_B}{1/(sC_2)} = s C_2 V_B \\implies V_A = V_B (1 + s R_2 C_2)$$\n$$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{\\frac{K}{R_1 R_2 C_1 C_2}}{s^2 + s\\left[ \\frac{1}{R_1 C_1} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_2 C_2} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Eşit Elemanlı (Equal-Component) Sallen-Key Katsayı Eşleme Bağıntıları (Denklem 4.10 - 4.13)',
          desc: 'Standart üretim kolaylığı için $C_1 = C_2 = C$ ve $R_1 = R_2 = R$ seçilir. Hedef fonksiyon $H_a(s) = \\frac{b_2}{s^2 + b_1 s + b_2}$ ile katsayı eşlemesi yapılır:',
          math: '$$\\frac{1}{R^2 C^2} = b_2 \\implies R = \\frac{1}{C \\sqrt{b_2}}$$\n$$\\frac{3 - K}{RC} = b_1 \\implies K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad Q = \\frac{\\sqrt{b_2}}{b_1} = \\frac{1}{3 - K}$$\n$$K = 1 + \\frac{R_B}{R_A} \\implies R_B = (K - 1) R_A \\quad (R_A = 10\\text{ k}\\Omega \\text{ standart alınır})$$'
        },
        {
          stepNum: 'Adım 3',
          title: '1. Derece Pasif RC ve Tampon (Buffer) Katı (Denklem 4.19 - 4.21)',
          desc: 'Tek dereceli filtrelerde ($n=1, 3, 5, \\dots$) gerçel kutup $s + b_2$ için 1. derece RC alçak geçiren katı ve ardından gerilim takipçi tampon op-amp ($K=1$) kullanılır:',
          math: '$$H_c(s) = \\frac{1/(RC)}{s + 1/(RC)} = \\frac{b_2}{s + b_2} \\implies R = \\frac{1}{b_2 C}, \\quad K = 1.0$$\n$$R_B = 0\\ \\Omega \\text{ (Jumper Tel)}, \\quad R_A = \\infty \\text{ (Bağlanmaz, Gerilim Takipçi)}$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Kaskad Toplam Kazanç (K_tot) ve Çıkış Gerilim Bölücüsü (Rx, Ry) (Denklem 4.36 - 4.40)',
          desc: 'Tüm katların toplam kazancı $K_{\\text{tot}} = \\prod K_m$ yükselir. Filtrenin toplam DC kazancını tam $1.0$\'a eşitlemek ve çıkış empedansını $R_{\\text{out}} = 10\\text{ k}\\Omega$ sabitinde tutmak için çıkışa pasif gerilim bölücü eklenir:',
          math: '$$K_{\\text{tot}} = \\prod_{m=1}^{M} K_m, \\quad G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}}$$\n$$R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}}, \\quad (R_x \\parallel R_y = R_{\\text{out}} = 10\\text{ k}\\Omega)$$'
        }
      ],
      examples: [
        {
          id: 'ex4_1',
          badge: 'Örnek 4.1 (Kitap Sayfa 101-104) - Butterworth 5. Derece LP Aktif Devre',
          title: 'Butterworth 5. Derece Alçak Geçiren Sallen-Key Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 1000\\text{ Hz}, f_{\\text{stop}} = 4000\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -50.0\\text{ dB}, C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Derece ve Transfer Fonksiyonu Katsayıları (Bölüm 2 & 3)',
              desc: '$\\Omega_r = 4.0$ için minimum derece $n=5$ bulunur. $\\omega_0 = 2\\pi(1000) = 6283.185\\text{ rad/s}$ ile ölçeklenen katsayılar:',
              math: '$$\\text{Kat 1 (1. Derece): } b_2 = 6283.19 \\implies H_1(s) = \\frac{6283.19}{s + 6283.19}$$\n$$\\text{Kat 2 (2. Derece): } b_{1,2} = 3883.22, \\quad b_{2,2} = 3.94784 \\times 10^7 \\implies \\sqrt{b_{2,2}} = 6283.19$$\n$$\\text{Kat 3 (2. Derece): } b_{1,3} = 10166.42, \\quad b_{2,3} = 3.94784 \\times 10^7 \\implies \\sqrt{b_{2,3}} = 6283.19$$'
            },
            {
              stepTitle: 'Adım 2: Kat Kat Bileşen Değerleri Hesabı (Denklem 4.10 - 4.21)',
              desc: 'Baz kondansatör $C = 10\\text{ nF} = 10^{-8}\\text{ F}$ ve $R_A = 10\\text{ k}\\Omega$ seçimi ile:',
              math: '$$\\text{Kat 1 (RC Tampon): } R_1 = \\frac{1}{b_2 C} = \\frac{1}{6283.19 \\times 10^{-8}} = 15.915\\text{ k}\\Omega, \\quad K_1 = 1.0$$\n$$\\text{Kat 2 (Sallen-Key LP): } R_{1,2} = R_{2,2} = \\frac{1}{C\\sqrt{b_{2,2}}} = 15.915\\text{ k}\\Omega$$\n$$K_2 = 3 - \\frac{b_{1,2}}{\\sqrt{b_{2,2}}} = 3 - \\frac{3883.22}{6283.19} = 2.382 \\implies R_{B,2} = (2.382 - 1) \\times 10\\text{ k}\\Omega = 13.820\\text{ k}\\Omega$$\n$$\\text{Kat 3 (Sallen-Key LP): } R_{1,3} = R_{2,3} = 15.915\\text{ k}\\Omega$$\n$$K_3 = 3 - \\frac{b_{1,3}}{\\sqrt{b_{2,3}}} = 3 - \\frac{10166.42}{6283.19} = 1.382 \\implies R_{B,3} = (1.382 - 1) \\times 10\\text{ k}\\Omega = 3.820\\text{ k}\\Omega$$'
            },
            {
              stepTitle: 'Adım 3: Kaskad Toplam Kazanç ve Gerilim Bölücüsü (Denklem 4.36 - 4.40)',
              desc: 'Toplam kazanç $K_{\\text{tot}} = 1.0 \\times 2.382 \\times 1.382 = 3.292$. Çıkış empedansı $R_{\\text{out}} = 10\\text{ k}\\Omega$ için gerilim bölücü:',
              math: '$$G_A = \\frac{K_{\\text{tot}}}{1.0} = 3.292$$\n$$R_x = G_A \\cdot R_{\\text{out}} = 3.292 \\times 10\\text{ k}\\Omega = 32.92\\text{ k}\\Omega$$\n$$R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}} = \\frac{3.292}{2.292} \\times 10\\text{ k}\\Omega = 14.36\\text{ k}\\Omega$$\n$$\\text{Standart E24 Değerleri: } R = 16\\text{ k}\\Omega, \\quad R_{B,2} = 13\\text{ k}\\Omega, \\quad R_{B,3} = 3.9\\text{ k}\\Omega, \\quad R_x = 33\\text{ k}\\Omega, \\quad R_y = 15\\text{ k}\\Omega$$'
            }
          ]
        },
        {
          id: 'ex4_5',
          badge: 'Örnek 4.5 (Kitap Sayfa 114-115) - Ters Chebyshev 5. Derece LP Aktif Devre',
          title: 'Ters Chebyshev 5. Derece Alçak Geçiren Devre Tasarımı (Sıfırlı Devre)',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 100\\text{ Hz}, f_{\\text{stop}} = 300\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -60.0\\text{ dB}, C = 100\\text{ nF}, R_A = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Normalize Olmayan Katsayılar ve İletim Sıfırları',
              desc: 'Ters Chebyshev durdurma bandında iki adet sonlu iletim sıfırı barındırır. 1 adet RC tampon katı ve 2 adet çentikli biquad katı gerektirir:',
              math: '$$\\text{Kat 1 (RC): } b_2 = 188.50 \\implies R_1 = \\frac{1}{b_2 C} = \\frac{1}{188.50 \\times 10^{-7}} = 53.05\\text{ k}\\Omega, \\quad K_1 = 1.0$$\n$$\\text{Kat 2: } \\omega_{z1} = 1916.3\\text{ rad/s} \\implies \\text{Pay: } s^2 + 3.672 \\times 10^6, \\quad b_{1,2} = 154.2, \\quad b_{2,2} = 3.125 \\times 10^5$$\n$$\\text{Kat 3: } \\omega_{z2} = 3122.8\\text{ rad/s} \\implies \\text{Pay: } s^2 + 9.752 \\times 10^6, \\quad b_{1,3} = 389.1, \\quad b_{2,3} = 6.421 \\times 10^5$$'
            },
            {
              stepTitle: 'Adım 2: Çentikli Aktif Biquad Sentezi ve Kazanç Dengelemesi',
              desc: 'Standart Sallen-Key tüm-kutuplu olduğundan, sonlu sıfır içeren katlar Twin-Tee çentikli biquad topolojisi ile sentezlenir:',
              math: '$$\\text{Kat 2 Çentik Direnci: } R_{T2} = \\frac{1}{\\omega_{z1} C} = 5.218\\text{ k}\\Omega, \\quad K_2 = 2 - \\frac{b_{1,2}}{2\\sqrt{b_{2,2}}} = 1.862$$\n$$\\text{Kat 3 Çentik Direnci: } R_{T3} = \\frac{1}{\\omega_{z2} C} = 3.202\\text{ k}\\Omega, \\quad K_3 = 2 - \\frac{b_{1,3}}{2\\sqrt{b_{2,3}}} = 1.757$$\n$$K_{\\text{tot}} = 1.0 \\times 1.862 \\times 1.757 = 3.272 \\implies R_x = 32.72\\text{ k}\\Omega, \\quad R_y = 14.40\\text{ k}\\Omega$$'
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
          math: '$$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{K s^2}{s^2 + s\\left[ \\frac{1}{R_2 C_2} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_1 C_1} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Eşit Elemanlı Yüksek Geçiren Katsayı Eşleme Bağıntıları (Denklem 4.16 - 4.18)',
          desc: '$C_1 = C_2 = C$ ve $R_1 = R_2 = R$ eşitliği uygulandığında, alçak geçiren ile kusursuz bir katsayı simetrisi sağlanır:',
          math: '$$R = \\frac{1}{C \\sqrt{b_2}}, \\quad K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A$$\n$$\\text{Paydaki } s^2 \\text{ terimi orijinde } (s=0) \\text{ çift sıfır yaratarak DC akımını tamamen engeller.}$$'
        },
        {
          stepNum: 'Adım 3',
          title: '1. Derece Yüksek Geçiren Katı (Tek Dereceli Filtreler)',
          desc: 'Tek dereceli HP filtrelerde ($n=1, 3, 5, \\dots$), seri kondansatör ve toprağa bağlı direnç ile tampon op-amp kullanılır:',
          math: '$$H_c(s) = \\frac{s}{s + 1/(RC)} = \\frac{s}{s + b_2} \\implies R = \\frac{1}{b_2 C}, \\quad K = 1.0$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Kazanç Dengeleme ve Gerilim Bölücüsü',
          desc: 'Yüksek frekans tepe kazancını $G_{\\text{hedef}}$ seviyesine kalibre etmek için son kat çıkışına $R_x, R_y$ eklenir:',
          math: '$$K_{\\text{tot}} = \\prod_{m=1}^{M} K_m, \\quad G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}}, \\quad R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} R_{\\text{out}}$$'
        }
      ],
      examples: [
        {
          id: 'ex4_2',
          badge: 'Örnek 4.2 (Kitap Sayfa 104-106) - Chebyshev 4. Derece HP Aktif Devre',
          title: 'Chebyshev 4. Derece Yüksek Geçiren Sallen-Key Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{pass}} = 1000\\text{ Hz}, f_{\\text{stop}} = 400\\text{ Hz}, a_{\\text{pass}} = -0.5\\text{ dB}, a_{\\text{stop}} = -30.0\\text{ dB}, C = 10\\text{ nF}, R_A = 10\\text{ k}\\Omega$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: HP Transfer Fonksiyonu Katsayıları (Bölüm 3 Denklem 3.17)',
              desc: '$\\Omega_{rH} = 2.50$ için Chebyshev $n=4$ çift dereceli filtre bulunur. $f_0 = 1000\\text{ Hz}$ ile HP biquad katsayıları:',
              math: '$$\\text{Kat 1: } b_{1,1} = 1125.7, \\quad b_{2,1} = 4.148 \\times 10^7 \\implies \\sqrt{b_{2,1}} = 6440.5\\text{ rad/s}$$\n$$\\text{Kat 2: } b_{1,2} = 4655.8, \\quad b_{2,2} = 1.258 \\times 10^8 \\implies \\sqrt{b_{2,2}} = 11216.1\\text{ rad/s}$$'
            },
            {
              stepTitle: 'Adım 2: Sallen-Key HP Kat Bileşen Değerleri (Denklem 4.16 - 4.18)',
              desc: '$C = 10\\text{ nF}$ ve $R_A = 10\\text{ k}\\Omega$ seçimi ile:',
              math: '$$\\text{Kat 1: } R_{1,1} = R_{2,1} = \\frac{1}{C\\sqrt{b_{2,1}}} = \\frac{1}{10^{-8} \\times 6440.5} = 15.527\\text{ k}\\Omega$$\n$$K_1 = 3 - \\frac{1125.7}{6440.5} = 2.825 \\implies R_{B,1} = (2.825 - 1) \\times 10\\text{ k}\\Omega = 18.252\\text{ k}\\Omega$$\n$$\\text{Kat 2: } R_{1,2} = R_{2,2} = \\frac{1}{C\\sqrt{b_{2,2}}} = \\frac{1}{10^{-8} \\times 11216.1} = 8.916\\text{ k}\\Omega$$\n$$K_2 = 3 - \\frac{4655.8}{11216.1} = 2.585 \\implies R_{B,2} = (2.585 - 1) \\times 10\\text{ k}\\Omega = 15.849\\text{ k}\\Omega$$'
            },
            {
              stepTitle: 'Adım 3: Kazanç Dengeleme Gerilim Bölücüsü (Denklem 4.36 - 4.40)',
              desc: 'Toplam kazanç $K_{\\text{tot}} = 2.825 \\times 2.585 = 7.303$. Çıkış empedansı $R_{\\text{out}} = 10\\text{ k}\\Omega$ için gerilim bölücü:',
              math: '$$G_A = \\frac{7.303}{10^{0.05(-0.5)}} = \\frac{7.303}{0.944} = 7.736 \\implies R_x = 44.57\\text{ k}\\Omega, \\quad R_y = 12.89\\text{ k}\\Omega$$\n$$\\text{Standart E24: } R_1 = 16\\text{ k}\\Omega, \\quad R_{B,1} = 18\\text{ k}\\Omega, \\quad R_2 = 9.1\\text{ k}\\Omega, \\quad R_{B,2} = 16\\text{ k}\\Omega, \\quad R_x = 43\\text{ k}\\Omega, \\quad R_y = 13\\text{ k}\\Omega$$'
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
          math: '$$H_c(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2} = \\frac{G_0 \\cdot \\frac{\\omega_0}{Q} s}{s^2 + \\frac{\\omega_0}{Q} s + \\omega_0^2}$$\n$$\\omega_0 = \\sqrt{b_2}, \\quad Q = \\frac{\\sqrt{b_2}}{b_1}, \\quad BW = \\frac{\\omega_0}{Q} = b_1$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Bileşen Değerleri ve Katsayı Eşleme Bağıntıları (Denklem 4.25 - 4.29)',
          desc: '$C_1 = C_2 = C$ eşit kondansatör seçimi ile dirençler rezonans frekansı ve $Q$ faktörüne göre hesaplanır:',
          math: '$$R_1 = \\frac{Q}{G_0 \\omega_0 C}, \\quad R_2 = \\frac{2Q}{\\omega_0 C}, \\quad R_3 = \\frac{Q}{(2Q^2 - G_0) \\omega_0 C}$$\n$$\\text{Multiple-Feedback (MFB) yapısında stabilite ve bileşen duyarlılığı çok yüksektir.}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Kaskad Bağlantı ve Ayrık Merkez Frekansları',
          desc: 'Her bir 2. derece katın rezonans frekansı ($\\omega_{0,m}$) ve $Q_m$ değeri farklıdır. Katlar ardışık bağlanarak toplam $2n$ dereceli bant yanıtı elde edilir:',
          math: '$$H(s) = \\prod_{m=1}^{n} H_m(s) = H_1(s) \\cdot H_2(s) \\cdots H_n(s)$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Kazanç Ayarı ve Çıkış Bölücüsü',
          desc: 'Kaskad katların merkez frekanstaki tepe kazançlarının çarpımı $G_{\\text{tot}}$ olur; çıkış gerilim bölücüsü ile $0\\text{ dB}$ ($1.0$) seviyesine çekilir:',
          math: '$$R_x = G_A \\cdot R_{\\text{out}}, \\quad R_y = \\frac{G_A}{G_A - 1} R_{\\text{out}}, \\quad G_A = G_{\\text{tot}}$$'
        }
      ],
      examples: [
        {
          id: 'ex4_3',
          badge: 'Örnek 4.3 (Kitap Sayfa 107-111) - Butterworth 6. Derece BP Aktif Devre',
          title: 'Butterworth 6. Derece Bant Geçiren Aktif Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 1000\\text{ Hz}, f_{\\text{p2}} = 2000\\text{ Hz}, f_{\\text{s1}} = 500\\text{ Hz}, f_{\\text{s2}} = 4000\\text{ Hz}, a_{\\text{pass}} = -1.5\\text{ dB}, a_{\\text{stop}} = -28.0\\text{ dB}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Frekansı, Derece ve Biquad Katları (Denklem 3.20 - 3.39)',
              desc: '$f_0 = \\sqrt{1000 \\times 2000} = 1414.2\\text{ Hz} \\implies \\omega_0 = 8885.8\\text{ rad/s}, BW = 6283.2\\text{ rad/s}$. $n_{\\text{LP}}=3 \\implies N_{\\text{BP}}=6$ (3 adet biquad katı):',
              math: '$$\\text{Kat 1 (Merkez Kat): } \\omega_{0,1} = 8885.8\\text{ rad/s}, \\quad Q_1 = 1.414$$\n$$\\text{Kat 2 (Alt Frekans Katı): } \\omega_{0,2} = 6542.1\\text{ rad/s}, \\quad Q_2 = 2.828$$\n$$\\text{Kat 3 (Üst Frekans Katı): } \\omega_{0,3} = 12068.5\\text{ rad/s}, \\quad Q_3 = 2.828$$'
            },
            {
              stepTitle: 'Adım 2: Kat Kat Direnç ve Kondansatör Değerleri',
              desc: '$C = 10\\text{ nF}$ ve kat başına kazanç $G_0 = 2.0$ alınarak MFB/Sallen-Key bağıntıları ile:',
              math: '$$\\text{Kat 1: } R_1 = 7.958\\text{ k}\\Omega, \\quad R_2 = 31.83\\text{ k}\\Omega, \\quad R_3 = 10.61\\text{ k}\\Omega$$\n$$\\text{Kat 2: } R_1 = 21.61\\text{ k}\\Omega, \\quad R_2 = 86.45\\text{ k}\\Omega, \\quad R_3 = 3.09\\text{ k}\\Omega$$\n$$\\text{Kat 3: } R_1 = 11.72\\text{ k}\\Omega, \\quad R_2 = 46.86\\text{ k}\\Omega, \\quad R_3 = 1.67\\text{ k}\\Omega$$'
            },
            {
              stepTitle: 'Adım 3: Kazanç Kalibrasyonu ve Çıkış Gerilim Bölücüsü',
              desc: 'Üç katın kaskad kazancı tepe noktasında $G_{\\text{tot}} = 8.0$ olur. Çıkış $R_{\\text{out}} = 10\\text{ k}\\Omega$ direnç bölücüsü ile normalize edilir:',
              math: '$$G_A = 8.0 \\implies R_x = 8.0 \\times 10\\text{ k}\\Omega = 80\\text{ k}\\Omega, \\quad R_y = \\frac{8.0}{7.0} \\times 10\\text{ k}\\Omega = 11.43\\text{ k}\\Omega$$\n$$\\text{Standart E24: } R_x = 82\\text{ k}\\Omega, \\quad R_y = 11\\text{ k}\\Omega, \\quad C = 10\\text{ nF}$$'
            }
          ]
        },
        {
          id: 'ex4_6',
          badge: 'Örnek 4.6 (Kitap Sayfa 115-117) - Eliptik 6. Derece BP Aktif Devre',
          title: 'Eliptik 6. Derece Bant Geçiren Aktif Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 250\\text{ Hz}, f_{\\text{p2}} = 400\\text{ Hz}, f_{\\text{s1}} = 100\\text{ Hz}, f_{\\text{s2}} = 1000\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -60.0\\text{ dB}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Eliptik Sıfırlar ve Kutupların Ayrıştırılması',
              desc: 'Filtre durdurma bandında çok dik geçiş için iletim sıfırları içerir. 3 adet kuadratik biquad katı oluşturulur:',
              math: '$$f_0 = \\sqrt{250 \\times 400} = 316.23\\text{ Hz} \\implies \\omega_0 = 1986.9\\text{ rad/s}, \\quad BW = 2\\pi(150) = 942.5\\text{ rad/s}$$\n$$\\text{İletim Sıfırları: } \\omega_{z1} = 785.4\\text{ rad/s}, \\quad \\omega_{z2} = 5026.5\\text{ rad/s}$$'
            },
            {
              stepTitle: 'Adım 2: Devre Gerçekleştirmesi ve Çentikli Katların Sentezi',
              desc: '$C = 10\\text{ nF}$ ile sıfır içeren katlar için Bainter veya Twin-Tee biquad katları kullanılır:',
              math: '$$\\text{Kat 1 (Rezonans): } \\omega_{0,1} = 1986.9\\text{ rad/s}, \\quad Q_1 = 3.52$$\n$$\\text{Kat 2 (Alt Çentikli Kat): } \\omega_{z1} = 785.4\\text{ rad/s}, \\quad \\omega_{0,2} = 1620.4\\text{ rad/s}$$\n$$\\text{Kat 3 (Üst Çentikli Kat): } \\omega_{z2} = 5026.5\\text{ rad/s}, \\quad \\omega_{0,3} = 2436.1\\text{ rad/s}$$\n$$R_x = 35.6\\text{ k}\\Omega, \\quad R_y = 13.9\\text{ k}\\Omega$$'
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
          desc: 'Twin-Tee devresi paralel iki T köprüsünden oluşur. Üst R-C-R köprüsü alçak frekansları, alt C-R-C köprüsü yüksek frekansları iletir. Rezonans frekansı $f_0$\'da iki yol tam $180^\\circ$ faz farkı ile birbirini yok eder:',
          math: '$$f_0 = \\frac{1}{2\\pi R C} \\quad \\Longleftrightarrow \\quad \\omega_0 = \\frac{1}{RC}$$\n$$H_{\\text{passive}}(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 4\\omega_0 s + \\omega_0^2} \\implies Q = 0.25 \\text{ (Çok geniş)}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Simetrik Twin-Tee Bileşen Bağıntıları (Denklem 4.32)',
          desc: 'Tam faz iptali ve derin çentik için köprü elemanları kusursuz simetrik seçilmelidir:',
          math: '$$R_1 = R_2 = R, \\quad R_3 = \\frac{R}{2}$$\n$$C_1 = C_2 = C, \\quad C_3 = 2C$$\n$$R = \\frac{1}{2\\pi f_0 C} = \\frac{1}{\\omega_0 C}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Aktif Geri Besleme ile Seçicilik (Q) ve Kazanç Ayarı (Denklem 4.33 - 4.35)',
          desc: 'Pasif devrenin $Q=0.25$ olan düşük seçiciliğini artırmak için op-amp tamponunun çıkışından orta düğüme pozitif geri besleme ($K$) uygulanır:',
          math: '$$H_c(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 4(1 - K) \\omega_0 s + \\omega_0^2}$$\n$$Q = \\frac{1}{4(1 - K)} \\implies K = 1 - \\frac{1}{4Q} \\quad (\\text{veya } K = 2 - \\frac{1}{2Q})$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Bainter Biquad ile Ayrık Çentik Frekanslarının (ωz ≠ ω0) Sentezi',
          desc: 'Eliptik veya Ters Chebyshev filtrelerde iletim sıfırı $\\omega_z$, kutup frekansı $\\omega_0$\'dan farklıdır. Bu durumda 3 op-amp\'lı Bainter biquad topolojisi kullanılır.',
          math: '$$H_c(s) = \\frac{s^2 + \\omega_z^2}{s^2 + \\frac{\\omega_0}{Q} s + \\omega_0^2}, \\quad \\omega_z = \\sqrt{\\frac{R_6}{R_5}} \\omega_0$$'
        }
      ],
      examples: [
        {
          id: 'ex4_4',
          badge: 'Örnek 4.4 (Kitap Sayfa 112-114) - Chebyshev 6. Derece BS Aktif Devre',
          title: 'Chebyshev 6. Derece Bant Söndüren (Notch) Devre Tasarımı',
          specs: 'Spesifikasyonlar: $f_{\\text{p1}} = 666.67\\text{ Hz}, f_{\\text{p2}} = 1500\\text{ Hz}, f_{\\text{s1}} = 909.09\\text{ Hz}, f_{\\text{s2}} = 1100\\text{ Hz}, a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -40.0\\text{ dB}, C = 10\\text{ nF}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Çentik Frekansı ve Biquad Katları (Denklem 3.40)',
              desc: '$f_0 = \\sqrt{666.67 \\times 1500} = 1000\\text{ Hz} \\implies \\omega_0 = 6283.185\\text{ rad/s}$. $N_{\\text{BS}}=6$ için her biri $1000\\text{ Hz}$ çentik sıfırına sahip 3 adet kuadratik kat gereklidir:',
              math: '$$\\text{Kat 1 (1. Derece Prototip): } H_0(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 10563.8 s + \\omega_0^2}, \\quad Q_1 = 0.595$$\n$$\\text{Kat 2: } H_1(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 1386.4 s + 2.768 \\times 10^7}, \\quad Q_2 = 3.80$$\n$$\\text{Kat 3: } H_2(s) = \\frac{s^2 + \\omega_0^2}{s^2 + 3942.1 s + 5.628 \\times 10^7}, \\quad Q_3 = 1.90$$'
            },
            {
              stepTitle: 'Adım 2: Twin-Tee Köprü Elemanlarının Hesaplanması (Denklem 4.30 - 4.35)',
              desc: 'Baz kondansatör $C = 10\\text{ nF}$ ve merkez frekans $f_0 = 1000\\text{ Hz}$ için:',
              math: '$$R = \\frac{1}{2\\pi f_0 C} = \\frac{1}{2\\pi \\times 1000 \\times 10^{-8}} = 15.915\\text{ k}\\Omega$$\n$$R_1 = R_2 = R = 15.915\\text{ k}\\Omega, \\quad R_3 = \\frac{R}{2} = 7.958\\text{ k}\\Omega$$\n$$C_1 = C_2 = C = 10\\text{ nF}, \\quad C_3 = 2C = 20\\text{ nF}$$\n$$K_1 = 1 - \\frac{1}{4(0.595)} = 0.580 \\implies R_{B1} = (0.580 - 1) R_{A1} \\text{ (Gerilim bölücü ile)}$$'
            },
            {
              stepTitle: 'Adım 3: Kazanç Kalibrasyonu ve Standart Değerler',
              desc: 'Çıkış gerilim bölücüsü ve standart E24 değerleri:',
              math: '$$R = 16\\text{ k}\\Omega, \\quad R/2 = 8.2\\text{ k}\\Omega, \\quad C = 10\\text{ nF}, \\quad 2C = 22\\text{ nF}$$\n$$R_x = 24\\text{ k}\\Omega, \\quad R_y = 18\\text{ k}\\Omega$$'
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
