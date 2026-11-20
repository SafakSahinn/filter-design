/**
 * FilterDesign Studio - Normalized Filter Approximations Modal Module
 * Detailed mathematical derivations, formulas, pole-zero distributions, SVG diagrams,
 * and step-by-step algorithms for Butterworth, Chebyshev I, Inverse Chebyshev, and Elliptic filters.
 */

const FilterApproxModal = (() => {
  const APPROX_DATA = {
    butterworth: {
      id: 'butterworth',
      title: 'Butterworth Yaklaşımı (Maksimum Düz - Maximally Flat)',
      badge: 'Bölüm 2.2 & Kitap Denklem 2.6 - 2.15',
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
          <text x="44" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-3 dB</text>
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
          <!-- Real & Imaginary Axes -->
          <line x1="20" y1="105" x2="240" y2="105" stroke="#787774" stroke-width="1.5" />
          <line x1="130" y1="20" x2="130" y2="190" stroke="#787774" stroke-width="1.5" />
          <text x="235" y="120" font-family="Inter, sans-serif" font-size="11" fill="#787774">σ</text>
          <text x="135" y="30" font-family="Inter, sans-serif" font-size="11" fill="#787774">jω</text>

          <!-- Unit Circle (R = 65) -->
          <circle cx="130" cy="105" r="65" fill="none" stroke="#e0deda" stroke-width="1.8" stroke-dasharray="4,4" />
          <text x="135" y="175" font-family="Inter, sans-serif" font-size="9.5" fill="#9ca3af">Birim Çember (R=1)</text>

          <!-- Poles for n=3 (theta = 30, 90, 150) on LHS -->
          <!-- p1: theta=30 deg => re = -sin(30)=-0.5, im = cos(30)=0.866 => x = 130 - 32.5 = 97.5, y = 105 - 56.3 = 48.7 -->
          <text x="97" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <!-- p2: real pole theta=90 => re = -1.0, im = 0 => x = 130 - 65 = 65, y = 105 -->
          <text x="65" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#3d5afe">×</text>
          <!-- p3: theta=150 deg => re = -0.5, im = -0.866 => x = 97.5, y = 105 + 56.3 = 161.3 -->
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
      badge: 'Bölüm 2.3 & Kitap Denklem 2.16 - 2.26',
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
          <!-- p1: sigma = -sinh(g)*sin(30), omega = cosh(g)*cos(30) -->
          <text x="112" y="52" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <!-- p2: real pole sigma = -sinh(g), omega=0 -->
          <text x="95" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>
          <!-- p3: conjugate of p1 -->
          <text x="112" y="166" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#ef4444">×</text>

          <text x="75" y="85" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#ef4444">p₁, p₂, p₃</text>
        </svg>
      `,
      steps: [
        {
          stepNum: 'Adım 1',
          title: 'Dalgalanma Faktörü (ε) ve Filtre Derecesi (n) Hesabı (Denklem 2.18)',
          desc: 'Geçirme bandı zayıflamasından $\\epsilon$ dalgalanma faktörü ve ters hiperbolik kosinüs ile derece $n$ bulunur:',
          math: '$$\\epsilon = \\sqrt{10^{-a_{\\text{pass}}/10} - 1}$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{-a_{\\text{stop}}/10} - 1}{\\epsilon^2}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Elips Parametresi (γ) ve Kutup Konumları (Denklem 2.21)',
          desc: 'Chebyshev kutupları odakları $\\pm j$ sanal ekseninde olan bir elips üzerinde yer alır:',
          math: '$$\\gamma = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon}\\right)$$\n$$\\sigma_k = -\\sinh(\\gamma) \\sin(\\theta_k), \\quad \\omega_k = \\cosh(\\gamma) \\cos(\\theta_k)$$\n$$p_k = \\sigma_k + j \\omega_k, \\quad \\theta_k = \\frac{2k - 1}{2n}\\pi$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Kuadratik Çarpanlar ve Katsayı Eşleme',
          desc: 'Eşlenik kutup çiftleri çarpılarak ikinci derece faktörler ($s^2 + b_1 s + b_2$) elde edilir:',
          math: '$$b_1 = -2\\sigma_k = 2\\sinh(\\gamma)\\sin(\\theta_k)$$\n$$b_2 = \\sigma_k^2 + \\omega_k^2 = \\sinh^2(\\gamma)\\sin^2(\\theta_k) + \\cosh^2(\\gamma)\\cos^2(\\theta_k)$$\n$$Q = \\frac{\\sqrt{b_2}}{b_1}$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Çift Derecelerde DC Kazanç Düzeltmesi (Denklem 2.25)',
          desc: '$n$ çift sayı olduğunda $\\omega=0$\'da polinom $C_n(0)=1$ olduğu için DC kazancı $1/\\sqrt{1+\\epsilon^2} = 10^{a_{\\text{pass}}/20}$ olur. Bu kazanç kaybı çıkıştaki aktif gerilim bölücü ile dengelenir.',
          math: '$$H(0) = \\begin{cases} 1.0 (0\\text{ dB}), & n \\text{ tek ise} \\\\ 10^{a_{\\text{pass}}/20}, & n \\text{ çift ise} \\end{cases}$$'
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
      badge: 'Bölüm 2.4 & Kitap Denklem 2.27 - 2.32',
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
          title: 'Durdurma Faktörü (ε_s) ve Derece (n) Hesabı (Denklem 2.27)',
          desc: 'Ters Chebyshev prototipinde dalgalanma geçirme bandında değil durdurma bandında yer aldığından parametre $\\epsilon_s$ ile başlanır:',
          math: '$$\\epsilon_s = \\frac{1}{\\sqrt{10^{-a_{\\text{stop}}/10} - 1}}$$\n$$n \\ge \\frac{\\operatorname{arcosh}\\left(\\frac{1}{\\epsilon_s \\sqrt{10^{-a_{\\text{pass}}/10} - 1}}\\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'jω Sanal Eksenindeki İletim Sıfırlarının (Zeros) Konumu',
          desc: 'Chebyshev polinomunun kökleri sanal eksende tam sıfırlama noktaları ($-\\infty\\text{ dB}$) oluşturur:',
          math: '$$\\omega_{z,k} = \\frac{1}{\\cos(\\theta_k)}, \\quad \\theta_k = \\frac{2k - 1}{2n}\\pi \\quad (\\cos\\theta_k \\ne 0)$$\n$$z_k = \\pm j \\omega_{z,k}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Kutupların Chebyshev Kutuplarının Terslenmesiyle Eldesi',
          desc: 'Standart Chebyshev kutup koordinatları ters çevrilerek ($p_k\' = 1/p_{ch,k}$) sol yarı düzlem kutupları oluşturulur:',
          math: '$$p_k = \\frac{\\sigma_{ch,k} - j \\omega_{ch,k}}{\\sigma_{ch,k}^2 + \\omega_{ch,k}^2}, \\quad \\gamma = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon_s}\\right)$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'Sıfır İçeren İkinci Derece Biquad Faktörün Normalize Edilmesi',
          desc: 'DC kazancının ($s=0$) tam $1.0$ ($0\\text{ dB}$) olması için pay katsayısı normalize edilir:',
          math: '$$H_k(s) = \\frac{\\frac{b_{2k}}{\\omega_{zk}^2} s^2 + b_{2k}}{s^2 + b_{1k} s + b_{2k}}$$'
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
      badge: 'Bölüm 2.5 & Kitap Denklem 2.33 - 2.40',
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
          title: 'Seçicilik Faktörü (k) ve Jacobi Eliptik Modülü',
          desc: 'Geçiş bandı dikliği $k$ modülü ile, tolerans oranları ise $k_1$ ile tanımlanır:',
          math: '$$k = \\frac{\\omega_{\\text{pass}}}{\\omega_{\\text{stop}}}, \\quad k_1 = \\frac{\\sqrt{10^{-a_{\\text{pass}}/10} - 1}}{\\sqrt{10^{-a_{\\text{stop}}/10} - 1}}$$'
        },
        {
          stepNum: 'Adım 2',
          title: 'Eliptik Nome Fonksiyonu ile Minimum Derece Hesabı (Denklem 2.37)',
          desc: 'Eliptik fonksiyonların nome parametresi $q$ kullanılarak kuramsal minimum derece $n$ bulunur:',
          math: '$$q = \\text{nome}(k), \\quad q_1 = \\text{nome}(k_1)$$\n$$n \\ge \\frac{\\ln(16 / q_1)}{\\ln(1 / q)}$$'
        },
        {
          stepNum: 'Adım 3',
          title: 'Jacobi sn/cn Fonksiyonları ile Sıfırların ve Kutupların Konumu',
          desc: 'İletim sıfırları $\\omega_{\\text{stop}}$ üzerinde yer alır ve geçiş bandını aşırı dikleştirir:',
          math: '$$\\omega_{z,k} = \\frac{1}{k \\operatorname{sn}\\left(\\frac{2k-1}{n} K, k\\right)}$$'
        },
        {
          stepNum: 'Adım 4',
          title: 'İkinci Derece Faktörlerin Ayrıştırılması ve Katsayı Normalizasyonu',
          desc: 'Her kuadratik kat payında sıfır ($s^2 + \\omega_{zk}^2$) ve paydasında kutup ($s^2 + b_1 s + b_2$) barındırır:',
          math: '$$H_k(s) = \\frac{\\frac{b_{2k}}{\\omega_{zk}^2} s^2 + b_{2k}}{s^2 + b_{1k} s + b_{2k}}$$'
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
        <div style="background: var(--panel); padding: 12px 16px; border-radius: var(--radius-sm); border-left: 3px solid ${data.color}; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${data.color}; background: rgba(0,0,0,0.04); padding: 2px 6px; border-radius: 3px;">${s.stepNum}</span>
            <span style="font-size: 13px; font-weight: 700; color: var(--text-h);">${s.title}</span>
          </div>
          <p style="font-size: 12.5px; color: var(--text); margin: 4px 0 8px;">${s.desc}</p>
          <div class="math-block" style="padding: 10px; margin: 4px 0 0; font-size: 13.5px; background: #fff;">
            ${s.math}
          </div>
        </div>
      `;
    });

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

        <!-- Row 3: Pros, Cons & Engineering Performance -->
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
