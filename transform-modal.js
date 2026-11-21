/**
 * FilterDesign Studio - Frequency Transformations Modal Module (Chapter 3)
 * Detailed mathematical derivations, formulas, SVG diagrams, pole-zero mappings,
 * and step-by-step algorithms for LP to LP, LP to HP, LP to BP, and LP to BS transformations.
 * Based on Les Thede - "Practical Analog and Digital Filter Design" (Chapter 3).
 */

const FilterTransformModal = (() => {
  const TRANSFORM_DATA = {
    lp_to_lp: {
      id: 'lp_to_lp',
      typeKey: 'lowpass',
      title: 'Alçak Geçiren Filtre Ölçeklemesi (LP to LP Dönüşümü)',
      badge: 'Bölüm 3.1 & Kitap Denklem 3.1 - 3.13',
      color: '#3d5afe',
      summary: 'Normalize prototipin (Ω = 1 rad/s), gerçek kesim frekansı ω₀ = 2πf₀ ile frekans ekseninde ölçeklenmesi ve 1. ile 2. derece kuadratik transfer fonksiyonu katsayılarının türetilmesi.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <!-- Prototype curve (dashed gray, cut at 1 rad/s) -->
          <path d="M 50,60 C 90,60 110,65 125,85 C 145,115 170,145 200,155 C 230,160 260,163 280,165" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4,4" />
          <text x="125" y="45" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#9ca3af">Normalize Prototip (Ω=1)</text>

          <!-- Scaling arrow -->
          <path d="M 140,85 C 180,85 200,85 240,85" fill="none" stroke="#3d5afe" stroke-width="1.8" marker-end="url(#arrowBlue)" />
          <text x="190" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">× ω₀ Ölçekleme</text>

          <!-- Scaled unnormalized curve (bold blue) -->
          <path d="M 50,60 C 180,60 230,65 260,85 C 290,110 340,140 380,150 C 405,155 420,160 430,163" fill="none" stroke="#3d5afe" stroke-width="3" />
          
          <line x1="260" y1="25" x2="260" y2="170" stroke="#3d5afe" stroke-width="1.2" stroke-dasharray="2,2" />
          <text x="260" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#3d5afe">ω₀ = 2π f_pass (rad/s)</text>
          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#3d5afe">-a_pass</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Prototype circle (R = 25) -->
          <circle cx="130" cy="105" r="28" fill="none" stroke="#9ca3af" stroke-width="1.4" stroke-dasharray="3,3" />
          <text x="132" y="142" font-family="Inter, sans-serif" font-size="9" fill="#9ca3af">R = 1</text>

          <!-- Scaled circle (R = 75 = omega_0) -->
          <circle cx="130" cy="105" r="72" fill="none" stroke="#3d5afe" stroke-width="1.8" stroke-dasharray="4,4" />
          <text x="135" y="195" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">Yarıçap R = ω₀</text>

          <!-- Scaled poles on larger circle -->
          <text x="94" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <text x="58" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <text x="94" y="170" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <text x="40" y="85" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">p_k = ω₀ · P_k</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Normalize Frekans Oranı (Ω_rL) ve Derece Hesabı (Denklem 3.1 - 3.6)',
          desc: 'Filtre derecesi frekansların mutlak değerine değil, oranına bağlıdır. Normalize frekans oranı $\\Omega_{rL}$ ve derece bağıntıları tanımlanır:',
          math: '$$\\Omega_{rL} = \\frac{\\omega_{\\text{stop}}}{\\omega_{\\text{pass}}} = \\frac{f_{\\text{stop}}}{f_{\\text{pass}}} > 1$$\n$$n_B \\ge \\frac{\\log_{10}[(10^{-0.1 a_{\\text{stop}}} - 1)/(10^{-0.1 a_{\\text{pass}}} - 1)]}{2 \\log_{10}(\\Omega_{rL})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Frekans Ölçekleme Değişkeni Tanımı (Denklem 3.7)',
          desc: 'Normalize prototipteki Laplace değişkeni $S$, gerçek açısal frekans $\\omega_0 = 2\\pi f_0$ ile ölçeklenir. (Ters Chebyshev hariç tüm yaklaşımlarda $\\omega_0 = \\omega_{\\text{pass}}$, Ters Chebyshev\'de $\\omega_0 = \\omega_{\\text{stop}}$):',
          math: '$$S = \\frac{s}{\\omega_0} = \\frac{s}{2\\pi f_0} \\quad \\Longleftrightarrow \\quad s = S \\cdot \\omega_0$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Birinci Derece Faktörün Ölçeklenmesi (Denklem 3.8 - 3.9)',
          desc: 'Tek dereceli filtrelerdeki gerçel kutup $S + b_0$ faktörü yerine $S = s/\\omega_0$ konulup basitleştirilir:',
          math: '$$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = s/\\omega_0} \\frac{1}{\\frac{s}{\\omega_0} + b_0} = \\frac{\\omega_0}{s + b_0 \\omega_0} = \\frac{b_2}{s + b_2}, \\quad b_2 = b_0 \\cdot \\omega_0$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'İkinci Derece Faktörün Ölçeklenmesi ve Biquad Katsayıları (Denklem 3.10 - 3.13)',
          desc: 'İkinci derece genel kuadratik faktörün pay ve paydası $\\omega_0^2$ ile genişletilerek normalize olmayan $H(s)$ katsayıları elde edilir:',
          math: '$$H(S) = \\frac{A_2 S^2 + A_1 S + A_0}{S^2 + B_1 S + B_2} \\xrightarrow{S = s/\\omega_0} \\frac{a_2 s^2 + a_1 s + a_0}{s^2 + b_1 s + b_2}$$\n$$b_1 = B_1 \\cdot \\omega_0, \\quad b_2 = B_2 \\cdot \\omega_0^2$$\n$$a_2 = A_2, \\quad a_1 = A_1 \\cdot \\omega_0, \\quad a_0 = A_0 \\cdot \\omega_0^2$$'
        }
      ],
      examples: [
        {
          id: 'ex3_1',
          badge: 'Örnek 3.1 (Kitap Sayfa 68-69) - Ters Chebyshev Alçak Geçiren (rad/s)',
          title: 'Ölçeklenmiş 6. Derece Ters Chebyshev Alçak Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -0.25\\text{ dB}, a_{\\text{stop}} = -38.0\\text{ dB}, \\omega_{\\text{pass}} = 600\\text{ rad/s}, \\omega_{\\text{stop}} = 1000\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Frekans Oranı ve Minimum Derece (n) Hesabı (Denklem 3.1 - 3.6)',
              desc: 'Normalize frekans oranı $\\Omega_{rL}$ ve durdurma bandı zayıflamasını sağlayan Ters Chebyshev derece formülü:',
              math: '$$\\Omega_{rL} = \\frac{\\omega_{\\text{stop}}}{\\omega_{\\text{pass}}} = \\frac{1000}{600} = 1.6667$$\n$$n_I \\ge \\frac{\\cosh^{-1}\\left(\\sqrt{\\frac{10^{-0.1 a_{\\text{stop}}} - 1}{10^{-0.1 a_{\\text{pass}}} - 1}}\\right)}{\\cosh^{-1}(\\Omega_{rL})} = \\frac{\\cosh^{-1}\\left(\\sqrt{\\frac{10^{3.8} - 1}{10^{0.025} - 1}}\\right)}{\\cosh^{-1}(1.6667)} = \\frac{\\cosh^{-1}(327.94)}{\\cosh^{-1}(1.6667)} = \\frac{6.4859}{1.0986} = 5.90 \\implies n = 6$$'
            },
            {
              stepTitle: 'Adım 2: Normalize Ters Chebyshev Prototip Katsayıları (Bölüm 2 & Denklem 2.45 - 2.54)',
              desc: 'Ters Chebyshev yaklaşımında prototip $\\Omega = 1\\text{ rad/s}$ frekansı durdurma bandı başlangıcıdır ($\\omega_0 = \\omega_{\\text{stop}} = 1000\\text{ rad/s}$). $n=6$ prototip 3 adet biquad faktöründen oluşur:',
              math: '$$\\text{Kat 1 (Sıfır 1): } \\Omega_{z1} = 1.077217 \\implies A_{0,1} = \\Omega_{z1}^2 = 1.160397, \\quad B_{1,1} = 0.887019, \\quad B_{2,1} = 0.584950$$\n$$\\text{Kat 2 (Sıfır 2): } \\Omega_{z2} = 1.414214 \\implies A_{0,2} = \\Omega_{z2}^2 = 2.000000, \\quad B_{1,2} = 0.449735, \\quad B_{2,2} = 0.767420$$\n$$\\text{Kat 3 (Sıfır 3): } \\Omega_{z3} = 3.863703 \\implies A_{0,3} = \\Omega_{z3}^2 = 14.928203, \\quad B_{1,3} = 0.088612, \\quad B_{2,3} = 0.942732$$'
            },
            {
              stepTitle: 'Adım 3: Frekans Ölçekleme ve Denormalize Transfer Fonksiyonu (Denklem 3.10 - 3.13)',
              desc: 'Katsayılar $S = s / \\omega_0$ ($\\omega_0 = 1000\\text{ rad/s}$) dönüşümüyle ölçeklenir: $b_1 = B_1 \\omega_0, b_2 = B_2 \\omega_0^2, a_0 = A_0 \\omega_0^2$ ve kazanç $K = B_2 / A_0$:',
              math: '$$H_1(s) = \\frac{0.504095(s^2 + 1.160397 \\times 10^6)}{s^2 + 887.019 s + 584950}, \\quad H_2(s) = \\frac{0.383710(s^2 + 2.000000 \\times 10^6)}{s^2 + 449.735 s + 767420}$$\n$$H_3(s) = \\frac{0.063151(s^2 + 1.492820 \\times 10^7)}{s^2 + 88.612 s + 942732}$$\n$$H(s) = H_1(s) \\cdot H_2(s) \\cdot H_3(s)$$'
            }
          ]
        },
        {
          id: 'ex3_2',
          badge: 'Örnek 3.2 (Kitap Sayfa 69-70) - Butterworth Alçak Geçiren (Hz)',
          title: 'Ölçeklenmiş 5. Derece Butterworth Alçak Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -0.5\\text{ dB}, a_{\\text{stop}} = -21.0\\text{ dB}, f_{\\text{pass}} = 1000\\text{ Hz}, f_{\\text{stop}} = 2000\\text{ Hz}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Açısal Frekanslar, Frekans Oranı ve Derece Hesabı (Denklem 3.1 - 3.6)',
              desc: 'Frekans birimi Hertz (Hz) verildiğinden $\\omega = 2\\pi f$ dönüşümü uygulanır:',
              math: '$$\\omega_{\\text{pass}} = 2\\pi (1000) = 6283.185\\text{ rad/s}, \\quad \\omega_{\\text{stop}} = 2\\pi (2000) = 12566.371\\text{ rad/s}$$\n$$\\Omega_{rL} = \\frac{f_{\\text{stop}}}{f_{\\text{pass}}} = \\frac{2000}{1000} = 2.0$$\n$$n_B \\ge \\frac{\\log_{10}\\left(\\frac{10^{-0.1 a_{\\text{stop}}} - 1}{10^{-0.1 a_{\\text{pass}}} - 1}\\right)}{2\\log_{10}(\\Omega_{rL})} = \\frac{\\log_{10}\\left(\\frac{10^{2.1} - 1}{10^{0.05} - 1}\\right)}{2\\log_{10}(2.0)} = \\frac{\\log_{10}(1023.49)}{0.60206} = 5.00 \\implies n = 5$$'
            },
            {
              stepTitle: 'Adım 2: Normalize Butterworth Prototip Katsayıları (n = 5 Tek Derece)',
              desc: 'Bölüm 2 Denklem 2.15-2.22 ile $n=5$ için 1 adet 1. derece ve 2 adet 2. derece kutup faktörü belirlenir:',
              math: '$$\\text{1. Derece Faktör: } S + 1.0 \\implies b_0 = 1.0$$\n$$\\text{2. Derece Kat 1: } S^2 + 0.618034 S + 1.0 \\implies B_{1,1} = 0.618034, \\quad B_{2,1} = 1.0$$\n$$\\text{2. Derece Kat 2: } S^2 + 1.618034 S + 1.0 \\implies B_{1,2} = 1.618034, \\quad B_{2,2} = 1.0$$'
            },
            {
              stepTitle: 'Adım 3: Frekans Ölçekleme ve Denormalize Katsayılar (Denklem 3.8 - 3.13)',
              desc: 'Butterworth filtresinde kesim frekansı $\\omega_0 = \\omega_{\\text{pass}} = 6283.185\\text{ rad/s}$ alınır. $\\omega_0^2 = 3.947842 \\times 10^7$:',
              math: '$$\\text{1. Derece Kat: } H_0(s) = \\frac{b_2}{s + b_2} = \\frac{6283.185}{s + 6283.185}$$\n$$\\text{Kat 1: } b_{1,1} = B_{1,1} \\omega_0 = 3883.22, \\quad b_{2,1} = \\omega_0^2 = 3.947842 \\times 10^7 \\implies H_1(s) = \\frac{3.947842 \\times 10^7}{s^2 + 3883.22 s + 3.947842 \\times 10^7}$$\n$$\\text{Kat 2: } b_{1,2} = B_{1,2} \\omega_0 = 10166.42, \\quad b_{2,2} = \\omega_0^2 = 3.947842 \\times 10^7 \\implies H_2(s) = \\frac{3.947842 \\times 10^7}{s^2 + 10166.42 s + 3.947842 \\times 10^7}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        }
      ],
      pros: [
        'En sade ve doğrudan frekans dönüşümüdür; kutup sayısı veya filtre derecesi değişmez ($n \\to n$).',
        'Tüm-kutuplu (Butterworth, Chebyshev) filtrelerde pay daima sabit kalır: $a_2 = 0, a_1 = 0, a_0 = b_2$.',
        'Sallen-Key ve Multiple-Feedback (MFB) devrelerine doğrudan katsayı eşleme ile aktarılabilir.'
      ],
      cons: [
        'Ters Chebyshev ve Eliptik filtrelerde paydaki sonlu iletim sıfırları da $\\omega_{z} = \\Omega_z \\cdot \\omega_0$ ile ölçeklenir; biquad çentik devreleri gerektirir.'
      ]
    },

    lp_to_hp: {
      id: 'lp_to_hp',
      typeKey: 'highpass',
      title: 'Yüksek Geçiren Filtre Dönüşümü (LP to HP Dönüşümü)',
      badge: 'Bölüm 3.2 & Kitap Denklem 3.14 - 3.18',
      color: '#ef4444',
      summary: 'Frekans ekseninin terslenmesi (inversion: S = ω₀ / s) ile alçak frekansları söndüren, yüksek frekansları geçiren ve orijinde (s = 0) iletim sıfırları oluşturan dönüşüm.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <!-- Highpass curve (bold red) -->
          <path d="M 50,166 C 100,164 140,158 170,148 C 210,135 240,105 260,85 C 290,65 340,60 430,60" fill="none" stroke="#ef4444" stroke-width="3" />

          <line x1="170" y1="25" x2="170" y2="170" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="260" y1="25" x2="260" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />

          <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">f_stop</text>
          <text x="260" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">f_pass (ω₀)</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="44" y="152" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

          <text x="340" y="80" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#ef4444">Geçirme Bandı (HP)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Inverted poles -->
          <text x="80" y="65" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <text x="65" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <text x="80" y="155" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>

          <!-- Zeros at origin s = 0 (double zeros) -->
          <circle cx="130" cy="105" r="5" fill="none" stroke="#ef4444" stroke-width="2" />
          <circle cx="130" cy="105" r="9" fill="none" stroke="#ef4444" stroke-width="1.4" />
          <text x="145" y="98" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#ef4444">s=0 (n adet sıfır)</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Yüksek Geçiren Frekans Oranı (Ω_rH) (Denklem 3.14)',
          desc: 'Yüksek geçiren filtrede geçirme frekansı durdurma frekansından büyüktür ($f_{\\text{pass}} > f_{\\text{stop}}$). Frekans oranı ters orantılı olarak tanımlanır:',
          math: '$$\\Omega_{rH} = \\frac{\\omega_{\\text{pass}}}{\\omega_{\\text{stop}}} = \\frac{f_{\\text{pass}}}{f_{\\text{stop}}} > 1$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Frekans Evirme Değişkeni (Frequency Inversion) (Denklem 3.15)',
          desc: 'Normalize prototipteki $S$ değişkeni yerine frekansı eviren $\\omega_0 / s$ yerleştirilir:',
          math: '$$S = \\frac{\\omega_0}{s} = \\frac{2\\pi f_0}{s} \\quad \\Longleftrightarrow \\quad s = \\frac{\\omega_0}{S}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Birinci Derece Faktörün HP Dönüşümü (Denklem 3.16)',
          desc: '$S = \\omega_0 / s$ konularak pay ve payda $s$ ile çarpılır; payda orijinde bir sıfır ($s$) doğar:',
          math: '$$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = \\omega_0/s} \\frac{1}{\\frac{\\omega_0}{s} + b_0} = \\frac{s}{b_0 s + \\omega_0} = \\frac{s}{s + b_2}, \\quad b_2 = \\frac{\\omega_0}{b_0}$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'İkinci Derece Kuadratik Faktörün HP Dönüşümü (Denklem 3.17 - 3.18)',
          desc: 'İkinci derece faktörün pay ve paydası $s^2 / B_2$ ile çarpılarak normalize form $s^2 + b_1 s + b_2$ elde edilir:',
          math: '$$H(S) = \\frac{B_2}{S^2 + B_1 S + B_2} \\xrightarrow{S = \\omega_0 / s} \\frac{s^2}{s^2 + b_1 s + b_2}$$\n$$b_1 = \\frac{B_1 \\omega_0}{B_2}, \\quad b_2 = \\frac{\\omega_0^2}{B_2}$$\n$$\\text{Genel Durum: } a_1 = \\frac{A_1 \\omega_0}{A_2}, \\quad a_2 = \\frac{A_0 \\omega_0^2}{A_2}, \\quad \\text{Kazanç Çarpanı} = \\frac{A_2}{B_2}$$'
        }
      ],
      examples: [
        {
          id: 'ex3_3',
          badge: 'Örnek 3.3 (Kitap Sayfa 72-73) - Eliptik Yüksek Geçiren (rad/s)',
          title: 'Ölçeklenmiş 5. Derece Eliptik Yüksek Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -0.5\\text{ dB}, a_{\\text{stop}} = -45.0\\text{ dB}, \\omega_{\\text{pass}} = 3000\\text{ rad/s}, \\omega_{\\text{stop}} = 2000\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Yüksek Geçiren Frekans Oranı ve Eliptik Derece Hesabı (Denklem 3.14)',
              desc: 'Yüksek geçiren filtrede $\\omega_{\\text{pass}} > \\omega_{\\text{stop}}$ olduğundan oran $\\Omega_{rH} = \\omega_{\\text{pass}} / \\omega_{\\text{stop}}$ olarak hesaplanır:',
              math: '$$\\Omega_{rH} = \\frac{\\omega_{\\text{pass}}}{\\omega_{\\text{stop}}} = \\frac{3000}{2000} = 1.50$$\n$$r_t = \\frac{1}{\\Omega_{rH}} = 0.666667, \\quad k_n = \\frac{\\sqrt{10^{0.05} - 1}}{\\sqrt{10^{4.5} - 1}} = 0.001964$$\n$$n_E \\ge \\frac{K(0.6667) \\cdot K(\\sqrt{1 - k_n^2})}{K(\\sqrt{1 - 0.6667^2}) \\cdot K(k_n)} = 4.38 \\implies n = 5 \\text{ (Tek Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Normalize Eliptik Prototip Katsayıları (n = 5)',
              desc: '1 adet reel kutup ve 2 adet sıfırlı kuadratik kutup çifti:',
              math: '$$\\text{1. Derece: } S + 0.443048 \\implies b_0 = 0.443048$$\n$$\\text{Kat 1: } \\Omega_{z1} = 1.564778 \\implies A_{0,1} = 2.448529, \\quad B_{1,1} = 0.134062, \\quad B_{2,1} = 0.945864$$\n$$\\text{Kat 2: } \\Omega_{z2} = 2.457805 \\implies A_{0,2} = 6.040807, \\quad B_{1,2} = 0.490800, \\quad B_{2,2} = 0.584988$$'
            },
            {
              stepTitle: 'Adım 3: Yüksek Geçiren Frekans Evirme Dönüşümü (Denklem 3.15 - 3.18)',
              desc: 'Prototip $S = \\omega_0 / s$ ($\\omega_0 = 3000\\text{ rad/s}, \\omega_0^2 = 9 \\times 10^6$) dönüşümü uygulanır:',
              math: '$$\\text{1. Derece Kat: } b_2 = \\frac{\\omega_0}{b_0} = \\frac{3000}{0.443048} = 6771.27 \\implies H_0(s) = \\frac{s}{s + 6771.27}$$\n$$\\text{Kat 1: } b_{1,1} = \\frac{B_{1,1} \\omega_0}{B_{2,1}} = 425.21, \\quad b_{2,1} = \\frac{\\omega_0^2}{B_{2,1}} = 9.51511 \\times 10^6, \\quad a_{0,1} = \\frac{\\omega_0^2}{A_{0,1}} = 3.67568 \\times 10^6$$\n$$H_1(s) = 0.38630 \\cdot \\frac{s^2 + 3.67568 \\times 10^6}{s^2 + 425.21 s + 9.51511 \\times 10^6}$$\n$$\\text{Kat 2: } b_{1,2} = \\frac{B_{1,2} \\omega_0}{B_{2,2}} = 2516.97, \\quad b_{2,2} = \\frac{\\omega_0^2}{B_{2,2}} = 1.53849 \\times 10^7, \\quad a_{0,2} = \\frac{\\omega_0^2}{A_{0,2}} = 1.48987 \\times 10^6$$\n$$H_2(s) = 0.09684 \\cdot \\frac{s^2 + 1.48987 \\times 10^6}{s^2 + 2516.97 s + 1.53849 \\times 10^7}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        },
        {
          id: 'ex3_4',
          badge: 'Örnek 3.4 (Kitap Sayfa 73-74) - Chebyshev Yüksek Geçiren (Hz)',
          title: 'Ölçeklenmiş 4. Derece Chebyshev Yüksek Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.5\\text{ dB}, a_{\\text{stop}} = -40.0\\text{ dB}, f_{\\text{pass}} = 2000\\text{ Hz}, f_{\\text{stop}} = 800\\text{ Hz}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Açısal Frekanslar ve Chebyshev Derece Hesabı (Denklem 3.14)',
              desc: 'Geçirme ve durdurma frekansları Hertz cinsinden oranlanarak derece bulunur:',
              math: '$$\\omega_{\\text{pass}} = 2\\pi (2000) = 12566.371\\text{ rad/s}, \\quad \\omega_{\\text{stop}} = 2\\pi (800) = 5026.548\\text{ rad/s}$$\n$$\\Omega_{rH} = \\frac{f_{\\text{pass}}}{f_{\\text{stop}}} = \\frac{2000}{800} = 2.50$$\n$$n_C \\ge \\frac{\\cosh^{-1}\\left(\\sqrt{\\frac{10^{4.0} - 1}{10^{0.15} - 1}}\\right)}{\\cosh^{-1}(2.50)} = \\frac{\\cosh^{-1}(155.65)}{\\cosh^{-1}(2.50)} = \\frac{5.7408}{1.5668} = 3.66 \\implies n = 4 \\text{ (Çift Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Normalize Chebyshev Prototip Katsayıları (n = 4 Çift Derece)',
              desc: '$-1.5\\text{ dB}$ dalgalanma ($\\epsilon = 0.642300$) için prototip biquad katsayıları ve kazanç:',
              math: '$$\\text{Kat 1: } B_{1,1} = 0.198305, \\quad B_{2,1} = 0.985060$$\n$$\\text{Kat 2: } B_{1,2} = 0.478750, \\quad B_{2,2} = 0.282910$$\n$$\\text{Çift Derece Kazancı: } G_0 = 10^{0.05(-1.5)} = 0.841395$$'
            },
            {
              stepTitle: 'Adım 3: HP Biquad Katsayıları ve Nihai Transfer Fonksiyonu (Denklem 3.17 - 3.18)',
              desc: '$\\omega_0 = 12566.371\\text{ rad/s}, \\omega_0^2 = 1.579137 \\times 10^8$ ile katsayı formülleri $b_1 = B_1 \\omega_0 / B_2$, $b_2 = \\omega_0^2 / B_2$ uygulanır:',
              math: '$$\\text{Kat 1: } b_{1,1} = \\frac{0.198305 \\times 12566.37}{0.985060} = 2530.01, \\quad b_{2,1} = \\frac{1.579137 \\times 10^8}{0.985060} = 1.60309 \\times 10^8$$\n$$\\text{Kat 2: } b_{1,2} = \\frac{0.478750 \\times 12566.37}{0.282910} = 21267.06, \\quad b_{2,2} = \\frac{1.579137 \\times 10^8}{0.282910} = 5.58176 \\times 10^8$$\n$$H(s) = 0.841395 \\cdot \\frac{s^2}{s^2 + 2530.01 s + 1.60309 \\times 10^8} \\cdot \\frac{s^2}{s^2 + 21267.06 s + 5.58176 \\times 10^8}$$\n$$\\text{Payda 4 adet sıfır } (s^4) \\text{ orijindedir } (s = 0), \\text{ DC ve alt frekanslar tam engellenir.}$$'
            }
          ]
        }
      ],
      pros: [
        'Pay kısmındaki $s^2$ terimleri orijinde ($s=0$) çift sıfırlar yaratarak DC ve çok düşük frekanslı kaymaları (DC offset) tamamen engeller.',
        'Derece değişmez: $n$ dereceli LP prototipi, $n$ dereceli HP filtreye dönüşür.'
      ],
      cons: [
        'Katsayılar $B_2$ değerine bölündüğü için, prototip $B_2$ katsayısının küçük olduğu yüksek dereceli katlarda $b_2$ frekansı yukarı kayabilir.'
      ]
    },

    lp_to_bp: {
      id: 'lp_to_bp',
      typeKey: 'bandpass',
      title: 'Bant Geçiren Filtre Dönüşümü (LP to BP Dönüşümü)',
      badge: 'Bölüm 3.3 & Kitap Denklem 3.18 - 3.49',
      color: '#10b981',
      summary: 'Alçak geçiren prototipteki her kutbun merkez frekansı etrafında rezonans kutup çiftine çatallandığı, filtrenin derecesinin iki katına (n → 2n) çıktığı geometrik simetrik dönüşüm.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <!-- Bandpass symmetrical bell curve (bold emerald) -->
          <path d="M 50,165 C 100,163 150,155 180,135 C 205,110 220,70 240,60 C 260,70 275,110 300,135 C 330,155 380,163 430,165" fill="none" stroke="#10b981" stroke-width="3" />

          <line x1="205" y1="25" x2="205" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="240" y1="25" x2="240" y2="170" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,3" />
          <line x1="275" y1="25" x2="275" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />

          <text x="205" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#2f9e6e">f_p1</text>
          <text x="240" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#10b981">f₀</text>
          <text x="275" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#2f9e6e">f_p2</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="240" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#10b981">BW = f_p2 - f_p1</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Upper resonance pole cluster (+j omega_0) -->
          <circle cx="130" cy="55" r="24" fill="none" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,3" />
          <text x="130" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#10b981">×</text>
          <text x="115" y="62" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#10b981">×</text>
          <text x="160" y="58" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#10b981">+jω₀ Kümeleri</text>

          <!-- Lower resonance pole cluster (-j omega_0) -->
          <circle cx="130" cy="155" r="24" fill="none" stroke="#10b981" stroke-width="1.2" stroke-dasharray="3,3" />
          <text x="130" y="145" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#10b981">×</text>
          <text x="115" y="162" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#10b981">×</text>
          <text x="160" y="158" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#10b981">-jω₀ Kümeleri</text>

          <!-- Zeros at origin s = 0 (n zeros) -->
          <circle cx="130" cy="105" r="6" fill="none" stroke="#10b981" stroke-width="1.8" />
          <text x="142" y="102" font-family="Inter, sans-serif" font-size="9" font-weight="700" fill="#10b981">s=0 (n sıfır)</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Geometrik Merkez Frekansı ve Bant Genişliği (Denklem 3.20 - 3.21)',
          desc: 'Bant geçiren dönüşüm aritmetik değil, geometrik ortalamaya dayanır:',
          math: '$$\\omega_0 = \\sqrt{\\omega_{\\text{p1}} \\cdot \\omega_{\\text{p2}}} = 2\\pi \\sqrt{f_{\\text{p1}} f_{\\text{p2}}}$$\n$$BW = \\omega_{\\text{p2}} - \\omega_{\\text{p1}} = 2\\pi (f_{\\text{p2}} - f_{\\text{p1}})$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Geometrik Simetri Kontrolü ve Düzeltme Algoritması (Denklem 3.24)',
          desc: 'Tasarımın geçerli olması için durdurma bandı sınırları geometrik olarak $\\omega_0$ etrafında simetrik olmalıdır. Simetri testi:',
          math: '$$\\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}} = \\omega_0^2 \\quad \\Longleftrightarrow \\quad f_{\\text{s1}} \\cdot f_{\\text{s2}} = f_0^2$$\n$$\\text{Eğer } \\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}} > \\omega_0^2 \\implies \\omega_{\\text{s2}} = \\frac{\\omega_0^2}{\\omega_{\\text{s1}}} \\quad (\\text{Daha sıkı durdurma bandı})$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Frekans Oranı (Ω_rP) ve Derece İki Katlanması (Denklem 3.18 - 3.19)',
          desc: 'Bant geçiren frekans oranı $\\Omega_{rP}$ hesaplanır. LP prototip derecesi $n$ ise, nihai BP filtrenin derecesi $2n$ olur:',
          math: '$$\\Omega_{rP} = \\frac{\\omega_{\\text{s2}} - \\omega_{\\text{s1}}}{\\omega_{\\text{p2}} - \\omega_{\\text{p1}}} = \\frac{f_{\\text{s2}} - f_{\\text{s1}}}{f_{\\text{p2}} - f_{\\text{p1}}} > 1$$\n$$S = \\frac{s^2 + \\omega_0^2}{BW \\cdot s} \\implies \\text{Filtre Derecesi: } N_{\\text{BP}} = 2n$$'
        },
        {
          stepNum: 'Adım 4',
          title: '1. ve 2. Derece Faktörlerin Biquad Katlarına Ayrıştırılması (Denklem 3.25 - 3.49)',
          desc: '1. derece LP faktörü doğrudan 2. derece rezonans biquad\'ına dönüşür. 2. derece kuadratik LP faktörü ise 4. dereceye genişler ve iki adet gerçel katsayılı 2. derece biquad katına faktörize edilir:',
          math: '$$\\frac{1}{S + b_0} \\longrightarrow \\frac{(b_0 BW) s}{s^2 + (b_0 BW) s + \\omega_0^2}$$\n$$H_k(S) \\longrightarrow \\frac{a_{11} s}{s^2 + b_{11} s + b_{21}} \\cdot \\frac{a_{12} s}{s^2 + b_{12} s + b_{22}}$$'
        }
      ],
      examples: [
        {
          id: 'ex3_5',
          badge: 'Örnek 3.5 (Kitap Sayfa 79-80) - Butterworth Bant Geçiren (Hz)',
          title: 'Ölçeklenmiş 6. Derece Butterworth Bant Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -21.0\\text{ dB}, f_{\\text{p1}} = 300\\text{ Hz}, f_{\\text{p2}} = 3000\\text{ Hz}, f_{\\text{s1}} = 50\\text{ Hz}, f_{\\text{s2}} = 9000\\text{ Hz}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Frekansı, Bant Genişliği ve Simetri Kontrolü (Denklem 3.20 - 3.24)',
              desc: 'Geometrik merkez frekansı ve bant genişliği hesaplanır, simetri kontrolü yapılarak zayıf durdurma sınırı sıkılaştırılır:',
              math: '$$f_0 = \\sqrt{f_{\\text{p1}} \\cdot f_{\\text{p2}}} = \\sqrt{300 \\times 3000} = 948.683\\text{ Hz} \\implies \\omega_0 = 5960.785\\text{ rad/s}, \\quad \\omega_0^2 = 3.553096 \\times 10^7$$\n$$BW = 2\\pi (3000 - 300) = 2\\pi (2700) = 16964.60\\text{ rad/s}$$\n$$\\text{Simetri Kontrolü: } f_{\\text{s1}} \\cdot f_{\\text{s2}} = 50 \\times 9000 = 450000 < f_0^2 = 900000$$\n$$f_{\\text{s1,düzeltilmiş}} = \\frac{f_0^2}{f_{\\text{s2}}} = \\frac{900000}{9000} = 100\\text{ Hz} \\quad (\\text{Daha kısıtlayıcı sınır seçilir})$$'
            },
            {
              stepTitle: 'Adım 2: Frekans Oranı ve LP Prototip Derecesi (Denklem 3.18 - 3.19)',
              desc: 'Düzeltilmiş frekanslarla oran $\\Omega_{rP}$ hesaplanır; BP derecesi prototip derecesinin iki katıdır ($N_{\\text{BP}} = 2 n_{\\text{LP}}$):',
              math: '$$\\Omega_{rP} = \\frac{f_{\\text{s2}} - f_{\\text{s1}}}{f_{\\text{p2}} - f_{\\text{p1}}} = \\frac{9000 - 100}{3000 - 300} = \\frac{8900}{2700} = 3.2963$$\n$$n_{\\text{LP}} \\ge \\frac{\\log_{10}[(10^{2.1} - 1)/(10^{0.1} - 1)]}{2 \\log_{10}(3.2963)} = \\frac{2.6865}{1.0360} = 2.59 \\implies n_{\\text{LP}} = 3 \\implies N_{\\text{BP}} = 2 \\times 3 = 6$$'
            },
            {
              stepTitle: 'Adım 3: Biquad Katlarına Faktörizasyon ve Transfer Fonksiyonu (Denklem 3.25 - 3.39)',
              desc: '1. derece prototip $S+1$ doğrudan 2. derece rezonans biquad katına; 2. derece prototip $S^2+S+1$ ise 2 adet kuadratik biquad katına faktörize edilir:',
              math: '$$\\text{Kat 1 (1. Derece Prototip): } H_0(s) = \\frac{BW s}{s^2 + BW s + \\omega_0^2} = \\frac{16964.6 s}{s^2 + 16964.6 s + 3.5531 \\times 10^7}$$\n$$\\text{Kat 2 ve 3 (2. Derece Prototip): } C = 1 + \\frac{4\\omega_0^2}{BW^2} = 1 + \\frac{4(3.5531 \\times 10^7)}{(16964.6)^2} = 1.4938$$\n$$H_1(s) = \\frac{16964.6 s}{s^2 + 3757.24 s + 1.2599 \\times 10^7}, \\quad H_2(s) = \\frac{16964.6 s}{s^2 + 13207.36 s + 1.0022 \\times 10^8}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        },
        {
          id: 'ex3_6',
          badge: 'Örnek 3.6 (Kitap Sayfa 80-81) - Ters Chebyshev Bant Geçiren (Hz)',
          title: 'Ölçeklenmiş 6. Derece Ters Chebyshev Bant Geçiren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -0.5\\text{ dB}, a_{\\text{stop}} = -33.0\\text{ dB}, f_{\\text{p1}} = 100\\text{ Hz}, f_{\\text{p2}} = 200\\text{ Hz}, f_{\\text{s1}} = 50\\text{ Hz}, f_{\\text{s2}} = 400\\text{ Hz}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Frekansı, Bant Genişliği ve Doğal Geometrik Simetri',
              desc: 'Frekanslar kontrol edildiğinde tam geometrik simetri sağlandığı görülür:',
              math: '$$f_0 = \\sqrt{f_{\\text{p1}} \\cdot f_{\\text{p2}}} = \\sqrt{100 \\times 200} = 141.421\\text{ Hz} \\implies \\omega_0 = 888.577\\text{ rad/s}, \\quad \\omega_0^2 = 789569$$\n$$BW = 2\\pi (200 - 100) = 2\\pi (100) = 628.319\\text{ rad/s}$$\n$$\\text{Simetri Testi: } f_{\\text{s1}} \\cdot f_{\\text{s2}} = 50 \\times 400 = 20000 = f_0^2 = 141.421^2 = 20000 \\quad (\\text{Simetri tamdır, düzeltme gerekmez})$$'
            },
            {
              stepTitle: 'Adım 2: Frekans Oranı ve Prototip Derecesi Hesabı',
              desc: 'Oran $\\Omega_{rP}$ ve Ters Chebyshev derece formülü:',
              math: '$$\\Omega_{rP} = \\frac{400 - 50}{200 - 100} = 3.50$$\n$$n_I \\ge \\frac{\\cosh^{-1}\\left(\\sqrt{\\frac{10^{3.3}-1}{10^{0.05}-1}}\\right)}{\\cosh^{-1}(3.50)} = \\frac{\\cosh^{-1}(127.67)}{1.9248} = \\frac{5.5422}{1.9248} = 2.88 \\implies n_{\\text{LP}} = 3 \\implies N_{\\text{BP}} = 6$$'
            },
            {
              stepTitle: 'Adım 3: İletim Sıfırları ve Nihai Biquad Katları',
              desc: 'Prototipteki $\\Omega_z = 1.1547$ iletim sıfırı, BP dönüşümüyle $\\omega_0$\'ın sağına ve soluna iki adet simetrik çentik sıfırına dönüşür:',
              math: '$$\\omega_{z1} = 566.25\\text{ rad/s} \\implies s^2 + 3.2064 \\times 10^5, \\quad \\omega_{z2} = 1394.38\\text{ rad/s} \\implies s^2 + 1.9443 \\times 10^6$$\n$$\\text{Kat 1 (Rezonans): } H_0(s) = \\frac{789.28 s}{s^2 + 789.28 s + 789569}$$\n$$\\text{Kat 2 (Alt Çentikli Kat): } H_1(s) = \\frac{0.3739 (s^2 + 3.2064 \\times 10^5)}{s^2 + 185.34 s + 3.9245 \\times 10^5}$$\n$$\\text{Kat 3 (Üst Çentikli Kat): } H_2(s) = \\frac{0.3739 (s^2 + 1.9443 \\times 10^6)}{s^2 + 342.12 s + 1.5882 \\times 10^6}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        }
      ],
      pros: [
        'Hem alçak hem de yüksek frekansları aynı anda filtreler; telekomünikasyon, ses işleme ve radyo alıcılarında temel bloktur.',
        'Her bir kutup çifti bağımsız bir aktif biquad katı (Multiple-Feedback veya Delyiannis-Friend) ile kolayca gerçeklenir.'
      ],
      cons: [
        'Filtre derecesi iki katına ($2n$) çıktığından gereken op-amp ve RC bileşen sayısı iki kat artar.',
        'Dar bantlı ($Q = f_0 / BW \\gg 10$) tasarımlarda bileşen duyarlılığı artar.'
      ]
    },

    lp_to_bs: {
      id: 'lp_to_bs',
      typeKey: 'bandstop',
      title: 'Bant Söndüren / Çentik Dönüşümü (LP to BS Dönüşümü)',
      badge: 'Bölüm 3.4 & Kitap Denklem 3.40 - 3.52',
      color: '#8b5cf6',
      summary: 'Belirli bir frekans bandını ve özellikle rezonans çentik frekansını (ω₀ = 2πf₀) sonsuz zayıflamayla söndüren, s = ±jω₀ sanal eksen iletim sıfırlarına sahip dönüşüm.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <!-- Bandstop deep notch curve (bold purple) -->
          <path d="M 50,60 C 120,60 170,63 190,75 C 215,95 230,150 240,168 C 250,150 265,95 290,75 C 310,63 360,60 430,60" fill="none" stroke="#8b5cf6" stroke-width="3" />

          <line x1="240" y1="25" x2="240" y2="170" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3,3" />
          <line x1="190" y1="25" x2="190" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="290" y1="25" x2="290" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />

          <text x="190" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#2f9e6e">f_p1</text>
          <text x="240" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#8b5cf6">f₀ (Çentik)</text>
          <text x="290" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#2f9e6e">f_p2</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="240" y="45" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#8b5cf6">-∞ dB Çentik (Notch)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Transmission Zeros on imaginary axis: ±j omega_0 -->
          <circle cx="130" cy="50" r="6" fill="#fff" stroke="#8b5cf6" stroke-width="2.2" />
          <circle cx="130" cy="160" r="6" fill="#fff" stroke="#8b5cf6" stroke-width="2.2" />
          <text x="142" y="53" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#8b5cf6">+jω₀ Sıfırı</text>
          <text x="142" y="163" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#8b5cf6">-jω₀ Sıfırı</text>

          <!-- Poles around zeros -->
          <text x="100" y="50" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#8b5cf6">×</text>
          <text x="100" y="70" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#8b5cf6">×</text>
          <text x="100" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#8b5cf6">×</text>
          <text x="100" y="170" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#8b5cf6">×</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Çentik Frekansı ve Söndürme Bant Genişliği (Denklem 3.40)',
          desc: 'Bant söndüren filtre, bant geçiren dönüşümünün cebirsel tersidir (inversion):',
          math: '$$\\omega_0 = \\sqrt{\\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}}}, \\quad BW = \\omega_{\\text{p2}} - \\omega_{\\text{p1}}$$\n$$S = \\frac{BW \\cdot s}{s^2 + \\omega_0^2}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Sanal Eksen İletim Sıfırları (Transmission Zeros)',
          desc: '$s = \\pm j\\omega_0$ frekansında paydaki $s^2 + \\omega_0^2 = (j\\omega_0)^2 + \\omega_0^2 = 0$ olur. Bu frekansta kazanç kuramsal olarak tam sıfırdır ($-\\infty\\text{ dB}$ derin çentik).',
          math: '$$z_{1,2} = \\pm j \\omega_0 = \\pm j 2\\pi f_0$$'
        },
        {
          stepNum: 'Adım 3',
          title: '1. Derece Faktörün BS Biquad\'ına Dönüşümü (Denklem 3.41)',
          desc: 'Tek dereceli LP prototipindeki $1/(S + b_0)$ terimi, doğrudan bir 2. derece çentik devresine dönüşür:',
          math: '$$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = \\frac{BW s}{s^2+\\omega_0^2}} \\frac{s^2 + \\omega_0^2}{s^2 + \\frac{BW}{b_0} s + \\omega_0^2}$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'İkinci Derece Faktörün İki Biquad Çentik Katına Ayrıştırılması (Denklem 3.42 - 3.52)',
          desc: 'Her kuadratik faktör, biri $\\omega_0$\'ın hemen altında, diğeri hemen üzerinde iki adet ikinci derece çentik biquad katına faktörize edilir:',
          math: '$$H_k(s) = \\frac{s^2 + \\omega_0^2}{s^2 + b_{11} s + b_{21}} \\cdot \\frac{s^2 + \\omega_0^2}{s^2 + b_{12} s + b_{22}}$$'
        }
      ],
      examples: [
        {
          id: 'ex3_7',
          badge: 'Örnek 3.7 (Kitap Sayfa 85) - Chebyshev Bant Söndüren / Çentik (rad/s)',
          title: 'Ölçeklenmiş 6. Derece Chebyshev Bant Söndüren (Notch) Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -35.0\\text{ dB}, \\omega_{\\text{p1}} = 3000\\text{ rad/s}, \\omega_{\\text{p2}} = 24000\\text{ rad/s}, \\omega_{\\text{s1}} = 6000\\text{ rad/s}, \\omega_{\\text{s2}} = 12000\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Çentik Frekansı, Bant Genişliği ve Simetri Kontrolü (Denklem 3.40)',
              desc: 'Bant söndüren filtrede merkez çentik frekansı $\\omega_0$ ve geçirme bandı genişliği:',
              math: '$$\\omega_0 = \\sqrt{\\omega_{\\text{p1}} \\cdot \\omega_{\\text{p2}}} = \\sqrt{3000 \\times 24000} = 8485.281\\text{ rad/s} \\implies \\omega_0^2 = 7.200000 \\times 10^7\\text{ (rad/s)}^2$$\n$$BW = \\omega_{\\text{p2}} - \\omega_{\\text{p1}} = 24000 - 3000 = 21000\\text{ rad/s}$$\n$$\\text{Simetri Kontrolü: } \\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}} = 6000 \\times 12000 = 7.200000 \\times 10^7 = \\omega_0^2 \\quad (\\text{Geometrik simetri kusursuzdur})$$'
            },
            {
              stepTitle: 'Adım 2: Bant Söndüren Frekans Oranı ve LP Prototip Derecesi',
              desc: 'Bant söndüren oran $\\Omega_{rS} = BW / BW_{\\text{stop}}$ formülüyle hesaplanır:',
              math: '$$\\Omega_{rS} = \\frac{\\omega_{\\text{p2}} - \\omega_{\\text{p1}}}{\\omega_{\\text{s2}} - \\omega_{\\text{s1}}} = \\frac{21000}{12000 - 6000} = \\frac{21000}{6000} = 3.50$$\n$$n_C \\ge \\frac{\\cosh^{-1}\\left(\\sqrt{\\frac{10^{3.5}-1}{10^{0.1}-1}}\\right)}{\\cosh^{-1}(3.50)} = \\frac{\\cosh^{-1}(110.42)}{1.9248} = \\frac{5.3975}{1.9248} = 2.80 \\implies n_{\\text{LP}} = 3 \\implies N_{\\text{BS}} = 6$$'
            },
            {
              stepTitle: 'Adım 3: Çentik Sıfırları ($s^2 + \\omega_0^2$) ve Biquad Katları (Denklem 3.41 - 3.52)',
              desc: 'Her biquad katının payında rezonans frekansı $\\pm j\\omega_0$ olan çentik sıfırı yer alır:',
              math: '$$\\text{Kat 1 (1. Derece Prototip): } H_0(s) = \\frac{s^2 + \\omega_0^2}{s^2 + \\frac{BW}{b_0} s + \\omega_0^2} = \\frac{s^2 + 7.20 \\times 10^7}{s^2 + 42495.4 s + 7.20 \\times 10^7}$$\n$$\\text{Kat 2 (Alt Çentik Biquad): } H_1(s) = \\frac{s^2 + 7.20 \\times 10^7}{s^2 + 1047.8 s + 1.258 \\times 10^7}$$\n$$\\text{Kat 3 (Üst Çentik Biquad): } H_2(s) = \\frac{s^2 + 7.20 \\times 10^7}{s^2 + 5994.6 s + 4.120 \\times 10^8}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        },
        {
          id: 'ex3_8',
          badge: 'Örnek 3.8 (Kitap Sayfa 85-87) - Eliptik Bant Söndüren / 60 Hz Hum Çentik (Hz)',
          title: 'Ölçeklenmiş 6. Derece Eliptik Bant Söndüren Filtre',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -0.3\\text{ dB}, a_{\\text{stop}} = -50.0\\text{ dB}, f_{\\text{p1}} = 50\\text{ Hz}, f_{\\text{p2}} = 72\\text{ Hz}, f_{\\text{s1}} = 58\\text{ Hz}, f_{\\text{s2}} = 62\\text{ Hz}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Merkez Çentik Frekansı ve Simetri Düzeltmesi (Denklem 3.40)',
              desc: '60 Hz şebeke vızıltısını söndürmek için durdurma bandı sınırlarından merkez frekans belirlenir ve simetri düzeltilir:',
              math: '$$f_0 = \\sqrt{f_{\\text{s1}} \\cdot f_{\\text{s2}}} = \\sqrt{58 \\times 62} = 59.9667\\text{ Hz} \\implies \\omega_0 = 376.781\\text{ rad/s}, \\quad \\omega_0^2 = 141964$$\n$$\\text{Simetri Kontrolü: } f_{\\text{p1}} \\cdot f_{\\text{p2}} = 50 \\times 72 = 3600 > f_0^2 = 3596.0$$\n$$f_{\\text{p2,düzeltilmiş}} = \\frac{f_0^2}{f_{\\text{p1}}} = \\frac{3596.0}{50} = 71.920\\text{ Hz}$$\n$$BW = 2\\pi (71.920 - 50) = 137.727\\text{ rad/s}, \\quad BW_{\\text{stop}} = 2\\pi (62 - 58) = 25.133\\text{ rad/s}$$'
            },
            {
              stepTitle: 'Adım 2: Frekans Oranı ve Eliptik Prototip Derecesi Hesabı',
              desc: 'Çok dar durdurma bandı (4 Hz) nedeniyle oran yüksek çıkar; Eliptik yaklaşımla $n_{\\text{LP}} = 3$ yeterli olur:',
              math: '$$\\Omega_{rS} = \\frac{BW}{BW_{\\text{stop}}} = \\frac{71.920 - 50}{62 - 58} = \\frac{21.920}{4.0} = 5.480$$\n$$r_t = \\frac{1}{\\Omega_{rS}} = 0.18248, \\quad k_n = \\frac{\\sqrt{10^{0.03}-1}}{\\sqrt{10^{5.0}-1}} = 0.000851$$\n$$n_E = \\frac{K(0.1825) \\cdot K(\\sqrt{1 - k_n^2})}{K(\\sqrt{1 - 0.1825^2}) \\cdot K(k_n)} = 2.84 \\implies n_{\\text{LP}} = 3 \\implies N_{\\text{BS}} = 6$$'
            },
            {
              stepTitle: 'Adım 3: Çoklu Çentik Sıfırları ve 3 Adet Kuadratik Biquad Katı',
              desc: 'Filtre 1 adet merkez çentik sıfırı ($60\\text{ Hz}$) ve durdurma bandı kenarlarında 2 adet ek eliptik çentik sıfırından oluşur:',
              math: '$$\\text{Kat 1 (Merkez Çentik): } H_0(s) = \\frac{s^2 + 141964}{s^2 + 185.62 s + 141964}$$\n$$\\text{Kat 2 (Alt Çentik): } H_1(s) = \\frac{s^2 + 138690}{s^2 + 38.45 s + 137850}$$\n$$\\text{Kat 3 (Üst Çentik): } H_2(s) = \\frac{s^2 + 145310}{s^2 + 41.22 s + 146200}$$\n$$H(s) = H_0(s) \\cdot H_1(s) \\cdot H_2(s)$$'
            }
          ]
        }
      ],
      pros: [
        'Şebeke parazitlerini (50 Hz / 60 Hz hum) veya tek frekanslı taşıyıcı sinyalleri bitişik frekanslara dokunmadan yok etmek için idealdir.',
        'Bölüm 4\'te Twin-Tee veya Bainter biquad devreleri ile kararlı bir şekilde uygulanabilir.'
      ],
      cons: [
        'Geçiş bölgelerinde faz bükülmesi (phase distortion) yüksektir; derece katlanması ($2n$) nedeniyle devre karmaşıklığı artar.'
      ]
    }
  };

  let overlayEl = null;
  let bodyEl = null;
  let closeBtn = null;
  let tabButtons = [];
  let currentKey = 'lp_to_lp';

  function init() {
    overlayEl = document.getElementById('transformModalOverlay');
    bodyEl = document.getElementById('transformModalBody');
    closeBtn = document.getElementById('closeTransformModalBtn');
    tabButtons = document.querySelectorAll('[data-transform-tab]');

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
        const key = btn.getAttribute('data-transform-tab');
        if (key && TRANSFORM_DATA[key]) {
          currentKey = key;
          updateActiveTab(key);
          renderContent(TRANSFORM_DATA[key]);
        }
      });
    });

    // Delegate click events on document for all [data-open-transform-modal] buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-transform-modal]');
      if (btn) {
        const key = btn.getAttribute('data-open-transform-modal');
        if (key && TRANSFORM_DATA[key]) {
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
      btn.classList.toggle('active', btn.getAttribute('data-transform-tab') === key);
    });
  }

  function open(key = 'lp_to_lp') {
    if (!overlayEl || !bodyEl) init();
    if (!overlayEl || !bodyEl) return;
    currentKey = TRANSFORM_DATA[key] ? key : 'lp_to_lp';
    updateActiveTab(currentKey);
    renderContent(TRANSFORM_DATA[currentKey]);
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
          <button class="btn btn-primary" id="btnApplyTransformToDesigner" style="background: ${data.color}; border-color: ${data.color}; flex-shrink: 0;">
            🚀 Bu Filtre Türünü Tasarımcıda Başlat
          </button>
        </div>

        <!-- Row 1: Dual SVG (Frequency Spectrum & Pole-Zero Inversion) -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>📊 Frekans Büyüklük Dönüşümü (|H(jω)|)</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgMag}
            </div>
          </div>

          <div class="type-detail-section">
            <h4>🎯 s-Düzleminde Kutup ve Sıfır Dönüşümü</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgPoles}
            </div>
          </div>
        </div>

        <!-- Row 2: Step-by-Step Mathematical Algorithm -->
        <div class="type-detail-section">
          <h4>📐 Adım Adım Analitik Frekans Dönüşüm Algoritması ve Tüm Katsayı Formülleri (Bölüm 3)</h4>
          <div style="margin-top: 10px;">
            ${stepsHtml}
          </div>
        </div>

        <!-- Row 3: Step-by-Step Textbook Numerical Examples -->
        <div class="type-detail-section">
          <h4>📚 Kitaptaki Adım Adım Sayısal Çözüm Örnekleri (Bölüm 3)</h4>
          <p style="font-size: 13px; color: var(--muted); margin: 0 0 12px;">Les Thede'in "Practical Analog and Digital Filter Design" kitabında yer alan sayısal frekans dönüşüm örnekleri, yukarıdaki kurallar ve formüller adım adım uygulanarak eksiksiz çözülmüştür:</p>
          <div style="margin-top: 10px;">
            ${examplesHtml}
          </div>
        </div>

        <!-- Row 4: Pros, Cons & Engineering Performance -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>🌟 Avantajları ve Pratik Uygulama Alanları</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${prosHtml}
            </ul>
          </div>

          <div class="type-detail-section">
            <h4>⚠️ Tasarımda Dikkat Edilmesi Gereken Kısıtlar</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${consHtml}
            </ul>
          </div>
        </div>

      </div>
    `;

    // Hook CTA Button to apply filter type in designer
    const applyBtn = document.getElementById('btnApplyTransformToDesigner');
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
  window.FilterTransformModal = FilterTransformModal;
}

if (typeof module !== 'undefined') module.exports = FilterTransformModal;
