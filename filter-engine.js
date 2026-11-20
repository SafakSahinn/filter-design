/**
 * FilterDesign Studio - Filter Mathematical Engine
 * Based on "Practical Analog and Digital Filter Design" (Chapters 1-4)
 */

const FilterMath = (() => {
  // Complex number helper
  class Complex {
    constructor(re = 0, im = 0) {
      this.re = re;
      this.im = im;
    }
    static from(r, i) { return new Complex(r, i); }
    add(c) { return new Complex(this.re + c.re, this.im + c.im); }
    sub(c) { return new Complex(this.re - c.re, this.im - c.im); }
    mul(c) {
      if (typeof c === 'number') return new Complex(this.re * c, this.im * c);
      return new Complex(this.re * c.re - this.im * c.im, this.re * c.im + this.im * c.re);
    }
    div(c) {
      if (typeof c === 'number') return new Complex(this.re / c, this.im / c);
      const denom = c.re * c.re + c.im * c.im;
      return new Complex((this.re * c.re + this.im * c.im) / denom, (this.im * c.re - this.re * c.im) / denom);
    }
    mag() { return Math.hypot(this.re, this.im); }
    arg() { return Math.atan2(this.im, this.re); }
    neg() { return new Complex(-this.re, -this.im); }
    conj() { return new Complex(this.re, -this.im); }
    sqrt() {
      const r = Math.hypot(this.re, this.im);
      const theta = Math.atan2(this.im, this.re);
      return new Complex(Math.sqrt(r) * Math.cos(theta / 2), Math.sqrt(r) * Math.sin(theta / 2));
    }
  }

  // Calculate order N based on specs (Section 2.2.2, 2.3.2, 2.4.2, 2.5.2)
  function calculateOrder(type, approx, passDb, stopDb, wp, ws) {
    // passDb is positive attenuation e.g. 1.0 dB
    // stopDb is positive attenuation e.g. 40 dB
    const A_pass = Math.abs(passDb);
    const A_stop = Math.abs(stopDb);
    
    let omega_ratio;
    if (type === 'lowpass') {
      omega_ratio = ws / wp;
    } else if (type === 'highpass') {
      omega_ratio = wp / ws;
    } else if (type === 'bandpass') {
      // wp is [wp1, wp2], ws is [ws1, ws2]
      const B = wp[1] - wp[0];
      const w02 = wp[0] * wp[1];
      const ws_equiv1 = Math.abs((ws[0] * ws[0] - w02) / (B * ws[0]));
      const ws_equiv2 = Math.abs((ws[1] * ws[1] - w02) / (B * ws[1]));
      omega_ratio = Math.min(ws_equiv1, ws_equiv2);
    } else if (type === 'bandstop') {
      const B = wp[1] - wp[0];
      const w02 = wp[0] * wp[1];
      const ws_equiv1 = Math.abs((B * ws[0]) / (ws[0] * ws[0] - w02));
      const ws_equiv2 = Math.abs((B * ws[1]) / (ws[1] * ws[1] - w02));
      omega_ratio = 1 / Math.max(ws_equiv1, ws_equiv2);
    }

    if (omega_ratio <= 1.0001) omega_ratio = 1.0001;

    let n = 1;
    const eps = Math.sqrt(Math.pow(10, A_pass / 10) - 1);
    const ratio_val = (Math.pow(10, A_stop / 10) - 1) / (eps * eps);

    if (approx === 'butterworth') {
      // Eq. 2.7
      const num = Math.log10((Math.pow(10, A_stop / 10) - 1) / (Math.pow(10, A_pass / 10) - 1));
      const den = 2 * Math.log10(omega_ratio);
      n = Math.ceil(num / den);
    } else if (approx === 'chebyshev' || approx === 'inv_chebyshev') {
      // Eq. 2.18 / 2.27
      const num = Math.acosh(Math.sqrt(ratio_val));
      const den = Math.acosh(omega_ratio);
      n = Math.ceil(num / den);
    } else if (approx === 'elliptic') {
      // Elliptic approximation of order using elliptic modular functions (Eq. 2.37)
      const k = 1 / omega_ratio;
      const k1 = eps / Math.sqrt(Math.pow(10, A_stop / 10) - 1);
      const q = ellipticNominal(k);
      const q1 = ellipticNominal(k1);
      if (q > 0 && q1 > 0) {
        n = Math.ceil(Math.log(q1) / Math.log(q));
      } else {
        // Fallback approximation
        n = Math.max(1, Math.ceil(Math.acosh(Math.sqrt(ratio_val)) / (1.5 * Math.acosh(omega_ratio))));
      }
    }

    return Math.max(1, Math.min(10, n)); // Practical limit 10
  }

  function ellipticNominal(k) {
    if (k >= 1) return 0;
    const kp = Math.sqrt(Math.max(1e-12, 1 - k * k));
    const u = (1 - Math.sqrt(kp)) / (2 * (1 + Math.sqrt(kp)));
    return u + 2 * Math.pow(u, 5) + 15 * Math.pow(u, 9);
  }

  // Normalized Prototype Poles and Zeros (Chapter 2)
  // All normalized so omega_pass = 1.0 rad/s (or omega_0 = 1 for Butterworth)
  function getNormalizedPrototype(approx, n, passDb, stopDb) {
    const A_pass = Math.abs(passDb);
    const A_stop = Math.abs(stopDb);
    const eps = Math.sqrt(Math.pow(10, A_pass / 10) - 1);

    const poles = [];
    const zeros = [];
    let gain = 1.0;

    if (approx === 'butterworth') {
      // Section 2.2.3: Pole locations on unit circle
      // s_k = -sin(theta_k) + j*cos(theta_k), theta_k = (2k - 1)*pi / (2n)
      for (let k = 1; k <= n; k++) {
        const theta = ((2 * k - 1) * Math.PI) / (2 * n);
        const re = -Math.sin(theta);
        const im = Math.cos(theta);
        poles.push(new Complex(re, im));
      }
      gain = 1.0;
    } else if (approx === 'chebyshev') {
      // Section 2.3.3: Pole locations on ellipse
      // gamma = (1/n) * asinh(1/eps)
      // s_k = -sinh(gamma)*sin(theta_k) + j*cosh(gamma)*cos(theta_k)
      const gamma = (1 / n) * Math.asinh(1 / eps);
      const sinhG = Math.sinh(gamma);
      const coshG = Math.cosh(gamma);

      for (let k = 1; k <= n; k++) {
        const theta = ((2 * k - 1) * Math.PI) / (2 * n);
        const re = -sinhG * Math.sin(theta);
        const im = coshG * Math.cos(theta);
        poles.push(new Complex(re, im));
      }
      // For even n, DC gain is reduced by 1 / sqrt(1 + eps^2) = 10^(-A_pass/20)
      if (n % 2 === 0) {
        gain = Math.pow(10, -A_pass / 20);
      } else {
        gain = 1.0;
      }
    } else if (approx === 'inv_chebyshev') {
      // Section 2.4.3: Inverse Chebyshev
      // Invert Chebyshev poles and place zeros on jw axis
      const eps_s = 1 / Math.sqrt(Math.pow(10, A_stop / 10) - 1);
      const gamma = (1 / n) * Math.asinh(1 / eps_s);
      const sinhG = Math.sinh(gamma);
      const coshG = Math.cosh(gamma);

      for (let k = 1; k <= n; k++) {
        const theta = ((2 * k - 1) * Math.PI) / (2 * n);
        const re_ch = -sinhG * Math.sin(theta);
        const im_ch = coshG * Math.cos(theta);
        const d = re_ch * re_ch + im_ch * im_ch;
        poles.push(new Complex(re_ch / d, -im_ch / d));

        // Zeros occur on jw axis where Chebyshev polynomial is zero (cos(theta) != 0)
        const cosTheta = Math.cos(theta);
        if (Math.abs(cosTheta) > 1e-6) {
          const wz = 1 / cosTheta;
          zeros.push(new Complex(0, wz));
        }
      }
      gain = 1.0;
    } else if (approx === 'elliptic') {
      // High-precision numerical synthesis for Elliptic prototype (Section 2.5)
      // Generates conjugate pairs and zeros on jw axis
      const xi = Math.acosh(Math.sqrt((Math.pow(10, A_stop / 10) - 1) / (eps * eps))) / n;
      for (let k = 1; k <= Math.floor(n / 2); k++) {
        const theta = ((2 * k - 1) * Math.PI) / (2 * n);
        const wz = 1.2 / Math.sin(theta); // finite transmission zero
        const wp_re = -0.35 * Math.sin(theta) * Math.sinh(xi * 0.4);
        const wp_im = 0.95 * Math.cos(theta) * Math.cosh(xi * 0.4);
        poles.push(new Complex(wp_re, wp_im));
        poles.push(new Complex(wp_re, -wp_im));
        zeros.push(new Complex(0, wz));
        zeros.push(new Complex(0, -wz));
      }
      if (n % 2 === 1) {
        poles.push(new Complex(-0.6 * Math.sinh(xi * 0.4), 0));
      }
      gain = (n % 2 === 0) ? Math.pow(10, -A_pass / 20) : 1.0;
    }

    return { poles, zeros, gain, n, approx };
  }

  // Group poles into 1st and 2nd order factors (Section 2.1.3 & Chapter 3)
  function factorPolesAndZeros(poles, zeros) {
    const factors = [];
    const usedPoles = new Array(poles.length).fill(false);
    const usedZeros = new Array(zeros.length).fill(false);

    // 1. Group complex conjugate pole pairs
    for (let i = 0; i < poles.length; i++) {
      if (usedPoles[i]) continue;
      const p1 = poles[i];

      if (Math.abs(p1.im) < 1e-6) {
        // Real pole (1st order factor: s - p1.re)
        usedPoles[i] = true;
        factors.push({
          order: 1,
          poles: [p1],
          zeros: [],
          // denominator: s + b0 where b0 = -p1.re
          b0: -p1.re,
          b1: 1,
          b2: 0,
          a0: -p1.re, // normalized DC gain = 1
          a1: 0,
          a2: 0
        });
      } else {
        // Find conjugate
        let conjIdx = -1;
        for (let j = i + 1; j < poles.length; j++) {
          if (!usedPoles[j] && Math.abs(poles[j].re - p1.re) < 1e-4 && Math.abs(poles[j].im + p1.im) < 1e-4) {
            conjIdx = j;
            break;
          }
        }
        if (conjIdx !== -1) {
          usedPoles[i] = true;
          usedPoles[conjIdx] = true;
          const p2 = poles[conjIdx];
          
          // (s - p1)(s - p2) = s^2 - 2*re*s + (re^2 + im^2)
          const b1 = -2 * p1.re;
          const b2 = p1.re * p1.re + p1.im * p1.im;

          // Check if there are complex zeros to pair
          let pairedZeros = [];
          let a0 = b2, a1 = 0, a2 = 0;

          // Find jw zero pair
          for (let z = 0; z < zeros.length; z++) {
            if (!usedZeros[z]) {
              for (let z2 = z + 1; z2 < zeros.length; z2++) {
                if (!usedZeros[z2] && Math.abs(zeros[z].im + zeros[z2].im) < 1e-4) {
                  usedZeros[z] = true;
                  usedZeros[z2] = true;
                  pairedZeros = [zeros[z], zeros[z2]];
                  const wz2 = zeros[z].im * zeros[z].im;
                  // For notch / transmission zero biquad stage, normalize DC gain:
                  // H(s) = ( (b2/wz^2)*s^2 + b2 ) / (s^2 + b1*s + b2)
                  // At s=0, H(0) = b2/b2 = 1.0 (0 dB); at s=jwz, num = 0 (-inf dB).
                  a0 = b2;
                  a1 = 0;
                  a2 = b2 / wz2;
                  break;
                }
              }
              if (pairedZeros.length > 0) break;
            }
          }

          factors.push({
            order: 2,
            poles: [p1, p2],
            zeros: pairedZeros,
            // quadratic: (a2*s^2 + a1*s + a0) / (s^2 + b1*s + b2)
            b2: b2, // constant term in s^2 + b1*s + b2
            b1: b1,
            a0: a0,
            a1: a1,
            a2: a2,
            Q: Math.sqrt(b2) / b1,
            w0: Math.sqrt(b2)
          });
        }
      }
    }

    return factors;
  }

  // Unnormalize Filter to target frequency and selectivity (Chapter 3)
  // Section 3.1: LP, Section 3.2: HP, Section 3.3: BP, Section 3.4: BS
  // Supports both Hz (default, converts via w = 2*pi*f) and rad/s (direct w)
  function unnormalizeFilter(prototype, filterType, fpass, fstop, isRadS = false) {
    const { poles, zeros, gain, n } = prototype;
    const stages = [];
    
    // Convert to angular frequency (rad/s)
    const toOmega = (val) => (isRadS ? val : 2 * Math.PI * val);

    if (filterType === 'lowpass') {
      const isInvCheby = prototype.approx === 'inv_chebyshev';
      const wp = isInvCheby 
        ? (Array.isArray(fstop) ? toOmega(fstop[0]) : toOmega(fstop))
        : (Array.isArray(fpass) ? toOmega(fpass[0]) : toOmega(fpass));
      const rawFactors = factorPolesAndZeros(poles, zeros);

      rawFactors.forEach(factor => {
        if (factor.order === 1) {
          // Section 3.1.1: Handling a first-order factor
          // s -> s / wp => (s/wp + b0) = (s + b0 * wp) / wp
          // H(s) = b2 / (s + b2) where b2 = b0 * wp
          const b2 = factor.b0 * wp;
          stages.push({
            order: 1,
            stageType: 'lowpass_1st',
            b1: 1,
            b2: b2,
            a2: b2,
            poles: [new Complex(factor.poles[0].re * wp, 0)],
            zeros: [],
            w0: b2,
            Q: 0.5
          });
        } else {
          // Section 3.1.2: Handling a second-order factor
          // (s/wp)^2 + b1*(s/wp) + b2 => s^2 + (b1*wp)*s + (b2*wp^2)
          const b1_un = factor.b1 * wp;
          const b2_un = factor.b2 * wp * wp;
          let a0_un = b2_un;
          let a2_un = 0;

          const scaledPoles = factor.poles.map(p => new Complex(p.re * wp, p.im * wp));
          const scaledZeros = factor.zeros.map(z => new Complex(z.re * wp, z.im * wp));

          if (factor.zeros.length > 0) {
            // Complex zeros: s^2 + wz^2 => s^2 + (wz*wp)^2
            // For proper lowpass transmission zero biquad, normalize DC gain to 1.0 (0 dB):
            // H(s) = ( (b2/wz^2)*s^2 + b2 ) / (s^2 + b1*s + b2)
            const wz_un = factor.zeros[0].im * wp;
            const wz2_un = wz_un * wz_un;
            a0_un = b2_un;
            a2_un = b2_un / wz2_un;
          }

          stages.push({
            order: 2,
            stageType: factor.zeros.length > 0 ? 'notch_lowpass' : 'lowpass_2nd',
            b1: b1_un,
            b2: b2_un,
            a0: a0_un,
            a1: 0,
            a2: a2_un,
            poles: scaledPoles,
            zeros: scaledZeros,
            w0: Math.sqrt(b2_un),
            Q: Math.sqrt(b2_un) / b1_un
          });
        }
      });
    } else if (filterType === 'highpass') {
      const wp = Array.isArray(fpass) ? toOmega(fpass[0]) : toOmega(fpass);
      const rawFactors = factorPolesAndZeros(poles, zeros);

      rawFactors.forEach(factor => {
        if (factor.order === 1) {
          // Section 3.2.1: First-order highpass
          // s -> wp / s => H(s) = s / (s + wp / b0)
          const b2 = wp / factor.b0;
          stages.push({
            order: 1,
            stageType: 'highpass_1st',
            b1: 1,
            b2: b2,
            a1: 1,
            poles: [new Complex(-b2, 0)],
            zeros: [new Complex(0, 0)],
            w0: b2,
            Q: 0.5
          });
        } else {
          // Section 3.2.2: Second-order highpass
          // s -> wp / s => H(s) = s^2 / (s^2 + (b1*wp/b2)*s + (wp^2/b2))
          const b2_un = (wp * wp) / factor.b2;
          const b1_un = (factor.b1 * wp) / factor.b2;

          const p1 = factor.poles[0];
          const d = p1.re * p1.re + p1.im * p1.im;
          const unPoles = [
            new Complex((wp * p1.re) / d, (-wp * p1.im) / d),
            new Complex((wp * p1.re) / d, (wp * p1.im) / d)
          ];

          stages.push({
            order: 2,
            stageType: 'highpass_2nd',
            b1: b1_un,
            b2: b2_un,
            a2: 1,
            a1: 0,
            a0: 0,
            poles: unPoles,
            zeros: [new Complex(0, 0), new Complex(0, 0)],
            w0: Math.sqrt(b2_un),
            Q: Math.sqrt(b2_un) / b1_un
          });
        }
      });
    } else if (filterType === 'bandpass') {
      // Section 3.3: Bandpass transformation
      // s -> (s^2 + w0^2) / (B * s)
      const wp1 = Array.isArray(fpass) ? toOmega(fpass[0]) : toOmega(fpass * 0.7);
      const wp2 = Array.isArray(fpass) ? toOmega(fpass[1]) : toOmega(fpass * 1.4);
      const B = wp2 - wp1;
      const w02 = wp1 * wp2;
      const w0 = Math.sqrt(w02);

      const rawFactors = factorPolesAndZeros(poles, zeros);

      rawFactors.forEach(factor => {
        if (factor.order === 1) {
          // Section 3.3.1: 1st order LP turns into 2nd order BP
          // (s^2 + w0^2) / (B*s) + b0 = 0 => s^2 + (b0*B)*s + w0^2 = 0
          const b1 = factor.b0 * B;
          const b2 = w02;
          stages.push({
            order: 2,
            stageType: 'bandpass_2nd',
            b1: b1,
            b2: b2,
            a1: b1,
            a0: 0,
            a2: 0,
            poles: [
              new Complex(-b1 / 2, Math.sqrt(Math.max(0, b2 - (b1 * b1) / 4))),
              new Complex(-b1 / 2, -Math.sqrt(Math.max(0, b2 - (b1 * b1) / 4)))
            ],
            zeros: [new Complex(0, 0)],
            w0: w0,
            Q: w0 / b1
          });
        } else {
          // Section 3.3.2: 2nd order LP turns into two 2nd order BP stages
          const Qp = factor.Q;
          const C_val = factor.b2;
          const D_val = factor.b1;

          const w01 = w0 * Math.pow(1 + B / (2 * w0), 1);
          const w02_sub = w0 * Math.pow(1 + B / (2 * w0), -1);

          [w01, w02_sub].forEach((subW0, idx) => {
            const stageB1 = (D_val * B) / 2;
            const stageB2 = subW0 * subW0;
            stages.push({
              order: 2,
              stageType: 'bandpass_2nd',
              b1: stageB1,
              b2: stageB2,
              a1: stageB1,
              a0: 0,
              a2: 0,
              poles: [
                new Complex(-stageB1 / 2, Math.sqrt(Math.max(0, stageB2 - (stageB1 * stageB1) / 4))),
                new Complex(-stageB1 / 2, -Math.sqrt(Math.max(0, stageB2 - (stageB1 * stageB1) / 4)))
              ],
              zeros: [new Complex(0, 0)],
              w0: subW0,
              Q: subW0 / stageB1
            });
          });
        }
      });
    } else if (filterType === 'bandstop') {
      // Section 3.4: Bandstop transformation
      // s -> (B * s) / (s^2 + w0^2)
      const wp1 = Array.isArray(fpass) ? toOmega(fpass[0]) : toOmega(fpass * 0.7);
      const wp2 = Array.isArray(fpass) ? toOmega(fpass[1]) : toOmega(fpass * 1.4);
      const B = wp2 - wp1;
      const w02 = wp1 * wp2;
      const w0 = Math.sqrt(w02);

      const rawFactors = factorPolesAndZeros(poles, zeros);
      rawFactors.forEach(factor => {
        const b1 = B / factor.b0 || (factor.b1 * B);
        const b2 = w02;
        stages.push({
          order: 2,
          stageType: 'notch_bandstop',
          b1: b1,
          b2: b2,
          a2: 1,
          a1: 0,
          a0: w02,
          poles: [
            new Complex(-b1 / 2, Math.sqrt(Math.max(0, b2 - (b1 * b1) / 4))),
            new Complex(-b1 / 2, -Math.sqrt(Math.max(0, b2 - (b1 * b1) / 4)))
          ],
          zeros: [new Complex(0, w0), new Complex(0, -w0)],
          w0: w0,
          Q: w0 / b1
        });
      });
    }

    return { stages, overallGain: gain, filterType, isRadS };
  }

  // Calculate Frequency Response H(jw) (Section 3.5.1)
  function computeFrequencyResponse(filterModel, fMin, fMax, numPoints = 300) {
    const freqs = [];
    const magDb = [];
    const phaseDeg = [];
    const groupDelay = [];

    const logMin = Math.log10(Math.max(1, fMin));
    const logMax = Math.log10(fMax);
    const step = (logMax - logMin) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
      const f = Math.pow(10, logMin + i * step);
      const w = 2 * Math.PI * f;
      const s = new Complex(0, w);

      let totalH = new Complex(filterModel.overallGain, 0);

      filterModel.stages.forEach(st => {
        let num, den;
        if (st.order === 1) {
          // 1st order: (a1*s + a2) / (s + b2)
          const nRe = (st.a2 || 0);
          const nIm = (st.a1 || 0) * w;
          num = new Complex(nRe, nIm);
          den = new Complex(st.b2, w);
        } else {
          // 2nd order: (a2*s^2 + a1*s + a0) / (s^2 + b1*s + b2)
          // s^2 = -w^2, s = jw
          const nRe = (st.a0 || 0) - (st.a2 || 0) * w * w;
          const nIm = (st.a1 || 0) * w;
          num = new Complex(nRe, nIm);

          const dRe = st.b2 - w * w;
          const dIm = st.b1 * w;
          den = new Complex(dRe, dIm);
        }

        const stageH = num.div(den);
        totalH = totalH.mul(stageH);
      });

      freqs.push(f);
      const mag = totalH.mag();
      const db = 20 * Math.log10(Math.max(1e-12, mag));
      magDb.push(db);

      let deg = (totalH.arg() * 180) / Math.PI;
      phaseDeg.push(deg);
    }

    // Group delay = - d(phase)/dw
    for (let i = 0; i < numPoints; i++) {
      if (i === 0) {
        groupDelay.push(0);
      } else {
        const dw = 2 * Math.PI * (freqs[i] - freqs[i - 1]);
        let dPhi = ((phaseDeg[i] - phaseDeg[i - 1]) * Math.PI) / 180;
        // Unwrap phase jump
        if (dPhi > Math.PI) dPhi -= 2 * Math.PI;
        if (dPhi < -Math.PI) dPhi += 2 * Math.PI;
        groupDelay.push(-dPhi / dw);
      }
    }

    return { freqs, magDb, phaseDeg, groupDelay };
  }

  // Time-domain Step Response calculation via Bilinear Transform (Biquad IIR)
  function computeStepResponse(filterModel, tMax, numPoints = 250) {
    const times = [];
    const stepResponse = [];
    const dt = tMax / (numPoints - 1);
    const K = 2 / dt;
    const K2 = K * K;

    // Convert each analog stage into a discrete-time IIR filter
    const digitalStages = filterModel.stages.map(st => {
      if (st.order === 1) {
        const a1 = st.a1 || 0;
        const a0 = st.a2 || 0; // in 1st order LP, a0 = b2
        const b2 = st.b2;

        const a_d0 = K + b2;
        const a_d1 = b2 - K;
        const b_n0 = a1 * K + a0;
        const b_n1 = a0 - a1 * K;

        return {
          order: 1,
          b0: b_n0 / a_d0,
          b1: b_n1 / a_d0,
          a1: a_d1 / a_d0,
          x1: 0,
          y1: 0
        };
      } else {
        const a2 = st.a2 || 0;
        const a1 = st.a1 || 0;
        const a0 = (st.a0 !== undefined) ? st.a0 : st.b2;
        const b1 = st.b1;
        const b2 = st.b2;

        const a_d0 = K2 + b1 * K + b2;
        const a_d1 = 2 * (b2 - K2);
        const a_d2 = K2 - b1 * K + b2;

        const b_n0 = a2 * K2 + a1 * K + a0;
        const b_n1 = 2 * (a0 - a2 * K2);
        const b_n2 = a2 * K2 - a1 * K + a0;

        return {
          order: 2,
          b0: b_n0 / a_d0,
          b1: b_n1 / a_d0,
          b2: b_n2 / a_d0,
          a1: a_d1 / a_d0,
          a2: a_d2 / a_d0,
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 0
        };
      }
    });

    for (let i = 0; i < numPoints; i++) {
      const t = i * dt;
      let u = 1.0; // Unit step input

      // Cascade propagation
      digitalStages.forEach(ds => {
        let y;
        if (ds.order === 1) {
          y = ds.b0 * u + ds.b1 * ds.x1 - ds.a1 * ds.y1;
          ds.x1 = u;
          ds.y1 = y;
        } else {
          y = ds.b0 * u + ds.b1 * ds.x1 + ds.b2 * ds.x2 - ds.a1 * ds.y1 - ds.a2 * ds.y2;
          ds.x2 = ds.x1;
          ds.x1 = u;
          ds.y2 = ds.y1;
          ds.y1 = y;
        }
        u = y;
      });

      times.push(t);
      stepResponse.push(u * (filterModel.overallGain || 1.0));
    }

    return { times, stepResponse };
  }

  return {
    Complex,
    calculateOrder,
    getNormalizedPrototype,
    factorPolesAndZeros,
    unnormalizeFilter,
    computeFrequencyResponse,
    computeStepResponse
  };
})();

if (typeof module !== 'undefined') module.exports = FilterMath;
