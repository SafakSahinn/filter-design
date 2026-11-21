/**
 * FilterDesign Studio - High-Precision Canvas Plotter
 * Clean, lightweight, interactive charts
 */

const FilterPlotter = (() => {
  // Theme colors
  const THEME = {
    bg: '#ffffff',
    panelBg: '#fbfbfa',
    border: '#e3e2de',
    grid: '#f0efe9',
    text: '#2f2e2b',
    muted: '#787774',
    accent: '#3d5afe',
    passLine: '#ef4444',
    stopLine: '#6b7280',
    phaseLine: '#10b981',
    stepLine: '#8b5cf6',
    poleColor: '#ef4444',
    zeroColor: '#3b82f6'
  };

  // Bode Magnitude Plot
  function drawBodeMag(canvas, freqs, magDb, passDb, stopDb, fpass, fstop) {
    if (!canvas || canvas.clientWidth <= 10 || canvas.clientHeight <= 10) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 55, right: 25, top: 38, bottom: 35 };
    const pw = Math.max(10, w - pad.left - pad.right);
    const ph = Math.max(10, h - pad.top - pad.bottom);

    if (!freqs || freqs.length === 0) return;

    const minF = freqs[0];
    const maxF = freqs[freqs.length - 1];
    const logMinF = Math.log10(minF);
    const logMaxF = Math.log10(maxF);

    const minDb = Math.min(-80, Math.floor((Math.min(...magDb) - 5) / 10) * 10);
    const maxDb = 10;

    const xMap = (f) => pad.left + ((Math.log10(f) - logMinF) / (logMaxF - logMinF)) * pw;
    const yMap = (db) => pad.top + ((maxDb - db) / (maxDb - minDb)) * ph;

    // Grid lines for frequency decades
    ctx.strokeStyle = THEME.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = THEME.muted;
    ctx.font = '10.5px Inter, sans-serif';

    const minDecade = Math.floor(logMinF);
    const maxDecade = Math.ceil(logMaxF);

    for (let d = minDecade; d <= maxDecade; d++) {
      for (let m = 1; m <= 9; m++) {
        const val = m * Math.pow(10, d);
        if (val < minF || val > maxF) continue;
        const x = xMap(val);
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + ph);
        ctx.stroke();

        if (m === 1) {
          ctx.fillText(formatFreq(val), x - 10, pad.top + ph + 16);
        }
      }
    }

    // Grid lines for dB
    for (let db = maxDb; db >= minDb; db -= 15) {
      const y = yMap(db);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pw, y);
      ctx.stroke();
      ctx.fillText(`${db} dB`, pad.left - 45, y + 4);
    }

    // Passband & Stopband spec lines
    ctx.setLineDash([4, 4]);
    // -A_pass line
    ctx.strokeStyle = THEME.passLine;
    const yPass = yMap(-passDb);
    ctx.beginPath();
    ctx.moveTo(pad.left, yPass);
    ctx.lineTo(pad.left + pw, yPass);
    ctx.stroke();

    // -A_stop line
    ctx.strokeStyle = THEME.stopLine;
    const yStop = yMap(-stopDb);
    ctx.beginPath();
    ctx.moveTo(pad.left, yStop);
    ctx.lineTo(pad.left + pw, yStop);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve
    ctx.strokeStyle = THEME.accent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < freqs.length; i++) {
      const x = xMap(freqs[i]);
      const y = Math.max(pad.top - 5, Math.min(pad.top + ph + 5, yMap(magDb[i])));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Outer border
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, pw, ph);

    // Title & Legend (Adaptive based on pw to prevent any collision)
    ctx.fillStyle = THEME.text;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    const magTitle = (pw < 240) ? 'Genlik' : ((pw < 320) ? 'Genlik (dB)' : 'Büyüklük Yanıtı (dB)');
    ctx.fillText(magTitle, pad.left, pad.top - 16);

    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'right';
    if (pw >= 220) {
      ctx.fillStyle = THEME.stopLine;
      ctx.fillText(`-a_stop: -${stopDb} dB`, pad.left + pw, pad.top - 16);
      if (pw >= 310) {
        ctx.fillStyle = THEME.passLine;
        ctx.fillText(`-a_pass: -${passDb} dB`, pad.left + pw - 90, pad.top - 16);
      }
    }
    ctx.textAlign = 'left';
  }

  // Bode Phase Plot
  function drawBodePhase(canvas, freqs, phaseDeg) {
    if (!canvas || canvas.clientWidth <= 10 || canvas.clientHeight <= 10) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 55, right: 25, top: 38, bottom: 35 };
    const pw = Math.max(10, w - pad.left - pad.right);
    const ph = Math.max(10, h - pad.top - pad.bottom);

    if (!freqs || freqs.length === 0) return;

    const minF = freqs[0];
    const maxF = freqs[freqs.length - 1];
    const logMinF = Math.log10(minF);
    const logMaxF = Math.log10(maxF);

    const minDeg = Math.floor(Math.min(...phaseDeg) / 90) * 90 - 45;
    const maxDeg = Math.ceil(Math.max(...phaseDeg) / 90) * 90 + 45;

    const xMap = (f) => pad.left + ((Math.log10(f) - logMinF) / (logMaxF - logMinF)) * pw;
    const yMap = (deg) => pad.top + ((maxDeg - deg) / (maxDeg - minDeg)) * ph;

    // Grid
    ctx.strokeStyle = THEME.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = THEME.muted;
    ctx.font = '10.5px Inter, sans-serif';

    const minDecade = Math.floor(logMinF);
    const maxDecade = Math.ceil(logMaxF);

    for (let d = minDecade; d <= maxDecade; d++) {
      for (let m = 1; m <= 9; m++) {
        const val = m * Math.pow(10, d);
        if (val < minF || val > maxF) continue;
        const x = xMap(val);
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + ph);
        ctx.stroke();
        if (m === 1) ctx.fillText(formatFreq(val), x - 10, pad.top + ph + 16);
      }
    }

    for (let deg = maxDeg; deg >= minDeg; deg -= 45) {
      const y = yMap(deg);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pw, y);
      ctx.stroke();
      ctx.fillText(`${deg}°`, pad.left - 42, y + 4);
    }

    // Curve
    ctx.strokeStyle = THEME.phaseLine;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < freqs.length; i++) {
      const x = xMap(freqs[i]);
      const y = Math.max(pad.top - 5, Math.min(pad.top + ph + 5, yMap(phaseDeg[i])));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, pw, ph);

    ctx.fillStyle = THEME.text;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText('Faz Yanıtı (Derece)', pad.left, pad.top - 16);
  }

  // Pole-Zero Map (s-Plane)
  function drawPoleZero(canvas, poles, zeros) {
    if (!canvas || canvas.clientWidth <= 10 || canvas.clientHeight <= 10) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, w, h);

    const pad = 38;
    const size = Math.max(20, Math.min(w - 2 * pad, h - 2 * pad));
    const cx = w / 2;
    const cy = h / 2 + 6;

    const getMag = (pt) => (pt && typeof pt.mag === 'function' ? pt.mag() : Math.hypot(pt.re || 0, pt.im || 0));

    // Determine scale based on maximum magnitude
    let maxR = 1.2;
    if (poles && poles.length) {
      poles.forEach(p => { if (p) maxR = Math.max(maxR, getMag(p)); });
    }
    if (zeros && zeros.length) {
      zeros.forEach(z => { if (z) maxR = Math.max(maxR, getMag(z)); });
    }
    maxR = Math.max(1.2, maxR * 1.25);

    const scale = Math.max(0.1, (size / 2) / maxR);
    const circleRadius = Math.max(1, scale * 1.0); // Unit circle / cutoff circle

    // Background circle (reference radius = 1.0)
    ctx.strokeStyle = THEME.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();

    // Axes
    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1.5;
    // Real axis (sigma)
    ctx.beginPath();
    ctx.moveTo(pad, cy);
    ctx.lineTo(w - pad, cy);
    ctx.stroke();
    // Imag axis (jw)
    ctx.beginPath();
    ctx.moveTo(cx, pad + 10);
    ctx.lineTo(cx, h - pad + 10);
    ctx.stroke();

    ctx.fillStyle = THEME.muted;
    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Re (σ)', w - pad, cy - 8);
    ctx.textAlign = 'left';
    ctx.fillText('Im (jω)', cx + 8, pad + 24);

    // Draw Zeros (o)
    if (zeros && zeros.length) {
      zeros.forEach(z => {
        if (!z) return;
        const zx = cx + (z.re || 0) * scale;
        const zy = cy - (z.im || 0) * scale;
        ctx.strokeStyle = THEME.zeroColor;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(zx, zy, 5.5, 0, 2 * Math.PI);
        ctx.stroke();
      });
    }

    // Draw Poles (x)
    if (poles && poles.length) {
      poles.forEach(p => {
        if (!p) return;
        const px = cx + (p.re || 0) * scale;
        const py = cy - (p.im || 0) * scale;
        const r = 5.5;
        ctx.strokeStyle = THEME.poleColor;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(px - r, py - r);
        ctx.lineTo(px + r, py + r);
        ctx.moveTo(px - r, py + r);
        ctx.lineTo(px + r, py - r);
        ctx.stroke();
      });
    }

    // Title & Legend (Adaptive layout)
    ctx.fillStyle = THEME.text;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    const pzTitle = (w < 320) ? 's-Düzlemi' : 's-Düzlemi (Pole-Zero)';
    ctx.fillText(pzTitle, pad, pad - 16);

    ctx.font = '10.5px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = THEME.zeroColor;
    ctx.fillText('○ Sıfır', w - pad, pad - 16);
    if (w >= 280) {
      ctx.fillStyle = THEME.poleColor;
      ctx.fillText('× Kutup', w - pad - 48, pad - 16);
    }
    ctx.textAlign = 'left';
  }

  // Step Response Plot
  function drawStepResponse(canvas, times, stepValues) {
    if (!canvas || canvas.clientWidth <= 10 || canvas.clientHeight <= 10) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = THEME.bg;
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 50, right: 25, top: 38, bottom: 35 };
    const pw = Math.max(10, w - pad.left - pad.right);
    const ph = Math.max(10, h - pad.top - pad.bottom);

    if (!times || times.length === 0) return;

    const maxT = times[times.length - 1] || 1;
    const minVal = -0.2;
    const maxVal = 1.4;

    const xMap = (t) => pad.left + (t / maxT) * pw;
    const yMap = (val) => pad.top + ((maxVal - val) / (maxVal - minVal)) * ph;

    // Grid
    ctx.strokeStyle = THEME.grid;
    ctx.lineWidth = 1;
    for (let step = 0; step <= 5; step++) {
      const tVal = (maxT / 5) * step;
      const x = xMap(tVal);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + ph);
      ctx.stroke();

      ctx.fillStyle = THEME.muted;
      ctx.font = '10.5px Inter, sans-serif';
      ctx.fillText(formatTime(tVal), x - 12, pad.top + ph + 16);
    }

    for (let v = 0; v <= 1.4; v += 0.2) {
      const y = yMap(v);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pw, y);
      ctx.stroke();

      ctx.fillStyle = THEME.muted;
      ctx.fillText(v.toFixed(1), pad.left - 35, y + 4);
    }

    // Target 1.0 dashed line
    ctx.strokeStyle = THEME.muted;
    ctx.setLineDash([4, 4]);
    const yTarget = yMap(1.0);
    ctx.beginPath();
    ctx.moveTo(pad.left, yTarget);
    ctx.lineTo(pad.left + pw, yTarget);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve
    ctx.strokeStyle = THEME.stepLine;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i < times.length; i++) {
      const x = xMap(times[i]);
      const y = Math.max(pad.top - 5, Math.min(pad.top + ph + 5, yMap(stepValues[i])));
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = THEME.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, pw, ph);

    ctx.fillStyle = THEME.text;
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillText('Birim Basamak Yanıtı h(t)', pad.left, pad.top - 16);
  }

  function formatFreq(f) {
    if (f >= 1e6) return (f / 1e6).toFixed(0) + 'M';
    if (f >= 1e3) return (f / 1e3).toFixed(0) + 'k';
    return f.toFixed(0);
  }

  function formatTime(t) {
    if (t < 1e-3) return (t * 1e6).toFixed(0) + 'µs';
    if (t < 1) return (t * 1e3).toFixed(1) + 'ms';
    return t.toFixed(2) + 's';
  }

  return {
    drawBodeMag,
    drawBodePhase,
    drawPoleZero,
    drawStepResponse
  };
})();

if (typeof module !== 'undefined') module.exports = FilterPlotter;
