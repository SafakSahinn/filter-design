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
        <text x="232" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
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
        <text x="232" y="215" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_A = ${stage.labels.RA}</text>
        <line x1="205" y1="235" x2="185" y2="235" stroke="#2f2e2b" stroke-width="2.5" />
        <line x1="185" y1="225" x2="185" y2="245" stroke="#2f2e2b" stroke-width="2" />
      `;
    } else {
      // General Twin-T / Bandpass stage representation
      svgInner = `
        <line x1="30" y1="120" x2="100" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="30" cy="120" r="4.5" fill="#3d5afe" />
        <text x="25" y="105" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">In</text>

        <rect x="100" y="85" width="160" height="70" rx="6" fill="#ffffff" stroke="#3d5afe" stroke-width="2" stroke-dasharray="4" />
        <text x="180" y="115" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#2f2e2b">${stage.topology}</text>
        <text x="180" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#787774">f₀ = ${(stage.w0 / (2 * Math.PI)).toFixed(1)} Hz, Q = ${stage.Q.toFixed(2)}</text>

        <line x1="260" y1="120" x2="310" y2="120" stroke="#2f2e2b" stroke-width="2.5" />
        <polygon points="310,70 310,190 410,130" fill="#fbfbfa" stroke="#2f2e2b" stroke-width="2.5" />
        <text x="320" y="115" font-family="Inter, sans-serif" font-size="16" font-weight="bold" fill="#2f2e2b">+</text>
        <text x="320" y="155" font-family="Inter, sans-serif" font-size="18" font-weight="bold" fill="#2f2e2b">−</text>

        <line x1="410" y1="130" x2="480" y2="130" stroke="#2f2e2b" stroke-width="2.5" />
        <circle cx="480" cy="130" r="4.5" fill="#3d5afe" />
        <text x="490" y="135" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">Out</text>
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
        <div class="stage-components-table">
          <div class="comp-col"><strong>Bileşen Değerleri:</strong></div>
          <div class="comp-grid">
            ${Object.entries(stage.labels).map(([key, val]) => `
              <div class="comp-item"><span class="comp-name">${key}:</span> <span class="comp-val">${val}</span></div>
            `).join('')}
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
          <svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg" class="stage-svg">
            <line x1="30" y1="80" x2="120" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="30" cy="80" r="4.5" fill="#3d5afe"/>
            <text x="25" y="65" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#2f2e2b">Son Kat Çıkışı</text>

            <!-- Rx (Series) -->
            <rect x="120" y="68" width="65" height="24" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5"/>
            <text x="152" y="60" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_x = ${divider.labelRx}</text>

            <line x1="185" y1="80" x2="260" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="260" cy="80" r="4" fill="#2f2e2b"/>

            <!-- Ry to GND -->
            <line x1="260" y1="80" x2="260" y2="105" stroke="#2f2e2b" stroke-width="2.5"/>
            <rect x="248" y="105" width="24" height="45" rx="3" fill="#ffffff" stroke="#2f2e2b" stroke-width="2.5"/>
            <line x1="260" y1="150" x2="260" y2="165" stroke="#2f2e2b" stroke-width="2.5"/>
            <line x1="250" y1="165" x2="270" y2="165" stroke="#2f2e2b" stroke-width="2"/>
            <text x="282" y="130" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#3d5afe">R_y = ${divider.labelRy}</text>

            <!-- Filter Vout -->
            <line x1="260" y1="80" x2="380" y2="80" stroke="#2f2e2b" stroke-width="2.5"/>
            <circle cx="380" cy="80" r="4.5" fill="#10b981"/>
            <text x="390" y="85" font-family="Inter, sans-serif" font-size="14" font-weight="bold" fill="#10b981">Filtre Çıkışı (V_out)</text>
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
