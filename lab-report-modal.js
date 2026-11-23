/**
 * FilterDesign Studio - Laboratory Design Report Generator (Printable / PDF)
 * Creates professional engineering lab report with specs, TF, BOM, schematics
 */

const LabReportModal = (() => {
  let overlay = null;

  function init() {
    if (document.getElementById('labReportModalOverlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'labReportModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 900px; max-height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">📄</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; color: var(--text-h);">Analog Filtre Laboratuvar Tasarım Raporu</h3>
              <p style="margin: 2px 0 0; font-size: 12px; color: var(--muted);">Yazdırılabilir / PDF Olarak Kaydedilebilir Tasarım & BOM Çıktısı</p>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button type="button" class="btn btn-sm btn-primary" id="btnPrintReportBtn" style="padding: 6px 14px; font-weight: 600;">🖨️ Yazdır / PDF Kaydet</button>
            <button type="button" class="modal-close-btn" id="closeLabReportModalBtn" style="background: none; border: none; font-size: 22px; cursor: pointer; color: var(--muted);">&times;</button>
          </div>
        </div>
        <div class="modal-body" id="labReportContent" style="padding: 24px; overflow-y: auto; font-family: 'Inter', -apple-system, sans-serif; color: #1f2937; line-height: 1.5; background: #fff;">
          <!-- Content dynamically rendered -->
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeLabReportModalBtn').addEventListener('click', close);
    overlay.querySelector('#btnPrintReportBtn').addEventListener('click', () => {
      window.print();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  function open(filterConfig, filterModel, circuitModel) {
    init();
    renderReport(filterConfig, filterModel, circuitModel);
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('labReportContent'), {
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

  function renderReport(config, filterModel, circuitModel) {
    const container = document.getElementById('labReportContent');
    const dateStr = new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });

    let approxName = {
      butterworth: 'Butterworth (Maksimum Düz)',
      chebyshev: 'Chebyshev Tip I (Eşit Dalgalı)',
      inv_chebyshev: 'Ters Chebyshev (Tip II)',
      elliptic: 'Eliptik (Cauer)'
    }[config.approx] || config.approx;

    let typeName = {
      lowpass: 'Alçak Geçiren (Lowpass)',
      highpass: 'Yüksek Geçiren (Highpass)',
      bandpass: 'Bant Geçiren (Bandpass)',
      bandstop: 'Bant Söndüren (Bandstop / Notch)'
    }[config.type] || config.type;

    let fpStr = Array.isArray(config.fpass) ? config.fpass.join(' - ') : config.fpass;
    let fsStr = Array.isArray(config.fstop) ? config.fstop.join(' - ') : config.fstop;

    let html = `
      <div class="print-report" style="max-width: 800px; margin: 0 auto; color: #111827;">
        <!-- Report Header -->
        <div style="border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h1 style="font-size: 20px; font-weight: 800; margin: 0; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">Elektrik-Elektronik Mühendisliği</h1>
            <h2 style="font-size: 15px; font-weight: 600; margin: 4px 0 0; color: #4b5563;">Analog Filtre Tasarımı & Donanım Gerçekleme Raporu</h2>
          </div>
          <div style="text-align: right; font-size: 12px; color: #6b7280;">
            <div><strong>Tarih:</strong> ${dateStr}</div>
            <div><strong>Araç:</strong> FilterDesign Studio (Les Thede)</div>
          </div>
        </div>

        <!-- Section 1: Specifications -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">
            1. TASARIM HEDEFLERİ VE SPESİFİKASYONLAR
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12.5px;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 6px; font-weight: 600; width: 35%;">Filtre Tipi:</td>
              <td style="padding: 6px;">${typeName}</td>
              <td style="padding: 6px; font-weight: 600; width: 25%;">Yaklaşım Modeli:</td>
              <td style="padding: 6px;">${approxName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 6px; font-weight: 600;">Geçirme Sınırı (f_pass):</td>
              <td style="padding: 6px;">${fpStr} ${config.unit || 'Hz'}</td>
              <td style="padding: 6px; font-weight: 600;">Durdurma Sınırı (f_stop):</td>
              <td style="padding: 6px;">${fsStr} ${config.unit || 'Hz'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 6px; font-weight: 600;">Maksimum Geçirme Zayıflaması:</td>
              <td style="padding: 6px;">${config.passDb} dB</td>
              <td style="padding: 6px; font-weight: 600;">Minimum Durdurma Zayıflaması:</td>
              <td style="padding: 6px;">${config.stopDb} dB</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: 600;">Hesaplanan Derece (N):</td>
              <td style="padding: 6px; font-weight: 700; color: #1e3a8a;">N = ${filterModel.order}</td>
              <td style="padding: 6px; font-weight: 600;">Aktif Kat Sayısı:</td>
              <td style="padding: 6px;">${circuitModel.stages.length} Aşama (Biquad/Buffer)</td>
            </tr>
          </table>
        </div>

        <!-- Section 2: Mathematical Model -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">
            2. TRANSFER FONKSİYONU VE BİQUAD AYRIŞTIRMASI
          </h3>
          <p style="font-size: 12px; margin-bottom: 8px;">Kaskad biquad sentezi için ayrıştırılmış 2. derece kuadratik ve 1. derece faktörler:</p>
          <div style="background: #f9fafb; padding: 10px 14px; border-radius: 6px; font-size: 13px; border: 1px solid #e5e7eb;">
            ${filterModel.stages.map((st, i) => `
              <div style="margin: 4px 0;">
                <strong>Kat ${i + 1} (${st.stageType}):</strong>
                $$\\omega_0 = ${st.w0.toFixed(2)}\\text{ rad/s} \\; (${(st.w0 / (2 * Math.PI)).toFixed(1)}\\text{ Hz}), \\quad Q = ${st.Q.toFixed(2)}, \\quad b_1 = ${st.b1.toFixed(2)}, \\quad b_2 = ${st.b2.toExponential(3)}$$
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 3: Bill of Materials (BOM) -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">
            3. MALZEME LİSTESİ VE STANDART E24/E12 BİLEŞEN SEÇİMİ (BOM)
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
            <thead>
              <tr style="background: #f3f4f6; border-bottom: 1.5px solid #d1d5db;">
                <th style="padding: 6px 8px;">Aşama</th>
                <th style="padding: 6px 8px;">Bileşen</th>
                <th style="padding: 6px 8px;">Teorik Değer</th>
                <th style="padding: 6px 8px;">Standart Değer (E24/E12)</th>
                <th style="padding: 6px 8px;">Sapma (%)</th>
                <th style="padding: 6px 8px;">Önerilen Donanım Tipi</th>
              </tr>
            </thead>
            <tbody>
              ${circuitModel.stages.map((st, idx) => {
                return Object.entries(st.components || {}).map(([cKey, cVal]) => {
                  if (typeof cVal !== 'number' || !isFinite(cVal) || cVal <= 0) return '';
                  const isCap = cKey.startsWith('C');
                  const std = CircuitEngine.findNearestStandard(cVal, isCap ? CircuitEngine.E12 : CircuitEngine.E24);
                  const err = ((std - cVal) / cVal) * 100;
                  const formattedExact = isCap ? CircuitEngine.formatCapacitor(cVal) : CircuitEngine.formatResistor(cVal);
                  const formattedStd = isCap ? CircuitEngine.formatCapacitor(std) : CircuitEngine.formatResistor(std);
                  return `
                    <tr style="border-bottom: 1px solid #f3f4f6;">
                      <td style="padding: 5px 8px; font-weight: 600;">Kat ${idx + 1}</td>
                      <td style="padding: 5px 8px; font-weight: 600; color: #1d4ed8;">${cKey}</td>
                      <td style="padding: 5px 8px; font-family: monospace;">${formattedExact}</td>
                      <td style="padding: 5px 8px; font-family: monospace; font-weight: 600;">${formattedStd}</td>
                      <td style="padding: 5px 8px; font-family: monospace;">${err >= 0 ? '+' : ''}${err.toFixed(2)}%</td>
                      <td style="padding: 5px 8px; color: #4b5563;">${isCap ? '%5 C0G/NP0 Kapasite' : '%1 Metal Film Direnç'}</td>
                    </tr>
                  `;
                }).join('');
              }).join('')}
              ${circuitModel.divider && circuitModel.divider.needed ? `
                <tr style="border-bottom: 1px solid #f3f4f6; background: #fefce8;">
                  <td style="padding: 5px 8px; font-weight: 600;">Çıkış Bölücü</td>
                  <td style="padding: 5px 8px; font-weight: 600; color: #b45309;">Rx, Ry</td>
                  <td style="padding: 5px 8px; font-family: monospace;">${circuitModel.divider.labelRx}, ${circuitModel.divider.labelRy}</td>
                  <td style="padding: 5px 8px; font-family: monospace; font-weight: 600;">E24 Serisi</td>
                  <td style="padding: 5px 8px; font-family: monospace;">Kazanç: ${circuitModel.divider.GA.toFixed(3)}</td>
                  <td style="padding: 5px 8px; color: #4b5563;">0 dB Kazanç Eşitleme Bölücüsü</td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>

        <!-- Section 4: Hardware Realization Notes -->
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">
            4. DONANIM VE LABORATUVAR UYGULAMA NOTLARI
          </h3>
          <ul style="font-size: 12px; color: #374151; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li><strong>Op-Amp Seçimi:</strong> Kesim frekansı $\\omega_0$ için kullanılan Op-Amp'ın Kazanç-Bant Genişliği Çarpımı (GBWP) en az $100 \\times f_0$ olmalıdır (Örn: TL072, OPA134 veya NE5532).</li>
            <li><strong>Besleme Filtrelemesi (Decoupling):</strong> Her Op-Amp entegresinin pozitif ve negatif besleme pinlerine ($V_{CC+}, V_{EE-}$) mümkün olduğunca yakın $100\\text{ nF}$ seramik dekuplaj kondansatörleri yerleştirilmelidir.</li>
            <li><strong>Kondansatör Tipi:</strong> Filtre frekans doğruluğu için sıcaklık katsayısı düşük C0G/NP0 seramik veya polipropilen film kondansatörler tercih edilmelidir.</li>
          </ul>
        </div>

        <!-- Report Footer / Signatures -->
        <div style="border-top: 1px solid #9ca3af; padding-top: 16px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size: 12px; text-align: center;">
          <div>
            <div style="font-weight: 600;">Tasarımı Yapan Öğrenci</div>
            <div style="margin-top: 25px; border-top: 1px dashed #d1d5db; padding-top: 4px;">İmza / Tarih</div>
          </div>
          <div>
            <div style="font-weight: 600;">Laboratuvar Sorumlusu</div>
            <div style="margin-top: 25px; border-top: 1px dashed #d1d5db; padding-top: 4px;">İmza / Tarih</div>
          </div>
          <div>
            <div style="font-weight: 600;">Dersin Öğretim Üyesi</div>
            <div style="margin-top: 25px; border-top: 1px dashed #d1d5db; padding-top: 4px;">Onay</div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  return {
    open,
    close
  };
})();

if (typeof window !== 'undefined') {
  window.LabReportModal = LabReportModal;
}

if (typeof module !== 'undefined') module.exports = LabReportModal;
