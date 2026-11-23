/**
 * FilterDesign Studio - Switched-Capacitor (SC) Filter & Equivalent Resistance Calculator
 * Demonstrates IC CMOS integration, Req = 1 / (f_clk * C), clock non-overlapping timing, silicon area comparison
 */

const ScModal = (() => {
  let overlay = null;

  function init() {
    if (document.getElementById('scModalOverlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'scModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 900px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border); padding: 14px 22px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">⚡</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; color: var(--text-h);">Switched-Capacitor (Anahtarlamalı Kapasite) Hesaplayıcısı</h3>
              <p style="margin: 2px 0 0; font-size: 12px; color: var(--muted);">Entegre Devre (CMOS) Filtrelerinde Dirençsizleştirme ve Saat Frekansı Ayarı</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="closeScModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--muted);">&times;</button>
        </div>

        <div class="modal-body" style="padding: 22px; overflow-y: auto;">
          <!-- Theory Summary Box -->
          <div style="background: rgba(61,90,254,0.05); border-left: 4px solid var(--accent); padding: 12px 16px; border-radius: 6px; margin-bottom: 18px; font-size: 13px; line-height: 1.6;">
            <strong style="color: var(--accent);">💡 Neden Switched-Capacitor (SC) Filtreler Kullanılır?</strong>
            <p style="margin: 4px 0 0;">
              Entegre devrelerde (CMOS IC) büyük değerli analog dirençler ($100\\text{ k}\\Omega - 1\\text{ M}\\Omega$) devasa silikon alanı kaplar ve üretim toleransları $\\pm\\%20$ gibi çok kötüdür. 
              SC devrelerinde bir kondansatör ($C$), iki fazlı bir saat frekansı ($f_{\\text{clk}}$) ile anahtarlanarak bir direnç gibi davranır: 
              $$R_{\\text{eq}} = \\frac{1}{f_{\\text{clk}} \\cdot C}$$
              Filtrenin kesim frekansı direnç değerine değil, <strong>saat frekansı ($f_{\\text{clk}}$)</strong> ve <strong>kondansatör oranına ($C_1/C_2$)</strong> bağlıdır. IC üretiminde kapasite oranları $\\pm\\%0.1$ hassasiyetle eşleşir!
            </p>
          </div>

          <!-- Interactive Calculator -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #fafaf9; border: 1px solid var(--border); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-h); margin-bottom: 4px;">SAAT FREKANSI (f_clk):</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="scFclkInput" class="form-control" value="100" min="1" max="100000" style="flex: 1;" />
                <select id="scFclkUnit" class="form-control" style="width: 80px;">
                  <option value="1e3">kHz</option>
                  <option value="1e6" selected>MHz</option>
                </select>
              </div>
              <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">Örnekleme Saati Frekansı (Non-overlapping Φ₁, Φ₂)</div>
            </div>

            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--text-h); margin-bottom: 4px;">ENTEGRE KAPASİTE DEĞERİ (C):</label>
              <div style="display: flex; gap: 8px;">
                <input type="number" id="scCapInput" class="form-control" value="1.0" min="0.01" step="0.1" style="flex: 1;" />
                <select id="scCapUnit" class="form-control" style="width: 80px;">
                  <option value="1e-12" selected>pF</option>
                  <option value="1e-15">fF</option>
                </select>
              </div>
              <div style="font-size: 11px; color: var(--muted); margin-top: 4px;">Çip Üstü (MIM/PIP) Kondansatör Değeri</div>
            </div>
          </div>

          <!-- Results Grid -->
          <div id="scResultsGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px;"></div>

          <!-- Non-overlapping Clock Diagram SVG -->
          <div style="background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 16px;">
            <div style="font-size: 13.5px; font-weight: 700; color: var(--text-h); margin-bottom: 6px;">
              ⏱️ İki Fazlı Örtüşmeyen Saat Sinyalleri (Two-Phase Non-Overlapping Clocks - Φ₁ & Φ₂)
            </div>
            <p style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">
              Kısa devre akımını (shoot-through) önlemek için $\\Phi_1$ ve $\\Phi_2$ anahtarları asla aynı anda iletimde (HIGH) olamaz.
            </p>
            <div style="background: #fafaf9; border: 1px solid var(--border); border-radius: 6px; padding: 10px;">
              <svg viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; display: block;">
                <!-- Phase 1 -->
                <text x="20" y="32" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#2563eb">Saat Φ₁</text>
                <path d="M 80,40 L 130,40 L 130,15 L 200,15 L 200,40 L 330,40 L 330,15 L 400,15 L 400,40 L 550,40" fill="none" stroke="#2563eb" stroke-width="2.2" />

                <!-- Dead-time non-overlap zone -->
                <rect x="200" y="10" width="30" height="95" fill="rgba(239, 68, 68, 0.08)" />
                <rect x="400" y="10" width="30" height="95" fill="rgba(239, 68, 68, 0.08)" />
                <text x="215" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#dc2626">Ölü Zaman</text>
                <text x="415" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#dc2626">Ölü Zaman</text>

                <!-- Phase 2 -->
                <text x="20" y="85" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#16a34a">Saat Φ₂</text>
                <path d="M 80,95 L 230,95 L 230,70 L 300,70 L 300,95 L 430,95 L 430,70 L 500,70 L 500,95 L 550,95" fill="none" stroke="#16a34a" stroke-width="2.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeScModalBtn').addEventListener('click', close);
    overlay.querySelector('#scFclkInput').addEventListener('input', calculate);
    overlay.querySelector('#scFclkUnit').addEventListener('change', calculate);
    overlay.querySelector('#scCapInput').addEventListener('input', calculate);
    overlay.querySelector('#scCapUnit').addEventListener('change', calculate);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  function open() {
    init();
    calculate();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.renderMathInElement) {
      window.renderMathInElement(overlay, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function close() {
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  function calculate() {
    const fclkVal = parseFloat(document.getElementById('scFclkInput').value) || 100;
    const fclkMult = parseFloat(document.getElementById('scFclkUnit').value) || 1e6;
    const fclk = fclkVal * fclkMult;

    const cVal = parseFloat(document.getElementById('scCapInput').value) || 1.0;
    const cMult = parseFloat(document.getElementById('scCapUnit').value) || 1e-12;
    const cap = cVal * cMult;

    // Req = 1 / (fclk * C)
    const Req = 1 / (fclk * cap);

    // Format Req
    let reqStr = '';
    if (Req >= 1e6) reqStr = (Req / 1e6).toFixed(2) + ' MΩ';
    else if (Req >= 1e3) reqStr = (Req / 1e3).toFixed(2) + ' kΩ';
    else reqStr = Req.toFixed(1) + ' Ω';

    // Nyquist safe analog signal cutoff limit (approx fclk / 20)
    const fSigMax = fclk / 20;
    let fSigStr = fSigMax >= 1e6 ? (fSigMax / 1e6).toFixed(1) + ' MHz' : (fSigMax / 1e3).toFixed(1) + ' kHz';

    // Silicon Area comparison
    // Standard poly resistor: 100 kOhm ~= 2000 um^2. SC Cap (1pF) + MOS switches ~= 120 um^2.
    const areaResistor = (Req / 1e3) * 20; // roughly ~20 um^2 per kOhm
    const areaSC = 120; // um^2 for 1pF MIM + 2 CMOS switches
    const areaSavingsRatio = Math.max(1, Math.round(areaResistor / areaSC));

    const container = document.getElementById('scResultsGrid');
    if (!container) return;

    container.innerHTML = `
      <div style="background: #fafaf9; border: 1.5px solid var(--accent); padding: 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase;">Eşdeğer Direnç (R_eq)</div>
        <div style="font-size: 20px; font-weight: 800; color: #1e3a8a; margin-top: 4px;">${reqStr}</div>
        <div style="font-size: 11.5px; color: var(--muted); margin-top: 4px;">R_eq = 1 / (f_clk · C)</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase;">Güvenli Sinyal Bandı</div>
        <div style="font-size: 18px; font-weight: 700; color: #16a34a; margin-top: 4px;">≤ ${fSigStr}</div>
        <div style="font-size: 11.5px; color: var(--muted); margin-top: 4px;">Örnekleme sınırı: f_clk ≥ 20 · f_signal</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase;">Çip Alan Tasarrufu (CMOS)</div>
        <div style="font-size: 18px; font-weight: 700; color: #b45309; margin-top: 4px;">~${areaSavingsRatio}x Daha Küçük</div>
        <div style="font-size: 11.5px; color: var(--muted); margin-top: 4px;">Direnç yerine SC kapasite kullanarak</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase;">Tolerans Eşleşmesi</div>
        <div style="font-size: 18px; font-weight: 700; color: #2563eb; margin-top: 4px;">±%0.1 (Mükemmel)</div>
        <div style="font-size: 11.5px; color: var(--muted); margin-top: 4px;">Kapasite oranı C₁/C₂ eşleşmesi</div>
      </div>
    `;
  }

  return {
    open,
    close
  };
})();

if (typeof window !== 'undefined') {
  window.ScModal = ScModal;
}

if (typeof module !== 'undefined') module.exports = ScModal;
