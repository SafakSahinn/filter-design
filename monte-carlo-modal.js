/**
 * FilterDesign Studio - Monte Carlo Tolerance & Real Op-Amp GBWP Simulation Module
 * Simulates component tolerances (+-1%, +-5%, +-10%) and practical Op-Amp finite GBWP/Slew Rate effects
 */

const MonteCarloModal = (() => {
  let overlay = null;
  let currentConfig = null;
  let currentFilter = null;
  let currentCircuit = null;

  const OPAMPS = {
    ideal: { name: 'İdeal Op-Amp (Sonsuz GBWP)', gbwp: Infinity, sr: Infinity },
    tl072: { name: 'TL072 / TL082 (GBWP: 3 MHz, SR: 13 V/µs)', gbwp: 3e6, sr: 13 },
    lm358: { name: 'LM358 (GBWP: 1 MHz, SR: 0.5 V/µs)', gbwp: 1e6, sr: 0.5 },
    opa134: { name: 'OPA134 SoundPlus (GBWP: 8 MHz, SR: 20 V/µs)', gbwp: 8e6, sr: 20 },
    ne5532: { name: 'NE5532 Düşük Gürültü (GBWP: 10 MHz, SR: 9 V/µs)', gbwp: 10e6, sr: 9 }
  };

  function init() {
    if (document.getElementById('monteCarloModalOverlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'monteCarloModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 980px; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border); padding: 14px 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">🎲</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; color: var(--text-h);">Bileşen Toleransı & Monte Carlo Simülasyonu</h3>
              <p style="margin: 2px 0 0; font-size: 12px; color: var(--muted);">Direnç/Kondansatör Sapmaları ve Pratik Op-Amp GBWP Etkisi</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="closeMcModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--muted);">&times;</button>
        </div>

        <div class="modal-body" style="padding: 20px; overflow-y: auto;">
          <!-- Controls Bar -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; background: #fafaf9; border: 1px solid var(--border); padding: 14px; border-radius: 6px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); margin-bottom: 4px;">BİLEŞEN TOLERANSI (R ve C):</label>
              <select id="mcToleranceSelect" class="form-control" style="width: 100%; font-size: 12.5px; padding: 6px 8px;">
                <option value="0.01">±%1 (Hassas Metal Film Direnç / C0G)</option>
                <option value="0.05" selected>±%5 (Standart Karbon Film / Film Kondansatör)</option>
                <option value="0.10">±%10 (Genel Amaçlı / Seramik)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); margin-bottom: 4px;">OP-AMP MODELİ (GBWP ETKİSİ):</label>
              <select id="mcOpampSelect" class="form-control" style="width: 100%; font-size: 12.5px; padding: 6px 8px;">
                <option value="ideal">İdeal Op-Amp (GBWP = ∞)</option>
                <option value="tl072" selected>TL072 (GBWP: 3 MHz)</option>
                <option value="lm358">LM358 (GBWP: 1 MHz - Düşük Hız)</option>
                <option value="opa134">OPA134 (GBWP: 8 MHz - Yüksek Hız)</option>
                <option value="ne5532">NE5532 (GBWP: 10 MHz - Ses)</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 11.5px; font-weight: 600; color: var(--muted); margin-bottom: 4px;">İTERASYON SAYISI:</label>
              <select id="mcRunsSelect" class="form-control" style="width: 100%; font-size: 12.5px; padding: 6px 8px;">
                <option value="30">30 Çalıştırma</option>
                <option value="50" selected>50 Çalıştırma (Önerilen)</option>
                <option value="100">100 Çalıştırma (Detaylı)</option>
              </select>
            </div>

            <div style="display: flex; align-items: flex-end;">
              <button type="button" class="btn btn-primary" id="btnRunMcSim" style="width: 100%; padding: 7px 12px; font-weight: 600; font-size: 13px;">
                🔄 Yeniden Simüle Et
              </button>
            </div>
          </div>

          <!-- Canvas Container -->
          <div style="background: #fff; border: 1px solid var(--border); border-radius: 6px; padding: 14px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <div style="font-weight: 700; font-size: 13.5px; color: var(--text-h);">📊 Monte Carlo Frekans Yanıtı Dağılımı (Bode Genlik - dB)</div>
              <div style="display: flex; gap: 14px; font-size: 11.5px;">
                <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 14px; height: 3px; background: #3d5afe; display: inline-block;"></span> Nominal Yanıt</span>
                <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 14px; height: 1.5px; background: rgba(59,130,246,0.3); display: inline-block;"></span> Tolerans Varyasyonları</span>
                <span style="display: flex; align-items: center; gap: 5px;"><span style="width: 14px; height: 2px; border-top: 2px dashed #ef4444; display: inline-block;"></span> Pratik Op-Amp Yanıtı</span>
              </div>
            </div>
            <div style="height: 320px; width: 100%;">
              <canvas id="canvasMonteCarlo" style="width: 100%; height: 100%; display: block;"></canvas>
            </div>
          </div>

          <!-- Statistics & Insights -->
          <div id="mcStatsContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeMcModalBtn').addEventListener('click', close);
    overlay.querySelector('#btnRunMcSim').addEventListener('click', () => {
      runSimulation();
    });
    overlay.querySelector('#mcToleranceSelect').addEventListener('change', () => runSimulation());
    overlay.querySelector('#mcOpampSelect').addEventListener('change', () => runSimulation());
    overlay.querySelector('#mcRunsSelect').addEventListener('change', () => runSimulation());

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  function open(filterConfig, filterModel, circuitModel) {
    init();
    currentConfig = filterConfig;
    currentFilter = filterModel;
    currentCircuit = circuitModel;

    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      runSimulation();
    }, 50);
  }

  function close() {
    if (overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  // Gaussian random generator
  function randn() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function runSimulation() {
    if (!currentConfig || !currentFilter || !currentCircuit) return;

    const canvas = document.getElementById('canvasMonteCarlo');
    if (!canvas) return;

    const tol = parseFloat(document.getElementById('mcToleranceSelect').value) || 0.05;
    const opampKey = document.getElementById('mcOpampSelect').value || 'tl072';
    const opamp = OPAMPS[opampKey];
    const nRuns = parseInt(document.getElementById('mcRunsSelect').value, 10) || 50;

    const fp = Array.isArray(currentConfig.fpass) ? currentConfig.fpass[0] : currentConfig.fpass;
    const fMin = Math.max(1, fp / 10);
    const fMax = Math.max(100, fp * 20);

    // Frequency vector
    const numPoints = 180;
    const freqs = [];
    for (let i = 0; i < numPoints; i++) {
      const f = fMin * Math.pow(fMax / fMin, i / (numPoints - 1));
      freqs.push(f);
    }

    // Nominal curve
    const nominalMags = freqs.map(f => evalFilterMag(currentFilter, 2 * Math.PI * f));

    // Monte Carlo curves
    const mcCurves = [];
    const cutoffFreqs = [];

    for (let run = 0; run < nRuns; run++) {
      // Perturb stages components
      const perturbedStages = currentFilter.stages.map(st => {
        // R and C variations
        const deltaR1 = 1 + (randn() * tol / 2.5);
        const deltaR2 = 1 + (randn() * tol / 2.5);
        const deltaC1 = 1 + (randn() * tol / 2.5);
        const deltaC2 = 1 + (randn() * tol / 2.5);

        const w0_pert = st.w0 / Math.sqrt(deltaR1 * deltaR2 * deltaC1 * deltaC2);
        const Q_pert = st.Q * Math.sqrt((deltaR1 * deltaC1) / (deltaR2 * deltaC2));
        const b2_pert = w0_pert * w0_pert;
        const b1_pert = w0_pert / Math.max(0.2, Q_pert);

        return {
          stageType: st.stageType,
          w0: w0_pert,
          Q: Q_pert,
          b1: b1_pert,
          b2: b2_pert
        };
      });

      const perturbedFilter = { stages: perturbedStages };
      const mags = freqs.map(f => evalFilterMag(perturbedFilter, 2 * Math.PI * f));
      mcCurves.push(mags);

      // Estimate cutoff frequency where mag drops by 3dB
      const baseMag = mags[0];
      for (let i = 1; i < freqs.length; i++) {
        if (mags[i] <= baseMag - 3.0) {
          cutoffFreqs.push(freqs[i]);
          break;
        }
      }
    }

    // Real Op-Amp curve (finite GBWP effect)
    const realOpampMags = freqs.map((f, idx) => {
      const nom = nominalMags[idx];
      if (!isFinite(opamp.gbwp)) return nom;
      // High frequency attenuation / peaking due to finite open loop gain
      const w = 2 * Math.PI * f;
      const beta = 1 / Math.max(1, currentCircuit.Ktot || 1.5);
      const loopGain = (2 * Math.PI * opamp.gbwp) / (w + 1);
      const factor = loopGain / (loopGain + (1 / beta));
      const penaltyDb = 20 * Math.log10(Math.max(1e-4, factor));
      return nom + (f > opamp.gbwp / 100 ? penaltyDb : 0);
    });

    // Draw on Canvas
    drawMonteCarloPlot(canvas, freqs, nominalMags, mcCurves, realOpampMags, fMin, fMax);

    // Compute stats
    renderStats(cutoffFreqs, fp, tol, opamp);
  }

  function evalFilterMag(filterModel, w) {
    let magSq = 1.0;
    filterModel.stages.forEach(st => {
      if (st.stageType === 'lowpass_1st') {
        magSq *= (st.b2 * st.b2) / (w * w + st.b2 * st.b2);
      } else if (st.stageType === 'lowpass_2nd') {
        const num = st.b2 * st.b2;
        const re = st.b2 - w * w;
        const im = st.b1 * w;
        magSq *= num / (re * re + im * im);
      } else if (st.stageType === 'highpass_2nd') {
        const num = Math.pow(w, 4);
        const re = st.b2 - w * w;
        const im = st.b1 * w;
        magSq *= num / (re * re + im * im);
      } else {
        const num = st.b2 * st.b2;
        const re = st.b2 - w * w;
        const im = st.b1 * w;
        magSq *= num / Math.max(1e-12, (re * re + im * im));
      }
    });

    const db = 10 * Math.log10(Math.max(1e-15, magSq));
    return Math.max(-80, Math.min(20, db));
  }

  function drawMonteCarloPlot(canvas, freqs, nominal, curves, realOpamp, fMin, fMax) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = (rect.width || 800) * dpr;
    canvas.height = (rect.height || 320) * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const w = rect.width || 800;
    const h = rect.height || 320;
    const pad = { top: 20, right: 30, bottom: 40, left: 55 };
    const pw = w - pad.left - pad.right;
    const ph = h - pad.top - pad.bottom;

    ctx.clearRect(0, 0, w, h);

    const yMin = -60;
    const yMax = 10;

    const getX = (f) => pad.left + (Math.log10(f / fMin) / Math.log10(fMax / fMin)) * pw;
    const getY = (db) => pad.top + ((yMax - db) / (yMax - yMin)) * ph;

    // Grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let db = yMin; db <= yMax; db += 10) {
      const y = getY(db);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pw, y);
      ctx.stroke();

      ctx.fillStyle = '#6b7280';
      ctx.font = '10.5px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${db} dB`, pad.left - 8, y + 4);
    }

    // Decade vertical lines
    let curDec = Math.pow(10, Math.floor(Math.log10(fMin)));
    while (curDec <= fMax) {
      if (curDec >= fMin) {
        const x = getX(curDec);
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + ph);
        ctx.stroke();

        ctx.fillStyle = '#6b7280';
        ctx.font = '10.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        const label = curDec >= 1e6 ? `${curDec / 1e6}M` : curDec >= 1e3 ? `${curDec / 1e3}k` : `${curDec}`;
        ctx.fillText(label + ' Hz', x, pad.top + ph + 18);
      }
      curDec *= 10;
    }

    // Draw 0 dB line
    ctx.strokeStyle = '#9ca3af';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, getY(0));
    ctx.lineTo(pad.left + pw, getY(0));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Monte Carlo curves
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.18)';
    ctx.lineWidth = 1.2;
    curves.forEach(curve => {
      ctx.beginPath();
      curve.forEach((db, idx) => {
        const x = getX(freqs[idx]);
        const y = getY(db);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Draw Real Op-Amp curve (crimson dashed)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2.0;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    realOpamp.forEach((db, idx) => {
      const x = getX(freqs[idx]);
      const y = getY(db);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Nominal curve (bold blue)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    nominal.forEach((db, idx) => {
      const x = getX(freqs[idx]);
      const y = getY(db);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderStats(cutoffs, nominalFp, tol, opamp) {
    const container = document.getElementById('mcStatsContainer');
    if (!container) return;

    let avg = nominalFp;
    let min = nominalFp;
    let max = nominalFp;
    let stdDev = 0;

    if (cutoffs.length > 0) {
      avg = cutoffs.reduce((a, b) => a + b, 0) / cutoffs.length;
      min = Math.min(...cutoffs);
      max = Math.max(...cutoffs);
      const variance = cutoffs.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / cutoffs.length;
      stdDev = Math.sqrt(variance);
    }

    const spreadPercent = ((max - min) / nominalFp) * 100;

    container.innerHTML = `
      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 12px 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase;">Nominal Kesim (f_pass)</div>
        <div style="font-size: 18px; font-weight: 700; color: #2563eb; margin-top: 2px;">${nominalFp.toFixed(1)} Hz</div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">Hedeflenen Tasarım Değeri</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 12px 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase;">Tolerans Dağılım Aralığı</div>
        <div style="font-size: 16px; font-weight: 700; color: ${spreadPercent > 10 ? '#ea580c' : '#16a34a'}; margin-top: 4px;">
          ${min.toFixed(0)} Hz — ${max.toFixed(0)} Hz
        </div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">Toplam Yayılım: ±${(spreadPercent / 2).toFixed(1)}% (Δ: ${(max - min).toFixed(0)} Hz)</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 12px 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase;">Standart Sapma (σ)</div>
        <div style="font-size: 18px; font-weight: 700; color: var(--text-h); margin-top: 2px;">±${stdDev.toFixed(1)} Hz</div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">Bileşen Toleransı: ±${(tol * 100).toFixed(0)}%</div>
      </div>

      <div style="background: #fafaf9; border: 1px solid var(--border); padding: 12px 14px; border-radius: 6px;">
        <div style="font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase;">Op-Amp Bant Genişliği Riski</div>
        <div style="font-size: 15px; font-weight: 700; color: ${opamp.gbwp < nominalFp * 50 ? '#dc2626' : '#16a34a'}; margin-top: 4px;">
          ${opamp.gbwp === Infinity ? 'İdeal (Sonsuz)' : opamp.name.split(' ')[0] + ' (' + (opamp.gbwp / 1e6).toFixed(0) + ' MHz)'}
        </div>
        <div style="font-size: 11px; color: var(--muted); margin-top: 2px;">
          ${opamp.gbwp < nominalFp * 50 ? '⚠️ GBWP yetersiz; yüksek frekansta bozulma riski!' : '✓ GBWP yeterli (> 50x f_c).'}
        </div>
      </div>
    `;
  }

  return {
    open,
    close
  };
})();

if (typeof window !== 'undefined') {
  window.MonteCarloModal = MonteCarloModal;
}

if (typeof module !== 'undefined') module.exports = MonteCarloModal;
