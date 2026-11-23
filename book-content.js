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
                <p>DC frekansından ($0\\text{ Hz}$) geçirme frekansına ($f_{\\text{pass}}$) kadar olan sinyalleri minimum zayıflamayla geçirir, $f_{\\text{stop}}$ üzerini zayıflatır.</p>
                <ul>
                  <li><strong>Geçirme Zayıflaması ($a_{\\text{pass}}$):</strong> $\\le a_{\\text{pass}}\\text{ dB}$ (tipik $0.1 \\dots 3\\text{ dB}$).</li>
                  <li><strong>Durdurma Zayıflaması ($a_{\\text{stop}}$):</strong> $\\ge a_{\\text{stop}}\\text{ dB}$ (tipik $20 \\dots 80\\text{ dB}$).</li>
                  <li><strong>Geçiş Oranı:</strong> $r = f_{\\text{stop}} / f_{\\text{pass}} > 1$.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-filter-modal="lowpass" style="width: 100%; margin-top: auto; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Alçak Geçiren Filtreyi İncele →
                </button>
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
                <p>Alçak frekansları ($0 \\dots f_{\\text{stop}}$) zayıflatır ve $f_{\\text{pass}}$ üzerindeki yüksek frekansları minimum kayıpla iletir.</p>
                <ul>
                  <li><strong>Durdurma Bölgesi:</strong> $0 \\le f \\le f_{\\text{stop}}$</li>
                  <li><strong>Geçirme Bölgesi:</strong> $f \\ge f_{\\text{pass}}$ ($f_{\\text{stop}} < f_{\\text{pass}}$)</li>
                  <li><strong>Geçiş Oranı:</strong> $r = f_{\\text{pass}} / f_{\\text{stop}} > 1$.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-filter-modal="highpass" style="width: 100%; margin-top: auto; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Yüksek Geçiren Filtreyi İncele →
                </button>
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
                <p>Belirli bir alt ($f_{\\text{p1}}$) ve üst ($f_{\\text{p2}}$) frekans aralığını geçirirken bandın dışını söndürür.</p>
                <ul>
                  <li><strong>Bant Genişliği ($B$):</strong> $B = f_{\\text{p2}} - f_{\\text{p1}}$</li>
                  <li><strong>Merkez Frekansı ($f_0$):</strong> $f_0 = \\sqrt{f_{\\text{p1}} \\cdot f_{\\text{p2}}}$</li>
                  <li><strong>Kalite Faktörü ($Q$):</strong> $Q = f_0 / B$.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-filter-modal="bandpass" style="width: 100%; margin-top: auto; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Bant Geçiren Filtreyi İncele →
                </button>
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
                  <li><strong>Durdurma (Çentik) Bölgesi:</strong> $[f_{\\text{s1}}, f_{\\text{s2}}]$</li>
                  <li><strong>Geçirme Bölgeleri:</strong> $0 \\le f \\le f_{\\text{p1}}$ ve $f \\ge f_{\\text{p2}}$</li>
                  <li><strong>Çentik Frekansı:</strong> $f_0 = \\sqrt{f_{\\text{s1}} f_{\\text{s2}}}$.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-filter-modal="bandstop" style="width: 100%; margin-top: auto; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Bant Söndüren Filtreyi İncele →
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'ch1-2',
          title: '1.2 Filtre Yaklaşım Teorisi: İdeal ve Pratik Yanıtlar (Figure 1.5)',
          content: `
            <p>İdeal bir filtre geçirme bandında kesinlikle $0\\text{ dB}$ zayıflamaya, durdurma bandında sonsuz zayıflamaya ($-\\infty\\text{ dB}$) ve bu iki bölge arasında sıfır genişlikli dikey bir geçişe ("tuğla duvar" - brick wall) sahip olmalıdır:</p>
            
            <div class="theory-card" style="margin: 16px 0;">
              <h4 style="margin-bottom: 8px;">İdeal (Tuğla Duvar) vs Pratik Filtre Yanıtı Karşılaştırması</h4>
              <div class="filter-spec-diagram-wrap">
                <svg viewBox="0 0 560 220" class="filter-spec-svg" xmlns="http://www.w3.org/2000/svg">
                  <!-- Axes -->
                  <line x1="75" y1="180" x2="520" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
                  <line x1="75" y1="25" x2="75" y2="180" stroke="#2f2e2b" stroke-width="1.8" />
                  <polygon points="500,177 508,180 500,183" fill="#2f2e2b" />
                  <polygon points="72,25 75,17 78,25" fill="#2f2e2b" />

                  <!-- Grid labels -->
                  <text x="68" y="55" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">1.0 (0 dB)</text>
                  <text x="68" y="180" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#2f2e2b">0.0 (-∞ dB)</text>
                  <text x="75" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#787774">0</text>
                  <text x="210" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#2f9e6e">ω_pass</text>
                  <text x="320" y="200" text-anchor="middle" font-family="Inter, sans-serif" font-size="11.5" font-weight="700" fill="#eb5757">ω_stop</text>
                  <text x="495" y="200" text-anchor="end" font-family="Inter, sans-serif" font-size="11" fill="#787774">Frekans (ω) →</text>

                  <!-- Transition band highlight -->
                  <rect x="210" y="40" width="110" height="140" fill="rgba(234, 179, 8, 0.08)" />
                  <text x="265" y="110" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#b45309">Geçiş Bandı (Transition Band)</text>

                  <!-- Ideal Brick-Wall curve (Dashed red) -->
                  <path d="M 75,50 L 215,50 L 215,180 L 520,180" fill="none" stroke="#ef4444" stroke-width="2.4" stroke-dasharray="6,4" />
                  <!-- Practical response curve (Solid blue) -->
                  <path d="M 75,50 C 165,50 195,55 210,70 C 235,95 285,155 320,165 C 370,175 430,178 500,179" fill="none" stroke="#3d5afe" stroke-width="3" />

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
              $$\\int_{-\\infty}^{\\infty} \\frac{|\\ln |H(j\\omega)||}{1 + \\omega^2} d\\omega < \\infty$$
            </div>
            <p>Eğer bir filtre belirli bir frekans bandında tamamen sıfır kazanca ($|H(j\\omega)| = 0$) sahip olursa, yukarıdaki integral ıraksar ve sistemin darbe yanıtı $h(t)$, uyarım uygulanmadan önce ($t < 0$) sıfırdan farklı bir değer almak zorunda kalır (nedensellik ihlali). Bu nedenle filtre tasarımının temeli, ideal yanıta en yakın matematiksel fonksiyonları bulma problemidir (yaklaşım teorisi).</p>
            <p>Dört temel klasik yaklaşım yöntemi geliştirilmiştir:</p>
            <ul>
              <li><strong>Butterworth:</strong> $\\omega = 0$ noktasında türevleri sıfırlayarak maksimum düzlük (maximally flat) sağlar.</li>
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
      summary: 'Transfer fonksiyonu matematiği, s-düzlemi kararlılık analizi, Butterworth, Chebyshev, Ters Chebyshev ve Eliptik yaklaşımlarının analitik türetimi, adım adım algoritmalar ve tüm formüller.',
      sections: [
        {
          id: 'ch2-1',
          title: '2.1 Transfer Fonksiyonları, s-Düzlemi ve Dört Klasik Normalize Yaklaşım',
          content: `
            <p>Lineer zamanla değişmeyen (LTI) analog bir filtrenin davranışı Laplace domeninde $H(s)$ transfer fonksiyonu ile modellenir:</p>
            <div class="math-block">
              $$H(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{N(s)}{D(s)} = \\frac{a_m s^m + a_{m-1} s^{m-1} + \\dots + a_1 s + a_0}{s^n + b_{n-1} s^{n-1} + \\dots + b_1 s + b_0}$$
            </div>
            <p>Burada $n$ filtrenin derecesidir ($n \\ge m$). Pay polinomunun köklerine <strong>sıfırlar (zeros - $z_i$)</strong>, payda polinomunun köklerine <strong>kutuplar (poles - $p_k$)</strong> denir:</p>
            <div class="math-block">
              $$H(s) = G \\cdot \\frac{\\prod_{i=1}^{m} (s - z_i)}{\\prod_{k=1}^{n} (s - p_k)}$$
            </div>
            <p><strong>Kararlılık Kriteri (BIBO Stability):</strong> Filtrenin sınırlı girişe sınırlı çıkış vermesi için transfer fonksiyonunun tüm kutuplarının $s$-düzleminin kesinlikle sol yarı düzleminde yer alması zorunludur: $\\text{Re}(p_k) < 0$.</p>

            <p><strong>Dört Temel Normalize Filtre Prototipi Karşılaştırması:</strong> Aşağıdaki kartlardan dilediğiniz filtre yaklaşımını seçerek ayrıntılı analitik adımlarını, s-düzlemi kutup-sıfır diyagramlarını ve tasarım formüllerini inceleyebilirsiniz:</p>

            <div class="theory-grid-2" style="margin-top: 14px;">
              <!-- 1. Butterworth Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #3d5afe;">Butterworth (Maksimum Düz)</h4>
                  <span class="stage-badge" style="background: rgba(61,90,254,0.1); color: #3d5afe;">Birim Çember</span>
                </div>
                <p>Geçirme bandında $\\omega = 0$'da Taylor serisinin ilk $2n-1$ türevi sıfırdır. Tamamen dalgalanmasız, yumuşak geçişli ve mükemmel faz doğrusallığına sahip klasik filtredir.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Kutup Konumları:</strong> Sol yarı $s$-düzleminde birim çember üzerinde $\\theta_k = \\frac{2k-1}{2n}\\pi$.</li>
                  <li><strong>Geçirme Bandı:</strong> Kesinlikle monotonik ve düz ($0\\text{ dB}$'den $-a_{\\text{pass}}$'e).</li>
                  <li><strong>Durdurma Bandı:</strong> Monotonik düşüş, $-20n\\text{ dB/dekad}$.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-approx-modal="butterworth" style="width: 100%; margin-top: auto; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Butterworth Yaklaşımını İncele →
                </button>
              </div>

              <!-- 2. Chebyshev Tip I Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #ef4444;">Chebyshev Tip I (Eşit Dalgalı)</h4>
                  <span class="stage-badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Elips Kutupları</span>
                </div>
                <p>Geçirme bandında izin verilen $a_{\\text{pass}}$ dalgalanması karşılığında geçiş bandında çok daha dik bir kesim sağlar. Aynı derece $n$ için Butterworth'ten belirgin şekilde daha seçicidir.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Kutup Konumları:</strong> Odakları $\\pm j$ üzerinde olan elips üzerinde.</li>
                  <li><strong>Geçirme Bandı:</strong> Eşit dalgalı (equiripple, $0 \\dots a_{\\text{pass}}$ dB).</li>
                  <li><strong>Durdurma Bandı:</strong> Monotonik düşüş, hızlı zayıflama.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-approx-modal="chebyshev" style="width: 100%; margin-top: auto; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Chebyshev Tip I Yaklaşımını İncele →
                </button>
              </div>

              <!-- 3. Ters Chebyshev Tip II Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #10b981;">Ters Chebyshev (Tip II)</h4>
                  <span class="stage-badge" style="background: rgba(16,185,129,0.1); color: #10b981;">jω Sıfırları</span>
                </div>
                <p>Geçirme bandı Butterworth gibi tamamen düz ve dalgalanmasızdır. Durdurma bandında ise sonlu iletim sıfırları barındırarak eşit dalgalı zayıflama eşiği sunar.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Sıfır Konumları:</strong> $j\\omega$ sanal ekseninde saf imajiner sıfırlar $\\pm j \\omega_{z,k}$.</li>
                  <li><strong>Geçirme Bandı:</strong> Maksimum düz (dalgalanma yok, mükemmel geçiş).</li>
                  <li><strong>Durdurma Bandı:</strong> $a_{\\text{stop}}$ eşiğinde eşit dalgalı, sonsuz çentikler.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-approx-modal="inv_chebyshev" style="width: 100%; margin-top: auto; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Ters Chebyshev Yaklaşımını İncele →
                </button>
              </div>

              <!-- 4. Eliptik (Cauer) Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #8b5cf6;">Eliptik (Cauer - Çift Eşdalgalı)</h4>
                  <span class="stage-badge" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">En Düşük Derece N</span>
                </div>
                <p>Hem geçirme hem de durdurma bandında eşit dalgalanmaya izin verir. Verilen toleranslar için teorik olarak <strong>en küçük filtre derecesini ($N$)</strong> ve en dik geçişi sağlar.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Matematiksel Taban:</strong> Jacobi eliptik fonksiyonları $cd(u, k)$ ve eliptik integraller.</li>
                  <li><strong>Geçirme Bandı:</strong> Eşit dalgalı ($a_{\\text{pass}}$ dB).</li>
                  <li><strong>Durdurma Bandı:</strong> Eşit dalgalı ($a_{\\text{stop}}$ dB) ve $j\\omega$ iletim sıfırları.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-approx-modal="elliptic" style="width: 100%; margin-top: auto; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Eliptik (Cauer) Yaklaşımını İncele →
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'ch2-2',
          title: '2.2 Butterworth Yaklaşımı (Maksimum Düz - Maximally Flat)',
          content: `
            <p>Butterworth yaklaşımının temel amacı, geçirme bandında mümkün olan en yüksek düzlüğü elde etmektir. Büyüklük karesi fonksiyonu Denklem 2.6 ile tanımlanır:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\epsilon^2 \\left(\\frac{\\omega}{\\omega_0}\\right)^{2n}}$$
            </div>
            <p>$\\omega = 0$ civarında Taylor serisine açıldığında, ilk $2n-1$ türevin sıfır olduğu görülür (maksimum düzlük buradan gelir). $\\epsilon = 1$ ve $\\omega = \\omega_0$ frekansında genlik $|H(j\\omega_0)|^2 = 1/2 \\implies -3.01\\text{ dB}$ düşer.</p>

            <p><strong>Adım 1: Dalgalanma Faktörü (ε) ve Filtre Derecesinin (n_B) Hesabı (Denklem 2.7 & 2.8):</strong></p>
            <div class="math-block">
              $$\\epsilon = \\sqrt{10^{-0.1 a_{\\text{pass}}} - 1}$$
              $$n_B \\ge \\frac{\\log_{10}\\left[ \\frac{10^{-0.1 a_{\\text{stop}}} - 1}{10^{-0.1 a_{\\text{pass}}} - 1} \\right]}{2 \\log_{10}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$
            </div>
            <p>Hesaplanan $n_B$ değeri bir üst tam sayıya yuvarlanır: $n = \\lceil n_B \\rceil$.</p>

            <p><strong>Adım 2: Normalize Çember Yarıçapının (R) Hesabı (Denklem 2.9):</strong></p>
            <p>Kutuplar $s$-düzleminde yarıçapı $R$ olan bir çember üzerinde simetrik dizilir. Normalize durumda çemberin yarıçapı:</p>
            <div class="math-block">
              $$R = \\epsilon^{-1/n}$$
            </div>

            <p><strong>Adım 3: İkinci Bölge Kutup Açıları (θ_m) ve m İndis Hesabı (Denklem 2.10a & 2.10b):</strong></p>
            <p>Sol yarı düzlemdeki (LHP) ikinci bölge kutup açıları $m$ indisi ile hesaplanır:</p>
            <div class="math-block">
              $$\\text{Çift } n \\text{ için } \\left(m = 0, 1, \\dots, \\frac{n}{2} - 1\\right): \\quad \\theta_m = \\frac{2m + 1 + n}{2n}\\pi$$
              $$\\text{Tek } n \\text{ için } \\left(m = 0, 1, \\dots, \\frac{n-1}{2} - 1\\right): \\quad \\theta_m = \\frac{2m + 1 + n}{2n}\\pi$$
            </div>

            <p><strong>Adım 4: Kutup Koordinatları (σ_m, ω_m) ve Tek Derece Reel Kutbu (Denklem 2.11 - 2.13):</strong></p>
            <div class="math-block">
              $$\\sigma_m = R \\cos(\\theta_m), \\quad \\omega_m = R \\sin(\\theta_m)$$
              $$p_m = \\sigma_m + j \\omega_m, \\quad p_m^* = \\sigma_m - j \\omega_m$$
              $$\\text{Tek } n \\text{ için reel kutup: } \\sigma_R = -R, \\quad \\omega_R = 0$$
            </div>

            <p><strong>Adım 5: Kuadratik Biquad Katsayıları (B_{1,m}, B_{2,m}) ve 1. Derece Kat (H_0(S)) (Denklem 2.14 - 2.17):</strong></p>
            <div class="math-block">
              $$H_m(S) = \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$
              $$B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = \\sigma_m^2 + \\omega_m^2 = R^2$$
              $$\\text{Tek } n \\text{ için 1. derece kat: } H_0(S) = \\frac{R}{S + R}$$
            </div>

            <p><strong>Adım 6: Tam Normalize Transfer Fonksiyonu H_{B,n}(S) (Denklem 2.18a & 2.18b):</strong></p>
            <div class="math-block">
              $$n \\text{ çift ise: } H_{B,n}(S) = \\prod_{m=0}^{(n/2)-1} \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$
              $$n \\text{ tek ise: } H_{B,n}(S) = \\frac{R}{S + R} \\prod_{m=0}^{[(n-1)/2]-1} \\frac{B_{2,m}}{S^2 + B_{1,m} S + B_{2,m}}$$
            </div>

            <div class="theory-card" style="margin-top: 14px; background: #fafaf9; border-left: 3px solid #3d5afe;">
              <h4 style="color: #3d5afe; margin-bottom: 6px;">📖 Kitap Örneği 2.2 (Les Thede s. 23 - Üçüncü Derece Butterworth):</h4>
              <p style="font-size: 12.5px; margin-bottom: 6px;">Spesifikasyon: $a_{\\text{pass}} = -1\\text{ dB}$, $a_{\\text{stop}} = -12\\text{ dB}$, $\\omega_{\\text{pass}} = 1\\text{ rad/s}$, $\\omega_{\\text{stop}} = 2\\text{ rad/s}$.</p>
              <ul style="font-size: 12px; line-height: 1.5; font-family: var(--font-mono); margin-bottom: 8px;">
                <li>$\\epsilon = \\sqrt{10^{0.1} - 1} = 0.508847$</li>
                <li>$n = 2.92 \\implies n = 3$</li>
                <li>$R = \\epsilon^{-1/3} = 1.252576$</li>
                <li>Tek $n \\implies \\sigma_R = -R = -1.252576$, $\\omega_R = 0$</li>
                <li>$m = 0 \\implies \\theta_0 = \\frac{2(0) + 1 + 3}{2(3)}\\pi = \\frac{2\\pi}{3} = 120^\\circ$</li>
                <li>$\\sigma_0 = 1.252576 \\cos(120^\\circ) = -0.626288$, $\\omega_0 = 1.252576 \\sin(120^\\circ) = 1.084763$</li>
                <li>$B_{1,0} = -2\\sigma_0 = 1.252576$, $B_{2,0} = R^2 = 1.568948$</li>
              </ul>
              <div class="math-block" style="background: #fff; padding: 8px;">
                $$H_{B,3}(S) = \\frac{1.252576}{S + 1.252576} \\cdot \\frac{1.568948}{S^2 + 1.252576 S + 1.568948}$$
              </div>
            </div>

            <button type="button" class="btn btn-outline" data-open-approx-modal="butterworth" style="margin-top: 14px; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fafaf9; cursor: pointer;">
              📖 Butterworth Yaklaşımını Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & s-Düzlemi) →
            </button>
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
            <p>Kapalı form trigonometrik ve hiperbolik tanımı:</p>
            <div class="math-block">
              $$C_n(\\omega) = \\begin{cases} \\cos(n \\arccos \\omega), & |\\omega| \\le 1 \\text{ (Geçirme Bandı - Eşit Dalgalı)} \\\\ \\cosh(n \\operatorname{arcosh} \\omega), & |\\omega| > 1 \\text{ (Durdurma Bandı - Monotonik)} \\end{cases}$$
            </div>

            <p><strong>Adım 1: Gereken Derecenin ($n$) Hesabı (Denklem 2.18):</strong></p>
            <div class="math-block">
              $$n \\ge \\frac{\\operatorname{arcosh}\\left( \\sqrt{\\frac{10^{-a_{\\text{stop}}/10} - 1}{\\epsilon^2}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$
            </div>

            <p><strong>Adım 2: Kutupların Elips Üzerindeki Dağılımı (Denklem 2.22 - 2.25):</strong></p>
            <p>Chebyshev kutupları birim çember yerine odakları $\\pm j$ üzerinde olan bir elips üzerinde yer alır:</p>
            <div class="math-block">
              $$\\gamma = \\frac{1}{n} \\operatorname{arsinh}\\left(\\frac{1}{\\epsilon}\\right)$$
              $$\\sigma_k = -\\sinh(\\gamma) \\sin(\\theta_k), \\quad \\omega_k = \\cosh(\\gamma) \\cos(\\theta_k)$$
              $$p_k = \\sigma_k + j \\omega_k, \\quad \\theta_k = \\frac{2k-1}{2n}\\pi$$
            </div>

            <p><strong>Adım 3: İkinci Derece Biquad Katsayıları ve DC Kazanç Düzeltmesi:</strong></p>
            <div class="math-block">
              $$b_1 = 2\\sinh(\\gamma)\\sin(\\theta_k), \\quad b_0 = \\sinh^2(\\gamma)\\sin^2(\\theta_k) + \\cosh^2(\\gamma)\\cos^2(\\theta_k)$$
              $$H_k(s) = \\frac{b_0}{s^2 + b_1 s + b_0}$$
            </div>
            <p><strong>Çift Derece DC Kazanç Düzeltmesi:</strong> $n$ çift olduğunda $\\omega=0$'da $C_n(0) = 1$ olduğu için filtrenin DC kazancı $1/\\sqrt{1+\\epsilon^2} = 10^{a_{\\text{pass}}/20}$ değerindedir. Aktif devre tasarımında Bölüm 4'teki kazanç bölücüsü ile dengelenir.</p>

            <button type="button" class="btn btn-outline" data-open-approx-modal="chebyshev" style="margin-top: 14px; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fafaf9; cursor: pointer;">
              📖 Chebyshev Tip I Yaklaşımını Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & s-Düzlemi) →
            </button>
          `
        },
        {
          id: 'ch2-4',
          title: '2.4 Ters Chebyshev Yaklaşımı (Tip II - Inverse Chebyshev)',
          content: `
            <p>Ters Chebyshev (Tip II) filtresi, standart Chebyshev'in frekans ekseninde ters çevrilmesi ($1/\\omega$) ile elde edilir. En büyük avantajı, <strong>geçirme bandının Butterworth gibi tamamen düz ve dalgalanmasız</strong> olmasıdır. Dalgalanma sadece durdurma bandında yer alır:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\frac{1}{\\epsilon_s^2 C_n^2(1/\\omega)}} = \\frac{\\epsilon_s^2 C_n^2(1/\\omega)}{1 + \\epsilon_s^2 C_n^2(1/\\omega)}$$
            </div>
            <p>Burada $\\epsilon_s$ durdurma bandı dalgalanma faktörüdür:</p>
            <div class="math-block">
              $$\\epsilon_s = \\frac{1}{\\sqrt{10^{a_{\\text{stop}}/10} - 1}}$$
            </div>

            <p><strong>Adım 1: Derece ($n$) Hesabı:</strong> Standart Chebyshev ile tamamen aynı formülle hesaplanır:</p>
            <div class="math-block">
              $$n \\ge \\frac{\\operatorname{arcosh}\\left( \\frac{\\sqrt{10^{a_{\\text{stop}}/10} - 1}}{\\sqrt{10^{a_{\\text{pass}}/10} - 1}} \\right)}{\\operatorname{arcosh}(\\omega_{\\text{stop}} / \\omega_{\\text{pass}})}$$
            </div>

            <p><strong>Adım 2: $j\\omega$ Sanal Eksenindeki İletim Sıfırları (Transmission Zeros):</strong></p>
            <p>Chebyshev polinomunun $C_n(1/\\omega_{z,k}) = 0$ olduğu frekanslarda transfer fonksiyonu tam olarak sıfır olur ($-\\infty\\text{ dB}$ derin çentikler):</p>
            <div class="math-block">
              $$\\omega_{z,k} = \\frac{1}{\\cos\\left(\\frac{2k-1}{2n}\\pi\\right)}, \\quad z_k = \\pm j \\omega_{z,k}$$
            </div>

            <p><strong>Adım 3: Kutupların Türetilmesi ve Biquad Yapısı:</strong></p>
            <p>Ters Chebyshev kutupları, standart Chebyshev kutuplarının ($p_{\\text{cheb},k} = \\sigma_k + j \\omega_k$) çarpmaya göre tersi alınarak elde edilir:</p>
            <div class="math-block">
              $$p_k = \\frac{1}{\\sigma_k + j \\omega_k} = \\frac{\\sigma_k - j \\omega_k}{\\sigma_k^2 + \\omega_k^2}$$
            </div>
            <p>İkinci derece katların transfer fonksiyonunda hem pay (sıfırlar) hem payda (kutuplar) ikinci derecedir:</p>
            <div class="math-block">
              $$H_k(s) = \\frac{s^2 + \\omega_{z,k}^2}{s^2 + b_1 s + b_0} \\cdot \\frac{b_0}{\\omega_{z,k}^2}$$
            </div>
            <p>Böylece DC'de ($s=0$) kazanç kesinlikle $1.0$ ($0\\text{ dB}$) olur. Bu katlar Bölüm 4'teki <strong>GIC (Generalized Impedance Converter)</strong> veya biquad çentik devreleri ile uygulanır.</p>

            <button type="button" class="btn btn-outline" data-open-approx-modal="inv_chebyshev" style="margin-top: 14px; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fafaf9; cursor: pointer;">
              📖 Ters Chebyshev Yaklaşımını Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & s-Düzlemi) →
            </button>
          `
        },
        {
          id: 'ch2-5',
          title: '2.5 Eliptik Yaklaşımı (Cauer - Çift Eşit Dalgalı)',
          content: `
            <p>Eliptik (Cauer) filtreler, hem geçirme bandında ($a_{\\text{pass}}$) hem de durdurma bandında ($a_{\\text{stop}}$) eşit dalgalanmaya (equiripple) izin verir. Matematiksel temeli Jacobi eliptik fonksiyonlarına dayanır:</p>
            <div class="math-block">
              $$|H(j\\omega)|^2 = \\frac{1}{1 + \\epsilon^2 R_n^2(\\omega, L)}$$
            </div>
            <p>Burada $R_n(\\omega, L)$ rasyonel Chebyshev fonksiyonudur ve Jacobi eliptik fonksiyonları ile tanımlanır:</p>
            <div class="math-block">
              $$R_n(\\omega, L) = \\operatorname{cd}\\left( n \\frac{K_1}{K} \\operatorname{cd}^{-1}(\\omega, k), k_1 \\right)$$
            </div>
            <p>Burada $k = \\omega_{\\text{pass}} / \\omega_{\\text{stop}} < 1$ seçicilik faktörü, $K(k)$ ise birinci türden tam eliptik integraldir.</p>

            <p><strong>En Düşük Derece Teoremi (Minimal Order Theorem):</strong> Verilen herhangi bir tolerans dörtlüsü için ($a_{\\text{pass}}, a_{\\text{stop}}, \\omega_{\\text{pass}}, \\omega_{\\text{stop}}$), Eliptik filtre <strong>kuramsal olarak mümkün olan en küçük dereceyi ($n$)</strong> gerektirir:</p>
            <div class="math-block">
              $$n \\ge \\frac{K(k) K'(k_1)}{K'(k) K(k_1)}$$
            </div>
            <p>Örneğin Butterworth ile $n=8$, Chebyshev ile $n=5$ gerektiren bir spesifikasyon, Eliptik filtre ile $n=3$ veya $n=4$ ile karşılanabilir. Bu durum devrede op-amp ve bileşen sayısını doğrudan yarıya indirir!</p>

            <p><strong>Biquad Kat Transfer Fonksiyonları:</strong></p>
            <div class="math-block">
              $$H_k(s) = \\frac{s^2 + \\omega_{z,k}^2}{s^2 + b_1 s + b_0} \\cdot \\frac{b_0}{\\omega_{z,k}^2}$$
            </div>

            <button type="button" class="btn btn-outline" data-open-approx-modal="elliptic" style="margin-top: 14px; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fafaf9; cursor: pointer;">
              📖 Eliptik (Cauer) Yaklaşımını Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & s-Düzlemi) →
            </button>
          `
        },
        {
          id: 'ch2-6',
          title: '2.6 Yaklaşım Yöntemlerinin Kapsamlı Karşılaştırması & Seçim Rehberi',
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
      summary: 'Normalize prototip fonksiyonunun gerçek frekanslara ölçeklenmesi, 3 adımlı evrensel tasarım prosedürü, LP to LP, HP, BP, BS frekans dönüşümleri, biquad katsayı türetimleri ve grup gecikmesi analizi.',
      sections: [
        {
          id: 'ch3-1',
          title: '3.1 Normalize Olmayan Filtre Tasarım Prosedürü ve Dört Frekans Dönüşümü (Şekil 3.1 & Genel Bakış)',
          content: `
            <p>Bölüm 2'de normalize prototip filtrelerin ($1\\text{ rad/s}$ kesim frekanslı) transfer fonksiyonları analitik olarak türetilmişti. Bu bölümün temel hedefi, bu prototip fonksiyonlarını istenen gerçek frekanslara ($f_{\\text{pass}}, f_{\\text{stop}}$) ölçeklemek ve <strong>Alçak Geçiren (LP)</strong>, <strong>Yüksek Geçiren (HP)</strong>, <strong>Bant Geçiren (BP)</strong> veya <strong>Bant Söndüren / Çentik (BS)</strong> filtre türlerine dönüştürmektir.</p>

            <div style="background: #fafaf9; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; margin: 16px 0;">
              <h4 style="margin: 0 0 10px; color: var(--text-h); font-size: 14px; font-weight: 700;">🔄 Les Thede 3 Adımlı Evrensel Tasarım Prosedürü (Şekil 3.1):</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
                <div style="background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 12px;">
                  <strong style="color: #3d5afe; font-size: 13px;">Adım 1: Derece ($n$) Hesabı</strong>
                  <p style="font-size: 12.5px; color: var(--muted); margin: 4px 0 0;">Normalize olmayan spesifikasyonlardan bağıl frekans oranı $\\Omega_r$ hesaplanır ve gereken minimum filtre derecesi $n$ bulunur (Denklem 3.1 - 3.6).</p>
                </div>
                <div style="background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 12px;">
                  <strong style="color: #10b981; font-size: 13px;">Adım 2: Normalize Prototip $H(S)$</strong>
                  <p style="font-size: 12.5px; color: var(--muted); margin: 4px 0 0;">Seçilen yaklaşım türüne (Butterworth, Chebyshev, Ters Chebyshev, Eliptik) göre $1\\text{ rad/s}$ kesimli normalize transfer fonksiyonu $H(S)$ türetilir.</p>
                </div>
                <div style="background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 12px;">
                  <strong style="color: #8b5cf6; font-size: 13px;">Adım 3: Frekans Dönüşümü $S(s)$</strong>
                  <p style="font-size: 12.5px; color: var(--muted); margin: 4px 0 0;">İstenen filtre türünün frekans dönüşüm operatörü ($S = s/\\omega_0$, $S = \\omega_0/s$, $S = \\frac{s^2+\\omega_0^2}{BW s}$ vb.) uygulanarak son $H(s)$ katsayıları hesaplanır.</p>
                </div>
              </div>
            </div>

            <p>Dört temel analog filtre türü için frekans dönüşüm operatörleri ve özellikleri aşağıda özetlenmiştir:</p>

            <div class="theory-grid-2" style="margin-top: 14px;">
              <!-- 1. LP to LP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #3d5afe;">Alçak Geçiren Ölçekleme (LP to LP)</h4>
                  <span class="stage-badge" style="background: rgba(61,90,254,0.1); color: #3d5afe;">Frekans Ölçekleme</span>
                </div>
                <p>Normalize frekans değişkeni $S$, gerçek açısal frekans $\\omega_0 = 2\\pi f_0$ ile ölçeklenir. Filtre derecesi ve kutup sayısı değişmez ($n \\to n$).</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Dönüşüm Operatörü:</strong> $S = \\frac{s}{\\omega_0} = \\frac{s}{2\\pi f_0}$.</li>
                  <li><strong>Katsayı Değişimi:</strong> $b_1 = B_1 \\omega_0, \\quad b_2 = B_2 \\omega_0^2$.</li>
                  <li><strong>DC Kazancı:</strong> Değişmez ($s=0$ noktasında kazanç $1.0$).</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-transform-modal="lp_to_lp" style="width: 100%; margin-top: auto; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 LP to LP Dönüşümünü İncele →
                </button>
              </div>

              <!-- 2. LP to HP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #ef4444;">Yüksek Geçiren Dönüşümü (LP to HP)</h4>
                  <span class="stage-badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">Frekans Evirme</span>
                </div>
                <p>Frekans spektrumu evrilerek alçak frekanslar söndürülür, yüksek frekanslar iletilir. Orijinde ($s=0$) $n$ adet iletim sıfırı oluşur.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Dönüşüm Operatörü:</strong> $S = \\frac{\\omega_0}{s} = \\frac{2\\pi f_0}{s}$.</li>
                  <li><strong>Katsayı Değişimi:</strong> $b_1 = \\frac{B_1 \\omega_0}{B_2}, \\quad b_2 = \\frac{\\omega_0^2}{B_2}$.</li>
                  <li><strong>Orijin Sıfırları:</strong> Payda $s^2$ terimleri DC akımını bloke eder.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-transform-modal="lp_to_hp" style="width: 100%; margin-top: auto; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 LP to HP Dönüşümünü İncele →
                </button>
              </div>

              <!-- 3. LP to BP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #10b981;">Bant Geçiren Dönüşümü (LP to BP)</h4>
                  <span class="stage-badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Derece İki Katına (2n)</span>
                </div>
                <p>Her bir kutup merkez frekans $\\pm j\\omega_0$ civarında simetrik rezonans çiftine çatallanır. Derece iki katına ($2n$) çıkar.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Dönüşüm Operatörü:</strong> $S = \\frac{s^2 + \\omega_0^2}{BW \\cdot s}$.</li>
                  <li><strong>Merkez Frekans:</strong> $\\omega_0 = \\sqrt{\\omega_{\\text{p1}} \\omega_{\\text{p2}}}$, $BW = \\omega_{\\text{p2}} - \\omega_{\\text{p1}}$.</li>
                  <li><strong>Simetri Koşulu:</strong> $\\omega_{\\text{s1}} \\omega_{\\text{s2}} = \\omega_0^2$ geometrik simetrisi.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-transform-modal="lp_to_bp" style="width: 100%; margin-top: auto; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 LP to BP Dönüşümünü İncele →
                </button>
              </div>

              <!-- 4. LP to BS Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #8b5cf6;">Bant Söndüren / Çentik (LP to BS)</h4>
                  <span class="stage-badge" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">Çentik Sıfırları (±jω₀)</span>
                </div>
                <p>Bant geçiren dönüşümünün cebirsel tersidir. $s = \\pm j\\omega_0$ frekansında pay sıfır olarak sonsuz zayıflamalı çentik oluşturur.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Dönüşüm Operatörü:</strong> $S = \\frac{BW \\cdot s}{s^2 + \\omega_0^2}$.</li>
                  <li><strong>Çentik Frekansı:</strong> $\\omega_0 = \\sqrt{\\omega_{\\text{s1}} \\omega_{\\text{s2}}}$ frekansında tam sıfır iletim.</li>
                  <li><strong>Derece:</strong> $2n$ dereceli aktif biquad katları.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-transform-modal="lp_to_bs" style="width: 100%; margin-top: auto; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 LP to BS Dönüşümünü İncele →
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'ch3-2',
          title: '3.2 Alçak Geçiren Filtre Ölçeklemesi (Unnormalized Lowpass - LP to LP)',
          content: `
            <p>Normalize prototip transfer fonksiyonları $1\\text{ rad/s}$ referans frekansı için türetilmiştir. Gerçek bir devrede istenen kesim frekansı $\\omega_0 = 2\\pi f_0$ (veya $f_{\\text{pass}}$) olduğundan, Laplace frekans ekseni $\\omega_0$ faktörü ile genişletilir:</p>
            <div class="math-block">
              $$S = \\frac{s}{\\omega_0} = \\frac{s}{2\\pi f_0} \\quad \\Longleftrightarrow \\quad s = S \\cdot \\omega_0$$
            </div>

            <p><strong>3.2.1 Birinci Derece Faktörün Dönüşümü (Denklem 3.7 - 3.9):</strong></p>
            <p>Tek dereceli filtrelerde bulunan $S + b_0$ payda terimi yerine $S = s/\\omega_0$ yazılarak pay ve payda $\\omega_0$ ile genişletilir:</p>
            <div class="math-block">
              $$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = s/\\omega_0} \\frac{1}{\\frac{s}{\\omega_0} + b_0} = \\frac{\\omega_0}{s + b_0 \\omega_0}$$
              $$H(s) = \\frac{b_2}{s + b_2}, \\quad \\text{burada } b_2 = b_0 \\cdot \\omega_0$$
            </div>

            <p><strong>3.2.2 İkinci Derece Kuadratik Faktörün Dönüşümü (Denklem 3.10 - 3.13):</strong></p>
            <p>Genel biquad transfer fonksiyonundaki her $S$ terimi yerine $s/\\omega_0$ konulup pay ve payda $\\omega_0^2$ ile çarpılır:</p>
            <div class="math-block">
              $$H(S) = \\frac{A_2 S^2 + A_1 S + A_0}{S^2 + B_1 S + B_2} \\xrightarrow{S = s/\\omega_0} \\frac{A_2 \\left(\\frac{s}{\\omega_0}\\right)^2 + A_1 \\left(\\frac{s}{\\omega_0}\\right) + A_0}{\\left(\\frac{s}{\\omega_0}\\right)^2 + B_1 \\left(\\frac{s}{\\omega_0}\\right) + B_2}$$
              $$H(s) = \\frac{a_2 s^2 + a_1 s + a_0}{s^2 + b_1 s + b_2}$$
              $$b_1 = B_1 \\cdot \\omega_0, \\quad b_2 = B_2 \\cdot \\omega_0^2$$
              $$a_2 = A_2, \\quad a_1 = A_1 \\cdot \\omega_0, \\quad a_0 = A_0 \\cdot \\omega_0^2$$
            </div>
            <p>Tüm-kutuplu (Butterworth ve standart Chebyshev) filtrelerde pay daima sabit bir skalerdir ($A_2 = 0, A_1 = 0, A_0 = B_2$). Bu nedenle unnormalized fonksiyonda pay katsayısı doğrudan $a_0 = b_2$ olur.</p>

            <button type="button" class="btn btn-outline" data-open-transform-modal="lp_to_lp" style="margin-top: 14px; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fafaf9; cursor: pointer;">
              📖 LP to LP Dönüşümünü Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & Katsayılar) →
            </button>
          `
        },
        {
          id: 'ch3-3',
          title: '3.3 Yüksek Geçiren Filtre Dönüşümü (Unnormalized Highpass - LP to HP)',
          content: `
            <p>Yüksek geçiren transfer fonksiyonunu elde etmek için frekans düzlemi ters çevrilir (frequency inversion). Bu işlem alçak frekansları durdurma bölgesine iterken, yüksek frekansları geçirme bölgesine taşır:</p>
            <div class="math-block">
              $$S = \\frac{\\omega_0}{s} = \\frac{2\\pi f_0}{s}$$
            </div>
            <p>Burada $\\omega_0 = 2\\pi f_{\\text{pass}}$ (Ters Chebyshev için $\\omega_0 = 2\\pi f_{\\text{stop}}$) olarak alınır.</p>

            <p><strong>3.3.1 Birinci Derece Faktörün Dönüşümü (Denklem 3.14 - 3.15):</strong></p>
            <div class="math-block">
              $$H(S) = \\frac{1}{S + b_0} \\xrightarrow{S = \\omega_0 / s} \\frac{1}{\\frac{\\omega_0}{s} + b_0} = \\frac{s}{b_0 s + \\omega_0} = \\frac{\\frac{1}{b_0} s}{s + \\frac{\\omega_0}{b_0}}$$
              $$H(s) = \\frac{s}{s + b_2}, \\quad \\text{burada } b_2 = \\frac{\\omega_0}{b_0}, \\quad \\text{Kazanç} = \\frac{1}{b_0}$$
            </div>

            <p><strong>3.3.2 İkinci Derece Faktörün Dönüşümü (Denklem 3.16 - 3.18):</strong></p>
            <p>Tüm-kutuplu ikinci derece alçak geçiren faktörüne dönüşüm uygulandığında:</p>
            <div class="math-block">
              $$H(S) = \\frac{B_2}{S^2 + B_1 S + B_2} \\xrightarrow{S = \\omega_0 / s} \\frac{B_2}{\\left(\\frac{\\omega_0}{s}\\right)^2 + B_1 \\left(\\frac{\\omega_0}{s}\\right) + B_2} = \\frac{B_2 s^2}{B_2 s^2 + B_1 \\omega_0 s + \\omega_0^2}$$
              $$H(s) = \\frac{s^2}{s^2 + b_1 s + b_2}, \\quad b_1 = \\frac{B_1 \\omega_0}{B_2}, \\quad b_2 = \\frac{\\omega_0^2}{B_2}$$
            </div>
            <p><strong>Orijindeki Sıfırlar ($s^2$):</strong> Pay kısmında $s^2$ terimi ortaya çıkar. Bu terim $s=0$ (DC) frekansında transfer fonksiyonunu tam olarak sıfır ($-\\infty\\text{ dB}$) yapar; böylece devrenin DC bileşenleri tamamen engellenir.</p>

            <button type="button" class="btn btn-outline" data-open-transform-modal="lp_to_hp" style="margin-top: 14px; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fafaf9; cursor: pointer;">
              📖 LP to HP Dönüşümünü Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & Katsayılar) →
            </button>
          `
        },
        {
          id: 'ch3-4',
          title: '3.4 Bant Geçiren Filtre Dönüşümü (Unnormalized Bandpass - LP to BP)',
          content: `
            <p>Bant geçiren dönüşümünde, alçak geçiren prototipteki her bir kutup merkez frekansı $\\omega_0$ civarında simetrik bir kutup çiftine genişler. Bu nedenle $n$ dereceli bir LP prototipi, <strong>$2n$ dereceli</strong> bir bant geçiren filtreye dönüşür:</p>
            <div class="math-block">
              $$S = \\frac{s^2 + \\omega_0^2}{BW \\cdot s}$$
              $$\\omega_0 = 2\\pi \\sqrt{f_{\\text{p1}} \\cdot f_{\\text{p2}}}, \\quad BW = 2\\pi (f_{\\text{p2}} - f_{\\text{p1}})$$
            </div>

            <p><strong>3.4.1 Geometrik Simetri Koşulu ve Düzeltme Algoritması (Denklem 3.24):</strong></p>
            <p>Matematiksel dönüşümün geçerli olabilmesi için durdurma bandı frekansları $\\omega_0$ merkezine göre geometrik olarak simetrik olmalıdır:</p>
            <div class="math-block">
              $$\\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}} = \\omega_0^2$$
            </div>
            <p>Eğer verilen kullanıcı spesifikasyonunda $\\omega_{\\text{s1}} \\cdot \\omega_{\\text{s2}} \\ne \\omega_0^2$ ise, tasarım toleransını bozmamak için daha geniş olan durdurma bandı sınırı sıkılaştırılarak simetri sağlanır ($\omega_{\\text{s2}} = \\omega_0^2 / \\omega_{\\text{s1}}$).</p>

            <p><strong>3.4.2 Birinci Derece LP Faktörünün BP'ye Dönüşümü (Denklem 3.25 - 3.26):</strong></p>
            <div class="math-block">
              $$\\frac{1}{S + b_0} \\xrightarrow{S = \\frac{s^2+\\omega_0^2}{BW s}} \\frac{1}{\\frac{s^2+\\omega_0^2}{BW s} + b_0} = \\frac{(b_0 BW) s}{s^2 + (b_0 BW) s + \\omega_0^2}$$
              $$H(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2}, \\quad b_1 = b_0 BW, \\quad b_2 = \\omega_0^2, \\quad a_1 = b_0 BW$$
            </div>
            <p>Görüldüğü üzere 1. dereceden bir faktör, doğrudan 2. dereceden bir aktif rezonans biquad katına dönüşür!</p>

            <p><strong>3.4.3 İkinci Derece LP Faktörünün İki Biquad Katına Faktörizasyonu (Denklem 3.31 - 3.49):</strong></p>
            <p>İkinci dereceden bir kuadratik LP faktörü, $S = (s^2+\\omega_0^2)/(BW s)$ konulduğunda 4. dereceden bir paydaya sahip olur. Bu dördüncü derece polinom analitik kök bulma yöntemi ile iki adet gerçel katsayılı 2. derece biquad katına ayrıştırılır:</p>
            <div class="math-block">
              $$H_k(s) = \\frac{a_{11} s}{s^2 + b_{11} s + b_{21}} \\cdot \\frac{a_{12} s}{s^2 + b_{12} s + b_{22}}$$
            </div>

            <button type="button" class="btn btn-outline" data-open-transform-modal="lp_to_bp" style="margin-top: 14px; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fafaf9; cursor: pointer;">
              📖 LP to BP Dönüşümünü Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & Katsayılar) →
            </button>
          `
        },
        {
          id: 'ch3-5',
          title: '3.5 Bant Söndüren / Çentik Filtre Dönüşümü (Unnormalized Bandstop - LP to BS)',
          content: `
            <p>Bant söndüren filtre, bant geçiren dönüşümünün cebirsel tersidir. Belirli bir frekans bandını ($[f_{\\text{s1}}, f_{\\text{s2}}]$) ve merkez çentik frekansını ($f_0$) maksimum zayıflamayla söndürür:</p>
            <div class="math-block">
              $$S = \\frac{BW \\cdot s}{s^2 + \\omega_0^2}$$
              $$\\omega_0 = 2\\pi \\sqrt{f_{\\text{s1}} \\cdot f_{\\text{s2}}}, \\quad BW = 2\\pi (f_{\\text{p2}} - f_{\\text{p1}})$$
            </div>

            <p><strong>3.5.1 Sanal Eksen Çentik Sıfırları (Transmission Zeros):</strong></p>
            <p>Dönüşüm paydada $s^2 + \\omega_0^2$ terimi oluşturduğu için, ters çevrildiğinde payda $s^2 + \\omega_0^2$ yer alır. $s = \\pm j\\omega_0$ konulduğunda:</p>
            <div class="math-block">
              $$s^2 + \\omega_0^2 = (j\\omega_0)^2 + \\omega_0^2 = -\\omega_0^2 + \\omega_0^2 = 0$$
            </div>
            <p>Bu sayede $f_0$ rezonans frekansında transfer fonksiyonu kesinlikle sıfır ($-\\infty\\text{ dB}$) olur. Bu durum 50/60 Hz şebeke gürültülerini (hum) tamamen yok eden aktif çentik filtrelerinin temelidir.</p>

            <p><strong>3.5.2 Biquad Çentik Katları (Denklem 3.42 - 3.52):</strong></p>
            <p>Her bir 2. derece LP faktörü, iki adet çentik biquad katına ayrışır:</p>
            <div class="math-block">
              $$H_k(s) = \\frac{s^2 + \\omega_0^2}{s^2 + b_{11} s + b_{21}} \\cdot \\frac{s^2 + \\omega_0^2}{s^2 + b_{12} s + b_{22}}$$
            </div>

            <button type="button" class="btn btn-outline" data-open-transform-modal="lp_to_bs" style="margin-top: 14px; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fafaf9; cursor: pointer;">
              📖 LP to BS Dönüşümünü Kapsamlı Pop-up'ta İncele (Formüller, Algoritma & Katsayılar) →
            </button>
          `
        },
        {
          id: 'ch3-6',
          title: '3.6 Analog Frekans Yanıtı ve Grup Gecikmesi Analizi (Section 3.5)',
          content: `
            <p>Elde edilen genel normalize olmayan transfer fonksiyonunun her bir $k$. aşamasının frekans yanıtı $s = j\\omega$ konularak hesaplanır:</p>
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
            <p>Eğer grup gecikmesi geçirme bandı boyunca sabit kalırsa (lineer faz), sinyalin darbe şekli bozulmadan iletilir. Butterworth filtreleri geçirme bandında mükemmel düz bir grup gecikmesi sunarken, Chebyshev ve Eliptik filtrelerde bant kenarında belirgin gecikme tepeleri oluşur.</p>

            <p><strong>Biquad Kaskad Sıralaması (Dynamic Range):</strong> Çok katlı aktif filtrelerde op-amp'ların erken doymasını (saturation) ve gürültü birikimini önlemek için düşük $Q$'lu katlar girişe, yüksek $Q$'lu katlar ise çıkışa yerleştirilir.</p>
          `
        },
        {
          id: 'ch3-7',
          title: '3.7 Dört Frekans Dönüşümünün Karşılaştırmalı Özet Tablosu & Seçim Rehberi',
          content: `
            <p>Tüm analog frekans dönüşümlerinin matematiksel operatörleri, derece katsayıları ve kutup-sıfır davranışları aşağıdaki tabloda özetlenmiştir:</p>
            <div class="compare-table-wrap">
              <table class="compare-table">
                <thead>
                  <tr>
                    <th>Dönüşüm Türü</th>
                    <th>Dönüşüm Operatörü $S(s)$</th>
                    <th>Derece Bağıntısı</th>
                    <th>Sıfır Konumları</th>
                    <th>Karakteristik Özellik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Alçak Geçiren (LP to LP)</strong></td>
                    <td>$$S = \\frac{s}{\\omega_0}$$</td>
                    <td>$n_{\\text{LP}} = n$ (Aynı)</td>
                    <td>Sonsuzda ($\\infty$)</td>
                    <td>Doğrudan frekans ekseni genişletmesi. DC kazancı $1.0$.</td>
                  </tr>
                  <tr>
                    <td><strong>Yüksek Geçiren (LP to HP)</strong></td>
                    <td>$$S = \\frac{\\omega_0}{s}$$</td>
                    <td>$n_{\\text{HP}} = n$ (Aynı)</td>
                    <td>Orijinde ($s=0$) $n$ adet</td>
                    <td>Frekans ekseni terslenir. DC'yi tamamen bloke eder.</td>
                  </tr>
                  <tr>
                    <td><strong>Bant Geçiren (LP to BP)</strong></td>
                    <td>$$S = \\frac{s^2 + \\omega_0^2}{BW \\cdot s}$$</td>
                    <td>$N_{\\text{BP}} = 2n$ (2 Katı)</td>
                    <td>Orijinde ($s=0$) $n$ adet</td>
                    <td>Her kutup $\\pm j\\omega_0$ civarında 2 rezonans kutbuna çatallanır.</td>
                  </tr>
                  <tr>
                    <td><strong>Bant Söndüren (LP to BS)</strong></td>
                    <td>$$S = \\frac{BW \\cdot s}{s^2 + \\omega_0^2}$$</td>
                    <td>$N_{\\text{BS}} = 2n$ (2 Katı)</td>
                    <td>Sanal eksende $\\pm j\\omega_0$</td>
                    <td>Merkez frekansta sıfır iletim ($-\\infty\\text{ dB}$ tam çentik).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          `
        },
        {
          id: 'ch3-examples',
          title: '3.8 Bölüm 3: Kitaptaki Tüm Örnekler (Örnek 3.1 - 3.9)',
          content: `
            <p>Kitabın 3. bölümünde yer alan tüm normalize olmayan ölçekleme ve frekans dönüşüm örnekleri aşağıda listelenmiştir. Herhangi bir örneğe tıklayarak parametrelerini canlı filtre tasarımcısına aktarabilirsiniz:</p>
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
          title: '4.1 Aktif Filtre Tasarım Prosedürü, Katsayı Eşleme Metodolojisi ve Sallen-Key KCL Türetimi',
          content: `
            <p>Bölüm 4'te analog aktif filtre tasarımında benimsenen temel mühendislik yaklaşımı <strong>Katsayı Eşleme Yöntemi (Coefficient Matching Method)</strong>'dir. Bu yöntem, Bölüm 3'te elde edilen hedef analitik transfer fonksiyonu $H_a(s)$ ile operasyonel yükselteçli (Op-Amp) devrenin Kirchhoff Akım Kanunu (KCL) düğüm denklemlerinden çıkarılan devre transfer fonksiyonu $H_c(s)$'nin terim terim birbirine eşitlenmesine dayanır.</p>

            <div class="tip-box" style="background: rgba(61,90,254,0.06); border-left: 4px solid var(--accent); padding: 14px 16px; border-radius: 6px; margin: 14px 0;">
              <strong style="color: var(--accent); font-size: 14px;">💡 Sınav Püf Noktası: Neden Aktif RC Filtreler ve Kaskad Biquad Mimarisi Kullanılır?</strong>
              <ul style="margin: 8px 0 0 18px; font-size: 13.5px; line-height: 1.6;">
                <li><strong>Bobinsiz (Inductorless) Tasarım:</strong> Pasif RLC filtrelerde kullanılan endüktanslar (bobinler); özellikle ses ve biyomedikal gibi düşük frekanslarda devasa boyut, ağırlık, yüksek iç direnç ve komşu devrelere manyetik parazit (EMI) yayma gibi büyük dezavantajlara sahiptir. Aktif filtrelerde bobin yerine Op-Amp ve kondansatör kullanılır.</li>
                <li><strong>Empedans İzolasyonu:</strong> Op-Amp'ların giriş empedansı son derece yüksek ($R_{\\text{in}} \\to \\infty$), çıkış empedansı ise çok düşüktür ($R_{\\text{out}} \\approx 0$). Bu sayede filtre katları (biquad'lar) art arda bağlandığında birbirlerini elektriksel olarak yüklemezler (No loading effect).</li>
                <li><strong>Kaskad Biquad Kararlılığı:</strong> Yüksek dereceli bir filtreyi ($n=5$ veya $n=6$) tek bir devrede gerçekleştirmeye çalışmak, bileşen toleranslarına karşı aşırı hassasiyet yaratır. Filtreyi 2. derece (ve varsa 1. derece) bağımsız alt bloklara (biquad) ayırmak, her kutup çiftinin bağımsız ayarlanabilmesini ve kararlılığın korunmasını sağlar.</li>
              </ul>
            </div>

            <h4 style="color: var(--text-h); margin-top: 20px; font-size: 16px;">Sallen-Key Alçak Geçiren Devresinin Adım Adım KCL Analizi & İspatı (Klasik Sınav Sorusu)</h4>
            <p>Sallen-Key alçak geçiren katında iki temel iç düğüm tanımlanır: $R_1, R_2$ ve pozitif geribesleme kondansatörü $C_1$ arasındaki düğüm gerilimi $V_A$; op-amp'ın evirmeyen ($+$) giriş düğümü ise $V_B$ olsun.</p>
            
            <div style="background: #fafaf9; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; margin: 16px 0;">
              <h5 style="margin: 0 0 8px; color: var(--accent); font-size: 14.5px;">Adım 1: Düğüm $V_B$ İçin KCL Denklemi</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">İdeal op-amp kabulü gereği evirmeyen girişe hiç akım girmez ($I_+ = 0$). Bu nedenle $R_2$ direnci üzerinden akan akımın tamamı $C_2$ kondansatörü üzerinden toprağa akar:</p>
              <div class="math-block">
                $$\\frac{V_A - V_B}{R_2} = \\frac{V_B}{1/(sC_2)} = s C_2 V_B$$
                $$V_A - V_B = s R_2 C_2 V_B \\implies V_A = V_B (1 + s R_2 C_2)$$
              </div>

              <h5 style="margin: 16px 0 8px; color: var(--accent); font-size: 14.5px;">Adım 2: Op-Amp Kazanç Bağıntısı ($V_{\\text{out}}$ ile $V_B$ İlişkisi)</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">Op-amp evirmeyen yükselteç (non-inverting amplifier) olarak bağlanmıştır. Geri besleme dirençleri $R_A$ ve $R_B$ olduğundan DC gerilim kazancı $K$ şöyledir:</p>
              <div class="math-block">
                $$V_{\\text{out}} = K \\cdot V_B, \\quad K = 1 + \\frac{R_B}{R_A} \\implies V_B = \\frac{V_{\\text{out}}}{K}$$
                $$V_A = \\frac{V_{\\text{out}}}{K} (1 + s R_2 C_2)$$
              </div>

              <h5 style="margin: 16px 0 8px; color: var(--accent); font-size: 14.5px;">Adım 3: Düğüm $V_A$ İçin KCL Denklemi</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">Girişten $R_1$ ile gelen akım, $R_2$ ve geri besleme kondansatörü $C_1$'e ayrılır:</p>
              <div class="math-block">
                $$\\frac{V_{\\text{in}} - V_A}{R_1} = \\frac{V_A - V_B}{R_2} + \\frac{V_A - V_{\\text{out}}}{1/(sC_1)}$$
                $$\\frac{V_{\\text{in}}}{R_1} = V_A \\left( \\frac{1}{R_1} + \\frac{1}{R_2} + sC_1 \\right) - \\frac{V_B}{R_2} - sC_1 V_{\\text{out}}$$
              </div>

              <h5 style="margin: 16px 0 8px; color: var(--accent); font-size: 14.5px;">Adım 4: Değişkenlerin Yerine Konması ve $H_c(s)$'nin Çekilmesi</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">$V_A = \\frac{V_{\\text{out}}}{K}(1 + s R_2 C_2)$ ve $V_B = \\frac{V_{\\text{out}}}{K}$ ifadeleri $V_A$ denklemine yerleştirilip $V_{\\text{out}} / V_{\\text{in}}$ oranı çekildiğinde Sallen-Key genel devre transfer fonksiyonu çıkar:</p>
              <div class="math-block">
                $$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{\\displaystyle \\frac{K}{R_1 R_2 C_1 C_2}}{\\displaystyle s^2 + s\\left[ \\frac{1}{R_1 C_1} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_2 C_2} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$
              </div>
            </div>

            <p style="margin-top: 14px;">Aşağıdaki 4 interaktif kartta Bölüm 4'ün ana devre topolojileri özetlenmiştir. Her kartın KCL türetimini, formüllerini ve kitaptaki adım adım sayısal çözümlerini incelemek için pop-up butonlarına tıklayabilirsiniz:</p>

            <div class="theory-grid-2" style="margin-top: 14px;">
              <!-- 1. Sallen-Key LP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #3d5afe;">Sallen-Key Alçak Geçiren (LP)</h4>
                  <span class="stage-badge" style="background: rgba(61,90,254,0.1); color: #3d5afe;">Equal-Component</span>
                </div>
                <p>Eşit kondansatör ($C_1=C_2=C$) ve eşit direnç ($R_1=R_2=R$) seçimiyle katsayı eşleme yöntemi uygulanır. Tek dereceli filtrelerde 1. derece RC tampon katı ($K=1$) eklenir.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Direnç Bağıntısı:</strong> $R = \\frac{1}{C\\sqrt{b_2}}, \\quad \\text{RC Katı: } R = \\frac{1}{b_2 C}$.</li>
                  <li><strong>Op-Amp Kazancı:</strong> $K = 3 - \\frac{b_1}{\\sqrt{b_2}}, \\quad R_B = (K-1)R_A$.</li>
                  <li><strong>Kazanç Dengeleme:</strong> Çıkış gerilim bölücüsü ($R_x, R_y$) ile $0\\text{ dB}$ DC kazanç.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-circuit-modal="sk_lp" style="width: 100%; margin-top: auto; font-weight: 600; color: #3d5afe; border-color: rgba(61,90,254,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Sallen-Key Alçak Geçiren Devresini İncele →
                </button>
              </div>

              <!-- 2. Sallen-Key HP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #ef4444;">Sallen-Key Yüksek Geçiren (HP)</h4>
                  <span class="stage-badge" style="background: rgba(239,68,68,0.1); color: #ef4444;">DC Bloklama</span>
                </div>
                <p>Alçak geçiren devredeki R ve C elemanlarının topolojik yer değişimi ($R \\leftrightarrow C$) ile elde edilir. Orijindeki çift sıfırlar sayesinde DC ofset voltajlarını bloke eder.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Direnç Bağıntısı:</strong> $R = \\frac{1}{C\\sqrt{b_2}}, \\quad R_B = (K-1)R_A$.</li>
                  <li><strong>Op-Amp Kazancı:</strong> $K = 3 - \\frac{b_1}{\\sqrt{b_2}}$.</li>
                  <li><strong>Giriş Seri Kapasitörleri:</strong> $C_1, C_2$ ile yüksek geçiren kutup sentezi.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-circuit-modal="sk_hp" style="width: 100%; margin-top: auto; font-weight: 600; color: #ef4444; border-color: rgba(239,68,68,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Sallen-Key Yüksek Geçiren Devresini İncele →
                </button>
              </div>

              <!-- 3. Sallen-Key / MFB BP Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #10b981;">Sallen-Key & MFB Bant Geçiren (BP)</h4>
                  <span class="stage-badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Rezonans Biquad</span>
                </div>
                <p>Merkez frekansta ($\\omega_0$) rezonans piki oluşturan ve her biri bağımsız $\\omega_{0,m}$ ve $Q_m$ değerlerine sahip biquad katlarının kaskad bağlanmasıyla $2n$ dereceli bant yanıtı sağlanır.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Biquad Katları:</strong> $H_k(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2}$.</li>
                  <li><strong>Rezonans Parametreleri:</strong> $\\omega_0 = \\sqrt{b_2}, \\quad Q = \\frac{\\sqrt{b_2}}{b_1}, \\quad BW = b_1$.</li>
                  <li><strong>Devre Mimarisi:</strong> Sallen-Key veya Multiple-Feedback (MFB).</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-circuit-modal="sk_bp" style="width: 100%; margin-top: auto; font-weight: 600; color: #10b981; border-color: rgba(16,185,129,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Sallen-Key Bant Geçiren Devresini İncele →
                </button>
              </div>

              <!-- 4. Twin-Tee BS Card -->
              <div class="theory-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h4 style="margin: 0; color: #8b5cf6;">Twin-Tee Çentik Devresi (BS)</h4>
                  <span class="stage-badge" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">-∞ dB Çentik</span>
                </div>
                <p>İki paralel T köprüsünün (R-C-R ve C-R-C) rezonans frekansında $180^\\circ$ faz farkıyla birbirini söndürmesi esasına dayanır. Şebeke parazitlerini yok etmek için idealdir.</p>
                <ul style="font-size: 12.5px; line-height: 1.45; margin-bottom: 12px;">
                  <li><strong>Simetrik Köprü:</strong> $R_1 = R_2 = R, \\quad R_3 = R/2, \\quad C_1 = C_2 = C, \\quad C_3 = 2C$.</li>
                  <li><strong>Çentik Frekansı:</strong> $f_0 = \\frac{1}{2\\pi R C} \\implies R = \\frac{1}{2\\pi f_0 C}$.</li>
                  <li><strong>Aktif Q Ayarı:</strong> Op-amp geri beslemesi $K = 2 - \\frac{1}{2Q}$ ile dar bant çentik.</li>
                </ul>
                <button type="button" class="btn btn-sm btn-outline" data-open-circuit-modal="twin_tee_bs" style="width: 100%; margin-top: auto; font-weight: 600; color: #8b5cf6; border-color: rgba(139,92,246,0.3); background: #fbfbfa; cursor: pointer;">
                  📖 Twin-Tee Çentik Devresini İncele →
                </button>
              </div>
            </div>
          `
        },
        {
          id: 'ch4-2',
          title: '4.2 Sallen-Key Alçak Geçiren Devre Tasarımı: Equal-Component Yöntemi ve Kararlılık Analizi',
          content: `
            <p>Kitapta sunulan ve endüstri standardı olan en popüler yöntem <strong>Eşit Elemanlı Sallen-Key (Equal-Component Sallen-Key)</strong> yaklaşımıdır.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">1. Neden Eşit Elemanlı (Equal-Component) Yöntem Seçilir?</h4>
            <p>Piyasada kondansatörler sınırlı standart serilerde (örneğin 1 nF, 10 nF, 100 nF) ve yüksek toleransla (%10–%20) üretilir. Özel değerli kondansatör üretmek son derece pahalıdır. Dirençler ise %1 hassasiyetle (E96 serisi) istenen her değerde kolayca bulunabilir. Bu nedenle mühendisler devredeki tüm kondansatörleri eşit seçer:</p>
            <div class="math-block">
              $$C_1 = C_2 = C \\quad (\\text{Örn: } 10\\text{ nF} = 10^{-8}\\text{ F veya } 100\\text{ nF})$$
              $$R_1 = R_2 = R$$
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">2. Eşit Eleman Kabulleriyle Devre Transfer Fonksiyonu</h4>
            <p>$C_1 = C_2 = C$ ve $R_1 = R_2 = R$ eşitlikleri genel Sallen-Key denklemine uygulandığında:</p>
            <div class="math-block">
              $$H_c(s) = \\frac{\\displaystyle \\frac{K}{R^2 C^2}}{\\displaystyle s^2 + s\\left[ \\frac{1}{RC} + \\frac{1}{RC} + \\frac{1-K}{RC} \\right] + \\frac{1}{R^2 C^2}} = \\frac{\\displaystyle \\frac{K}{R^2 C^2}}{\\displaystyle s^2 + s\\left[ \\frac{3 - K}{RC} \\right] + \\frac{1}{R^2 C^2}}$$
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">3. Katsayı Eşleme ile Tasarım Formüllerinin Çıkarılışı</h4>
            <p>Hedef kuadratik faktörümüz $H_a(s) = \\frac{b_2}{s^2 + b_1 s + b_2}$ olduğuna göre, paydadaki katsayılar birebir eşleştirilir:</p>
            <div class="math-block">
              $$\\text{Sabit Terim Eşlemesi: } \\frac{1}{R^2 C^2} = b_2 \\implies R^2 = \\frac{1}{b_2 C^2} \\implies R = \\frac{1}{C \\sqrt{b_2}}$$
              $$\\text{s Katsayısı Eşlemesi: } \\frac{3 - K}{RC} = b_1 \\implies 3 - K = b_1 (RC) = \\frac{b_1}{\\sqrt{b_2}} \\implies K = 3 - \\frac{b_1}{\\sqrt{b_2}}$$
            </div>

            <div class="note-box" style="background: rgba(239,68,68,0.06); border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin: 16px 0;">
              <strong style="color: #ef4444; font-size: 14px;">⚠️ Sınavlarda En Çok Sorulan Kritik Konu: Kalite Faktörü $Q$ ve Kararlılık Sınırı ($K < 3$)</strong>
              <p style="font-size: 13.5px; margin: 6px 0 0; line-height: 1.55;">
                Kuadratik bir biquad için kalite faktörü $Q = \\frac{\\omega_0}{BW} = \\frac{\\sqrt{b_2}}{b_1}$ olarak tanımlanır. Bu ifadeyi $K$ formülünde yerine koyarsak:
                $$K = 3 - \\frac{1}{Q}$$
                <strong>Fiziksel ve Matematiksel Sonuçlar:</strong>
                <br>• Eğer katın $Q$ faktörü yükselirse ($Q \\to \\infty$), Op-Amp kazancı $K \\to 3$ değerine yaklaşır.
                <br>• Eğer $K \\ge 3$ olursa, paydadaki $s$ katsayısı $\\frac{3-K}{RC} \\le 0$ haline gelir! Bu durumda kutuplar sağ yarı karmaşık düzleme ($s$-plane right-half) geçer ve devre bir filtre olmaktan çıkıp <strong>kontrolsüz bir osilatöre</strong> dönüşür.
                <br>• <strong>Kural:</strong> Equal-Component Sallen-Key devresi $Q < 10$ için mükemmeldir. Çok yüksek $Q$ gerektiren dar bant filtrelerde op-amp kazancı $K$ kritik sınıra dayanacağından MFB veya State-Variable mimarisi tercih edilir.
              </p>
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">4. Op-Amp Geri Besleme Dirençlerinin Hesabı ($R_A, R_B$)</h4>
            <p>Op-amp evirmeyen yükselteç kazanç formülü $K = 1 + \\frac{R_B}{R_A}$'dır. Pratikte $R_A = 10\\text{ k}\\Omega$ referans seçilir ve $R_B$ hesaplanır:</p>
            <div class="math-block">
              $$R_B = (K - 1) R_A \\quad (R_A = 10\\text{ k}\\Omega)$$
            </div>
            <p>Örneğin $K = 2.482$ ise $R_B = (2.482 - 1) \\times 10\\text{ k}\\Omega = 14.82\\text{ k}\\Omega$ bulunur.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">5. Birinci Derece Alçak Geçiren Katı (Tek Dereceli Filtreler İçin $N = 1, 3, 5\\dots$)</h4>
            <p>Filtre derecesi tek sayı olduğunda ($N=1, 3, 5, 7$), kutuplardan biri reel eksendedir ve transfer fonksiyonunda tekil bir $(s + b_2)$ çarpanı bulunur. Bu kat pasif bir seri $R$, toprağa paralel $C$ ve ardından <strong>kazancı 1 olan gerilim izleyici tampon (voltage follower) op-amp</strong> ile gerçekleştirilir:</p>
            <div class="math-block">
              $$H_1(s) = \\frac{b_2}{s + b_2} = \\frac{\\displaystyle \\frac{1}{RC}}{s + \\displaystyle \\frac{1}{RC}} \\implies R = \\frac{1}{b_2 C}$$
              $$\\text{Op-Amp Kazancı: } K = 1.0 \\implies R_B = 0\\ \\Omega \\text{ (kısa devre köprü teli)}, \\quad R_A = \\infty \\text{ (takılmaz)}$$
            </div>
            <p><strong>Neden Tampon Op-Amp Şarttır?</strong> Pasif RC devresinin arkasına tampon konmazsa, sonraki Sallen-Key katının giriş empedansı bu RC filtresini yükler (loading effect) ve kesim frekansını tamamen kaydırır. Tampon op-amp giriş empedansını sonsuza, çıkış empedansını sıfıra çekerek mükemmel kaskad izolasyonu sağlar.</p>
          `
        },
        {
          id: 'ch4-3',
          title: '4.3 Sallen-Key Yüksek Geçiren Devre Tasarımı ve DC Bloklama',
          content: `
            <p>Sallen-Key yüksek geçiren (Highpass) biquad devresi, alçak geçiren devredeki direnç ve kondansatörlerin topolojik olarak yer değiştirmesi ($R \\leftrightarrow C$) ile elde edilir. Op-amp evirmeyen kazanç ağı ($R_A, R_B$) aynı kalır.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">1. Devre Transfer Fonksiyonunun Çıkarılışı</h4>
            <p>Girişte iki seri kondansatör ($C_1, C_2$) ve pozitif geri besleme direnci $R_1$ bulunur. Düğüm denklemleri çözüldüğünde:</p>
            <div class="math-block">
              $$H_c(s) = \\frac{V_{\\text{out}}(s)}{V_{\\text{in}}(s)} = \\frac{\\displaystyle K s^2}{\\displaystyle s^2 + s\\left[ \\frac{1}{R_2 C_2} + \\frac{1}{R_2 C_1} + \\frac{1-K}{R_1 C_1} \\right] + \\frac{1}{R_1 R_2 C_1 C_2}}$$
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">2. Eşit Elemanlı (Equal-Component) Sallen-Key HP Formülleri</h4>
            <p>$C_1 = C_2 = C$ ve $R_1 = R_2 = R$ kabulleri yapıldığında payda denklemi alçak geçiren ile tamamen aynı simetrik forma girer:</p>
            <div class="math-block">
              $$H_c(s) = \\frac{\\displaystyle K s^2}{\\displaystyle s^2 + s\\left[ \\frac{3 - K}{RC} \\right] + \\frac{1}{R^2 C^2}}$$
            </div>
            <p>Bölüm 3'teki yüksek geçiren hedef transfer fonksiyonu $H_a(s) = \\frac{K s^2}{s^2 + b_1 s + b_2}$ ile eşleştirildiğinde:</p>
            <div class="math-block">
              $$R_1 = R_2 = R = \\frac{1}{C \\sqrt{b_2}}$$
              $$K = 3 - \\frac{b_1}{\\sqrt{b_2}} = 3 - \\frac{1}{Q}, \\quad R_B = (K - 1) R_A \\quad (R_A = 10\\text{ k}\\Omega)$$
            </div>

            <div class="tip-box" style="background: rgba(16,185,129,0.06); border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 6px; margin: 16px 0;">
              <strong style="color: #10b981; font-size: 14px;">💡 Sınav Notu: Paydaki $s^2$ Teriminin Fiziksel Anlamı</strong>
              <p style="font-size: 13.5px; margin: 6px 0 0; line-height: 1.55;">
                • $s = 0$ (DC frekansta) $|H(0)| = 0$'dır. Devre girişindeki seri kondansatörler DC akımı tamamen bloke eder. Sensör ve ses devrelerinde oluşabilecek DC ofset voltajları böylece sıfırlanır.
                <br>• $s \\to \\infty$ (Çok yüksek frekanslarda) kondansatörler kısa devre gibi davranır; $s^2 / s^2 \\to 1$ olur ve transfer fonksiyonu doğrudan op-amp'ın evirmeyen kazancı olan $K$'ya eşitlenir ($H(\\infty) = K$).
              </p>
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">3. Birinci Derece Yüksek Geçiren Katı ($N$ Tek Sayı İken)</h4>
            <p>Filtre derecesi tek sayı olduğunda ($N=1, 3, 5$), birinci derece yüksek geçiren katı seri bir $C$ kondansatörü, toprağa bağlı $R$ direnci ve kazancı 1 olan gerilim izleyici tampon op-amp ile kurulur:</p>
            <div class="math-block">
              $$H_1(s) = \\frac{s}{s + 1/(RC)} = \\frac{s}{s + b_2} \\implies R = \\frac{1}{b_2 C}, \\quad K = 1.0$$
            </div>
          `
        },
        {
          id: 'ch4-4',
          title: '4.4 Sallen-Key ve Çoklu Geribesleme (MFB) Bant Geçiren Devreleri',
          content: `
            <p>Bant geçiren (Bandpass) filtrelerde Bölüm 3'teki frekans dönüşümü derecenin iki katına ($2n$) çıkmasına neden olur. Her bir kuadratik kat bağımsız bir merkez frekansı $\\omega_{0,m}$ ve kalite faktörüne $Q_m$ sahip bir rezonans biquad'ıdır:</p>
            <div class="math-block">
              $$H_k(s) = \\frac{a_1 s}{s^2 + b_1 s + b_2} = \\frac{G_0 \\left(\\frac{\\omega_0}{Q}\\right) s}{s^2 + \\left(\\frac{\\omega_0}{Q}\\right) s + \\omega_0^2}$$
            </div>
            <p>Burada $\\omega_0 = \\sqrt{b_2}$, $BW = b_1$, $Q = \\frac{\\omega_0}{b_1} = \\frac{\\sqrt{b_2}}{b_1}$ ve merkez frekanstaki tepe kazancı $G_0 = \\frac{a_1}{b_1}$'dir.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">Çoklu Geribesleme (Multiple-Feedback - MFB) Bant Geçiren Mimarisi</h4>
            <p>Sallen-Key bant geçiren devresi orta ve yüksek $Q$ değerlerinde aşırı hassas hale gelir. Bu nedenle endüstride ve Les Thede kitabında bant geçiren filtreler için genellikle <strong>Multiple-Feedback (MFB)</strong> topolojisi tercih edilir:</p>
            <ul style="font-size: 13.5px; line-height: 1.6;">
              <li>Op-amp eviren (inverting) modda çalışır. Giriş sinyali doğrudan op-amp'a bağlanmaz, sanal toprak üzerinden geribeslenir.</li>
              <li>İki eşit kondansatör $C_1 = C_2 = C$ seçildiğinde, 3 adet direnç şu bağıntılarla hesaplanır:</li>
            </ul>
            <div class="math-block">
              $$R_1 = \\frac{Q}{G_0 \\cdot \\omega_0 \\cdot C}$$
              $$R_2 = \\frac{Q}{(2 Q^2 - G_0) \\cdot \\omega_0 \\cdot C}$$
              $$R_3 = \\frac{2 Q}{\\omega_0 \\cdot C}$$
            </div>
            <div class="warning-box" style="background: rgba(245,158,11,0.06); border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; margin: 14px 0;">
              <strong style="color: #b45309; font-size: 14px;">⚠️ Tasarım Kısıtı: $R_2$ Direncinin Pozitif Olma Şartı</strong>
              <p style="font-size: 13.5px; margin: 6px 0 0; line-height: 1.55;">
                $R_2$ formülünün paydasındaki $(2Q^2 - G_0)$ teriminin pozitif kalması zorunludur:
                $$2 Q^2 > G_0 \\implies G_0 < 2 Q^2$$
                Eğer hedeflenen kat kazancı $G_0$ çok yüksek seçilirse $R_2$ negatif çıkar (fiziksel olarak üretilemez). Bu nedenle kat başına makul bir kazanç ($G_0 = 1 \\dots 2$) seçilir ve kalan kazanç çıkışta ayarlanır.
              </p>
            </div>
          `
        },
        {
          id: 'ch4-5',
          title: '4.5 Twin-Tee Çentik Devresi (Bandstop) ve Sonlu Sıfırların Gerçekleştirilmesi',
          content: `
            <p>Ters Chebyshev ve Eliptik filtrelerin transfer fonksiyonlarının payında $(s^2 + \\omega_z^2)$ şeklinde <strong>sonlu karmaşık iletim sıfırları (finite transmission zeros)</strong> yer alır. Standart tüm-kutuplu Sallen-Key devresi payında $s^2 + \\omega_z^2$ üretemez. Bu sıfırları gerçekleştirmek ve durdurma bandında derin çentikler oluşturmak için <strong>Twin-Tee (İkiz-T) Aktif Çentik Devresi</strong> kullanılır.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">1. Simetrik Twin-Tee Köprüsünün Çalışma İlkesi</h4>
            <p>Devre birbirine paralel bağlanmış iki ayrı T ağından oluşur:</p>
            <ul style="font-size: 13.5px; line-height: 1.6;">
              <li><strong>R-C-R Ağı (Alçak Geçiren Yol):</strong> Seri iki adet $R$ direnci ve orta noktadan toprağa/geribeslemeye bağlı $2C$ kondansatörü. Alçak frekansları geçirir, yüksek frekansta $-90^\\circ$ faz gecikmesi üretir.</li>
              <li><strong>C-R-C Ağı (Yüksek Geçiren Yol):</strong> Seri iki adet $C$ kondansatörü ve orta noktadan toprağa/geribeslemeye bağlı $R/2$ direnci. Yüksek frekansları geçirir, alçak frekansta $+90^\\circ$ faz ilerlemesi üretir.</li>
            </ul>
            <p>Merkez rezonans frekansı $\\omega_0 = 1/(RC)$'de bu iki yol arasındaki faz farkı tam $180^\\circ$ olur ve iki sinyal birbirini kusursuz şekilde yok ederek teorik olarak $-\\infty\\text{ dB}$ derinliğinde bir çentik oluşturur:</p>
            <div class="math-block">
              $$f_0 = \\frac{1}{2\\pi R C} \\implies R = \\frac{1}{2\\pi f_0 C}, \\quad R_3 = \\frac{R}{2}, \\quad C_3 = 2 C$$
            </div>

            <h4 style="color: var(--text-h); font-size: 15px;">2. Aktif Geribesleme (Bootstrapping) ile Seçicilik ($Q$) Ayarı</h4>
            <p>Eğer Twin-Tee köprüsünün orta bacakları doğrudan toprağa bağlanırsa (pasif Twin-Tee), filtrenin seçiciliği $Q = 0.25$ gibi çok düşüktür; çentik çok geniş olur ve etraftaki faydalı sinyalleri de zayıflatır. Op-Amp çıkışından köprünün orta bacaklarına bir geribesleme voltajı uygulandığında (bootstrapping):</p>
            <div class="math-block">
              $$Q = \\frac{1}{4(1 - K)} \\implies K = 1 - \\frac{1}{4 Q}$$
            </div>
            <p>Burada $K < 1$ olduğundan op-amp çıkışına basit bir direnç bölücü bağlanarak orta bacak gerilimi sürülür. Böylece $Q$ değeri $5 \\dots 50$ seviyesine çıkarılır; yalnızca hedeflenen parazit (örneğin 50 Hz şebeke vızıltısı) yok edilir.</p>
          `
        },
        {
          id: 'ch4-6',
          title: '4.6 Kazanç Dengeleme Gerilim Bölücüsü (Gain Adjustment Divider)',
          content: `
            <p>Sallen-Key ve diğer aktif katların stabilite ve $Q$ parametreleri gereği op-amp kazançları $K_m > 1$ olmak zorundadır. Bu katlar art arda kaskad bağlandığında toplam kazanç katlanarak artar:</p>
            <div class="math-block">
              $$K_{\\text{tot}} = \\prod_{m=1}^{M} K_m = K_1 \\cdot K_2 \\cdot \\dots \\cdot K_M$$
            </div>
            <p>Örneğin 5. derece bir Butterworth filtrede $K_1 = 1.0$ (tampon), $K_2 = 2.382$ ve $K_3 = 1.382$ olduğunda toplam devre kazancı $K_{\\text{tot}} = 3.292$ (yaklaşık $10.35\\text{ dB}$) olur. Ancak tasarım spesifikasyonlarında filtrenin DC veya geçirme bandı tepe kazancının $0\\text{ dB}$ ($G_{\\text{hedef}} = 1.0$) olması istenir.</p>

            <h4 style="color: var(--text-h); font-size: 15px;">Pasif Gerilim Bölücüsü ($R_x, R_y$) Formüllerinin Adım Adım İspatı</h4>
            <p>Son katın çıkışına bağlanan gerilim bölücüsünün aynı anda iki hayati mühendislik şartını sağlaması gerekir:</p>
            
            <div style="background: #fafaf9; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px 20px; margin: 14px 0;">
              <h5 style="margin: 0 0 6px; color: var(--accent); font-size: 14px;">Şart 1: Kazancı Hedef Seviyeye Zayıflatma Oranı</h5>
              <div class="math-block">
                $$\\text{Zayıflatma Oranı: } G_A = \\frac{K_{\\text{tot}}}{G_{\\text{hedef}}}$$
                $$\\frac{V_{\\text{final}}}{V_{\\text{out}}} = \\frac{R_y}{R_x + R_y} = \\frac{1}{G_A} \\implies R_x + R_y = G_A \\cdot R_y \\implies R_x = (G_A - 1) R_y$$
              </div>

              <h5 style="margin: 14px 0 6px; color: var(--accent); font-size: 14px;">Şart 2: Standart Çıkış Empedansı ($R_{\\text{out}} = 10\\text{ k}\\Omega$)</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">Filtrenin çıkış empedansı Thevenin eşdeğeri olarak $R_x \\parallel R_y$ paralel eşdeğerine eşittir:</p>
              <div class="math-block">
                $$R_{\\text{out}} = R_x \\parallel R_y = \\frac{R_x \\cdot R_y}{R_x + R_y}$$
              </div>

              <h5 style="margin: 14px 0 6px; color: var(--accent); font-size: 14px;">Şart 1 ve Şart 2'nin Birleştirilmesi:</h5>
              <p style="font-size: 13.5px; margin-bottom: 6px;">$R_x = (G_A - 1) R_y$ ifadesini paralel eşdeğerde yerine koyalım:</p>
              <div class="math-block">
                $$R_{\\text{out}} = \\frac{(G_A - 1) R_y \\cdot R_y}{G_A \\cdot R_y} = \\frac{G_A - 1}{G_A} \\cdot R_y \\implies R_y = \\frac{G_A}{G_A - 1} \\cdot R_{\\text{out}}$$
                $$R_x = (G_A - 1) R_y = (G_A - 1) \\left( \\frac{G_A}{G_A - 1} R_{\\text{out}} \\right) \\implies R_x = G_A \\cdot R_{\\text{out}}$$
              </div>
            </div>

            <p style="font-size: 13.5px;">Bu iki zarif formül sayesinde hem filtrenin kazancı tam $1.0$'a (0 dB) kalibre edilir hem de filtrenin Thevenin çıkış empedansı $10\\text{ k}\\Omega$ sabitine oturtulur.</p>
          `
        },
        {
          id: 'ch4-7',
          title: '4.7 Sınav İpuçları, Sık Yapılan Hatalar ve Standart E-Serisi Seçimi',
          content: `
            <div class="tip-box" style="background: rgba(61,90,254,0.06); border-left: 4px solid var(--accent); padding: 16px 18px; border-radius: 6px; margin: 16px 0;">
              <h4 style="color: var(--accent); margin: 0 0 10px; font-size: 15.5px;">🎓 Analog Filtre Tasarımı Sınavında En Sık Yapılan 6 Hata ve Çözüm Taktikleri</h4>
              <ol style="margin: 0 0 0 18px; font-size: 13.5px; line-height: 1.7;">
                <li><strong>1. Hata (Tampon Katına Kazanç Eklemek):</strong> Filtre derecesi $N$ tek olduğunda kullanılan 1. derece RC katında op-amp yalnızca gerilim izleyicidir ($K = 1.0$). Öğrenciler sıklıkla bu kata da $K$ kazancı hesaplamaya çalışır. Unutmayın: 1. derece tamponda $R_B = 0$ (kısa devre tel), $R_A$ ise takılmaz!</li>
                <li><strong>2. Hata ($R_B$ Formülünde Yanlışlık):</strong> Evirmeyen op-amp kazancı $K = 1 + R_B / R_A$ olduğundan $R_B = (K - 1) R_A$'dır. Sınav heyecanıyla $R_B = K \\cdot R_A$ yazmak en yaygın hatadır.</li>
                <li><strong>3. Hata (Açısal Frekans $\\omega$ ile Frekans $f$ Karışıklığı):</strong> Bölüm 4 formüllerindeki $b_1$ ve $b_2$ değerleri $\\text{rad/s}$ cinsindendir. Formüle girmeden önce mutlaka $\\omega_0 = 2\\pi f_0$ dönüşümünü yapın!</li>
                <li><strong>4. Hata (Gerilim Bölücüsünde $R_x$ ve $R_y$'yi Ters Bağlamak):</strong> $R_x$ son kat op-amp çıkışından seri olarak filtre çıkışına gider. $R_y$ ise filtre çıkışından toprağa paralel bağlanır. Ters bağlanırsa çıkış empedansı ve kazanç tamamen bozulur.</li>
                <li><strong>5. Hata (Bileşen Seçim Sırası):</strong> Tasarıma daima standart bir kondansatör ($C$) seçerek başlanır (örn: 10 nF). Dirençler $C$'ye göre hesaplanır. Çünkü piyasada dirençlerin nominal basamak sayısı (E24/E96) kondansatörlerden (E12) kat kat fazladır.</li>
                <li><strong>6. Hata (Kararlılık Sınırı):</strong> Equal-component Sallen-Key devresinde $K = 3 - b_1/\\sqrt{b_2} = 3 - 1/Q$ formülünde $K < 3$ olmak zorundadır. Eğer hesapladığınız $K \\ge 3$ çıkıyorsa katsayılarınızda veya işaretlerinizde mutlaka bir hata vardır.</li>
              </ol>
            </div>

            <h4 style="color: var(--text-h); font-size: 15px; margin-top: 20px;">Standart E-Serisi Tolerans Serileri (E12 & E24)</h4>
            <p>Laboratuvar ve endüstriyel üretimde hesaplanan teorik değerlere en yakın standart ticari bileşenler seçilir:</p>
            <table class="table" style="width: 100%; font-size: 13px; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background: #fafaf9; text-align: left;">
                  <th style="padding: 8px 12px; border: 1px solid var(--border);">Seri</th>
                  <th style="padding: 8px 12px; border: 1px solid var(--border);">Tolerans</th>
                  <th style="padding: 8px 12px; border: 1px solid var(--border);">Standart Nominal Çarpanlar (1–10 arası)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid var(--border); font-weight: 700; color: #3d5afe;">E12</td>
                  <td style="padding: 8px 12px; border: 1px solid var(--border);">%10</td>
                  <td style="padding: 8px 12px; border: 1px solid var(--border); font-family: var(--font-mono);">1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; border: 1px solid var(--border); font-weight: 700; color: #10b981;">E24</td>
                  <td style="padding: 8px 12px; border: 1px solid var(--border);">%5</td>
                  <td style="padding: 8px 12px; border: 1px solid var(--border); font-family: var(--font-mono);">1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1</td>
                </tr>
              </tbody>
            </table>
          `
        },
        {
          id: 'ch4-examples',
          title: '4.8 Kitaptaki Tüm Aktif Devre Tasarımı Örnekleri (Örnek 4.1 - 4.6) - Adım Adım Sınav Çözümleri',
          content: `
            <p>Aşağıda Les Thede kitabındaki 6 aktif devre tasarım probleminin her birinin adım adım, gerekçeleriyle ve tam sayısal ikameleriyle hazırlanmış sınav tipi çözümleri yer almaktadır:</p>
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
