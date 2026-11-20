/**
 * FilterDesign Studio - Normalized Filter Approximations Modal Module
 * Detailed mathematical derivations, formulas, pole-zero distributions, SVG diagrams,
 * step-by-step algorithms, and complete textbook worked examples (odd and even order)
 * for Butterworth, Chebyshev I, Inverse Chebyshev, and Elliptic filters.
 * Based on Les Thede - "Practical Analog and Digital Filter Design" (Chapter 2).
 */

const FilterApproxModal = (() => {
  const APPROX_DATA = {
    butterworth: {
      id: 'butterworth',
      title: 'Butterworth Yaklaşımı (Maksimum Düz - Maximally Flat)',
      badge: 'Bölüm 2.2 & Kitap Denklem 2.6 - 2.18',
      color: '#3d5afe',
      summary: 'Geçirme bandında hiçbir dalgalanma barındırmayan, DC (ω=0) civarında ilk 2n-1 türevi sıfır olan maksimum düz genlik yanıtı ve üstün faz doğrusallığı sunan klasik yaklaşım.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">ω_pass (1.0)</text>
          <text x="290" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">ω_stop</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="44" y="149" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="50" y1="85" x2="170" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="170" y1="30" x2="170" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="290" y1="30" x2="290" y2="170" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="290" y1="145" x2="430" y2="145" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Smooth maximally flat response curve -->
          <path d="M 50,60 C 120,60 150,65 170,85 C 195,110 240,138 290,147 C 340,156 390,162 430,165" fill="none" stroke="#3d5afe" stroke-width="3" />
          <text x="175" y="55" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#3d5afe">Maksimum Düz (Monotonik)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Unit Circle (R = 65) -->
          <circle cx="130" cy="105" r="65" fill="none" stroke="#e0deda" stroke-width="1.8" stroke-dasharray="4,4" />
          <text x="135" y="175" font-family="Inter, sans-serif" font-size="9.5" fill="#9ca3af">Birim Çember (R=1)</text>

          <!-- Poles for n=3 (theta = 30, 90, 150) on LHS -->
          <text x="97" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <text x="65" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <text x="97" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>

          <text x="60" y="85" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">p₁, p₂, p₃</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Dalgalanma Faktörü (ε) ve Filtre Derecesi (n_B) Hesabı (Denklem 2.7 & 2.8)',
          desc: 'Geçirme bandı zayıflamasından dalgalanma faktörü $\\epsilon$ ve tolerans gereksinimlerinden gerekli minimum tamsayı derece $n$ hesaplanır (bir üst tamsayıya yuvarlanır):',
          math: '$$\\epsilon = \\sqrt{10^{-0.1 a_{\\text{pass}}} - 1}$$\n$$n_B \\ge \\frac{\\log_{10}\\left[ \\frac{10^{-0.1 a_{\\text{stop}}} - 1}{10^{-0.1 a_{\\text{pass}}} - 1} \\right]}{2 \\log_{10}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Normalize Çember Yarıçapı (R) Hesabı (Denklem 2.9)',
          desc: 'Les Thede yaklaşımında kutuplar yarıçapı $R$ olan bir çember üzerindedir. $\\epsilon = 1$ (yani $-3.01\\text{ dB}$) durumunda $R = 1$ birim çemberdir; keyfi $a_{\\text{pass}}$ toleransında çember yarıçapı:',
          math: '$$R = \\epsilon^{-1/n}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'İkinci Bölge Kutup Açıları (θ_m) ve m İndis Hesabı (Denklem 2.10a / 2.10b)',
          desc: 'Sol yarı düzlemdeki ikinci bölge kutup açıları $m = 0, 1, \\dots$ indisleri üzerinden analitik olarak hesaplanır:',
          math: '$$\\text{Çift } n \\implies m = 0, 1, \\dots, \\frac{n}{2} - 1: \\quad \\theta_m = \\frac{2m + 1 + n}{2n}\\pi$$\n$$\\text{Tek } n \\implies m = 0, 1, \\dots, \\frac{n-1}{2} - 1: \\quad \\theta_m = \\frac{2m + 1 + n}{2n}\\pi$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Kutup Koordinatları (σ_m, ω_m) ve Tek Derece Reel Kutbu (σ_R) (Denklem 2.11 - 2.13)',
          desc: 'Her bir $m$ indisi için karmaşık eşlenik kutup çiftleri ve $n$ tek ise reel eksen kutbu hesaplanır:',
          math: '$$\\sigma_m = R \\cos(\\theta_m), \\quad \\omega_m = R \\sin(\\theta_m)$$\n$$p_m = \\sigma_m + j \\omega_m, \\quad p_m^* = \\sigma_m - j \\omega_m$$\n$$\\text{Tek } n \\text{ için reel kutup: } \\sigma_R = -R, \\quad \\omega_R = 0$$'
        },
        {
          stepNum: 'Adım 5',
          title: 'Kuadratik Biquad Katsayıları (B₁, B₂) ve 1. Derece Kat (H₀(S)) (Denklem 2.14 - 2.17)',
          desc: 'Karmaşık kutup çiftleri doğrudan aktif devrede sentezlenecek ikinci derece biquad katsayılarına dönüştürülür:',
          math: '$$H_m(S) = \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$\n$$B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = \\sigma_m^2 + \\omega_m^2 = R^2$$\n$$\\text{Tek } n \\text{ için 1. derece kat: } H_0(S) = \\frac{R}{S + R}$$'
        },
        {
          stepNum: 'Adım 6',
          title: 'Tam Normalize Transfer Fonksiyonu H_B(S) (Denklem 2.18a & 2.18b)',
          desc: 'Tüm kuadratik katlar ve varsa birinci derece kat bir araya getirilerek DC kazancı $1.0$ ($0\\text{ dB}$) olan normalize transfer fonksiyonu tamamlanır:',
          math: '$$n \\text{ çift ise: } H_{B,n}(S) = \\prod_{m=0}^{(n/2)-1} \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$\n$$n \\text{ tek ise: } H_{B,n}(S) = \\frac{R}{S + R} \\prod_{m=0}^{[(n-1)/2]-1} \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$'
        }
      ],
      examples: [
        {
          id: 'ex2_2',
          badge: 'Örnek 2.2 (Kitap Sayfa 33) - Tek Derece (n = 3)',
          title: 'Butterworth 3. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -12.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Dalgalanma Faktörü (ε) ve Derece (n) Hesabı (Denklem 2.7 & 2.8)',
              desc: 'Tolerans değerleri formüle yerleştirilerek $\\epsilon$ ve minimum derece hesaplanır:',
              math: '$$\\epsilon = \\sqrt{10^{-0.1(-1)} - 1} = \\sqrt{10^{0.1} - 1} = 0.508847$$\n$$n_B \\ge \\frac{\\log_{10}\\left[ \\frac{10^{-0.1(-12)} - 1}{10^{-0.1(-1)} - 1} \\right]}{2 \\log_{10}(2/1)} = \\frac{\\log_{10}\\left( \\frac{15.8489 - 1}{1.2589 - 1} \\right)}{2 \\cdot 0.30103} = \\frac{\\log_{10}(57.348)}{0.60206} = 2.92 \\implies n = 3 \\text{ (Tek Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Çember Yarıçapı (R) Hesabı (Denklem 2.9)',
              desc: 'Kutupların üzerinde dizildiği çemberin yarıçapı $R$ bulunur:',
              math: '$$R = \\epsilon^{-1/n} = (0.508847)^{-1/3} = 1.252576$$'
            },
            {
              stepTitle: 'Adım 3: Kutup Açıları ve Konumları (Denklem 2.10b - 2.13)',
              desc: '$n=3$ tek derece olduğu için bir adet reel kutup ve bir adet 2. bölge karmaşık eşlenik kutup çifti ($m=0$) oluşur:',
              math: '$$\\text{1. Derece Reel Kutup: } \\sigma_R = -R = -1.252576, \\quad \\omega_R = 0$$\n$$\\text{İndis } m=0: \\quad \\theta_0 = \\frac{2(0) + 1 + 3}{2(3)}\\pi = \\frac{4\\pi}{6} = \\frac{2\\pi}{3} = 120^\\circ$$\n$$\\sigma_0 = R \\cos(120^\\circ) = 1.252576 \\cdot (-0.5) = -0.626288$$\n$$\\omega_0 = R \\sin(120^\\circ) = 1.252576 \\cdot \\frac{\\sqrt{3}}{2} = +1.084763 \\implies p_{1,2} = -0.626288 \\pm j 1.084763$$'
            },
            {
              stepTitle: 'Adım 4: Kuadratik Biquad Katsayıları ve Transfer Fonksiyonu (Denklem 2.14 - 2.18b)',
              desc: 'Katsayılar eşlenerek 1. derece ve 2. derece katlar oluşturulur:',
              math: '$$B_{1,0} = -2\\sigma_0 = -2(-0.626288) = 1.252576$$\n$$B_{2,0} = \\sigma_0^2 + \\omega_0^2 = R^2 = (1.252576)^2 = 1.568948$$\n$$H_{B,3}(S) = \\frac{1.252576}{S + 1.252576} \\cdot \\frac{1.568948}{S^2 + 1.252576 S + 1.568948}$$\n$$\\text{WFilter Doğrulaması: } G = 1.00000000, \\quad H_1(S) = \\frac{1.252576}{S + 1.252576}, \\quad H_2(S) = \\frac{1.568948}{S^2 + 1.252576 S + 1.568948}$$'
            }
          ]
        },
        {
          id: 'ex2_3',
          badge: 'Örnek 2.3 (Kitap Sayfa 34) - Çift Derece (n = 4)',
          title: 'Butterworth 4. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -18.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Dalgalanma Faktörü (ε) ve Derece (n) Hesabı (Denklem 2.7 & 2.8)',
              desc: 'Daha sıkı durdurma bandı ($-18\\text{ dB}$) için gereken minimum derece:',
              math: '$$\\epsilon = \\sqrt{10^{0.1} - 1} = 0.508847$$\n$$n_B \\ge \\frac{\\log_{10}\\left[ \\frac{10^{1.8} - 1}{10^{0.1} - 1} \\right]}{2 \\log_{10}(2)} = \\frac{\\log_{10}\\left( \\frac{63.0957 - 1}{0.258925} \\right)}{0.60206} = \\frac{\\log_{10}(239.82)}{0.60206} = 3.95 \\implies n = 4 \\text{ (Çift Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Çember Yarıçapı (R) Hesabı (Denklem 2.9)',
              desc: '$n=4$ için normalize çember yarıçapı:',
              math: '$$R = \\epsilon^{-1/4} = (0.508847)^{-0.25} = 1.184004$$'
            },
            {
              stepTitle: 'Adım 3: İkinci Bölge Kutup Açıları ve Koordinatları (Denklem 2.10a - 2.13)',
              desc: '$n=4$ çift derece olduğu için reel kutup yoktur. İki adet karmaşık eşlenik kutup çifti ($m = 0, 1$) yer alır:',
              math: '$$\\text{İndis } m=0: \\quad \\theta_0 = \\frac{2(0) + 1 + 4}{2(4)}\\pi = \\frac{5\\pi}{8} = 112.5^\\circ$$\n$$\\sigma_0 = R \\cos(112.5^\\circ) = -0.453099, \\quad \\omega_0 = R \\sin(112.5^\\circ) = +1.093877$$\n$$\\text{İndis } m=1: \\quad \\theta_1 = \\frac{2(1) + 1 + 4}{2(4)}\\pi = \\frac{7\\pi}{8} = 157.5^\\circ$$\n$$\\sigma_1 = R \\cos(157.5^\\circ) = -1.093877, \\quad \\omega_1 = R \\sin(157.5^\\circ) = +0.453099$$'
            },
            {
              stepTitle: 'Adım 4: Kuadratik Biquad Katsayıları ve Transfer Fonksiyonu (Denklem 2.14 - 2.18a)',
              desc: 'Her iki kutup çifti iki adet 2. derece aktif biquad katına dönüştürülür:',
              math: '$$\\text{Kat 1 } (m=0): B_{1,0} = -2\\sigma_0 = 0.906198, \\quad B_{2,0} = R^2 = 1.401865$$\n$$\\text{Kat 2 } (m=1): B_{1,1} = -2\\sigma_1 = 2.187754, \\quad B_{2,1} = R^2 = 1.401865$$\n$$H_{B,4}(S) = \\frac{1.401865}{S^2 + 0.906198 S + 1.401865} \\cdot \\frac{1.401865}{S^2 + 2.187754 S + 1.401865}$$\n$$\\text{WFilter Doğrulaması: } G = 1.00000000, \\quad Q_1 = 1.3065, \\quad Q_2 = 0.5412$$'
            }
          ]
        }
      ],
      pros: [
        'Geçirme bandında kesinlikle dalgalanma yoktur (tamamen düz).',
        'Faz yanıtı tüm klasik filtreler arasında en doğrusala yakın olandır.',
        'Basamak yanıtında aşım (overshoot) düşüktür (~%8 - %12).',
        'Bileşen toleranslarına ($R, C$ değişimlerine) karşı en dayanıklı filtredir.'
      ],
      cons: [
        'Geçiş bandı dikliği diğer yaklaşımlara göre düşüktür; aynı zayıflamayı elde etmek için daha yüksek derece ($n$) gerektirir.'
      ]
    },

    chebyshev: {
      id: 'chebyshev',
      title: 'Chebyshev Tip I Yaklaşımı (Eşit Dalgalı - Equiripple)',
      badge: 'Bölüm 2.3 & Kitap Denklem 2.19 - 2.33',
      color: '#ef4444',
      summary: 'Geçirme bandında izin verilen bir dalgalanma (apass dB) karşılığında, Butterworth\'e kıyasla çok daha dik bir geçiş bandı ve daha düşük derece (N) sunan popüler yaklaşım.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">ω_pass (1.0)</text>
          <text x="260" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">ω_stop</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="44" y="149" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="50" y1="85" x2="170" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="170" y1="30" x2="170" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="260" y1="30" x2="260" y2="170" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="260" y1="145" x2="430" y2="145" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Chebyshev Equiripple passband & steep roll-off -->
          <path d="M 50,60 C 70,60 85,85 105,60 C 125,85 145,60 170,85 C 190,120 220,140 260,146 C 310,154 370,160 430,164" fill="none" stroke="#ef4444" stroke-width="3" />
          <text x="110" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#ef4444">Eşit Dalgalanma (Equiripple)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Ellipse with minor axis a=35, major axis b=68 -->
          <ellipse cx="130" cy="105" rx="35" ry="68" fill="none" stroke="#e0deda" stroke-width="1.8" stroke-dasharray="4,4" />
          <text x="135" y="175" font-family="Inter, sans-serif" font-size="9.5" fill="#9ca3af">Kutup Elipsi (Foci=±j)</text>

          <!-- Poles for n=3 on ellipse LHS -->
          <text x="112" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <text x="95" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <text x="112" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>

          <text x="75" y="85" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#ef4444">p₁, p₂, p₃</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Dalgalanma Faktörü (ε) ve Filtre Derecesi (n) Hesabı (Denklem 2.20 & 2.21)',
          desc: 'Geçirme bandı zayıflamasından $\\epsilon$ dalgalanma faktörü ve ters hiperbolik kosinüs ile derece $n$ bulunur:',
          math: '$$\\epsilon = \\sqrt{10^{-a_{\\text{pass}}/10} - 1}$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{-a_{\\text{stop}}/10} - 1}{\\epsilon^2}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Elips Parametresi (D) ve Hiperbolik Fonksiyonlar (Denklem 2.22 & 2.23)',
          desc: 'Chebyshev kutupları odakları $\\pm j$ üzerinde olan bir elips üzerindedir; elips parametresi $D$ hesaplanır:',
          math: '$$D = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon}\\right)$$\n$$\\sinh(D), \\quad \\cosh(D)$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Kutup Konumları (σ_k, ω_k) ve Açı Dağılımı (Denklem 2.24 - 2.27)',
          desc: 'Elips üzerindeki karmaşık eşlenik kutuplar ve varsa tek derecedeki reel kutup hesaplanır:',
          math: '$$\\theta_k = \\frac{2k - 1}{2n}\\pi \\quad (k = 1, 2, \\dots, n)$$\n$$\\sigma_k = -\\sinh(D) \\sin(\\theta_k), \\quad \\omega_k = \\cosh(D) \\cos(\\theta_k)$$\n$$\\text{Tek } n \\text{ için gerçel kutup: } \\sigma_R = -\\sinh(D), \\quad \\omega_R = 0$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Biquad Katsayıları ve Çift Derece DC Kazanç Düzeltmesi (Denklem 2.28 - 2.33)',
          desc: 'Kuadratik katlar $B_1, B_2$ katsayılarına dönüştürülür. Çift derecede $C_n(0)=1$ olduğundan $G = 10^{0.05 a_{\\text{pass}}}$ kazanç çarpanı uygulanır:',
          math: '$$B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = \\sigma_m^2 + \\omega_m^2$$\n$$G = \\begin{cases} 1.0 (0\\text{ dB}), & n \\text{ tek ise} \\\\ 10^{0.05 a_{\\text{pass}}}, & n \\text{ çift ise} \\end{cases}$$\n$$H_C(S) = G \\prod_m \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$'
        }
      ],
      examples: [
        {
          id: 'ex2_4',
          badge: 'Örnek 2.4 (Kitap Sayfa 40) - Tek Derece (n = 3)',
          title: 'Chebyshev Tip I 3. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -22.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Dalgalanma Faktörü (ε) ve Derece (n) Hesabı (Denklem 2.20 & 2.21)',
              desc: 'Tolerans değerleri yerleştirilerek $\\epsilon$ ve minimum derece $n$ bulunur:',
              math: '$$\\epsilon = \\sqrt{10^{0.1} - 1} = 0.508847$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{2.2}-1}{0.508847^2}} \\right)}{\\operatorname{arcosh}(2/1)} = \\frac{\\operatorname{arcosh}\\left( \\frac{12.5494}{0.508847} \\right)}{\\operatorname{arcosh}(2)} = \\frac{\\operatorname{arcosh}(24.662)}{1.31696} = 2.96 \\implies n = 3 \\text{ (Tek Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Elips Parametresi (D) ve Hiperbolik Değerler (Denklem 2.22 & 2.23)',
              desc: '$n=3$ için hiperbolik elips sabiti $D$ hesaplanır:',
              math: '$$D = \\frac{1}{3} \\operatorname{arsinh}\\left(\\frac{1}{0.508847}\\right) = \\frac{1}{3} \\operatorname{arsinh}(1.96523) = 0.475992$$\n$$\\sinh(D) = \\sinh(0.475992) = 0.494171$$\n$$\\cosh(D) = \\cosh(0.475992) = 1.115439$$'
            },
            {
              stepTitle: 'Adım 3: Kutup Konumları (Denklem 2.24 - 2.27)',
              desc: 'Tek derece olduğu için 1 gerçel kutup ve 1 kompleks kutup çifti ($\phi_0 = \\pi/6 = 30^\\circ$):',
              math: '$$\\text{1. Derece Gerçel Kutup: } \\sigma_R = -\\sinh(D) = -0.494171, \\quad \\omega_R = 0$$\n$$\\text{Kompleks Kutup Çifti } (\\phi_0 = 30^\\circ):$$\n$$\\sigma_0 = -\\sinh(D)\\sin(30^\\circ) = -0.494171 \\cdot 0.5 = -0.247085$$\n$$\\omega_0 = \\cosh(D)\\cos(30^\\circ) = 1.115439 \\cdot \\frac{\\sqrt{3}}{2} = +0.965999 \\implies p_{1,2} = -0.247085 \\pm j 0.965999$$'
            },
            {
              stepTitle: 'Adım 4: Biquad Katsayıları ve Transfer Fonksiyonu (Denklem 2.28 - 2.33b)',
              desc: '$n=3$ tek olduğundan $C_3(0) = 0$ ve DC kazancı $1.0$ ($0\\text{ dB}$)\'dir:',
              math: '$$B_{1,0} = -2\\sigma_0 = 0.494171, \\quad B_{2,0} = \\sigma_0^2 + \\omega_0^2 = (-0.247085)^2 + (0.965999)^2 = 0.994205$$\n$$H_{C,3}(S) = \\frac{0.494171}{S + 0.494171} \\cdot \\frac{0.994205}{S^2 + 0.494171 S + 0.994205}$$\n$$\\text{WFilter Doğrulaması: } G = 1.00000000, \\quad H_1(S) = \\frac{0.494171}{S + 0.494171}, \\quad H_2(S) = \\frac{0.994205}{S^2 + 0.494171 S + 0.994205}$$'
            }
          ]
        },
        {
          id: 'ex2_5',
          badge: 'Örnek 2.5 (Kitap Sayfa 42) - Çift Derece (n = 4)',
          title: 'Chebyshev Tip I 4. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -33.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Dalgalanma Faktörü (ε) ve Derece (n) Hesabı (Denklem 2.20 & 2.21)',
              desc: '$-33\\text{ dB}$ durdurma zayıflaması için Chebyshev derecesi:',
              math: '$$\\epsilon = 0.508847$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{3.3}-1}{0.508847^2}} \\right)}{\\operatorname{arcosh}(2)} = \\frac{\\operatorname{arcosh}(87.755)}{1.31696} = \\frac{5.1676}{1.31696} = 3.92 \\implies n = 4 \\text{ (Çift Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Elips Parametresi (D) ve Hiperbolik Sabitler (Denklem 2.22 & 2.23)',
              desc: '$n=4$ için $D$ değeri ve hiperbolik fonksiyonlar:',
              math: '$$D = \\frac{1}{4} \\operatorname{arsinh}(1.96523) = 0.356994$$\n$$\\sinh(D) = 0.364625, \\quad \\cosh(D) = 1.064402$$'
            },
            {
              stepTitle: 'Adım 3: İkinci Bölge Kutup Koordinatları (Denklem 2.24 - 2.27)',
              desc: 'İki adet karmaşık kutup çifti ($\\theta_0 = \\pi/8 = 22.5^\\circ, \\theta_1 = 3\\pi/8 = 67.5^\\circ$):',
              math: '$$\\text{Kat 1 } (m=0): \\sigma_0 = -\\sinh(D)\\sin(22.5^\\circ) = -0.139536, \\quad \\omega_0 = \\cosh(D)\\cos(22.5^\\circ) = +0.983379$$\n$$\\text{Kat 2 } (m=1): \\sigma_1 = -\\sinh(D)\\sin(67.5^\\circ) = -0.336870, \\quad \\omega_1 = \\cosh(D)\\cos(67.5^\\circ) = +0.407329$$'
            },
            {
              stepTitle: 'Adım 4: Kuadratik Biquad Katsayıları ve DC Kazanç Düzeltmesi (Denklem 2.32 & 2.33a)',
              desc: '$n=4$ çift olduğu için $\\omega=0$\'da $1\\text{ dB}$ düşüşü dengeleyen $G = 10^{0.05 a_{\\text{pass}}}$ kazanç çarpanı eklenir:',
              math: '$$\\text{Kat 1: } B_{1,0} = -2\\sigma_0 = 0.279072, \\quad B_{2,0} = \\sigma_0^2 + \\omega_0^2 = 0.986502$$\n$$\\text{Kat 2: } B_{1,1} = -2\\sigma_1 = 0.673740, \\quad B_{2,1} = \\sigma_1^2 + \\omega_1^2 = 0.279401$$\n$$G = 10^{0.05(-1)} = 10^{-0.05} = 0.891251 \\quad (-1.0\\text{ dB})$$\n$$H_{C,4}(S) = 0.891251 \\cdot \\frac{0.986502}{S^2 + 0.279072 S + 0.986502} \\cdot \\frac{0.279401}{S^2 + 0.673740 S + 0.279401}$$\n$$\\text{WFilter Doğrulaması: } G = 8.91250938E-01, \\quad Q_1 = 3.56, \\quad Q_2 = 0.78$$'
            }
          ]
        }
      ],
      pros: [
        'Butterworth\'e göre çok daha dik geçiş bandı ve aynı toleranslar için daha düşük derece ($n$).',
        'Durdurma bandında monotonik ve hızlı düşüş.'
      ],
      cons: [
        'Geçirme bandında dalgalanma (ripple) vardır.',
        'Faz yanıtı doğrusal değildir, grup gecikmesi kesim frekansı civarında pik yapar.',
        'Basamak yanıtında aşım (overshoot) yüksektir (~%18 - %30).'
      ]
    },

    inv_chebyshev: {
      id: 'inv_chebyshev',
      title: 'Ters Chebyshev Yaklaşımı (Tip II - Durdurma Bandı Dalgalı)',
      badge: 'Bölüm 2.4 & Kitap Denklem 2.34 - 2.54',
      color: '#10b981',
      summary: 'Geçirme bandı Butterworth gibi tamamen düz ve dalgalanmasız olan, durdurma bandında ise jω sanal eksenindeki iletim sıfırları sayesinde eş-dalgalı derin zayıflama sunan hibrit yaklaşım.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">ω_pass</text>
          <text x="250" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">ω_stop (1.0)</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="44" y="149" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="50" y1="85" x2="170" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="170" y1="30" x2="170" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="250" y1="30" x2="250" y2="170" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="250" y1="145" x2="430" y2="145" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Flat passband + notch zeros in stopband -->
          <path d="M 50,60 C 130,60 160,65 170,85 C 190,120 220,143 250,146 C 265,150 270,175 272,175 C 274,175 285,146 310,146 C 330,146 345,175 348,175 C 350,175 380,148 430,150" fill="none" stroke="#10b981" stroke-width="3" />
          <text x="210" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#10b981">Durdurma Bandı Sıfırları (Eş-dalgalı)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Inverted poles -->
          <text x="95" y="70" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#10b981">×</text>
          <text x="75" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#10b981">×</text>
          <text x="95" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#10b981">×</text>

          <!-- Finite Transmission Zeros on jw axis -->
          <circle cx="130" cy="45" r="4.5" fill="#ffffff" stroke="#10b981" stroke-width="2.2" />
          <circle cx="130" cy="165" r="4.5" fill="#ffffff" stroke="#10b981" stroke-width="2.2" />
          <text x="140" y="49" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#10b981">+jω_z1</text>
          <text x="140" y="169" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#10b981">-jω_z1</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Durdurma Faktörü (ε_i) ve Derece (n) Hesabı (Denklem 2.35 & 2.36)',
          desc: 'Ters Chebyshev prototipinde dalgalanma geçirme bandında değil durdurma bandında yer aldığından parametre $\\epsilon_i$ ile başlanır:',
          math: '$$\\epsilon_i = \\frac{1}{\\sqrt{10^{-a_{\\text{stop}}/10} - 1}}$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\frac{\\sqrt{10^{-a_{\\text{stop}}/10} - 1}}{\\sqrt{10^{-a_{\\text{pass}}/10} - 1}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Ters Elips Parametresi (D_i) Hesabı (Denklem 2.39)',
          desc: 'Ters Chebyshev hiperbolik elips sabiti $D_i$ türetilir:',
          math: '$$D_i = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon_i}\\right)$$\n$$\\sinh(D_i), \\quad \\cosh(D_i)$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'jω Sanal Eksenindeki İletim Sıfırları (Denklem 2.40 & 2.41)',
          desc: 'Chebyshev polinomunun kökleri sanal eksende tam sıfırlama çentikleri ($-\\infty\\text{ dB}$) oluşturur:',
          math: '$$\\omega_{z,m} = \\frac{1}{\\cos(\\phi_m)}, \\quad \\phi_m = \\frac{2m + 1}{2n}\\pi \\quad (\\cos\\phi_m \\ne 0)$$\n$$z_m = \\pm j \\omega_{z,m} \\implies (S^2 + \\omega_{z,m}^2)$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Kutupların Çarpmaya Göre Terslenmesi (Denklem 2.42 - 2.47)',
          desc: 'Standart Chebyshev kutup koordinatları ters çevrilerek ($p_m = 1 / p\'_m$) kutuplar elde edilir:',
          math: '$$\\sigma\'_m = -\\sinh(D_i) \\sin(\\phi_m), \\quad \\omega\'_m = \\cosh(D_i) \\cos(\\phi_m)$$\n$$\\sigma_m = \\frac{\\sigma\'_m}{{\\sigma\'_m}^2 + {\\omega\'_m}^2}, \\quad \\omega_m = \\frac{-\\omega\'_m}{{\\sigma\'_m}^2 + {\\omega\'_m}^2}$$\n$$\\text{Tek } n \\text{ için gerçel kutup: } \\sigma_R = -\\frac{1}{\\sinh(D_i)}$$'
        },
        {
          stepNum: 'Adım 5',
          title: 'Biquad Katsayıları ve Normalize Transfer Fonksiyonu (Denklem 2.48 - 2.54)',
          desc: 'DC kazancı daima $1.0$ ($0\\text{ dB}$) olacak şekilde normalize edilir:',
          math: '$$B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = \\sigma_m^2 + \\omega_m^2, \\quad A_{0,m} = \\omega_{z,m}^2$$\n$$H_{I,n}(S) = \\prod_m \\frac{S^2 + A_{0,m}}{S^2 + B_{1,m} S + B_{2,m}} \\cdot \\frac{B_{2,m}}{A_{0,m}}$$'
        }
      ],
      examples: [
        {
          id: 'ex2_6',
          badge: 'Örnek 2.6 (Kitap Sayfa 48) - Tek Derece (n = 3)',
          title: 'Ters Chebyshev 3. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -22.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Durdurma Faktörü (ε_i) ve Derece (n) Hesabı (Denklem 2.35 & 2.36)',
              desc: 'Ters Chebyshev dalgalanma faktörü durdurma bandı zayıflamasından hesaplanır:',
              math: '$$\\epsilon_i = \\frac{1}{\\sqrt{10^{2.2}-1}} = \\frac{1}{\\sqrt{158.489 - 1}} = 0.079685$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\frac{\\sqrt{10^{2.2}-1}}{\\sqrt{10^{0.1}-1}} \\right)}{\\operatorname{arcosh}(2)} = \\frac{\\operatorname{arcosh}(24.662)}{1.31696} = 2.96 \\implies n = 3 \\text{ (Tek Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Ters Elips Sabiti (D_i) (Denklem 2.39)',
              desc: '$n=3$ için $D_i$ parametresi ve hiperbolik değerler:',
              math: '$$D_i = \\frac{1}{3} \\operatorname{arsinh}\\left(\\frac{1}{0.079685}\\right) = \\frac{1}{3} \\operatorname{arsinh}(12.5494) = 1.074803$$\n$$\\sinh(D_i) = 1.294026, \\quad \\cosh(D_i) = 1.635391$$'
            },
            {
              stepTitle: 'Adım 3: Sanal Eksen Sıfırları ve Kutuplar (Denklem 2.40 - 2.47)',
              desc: 'Sanal eksende ($j\\omega$) derin iletim sıfırı ve evrilmiş kutup konumları:',
              math: '$$\\text{İletim Sıfırı } (\\phi_0 = 30^\\circ): \\quad \\omega_{z0} = \\frac{1}{\\cos(30^\\circ)} = 1.154701 \\implies z_{1,2} = \\pm j 1.154701$$\n$$\\text{Standart Kutup: } \\sigma\'_0 = -\\sinh(D_i)\\sin(30^\\circ) = -0.647013, \\quad \\omega\'_0 = \\cosh(D_i)\\cos(30^\\circ) = 1.416290$$\n$$\\text{Evrilmiş Kutup: } \\sigma_0 = \\frac{\\sigma\'_0}{{\\sigma\'_0}^2 + {\\omega\'_0}^2} = -0.266864, \\quad \\omega_0 = \\frac{-\\omega\'_0}{{\\sigma\'_0}^2 + {\\omega\'_0}^2} = -0.584157$$\n$$\\text{1. Derece Gerçel Kutup: } \\sigma_R = -\\frac{1}{\\sinh(D_i)} = -0.772782, \\quad \\omega_R = 0$$'
            },
            {
              stepTitle: 'Adım 4: Normalize Transfer Fonksiyonu ve WFilter Katsayıları (Sayfa 50)',
              desc: 'Kitapta açıklandığı gibi $\\omega_{\\text{pass}} = 1.0\\text{ rad/s}$ kesimine göre normalize edilen son fonksiyon:',
              math: '$$H_{I,3}(S) = \\frac{1.545564}{S + 1.545564} \\cdot \\frac{0.309342 (S^2 + 5.333333)}{S^2 + 1.067457 S + 1.649823}$$\n$$\\text{DC Kazancı: } S=0 \\implies H_{I,3}(0) = 1.00000000 \\quad (0\\text{ dB})$$\n$$\\text{WFilter Doğrulaması: } G = 3.09341803E-01, \\quad \\text{Pay: } S^2 + 5.333333, \\quad \\text{Payda: } S^2 + 1.067457 S + 1.649823$$'
            }
          ]
        },
        {
          id: 'ex2_7',
          badge: 'Örnek 2.7 (Kitap Sayfa 50) - Çift Derece (n = 4)',
          title: 'Ters Chebyshev 4. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -33.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Durdurma Faktörü (ε_i) ve Derece (n) Hesabı (Denklem 2.35 & 2.36)',
              desc: '$-33\\text{ dB}$ durdurma zayıflaması için:',
              math: '$$\\epsilon_i = \\frac{1}{\\sqrt{10^{3.3}-1}} = 0.022393$$\n$$n \\ge \\frac{\\operatorname{arcosh}(87.755)}{1.31696} = 3.92 \\implies n = 4 \\text{ (Çift Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: Ters Elips Sabiti (D_i) (Denklem 2.39)',
              desc: '$n=4$ için parametre $D_i$:',
              math: '$$D_i = \\frac{1}{4} \\operatorname{arsinh}\\left(\\frac{1}{0.022393}\\right) = 1.123072$$\n$$\\sinh(D_i) = 1.374502, \\quad \\cosh(D_i) = 1.699781$$'
            },
            {
              stepTitle: 'Adım 3: İletim Sıfırları ve Evrilmiş Kutuplar (Denklem 2.40 - 2.47)',
              desc: 'İki adet sonlu sıfır çifti ve iki adet kuadratik kutup çifti:',
              math: '$$\\text{Sıfırlar: } \\omega_{z0} = \\frac{1}{\\cos(\\pi/8)} = 1.082392, \\quad \\omega_{z1} = \\frac{1}{\\cos(3\\pi/8)} = 2.613126$$\n$$\\text{Kat 1 Kutbu: } \\sigma_0 = -0.191774, \\quad \\omega_0 = -0.572549 \\implies p_{1,2} = -0.191774 \\pm j 0.572549$$\n$$\\text{Kat 2 Kutbu: } \\sigma_1 = -0.623801, \\quad \\omega_1 = -0.319535 \\implies p_{3,4} = -0.623801 \\pm j 0.319535$$'
            },
            {
              stepTitle: 'Adım 4: Normalize Transfer Fonksiyonu (Denklem 2.54a)',
              desc: 'Normalize edilmiş 4. derece transfer fonksiyonu:',
              math: '$$H_{I,4}(S) = 0.022387 \\cdot \\frac{S^2 + 4.6863}{S^2 + 0.76710 S + 1.4584} \\cdot \\frac{S^2 + 27.314}{S^2 + 2.4952 S + 1.9649}$$\n$$\\text{WFilter Doğrulaması: } G = 2.23870E-02, \\quad \\text{Sıfır 1: } 4.6863, \\quad \\text{Sıfır 2: } 27.314$$'
            }
          ]
        }
      ],
      pros: [
        'Geçirme bandı Butterworth gibi tamamen düzdür (sıfır dalgalanma).',
        'Faz yanıtı ve grup gecikmesi standart Chebyshev\'e göre çok daha doğrusaldır.',
        'Durdurma bandındaki iletim sıfırları sayesinde belirli frekanslarda sonsuz bastırma ($-\\infty\\text{ dB}$) sağlar.'
      ],
      cons: [
        'Sanal eksen sıfırları içerdiği için standart Sallen-Key devresi yerine Twin-Tee veya durum-değişkenli aktif filtre gerektirir.'
      ]
    },

    elliptic: {
      id: 'elliptic',
      title: 'Eliptik Yaklaşımı (Cauer Filtresi - Çift Eşit Dalgalı)',
      badge: 'Bölüm 2.5 & Kitap Denklem 2.55 - 2.79',
      color: '#8b5cf6',
      summary: 'Hem geçirme hem de durdurma bandında dalgalanmaya izin vererek, verilen toleransları kuramsal olarak sağlayan EN DÜŞÜK filtre derecesini (N) ve en dik geçiş bandını veren optimum yaklaşım.',
      svgMag: `
        <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="50" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="50" y1="25" x2="50" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
          <polygon points="47,25 50,18 53,25" fill="#2f2e2b" />

          <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">ω_pass (1.0)</text>
          <text x="215" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">ω_stop</text>
          <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

          <text x="44" y="64" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="44" y="149" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="50" y1="85" x2="170" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="170" y1="30" x2="170" y2="170" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="215" y1="30" x2="215" y2="170" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="215" y1="145" x2="430" y2="145" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Super steep transition + equiripple in both bands -->
          <path d="M 50,60 C 70,60 85,85 105,60 C 125,85 145,60 170,85 L 210,175 L 230,146 L 260,175 L 290,146 L 340,175 L 430,147" fill="none" stroke="#8b5cf6" stroke-width="3" />
          <text x="135" y="52" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#8b5cf6">Ultra Dik Geçiş (Çift Eşit Dalgalı)</text>
        </svg>
      `,
      svgPoles: `
        <svg viewBox="0 0 260 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 200px; width: 100%;">
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Elliptic close poles with high Q -->
          <text x="116" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#8b5cf6">×</text>
          <text x="100" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#8b5cf6">×</text>
          <text x="116" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#8b5cf6">×</text>

          <!-- Transmission Zeros very close to passband edge -->
          <circle cx="130" cy="40" r="4.5" fill="#ffffff" stroke="#8b5cf6" stroke-width="2.2" />
          <circle cx="130" cy="170" r="4.5" fill="#ffffff" stroke="#8b5cf6" stroke-width="2.2" />
          <text x="140" y="44" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#8b5cf6">±jω_z1</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Seçicilik Faktörü (k) ve Jacobi Eliptik Modülleri (Denklem 2.55 - 2.58)',
          desc: 'Geçiş bandı seçicilik faktörü $k = r_t$ ve tolerans oranı $k_1 = k_n$ tanımlanır:',
          math: '$$r_t = k = \\frac{\\omega_{\\text{pass}}}{\\omega_{\\text{stop}}}, \\quad k_n = k_1 = \\frac{\\sqrt{10^{-0.1 a_{\\text{pass}}} - 1}}{\\sqrt{10^{-0.1 a_{\\text{stop}}} - 1}}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Tam Eliptik İntegraller (CEI) ve Minimum Derece Hesabı (Denklem 2.59 - 2.61)',
          desc: 'Birinci tür tam eliptik integraller $K(k)$ hesaplanarak teorik minimum derece bulunur:',
          math: '$$n_E \\ge \\frac{K(r_t) \\cdot K(\\sqrt{1 - k_n^2})}{K(\\sqrt{1 - r_t^2}) \\cdot K(k_n)}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Jacobi sn/cn Fonksiyonları ile Sıfırlar ve Kutuplar (Denklem 2.62 - 2.72)',
          desc: 'Sanal eksen iletim sıfırları ve sol yarı düzlem kutupları Jacobi eliptik fonksiyonlarıyla hesaplanır:',
          math: '$$\\omega_{z,m} = \\frac{1}{r_t \\operatorname{sn}\\left( \\frac{2m+1}{n} K(r_t), r_t \\right)}$$\n$$p_m = \\sigma_m + j \\omega_m, \\quad \\text{Tek } n \\text{ için reel kutup: } \\sigma_R$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Biquad Katsayıları ve Çift Derece Kazanç Ayarı (Denklem 2.73 - 2.79)',
          desc: 'Sıfır içeren kuadratik katlar oluşturulur. Çift derecede $G = 10^{0.05 a_{\\text{pass}}}$ uygulanır:',
          math: '$$H_{E}(S) = G \\prod_m \\frac{S^2 + \\omega_{z,m}^2}{S^2 + B_{1,m} S + B_{2,m}} \\cdot \\frac{B_{2,m}}{\\omega_{z,m}^2}$$'
        }
      ],
      examples: [
        {
          id: 'ex2_9',
          badge: 'Örnek 2.9 (Kitap Sayfa 58) - Tek Derece (n = 3)',
          title: 'Eliptik (Cauer) 3. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -34.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Modüller ve Derece (n) Hesabı (Denklem 2.55 - 2.61)',
              desc: 'Seçicilik faktörleri ve tam eliptik integraller ile derece hesaplanır:',
              math: '$$r_t = 0.50, \\quad k_n = \\frac{\\sqrt{10^{0.1}-1}}{\\sqrt{10^{3.4}-1}} = 0.010153$$\n$$K(0.50) = 1.685750, \\quad K(k_n) = 1.570838$$\n$$n_E = \\frac{1.685750 \\cdot 5.9754}{2.156516 \\cdot 1.570838} = 2.87 \\implies n = 3 \\text{ (Tek Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: İletim Sıfırları ve Kutup Konumları (Denklem 2.62 - 2.72)',
              desc: 'Jacobi fonksiyonları ile hesaplanan sıfırlar ve kutuplar:',
              math: '$$\\text{İletim Sıfırı: } \\omega_{z0} = 2.270068 \\implies S^2 + (2.270068)^2 = S^2 + 5.153209$$\n$$\\text{1. Derece Gerçel Kutup: } \\sigma_R = -0.539954, \\quad \\omega_R = 0$$\n$$\\text{Kompleks Kutup Çifti: } \\sigma_0 = -0.217032, \\quad \\omega_0 = 0.981575$$'
            },
            {
              stepTitle: 'Adım 3: Kuadratik Biquad Katsayıları ve Transfer Fonksiyonu (Denklem 2.73)',
              desc: '$n=3$ için tam normalize transfer fonksiyonu:',
              math: '$$B_{1,0} = -2\\sigma_0 = 0.434064, \\quad B_{2,0} = \\sigma_0^2 + \\omega_0^2 = 1.010590$$\n$$H_{E,3}(S) = \\frac{0.539954}{S + 0.539954} \\cdot \\frac{0.196109 (S^2 + 5.153209)}{S^2 + 0.434064 S + 1.010590}$$\n$$\\text{WFilter Doğrulaması: } G = 1.96108843E-01, \\quad \\text{Pay: } S^2 + 5.153209, \\quad \\text{Payda: } S^2 + 0.434064 S + 1.010590$$'
            }
          ]
        },
        {
          id: 'ex2_10',
          badge: 'Örnek 2.10 (Kitap Sayfa 60) - Çift Derece (n = 4)',
          title: 'Eliptik (Cauer) 4. Derece Normalize Transfer Fonksiyonu',
          specs: 'Spesifikasyonlar: $a_{\\text{pass}} = -1.0\\text{ dB}, a_{\\text{stop}} = -51.0\\text{ dB}, \\omega_{\\text{pass}} = 1.0\\text{ rad/s}, \\omega_{\\text{stop}} = 2.0\\text{ rad/s}$',
          solutionSteps: [
            {
              stepTitle: 'Adım 1: Modüller ve Derece (n) Hesabı (Denklem 2.55 - 2.61)',
              desc: '$-51\\text{ dB}$ durdurma zayıflaması için Eliptik filtre derecesi:',
              math: '$$r_t = 0.50, \\quad k_n = 0.00143413$$\n$$K(r_t) = 1.685750, \\quad K(k_n) = 1.570797, \\quad v_0 = 0.383119$$\n$$n_E = \\frac{1.685750 \\cdot 7.933494}{2.156516 \\cdot 1.570797} = 3.95 \\implies n = 4 \\text{ (Çift Derece)}$$'
            },
            {
              stepTitle: 'Adım 2: İletim Sıfırları ve Kutup Konumları (Denklem 2.62 - 2.72)',
              desc: 'İki adet iletim sıfırı ve iki adet kuadratik kutup çifti:',
              math: '$$\\text{Sıfırlar: } \\omega_{z0} = 4.922113 \\implies S^2 + 24.22720, \\quad \\omega_{z1} = 2.143189 \\implies S^2 + 4.59326$$\n$$\\text{Kat 1 Kutbu: } \\sigma_0 = -0.351273, \\quad \\omega_0 = 0.442498 \\implies B_{1,0} = 0.702546, \\quad B_{2,0} = 0.319197$$\n$$\\text{Kat 2 Kutbu: } \\sigma_1 = -0.121478, \\quad \\omega_1 = 0.989176 \\implies B_{1,1} = 0.242957, \\quad B_{2,1} = 0.993226$$'
            },
            {
              stepTitle: 'Adım 3: DC Kazanç Ayarı ve Nihai Transfer Fonksiyonu (Denklem 2.73 - 2.79)',
              desc: '$n=4$ çift derece kazanç düzeltmesi $G = 10^{0.05(-1)} = 0.891251$ ile birleştirilerek genel kazanç çarpanı $K_g$ bulunur:',
              math: '$$K_g = 0.891251 \\cdot \\frac{B_{2,0}}{\\omega_{z0}^2} \\cdot \\frac{B_{2,1}}{\\omega_{z1}^2} = 0.002539115$$\n$$H_{E,4}(S) = 0.0025391 \\cdot \\frac{S^2 + 24.2272}{S^2 + 0.702546 S + 0.319197} \\cdot \\frac{S^2 + 4.59326}{S^2 + 0.242957 S + 0.993226}$$\n$$\\text{WFilter Doğrulaması: } G = 2.53911537E-03, \\quad \\text{Kat 1 Payda: } S^2 + 0.702546 S + 0.319197, \\quad \\text{Kat 2: } S^2 + 0.242957 S + 0.993226$$'
            }
          ]
        }
      ],
      pros: [
        'Belirli bir geçiş bandı ve tolerans için gereken EN KÜÇÜK filtre derecesini ($N$) verir.',
        'Geçiş bandı dikliği (roll-off) tüm klasik filtreler arasında en yüksektir.',
        'Donanımda en az sayıda op-amp ve pasif bileşenle hedefe ulaşır.'
      ],
      cons: [
        'Faz yanıtı en doğrusal olmayan filtredir; grup gecikmesinde şiddetli bozulmalar yaratır.',
        'Basamak yanıtında belirgin çınlama (ringing) ve yüksek aşım görülür.',
        'Bileşen toleranslarına ($R, C$) karşı hassasiyeti (sensitivity) oldukça yüksektir.'
      ]
    }
  };

  let overlayEl = null;
  let currentActiveApprox = 'butterworth';

  function init() {
    overlayEl = document.getElementById('approxModalOverlay');
    if (!overlayEl) return;

    // Close button
    const closeBtn = document.getElementById('closeApproxModalBtn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    // Overlay click to close
    overlayEl.addEventListener('click', (e) => {
      if (e.target === overlayEl) close();
    });

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlayEl.style.display !== 'none') {
        close();
      }
    });

    // Hook approx tab buttons inside the modal
    const tabBtns = overlayEl.querySelectorAll('[data-approx-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const approxKey = btn.getAttribute('data-approx-tab');
        renderApproxContent(approxKey);
      });
    });

    // Hook external trigger buttons
    setupTriggers();
  }

  function setupTriggers() {
    // 1. Parameter Input Card button
    const btnParam = document.getElementById('btnApproxInfoModal');
    if (btnParam) {
      btnParam.addEventListener('click', () => {
        const activeBtn = document.querySelector('.segmented-control [data-approx].active');
        const activeApprox = activeBtn ? activeBtn.getAttribute('data-approx') : 'butterworth';
        open(activeApprox);
      });
    }

    // 2. Sidebar Navigation Item
    const navItem = document.getElementById('navApproxGuide');
    if (navItem) {
      navItem.addEventListener('click', () => {
        const activeBtn = document.querySelector('.segmented-control [data-approx].active');
        const activeApprox = activeBtn ? activeBtn.getAttribute('data-approx') : 'butterworth';
        open(activeApprox);
      });
    }

    // 3. Delegate clicks on elements with data-open-approx-modal
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-approx-modal]');
      if (trigger) {
        e.preventDefault();
        const app = trigger.getAttribute('data-open-approx-modal') || 'butterworth';
        open(app);
      }
    });
  }

  function open(approx = 'butterworth') {
    if (!overlayEl) init();
    if (!overlayEl) return;

    currentActiveApprox = APPROX_DATA[approx] ? approx : 'butterworth';
    overlayEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderApproxContent(currentActiveApprox);
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  function renderApproxContent(approxKey) {
    currentActiveApprox = approxKey;
    const data = APPROX_DATA[approxKey] || APPROX_DATA.butterworth;

    // Update active tab buttons
    if (overlayEl) {
      overlayEl.querySelectorAll('[data-approx-tab]').forEach(btn => {
        if (btn.getAttribute('data-approx-tab') === approxKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    const container = document.getElementById('approxModalBody');
    if (!container) return;

    let stepsHtml = '';
    data.steps.forEach(s => {
      stepsHtml += `
        <div style="background: #fff; border: 1px solid var(--border); border-left: 4px solid ${data.color}; border-radius: var(--radius-sm); padding: 14px 16px; margin-bottom: 12px; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="stage-badge" style="background: ${data.color}; color: #fff; font-weight: 700;">${s.stepNum}</span>
            <strong style="font-size: 13.5px; color: var(--text-h);">${s.title}</strong>
          </div>
          <p style="font-size: 13px; color: var(--muted); margin: 0 0 8px;">${s.desc}</p>
          <div class="math-block" style="background: #fafaf9; padding: 10px 12px; border-radius: 4px; overflow-x: auto; margin: 0;">
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
            <div style="background: #fafaf9; border-left: 3px solid ${data.color}; border-radius: 4px; padding: 10px 12px; margin-bottom: 8px;">
              <strong style="color: ${data.color}; font-size: 12.5px;">${st.stepTitle}</strong>
              <p style="font-size: 12px; color: var(--muted); margin: 3px 0 6px;">${st.desc}</p>
              <div class="math-block" style="background: #fff; padding: 8px 10px; border-radius: 4px; margin: 0; overflow-x: auto; font-size: 12px;">
                ${st.math}
              </div>
            </div>
          `;
        });

        examplesHtml += `
          <div style="background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 14px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
              <div>
                <span class="stage-badge" style="background: rgba(61,90,254,0.08); color: ${data.color}; font-weight: 700;">${ex.badge}</span>
                <h4 style="margin: 4px 0 2px; font-size: 15px; font-weight: 700; color: var(--text-h);">${ex.title}</h4>
                <div style="font-size: 12px; color: var(--muted);">${ex.specs}</div>
              </div>
              <button type="button" class="btn btn-sm btn-outline" data-load-modal-ex="${ex.id}" style="color: ${data.color}; border-color: ${data.color}; font-size: 11.5px; font-weight: 600; cursor: pointer;">
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

    container.innerHTML = `
      <div class="type-detail-body">
        
        <!-- Header Banner -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
          <div>
            <span class="stage-badge" style="background: rgba(61,90,254,0.08); color: ${data.color};">${data.badge}</span>
            <h3 style="font-size: 20px; font-weight: 700; color: var(--text-h); margin: 6px 0 4px;">${data.title}</h3>
            <p style="font-size: 13.5px; color: var(--muted); margin: 0;">${data.summary}</p>
          </div>
          <button class="btn btn-primary" id="btnApplyApproxToDesigner" style="background: ${data.color}; border-color: ${data.color}; flex-shrink: 0;">
            🚀 Bu Yaklaşımı Tasarımcıya Yükle
          </button>
        </div>

        <!-- Row 1: Dual SVG (Frequency Response & s-Plane Pole-Zero) -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>📊 Frekans Büyüklük Yanıtı (|H(jω)|)</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgMag}
            </div>
          </div>

          <div class="type-detail-section">
            <h4>🎯 s-Düzleminde Kutup ve Sıfır Dağılımı</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svgPoles}
            </div>
          </div>
        </div>

        <!-- Row 2: Step-by-Step Mathematical Algorithm -->
        <div class="type-detail-section">
          <h4>📐 Adım Adım Analitik Tasarım Algoritması ve Tüm Formüller (Bölüm 2)</h4>
          <div style="margin-top: 10px;">
            ${stepsHtml}
          </div>
        </div>

        <!-- Row 3: Step-by-Step Textbook Numerical Examples (Odd & Even Order) -->
        <div class="type-detail-section">
          <h4>📚 Kitaptaki Adım Adım Sayısal Çözüm Örnekleri (Tek ve Çift Derece)</h4>
          <p style="font-size: 13px; color: var(--muted); margin: 0 0 12px;">Les Thede'in "Practical Analog and Digital Filter Design" kitabında yer alan sayısal örnekler, yukarıdaki adımlar ve formüller birebir uygulanarak detaylı şekilde çözülmüştür:</p>
          <div style="margin-top: 10px;">
            ${examplesHtml}
          </div>
        </div>

        <!-- Row 4: Pros, Cons & Engineering Performance -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>🌟 Avantajları ve Güçlü Yönleri</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${prosHtml}
            </ul>
          </div>

          <div class="type-detail-section">
            <h4>⚠️ Dikkat Edilmesi Gereken Kısıtlar</h4>
            <ul style="list-style: none; padding-left: 0; margin: 0; font-size: 13px; line-height: 1.55;">
              ${consHtml}
            </ul>
          </div>
        </div>

      </div>
    `;

    // Hook "Bu Yaklaşımı Tasarımcıya Yükle" button
    const applyBtn = document.getElementById('btnApplyApproxToDesigner');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        close();
        if (window.FilterStudio && typeof window.FilterStudio.setApprox === 'function') {
          window.FilterStudio.setApprox(data.id);
        } else {
          const btn = document.querySelector(`.segmented-control [data-approx="${data.id}"]`);
          if (btn) btn.click();
          window.location.hash = '#/designer';
        }
      });
    }

    // Hook example buttons [data-load-modal-ex]
    container.querySelectorAll('[data-load-modal-ex]').forEach(btn => {
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
      window.renderMathInElement(container, {
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
  window.FilterApproxModal = FilterApproxModal;
}

if (typeof module !== 'undefined') module.exports = FilterApproxModal;
