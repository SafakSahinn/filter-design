/**
 * FilterDesign Studio - Interactive Exam Simulator & Quiz Module (Chapters 1 - 4)
 * Based on "Practical Analog and Digital Filter Design" by Les Thede
 * Allows students to test their filter design knowledge with instant step-by-step solutions
 */

const QuizModal = (() => {
  let overlay = null;
  let userAnswers = {};
  let currentQuestionIdx = 0;

  const QUESTIONS = [
    {
      id: 1,
      ch: 'Bölüm 2 & 3',
      title: 'Butterworth Filtre Derecesi Hesabı',
      text: '$a_{\\text{pass}} = -1.0\\text{ dB}$, $a_{\\text{stop}} = -30.0\\text{ dB}$, $f_{\\text{pass}} = 1000\\text{ Hz}$, $f_{\\text{stop}} = 2500\\text{ Hz}$ spesifikasyonlarını sağlayan minimum Butterworth analog filtre derecesi ($n$) kaçtır?',
      options: [
        { id: 'A', text: '$n = 3$', correct: false },
        { id: 'B', text: '$n = 4$', correct: false },
        { id: 'C', text: '$n = 5$', correct: true },
        { id: 'D', text: '$n = 6$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Frekans oranı: $r = \\omega_{\\text{stop}} / \\omega_{\\text{pass}} = 2500 / 1000 = 2.5$<br>
        2. Pay payda logaritma terimleri: $10^{-0.1(-30)} - 1 = 10^3 - 1 = 999$, $10^{-0.1(-1)} - 1 = 10^{0.1} - 1 = 0.2589$<br>
        3. Denklem 2.8: $n_B \\ge \\frac{\\log_{10}(999 / 0.2589)}{2 \\log_{10}(2.5)} = \\frac{\\log_{10}(3858.26)}{2 \\times 0.39794} = \\frac{3.5864}{0.79588} \\approx 4.506$<br>
        4. Derece tam sayı olmak zorunda olduğundan bir üste yuvarlanır: $n = \\lceil 4.506 \\rceil = 5$.
      `
    },
    {
      id: 2,
      ch: 'Bölüm 4',
      title: 'Equal-Component Sallen-Key Kararlılık Şartı',
      text: 'Eşit elemanlı ($C_1=C_2=C, R_1=R_2=R$) Sallen-Key alçak geçiren katında op-amp kazancı $K$ ile kalite faktörü $Q$ arasındaki ilişki $K = 3 - 1/Q$ olarak verilir. Devrenin osilatöre dönüşmeden kararlı kalması için $K$ kazancı hangi kritik değerin kesinlikle altında kalmalıdır?',
      options: [
        { id: 'A', text: '$K < 1.0$', correct: false },
        { id: 'B', text: '$K < 2.0$', correct: false },
        { id: 'C', text: '$K < 3.0$', correct: true },
        { id: 'D', text: '$K < 4.0$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Devre transfer fonksiyonunda paydadaki $s$ katsayısı $\\frac{3 - K}{RC}$ şeklindedir.<br>
        2. Sönüm oranı $\\zeta = \\frac{3 - K}{2} = \\frac{1}{2Q}$'dur.<br>
        3. Eğer $K \\ge 3$ olursa paydadaki $s$ katsayısı sıfır veya negatif olur; bu da kutupların $s$-düzleminin sağ yarı düzlemine (RHP) veya tam $j\\omega$ sanal eksenine geçmesine yol açar.<br>
        4. Bu durumda devre filtre olmaktan çıkar ve sinüzoidal osilatöre dönüşür. Dolayısıyla $Q \\to \\infty$ olsa dahi $K < 3$ kalmalıdır.
      `
    },
    {
      id: 3,
      ch: 'Bölüm 4',
      title: 'Sallen-Key Direnç Hesabı',
      text: 'Bir biquad katında hedef transfer fonksiyonunun payda sabit terimi $b_2 = 1.0 \\times 10^8\\text{ rad}^2/\\text{s}^2$ olarak verilmiştir. Tasarımda baz kondansatör $C = 10\\text{ nF}$ seçilirse, eşit elemanlı Sallen-Key direnci $R = R_1 = R_2$ kaç $\\text{k}\\Omega$ olmalıdır?',
      options: [
        { id: 'A', text: '$R = 5.0\\text{ k}\\Omega$', correct: false },
        { id: 'B', text: '$R = 10.0\\text{ k}\\Omega$', correct: true },
        { id: 'C', text: '$R = 15.9\\text{ k}\\Omega$', correct: false },
        { id: 'D', text: '$R = 20.0\\text{ k}\\Omega$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Kesim açısal frekansı: $\\omega_0 = \\sqrt{b_2} = \\sqrt{1.0 \\times 10^8} = 10^4\\text{ rad/s}$ ($f_0 \\approx 1591.5\\text{ Hz}$).<br>
        2. Denklem 4.10: $R = \\frac{1}{C \\sqrt{b_2}} = \\frac{1}{10 \\times 10^{-9} \\times 10^4} = \\frac{1}{10^{-4}} = 10000\\,\\Omega = 10\\text{ k}\\Omega$.
      `
    },
    {
      id: 4,
      ch: 'Bölüm 3',
      title: 'Frekans Dönüşümü (LP to HP)',
      text: 'Normalize alçak geçiren prototip transfer fonksiyonu $H(S)$\'den gerçek açısal kesim frekansı $\\omega_0$ olan bir yüksek geçiren (HP) filtreye geçmek için hangi Laplace frekans dönüşüm operatörü uygulanır?',
      options: [
        { id: 'A', text: '$S = \\frac{s}{\\omega_0}$', correct: false },
        { id: 'B', text: '$S = \\frac{\\omega_0}{s}$', correct: true },
        { id: 'C', text: '$S = \\frac{s^2 + \\omega_0^2}{BW \\cdot s}$', correct: false },
        { id: 'D', text: '$S = \\frac{BW \\cdot s}{s^2 + \\omega_0^2}$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Alçak geçiren filtrede $S = 0$ (DC) geçirme, $S \\to \\infty$ durdurma bölgesidir.<br>
        2. Yüksek geçiren filtrede ise $s = 0$ noktasında tam zayıflama (sıfır kazanç), $s \\to \\infty$ noktasında ise $0\\text{ dB}$ tam geçiş istenir.<br>
        3. Bu spektral ters çevirmeyi $S = \\frac{\\omega_0}{s}$ operatörü sağlar. Böylece normalize düzlemdeki $S=0$, gerçek düzlemde $s=\\infty$\'a karşılık gelir.
      `
    },
    {
      id: 5,
      ch: 'Bölüm 4',
      title: 'Twin-Tee Çentik Devresi Rezonans Frekansı',
      text: '50 Hz şebeke vızıltısını bastırmak için tasarlanan simetrik bir Twin-Tee çentik devresinde köprü kondansatörleri $C = 100\\text{ nF}$ seçilmiştir. Çentik frekansının tam $f_0 = 50\\text{ Hz}$ olması için köprü direnci $R$ yaklaşık kaç $\\text{k}\\Omega$ olmalıdır?',
      options: [
        { id: 'A', text: '$R \\approx 15.9\\text{ k}\\Omega$', correct: false },
        { id: 'B', text: '$R \\approx 31.8\\text{ k}\\Omega$', correct: true },
        { id: 'C', text: '$R \\approx 63.7\\text{ k}\\Omega$', correct: false },
        { id: 'D', text: '$R \\approx 100.0\\text{ k}\\Omega$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Twin-Tee rezonans bağıntısı: $f_0 = \\frac{1}{2\\pi R C} \\implies R = \\frac{1}{2\\pi f_0 C}$.<br>
        2. Değerleri yerine koyalım: $R = \\frac{1}{2 \\times 3.14159 \\times 50 \\times 100 \\times 10^{-9}} = \\frac{1}{3.14159 \\times 10^{-5}} \\approx 31830.9\\,\\Omega \\approx 31.83\\text{ k}\\Omega$.<br>
        3. Orta bacak direnci ise simetri gereği $R/2 \\approx 15.9\\text{ k}\\Omega$ olacaktır.
      `
    },
    {
      id: 6,
      ch: 'Bölüm 4',
      title: 'MFB Bant Geçiren Tasarım Kısıtı',
      text: 'Çoklu geribeslemeli (Multiple Feedback - MFB) eviren bant geçiren filtre devresinde, pozitif geri besleme direncinin ($R_2$) fiziksel olarak pozitif bir gerçek sayı çıkabilmesi için katın kalite faktörü $Q$ ile merkez kazancı $G_0$ arasında hangi şart sağlanmalıdır?',
      options: [
        { id: 'A', text: '$2 Q^2 > G_0$', correct: true },
        { id: 'B', text: '$Q^2 < 2 G_0$', correct: false },
        { id: 'C', text: '$G_0 > 2 Q$', correct: false },
        { id: 'D', text: '$Q < 1.0$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Kitap Bölüm 4.4, Denklem 4.31: $R_2 = \\frac{Q}{(2 Q^2 - G_0) \\cdot \\omega_0 \\cdot C}$<br>
        2. Bu ifadede paydanın pozitif olabilmesi için parantez içinin sıfırdan büyük olması zorunludur: $2 Q^2 - G_0 > 0 \\implies 2 Q^2 > G_0$.<br>
        3. Eğer $2 Q^2 \\le G_0$ seçilirse $R_2$ direnci negatif veya sonsuz çıkar; bu da pasif dirençlerle devrenin kurulamayacağı anlamına gelir.
      `
    },
    {
      id: 7,
      ch: 'Bölüm 2',
      title: 'Chebyshev Dalgalanma Faktörü (ε)',
      text: 'Geçirme bandı zayıflaması $a_{\\text{pass}} = -3.0103\\text{ dB}$ (yarı güç - 3 dB kesim) olan bir Chebyshev Tip I filtresinde dalgalanma faktörü $\\epsilon$ kaçtır?',
      options: [
        { id: 'A', text: '$\\epsilon = 0.500$', correct: false },
        { id: 'B', text: '$\\epsilon = 0.707$', correct: false },
        { id: 'C', text: '$\\epsilon = 1.000$', correct: true },
        { id: 'D', text: '$\\epsilon = 1.414$', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Dalgalanma faktörü formülü: $\\epsilon = \\sqrt{10^{-0.1 a_{\\text{pass}}} - 1}$.<br>
        2. $10^{-0.1(-3.0103)} = 10^{0.30103} \\approx 2.0$.<br>
        3. $\\epsilon = \\sqrt{2.0 - 1.0} = \\sqrt{1.0} = 1.000$.
      `
    },
    {
      id: 8,
      ch: 'Bölüm 2',
      title: 'Ters Chebyshev İletim Sıfırları',
      text: 'Ters Chebyshev (Tip II) filtresinde durdurma bandında dik kesim sağlayan ve transfer fonksiyonunun payını sıfırlayan iletim sıfırları ($z_k$) $s$-düzleminde nerede bulunur?',
      options: [
        { id: 'A', text: 'Sol reel eksende ($-\\sigma$)', correct: false },
        { id: 'B', text: 'Birim çember üzerinde ($e^{j\\theta}$)', correct: false },
        { id: 'C', text: 'Sanal eksen üzerinde saf imajiner noktalarda ($\\pm j \\omega_z$)', correct: true },
        { id: 'D', text: 'Sağ yarı düzlemde ($+\\sigma \\pm j\\omega$)', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Ters Chebyshev filtresinde durdurma bandında sonsuz zayıflama ($A_{\\text{dB}} \\to \\infty$) noktaları mevcuttur.<br>
        2. Bu noktaların oluşması için transfer fonksiyonunun payında $s^2 + \\omega_{z,k}^2$ terimleri yer alır.<br>
        3. $s = j\\omega$ koyduğunda $(j\\omega)^2 + \\omega_{z,k}^2 = -\\omega^2 + \\omega_{z,k}^2 = 0$ olur.<br>
        4. Dolayısıyla sıfırlar tam sanal eksen ($j\\omega$) üzerinde eşlenik çiftler halindedir: $z_k = \\pm j \\omega_{z,k}$.
      `
    },
    {
      id: 9,
      ch: 'Bölüm 2',
      title: 'Eliptik (Cauer) Filtrenin Temel Üstünlüğü',
      text: 'Verilen aynı geçirme bandı ($a_{\\text{pass}}, \\omega_{\\text{pass}}$) ve durdurma bandı ($a_{\\text{stop}}, \\omega_{\\text{stop}}$) toleransları altında, klasik 4 yaklaşım arasında teorik olarak en küçük dereceyi ($N_{\\min}$) ve en az Op-Amp/biquad katını veren yaklaşım hangisidir?',
      options: [
        { id: 'A', text: 'Butterworth', correct: false },
        { id: 'B', text: 'Chebyshev Tip I', correct: false },
        { id: 'C', text: 'Ters Chebyshev', correct: false },
        { id: 'D', text: 'Eliptik (Cauer)', correct: true }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Butterworth hem geçirme hem durdurma bandında monotoniktir; en yüksek dereceyi ($N$) gerektirir.<br>
        2. Chebyshev tek bantta dalgalanmaya izin vererek dereceyi düşürür.<br>
        3. Eliptik filtre ise hem geçirme hem durdurma bandında eşit dalgalanmaya (çift equiripple) ve $j\\omega$ sıfırlarına izin verdiği için geçiş bandı eğimi teorik olarak maksimumdur.<br>
        4. Dolayısıyla spesifikasyonları sağlayan minimum dereceyi ($N_{\\min}$) daima Eliptik yaklaşım verir.
      `
    },
    {
      id: 10,
      ch: 'Bölüm 1',
      title: 'Paley-Wiener Nedensellik Kriteri',
      text: 'Fiziksel dünyada ideal bir "tuğla duvar" (brick-wall) filtresinin (geçiş bandı genişliği sıfır olan ve durdurma bandında kazancı tam $0$ olan filtre) elektronik devrelerle üretilememesinin temel matematiksel/fiziksel gerekçesi nedir?',
      options: [
        { id: 'A', text: 'Op-amp\'ların kazancının sonlu olması', correct: false },
        { id: 'B', text: 'Paley-Wiener integralinin ıraksaması ve nedensellik (causality) ilkesinin ihlali', correct: true },
        { id: 'C', text: 'Direnç ve kondansatörlerin toleranslarının %0 olamaması', correct: false },
        { id: 'D', text: 'Termal gürültünün (Johnson gürültüsü) sıfırlanamaması', correct: false }
      ],
      solution: `
        <strong>Çözüm Adımları:</strong><br>
        1. Paley-Wiener kriteri: Bir sistemin nedensel (causal - uyarım gelmeden tepki vermeyen) olabilmesi için $\\int_{-\\infty}^{\\infty} \\frac{|\\ln |H(j\\omega)||}{1 + \\omega^2} d\\omega < \\infty$ integrali yakınsamalıdır.<br>
        2. Eğer bir filtre durdurma bandında kesinlikle sıfır kazanca ($|H(j\\omega)| = 0$) sahip olursa, $\\ln(0) = -\\infty$ olacağından bu integral sonsuza ıraksar.<br>
        3. İntegral ıraksadığında filtrenin darbe yanıtı $h(t)$, $t < 0$ zamanında sıfırdan farklı olmak zorunda kalır (gelecekteki sinyali önceden bilme gereksinimi). Bu nedenle pratik dünyada ideal filtre üretilemez; yaklaşım teorisi kullanılır.
      `
    }
  ];

  function init() {
    if (document.getElementById('quizModalOverlay')) return;

    overlay = document.createElement('div');
    overlay.id = 'quizModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="modal-container" style="max-width: 900px; max-height: 92vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="border-bottom: 1px solid var(--border); padding: 14px 22px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">🎓</span>
            <div>
              <h3 style="margin: 0; font-size: 16px; color: var(--text-h);">Analog Filtre Sınav Simülatörü & Quiz</h3>
              <p style="margin: 2px 0 0; font-size: 12px; color: var(--muted);">Bölüm 1 - 4 Klasik Sınav Soruları, Çözüm Adımları ve Anında Geri Bildirim</p>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="closeQuizModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--muted);">&times;</button>
        </div>

        <div class="modal-body" style="padding: 22px; overflow-y: auto;">
          <!-- Top Score & Progress Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; background: #fafaf9; border: 1px solid var(--border); padding: 10px 16px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 13px; font-weight: 700; color: var(--text-h);">İlerleme:</span>
              <span id="quizProgressText" style="font-size: 12.5px; color: var(--muted);">0 / 10 Yanıtlandı</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 13px; font-weight: 700; color: var(--accent);" id="quizScoreText">Skor: 0 / 10 (%0)</div>
              <button type="button" class="btn btn-sm" id="btnResetQuiz" style="padding: 3px 10px; font-size: 11.5px;">🔄 Sıfırla</button>
            </div>
          </div>

          <!-- Questions Container -->
          <div id="quizQuestionsList" style="display: flex; flex-direction: column; gap: 20px;"></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#closeQuizModalBtn').addEventListener('click', close);
    overlay.querySelector('#btnResetQuiz').addEventListener('click', resetQuiz);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  function open() {
    init();
    renderQuestions();
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    if (window.renderMathInElement) {
      window.renderMathInElement(document.getElementById('quizQuestionsList'), {
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

  function resetQuiz() {
    userAnswers = {};
    renderQuestions();
    updateScore();
  }

  function renderQuestions() {
    const list = document.getElementById('quizQuestionsList');
    if (!list) return;

    let html = '';

    QUESTIONS.forEach((q, qIdx) => {
      const answered = userAnswers[q.id] !== undefined;
      const userChoice = userAnswers[q.id];
      const isCorrect = answered && q.options.find(o => o.id === userChoice)?.correct;

      html += `
        <div class="quiz-card" style="background: #fff; border: 1.5px solid ${answered ? (isCorrect ? '#10b981' : '#ef4444') : 'var(--border)'}; border-radius: 8px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: rgba(61,90,254,0.1); color: #3d5afe; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 4px;">Soru ${qIdx + 1}</span>
              <span style="font-size: 12px; color: var(--muted);">${q.ch}</span>
            </div>
            ${answered ? `
              <span style="font-weight: 700; font-size: 12px; color: ${isCorrect ? '#10b981' : '#ef4444'};">
                ${isCorrect ? '✓ Doğru Cevap' : '✗ Yanlış Cevap'}
              </span>
            ` : ''}
          </div>

          <h4 style="margin: 0 0 8px; font-size: 14.5px; color: var(--text-h);">${q.title}</h4>
          <p style="font-size: 13.5px; margin: 0 0 14px; line-height: 1.55; color: var(--text);">${q.text}</p>

          <!-- Options -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px; margin-bottom: 12px;">
            ${q.options.map(opt => {
              let optStyle = 'background: #fafaf9; border: 1px solid var(--border); color: var(--text);';
              if (answered) {
                if (opt.correct) {
                  optStyle = 'background: rgba(16,185,129,0.1); border: 1.5px solid #10b981; color: #065f46; font-weight: 700;';
                } else if (opt.id === userChoice && !opt.correct) {
                  optStyle = 'background: rgba(239,68,68,0.1); border: 1.5px solid #ef4444; color: #991b1b;';
                }
              }

              return `
                <button type="button" class="quiz-opt-btn" data-qid="${q.id}" data-oid="${opt.id}" style="text-align: left; padding: 10px 14px; border-radius: 6px; cursor: ${answered ? 'default' : 'pointer'}; font-size: 13px; display: flex; align-items: center; gap: 10px; transition: all 0.15s; ${optStyle}" ${answered ? 'disabled' : ''}>
                  <strong style="width: 20px;">${opt.id})</strong>
                  <span>${opt.text}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Explanation box -->
          ${answered ? `
            <div style="margin-top: 12px; padding: 12px 16px; background: rgba(61,90,254,0.04); border-left: 3px solid var(--accent); border-radius: 4px; font-size: 13px; line-height: 1.6; color: var(--text);">
              <div style="font-weight: 700; color: var(--accent); margin-bottom: 6px;">💡 Detaylı Sınav Çözümü & Gerekçesi:</div>
              <div>${q.solution}</div>
            </div>
          ` : ''}
        </div>
      `;
    });

    list.innerHTML = html;

    // Attach click listeners to option buttons
    list.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const qid = parseInt(btn.getAttribute('data-qid'), 10);
        const oid = btn.getAttribute('data-oid');
        selectAnswer(qid, oid);
      });
    });

    if (window.renderMathInElement) {
      window.renderMathInElement(list, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function selectAnswer(qid, oid) {
    if (userAnswers[qid] !== undefined) return;
    userAnswers[qid] = oid;
    renderQuestions();
    updateScore();
  }

  function updateScore() {
    const total = QUESTIONS.length;
    const answeredCount = Object.keys(userAnswers).length;
    let correctCount = 0;

    QUESTIONS.forEach(q => {
      if (userAnswers[q.id] !== undefined) {
        const opt = q.options.find(o => o.id === userAnswers[q.id]);
        if (opt && opt.correct) correctCount++;
      }
    });

    const percent = Math.round((correctCount / total) * 100);

    const progressEl = document.getElementById('quizProgressText');
    const scoreEl = document.getElementById('quizScoreText');

    if (progressEl) progressEl.textContent = `${answeredCount} / ${total} Yanıtlandı`;
    if (scoreEl) scoreEl.textContent = `Skor: ${correctCount} / ${total} (%${percent})`;
  }

  return {
    open,
    close
  };
})();

if (typeof window !== 'undefined') {
  window.QuizModal = QuizModal;
}

if (typeof module !== 'undefined') module.exports = QuizModal;
