/**
 * FilterDesign Studio - Circuit Synthesis Engine (Chapter 4)
 * Generates Op-Amp Sallen-Key, Twin-Tee stages, Component Values & Vector SVG Schematics
 */

const CircuitEngine = (() => {
  // Standard E-series values
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
  const E24 = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1];
  const E96 = [
    1.00, 1.02, 1.05, 1.07, 1.10, 1.13, 1.15, 1.18, 1.21, 1.24, 1.27, 1.30, 1.33, 1.37, 1.40, 1.43,
    1.47, 1.50, 1.54, 1.58, 1.62, 1.65, 1.69, 1.74, 1.78, 1.82, 1.87, 1.91, 1.96, 2.00, 2.05, 2.10,
    2.15, 2.21, 2.26, 2.32, 2.37, 2.43, 2.49, 2.55, 2.61, 2.67, 2.74, 2.80, 2.87, 2.94, 3.01, 3.09,
    3.16, 3.24, 3.32, 3.40, 3.48, 3.57, 3.65, 3.74, 3.83, 3.92, 4.02, 4.12, 4.22, 4.32, 4.42, 4.53,
    4.64, 4.75, 4.87, 4.99, 5.11, 5.23, 5.36, 5.49, 5.62, 5.76, 5.90, 6.04, 6.19, 6.34, 6.49, 6.65,
    6.81, 6.98, 7.15, 7.32, 7.50, 7.68, 7.87, 8.06, 8.25, 8.45, 8.66, 8.87, 9.09, 9.31, 9.53, 9.76
  ];

  function findNearestStandard(value, series = E24) {
    if (value <= 0 || !isFinite(value)) return value;
    const exponent = Math.floor(Math.log10(value));
    const mantissa = value / Math.pow(10, exponent);

    let bestMatch = series[0];
    let minDiff = Math.abs(mantissa - series[0]);

    for (let i = 1; i < series.length; i++) {
      const diff = Math.abs(mantissa - series[i]);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = series[i];
      }
    }

    // Check with next decade for boundary wrapping
    const upperDiff = Math.abs(mantissa - 10 * series[0]);
    if (upperDiff < minDiff) {
      return 10 * series[0] * Math.pow(10, exponent);
    }

    return bestMatch * Math.pow(10, exponent);
  }

  function formatResistor(val) {
    if (!val || !isFinite(val)) return '—';
    if (val >= 1e6) return (val / 1e6).toFixed(2) + ' MΩ';
    if (val >= 1e3) return (val / 1e3).toFixed(2) + ' kΩ';
    return val.toFixed(1) + ' Ω';
  }

  function formatCapacitor(val) {
    if (!val || !isFinite(val)) return '—';
    if (val >= 1e-6) return (val * 1e6).toFixed(2) + ' µF';
    if (val >= 1e-9) return (val * 1e9).toFixed(2) + ' nF';
    return (val * 1e12).toFixed(1) + ' pF';
  }

  // Synthesize Active Filter Stages (Sections 4.1 to 4.6)
  function synthesizeCircuit(filterModel, baseC = 10e-9, baseRA = 10e3, useStandard = false) {
    const stages = [];
    let Ktot = 1.0;
    const Gdesired = filterModel.overallGain || 1.0;

    filterModel.stages.forEach((st, idx) => {
      const m = idx + 1;

      if (st.stageType === 'lowpass_1st') {
        // Section 4.2, Eq. 4.19 - 4.21: First-order lowpass RC with op-amp buffer
        // R = 1 / (b2 * C)
        let C = baseC;
        let R = 1 / (st.b2 * C);
        if (useStandard) {
          C = findNearestStandard(C, E12);
          R = findNearestStandard(R, E24);
        }

        stages.push({
          stageNum: m,
          topology: '1st-Order Lowpass (Buffer)',
          type: 'lowpass_1st',
          K: 1.0,
          w0: st.w0,
          Q: 0.5,
          components: {
            R1: R,
            C1: C
          },
          labels: {
            R1: formatResistor(R),
            C1: formatCapacitor(C)
          }
        });
      } else if (st.stageType === 'lowpass_2nd') {
        // Section 4.2, Eq. 4.10 - 4.13: Sallen-Key Lowpass (Equal-Component)
        // R1 = R2 = R = 1 / (C * sqrt(b2))
        // K = 3 - b1 / sqrt(b2)
        // RB = (K - 1) * RA
        let C = baseC;
        const sqrt_b2 = Math.sqrt(st.b2);
        let R = 1 / (C * sqrt_b2);
        let K = 3 - st.b1 / sqrt_b2;

        if (K <= 1.001) {
          // If K <= 1, voltage follower stage
          K = 1.0;
        }

        let RA = baseRA;
        let RB = (K > 1.0) ? (K - 1.0) * RA : 0;

        if (useStandard) {
          C = findNearestStandard(C, E12);
          R = findNearestStandard(R, E24);
          if (RB > 0) RB = findNearestStandard(RB, E24);
          RA = findNearestStandard(RA, E24);
        }

        Ktot *= K;

        stages.push({
          stageNum: m,
          topology: 'Sallen-Key 2nd-Order Lowpass',
          type: 'lowpass_2nd',
          K: K,
          w0: st.w0,
          Q: st.Q,
          components: {
            R1: R,
            R2: R,
            C1: C,
            C2: C,
            RA: RA,
            RB: RB
          },
          labels: {
            R1: formatResistor(R),
            R2: formatResistor(R),
            C1: formatCapacitor(C),
            C2: formatCapacitor(C),
            RA: formatResistor(RA),
            RB: RB > 0 ? formatResistor(RB) : 'Short (Jumper)'
          }
        });
      } else if (st.stageType === 'highpass_1st') {
        // Section 4.3, Eq. 4.28 - 4.30: First-order highpass CR with op-amp buffer
        let C = baseC;
        let R = 1 / (st.b2 * C);
        if (useStandard) {
          C = findNearestStandard(C, E12);
          R = findNearestStandard(R, E24);
        }

        stages.push({
          stageNum: m,
          topology: '1st-Order Highpass (Buffer)',
          type: 'highpass_1st',
          K: 1.0,
          w0: st.w0,
          Q: 0.5,
          components: {
            C1: C,
            R1: R
          },
          labels: {
            C1: formatCapacitor(C),
            R1: formatResistor(R)
          }
        });
      } else if (st.stageType === 'highpass_2nd') {
        // Section 4.3, Eq. 4.25 - 4.27: Sallen-Key Highpass (Equal-Component)
        // R1 = R2 = R = 1 / (C * sqrt(b2))
        // K = 3 - b1 / sqrt(b2)
        // RB = (K - 1) * RA
        let C = baseC;
        const sqrt_b2 = Math.sqrt(st.b2);
        let R = 1 / (C * sqrt_b2);
        let K = 3 - st.b1 / sqrt_b2;
        if (K <= 1.001) K = 1.0;

        let RA = baseRA;
        let RB = (K > 1.0) ? (K - 1.0) * RA : 0;

        if (useStandard) {
          C = findNearestStandard(C, E12);
          R = findNearestStandard(R, E24);
          if (RB > 0) RB = findNearestStandard(RB, E24);
          RA = findNearestStandard(RA, E24);
        }

        Ktot *= K;

        stages.push({
          stageNum: m,
          topology: 'Sallen-Key 2nd-Order Highpass',
          type: 'highpass_2nd',
          K: K,
          w0: st.w0,
          Q: st.Q,
          components: {
            C1: C,
            C2: C,
            R1: R,
            R2: R,
            RA: RA,
            RB: RB
          },
          labels: {
            C1: formatCapacitor(C),
            C2: formatCapacitor(C),
            R1: formatResistor(R),
            R2: formatResistor(R),
            RA: formatResistor(RA),
            RB: RB > 0 ? formatResistor(RB) : 'Short (Jumper)'
          }
        });
      } else if (st.stageType === 'bandpass_2nd') {
        // Section 4.4, Figure 4.8: Sallen-Key Bandpass active stage
        // Center frequency w0, Q factor
        let C = baseC;
        const w0 = st.w0;
        const Q = Math.max(0.5, st.Q);
        const R1 = Q / (w0 * C);
        const R2 = 1 / (2 * Q * w0 * C);
        const K = 2.0;
        let RA = baseRA;
        let RB = (K - 1) * RA;

        let r1_f = R1, r2_f = R2, c_f = C;
        if (useStandard) {
          c_f = findNearestStandard(C, E12);
          r1_f = findNearestStandard(R1, E24);
          r2_f = findNearestStandard(R2, E24);
          RB = findNearestStandard(RB, E24);
        }

        Ktot *= K;

        stages.push({
          stageNum: m,
          topology: 'Sallen-Key 2nd-Order Bandpass',
          type: 'bandpass_2nd',
          K: K,
          w0: w0,
          Q: Q,
          components: {
            R1: r1_f,
            R2: r2_f,
            C1: c_f,
            C2: c_f,
            RA: RA,
            RB: RB
          },
          labels: {
            R1: formatResistor(r1_f),
            R2: formatResistor(r2_f),
            C1: formatCapacitor(c_f),
            C2: formatCapacitor(c_f),
            RA: formatResistor(RA),
            RB: formatResistor(RB)
          }
        });
      } else if (st.stageType === 'notch_lowpass' || st.stageType === 'notch_bandstop') {
        // Section 4.5 & 4.6, Figure 4.10 / 4.12: Twin-Tee Notch Stage
        // Implements complex zeros on jw axis
        let C = baseC;
        const w0 = st.w0;
        let R = 1 / (w0 * C);
        const Q = Math.max(0.5, st.Q);
        const K = 2 - 1 / (2 * Q);
        let RA = baseRA;
        let RB = (K > 1) ? (K - 1) * RA : 0;

        let C_half = C * 2;
        let R_half = R / 2;

        if (useStandard) {
          C = findNearestStandard(C, E12);
          R = findNearestStandard(R, E24);
          C_half = findNearestStandard(C_half, E12);
          R_half = findNearestStandard(R_half, E24);
          if (RB > 0) RB = findNearestStandard(RB, E24);
        }

        Ktot *= K;

        stages.push({
          stageNum: m,
          topology: 'Twin-T Active Notch Stage',
          type: 'twin_tee_notch',
          K: K,
          w0: w0,
          Q: Q,
          components: {
            R: R,
            R_half: R_half,
            C: C,
            C_double: C_half,
            RA: RA,
            RB: RB
          },
          labels: {
            R: formatResistor(R),
            R_half: formatResistor(R_half),
            C: formatCapacitor(C),
            C_double: formatCapacitor(C_half),
            RA: formatResistor(RA),
            RB: RB > 0 ? formatResistor(RB) : 'Short'
          }
        });
      }
    });

    // Output Voltage Divider for Gain Normalization (Eq. 4.14 - 4.18)
    // GA = Ktot / Gdesired
    // Target output impedance Rout = 10 kΩ
    // Rx = GA * Rout, Ry = (GA / (GA - 1)) * Rout
    let GA = Ktot / Gdesired;
    let divider = null;

    if (GA > 1.05) {
      const Rout = 10e3;
      let Rx = GA * Rout;
      let Ry = (GA / (GA - 1)) * Rout;

      if (useStandard) {
        Rx = findNearestStandard(Rx, E24);
        Ry = findNearestStandard(Ry, E24);
      }

      divider = {
        needed: true,
        GA: GA,
        Rx: Rx,
        Ry: Ry,
        labelRx: formatResistor(Rx),
        labelRy: formatResistor(Ry)
      };
    } else {
      divider = {
        needed: false,
        GA: 1.0,
        Rx: 0,
        Ry: Infinity,
        labelRx: 'Direct',
        labelRy: 'None'
      };
    }

    return {
      stages,
      Ktot,
      GA,
      divider,
      baseC,
      baseRA
    };
  }

  // Draw clean vector SVG schematic for a stage or entire cascade
  function renderStageSVG(stage, stageIdx, totalStages, divider = null) {
    const isFirst = stageIdx === 0;
    const isLast = stageIdx === totalStages - 1;

    let svgInner = '';
    const width = 640;
    const height = 280;

    if (stage.type === 'lowpass_1st') {
      // 1st order LP: Vin -> R1 -> node -> (C1 to GND) -> Op-amp buffer non-inverting (+) -> Vout
      svgInner = `
        <!-- Input line -->
        <line x1="30" y1="120" x2="110" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="30" cy="120" r="4.5" fill="#3d5afe" />
        <text x="25" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isFirst ? 'V_in' : 'In'}</text>

        <!-- Resistor R1 -->
        <rect x="110" y="108" width="70" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="145" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#3d5afe">R₁ = ${stage.labels.R1}</text>

        <!-- Connection Node -->
        <line x1="180" y1="120" x2="260" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="230" cy="120" r="4" fill="#2f2e2b" />

        <!-- Capacitor C1 to GND -->
        <line x1="230" y1="120" x2="230" y2="175" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="212" y1="175" x2="248" y2="175" stroke="#2f2e2b" stroke-width="3" />
        <line x1="212" y1="183" x2="248" y2="183" stroke="#2f2e2b" stroke-width="3" />
        <line x1="230" y1="183" x2="230" y2="215" stroke="#2f2e2b" stroke-width="2.5" />
        <!-- GND -->
        <line x1="215" y1="215" x2="245" y2="215" stroke="#2f2e2b" stroke-width="2" />
        <line x1="222" y1="220" x2="238" y2="220" stroke="#2f2e2b" stroke-width="2" />
        <line x1="226" y1="225" x2="234" y2="225" stroke="#2f2e2b" stroke-width="2" />
        <text x="210" y="195" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C₁ = ${stage.labels.C1}</text>

        <!-- Op-Amp Triangle -->
        <line x1="260" y1="120" x2="310" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <polygon points="310,80 310,200 410,140" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <!-- Inputs + and - -->
        <text x="320" y="125" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="320" y="165" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <!-- Buffer Feedback (Out to -) -->
        <line x1="410" y1="140" x2="470" y2="140" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="440" cy="140" r="4" fill="#2f2e2b" />
        <line x1="440" y1="140" x2="440" y2="240" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="440" y1="240" x2="290" y2="240" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="290" y1="240" x2="290" y2="160" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="290" y1="160" x2="310" y2="160" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Output Port -->
        <circle cx="470" cy="140" r="4.5" fill="#3d5afe" />
        <text x="480" y="145" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isLast ? 'V_out' : 'Out'}</text>
      `;
    } else if (stage.type === 'lowpass_2nd') {
      // 2nd Order Sallen-Key Lowpass (Fig 4.1)
      svgInner = `
        <!-- Input -->
        <line x1="20" y1="110" x2="70" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="20" cy="110" r="4.5" fill="#3d5afe" />
        <text x="15" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isFirst ? 'V_in' : 'In'}</text>

        <!-- R1 -->
        <rect x="70" y="98" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="97" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R₁ = ${stage.labels.R1}</text>

        <!-- Node 1 -->
        <line x1="125" y1="110" x2="160" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="150" cy="110" r="4" fill="#2f2e2b" />

        <!-- R2 -->
        <rect x="160" y="98" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="187" y="90" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R₂ = ${stage.labels.R2}</text>

        <!-- Node 2 (Non-inv input) -->
        <line x1="215" y1="110" x2="260" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="240" cy="110" r="4" fill="#2f2e2b" />

        <!-- C2 to GND -->
        <line x1="240" y1="110" x2="240" y2="165" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="225" y1="165" x2="255" y2="165" stroke="#2f2e2b" stroke-width="3" />
        <line x1="225" y1="173" x2="255" y2="173" stroke="#2f2e2b" stroke-width="3" />
        <line x1="240" y1="173" x2="240" y2="200" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="230" y1="200" x2="250" y2="200" stroke="#2f2e2b" stroke-width="2" />
        <line x1="234" y1="204" x2="246" y2="204" stroke="#2f2e2b" stroke-width="2" />
        <text x="215" y="195" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C₂ = ${stage.labels.C2}</text>

        <!-- C1 Feedback from Node 1 to Op-Amp Output -->
        <line x1="150" y1="110" x2="150" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="150" y1="45" x2="270" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="270" y1="35" x2="270" y2="55" stroke="#2f2e2b" stroke-width="3" />
        <line x1="278" y1="35" x2="278" y2="55" stroke="#2f2e2b" stroke-width="3" />
        <line x1="278" y1="45" x2="430" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="430" y1="45" x2="430" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="274" y="25" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C₁ = ${stage.labels.C1}</text>

        <!-- Op-Amp Triangle -->
        <line x1="240" y1="110" x2="290" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <polygon points="290,70 290,190 390,130" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="300" y="115" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="300" y="155" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <!-- Op-Amp Out -->
        <line x1="390" y1="130" x2="480" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="430" cy="130" r="4" fill="#2f2e2b" />
        <circle cx="480" cy="130" r="4.5" fill="#3d5afe" />
        <text x="490" y="135" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isLast ? 'V_out' : 'Out'}</text>

        <!-- Gain Feedback Network (RA and RB) -->
        <circle cx="410" cy="130" r="4" fill="#2f2e2b" />
        <line x1="410" y1="130" x2="410" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <!-- RB -->
        <rect x="340" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="410" y1="235" x2="395" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="367" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_B = ${stage.labels.RB}</text>

        <!-- Inverting Node -->
        <line x1="340" y1="235" x2="310" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="310" cy="235" r="4" fill="#2f2e2b" />
        <line x1="310" y1="235" x2="310" y2="150" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="310" y1="150" x2="290" y2="150" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- RA to GND -->
        <line x1="310" y1="235" x2="260" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="205" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="232" y="260" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
        <line x1="205" y1="235" x2="185" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="185" y1="225" x2="185" y2="245" stroke="#2f2e2b" stroke-width="2" />
        <line x1="180" y1="229" x2="180" y2="241" stroke="#2f2e2b" stroke-width="2" />
      `;
    } else if (stage.type === 'highpass_2nd' || stage.type === 'highpass_1st') {
      // 2nd Order Highpass (Fig 4.5) - C1, C2 series, R1, R2 to feedback and GND
      svgInner = `
        <!-- Input -->
        <line x1="20" y1="110" x2="70" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="20" cy="110" r="4.5" fill="#3d5afe" />
        <text x="15" y="95" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isFirst ? 'V_in' : 'In'}</text>

        <!-- C1 -->
        <line x1="70" y1="110" x2="95" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="95" y1="95" x2="95" y2="125" stroke="#2f2e2b" stroke-width="3" />
        <line x1="103" y1="95" x2="103" y2="125" stroke="#2f2e2b" stroke-width="3" />
        <line x1="103" y1="110" x2="135" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="99" y="85" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C₁ = ${stage.labels.C1}</text>

        <!-- Node 1 -->
        <circle cx="135" cy="110" r="4" fill="#2f2e2b" />

        <!-- C2 -->
        <line x1="135" y1="110" x2="165" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="165" y1="95" x2="165" y2="125" stroke="#2f2e2b" stroke-width="3" />
        <line x1="173" y1="95" x2="173" y2="125" stroke="#2f2e2b" stroke-width="3" />
        <line x1="173" y1="110" x2="220" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="169" y="85" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C₂ = ${stage.labels.C2}</text>

        <!-- Node 2 (Non-inv input) -->
        <circle cx="220" cy="110" r="4" fill="#2f2e2b" />

        <!-- R2 to GND -->
        <line x1="220" y1="110" x2="220" y2="155" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="208" y="155" width="24" height="50" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="220" y1="205" x2="220" y2="225" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="210" y1="225" x2="230" y2="225" stroke="#2f2e2b" stroke-width="2" />
        <line x1="214" y1="229" x2="226" y2="229" stroke="#2f2e2b" stroke-width="2" />
        <text x="240" y="185" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R₂ = ${stage.labels.R2}</text>

        <!-- R1 Feedback from Node 1 to Op-Amp Output -->
        <line x1="135" y1="110" x2="135" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="135" y1="45" x2="250" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="250" y="33" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="305" y1="45" x2="430" y2="45" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="430" y1="45" x2="430" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="277" y="25" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R₁ = ${stage.labels.R1}</text>

        <!-- Op-Amp Triangle -->
        <line x1="220" y1="110" x2="290" y2="110" stroke="#2f2e2b" stroke-width="2.5" />
        <polygon points="290,70 290,190 390,130" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="300" y="115" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="300" y="155" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <!-- Op-Amp Out -->
        <line x1="390" y1="130" x2="480" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="430" cy="130" r="4" fill="#2f2e2b" />
        <circle cx="480" cy="130" r="4.5" fill="#3d5afe" />
        <text x="490" y="135" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">${isLast ? 'V_out' : 'Out'}</text>

        <!-- Feedback RA / RB -->
        <circle cx="410" cy="130" r="4" fill="#2f2e2b" />
        <line x1="410" y1="130" x2="410" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="340" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="410" y1="235" x2="395" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="367" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_B = ${stage.labels.RB}</text>

        <line x1="340" y1="235" x2="310" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="310" cy="235" r="4" fill="#2f2e2b" />
        <line x1="310" y1="235" x2="310" y2="150" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="310" y1="150" x2="290" y2="150" stroke="#2f2e2b" stroke-width="2.5" />

        <line x1="310" y1="235" x2="260" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="205" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="232" y="260" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
        <line x1="205" y1="235" x2="185" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="185" y1="225" x2="185" y2="245" stroke="#2f2e2b" stroke-width="2" />
      `;
    } else if (stage.type === 'bandpass_2nd') {
      // Sallen-Key Bandpass Stage (Figure 4.8)
      svgInner = `
        <!-- Input Terminal -->
        <line x1="30" y1="120" x2="65" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="30" cy="120" r="4.5" fill="#3d5afe" />
        <text x="25" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">In</text>

        <!-- Resistor R1 -->
        <rect x="65" y="108" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="92" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_1 = ${stage.labels.R1}</text>
        <line x1="120" y1="120" x2="160" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="160" cy="120" r="4" fill="#2f2e2b" />

        <!-- Series Capacitor C1 -->
        <line x1="160" y1="120" x2="195" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="195" y1="108" x2="195" y2="132" stroke="#2f2e2b" stroke-width="3" />
        <line x1="203" y1="108" x2="203" y2="132" stroke="#2f2e2b" stroke-width="3" />
        <text x="199" y="100" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C_1 = ${stage.labels.C1}</text>
        <line x1="203" y1="120" x2="250" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="250" cy="120" r="4" fill="#2f2e2b" />

        <!-- Shunt Resistor R2 to GND -->
        <line x1="250" y1="120" x2="250" y2="155" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="238" y="155" width="24" height="45" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="228" y="182" text-anchor="end" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_2 = ${stage.labels.R2}</text>
        <line x1="250" y1="200" x2="250" y2="220" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="240" y1="220" x2="260" y2="220" stroke="#2f2e2b" stroke-width="2" />
        <line x1="244" y1="224" x2="256" y2="224" stroke="#2f2e2b" stroke-width="2" />

        <!-- Line from C1/R2 to Op-Amp + -->
        <line x1="250" y1="120" x2="290" y2="120" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Op-Amp Triangle -->
        <polygon points="290,80 290,180 380,130" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="300" y="125" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="300" y="155" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <!-- Feedback Capacitor C2 from Out back to Node 160,120 -->
        <line x1="160" y1="120" x2="160" y2="50" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="160" y1="50" x2="260" y2="50" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="260" y1="38" x2="260" y2="62" stroke="#2f2e2b" stroke-width="3" />
        <line x1="268" y1="38" x2="268" y2="62" stroke="#2f2e2b" stroke-width="3" />
        <text x="264" y="30" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">C_2 = ${stage.labels.C2}</text>
        <line x1="268" y1="50" x2="410" y2="50" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="410" y1="50" x2="410" y2="130" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Op-Amp Output -->
        <line x1="380" y1="130" x2="470" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="410" cy="130" r="4" fill="#2f2e2b" />
        <circle cx="470" cy="130" r="4.5" fill="#3d5afe" />
        <text x="480" y="135" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">Out</text>

        <!-- Feedback Loop R_A, R_B to inverting terminal -->
        <line x1="410" y1="130" x2="410" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="340" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="410" y1="235" x2="395" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="367" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_B = ${stage.labels.RB}</text>

        <line x1="340" y1="235" x2="310" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="310" cy="235" r="4" fill="#2f2e2b" />
        <line x1="310" y1="235" x2="310" y2="150" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="310" y1="150" x2="290" y2="150" stroke="#2f2e2b" stroke-width="2.5" />

        <line x1="310" y1="235" x2="260" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="205" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="232" y="260" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
        <line x1="205" y1="235" x2="185" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="185" y1="225" x2="185" y2="245" stroke="#2f2e2b" stroke-width="2" />
        <line x1="181" y1="228" x2="181" y2="242" stroke="#2f2e2b" stroke-width="2" />
      `;
    } else {
      // Twin-Tee Active Notch Stage (Figure 4.10 / 4.12)
      svgInner = `
        <!-- Input Terminal -->
        <line x1="30" y1="120" x2="60" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="30" cy="120" r="4.5" fill="#3d5afe" />
        <circle cx="60" cy="120" r="4" fill="#2f2e2b" />
        <text x="25" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">In</text>

        <!-- Upper T: Two R in series, shunt 2C -->
        <line x1="60" y1="120" x2="60" y2="70" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="60" y1="70" x2="70" y2="70" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="70" y="58" width="42" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="91" y="49" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">R = ${stage.labels.R}</text>
        <line x1="112" y1="70" x2="145" y2="70" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="145" cy="70" r="3.5" fill="#2f2e2b" />
        <line x1="145" y1="70" x2="152" y2="70" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="152" y="58" width="42" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="173" y="49" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">R = ${stage.labels.R}</text>
        <line x1="194" y1="70" x2="220" y2="70" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Shunt 2C from upper midpoint (145, 70) down to midpoint ref -->
        <line x1="145" y1="70" x2="145" y2="95" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="135" y1="95" x2="155" y2="95" stroke="#2f2e2b" stroke-width="3" />
        <line x1="135" y1="102" x2="155" y2="102" stroke="#2f2e2b" stroke-width="3" />
        <text x="125" y="102" text-anchor="end" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#3d5afe">2C = ${stage.labels.C_double}</text>
        <line x1="145" y1="102" x2="145" y2="120" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Lower T: Two C in series, shunt R/2 -->
        <line x1="60" y1="120" x2="60" y2="170" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="60" y1="170" x2="90" y2="170" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="90" y1="158" x2="90" y2="182" stroke="#2f2e2b" stroke-width="3" />
        <line x1="98" y1="158" x2="98" y2="182" stroke="#2f2e2b" stroke-width="3" />
        <text x="94" y="196" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">C = ${stage.labels.C}</text>
        <line x1="98" y1="170" x2="145" y2="170" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="145" cy="170" r="3.5" fill="#2f2e2b" />
        <line x1="145" y1="170" x2="165" y2="170" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="165" y1="158" x2="165" y2="182" stroke="#2f2e2b" stroke-width="3" />
        <line x1="173" y1="158" x2="173" y2="182" stroke="#2f2e2b" stroke-width="3" />
        <text x="169" y="196" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#3d5afe">C = ${stage.labels.C}</text>
        <line x1="173" y1="170" x2="220" y2="170" stroke="#2f2e2b" stroke-width="2.5" />

        <!-- Shunt R/2 from lower midpoint (145, 170) up to midpoint ref -->
        <line x1="145" y1="170" x2="145" y2="148" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="133" y="125" width="24" height="23" rx="2" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="125" y="139" text-anchor="end" font-family="Inter, sans-serif" font-size="9.5" font-weight="600" fill="#3d5afe">R/2 = ${stage.labels.R_half}</text>
        <line x1="145" y1="125" x2="145" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="145" cy="120" r="3.5" fill="#2f2e2b" />

        <!-- Both branches recombine at 220,120 into op-amp + -->
        <line x1="220" y1="70" x2="220" y2="170" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="220" y1="120" x2="270" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="220" cy="120" r="4" fill="#2f2e2b" />

        <!-- Op-Amp Triangle -->
        <polygon points="270,70 270,170 360,120" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="280" y="115" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="280" y="145" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <!-- Op-Amp Out -->
        <line x1="360" y1="120" x2="470" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="400" cy="120" r="4" fill="#2f2e2b" />
        <circle cx="470" cy="120" r="4.5" fill="#3d5afe" />
        <text x="480" y="125" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">Out</text>

        <!-- Feedback to Twin-T midpoint (145, 120) & inverting input -->
        <line x1="400" y1="120" x2="400" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="330" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="400" y1="235" x2="385" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="357" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_B = ${stage.labels.RB}</text>

        <line x1="330" y1="235" x2="290" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="290" cy="235" r="4" fill="#2f2e2b" />
        <line x1="290" y1="235" x2="290" y2="140" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="290" y1="140" x2="270" y2="140" stroke="#2f2e2b" stroke-width="2.5" />

        <line x1="290" y1="235" x2="240" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <rect x="185" y="223" width="55" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="212" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
        <line x1="185" y1="235" x2="165" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="165" y1="225" x2="165" y2="245" stroke="#2f2e2b" stroke-width="2" />
      `;
    }

    // Wrap in full SVG
    return `
      <div class="circuit-stage-card">
        <div class="stage-header">
          <div class="stage-badge">Aşama ${stageIdx + 1} / ${totalStages}</div>
          <div class="stage-title">${stage.topology}</div>
          <div class="stage-params">f₀: ${(stage.w0 / (2 * Math.PI)).toFixed(1)} Hz | Q: ${stage.Q.toFixed(2)} | Kazanç K: ${stage.K.toFixed(3)}</div>
        </div>
        <div class="stage-svg-wrap">
          <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="stage-svg">
            <defs>
              <linearGradient id="opampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#f7f6f3"/>
              </linearGradient>
            </defs>
            ${svgInner}
          </svg>
        </div>
        <div class="stage-components-table" style="background: #fafaf9; border-top: 1px solid var(--border); padding: 12px 16px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="font-weight: 700; font-size: 13px; color: var(--text-h);">📦 Bileşen Listesi & E24/E12 Standart Seçimi (BOM):</div>
            <div style="font-size: 11px; color: var(--muted);">Standart %1 Metal Film & C0G/NP0 Kılıf Karşılıkları</div>
          </div>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; text-align: left;">
              <thead>
                <tr style="border-bottom: 1.5px solid var(--border); color: var(--muted); font-size: 11.5px;">
                  <th style="padding: 4px 8px;">Bileşen</th>
                  <th style="padding: 4px 8px;">Teorik Hesaplanan</th>
                  <th style="padding: 4px 8px;">Standart Karşılık (E24/E12)</th>
                  <th style="padding: 4px 8px;">Sapma / Hata (%)</th>
                  <th style="padding: 4px 8px;">Önerilen Tolerans & Tip</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(stage.components || {}).map(([key, val]) => {
                  if (typeof val !== 'number' || !isFinite(val) || val <= 0) return '';
                  const isCap = key.startsWith('C');
                  const std = findNearestStandard(val, isCap ? E12 : E24);
                  const err = ((std - val) / val) * 100;
                  const errColor = Math.abs(err) <= 2 ? '#10b981' : Math.abs(err) <= 5 ? '#f59e0b' : '#ef4444';
                  const formattedExact = isCap ? formatCapacitor(val) : formatResistor(val);
                  const formattedStd = isCap ? formatCapacitor(std) : formatResistor(std);
                  const recType = isCap ? '%5 C0G/NP0 Seramik / Film' : '%1 Metal Film 1/4W';
                  return `
                    <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">
                      <td style="padding: 5px 8px; font-weight: 600; color: #3d5afe;">${key}</td>
                      <td style="padding: 5px 8px; font-family: var(--font-mono);">${formattedExact}</td>
                      <td style="padding: 5px 8px; font-weight: 600; font-family: var(--font-mono);">${formattedStd}</td>
                      <td style="padding: 5px 8px; font-weight: 600; color: ${errColor}; font-family: var(--font-mono);">${err >= 0 ? '+' : ''}${err.toFixed(2)}%</td>
                      <td style="padding: 5px 8px; color: var(--muted); font-size: 11px;">${recType}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Render Voltage Divider card if needed
  function renderDividerCard(divider) {
    if (!divider || !divider.needed) return '';

    return `
      <div class="circuit-stage-card divider-card">
        <div class="stage-header">
          <div class="stage-badge" style="background: #e0e7ff; color: #3730a3;">Çıkış Katı</div>
          <div class="stage-title">Kazanç Dengeleme Gerilim Bölücüsü (Gain Adjustment Divider)</div>
          <div class="stage-params">Zayıflatma G_A: ${divider.GA.toFixed(3)} | Hedef Çıkış Direnci: 10 kΩ</div>
        </div>
        <div class="stage-svg-wrap">
          <svg viewBox="0 0 520 180" xmlns="http://www.w3.org/2000/svg" class="stage-svg">
            <line x1="30" y1="80" x2="135" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="30" cy="80" r="4.5" fill="#3d5afe"/>
            <text x="25" y="62" font-family="Inter, sans-serif" font-size="11.5" font-weight="600" fill="#2f2e2b">Son Kat Çıkışı</text>

            <!-- Rx (Series) -->
            <rect x="135" y="68" width="70" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5"/>
            <text x="170" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_x = ${divider.labelRx}</text>

            <line x1="205" y1="80" x2="275" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="275" cy="80" r="4" fill="#2f2e2b"/>

            <!-- Ry to GND -->
            <line x1="275" y1="80" x2="275" y2="105" stroke="#2f2e2b" stroke-width="2.5"/>
            <rect x="263" y="105" width="24" height="45" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5"/>
            <line x1="275" y1="150" x2="275" y2="165" stroke="#2f2e2b" stroke-width="2.5"/>
            <line x1="265" y1="165" x2="285" y2="165" stroke="#2f2e2b" stroke-width="2"/>
            <text x="295" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_y = ${divider.labelRy}</text>

            <!-- Filter Vout -->
            <line x1="275" y1="80" x2="390" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="390" cy="80" r="4.5" fill="#10b981"/>
            <text x="400" y="85" font-family="Inter, sans-serif" font-size="13.5" font-weight="bold" fill="#10b981">Filtre Çıkışı (V_out)</text>
          </svg>
        </div>
      </div>
    `;
  }

  return {
    synthesizeCircuit,
    renderStageSVG,
    renderDividerCard,
    findNearestStandard,
    formatResistor,
    formatCapacitor
  };
})();

if (typeof module !== 'undefined') module.exports = CircuitEngine;
