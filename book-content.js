/**
 * FilterDesign Studio - Comprehensive Book Content & Theory Module (Chapters 1 - 4)
 * Based on "Practical Analog and Digital Filter Design" by Les Thede
 * Detailed step-by-step mathematical explanations, derivations and algorithms
 */

const BookContent = (() => {
  const chapters = [
    // =========================================================================
    // CHAPTER 1
    // =========================================================================
    {
      id: 'ch1',
      num: 1,
      title: 'Bölüm 1: Filtrelere Giriş ve Filtre Seçicilikleri',
      sub: 'Introduction to Filters and Filter Selectivity',
      badge: 'Bölüm 1: Giriş',
      summary: 'Filtreleme kavramı, frekans seçicilik sınıfları (LP, HP, BP, BS), tolerans parametreleri, yaklaşım felsefesi ve uygulama teknolojileri.',
      sections: [
        {
          id: 'ch1-1',
          title: '1.1 Filtre Seçiciliği (Filter Selectivity) ve Tolerans Parametreleri',
          content: `
            <p>Filtreleme, istenen frekans bileşenlerini minimum kayıpla iletirken istenmeyen frekansları bastırma işlemidir. Frekans ekseninde filtrenin davranışı genlik ve frekans düzleminde tanımlanır. Desibel (dB) cinsinden zayıflama (attenuation) ve kazanç (gain) ifadeleri şu şekilde tanımlanır:</p>
            <div class="math-block">
              $$A_{\\text{dB}} = -20 \\log_{10} |H(j\\omega)| \\quad \\Longleftrightarrow \\quad G_{\\text{dB}} = 20 \\log_{10} |H(j\\omega)|$$
            </div>
            <p>Kitapta filtrelerin frekans seçiciliği dört ana temel kategoriye ayrılır (Kitap Şekil 1.1 - 1.4):</p>

            <div class="theory-grid-2">
              <!-- 1. Lowpass Card -->
              <div class="theory-card">
                <h4>1.1.1 Alçak Geçiren Filtreler (Lowpass - LP)</h4>
                <div class="filter-spec-diagram-wrap">
                  <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background zones -->
                    <rect x="55" y="30" width="115" height="140" fill="rgba(47, 158, 110, 0.08)" />
                    <rect x="170" y="30" width="85" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="255" y="30" width="175" height="140" fill="rgba(235, 87, 87, 0.08)" />

                    <!-- Zone Labels -->
                    <text x="112" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme Bandı</text>
                    <text x="212" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#b45309">Geçiş</text>
                    <text x="342" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">Durdurma Bandı</text>

                    <!-- Axes -->
                    <line x1="55" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <line x1="55" y1="25" x2="55" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <!-- Axis arrows -->
                    <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
                    <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

                    <!-- Frequency labels & tick marks -->
                    <line x1="170" y1="170" x2="170" y2="175" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="255" y1="170" x2="255" y2="175" stroke="#2f2e2b" stroke-width="1.5" />
                    <text x="170" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#2f9e6e">f_pass</text>
                    <text x="255" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#eb5757">f_stop</text>
                    <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f / ω) →</text>

                    <!-- dB levels -->
                    <line x1="50" y1="65" x2="55" y2="65" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="50" y1="85" x2="55" y2="85" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="50" y1="140" x2="55" y2="140" stroke="#2f2e2b" stroke-width="1.5" />

                    <text x="48" y="69" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
                    <text x="48" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
                    <text x="48" y="144" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

                    <!-- Dashed tolerance lines -->
                    <line x1="55" y1="85" x2="170" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
                    <line x1="170" y1="30" x2="170" y2="170" stroke="#2f9e6e" stroke-width="1" stroke-dasharray="2,2" />
                    <line x1="255" y1="30" x2="255" y2="170" stroke="#eb5757" stroke-width="1" stroke-dasharray="2,2" />
                    <line x1="255" y1="140" x2="430" y2="140" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />

                    <!-- Ideal brick-wall response (dashed gray) -->
                    <path d="M 55,65 L 170,65 L 170,165 L 430,165" fill="none" stroke="#9ca3af" stroke-width="1.6" stroke-dasharray="4,4" />

                    <!-- Filter response curve (bold accent blue) -->
                    <path d="M 55,65 C 130,65 160,70 170,85 C 185,110 230,135 255,140 C 300,146 360,152 430,156" fill="none" stroke="#3d5afe" stroke-width="2.8" />
                  </svg>
                </div>
                <p>DC frekansından ($0\text{ Hz}$) geçirme frekansına ($f_{\text{pass}}$) kadar olan sinyalleri minimum zayıflamayla geçirir, $f_{\text{stop}}$ üzerini zayıflatır.</p>
                <ul>
                  <li><strong>Geçirme Zayıflaması ($a_{\text{pass}}$):</strong> $\le a_{\text{pass}}\text{ dB}$ (tipik $0.1 \dots 3\text{ dB}$).</li>
                  <li><strong>Durdurma Zayıflaması ($a_{\text{stop}}$):</strong> $\ge a_{\text{stop}}\text{ dB}$ (tipik $20 \dots 80\text{ dB}$).</li>
                  <li><strong>Geçiş Oranı:</strong> $r = f_{\text{stop}} / f_{\text{pass}} > 1$.</li>
                </ul>
              </div>

              <!-- 2. Highpass Card -->
              <div class="theory-card">
                <h4>1.1.2 Yüksek Geçiren Filtreler (Highpass - HP)</h4>
                <div class="filter-spec-diagram-wrap">
                  <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background zones -->
                    <rect x="55" y="30" width="135" height="140" fill="rgba(235, 87, 87, 0.08)" />
                    <rect x="190" y="30" width="80" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="270" y="30" width="160" height="140" fill="rgba(47, 158, 110, 0.08)" />

                    <!-- Zone Labels -->
                    <text x="122" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#eb5757">Durdurma Bandı</text>
                    <text x="230" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#b45309">Geçiş</text>
                    <text x="350" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme Bandı</text>

                    <!-- Axes -->
                    <line x1="55" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <line x1="55" y1="25" x2="55" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
                    <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

                    <!-- Frequency labels -->
                    <line x1="190" y1="170" x2="190" y2="175" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="270" y1="170" x2="270" y2="175" stroke="#2f2e2b" stroke-width="1.5" />
                    <text x="190" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#eb5757">f_stop</text>
                    <text x="270" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#2f9e6e">f_pass</text>
                    <text x="425" y="190" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (f / ω) →</text>

                    <!-- dB levels -->
                    <line x1="50" y1="65" x2="55" y2="65" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="50" y1="85" x2="55" y2="85" stroke="#2f2e2b" stroke-width="1.5" />
                    <line x1="50" y1="140" x2="55" y2="140" stroke="#2f2e2b" stroke-width="1.5" />

                    <text x="48" y="69" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0 dB</text>
                    <text x="48" y="89" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#2f9e6e">-a_pass</text>
                    <text x="48" y="144" text-anchor="end" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">-a_stop</text>

                    <!-- Dashed tolerance lines -->
                    <line x1="55" y1="140" x2="190" y2="140" stroke="#eb5757" stroke-width="1.2" stroke-dasharray="3,3" />
                    <line x1="190" y1="30" x2="190" y2="170" stroke="#eb5757" stroke-width="1" stroke-dasharray="2,2" />
                    <line x1="270" y1="30" x2="270" y2="170" stroke="#2f9e6e" stroke-width="1" stroke-dasharray="2,2" />
                    <line x1="270" y1="85" x2="430" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />

                    <!-- Filter response curve -->
                    <path d="M 55,160 C 110,155 170,148 190,140 C 220,130 250,95 270,85 C 300,72 360,65 430,65" fill="none" stroke="#3d5afe" stroke-width="2.8" />
                  </svg>
                </div>
                <p>Alçak frekansları ($0 \dots f_{\text{stop}}$) zayıflatır ve $f_{\text{pass}}$ üzerindeki yüksek frekansları minimum kayıpla iletir.</p>
                <ul>
                  <li><strong>Durdurma Bölgesi:</strong> $0 \le f \le f_{\text{stop}}$</li>
                  <li><strong>Geçirme Bölgesi:</strong> $f \ge f_{\text{pass}}$ ($f_{\text{stop}} < f_{\text{pass}}$)</li>
                  <li><strong>Geçiş Oranı:</strong> $r = f_{\text{pass}} / f_{\text{stop}} > 1$.</li>
                </ul>
              </div>

              <!-- 3. Bandpass Card -->
              <div class="theory-card">
                <h4>1.1.3 Bant Geçiren Filtreler (Bandpass - BP)</h4>
                <div class="filter-spec-diagram-wrap">
                  <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background zones -->
                    <rect x="55" y="30" width="70" height="140" fill="rgba(235, 87, 87, 0.08)" />
                    <rect x="125" y="30" width="55" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="180" y="30" width="100" height="140" fill="rgba(47, 158, 110, 0.08)" />
                    <rect x="280" y="30" width="55" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="335" y="30" width="95" height="140" fill="rgba(235, 87, 87, 0.08)" />

                    <!-- Zone Labels -->
                    <text x="90" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#eb5757">Durdurma 1</text>
                    <text x="230" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f9e6e">Geçirme Bandı (B)</text>
                    <text x="382" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#eb5757">Durdurma 2</text>

                    <!-- Axes -->
                    <line x1="55" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <line x1="55" y1="25" x2="55" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
                    <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

                    <!-- Frequency ticks & labels -->
                    <text x="125" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#eb5757">f_s1</text>
                    <text x="180" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#2f9e6e">f_p1</text>
                    <text x="230" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">f₀</text>
                    <text x="280" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#2f9e6e">f_p2</text>
                    <text x="335" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#eb5757">f_s2</text>

                    <!-- Center line -->
                    <line x1="230" y1="65" x2="230" y2="170" stroke="#3d5afe" stroke-width="1" stroke-dasharray="2,2" />

                    <!-- Tolerance lines -->
                    <line x1="55" y1="140" x2="125" y2="140" stroke="#eb5757" stroke-width="1" stroke-dasharray="3,3" />
                    <line x1="180" y1="85" x2="280" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
                    <line x1="335" y1="140" x2="430" y2="140" stroke="#eb5757" stroke-width="1" stroke-dasharray="3,3" />

                    <!-- Filter response curve -->
                    <path d="M 55,160 C 95,155 115,148 125,140 C 150,120 165,95 180,85 C 205,70 215,65 230,65 C 245,65 255,70 280,85 C 295,95 310,120 335,140 C 355,150 395,158 430,160" fill="none" stroke="#3d5afe" stroke-width="2.8" />
                  </svg>
                </div>
                <p>Belirli bir alt ($f_{\text{p1}}$) ve üst ($f_{\text{p2}}$) frekans aralığını geçirirken bandın dışını söndürür.</p>
                <ul>
                  <li><strong>Bant Genişliği ($B$):</strong> $B = f_{\text{p2}} - f_{\text{p1}}$</li>
                  <li><strong>Merkez Frekansı ($f_0$):</strong> $f_0 = \sqrt{f_{\text{p1}} \cdot f_{\text{p2}}}$</li>
                  <li><strong>Kalite Faktörü ($Q$):</strong> $Q = f_0 / B$.</li>
                </ul>
              </div>

              <!-- 4. Bandstop / Notch Card -->
              <div class="theory-card">
                <h4>1.1.4 Bant Söndüren / Çentik (Bandstop / Notch)</h4>
                <div class="filter-spec-diagram-wrap">
                  <svg viewBox="0 0 460 210" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background zones -->
                    <rect x="55" y="30" width="85" height="140" fill="rgba(47, 158, 110, 0.08)" />
                    <rect x="140" y="30" width="50" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="190" y="30" width="80" height="140" fill="rgba(235, 87, 87, 0.08)" />
                    <rect x="270" y="30" width="50" height="140" fill="rgba(234, 179, 8, 0.08)" />
                    <rect x="320" y="30" width="110" height="140" fill="rgba(47, 158, 110, 0.08)" />

                    <!-- Zone Labels -->
                    <text x="97" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#2f9e6e">Geçirme 1</text>
                    <text x="230" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="600" fill="#eb5757">Çentik / Durdurma</text>
                    <text x="375" y="48" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#2f9e6e">Geçirme 2</text>

                    <!-- Axes -->
                    <line x1="55" y1="170" x2="430" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <line x1="55" y1="25" x2="55" y2="170" stroke="#2f2e2b" stroke-width="1.8" />
                    <polygon points="430,167 437,170 430,173" fill="#2f2e2b" />
                    <polygon points="52,25 55,18 58,25" fill="#2f2e2b" />

                    <!-- Frequency ticks & labels -->
                    <text x="140" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#2f9e6e">f_p1</text>
                    <text x="190" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#eb5757">f_s1</text>
                    <text x="230" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" fill="#3d5afe">f₀</text>
                    <text x="270" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#eb5757">f_s2</text>
                    <text x="320" y="190" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="700" fill="#2f9e6e">f_p2</text>

                    <!-- Tolerance lines -->
                    <line x1="55" y1="85" x2="140" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />
                    <line x1="190" y1="140" x2="270" y2="140" stroke="#eb5757" stroke-width="1" stroke-dasharray="3,3" />
                    <line x1="320" y1="85" x2="430" y2="85" stroke="#2f9e6e" stroke-width="1.2" stroke-dasharray="3,3" />

                    <!-- Deep notch filter response curve -->
                    <path d="M 55,65 C 105,65 125,70 140,85 C 165,115 180,135 190,140 C 215,155 228,168 230,168 C 232,168 245,155 270,140 C 280,135 295,115 320,85 C 335,70 365,65 430,65" fill="none" stroke="#3d5afe" stroke-width="2.8" />
                  </svg>
                </div>
                <p>Merkez frekansı civarındaki dar veya geniş bir bandı tamamen bloke eder (örneğin 50/60 Hz şebeke çentiği).</p>
                <ul>
                  <li><strong>Durdurma (Çentik) Bölgesi:</strong> $[f_{\text{s1}}, f_{\text{s2}}]$</li>
                  <li><strong>Geçirme Bölgeleri:</strong> $0 \le f \le f_{\text{p1}}$ ve $f \ge f_{\text{p2}}$</li>
                  <li><strong>Çentik Frekansı:</strong> $f_0 = \sqrt{f_{\text{s1}} f_{\text{s2}}}$.</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          id: 'ch1-2',
          title: '1.2 Filtre Yaklaşım Teorisi: İdeal ve Pratik Yanıtlar (Figure 1.5)',
          content: `
            <p>İdeal bir filtre geçirme bandında kesinlikle $0\text{ dB}$ zayıflamaya, durdurma bandında sonsuz zayıflamaya ($-\infty\text{ dB}$) ve bu iki bölge arasında sıfır genişlikli dikey bir geçişe ("tuğla duvar" - brick wall) sahip olmalıdır:</p>
            
            <div class="theory-card" style="margin: 16px 0;">
              <h4 style="margin-bottom: 8px;">İdeal (Tuğla Duvar) vs Pratik Filtre Yanıtı Karşılaştırması</h4>
              <div class="filter-spec-diagram-wrap">
                <svg viewBox="0 0 540 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Axes -->
                  <line x1="60" y1="180" x2="500" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
                  <line x1="60" y1="25" x2="60" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
                  <polygon points="500,177 508,180 500,183" fill="#2f2e2b" />
                  <polygon points="57,25 60,17 63,25" fill="#2f2e2b" />

                  <!-- Grid labels -->
                  <text x="50" y="55" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">1.0 (0 dB)</text>
                  <text x="50" y="180" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0.0 (-∞ dB)</text>
                  <text x="60" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#787774">0</text>
                  <text x="210" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#2f9e6e">ω_pass</text>
                  <text x="320" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#eb5757">ω_stop</text>
                  <text x="495" y="200" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

                  <!-- Transition band highlight -->
                  <rect x="210" y="40" width="110" height="140" fill="rgba(234, 179, 8, 0.08)" />
                  <text x="265" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#b45309">Geçiş Bandı (Transition Band)</text>

                  <!-- Ideal Brick-Wall curve (Dashed red) -->
                  <path d="M 60,50 L 210,50 L 210,180 L 500,180" fill="none" stroke="#ef4444" stroke-width="2.4" stroke-dasharray="6,4" />
                  <!-- Practical response curve (Solid blue) -->
                  <path d="M 60,50 C 160,50 195,55 210,70 C 235,95 285,155 320,165 C 370,175 430,178 500,179" fill="none" stroke="#3d5afe" stroke-width="3" />

                  <!-- Legend -->
                  <line x1="280" y1="35" x2="310" y2="35" stroke="#ef4444" stroke-width="2.4" stroke-dasharray="6,4" />
                  <text x="318" y="39" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#ef4444">İdeal "Tuğla Duvar" (Brick-Wall)</text>
                  <line x1="280" y1="52" x2="310" y2="52" stroke="#3d5afe" stroke-width="3" />
                  <text x="318" y="56" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">Pratik Yaklaşım (Fiziksel Filtre)</text>
                </svg>
              </div>
            </div>

            <p>Ancak <strong>Paley-Wiener kriteri</strong> ve nedensellik (causality) ilkesi gereği, gerçek fiziksel sistemlerde sonsuz diklikte bir tuğla duvar oluşturulamaz:</p>
            <div class="math-block">
              $$\int_{-\infty}^{\infty} \frac{|\ln |H(j\omega)||}{1 + \omega^2} d\omega < \infty$$
            </div>
            <p>Eğer bir filtre belirli bir frekans bandında tamamen sıfır kazanca ($|H(j\omega)| = 0$) sahip olursa, yukarıdaki integral ıraksar ve sistemin darbe yanıtı $h(t)$, uyarım uygulanmadan önce ($t < 0$) sıfırdan farklı bir değer almak zorunda kalır (nedensellik ihlali). Bu nedenle filtre tasarımının temeli, ideal yanıta en yakın matematiksel fonksiyonları bulma problemidir (yaklaşım teorisi).</p>
            <p>Dört temel klasik yaklaşım yöntemi geliştirilmiştir:</p>
            <ul>
              <li><strong>Butterworth:</strong> $\omega = 0$ noktasında türevleri sıfırlayarak maksimum düzlük (maximally flat) sağlar.</li>
              <li><strong>Chebyshev Tip I:</strong> Geçirme bandında eşit dalgalanmaya (equiripple) izin vererek çok daha dik bir geçiş bandı elde eder.</li>
              <li><strong>Ters Chebyshev (Tip II):</strong> Geçirme bandı Butterworth gibi düzdür, durdurma bandında dalgalanma ve sonlu iletim sıfırları barındırır.</li>
              <li><strong>Eliptik (Cauer):</strong> Hem geçirme hem durdurma bandında dalgalanmaya izin verir. Verilen spesifikasyonlar için gereken teorik <strong>en küçük dereceyi ($N$)</strong> sunar.</li>
            </ul>
          `
        },
        {
          id: 'ch1-3',
          title: '1.3 Filtre Uygulama Teknolojileri (Implementation Technologies)',
          content: `
            <p>Analog filtreler günümüzde farklı elektronik devre teknolojileri ile hayata geçirilir:</p>
            <div class="theory-grid-2">
              <div class="theory-card">
                <h4>Aktif Filtreler (Op-Amp + RC)</h4>
                <p>Bölüm 4'te detaylı incelenen aktif filtreler, operasyonel yükselteçler (Op-Amp), dirençler ve kondansatörler kullanır. Bobin (endüktans) gerektirmez; bu sayede hacim, ağırlık, manyetik parazit ve maliyet büyük ölçüde azalır. Giriş empedansı çok yüksek, çıkış empedansı çok düşüktür; katlar birbirini yüklemeden ardışık kaskad bağlanabilir.</p>
              </div>
              <div class="theory-card">
                <h4>Pasif Filtreler (RLC Ağları)</h4>
                <p>Direnç, bobin ve kondansatörlerden oluşur. Harici bir DC güç kaynağı gerektirmez. Op-amp'ların bant genişliği ve slew-rate sınırlarının yetersiz kaldığı yüksek frekanslarda (RF, mikrodalga) ve yüksek güç devrelerinde vazgeçilmezdir.</p>
              </div>
              <div class="theory-card">
                <h4>Switched-Capacitor (SC) Filtreler</h4>
                <p>Entegre devre (IC/CMOS) üretiminde büyük değerli dirençler üretmek zordur ve çok alan kaplar. SC filtreler, yüksek frekanslı bir saat sinyali ile anahtarlanan küçük kondansatörler kullanarak eşdeğer direnç oluşturur ($R_{eq} = \\frac{1}{f_{clk} C}$). Kesim frekansı saat frekansı ile hassas şekilde ayarlanabilir.</p>
              </div>
              <div class="theory-card">
                <h4>Transconductance-C ($G_m-C$) Filtreler</h4>
                <p>Gerilim kontrollü akım kaynakları (OTA) ve kapasitelerden oluşur. Geri besleme döngüsü bulunmadığından aktif op-amp filtrelerin çalışma frekansını onlarca MHz ve GHz seviyesine taşır.</p>
              </div>
            </div>
          `
        }
      ]
    },

    // =========================================================================
    // CHAPTER 2
    // =========================================================================
    {
      id: 'ch2',
      num: 2,
      title: 'Bölüm 2: Normalize Analog Filtre Yaklaşım Fonksiyonları',
      sub: 'Analog Filter Approximation Functions',
      badge: 'Bölüm 2: Yaklaşımlar',
      summary: 'Transfer fonksiyonu matematiği, s-düzlemi kararlılık analizi, Butterworth, Chebyshev, Ters Chebyshev ve Eliptik yaklaşımlarının analitik türetimi.',
      sections: [
        {
          id: 'ch2-1',
          title: '2.1 Transfer Fonksiyonları, s-Düzlemi ve Kararlılık Analizi',
          content: `
            <p>Lineer zamanla değişmeyen (LTI) analog bir filtrenin davranışı Laplace domeninde $H(s)$ transfer fonksiyonu ile modellenir:</p>
            <div class="math-block">
              $$H(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{N(s)}{D(s)} = \\frac{a_m s^m + a_{m-1} s^{m-1} + \\dots + a_1 s + a_0}{s^n + b_{n-1} s^{n-1} + \\dots + b_1 s + b_0}$$
            </div>
            <p>Burada $n$ filtrenin derecesidir ($n \\ge m$). Pay polinomunun köklerine <strong>sıfırlar (zeros - $z_i$)</strong>, payda polinomunun köklerine <strong>kutuplar (poles - $p_k$)</strong> denir:</p>
            <div class="math-block">
              $$H(s) = G \\cdot \\frac{\\prod_{i=1}^{m} (s - z_i)}{\\prod_{k=1}^{n} (s - p_k)}$$
            </div>
            <p><strong>Kararlılık Kriteri (BIBO Stability):</strong> Filtrenin sınırlı girişe sınırlı çıkış vermesi için transfer fonksiyonunun tüm kutuplarının $s$-düzleminin kesinlikle sol yarı düzleminde yer alması zorunludur:</p>
            <div class="math-block">
              $$\\text{Re}(p_k) < 0, \\quad \\forall k = 1, 2, \\dots, n$$
            </div>
            <p><strong>Frekans Yanıtı Hesabı:</strong> $s = j\\omega$ konularak genlik ve faz bileşenleri analitik olarak ayrıştırılır:</p>
            <div class="math-block">
              $$|H(j\\omega)| = |G| \\cdot \\frac{\\prod_{i=1}^{m} |j\\omega - z_i|}{\\prod_{k=1}^{n} |j\\omega - p_k|}, \\quad \\angle H(j\\omega) = \\sum_{i=1}^{m} \\angle(j\\omega - z_i) - \\sum_{k=1}^{n} \\angle(j\\omega - p_k)$$
            </div>
            <p><strong>Normalize Transfer Fonksiyonları:</strong> Karmaşık hesaplamaları genelleştirmek için önce $\\omega_{\\text{pass}} = 1.0\\text{ rad/s}$ veya $\\omega_0 = 1.0\\text{ rad/s}$ olan normalize prototip filtre tasarlanır, ardından Bölüm 3'teki frekans ve empedans dönüşümleriyle hedef frekansa ölçeklenir.</p>
          `
        },
        {
          id: 'ch2-2',
          title: '2.2 Butterworth Yaklaşımı (Maksimum Düz - Maximally Flat)',
          content: `
            <p>Butterworth yaklaşımının temel amacı, geçirme bandında mümkün olan en yüksek düzlüğü elde etmektir. Büyüklük karesi fonksiyonu Denklem 2.6 ile tanımlanır:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\left(\\frac{\\omega}{\\omega_0}\\right)^{2n}}$$
            </div>
            <p>$\\omega = 0$ civarında Taylor serisine açıldığında, ilk $2n-1$ türevin sıfır olduğu görülür (maksimum düzlük buradan gelir). $\\omega = \\omega_0$ frekansında genlik $|H(j\\omega_0)|^2 = 1/2 \\implies -3.01\\text{ dB}$ düşer.</p>

            <p><strong>Adım 1: Gerekli Filtre Derecesinin ($n$) Hesabı (Denklem 2.7):</strong></p>
            <div class="math-block">
              $$n \\ge \\frac{\\log_{10}\\left[ \\frac{10^{-a_{\\text{stop}}/10} - 1}{10^{-a_{\\text{pass}}/10} - 1} \\right]}{2 \\log_{10}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$
            </div>

            <p><strong>Adım 2: Kutupların Birim Çember Üzerindeki Açısal Konumları:</strong></p>
            <p>Butterworth kutupları $s$-düzleminde birim çember üzerinde simetrik olarak yer alır. Kararlı olan sol yarı düzlem kutup açıları $\\theta_k$ (Denklem 2.10):</p>
            <div class="math-block">
              $$\\theta_k = \\frac{2k - 1}{2n}\\pi, \\quad k = 1, 2, \\dots, n$$
              $$p_k = -\\sin(\\theta_k) + j \\cos(\\theta_k)$$
            </div>

            <p><strong>Adım 3: İkinci Derece Faktörlere Ayrıştırma (Quadratic Factoring):</strong></p>
            <p>Karmaşık eşlenik kutup çiftleri bir araya getirilerek aktif filtrelerde doğrudan uygulanabilecek ikinci derece çarpanlar oluşturulur:</p>
            <div class="math-block">
              $$(s - p_k)(s - p_k^*) = s^2 - 2\\text{Re}(p_k)s + |p_k|^2 = s^2 + b_1 s + 1.0$$
              $$b_1 = 2\\sin(\\theta_k), \\quad Q = \\frac{1}{b_1} = \\frac{1}{2\\sin(\\theta_k)}$$
            </div>
            <p>Eğer derece $n$ tek sayı ise, reel eksen üzerinde bir adet birinci derece kutup bulunur: $(s + 1.0)$.</p>
          `
        },
        {
          id: 'ch2-3',
          title: '2.3 Chebyshev Yaklaşımı (Tip I - Eşit Dalgalı)',
          content: `
            <p>Chebyshev Tip I filtresi, geçirme bandında belirli bir miktar dalgalanmaya ($a_{\\text{pass}}$ dB) izin verilmesi karşılığında geçiş bandında Butterworth'e göre çok daha yüksek bir düşüş eğimi (roll-off) sağlar:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\epsilon^2 C_n^2(\\omega)}$$
            </div>
            <p>Burada $\\epsilon$ dalgalanma faktörüdür (ripple factor):</p>
            <div class="math-block">
              $$\\epsilon = \\sqrt{10^{-a_{\\text{pass}}/10} - 1}$$
            </div>
            <p>$C_n(\\omega)$ $n$. dereceden Chebyshev polinomudur. Yineleme (recurrence) bağıntısı ile türetilir:</p>
            <div class="math-block">
              $$C_0(\\omega) = 1, \\quad C_1(\\omega) = \\omega$$
              $$C_{n+1}(\\omega) = 2\\omega C_n(\\omega) - C_{n-1}(\\omega)$$
            </div>
            <p>Kapalı form trigonometrik tanımı:</p>
            <div class="math-block">
              $$C_n(\\omega) = \\begin{cases} \\cos(n \\arccos \\omega), & |\\omega| \\le 1 \\text{ (Geçirme Bandı - Dalgalı)} \\\\ \\cosh(n \\operatorname{arcosh} \\omega), & |\\omega| > 1 \\text{ (Durdurma Bandı - Monotonik)} \\end{cases}$$
            </div>

            <p><strong>Gereken Derecenin ($n$) Hesabı (Denklem 2.18):</strong></p>
            <div class="math-block">
              $$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{-a_{\\text{stop}}/10} - 1}{\\epsilon^2}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$
            </div>

            <p><strong>Kutupların Elips Üzerindeki Dağılımı:</strong></p>
            <p>Chebyshev kutupları birim çember yerine odakları $\\pm j$ üzerinde olan bir elips üzerinde yer alır:</p>
            <div class="math-block">
              $$\\gamma = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon}\\right)$$
              $$\\sigma_k = -\\sinh(\\gamma) \\sin(\\theta_k), \\quad \\omega_k = \\cosh(\\gamma) \\cos(\\theta_k)$$
              $$p_k = \\sigma_k + j \\omega_k$$
            </div>
            <p><strong>Çift Derece DC Kazanç Düzeltmesi:</strong> $n$ çift olduğunda $\\omega=0$'da $C_n(0) = 1$ olduğu için transfer fonksiyonunun DC kazancı $1/\\sqrt{1+\\epsilon^2} = 10^{a_{\\text{pass}}/20}$ değerindedir. Bu durum aktif devre tasarımında Bölüm 4'teki kazanç bölücüsü ile dengelenir.</p>
          `
        },
        {
          id: 'ch2-4',
          title: '2.4 Ters Chebyshev (Tip II) ve 2.5 Eliptik (Cauer) Yaklaşımları',
          content: `
            <p><strong>2.4 Ters Chebyshev (Inverse Chebyshev - Chebyshev II):</strong></p>
            <p>Geçirme bandı Butterworth gibi tamamen düz ve monotoniktir, dalgalanma durdurma bandında yer alır. En belirgin özelliği, $j\\omega$ sanal ekseninde yer alan iletim sıfırlarıdır (Transmission Zeros):</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{\\epsilon^2 C_n^2(1/\\omega)}{1 + \\epsilon^2 C_n^2(1/\\omega)}$$
              $$\\omega_{z,k} = \\frac{1}{\\cos(\\theta_k)}, \\quad \\theta_k = \\frac{2k-1}{2n}\\pi$$
            </div>
            <p>Bu sıfır frekanslarında filtrenin genliği tam olarak sıfır olur ($-\\infty\\text{ dB}$). Faz yanıtı standart Chebyshev'e göre çok daha doğrusaldır.</p>

            <p><strong>2.5 Eliptik Yaklaşımı (Cauer):</strong></p>
            <p>Eliptik filtreler, hem geçirme bandında hem de durdurma bandında eşit dalgalanmaya (equiripple) izin verir. Matematiksel temeli Jacobi eliptik fonksiyonlarına dayanır. Verilen tolerans limitlerini ($a_{\\text{pass}}, a_{\\text{stop}}, \\omega_{\\text{pass}}, \\omega_{\\text{stop}}$) sağlayan <strong>kuramsal olarak en düşük filtre derecesini ($n$)</strong> verir. Ancak faz eğrisi en doğrusal olmayan filtredir.</p>
          `
        },
        {
          id: 'ch2-5',
          title: '2.6 Yaklaşım Yöntemlerinin Kapsamlı Karşılaştırması',
          content: `
            <p>Analog filtre seçiminde mühendislik kriterleri aşağıdaki tabloda özetlenmiştir:</p>
            <div class="compare-table-wrap">
              <table class="compare-table">
                <thead>
                  <tr>
                    <th>Yaklaşım Türü</th>
                    <th>Geçirme Bandı</th>
                    <th>Durdurma Bandı</th>
                    <th>Geçiş Bandı Dikliği</th>
                    <th>Faz Doğrusallığı</th>
                    <th>Basamak Aşımı (Overshoot)</th>
                    <th>Bileşen Hassasiyeti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Butterworth</strong></td>
                    <td>Maksimum Düz</td>
                    <td>Monotonik Düşüş</td>
                    <td>Orta (Yavaş)</td>
                    <td>Çok İyi (Doğrusala Yakın)</td>
                    <td>Düşük (~%3 - %10)</td>
                    <td>Düşük (Toleranslara Karşı Dirençli)</td>
                  </tr>
                  <tr>
                    <td><strong>Chebyshev (Tip I)</strong></td>
                    <td>Eşit Dalgalı ($a_{\\text{pass}}$)</td>
                    <td>Monotonik Düşüş</td>
                    <td>Yüksek (Dik)</td>
                    <td>Orta (Bozulma Var)</td>
                    <td>Orta - Yüksek (~%15 - %30)</td>
                    <td>Orta</td>
                  </tr>
                  <tr>
                    <td><strong>Ters Chebyshev (Tip II)</strong></td>
                    <td>Maksimum Düz</td>
                    <td>Eşit Dalgalı ($j\\omega$ Sıfırları)</td>
                    <td>Yüksek (Dik)</td>
                    <td>İyi</td>
                    <td>Düşük - Orta</td>
                    <td>Orta (Sıfır Ayarı İster)</td>
                  </tr>
                  <tr>
                    <td><strong>Eliptik (Cauer)</strong></td>
                    <td>Eşit Dalgalı</td>
                    <td>Eşit Dalgalı</td>
                    <td>En Yüksek (En Dik)</td>
                    <td>Zayıf (Yüksek Gecikme Bozulması)</td>
                    <td>Yüksek (Belirgin Çınlama)</td>
                    <td>Yüksek (Hassas Direnç/Kapasite)</td>
                  </tr>
                </tbody>
              </table>
            </div>
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

    // =========================================================================
    // CHAPTER 3
    // =========================================================================
    {
      id: 'ch3',
      num: 3,
      title: 'Bölüm 3: Normalize Olmayan Filtreler ve Frekans Dönüşümleri',
      sub: 'Unnormalized LP, HP, BP, and BS Filters',
      badge: 'Bölüm 3: Dönüşümler',
      summary: 'Normalize prototip fonksiyonunun gerçek frekanslara ölçeklenmesi, 2πf açısal frekans dönüşümü ve transfer fonksiyonu katsayı türetimleri.',
      sections: [
        {
          id: 'ch3-1',
          title: '3.1 Alçak Geçiren Ölçekleme (LP to LP) & 2πf Dönüşüm Matematiği',
          content: `
            <p>Frekans spektroskopisinde frekans Hertz ($f$, salınım/saniye) veya açısal frekans radyan/saniye ($\\omega$, rad/s) olarak ölçülür. Bir tam dalga $2\\pi$ radyana karşılık geldiği için temel dönüşüm bağıntısı:</p>
            <div class="math-block">
              $$\\omega = 2\\pi f \\quad \\Longleftrightarrow \\quad f = \\frac{\\omega}{2\\pi}$$
            </div>
            <p>Normalize frekans değişkeni $S$ ($\\Omega_{\\text{pass}} = 1\\text{ rad/s}$), gerçek kesim frekansı $\\omega_0 = 2\\pi f_0$ ile frekans ekseninde ölçeklenir:</p>
            <div class="math-block">
              $$S = \\frac{s}{\\omega_0} = \\frac{s}{2\\pi f_0}$$
            </div>

            <p><strong>3.1.1 Birinci Derece Faktörün Dönüşümü (Denklem 3.7 - 3.9):</strong></p>
            <div class="math-block">
              $$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = s/\\omega_0} \\frac{1}{\\frac{s}{\\omega_0} + b_0} = \\frac{\\omega_0}{s + b_0 \\omega_0}$$
              $$H(s) = \\frac{b_2}{s + b_2}, \\quad b_2 = b_0 \\cdot \\omega_0$$
            </div>

            <p><strong>3.1.2 İkinci Derece Faktörün Dönüşümü (Denklem 3.10 - 3.13):</strong></p>
            <div class="math-block">
              $$H(S) = \\frac{A_2 S^2 + A_0}{S^2 + B_1 S + B_2} \\xrightarrow{S = s/\\omega_0} \\frac{A_2 (s/\\omega_0)^2 + A_0}{(s/\\omega_0)^2 + B_1 (s/\\omega_0) + B_2}$$
              $$H(s) = \\frac{a_2 s^2 + a_0}{s^2 + b_1 s + b_2}$$
              $$b_1 = B_1 \\cdot \\omega_0, \\quad b_2 = B_2 \\cdot \\omega_0^2, \\quad a_0 = A_0 \\cdot \\omega_0^2, \\quad a_2 = A_2$$
            </div>
            <p>Tüm-kutuplu (Butterworth ve Chebyshev I) filtrelerde pay daima sabittir ($A_2 = 0, A_0 = B_2$), bu nedenle $a_0 = b_2$ olur.</p>
          `
        },
        {
          id: 'ch3-2',
          title: '3.2 Yüksek Geçiren Dönüşümü (LP to HP)',
          content: `
            <p>Alçak geçiren transfer fonksiyonunu yüksek geçiren transfer fonksiyonuna dönüştürmek için frekans düzlemi ters çevrilir (inversion):</p>
            <div class="math-block">
              $$S = \\frac{\\omega_0}{s} = \\frac{2\\pi f_0}{s}$$
            </div>

            <p><strong>3.2.1 Birinci Derece Yüksek Geçiren Faktörü:</strong></p>
            <div class="math-block">
              $$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = \\omega_0 / s} \\frac{1}{\\frac{\\omega_0}{s} + b_0} = \\frac{s}{b_0 s + \\omega_0} = \\frac{\\frac{1}{b_0} s}{s + \\frac{\\omega_0}{b_0}}$$
              $$H(s) = \\frac{s}{s + b_2}, \\quad b_2 = \\frac{\\omega_0}{b_0}$$
            </div>

            <p><strong>3.2.2 İkinci Derece Yüksek Geçiren Faktörü (Denklem 3.16 - 3.18):</strong></p>
            <div class="math-block">
              $$H(S) = \\frac{B_2}{S^2 + B_1 S + B_2} \\xrightarrow{S = \\omega_0 / s} \\frac{B_2}{\\left(\\frac{\\omega_0}{s}\\right)^2 + B_1 \\left(\\frac{\\omega_0}{s}\\right) + B_2} = \\frac{B_2 s^2}{B_2 s^2 + B_1 \\omega_0 s + \\omega_0^2}$$
              $$H(s) = \\frac{s^2}{s^2 + b_1 s + b_2}, \\quad b_1 = \\frac{B_1 \\omega_0}{B_2}, \\quad b_2 = \\frac{\\omega_0^2}{B_2}$$
            </div>
            <p>Pay kısmındaki $s^2$ terimi orijinde ($s=0$) iki adet sıfır oluşturur; bu sayede DC ve alçak frekanslar sıfırlanırken yüksek frekanslar geçirilir.</p>
          `
        },
        {
          id: 'ch3-3',
          title: '3.3 Bant Geçiren Dönüşümü (LP to BP)',
          content: `
            <p>Bant geçiren dönüşümünde, alçak geçiren prototipteki her bir kutup, merkez frekansı $\\omega_0$ civarında simetrik bir kutup çiftine genişler:</p>
            <div class="math-block">
              $$S = \\frac{s^2 + \\omega_0^2}{B s}$$
              $$\\omega_0 = 2\\pi \\sqrt{f_{\\text{pass1}} \\cdot f_{\\text{pass2}}}, \\quad B = 2\\pi (f_{\\text{pass2}} - f_{\\text{pass1}})$$
            </div>
            <p>Burada $\\omega_0$ geometrik merkez açısal frekansı, $B$ ise geçirme bandı genişliğidir (rad/s).</p>

            <p><strong>3.3.1 Birinci Derece LP Faktörünün BP'ye Dönüşümü:</strong></p>
            <div class="math-block">
              $$\\frac{1}{S + b_0} \\longrightarrow \\frac{1}{\\frac{s^2 + \\omega_0^2}{B s} + b_0} = \\frac{B s}{s^2 + (b_0 B)s + \\omega_0^2}$$
              $$H(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2}, \\quad b_1 = b_0 B, \\quad b_2 = \\omega_0^2, \\quad a_1 = b_0 B$$
            </div>
            <p>Birinci dereceden bir LP faktörü, 2. dereceden bir Sallen-Key rezonans katına dönüşür!</p>

            <p><strong>3.3.2 İkinci Derece LP Faktörünün BP'ye Dönüşümü:</strong></p>
            <p>Her bir 2. derece kuadratik LP faktörü, $S = (s^2+\\omega_0^2)/(Bs)$ dönüşümü sonucunda 4. dereceden bir paydaya dönüşür. Bu 4. derece denklem analitik olarak çözülerek iki adet 2. derece aktif biquad katına ayrıştırılır. Dolayısıyla $n$ dereceli bir alçak geçiren filtre, $2n$ dereceli bir bant geçiren filtreye dönüşür!</p>
          `
        },
        {
          id: 'ch3-4',
          title: '3.4 Bant Söndüren / Çentik Dönüşümü (LP to BS)',
          content: `
            <p>Bant söndüren filtre, bant geçiren dönüşümünün tersidir:</p>
            <div class="math-block">
              $$S = \\frac{B s}{s^2 + \\omega_0^2}$$
            </div>
            <p>Bu dönüşüm uygulandığında payda $s^2 + \\omega_0^2$ terimi ortaya çıkar; bu da $s = \\pm j\\omega_0$ sanal ekseninde saf çentik sıfırları oluşturur. Merkez frekansta filtre iletimi tam sıfır ($-\\infty\\text{ dB}$) olur.</p>
          `
        },
        {
          id: 'ch3-5',
          title: '3.5 Analog Frekans Yanıtı ve Grup Gecikmesi Matematiği',
          content: `
            <p>Elde edilen genel unnormalized transfer fonksiyonunun her bir $k$. aşamasının frekans yanıtı $s = j\\omega$ konularak hesaplanır:</p>
            <div class="math-block">
              $$H_k(j\\omega) = \\frac{a_2 (j\\omega)^2 + a_1 (j\\omega) + a_0}{(j\\omega)^2 + b_1 (j\\omega) + b_2} = \\frac{(a_0 - a_2 \\omega^2) + j(a_1 \\omega)}{(b_2 - \\omega^2) + j(b_1 \\omega)}$$
            </div>
            <p>Pay ve paydanın reel ve imajiner kısımları ayrıştırılarak genlik ve faz hesaplanır:</p>
            <div class="math-block">
              $$M_{\\text{num}} = \\sqrt{(a_0 - a_2 \\omega^2)^2 + (a_1 \\omega)^2}, \\quad \\theta_{\\text{num}} = \\operatorname{atan2}(a_1 \\omega, a_0 - a_2 \\omega^2)$$
              $$M_{\\text{den}} = \\sqrt{(b_2 - \\omega^2)^2 + (b_1 \\omega)^2}, \\quad \\theta_{\\text{den}} = \\operatorname{atan2}(b_1 \\omega, b_2 - \\omega^2)$$
              $$|H_k(j\\omega)| = \\frac{M_{\\text{num}}}{M_{\\text{den}}}, \\quad \\angle H_k(j\\omega) = \\theta_{\\text{num}} - \\theta_{\\text{den}}$$
            </div>
            <p><strong>Grup Gecikmesi (Group Delay - $\\tau_g$):</strong> Farklı frekans bileşenlerinin filtre boyunca ne kadar geciktiğini gösterir. Fazın frekansa göre negatif türevidir:</p>
            <div class="math-block">
              $$\\tau_g(\\omega) = -\\frac{d\\angle H(j\\omega)}{d\\omega}$$
            </div>
            <p>Eğer grup gecikmesi geçirme bandı boyunca sabit kalırsa (lineer faz), sinyal dalga formu bozulmadan iletilir.</p>
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

    // =========================================================================
    // CHAPTER 4
    // =========================================================================
    {
      id: 'ch4',
      num: 4,
      title: 'Bölüm 4: Op-Amp Aktif Filtre Gerçekleştirmeleri',
      sub: 'Analog Filter Implementation Using Active Filters',
      badge: 'Bölüm 4: Devreler',
      summary: 'Katsayı eşleme yöntemi, Sallen-Key ve Twin-Tee devre analizi, direnç/kondansatör hesapları, kazanç dengelemesi ve standart E-serisi bileşen seçimi.',
      sections: [
        {
          id: 'ch4-1',
          title: '4.1 Aktif Filtre Tasarım Prosedürü ve Sallen-Key Düğüm Denklemlerinin Türetimi',
          content: `
            <p>Bölüm 4'te benimsenen temel mühendislik yaklaşımı <strong>Katsayı Eşleme Yöntemi (Coefficient Matching)</strong>'dir. Bölüm 3'te elde edilen hedef matematiksel transfer fonksiyonu $H_a(s)$ ile op-amp devresinin Kirchhoff Akım Kanunu (KCL) düğüm denklemlerinden çıkarılan devre transfer fonksiyonu $H_c(s)$ birbirine eşitlenir.</p>

            <p><strong>Sallen-Key Alçak Geçiren Devresinin Adım Adım KCL Analizi:</strong></p>
            <p>Devrede iki temel iç düğüm tanımlanır: $R_1, R_2$ ve $C_1$ arasındaki düğüm $V_A$, op-amp'ın evirmeyen ($+$) girişi ise $V_B$ olsun.</p>
            <ul>
              <li><strong>1. Düğüm ($V_A$) KCL Denklemi:</strong>
                <div class="math-block">
                  $$\\frac{V_{\\text{in}} - V_A}{R_1} = \\frac{V_A - V_B}{R_2} + \\frac{V_A - V_{\\text{out}}}{1/(sC_1)}$$
                  $$\\frac{V_{\\text{in}}}{R_1} = V_A \\left( \\frac{1}{R_1} + \\frac{1}{R_2} + sC_1 \\right) - \\frac{V_B}{R_2} - sC_1 V_{\\text{out}}$$
                </div>
              </li>
              <li><strong>2. Düğüm ($V_B$) KCL Denklemi (Op-amp giriş akımı sıfırdır):</strong>
                <div class="math-block">
                  $$\\frac{V_A - V_B}{R_2} = \\frac{V_B}{1/(sC_2)} = s C_2 V_B \\implies V_A = V_B (1 + s R_2 C_2)$$
                </div>
              </li>
              <li><strong>Op-amp Kazanç Bağıntısı:</strong>
                <div class="math-block">
                  $$V_{\\text{out}} = K \\cdot V_B \\implies V_B = \\frac{V_{\\text{out}}}{K}, \\quad K = 1 + \\frac{R_B}{R_A}$$
                </div>
              </li>
              <li><strong>Birleştirme ve Çözüm:</strong> $V_A = \\frac{V_{\\text{out}}}{K}(1 + s R_2 C_2)$ ifadesi 1. düğüm denklemine yerleştirilip $V_{\\text{out}} / V_{\\text{in}}$ oranı çekildiğinde Sallen-Key transfer fonksiyonu elde edilir:
                <div class="math-block">
                  $$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{\\frac{K}{R_1 R_2 C_1 C_2}}{s^2 + s\\left[ \\frac{1}{R_1 C_1} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_2 C_2} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$
                </div>
              </li>
            </ul>
            <p>Bu devre transfer fonksiyonu, Bölüm 3'teki kuadratik yaklaşım fonksiyonu ile eşleştirilir:</p>
            <div class="math-block">
              $$H_c(s) = H_a(s) = \\frac{b_2}{s^2 + b_1 s + b_2}$$
            </div>
          `
        },
        {
          id: 'ch4-2',
          title: '4.2 Sallen-Key Alçak Geçiren Devre Tasarımı (Equal-Component Yöntemi)',
          content: `
            <p>Kitapta sunulan en popüler ve pratik yöntem <strong>Eşit Elemanlı Sallen-Key (Equal-Component Sallen-Key)</strong> yaklaşımıdır. Bu yöntemde piyasada toleransı düşük ve standart değerlerde kolayca bulunan kondansatörler eşit seçilir:</p>
            <div class="math-block">
              $$C_1 = C_2 = C \\quad (\\text{Örn: } 10\\text{ nF veya } 0.01\\ \\mu\\text{F})$$
              $$R_1 = R_2 = R$$
            </div>
            <p>Bu eşitlikler devre transfer fonksiyonuna uygulandığında:</p>
            <div class="math-block">
              $$\\frac{1}{R^2 C^2} = b_2 \\implies R = \\frac{1}{C \\sqrt{b_2}}$$
              $$\\frac{3 - K}{R C} = b_1 \\implies 3 - K = b_1 R C = \\frac{b_1}{\\sqrt{b_2}} \\implies K = 3 - \\frac{b_1}{\\sqrt{b_2}}$$
            </div>
            <p><strong>Op-Amp Kazanç Dirençleri ($R_A, R_B$):</strong></p>
            <p>Op-amp evirmeyen yükselteç (non-inverting amplifier) olarak yapılandırılır. Kazancı $K = 1 + \\frac{R_B}{R_A}$ olduğundan:</p>
            <div class="math-block">
              $$R_B = (K - 1) R_A, \\quad (R_A = 10\\text{ k}\\Omega \\text{ seçilir})$$
            </div>
            <p>Eğer $K = 1.0$ ise, $R_B$ kısa devre yapılır (jumper tel) ve $R_A$ devre dışı bırakılır (gerilim takipçi - voltage follower).</p>

            <p><strong>Birinci Derece Alçak Geçiren Katı (Tek Dereceli Filtreler İçin):</strong></p>
            <p>Filtre derecesi tek sayı olduğunda ($N=1, 3, 5, \\dots$), bir adet birinci derece kat gereklidir. Bu kat basit bir pasif RC alçak geçiren ve ardından tampon (buffer) op-amp ile gerçekleştirilir:</p>
            <div class="math-block">
              $$H_c(s) = \\frac{1 / (RC)}{s + 1/(RC)} = \\frac{b_2}{s + b_2} \\implies R = \\frac{1}{b_2 C}, \\quad K = 1.0$$
            </div>
          `
        },
        {
          id: 'ch4-3',
          title: '4.3 Sallen-Key Yüksek Geçiren Devre Tasarımı',
          content: `
            <p>Sallen-Key yüksek geçiren topolojisinde, alçak geçiren devredeki direnç ve kondansatörlerin yerleri karşılıklı olarak değiştirilir. $R_A$ ve $R_B$ op-amp geri besleme dirençleri aynı konumda kalır:</p>
            <div class="math-block">
              $$H_c(s) = \\frac{K s^2}{s^2 + s\\left[ \\frac{1}{R_2 C_2} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_1 C_1} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$
            </div>
            <p>Eşit kondansatör ($C_1 = C_2 = C$) ve eşit direnç ($R_1 = R_2 = R$) seçimi ile hesaplama formülleri alçak geçiren ile aynı simetriye kavuşur:</p>
            <div class="math-block">
              $$R = \\frac{1}{C \\sqrt{b_2}}, \\quad K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K - 1) R_A$$
            </div>
            <p>Birinci derece yüksek geçiren katı için seri kondansatör ve toprağa bağlı direnç ile tampon op-amp kullanılır: $R = \\frac{1}{b_2 C}$.</p>
          `
        },
        {
          id: 'ch4-4',
          title: '4.4 ve 4.5 Twin-Tee Çentik Devresi ve Kompleks Sıfırların Gerçekleştirilmesi',
          content: `
            <p>Ters Chebyshev ve Eliptik filtrelerin transfer fonksiyonlarının payında $s^2 + a_0$ şeklinde sonlu iletim sıfırları bulunur. Standart tüm-kutuplu Sallen-Key devresi bu sıfırları gerçekleştiremez. Bu amaçla <strong>Twin-Tee (İkiz-T) Aktif Çentik Filtresi</strong> kullanılır.</p>
            <p>Devre simetrik iki paralel T köprüsünden oluşur:</p>
            <ul>
              <li><strong>R-C-R Köprüsü:</strong> İki adet seri $R$ direnci ve orta noktadan toprağa bağlı $2C$ kondansatörü (Alçak geçiren yol).</li>
              <li><strong>C-R-C Köprüsü:</strong> İki adet seri $C$ kondansatörü ve orta noktadan toprağa bağlı $R/2$ direnci (Yüksek geçiren yol).</li>
            </ul>
            <p>Merkez frekansta iki yol arasındaki sinyaller tam $180^\\circ$ faz farkı ile birbirini yok eder ve derin bir çentik oluşturur. Çentik derinliği ve seçiciliği op-amp geri besleme kazancı $K$ ile kontrol edilir:</p>
            <div class="math-block">
              $$f_0 = \\frac{1}{2\\pi R C}, \\quad K = 2 - \\frac{1}{2Q}$$
            </div>
          `
        },
        {
          id: 'ch4-5',
          title: '4.6 Kazanç Dengeleme Gerilim Bölücüsü (Gain Adjustment Divider)',
          content: `
            <p>Her Sallen-Key katı stabilite ve $Q$ gereksinimleri nedeniyle $K_m > 1$ kazancına sahip olduğundan, kaskad bağlı tüm katların toplam kazancı yükselir:</p>
            <div class="math-block">
              $$K_{\\text{tot}} = \\prod_{m=1}^{M} K_m$$
            </div>
            <p>Örneğin 5. derece bir filtrede $K_{\\text{tot}} \\approx 3.29$ olabilir. Filtrenin toplam DC veya tepe kazancını tam olarak $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) seviyesine eşitlemek için en son aşamanın çıkışına pasif bir direnç gerilim bölücüsü ($R_x, R_y$) eklenir:</p>
            <div class="math-block">
              $$G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}}$$
            </div>
            <p>Filtrenin çıkış empedansının belirli bir standart değerde (genellikle $R_{\\text{out}} = 10\\text{ k}\\Omega$) olması istenir. Bu durumda $R_x \\parallel R_y = R_{\\text{out}}$ olmalıdır:</p>
            <div class="math-block">
              $$R_x = G_A \\cdot R_{\\text{out}}$$
              $$R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}}$$
            </div>
            <p>Bu sayede filtrenin genel kazancı kusursuz şekilde $1.0$'a kalibre edilirken çıkış empedansı $10\\text{ k}\\Omega$ sabitinde tutulur.</p>
          `
        },
        {
          id: 'ch4-6',
          title: '4.7 Pratik Mühendislik Konuları: Standart Bileşenler ve Hassasiyet Analizi',
          content: `
            <p><strong>Standart E-Serisi Toleransları:</strong> Teorik hesaplamalar sonucunda $13.924\\text{ k}\\Omega$ gibi standart dışı direnç değerleri çıkar. Endüstride en yakın standart nominal değere yuvarlama yapılır:</p>
            <ul>
              <li><strong>E12 Serisi (%10 Tolerans):</strong> 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2 (Genellikle kondansatörlerde).</li>
              <li><strong>E24 Serisi (%5 Tolerans):</strong> 24 standart basamak (Genel amaçlı metal film dirençlerde).</li>
              <li><strong>E96 Serisi (%1 Hassas Tolerans):</strong> 96 basamak (Yüksek hassasiyetli filtre devrelerinde).</li>
            </ul>

            <p><strong>Bileşen Hassasiyeti (Bode Sensitivity Analysis):</strong></p>
            <p>Bir devre parametresinin ($P$, örneğin $\\omega_0$ veya $Q$), bir pasif bileşendeki ($x$, örneğin $R_1$ veya $C_1$) tolerans değişimine karşı bağıl duyarlılığı şu türevle tanımlanır:</p>
            <div class="math-block">
              $$S_x^P = \\frac{\\partial P / P}{\\partial x / x} = \\frac{x}{P} \\frac{\\partial P}{\\partial x}$$
            </div>
            <p>Equal-Component Sallen-Key mimarisinde kesim frekansı $\\omega_0$'ın direnç ve kondansatörlere göre hassasiyeti $S_R^{\\omega_0} = -0.5$ ve $S_C^{\\omega_0} = -0.5$'tir (oldukça düşüktür). Ancak $Q$ faktörünün op-amp kazancı $K$'ya göre hassasiyeti $Q$ yükseldikçe artar; bu nedenle çok yüksek $Q$ değerlerinde ($Q > 10$) state-variable veya Tow-Thomas biquad gibi daha karmaşık topolojiler tercih edilir.</p>
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
