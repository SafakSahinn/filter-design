/**
 * FilterDesign Studio - MATLAB & SPICE Code Generator
 * Generates ready-to-run MATLAB/Octave scripts and SPICE Netlists
 */

const MatlabEngine = (() => {
  function generateMatlabCode(filterConfig, filterModel, circuitModel) {
    const { approx, type, fpass, fstop, passDb, stopDb, manualOrder, order } = filterConfig;
    const dateStr = new Date().toLocaleDateString('tr-TR');

    let fp1 = Array.isArray(fpass) ? fpass[0] : fpass;
    let fp2 = Array.isArray(fpass) ? fpass[1] : fpass * 1.5;
    let fs1 = Array.isArray(fstop) ? fstop[0] : fstop;
    let fs2 = Array.isArray(fstop) ? fstop[1] : fstop * 1.5;

    let approxName = {
      butterworth: 'Butterworth (Maksimum Düz)',
      chebyshev: 'Chebyshev Tip I (Geçirme Bandı Dalgalı)',
      inv_chebyshev: 'Ters Chebyshev / Tip II (Durdurma Bandı Dalgalı)',
      elliptic: 'Eliptik / Cauer (Eşit Dalgalı)',
      bessel: 'Bessel-Thomson (Maksimum Düz Grup Gecikmesi)'
    }[approx] || approx;

    let typeName = {
      lowpass: 'Alçak Geçiren (Lowpass)',
      highpass: 'Yüksek Geçiren (Highpass)',
      bandpass: 'Bant Geçiren (Bandpass)',
      bandstop: 'Bant Söndüren (Bandstop / Notch)'
    }[type] || type;

    let unit = filterConfig.unit || 'Hz';
    let isRadS = unit === 'rad/s';

    // Build MATLAB script
    let code = `%% =========================================================================
%% Filtre Tasarımı ve Analiz Scripti (MATLAB / GNU Octave)
%% Kitap Referansı: "Practical Analog and Digital Filter Design" (Bölüm 1 - 4)
%% Üretilme Tarihi: ${dateStr}
%% Filtre Tipi: ${typeName}
%% Yaklaşım Türü: ${approxName}
%% Frekans Giriş Birimi: ${unit}
%% =========================================================================

clear; clc; close all;

%% 1. Tasarım Spesifikasyonları ve 2*pi*f Frekans Dönüşümü
A_pass = ${passDb};        % Geçirme bandı maksimum zayıflaması (dB)
A_stop = ${stopDb};       % Durdurma bandı minimum zayıflaması (dB)
`;

    if (type === 'lowpass' || type === 'highpass') {
      if (isRadS) {
        code += `w_pass = ${fp1};       % Geçirme sınır açısal frekansı (rad/s)\n`;
        code += `w_stop = ${fs1};       % Durdurma sınır açısal frekansı (rad/s)\n`;
        code += `f_pass = w_pass / (2 * pi); % Hz (f = w / 2pi dönüşümü)\n`;
        code += `f_stop = w_stop / (2 * pi); % Hz\n\n`;
      } else {
        code += `f_pass = ${fp1};       % Geçirme sınır frekansı (Hz)\n`;
        code += `f_stop = ${fs1};       % Durdurma sınır frekansı (Hz)\n`;
        code += `w_pass = 2 * pi * f_pass; % rad/s (w = 2*pi*f dönüşümü)\n`;
        code += `w_stop = 2 * pi * f_stop; % rad/s\n\n`;
      }
    } else {
      if (isRadS) {
        code += `w_pass = [${fp1}, ${fp2}]; % Geçirme sınır açısal frekansları [w1, w2] (rad/s)\n`;
        code += `w_stop = [${fs1}, ${fs2}]; % Durdurma sınır açısal frekansları [w1, w2] (rad/s)\n`;
        code += `f_pass = w_pass / (2 * pi);     % Hz\n`;
        code += `f_stop = w_stop / (2 * pi);     % Hz\n\n`;
      } else {
        code += `f_pass = [${fp1}, ${fp2}]; % Geçirme sınır frekansları [f1, f2] (Hz)\n`;
        code += `f_stop = [${fs1}, ${fs2}]; % Durdurma sınır frekansları [f1, f2] (Hz)\n`;
        code += `w_pass = 2 * pi * f_pass;     % rad/s (w = 2*pi*f dönüşümü)\n`;
        code += `w_stop = 2 * pi * f_stop;     % rad/s\n\n`;
      }
    }

    code += `%% 2. Filtre Derecesi ve Transfer Fonksiyonu Hesabı\n`;
    if (approx === 'butterworth') {
      code += `% Butterworth analog filtre tasarımı (Bölüm 2.2 ve 3)\n`;
      code += `[N, Wn] = buttord(w_pass, w_stop, A_pass, A_stop, 's');\n`;
      if (manualOrder) {
        code += `N = ${order}; % Kullanıcı tanımlı derece\n`;
      }
      code += `[num, den] = butter(N, Wn, '${type === 'lowpass' ? 'low' : type === 'highpass' ? 'high' : type === 'bandpass' ? 'bandpass' : 'stop'}', 's');\n`;
    } else if (approx === 'chebyshev') {
      code += `% Chebyshev Tip I analog filtre tasarımı (Bölüm 2.3 ve 3)\n`;
      code += `[N, Wn] = cheb1ord(w_pass, w_stop, A_pass, A_stop, 's');\n`;
      if (manualOrder) {
        code += `N = ${order}; % Kullanıcı tanımlı derece\n`;
      }
      code += `[num, den] = cheby1(N, A_pass, Wn, '${type === 'lowpass' ? 'low' : type === 'highpass' ? 'high' : type === 'bandpass' ? 'bandpass' : 'stop'}', 's');\n`;
    } else if (approx === 'inv_chebyshev') {
      code += `% Ters Chebyshev (Tip II) analog filtre tasarımı (Bölüm 2.4 ve 3)\n`;
      code += `[N, Wn] = cheb2ord(w_pass, w_stop, A_pass, A_stop, 's');\n`;
      if (manualOrder) {
        code += `N = ${order}; % Kullanıcı tanımlı derece\n`;
      }
      code += `[num, den] = cheby2(N, A_stop, Wn, '${type === 'lowpass' ? 'low' : type === 'highpass' ? 'high' : type === 'bandpass' ? 'bandpass' : 'stop'}', 's');\n`;
    } else if (approx === 'elliptic') {
      code += `% Eliptik (Cauer) analog filtre tasarımı (Bölüm 2.5 ve 3)\n`;
      code += `[N, Wn] = ellipord(w_pass, w_stop, A_pass, A_stop, 's');\n`;
      if (manualOrder) {
        code += `N = ${order}; % Kullanıcı tanımlı derece\n`;
      }
      code += `[num, den] = ellip(N, A_pass, A_stop, Wn, '${type === 'lowpass' ? 'low' : type === 'highpass' ? 'high' : type === 'bandpass' ? 'bandpass' : 'stop'}', 's');\n`;
    } else if (approx === 'bessel') {
      code += `% Bessel (Thomson) analog filtre tasarımı (Maksimum Düz Grup Gecikmesi)\n`;
      code += `N = ${order || 4}; % Filtre derecesi\n`;
      code += `[num, den] = besself(N, w_pass);\n`;
    }

    code += `
H = tf(num, den);
fprintf('--- Filtre Özeti ---\\n');
fprintf('Hesaplanan Filtre Derecesi N: %d\\n', N);
disp('H(s) Transfer Fonksiyonu:');
disp(H);

%% 3. İkinci Derece Faktörlere Ayrıştırma (Second-Order Sections - SOS)
[z, p, k] = tf2zp(num, den);
[sos, g] = zp2sos(z, p, k);
disp('İkinci Derece Biquad Katsayıları (SOS Matrisi):');
disp(sos);

%% 4. Frekans Yanıtı (Bode Genlik ve Faz Çizimi)
f = logspace(log10(${Math.max(1, fp1 / 10)}), log10(${Math.max(10, (fs2 || fs1) * 10)}), 500);
w = 2 * pi * f;
[mag, phase] = freqs(num, den, w);
mag_db = 20 * log10(abs(mag));

figure('Color', [1 1 1], 'Position', [100, 100, 950, 700]);

% Büyüklük Yanıtı
subplot(2, 2, [1, 2]);
semilogx(f, mag_db, 'LineWidth', 2.2, 'Color', [0.24 0.35 0.99]);
grid on; hold on;
yline(-A_pass, '--r', sprintf('Geçirme Bandı Sınırı (-%.1f dB)', A_pass), 'LineWidth', 1.2);
yline(-A_stop, '--k', sprintf('Durdurma Bandı Sınırı (-%.1f dB)', A_stop), 'LineWidth', 1.2);
xlabel('Frekans (Hz)', 'FontSize', 11);
ylabel('Genlik (dB)', 'FontSize', 11);
title(sprintf('%s Filtresi Genlik Yanıtı (Derece = %d)', '${approxName}', N), 'FontSize', 13);
ylim([min(-80, -A_stop - 20) 5]);

% Faz Yanıtı
subplot(2, 2, 3);
semilogx(f, unwrap(angle(mag)) * 180 / pi, 'LineWidth', 1.8, 'Color', [0.06 0.62 0.44]);
grid on;
xlabel('Frekans (Hz)', 'FontSize', 11);
ylabel('Faz (Derece)', 'FontSize', 11);
title('Faz Yanıtı \\angle H(j\\omega)', 'FontSize', 12);

% Kutup-Sıfır Düzlemi (s-Düzlemi)
subplot(2, 2, 4);
plot(real(p), imag(p), 'rx', 'MarkerSize', 9, 'LineWidth', 2.2); hold on;
if ~isempty(z)
    plot(real(z), imag(z), 'bo', 'MarkerSize', 8, 'LineWidth', 1.8);
end
grid on; xline(0, 'k:'); yline(0, 'k:');
xlabel('Re (\\sigma)', 'FontSize', 11);
ylabel('Im (j\\omega)', 'FontSize', 11);
title('s-Düzlemi Kutuplar (x) ve Sıfırlar (o)', 'FontSize', 12);
legend('Kutuplar (Poles)', 'Sıfırlar (Zeros)', 'Location', 'best');

%% 5. Bölüm 4: Aktif Devre Bileşen Değerleri
fprintf('\\n--- Bölüm 4: Op-Amp Aktif Filtre Bileşenleri ---\\n');
`;

    circuitModel.stages.forEach((st, idx) => {
      code += `fprintf('\\nAşama %d: %s\\n', ${idx + 1}, '${st.topology}');\n`;
      Object.entries(st.labels).forEach(([name, val]) => {
        code += `fprintf('  %s: %s\\n', '${name}', '${val}');\n`;
      });
    });

    if (circuitModel.divider && circuitModel.divider.needed) {
      code += `fprintf('\\nÇıkış Kazanç Dengeleme Gerilim Bölücüsü:\\n');\n`;
      code += `fprintf('  Rx: %s, Ry: %s (Toplam Zayıflatma: %.3f)\\n', '${circuitModel.divider.labelRx}', '${circuitModel.divider.labelRy}', ${circuitModel.divider.GA});\n`;
    }

    code += `
%% 6. Birim Basamak Yanıtı (Step Response)
figure('Color', [1 1 1]);
step(H);
grid on;
title('Filtrenin Birim Basamak Yanıtı h(t)');
xlabel('Zaman (s)');
ylabel('Genlik');
`;

    return code;
  }

  // Generate SPICE (.cir) netlist for circuit simulation
  function generateSpiceNetlist(filterConfig, circuitModel) {
    let spice = `* =========================================================================\n`;
    spice += `* SPICE Netlist - ${filterConfig.approx} ${filterConfig.type} Active Filter\n`;
    spice += `* Generated by FilterDesign Studio (Based on Les Thede Ch. 4)\n`;
    spice += `* =========================================================================\n\n`;
    spice += `* AC Kaynağı (1V Giriş)\n`;
    spice += `Vin in 0 AC 1.0\n\n`;

    let prevNode = 'in';

    circuitModel.stages.forEach((st, idx) => {
      const num = idx + 1;
      const outNode = `out_${num}`;
      spice += `* --- Aşama ${num}: ${st.topology} ---\n`;

      if (st.type === 'lowpass_1st') {
        spice += `R${num}_1 ${prevNode} n${num}_1 ${st.components.R1.toExponential(3)}\n`;
        spice += `C${num}_1 n${num}_1 0 ${st.components.C1.toExponential(3)}\n`;
        spice += `E${num}_amp ${outNode} 0 n${num}_1 0 1.0\n\n`;
      } else if (st.type === 'lowpass_2nd') {
        spice += `R${num}_1 ${prevNode} n${num}_1 ${st.components.R1.toExponential(3)}\n`;
        spice += `R${num}_2 n${num}_1 n${num}_2 ${st.components.R2.toExponential(3)}\n`;
        spice += `C${num}_1 n${num}_1 ${outNode} ${st.components.C1.toExponential(3)}\n`;
        spice += `C${num}_2 n${num}_2 0 ${st.components.C2.toExponential(3)}\n`;
        spice += `* Op-Amp (Kazanç K = ${st.K.toFixed(3)})\n`;
        spice += `E${num}_amp ${outNode} 0 n${num}_2 0 ${st.K.toFixed(4)}\n\n`;
      } else if (st.type === 'highpass_2nd') {
        spice += `C${num}_1 ${prevNode} n${num}_1 ${st.components.C1.toExponential(3)}\n`;
        spice += `C${num}_2 n${num}_1 n${num}_2 ${st.components.C2.toExponential(3)}\n`;
        spice += `R${num}_1 n${num}_1 ${outNode} ${st.components.R1.toExponential(3)}\n`;
        spice += `R${num}_2 n${num}_2 0 ${st.components.R2.toExponential(3)}\n`;
        spice += `E${num}_amp ${outNode} 0 n${num}_2 0 ${st.K.toFixed(4)}\n\n`;
      } else {
        spice += `* ${st.topology} Stage\n`;
        spice += `E${num}_amp ${outNode} 0 ${prevNode} 0 ${st.K.toFixed(4)}\n\n`;
      }
      prevNode = outNode;
    });

    if (circuitModel.divider && circuitModel.divider.needed) {
      spice += `* --- Çıkış Kazanç Dengeleme Bölücüsü ---\n`;
      spice += `Rx ${prevNode} final_out ${circuitModel.divider.Rx.toExponential(3)}\n`;
      spice += `Ry final_out 0 ${circuitModel.divider.Ry.toExponential(3)}\n`;
      spice += `.AC DEC 50 1 1000000\n`;
      spice += `.PRINT AC VDB(final_out) VP(final_out)\n`;
    } else {
      spice += `.AC DEC 50 1 1000000\n`;
      spice += `.PRINT AC VDB(${prevNode}) VP(${prevNode})\n`;
    }

    spice += `.END\n`;
    return spice;
  }

  // Generate LTspice Schematic (.asc) file
  function generateLtspiceAsc(filterConfig, circuitModel) {
    const { type, approx, fpass } = filterConfig;
    const fp = Array.isArray(fpass) ? fpass[0] : fpass;
    const fStopSim = Math.max(1e5, fp * 20);

    let asc = `Version 4\n`;
    asc += `SHEET 1 1280 880\n`;

    // Input AC voltage source
    asc += `WIRE 96 160 32 160\n`;
    asc += `WIRE 32 160 32 208\n`;
    asc += `WIRE 32 288 32 320\n`;
    asc += `FLAG 32 320 0\n`;
    asc += `SYMBOL voltage 32 192 R0\n`;
    asc += `WINDOW 123 0 0 Left 2\n`;
    asc += `WINDOW 39 0 0 Left 2\n`;
    asc += `SYMATTR InstName V1\n`;
    asc += `SYMATTR Value SINE(0 1 ${fp})\n`;
    asc += `SYMATTR Value2 AC 1.0\n`;

    let curX = 96;
    let prevOutNode = 'IN';
    asc += `FLAG 96 160 IN\n`;

    circuitModel.stages.forEach((st, idx) => {
      const num = idx + 1;
      const xBase = 160 + (idx * 320);

      asc += `TEXT ${xBase} 64 Left 2 ; Stage ${num}: ${st.topology}\n`;

      if (st.type === 'lowpass_1st') {
        const rVal = st.components.R1.toExponential(3);
        const cVal = st.components.C1.toExponential(3);
        asc += `WIRE ${xBase + 64} 160 ${xBase} 160\n`;
        asc += `SYMBOL res ${xBase} 144 R90\n`;
        asc += `SYMATTR InstName R${num}_1\n`;
        asc += `SYMATTR Value ${rVal}\n`;
        asc += `WIRE ${xBase + 64} 160 ${xBase + 64} 224\n`;
        asc += `SYMBOL cap ${xBase + 64} 224 R0\n`;
        asc += `SYMATTR InstName C${num}_1\n`;
        asc += `SYMATTR Value ${cVal}\n`;
        asc += `FLAG ${xBase + 64} 288 0\n`;
        asc += `WIRE ${xBase + 128} 160 ${xBase + 64} 160\n`;
        asc += `FLAG ${xBase + 128} 160 OUT_${num}\n`;
      } else if (st.type === 'lowpass_2nd') {
        const r1Val = st.components.R1.toExponential(3);
        const r2Val = st.components.R2.toExponential(3);
        const c1Val = st.components.C1.toExponential(3);
        const c2Val = st.components.C2.toExponential(3);
        asc += `WIRE ${xBase + 64} 160 ${xBase} 160\n`;
        asc += `SYMBOL res ${xBase} 144 R90\n`;
        asc += `SYMATTR InstName R${num}_1\n`;
        asc += `SYMATTR Value ${r1Val}\n`;
        asc += `WIRE ${xBase + 144} 160 ${xBase + 64} 160\n`;
        asc += `SYMBOL res ${xBase + 80} 144 R90\n`;
        asc += `SYMATTR InstName R${num}_2\n`;
        asc += `SYMATTR Value ${r2Val}\n`;
        asc += `WIRE ${xBase + 144} 160 ${xBase + 144} 224\n`;
        asc += `SYMBOL cap ${xBase + 144} 224 R0\n`;
        asc += `SYMATTR InstName C${num}_2\n`;
        asc += `SYMATTR Value ${c2Val}\n`;
        asc += `FLAG ${xBase + 144} 288 0\n`;
        asc += `WIRE ${xBase + 64} 160 ${xBase + 64} 96\n`;
        asc += `WIRE ${xBase + 64} 96 ${xBase + 176} 96\n`;
        asc += `SYMBOL cap ${xBase + 176} 80 R90\n`;
        asc += `SYMATTR InstName C${num}_1\n`;
        asc += `SYMATTR Value ${c1Val}\n`;
        asc += `WIRE ${xBase + 240} 96 ${xBase + 240} 160\n`;
        asc += `WIRE ${xBase + 240} 160 ${xBase + 208} 160\n`;
        asc += `FLAG ${xBase + 240} 160 OUT_${num}\n`;
      } else {
        asc += `WIRE ${xBase + 128} 160 ${xBase} 160\n`;
        asc += `FLAG ${xBase + 128} 160 OUT_${num}\n`;
      }
    });

    const finalOut = `OUT_${circuitModel.stages.length}`;
    asc += `TEXT 32 400 Left 2 !.ac dec 100 1 ${fStopSim}\n`;
    asc += `TEXT 32 440 Left 2 ; FilterDesign Studio - ${approx} ${type}\n`;
    return asc;
  }

  // Helper to trigger browser file download
  function downloadTextFile(filename, content, mime = 'text/plain;charset=utf-8') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return {
    generateMatlabCode,
    generateSpiceNetlist,
    generateLtspiceAsc,
    downloadTextFile
  };
})();

if (typeof module !== 'undefined') module.exports = MatlabEngine;
