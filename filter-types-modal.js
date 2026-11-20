/**
 * FilterDesign Studio - Filter Types Comprehensive Guide Modal Module
 * Detailed mathematical derivations, formulas, SVG diagrams, and op-amp topologies
 * for Lowpass, Highpass, Bandpass, and Bandstop/Notch filters.
 */

const FilterTypesModal = (() => {
  const TYPE_DATA = {
    lowpass: {
      id: 'lowpass',
      title: 'Alçak Geçiren Filtre (Lowpass Filter - LP)',
      badge: 'Bölüm 1.1.1 & Bölüm 3.1 & Bölüm 4.2',
      color: '#3d5afe',
      summary: 'DC (0 Hz) frekansından kesim frekansına (f_pass) kadar olan sinyalleri minimum kayıpla geçirir, durdurma frekansı (f_stop) üzerindeki yüksek frekansları söndürür.',
      svg: `
        <svg viewBox="0 0 500 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 220px; width: 100%;">
          <rect x="55" y="30" width="130" height="150" fill="rgba(47, 158, 110, 0.08)" />
          <rect x="185" y="30" width="95" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="280" y="30" width="190" height="150" fill="rgba(235, 87, 87, 0.08)" />

          <text x="120" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme Bandı (Passband)</text>
          <text x="232" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#b45309">Geçiş Bandı</text>
          <text x="375" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">Durdurma Bandı (Stopband)</text>

          <line x1="55" y1="180" x2="475" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="55" y1="25" x2="55" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="475,177 482,180 475,183" fill="#2f2e2b" />
          <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

          <line x1="185" y1="180" x2="185" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="280" y1="180" x2="280" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="185" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#2f9e6e">f_pass (ω_pass)</text>
          <text x="280" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#eb5757">f_stop (ω_stop)</text>
          <text x="470" y="202" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f / ω) →</text>

          <line x1="50" y1="70" x2="55" y2="70" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="92" x2="55" y2="92" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="150" x2="55" y2="150" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="48" y="74" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="48" y="96" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="48" y="154" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="55" y1="92" x2="185" y2="92" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="185" y1="30" x2="185" y2="180" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="280" y1="30" x2="280" y2="180" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="280" y1="150" x2="475" y2="150" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Ideal Brick-wall (dashed gray) -->
          <path d="M 55,70 L 185,70 L 185,175 L 475,175" fill="none" stroke="#9ca3af" stroke-width="1.8" stroke-dasharray="4,4" />
          <!-- Practical curve (bold blue) -->
          <path d="M 55,70 C 140,70 170,75 185,92 C 205,115 250,145 280,150 C 330,156 400,162 475,166" fill="none" stroke="#3d5afe" stroke-width="3" />
        </svg>
      `,
      specs: [
        { label: 'Geçirme Bandı (Passband)', desc: '$0 \\le f \\le f_{\\text{pass}}$ aralığı. Zayıflama en fazla $a_{\\text{pass}}\\text{ dB}$ (tipik $0.1 \\dots 3\\text{ dB}$).' },
        { label: 'Durdurma Bandı (Stopband)', desc: '$f \\ge f_{\\text{stop}}$ aralığı. Zayıflama en az $a_{\\text{stop}}\\text{ dB}$ (tipik $20 \\dots 80\\text{ dB}$).' },
        { label: 'Geçiş Oranı (Transition Ratio)', desc: '$r = f_{\\text{stop}} / f_{\\text{pass}} > 1$. $r$ bire ne kadar yaklaşırsa gereken derece ($N$) o kadar artar.' },
        { label: 'DC Frekans Davranışı', desc: '$f = 0\\text{ Hz}$ noktasında kazanç tam $1.0$ ($0\\text{ dB}$) seviyesindedir.' }
      ],
      mathContent: `
        <p><strong>1. Frekans Normalizasyonu ve Ölçekleme (Denklem 3.1):</strong></p>
        <p>Standart normalize alçak geçiren filtre prototipinde kesim frekansı $\\Omega_0 = 1\\text{ rad/s}$'dir. Hedeflenen gerçek kesim frekansı $\\omega_0 = 2\\pi f_{\\text{pass}}$ değerine dönüştürmek için karmaşık frekans değişkeni $s$, şu dönüşüm operatörü ile ölçeklenir:</p>
        <div class="math-block">
          $$S = \\frac{s}{\\omega_0} \\implies s = S \\cdot \\omega_0$$
        </div>
        <p><strong>2. Birinci Derece (1st-Order) Kat Transfer Fonksiyonu:</strong></p>
        <div class="math-block">
          $$H_1(s) = \\frac{\\omega_0}{s + \\omega_0} = \\frac{b_2}{s + b_2} \\quad (b_2 = b_0 \\omega_0)$$
        </div>
        <p><strong>3. İkinci Derece (Biquad) Kat Transfer Fonksiyonu (Denklem 3.4):</strong></p>
        <div class="math-block">
          $$H_2(s) = \\frac{b_2 \\omega_0^2}{s^2 + (b_1 \\omega_0) s + (b_2 \\omega_0^2)}$$
        </div>
        <p>Her kutup çifti, yüksek frekansta ($s = j\\omega \\gg \\omega_0$) kazancı $-40\\text{ dB/decade}$ eğimle düşürür ($N$ dereceli filtre toplamda $-20N\\text{ dB/decade}$ eğime sahiptir).</p>
      `,
      circuitContent: `
        <p><strong>Sallen-Key Eşit Bileşenli (Equal-Component) Alçak Geçiren Devre (Şekil 4.4):</strong></p>
        <p>Tasarım kolaylığı sağlamak adına her iki kondansatör eşit seçilir ($C_1 = C_2 = C$):</p>
        <div class="math-block">
          $$R_1 = R_2 = R = \\frac{1}{C \\sqrt{b_2}}$$
          $$K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A \\quad (R_A = 10\\text{ k}\\Omega)$$
        </div>
        <p><strong>Tek Dereceli Katlar ($N=1, 3, 5$):</strong> Pasif $RC$ alçak geçiren ve ardından gerilim izleyici tampon op-amp ile gerçekleştirilir ($R = \\frac{1}{b_2 C}$).</p>
      `,
      apps: [
        '<strong>Anti-Aliasing (Örtüşme Önleme):</strong> Analog-dijital dönüştürücü (ADC) girişinde, Nyquist frekansı ($f_s / 2$) üzerindeki gürültülerin örnekleme bandına katlanmasını önler.',
        '<strong>Doğrultucu ve Güç Kaynakları:</strong> Şebeke trafosu ve diyot köprüsünden sonra 50/100 Hz AC dalgalanmasını yok edip saf DC gerilim üretir.',
        '<strong>Ses Sistemleri (Crossover):</strong> Subwoofer ve bas hoparlörlerine giden sinyallerdeki tiz ve orta frekansları filtreler.'
      ]
    },

    highpass: {
      id: 'highpass',
      title: 'Yüksek Geçiren Filtre (Highpass Filter - HP)',
      badge: 'Bölüm 1.1.2 & Bölüm 3.2 & Bölüm 4.3',
      color: '#ef4444',
      summary: 'Alçak frekansları (0 Hz ile f_stop arası) bloke eder, durdurma frekansı üzerindeki yüksek frekanslı sinyalleri (f_pass ve yukarısı) minimum zayıflamayla geçirir.',
      svg: `
        <svg viewBox="0 0 500 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 220px; width: 100%;">
          <rect x="55" y="30" width="140" height="150" fill="rgba(235, 87, 87, 0.08)" />
          <rect x="195" y="30" width="90" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="285" y="30" width="185" height="150" fill="rgba(47, 158, 110, 0.08)" />

          <text x="125" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">Durdurma Bandı (Stopband)</text>
          <text x="240" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#b45309">Geçiş Bandı</text>
          <text x="375" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme Bandı (Passband)</text>

          <line x1="55" y1="180" x2="475" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="55" y1="25" x2="55" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="475,177 482,180 475,183" fill="#2f2e2b" />
          <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

          <line x1="195" y1="180" x2="195" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="285" y1="180" x2="285" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="195" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#eb5757">f_stop (ω_stop)</text>
          <text x="285" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#2f9e6e">f_pass (ω_pass)</text>
          <text x="470" y="202" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f / ω) →</text>

          <line x1="50" y1="70" x2="55" y2="70" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="92" x2="55" y2="92" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="150" x2="55" y2="150" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="48" y="74" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="48" y="96" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="48" y="154" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">-a_stop</text>

          <line x1="55" y1="150" x2="195" y2="150" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />
          <line x1="195" y1="30" x2="195" y2="180" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="285" y1="30" x2="285" y2="180" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="2,2" />
          <line x1="285" y1="92" x2="475" y2="92" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />

          <!-- Ideal curve (dashed gray) -->
          <path d="M 55,175 L 285,175 L 285,70 L 475,70" fill="none" stroke="#9ca3af" stroke-width="1.8" stroke-dasharray="4,4" />
          <!-- Practical curve (bold blue) -->
          <path d="M 55,166 C 120,162 170,156 195,150 C 225,140 260,110 285,92 C 310,75 360,70 475,70" fill="none" stroke="#3d5afe" stroke-width="3" />
        </svg>
      `,
      specs: [
        { label: 'Durdurma Bandı', desc: '$0 \\le f \\le f_{\\text{stop}}$ frekans bölgesi. Zayıflama en az $a_{\\text{stop}}\\text{ dB}$.' },
        { label: 'Geçirme Bandı', desc: '$f \\ge f_{\\text{pass}}$ ($f_{\\text{stop}} < f_{\\text{pass}}$). Zayıflama en fazla $a_{\\text{pass}}\\text{ dB}$.' },
        { label: 'Geçiş Oranı', desc: '$r = f_{\\text{pass}} / f_{\\text{stop}} > 1$.' },
        { label: 'DC Frekans Davranışı', desc: '$f = 0\\text{ Hz}$ noktasında kazanç tam $0.0$ ($-\\infty\\text{ dB}$) seviyesindedir (tam DC bloklama).' }
      ],
      mathContent: `
        <p><strong>1. Spektral Tersleme Frekans Dönüşümü (Denklem 3.10):</strong></p>
        <p>Alçak geçiren prototipteki frekans ekseni ters çevrilerek yüksek geçiren yanıta dönüştürülür:</p>
        <div class="math-block">
          $$S = \\frac{\\omega_0}{s} \\implies s = \\frac{\\omega_0}{S} \\quad (\\omega_0 = 2\\pi f_{\\text{pass}})$$
        </div>
        <p>Bu dönüşüm sayesinde prototipin $\\Omega = 0$ DC noktası $s \\rightarrow \\infty$'a, prototipin $\\Omega \\rightarrow \\infty$ sonsuz noktası ise $s = 0$ DC noktasına eşlenir.</p>
        <p><strong>2. İkinci Derece Yüksek Geçiren Biquad Formülü:</strong></p>
        <div class="math-block">
          $$H_2(s) = \\frac{s^2}{s^2 + \\left(\\frac{b_1 \\omega_0}{b_2}\\right) s + \\left(\\frac{\\omega_0^2}{b_2}\\right)}$$
        </div>
        <p>Paydaki $s^2$ terimi orijinde ($s=0$) iki adet iletim sıfırı oluşturur ve DC frekansında tam bloklama ($-\\infty\\text{ dB}$) sağlar.</p>
      `,
      circuitContent: `
        <p><strong>Sallen-Key Yüksek Geçiren Aktif Devre (Şekil 4.6):</strong></p>
        <p>Alçak geçiren Sallen-Key devresindeki dirençler ile kondansatörlerin yer değiştirmesiyle (RC dualite) elde edilir ($C_1 = C_2 = C$):</p>
        <div class="math-block">
          $$R = \\frac{1}{C \\sqrt{b_2}}, \\quad K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A$$
        </div>
      `,
      apps: [
        '<strong>DC Bloklama (Kapasitif Kuplaj):</strong> Amplifikatör katları arasında DC kutuplama gerilimini kesip sadece AC bilgi sinyalini iletir.',
        '<strong>Biyomedikal Sinyal İşleme:</strong> EKG ve EEG kayıtlarında hastanın nefes alıp vermesinden kaynaklanan düşük frekanslı solunum kaymalarını (< 0.5 Hz) temizler.',
        '<strong>Ses Sistemleri (Low-Cut):</strong> Mikrofonlardaki el sürtünmesi, rüzgar uğultusu ve sahne titreşimlerini keser.'
      ]
    },

    bandpass: {
      id: 'bandpass',
      title: 'Bant Geçiren Filtre (Bandpass Filter - BP)',
      badge: 'Bölüm 1.1.3 & Bölüm 3.3 & Bölüm 4.4',
      color: '#10b981',
      summary: 'Yalnızca belirli bir alt frekans (f_p1) ile üst frekans (f_p2) arasındaki sinyalleri geçirir; bandın dışındaki hem daha alçak hem daha yüksek frekansları söndürür.',
      svg: `
        <svg viewBox="0 0 500 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 220px; width: 100%;">
          <rect x="55" y="30" width="80" height="150" fill="rgba(235, 87, 87, 0.08)" />
          <rect x="135" y="30" width="55" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="190" y="30" width="130" height="150" fill="rgba(47, 158, 110, 0.08)" />
          <rect x="320" y="30" width="55" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="375" y="30" width="100" height="150" fill="rgba(235, 87, 87, 0.08)" />

          <text x="95" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#eb5757">Durdurma 1</text>
          <text x="255" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#2f9e6e">Geçirme Bandı (Passband)</text>
          <text x="425" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#eb5757">Durdurma 2</text>

          <line x1="55" y1="180" x2="475" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="55" y1="25" x2="55" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="475,177 482,180 475,183" fill="#2f2e2b" />
          <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

          <line x1="190" y1="180" x2="190" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="255" y1="180" x2="255" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="320" y1="180" x2="320" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="190" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">f_p1</text>
          <text x="255" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#3d5afe">f₀ (Merkez)</text>
          <text x="320" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">f_p2</text>
          <text x="470" y="202" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f) →</text>

          <line x1="50" y1="70" x2="55" y2="70" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="92" x2="55" y2="92" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="150" x2="55" y2="150" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="48" y="74" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="48" y="96" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="48" y="154" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">-a_stop</text>

          <!-- Practical curve (bold blue) -->
          <path d="M 55,166 C 95,162 125,155 135,145 C 160,120 180,95 190,92 C 215,80 235,70 255,70 C 275,70 295,80 320,92 C 330,95 350,120 375,145 C 385,155 415,162 475,166" fill="none" stroke="#3d5afe" stroke-width="3" />
        </svg>
      `,
      specs: [
        { label: 'Merkez Frekansı (f₀)', desc: 'Geometrik simetri kuralı gereği: $f_0 = \\sqrt{f_{\\text{p1}} \\cdot f_{\\text{p2}}}$.' },
        { label: 'Bant Genişliği (B)', desc: '$B = f_{\\text{p2}} - f_{\\text{p1}}$ (Hz cinsinden mutlak geçirme genişliği).' },
        { label: 'Kalite Faktörü (Q)', desc: '$Q = f_0 / B$. $Q > 10$ ise dar bant (keskin rezonans), $Q < 2$ ise geniş bant olarak adlandırılır.' },
        { label: 'Toplam Derece Katlanması', desc: 'Dönüşüm her prototip kutbunu çift kutba dönüştürdüğü için filtrenin gerçek derecesi $2N$ olur.' }
      ],
      mathContent: `
        <p><strong>1. Bant Geçiren Frekans Dönüşümü (Denklem 3.19):</strong></p>
        <div class="math-block">
          $$S = \\frac{s^2 + \\omega_0^2}{B s} \\quad (\\omega_0 = \\sqrt{\\omega_{\\text{p1}} \\omega_{\\text{p2}}}, \\quad B = \\omega_{\\text{p2}} - \\omega_{\\text{p1}})$$
        </div>
        <p>Bu dönüşüm, normalize alçak geçiren filtrenin $S = 0$ noktasını $s = \\pm j\\omega_0$ merkez rezonans frekansına taşır.</p>
        <p><strong>2. İkinci Derece Bant Geçiren Biquad Fonksiyonu:</strong></p>
        <div class="math-block">
          $$H_{BP}(s) = \\frac{K \\cdot B s}{s^2 + B s + \\omega_0^2} = \\frac{K \\cdot \\left(\\frac{\\omega_0}{Q}\\right) s}{s^2 + \\left(\\frac{\\omega_0}{Q}\\right) s + \\omega_0^2}$$
        </div>
      `,
      circuitContent: `
        <p><strong>Sallen-Key 2. Derece Bant Geçiren Aktif Katı (Şekil 4.8):</strong></p>
        <p>Direnç ve kapasite değerleri merkez frekans ve kalite faktöründen hesaplanır ($C_1 = C_2 = C$):</p>
        <div class="math-block">
          $$R_1 = \\frac{Q}{\\omega_0 C}, \\quad R_2 = \\frac{1}{2 Q \\omega_0 C}$$
          $$K = 2.0, \\quad R_B = R_A = 10\\text{ k}\\Omega$$
        </div>
      `,
      apps: [
        '<strong>Radyo & RF Alıcıları:</strong> Seçilen istasyonun taşıyıcı frekansını (örneğin 100 MHz FM) geçirip diğer komşu kanalları bloke eder.',
        '<strong>Ses Ekolayzırları (Graphic Equalizer):</strong> Belirli bir ses frekans bandını (örn. 1 kHz vokaller) bağımsız olarak yükseltme veya kısma imkanı sunar.',
        '<strong>Ultrasonik Mesafe Sensörleri:</strong> Sadece 40 kHz rezonans frekansındaki yankı sinyalini dinleyerek ortam gürültüsünü filtreler.'
      ]
    },

    bandstop: {
      id: 'bandstop',
      title: 'Bant Söndüren / Çentik Filtre (Bandstop / Notch Filter - BS)',
      badge: 'Bölüm 1.1.4 & Bölüm 3.4 & Bölüm 4.5 & 4.6',
      color: '#8b5cf6',
      summary: 'Merkez frekansı (f₀) civarındaki dar veya geniş bir bandı tamamen bloke eder (-∞ dB sıfırlama), bu durdurma bandının altındaki ve üstündeki tüm sinyalleri geçirir.',
      svg: `
        <svg viewBox="0 0 500 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 220px; width: 100%;">
          <rect x="55" y="30" width="130" height="150" fill="rgba(47, 158, 110, 0.08)" />
          <rect x="185" y="30" width="50" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="235" y="30" width="50" height="150" fill="rgba(235, 87, 87, 0.08)" />
          <rect x="285" y="30" width="50" height="150" fill="rgba(234, 179, 8, 0.08)" />
          <rect x="335" y="30" width="140" height="150" fill="rgba(47, 158, 110, 0.08)" />

          <text x="120" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme 1</text>
          <text x="260" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#eb5757">Çentik / Durdurma</text>
          <text x="405" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme 2</text>

          <line x1="55" y1="180" x2="475" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <line x1="55" y1="25" x2="55" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
          <polygon points="475,177 482,180 475,183" fill="#2f2e2b" />
          <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

          <line x1="185" y1="180" x2="185" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="260" y1="180" x2="260" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="335" y1="180" x2="335" y2="186" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="185" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">f_p1</text>
          <text x="260" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#eb5757">f₀ (Çentik)</text>
          <text x="335" y="202" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#2f9e6e">f_p2</text>
          <text x="470" y="202" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f) →</text>

          <line x1="50" y1="70" x2="55" y2="70" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="92" x2="55" y2="92" stroke="#2f2e2b" stroke-width="1.5" />
          <line x1="50" y1="150" x2="55" y2="150" stroke="#2f2e2b" stroke-width="1.5" />
          <text x="48" y="74" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
          <text x="48" y="96" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">-a_pass</text>
          <text x="48" y="154" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">-a_stop</text>

          <!-- Practical notch curve (bold blue with deep notch) -->
          <path d="M 55,70 C 140,70 170,72 185,92 C 205,120 230,150 250,170 L 260,178 L 270,170 C 290,150 315,120 335,92 C 350,72 380,70 475,70" fill="none" stroke="#3d5afe" stroke-width="3" />
        </svg>
      `,
      specs: [
        { label: 'Çentik Frekansı (f₀)', desc: 'Tam sıfırlamanın ($-\\infty\\text{ dB}$) gerçekleştiği merkez frekans: $f_0 = \\sqrt{f_{\\text{s1}} f_{\\text{s2}}}$.' },
        { label: 'Durdurma Bölgesi', desc: '$[f_{\\text{s1}}, f_{\\text{s2}}]$ frekans bandı. Zayıflama en az $a_{\\text{stop}}\\text{ dB}$.' },
        { label: 'İletim Sıfırları (Transmission Zeros)', desc: '$s = \\pm j\\omega_0$ sanal eksenindeki sıfırlar nedeniyle çentik frekansında teorik kazanç tam sıfırdır.' },
        { label: 'DC ve Yüksek Frekans', desc: 'Hem $f=0\\text{ Hz}$ DC hem de $f \\rightarrow \\infty$ yüksek frekansta kazanç $1.0$ ($0\\text{ dB}$) seviyesindedir.' }
      ],
      mathContent: `
        <p><strong>1. Bant Söndüren Frekans Dönüşümü (Denklem 3.28):</strong></p>
        <div class="math-block">
          $$S = \\frac{B s}{s^2 + \\omega_0^2} \\quad (\\omega_0 = \\sqrt{\\omega_{\\text{s1}} \\omega_{\\text{s2}}}, \\quad B = \\omega_{\\text{s2}} - \\omega_{\\text{s1}})$$
        </div>
        <p>Bu dönüşümde $s = \\pm j\\omega_0$ olduğunda payda sıfıra gider ve $S \\rightarrow \\infty$ olur (prototipin sonsuzdaki zayıflaması merkeze taşınır).</p>
        <p><strong>2. İkinci Derece Çentik Biquad Fonksiyonu:</strong></p>
        <div class="math-block">
          $$H_{BS}(s) = \\frac{s^2 + \\omega_0^2}{s^2 + B s + \\omega_0^2} = \\frac{s^2 + \\omega_0^2}{s^2 + \\left(\\frac{\\omega_0}{Q}\\right) s + \\omega_0^2}$$
        </div>
      `,
      circuitContent: `
        <p><strong>Twin-Tee (İkiz-T) Aktif Çentik Devresi (Şekil 4.10 / 4.12):</strong></p>
        <p>Üst T kolu iki seri direnç $R$ ve bir şönt $2C$; alt T kolu iki seri kondansatör $C$ ve bir şönt $R/2$ içerir:</p>
        <div class="math-block">
          $$R = \\frac{1}{\\omega_0 C}, \\quad K = 2 - \\frac{1}{2 Q}$$
          $$R_B = (K - 1) R_A \\quad (K > 1)$$
        </div>
        <p>Op-amp geri beslemesi sayesinde devrenin $Q$ faktörü ve seçiciliği büyük ölçüde artırılır.</p>
      `,
      apps: [
        '<strong>50 Hz / 60 Hz Şebeke Uğultusu (Mains Hum) Yok Etme:</strong> Türkiye/Avrupa (50 Hz) veya ABD (60 Hz) şebeke elektriğinden kaynaklanan vızıltıyı ses sinyallerinden yok eder.',
        '<strong>Biyopotansiyel Medikal Cihazlar (EKG / EEG):</strong> İnsan vücudunun anten gibi topladığı 50 Hz şebeke parazitini kalbin mikrovolt seviyesindeki sinyallerinden temizler.',
        '<strong>Akustik Geri Besleme (Feedback Destroyer):</strong> Canlı ses mikserlerinde mikrofon-hoparlör ötmesini (çınlamasını) o frekansta dar çentik açarak keser.'
      ]
    }
  };

  let overlayEl = null;
  let currentActiveType = 'lowpass';

  function init() {
    overlayEl = document.getElementById('filterTypesModalOverlay');
    if (!overlayEl) return;

    // Close button
    const closeBtn = document.getElementById('closeFilterTypesModalBtn');
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

    // Hook type tab buttons inside the modal
    const tabBtns = overlayEl.querySelectorAll('[data-type-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const typeKey = btn.getAttribute('data-type-tab');
        renderTypeContent(typeKey);
      });
    });

    // Hook external trigger buttons in the document
    setupTriggers();
  }

  function setupTriggers() {
    // 1. Parameter Input Card button
    const btnParam = document.getElementById('btnFilterTypeInfoModal');
    if (btnParam) {
      btnParam.addEventListener('click', () => {
        const currentSelect = document.getElementById('filterTypeSelect');
        const activeType = currentSelect ? currentSelect.value : 'lowpass';
        open(activeType);
      });
    }

    // 2. Sidebar Navigation Item
    const navItem = document.getElementById('navFilterTypeGuide');
    if (navItem) {
      navItem.addEventListener('click', () => {
        const currentSelect = document.getElementById('filterTypeSelect');
        const activeType = currentSelect ? currentSelect.value : 'lowpass';
        open(activeType);
      });
    }

    // 3. Delegate clicks on Chapter 1 cards or any element with data-open-filter-modal
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-filter-modal]');
      if (trigger) {
        e.preventDefault();
        const type = trigger.getAttribute('data-open-filter-modal') || 'lowpass';
        open(type);
      }
    });
  }

  function open(type = 'lowpass') {
    if (!overlayEl) init();
    if (!overlayEl) return;

    currentActiveType = TYPE_DATA[type] ? type : 'lowpass';
    overlayEl.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    renderTypeContent(currentActiveType);
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  function renderTypeContent(typeKey) {
    currentActiveType = typeKey;
    const data = TYPE_DATA[typeKey] || TYPE_DATA.lowpass;

    // Update active tab buttons
    if (overlayEl) {
      overlayEl.querySelectorAll('[data-type-tab]').forEach(btn => {
        if (btn.getAttribute('data-type-tab') === typeKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    const container = document.getElementById('filterTypeModalBody');
    if (!container) return;

    let specsHtml = '';
    data.specs.forEach(s => {
      specsHtml += `
        <div style="background: var(--panel); padding: 10px 14px; border-radius: var(--radius-sm); border-left: 3px solid ${data.color};">
          <div style="font-weight: 600; font-size: 13px; color: var(--text-h);">${s.label}</div>
          <div style="font-size: 12.5px; color: var(--text); margin-top: 3px;">${s.desc}</div>
        </div>
      `;
    });

    let appsHtml = '';
    data.apps.forEach(a => {
      appsHtml += `<li style="margin-bottom: 6px;">${a}</li>`;
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
          <button class="btn btn-primary" id="btnApplyFilterTypeToDesigner" style="background: ${data.color}; border-color: ${data.color}; flex-shrink: 0;">
            🚀 Bu Filtreyi Tasarımcıya Yükle
          </button>
        </div>

        <!-- Row 1: SVG Diagram & Key Specs -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>📊 Frekans Seçicilik Eğrisi & Tolerans Bölgeleri</h4>
            <div style="background: #fafaf9; border-radius: var(--radius-sm); padding: 12px; border: 1px solid var(--border);">
              ${data.svg}
            </div>
          </div>

          <div class="type-detail-section">
            <h4>🎯 Temel Tolerans ve Frekans Parametreleri</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${specsHtml}
            </div>
          </div>
        </div>

        <!-- Row 2: Mathematical Derivations & Active Circuits -->
        <div class="type-detail-grid">
          <div class="type-detail-section">
            <h4>📐 Matematiksel Modeli ve Frekans Dönüşümleri (Bölüm 3)</h4>
            ${data.mathContent}
          </div>

          <div class="type-detail-section">
            <h4>⚡ Op-Amp Aktif Devre Sentezi (Bölüm 4)</h4>
            ${data.circuitContent}
            
            <h4 style="margin-top: 18px;">💡 Gerçek Dünya Mühendislik Uygulamaları</h4>
            <ul style="padding-left: 18px; margin: 0; font-size: 13px; line-height: 1.55;">
              ${appsHtml}
            </ul>
          </div>
        </div>

      </div>
    `;

    // Hook "Bu Filtreyi Tasarımcıya Yükle" button
    const applyBtn = document.getElementById('btnApplyFilterTypeToDesigner');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        close();
        if (window.FilterStudio && typeof window.FilterStudio.setFilterType === 'function') {
          window.FilterStudio.setFilterType(data.id);
        } else {
          const select = document.getElementById('filterTypeSelect');
          if (select) {
            select.value = data.id;
            select.dispatchEvent(new Event('change'));
          }
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
  window.FilterTypesModal = FilterTypesModal;
}

if (typeof module !== 'undefined') module.exports = FilterTypesModal;
