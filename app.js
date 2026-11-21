/**
 * FilterDesign Studio - Main Application Controller
 * Handles UI interactions, live calculations, drawing and routing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTab: 'designer', // 'designer', 'circuit', 'matlab', 'compare', 'theory'
    currentChapter: 'ch1',
    calcMode: 'unnormalized', // 'unnormalized' (default: Chapter 3-4) or 'normalized' (Chapter 2: Omega_p = 1 rad/s)
    priorFpass: 1000,
    priorFstop: 2500,
    priorType: 'lowpass',
    priorUnit: 'Hz',
    approx: 'butterworth',
    type: 'lowpass',
    unit: 'Hz', // 'Hz' or 'rad/s'
    fpass: 1000,
    fpass2: 2500,
    fstop: 2500,
    fstop2: 4000,
    passDb: 1.0,
    stopDb: 40.0,
    manualOrder: false,
    order: 4,
    useStandard: false,
    baseC: 10e-9, // 10 nF
    baseRA: 10e3, // 10 kΩ
    filterModel: null,
    circuitModel: null,
    proto: null
  };

  // DOM Elements Cache
  const els = {
    // Nav items
    navItems: document.querySelectorAll('.nav-item'),
    tabViews: document.querySelectorAll('.tab-view'),
    breadcrumbCurrent: document.getElementById('breadcrumbCurrent'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    sidebar: document.getElementById('sidebar'),

    // Designer Form
    filterTypeSelect: document.getElementById('filterTypeSelect'),
    unitHzBtn: document.getElementById('unitHzBtn'),
    unitRadBtn: document.getElementById('unitRadBtn'),
    fpassLabel: document.getElementById('fpassLabel'),
    fstopLabel: document.getElementById('fstopLabel'),
    fpassUnit: document.getElementById('fpassUnit'),
    fstopUnit: document.getElementById('fstopUnit'),
    fpass2Unit: document.getElementById('fpass2Unit'),
    fstop2Unit: document.getElementById('fstop2Unit'),
    fpass2Label: document.getElementById('fpass2Label'),
    fstop2Label: document.getElementById('fstop2Label'),
    fpassHint: document.getElementById('fpassHint'),
    fstopHint: document.getElementById('fstopHint'),
    fpass2Hint: document.getElementById('fpass2Hint'),
    fstop2Hint: document.getElementById('fstop2Hint'),
    openExamplesModalBtn: document.getElementById('openExamplesModalBtn'),
    sidebarAllExamplesBtn: document.getElementById('sidebarAllExamplesBtn'),
    examplesModalOverlay: document.getElementById('examplesModalOverlay'),
    closeExamplesModalBtn: document.getElementById('closeExamplesModalBtn'),
    exampleSearchInput: document.getElementById('exampleSearchInput'),
    modalExamplesList: document.getElementById('modalExamplesList'),
    sidebarQuickExamples: document.getElementById('sidebarQuickExamples'),
    approxButtons: document.querySelectorAll('[data-approx]'),
    fpassInput: document.getElementById('fpassInput'),
    fstopInput: document.getElementById('fstopInput'),
    fpass2Group: document.getElementById('fpass2Group'),
    fstop2Group: document.getElementById('fstop2Group'),
    fpass2Input: document.getElementById('fpass2Input'),
    fstop2Input: document.getElementById('fstop2Input'),
    passDbInput: document.getElementById('passDbInput'),
    stopDbInput: document.getElementById('stopDbInput'),
    autoOrderToggle: document.getElementById('autoOrderToggle'),
    orderInputGroup: document.getElementById('orderInputGroup'),
    orderInput: document.getElementById('orderInput'),
    standardCompToggle: document.getElementById('standardCompToggle'),
    baseCSelect: document.getElementById('baseCSelect'),

    // Summary Banner
    sumOrder: document.getElementById('sumOrder'),
    sumStages: document.getElementById('sumStages'),
    sumW0: document.getElementById('sumW0'),
    sumGain: document.getElementById('sumGain'),
    transferFuncMath: document.getElementById('transferFuncMath'),

    // Canvases
    canvasBodeMag: document.getElementById('canvasBodeMag'),
    canvasBodePhase: document.getElementById('canvasBodePhase'),
    canvasPoleZero: document.getElementById('canvasPoleZero'),
    canvasStep: document.getElementById('canvasStep'),
    canvasCompare: document.getElementById('canvasCompare'),

    // Circuit Container
    circuitStagesWrap: document.getElementById('circuitStagesWrap'),
    circuitDividerWrap: document.getElementById('circuitDividerWrap'),

    // MATLAB & SPICE
    matlabCodePre: document.getElementById('matlabCodePre'),
    spiceCodePre: document.getElementById('spiceCodePre'),
    copyMatlabBtn: document.getElementById('copyMatlabBtn'),
    downloadMatlabBtn: document.getElementById('downloadMatlabBtn'),
    copySpiceBtn: document.getElementById('copySpiceBtn'),

    // Mode Selector (Normalize vs. Normalize Olmayan)
    btnModeUnnormalized: document.getElementById('btnModeUnnormalized'),
    btnModeNormalized: document.getElementById('btnModeNormalized'),
    calcModeBadgeText: document.getElementById('calcModeBadgeText'),
    formulaModeBadge: document.getElementById('formulaModeBadge'),
    formulaWindowSubtitle: document.getElementById('formulaWindowSubtitle'),

    // Live Formula Window & Modals
    toggleAnalyticalStepsBtn: document.getElementById('toggleAnalyticalStepsBtn'),
    btnToggleAnalyticalStepsAccordion: document.getElementById('btnToggleAnalyticalStepsAccordion'),
    btnOpenFormulaModal: document.getElementById('btnOpenFormulaModal'),
    formulaModalOverlay: document.getElementById('formulaModalOverlay'),
    closeFormulaModalBtn: document.getElementById('closeFormulaModalBtn'),
    btnPrintFormulaReportBtn: document.getElementById('btnPrintFormulaReportBtn'),
    formulaModalBody: document.getElementById('formulaModalBody'),
    analyticalStepsBody: document.getElementById('analyticalStepsBody'),
    analyticalStepsToggleText: document.getElementById('analyticalStepsToggleText'),

    // Theory & Book
    chapterPills: document.getElementById('chapterPills'),
    theoryBody: document.getElementById('theoryBody')
  };

  // Unit Switcher (Hz / rad/s) & 2*pi*f Conversion
  function setupUnitControls() {
    if (!els.unitHzBtn || !els.unitRadBtn) return;

    els.unitHzBtn.addEventListener('click', () => {
      if (state.unit === 'Hz') return;
      setFrequencyUnit('Hz');
    });

    els.unitRadBtn.addEventListener('click', () => {
      if (state.unit === 'rad/s') return;
      setFrequencyUnit('rad/s');
    });
  }

  function updateFrequencyLabelsAndUnits() {
    const isRadS = state.unit === 'rad/s';
    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    const unitText = isRadS ? 'rad/s' : 'Hz';

    if (els.fpassUnit) els.fpassUnit.textContent = unitText;
    if (els.fstopUnit) els.fstopUnit.textContent = unitText;
    if (els.fpass2Unit) els.fpass2Unit.textContent = unitText;
    if (els.fstop2Unit) els.fstop2Unit.textContent = unitText;

    if (isBand) {
      if (els.fpassLabel) els.fpassLabel.textContent = isRadS ? 'Alt Açısal Frekans (ω_p1)' : 'Alt Geçirme Frekansı (f_p1)';
      if (els.fstopLabel) els.fstopLabel.textContent = isRadS ? 'Alt Açısal Frekans (ω_s1)' : 'Alt Durdurma Frekansı (f_s1)';
      if (els.fpass2Label) els.fpass2Label.textContent = isRadS ? 'Üst Açısal Frekans (ω_p2)' : 'Üst Geçirme Frekansı (f_p2)';
      if (els.fstop2Label) els.fstop2Label.textContent = isRadS ? 'Üst Açısal Frekans (ω_s2)' : 'Üst Durdurma Frekansı (f_s2)';
    } else {
      if (els.fpassLabel) els.fpassLabel.textContent = isRadS ? 'Açısal Frekans (ω_pass)' : 'Geçirme Frekansı (f_pass)';
      if (els.fstopLabel) els.fstopLabel.textContent = isRadS ? 'Açısal Frekans (ω_stop)' : 'Durdurma Frekansı (f_stop)';
      if (els.fpass2Label) els.fpass2Label.textContent = isRadS ? 'Üst Açısal Frekans (ω_p2)' : 'Üst Geçirme Frekansı (f_pass2)';
      if (els.fstop2Label) els.fstop2Label.textContent = isRadS ? 'Üst Açısal Frekans (ω_s2)' : 'Üst Durdurma Frekansı (f_stop2)';
    }

    updateFrequencyHints();
  }

  function setFrequencyUnit(newUnit) {
    const oldUnit = state.unit;
    state.unit = newUnit;

    els.unitHzBtn.classList.toggle('active', newUnit === 'Hz');
    els.unitRadBtn.classList.toggle('active', newUnit === 'rad/s');

    updateFrequencyLabelsAndUnits();

    // Convert existing numeric values with 2*pi
    if (oldUnit === 'Hz' && newUnit === 'rad/s') {
      state.fpass = parseFloat((state.fpass * 2 * Math.PI).toFixed(2));
      state.fstop = parseFloat((state.fstop * 2 * Math.PI).toFixed(2));
      state.fpass2 = parseFloat((state.fpass2 * 2 * Math.PI).toFixed(2));
      state.fstop2 = parseFloat((state.fstop2 * 2 * Math.PI).toFixed(2));
    } else if (oldUnit === 'rad/s' && newUnit === 'Hz') {
      state.fpass = parseFloat((state.fpass / (2 * Math.PI)).toFixed(2));
      state.fstop = parseFloat((state.fstop / (2 * Math.PI)).toFixed(2));
      state.fpass2 = parseFloat((state.fpass2 / (2 * Math.PI)).toFixed(2));
      state.fstop2 = parseFloat((state.fstop2 / (2 * Math.PI)).toFixed(2));
    }

    if (els.fpassInput) els.fpassInput.value = state.fpass;
    if (els.fstopInput) els.fstopInput.value = state.fstop;
    if (els.fpass2Input) els.fpass2Input.value = state.fpass2;
    if (els.fstop2Input) els.fstop2Input.value = state.fstop2;

    recalculateAll();
  }

  function updateFrequencyHints() {
    if (state.calcMode === 'normalized') {
      if (els.fpassHint) els.fpassHint.textContent = 'Normalize temel geçirme frekansı Ω_p = 1.0 rad/s.';
      if (els.fstopHint) els.fstopHint.textContent = `Normalize durdurma bandı geçiş oranı r = ${state.fstop.toFixed(2)}.`;
      if (els.fpass2Hint) els.fpass2Hint.textContent = '';
      if (els.fstop2Hint) els.fstop2Hint.textContent = '';
      return;
    }

    const isRadS = state.unit === 'rad/s';

    const getHint = (val) => {
      if (val <= 0 || !isFinite(val)) return '';
      if (isRadS) {
        // rad/s -> Hz: f = w / (2*pi)
        const fHz = val / (2 * Math.PI);
        return `ω = ${val} rad/s ⇄ f = ${fHz.toFixed(2)} Hz (ω / 2π)`;
      } else {
        // Hz -> rad/s: w = 2*pi*f
        const wRad = val * 2 * Math.PI;
        return `f = ${val} Hz ⇄ ω = ${wRad.toFixed(2)} rad/s (2π · f)`;
      }
    };

    if (els.fpassHint) els.fpassHint.textContent = getHint(state.fpass);
    if (els.fstopHint) els.fstopHint.textContent = getHint(state.fstop);
    if (els.fpass2Hint) els.fpass2Hint.textContent = getHint(state.fpass2);
    if (els.fstop2Hint) els.fstop2Hint.textContent = getHint(state.fstop2);
  }

  // Book Examples Modal & Sidebar Drawer
  function setupExamplesModal() {
    if (els.openExamplesModalBtn) {
      els.openExamplesModalBtn.addEventListener('click', () => openExamplesModal());
    }
    if (els.sidebarAllExamplesBtn) {
      els.sidebarAllExamplesBtn.addEventListener('click', () => openExamplesModal());
    }
    if (els.closeExamplesModalBtn) {
      els.closeExamplesModalBtn.addEventListener('click', () => closeExamplesModal());
    }
    if (els.examplesModalOverlay) {
      els.examplesModalOverlay.addEventListener('click', (e) => {
        if (e.target === els.examplesModalOverlay) closeExamplesModal();
      });
    }

    // Modal filter tabs (all, ch2, ch3, ch4)
    document.querySelectorAll('[data-modal-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-modal-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-modal-filter');
        renderModalExamples(filterVal, els.exampleSearchInput?.value || '');
      });
    });

    if (els.exampleSearchInput) {
      els.exampleSearchInput.addEventListener('input', (e) => {
        const activeTab = document.querySelector('[data-modal-filter].active')?.getAttribute('data-modal-filter') || 'all';
        renderModalExamples(activeTab, e.target.value.toLowerCase().trim());
      });
    }
  }

  function openExamplesModal() {
    if (!els.examplesModalOverlay) return;
    if (els.exampleSearchInput) els.exampleSearchInput.value = '';
    document.querySelectorAll('[data-modal-filter]').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-modal-filter') === 'all');
    });
    els.examplesModalOverlay.style.display = 'flex';
    renderModalExamples('all', '');
  }

  function closeExamplesModal() {
    if (!els.examplesModalOverlay) return;
    els.examplesModalOverlay.style.display = 'none';
  }

  function renderModalExamples(filterChapter = 'all', searchQuery = '') {
    if (!els.modalExamplesList || typeof BookExamples === 'undefined') return;

    let filtered = BookExamples;
    if (filterChapter !== 'all') {
      const chNum = parseInt(filterChapter, 10);
      filtered = filtered.filter(ex => ex.chapter === chNum);
    }

    if (searchQuery) {
      filtered = filtered.filter(ex => 
        ex.number.toLowerCase().includes(searchQuery) ||
        ex.title.toLowerCase().includes(searchQuery) ||
        ex.approx.toLowerCase().includes(searchQuery) ||
        ex.type.toLowerCase().includes(searchQuery) ||
        ex.description.toLowerCase().includes(searchQuery)
      );
    }

    if (filtered.length === 0) {
      els.modalExamplesList.innerHTML = `<div style="text-align: center; color: var(--muted); padding: 30px;">Eşleşen örnek bulunamadı.</div>`;
      return;
    }

    let html = '';
    filtered.forEach(ex => {
      const isBand = ex.type === 'bandpass' || ex.type === 'bandstop';
      const freqText = isBand 
        ? `Pass: [${ex.fpass}, ${ex.fpass2}] ${ex.unit} | Stop: [${ex.fstop}, ${ex.fstop2}] ${ex.unit}`
        : `Pass: ${ex.fpass} ${ex.unit} | Stop: ${ex.fstop} ${ex.unit}`;

      html += `
        <div class="example-card" data-load-ex="${ex.id}">
          <div class="example-card-head">
            <span class="example-title">Örnek ${ex.number}: ${ex.title}</span>
            <span class="example-badge">Bölüm ${ex.chapter} (s.${ex.page})</span>
          </div>
          <div class="example-meta">
            <span>Yaklaşım: <strong>${ex.approx.toUpperCase()}</strong></span>
            <span>Tip: <strong>${ex.type.toUpperCase()}</strong></span>
            <span>Birim: <strong>${ex.unit}</strong></span>
            <span>Derece: <strong>N=${ex.order}</strong></span>
            <span>${freqText}</span>
          </div>
          <div class="example-desc">${ex.description}</div>
        </div>
      `;
    });

    els.modalExamplesList.innerHTML = html;

    els.modalExamplesList.querySelectorAll('[data-load-ex]').forEach(card => {
      card.addEventListener('click', () => {
        const exId = card.getAttribute('data-load-ex');
        const targetEx = BookExamples.find(e => e.id === exId);
        if (targetEx) {
          loadBookExample(targetEx);
          closeExamplesModal();
        }
      });
    });
  }

  function renderSidebarQuickExamples() {
    if (!els.sidebarQuickExamples || typeof BookExamples === 'undefined') return;

    // Pick 5 representative examples across chapters 2, 3 and 4
    const quickIds = ['ex2_2', 'ex3_2', 'ex4_1', 'ex4_2', 'ex4_4'];
    let html = '';

    BookExamples.filter(ex => quickIds.includes(ex.id)).forEach(ex => {
      html += `
        <button class="chip-btn" data-load-ex="${ex.id}" style="text-align: left; padding: 6px 10px; font-size: 11.5px;">
          <strong>Örnek ${ex.number}:</strong> ${ex.title.replace('Normalize Transfer Fonksiyonu', '').replace('Aktif Devre Tasarımı', '')}
        </button>
      `;
    });

    els.sidebarQuickExamples.innerHTML = html;

    els.sidebarQuickExamples.querySelectorAll('[data-load-ex]').forEach(btn => {
      btn.addEventListener('click', () => {
        const exId = btn.getAttribute('data-load-ex');
        const targetEx = BookExamples.find(e => e.id === exId);
        if (targetEx) loadBookExample(targetEx);
      });
    });
  }

  function loadBookExample(ex) {
    if (ex.chapter === 2) {
      setCalcMode('normalized', false);
    } else {
      setCalcMode('unnormalized', false);
    }

    state.approx = ex.approx;
    state.type = ex.type;
    state.unit = ex.unit || 'Hz';
    state.fpass = ex.fpass;
    state.fstop = ex.fstop;
    state.passDb = ex.passDb;
    state.stopDb = ex.stopDb;
    state.order = ex.order;
    state.manualOrder = ex.manualOrder !== undefined ? ex.manualOrder : true;

    if (ex.fpass2) state.fpass2 = ex.fpass2;
    if (ex.fstop2) state.fstop2 = ex.fstop2;
    if (ex.baseC) state.baseC = ex.baseC;

    // Sync Form UI
    els.filterTypeSelect.value = state.type;
    els.approxButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-approx') === state.approx);
    });

    if (els.unitHzBtn && els.unitRadBtn) {
      els.unitHzBtn.classList.toggle('active', state.unit === 'Hz');
      els.unitRadBtn.classList.toggle('active', state.unit === 'rad/s');
    }

    if (state.calcMode !== 'normalized') {
      updateFrequencyLabelsAndUnits();
    }

    els.fpassInput.value = state.fpass;
    els.fstopInput.value = state.fstop;
    if (els.fpass2Input) els.fpass2Input.value = state.fpass2;
    if (els.fstop2Input) els.fstop2Input.value = state.fstop2;
    els.passDbInput.value = state.passDb;
    els.stopDbInput.value = state.stopDb;
    els.orderInput.value = state.order;
    els.autoOrderToggle.checked = !state.manualOrder;
    els.orderInputGroup.style.display = state.manualOrder ? 'flex' : 'none';

    const isBand = state.calcMode !== 'normalized' && (state.type === 'bandpass' || state.type === 'bandstop');
    els.fpass2Group.style.display = isBand ? 'flex' : 'none';
    els.fstop2Group.style.display = isBand ? 'flex' : 'none';

    // Switch to designer tab
    window.location.hash = '#/designer';

    // Recalculate
    recalculateAll();
  }

  // Initialize
  function init() {
    setupNavigation();
    setupFormEvents();
    setupUnitControls();
    updateFrequencyLabelsAndUnits();
    setupExamplesModal();
    setupAnalyticalStepsToggle();
    renderSidebarQuickExamples();
    renderTheoryNav();
    renderChapterContent('ch1');
    applyHashRoute();
    window.addEventListener('hashchange', applyHashRoute);

    // Initial calculation
    recalculateAll();

    // Initialize Filter Types Deep Dive Modal
    if (window.FilterTypesModal) {
      FilterTypesModal.init();
    }

    // Initialize Classical Normalized Filter Approximations Modal
    if (window.FilterApproxModal) {
      FilterApproxModal.init();
    }

    // Initialize Frequency Transformations Modal (Chapter 3)
    if (window.FilterTransformModal) {
      FilterTransformModal.init();
    }

    // Initialize Active Circuit Realizations Modal (Chapter 4)
    if (window.FilterCircuitModal) {
      FilterCircuitModal.init();
    }

    // Expose Global FilterStudio API for modals
    window.FilterStudio = {
      setFilterType: (type) => {
        state.type = type;
        if (els.filterTypeSelect) {
          els.filterTypeSelect.value = type;
        }
        const isBand = type === 'bandpass' || type === 'bandstop';
        if (els.fpass2Group) els.fpass2Group.style.display = isBand ? 'flex' : 'none';
        if (els.fstop2Group) els.fstop2Group.style.display = isBand ? 'flex' : 'none';
        updateFrequencyLabelsAndUnits();
        window.location.hash = '#/designer';
        recalculateAll();
      },
      setApprox: (approxId) => {
        state.approx = approxId;
        els.approxButtons.forEach(btn => {
          btn.classList.toggle('active', btn.getAttribute('data-approx') === approxId);
        });
        window.location.hash = '#/designer';
        recalculateAll();
      },
      loadExample: (ex) => {
        loadBookExample(ex);
      }
    };

    // Resize listener for sharp canvas redraws
    window.addEventListener('resize', debounce(() => {
      drawAllPlots();
    }, 150));
  }

  // Routing and Navigation
  function setupNavigation() {
    els.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = item.getAttribute('data-tab');
        if (tab) {
          window.location.hash = '#/' + tab;
        }
      });
    });

    if (els.mobileMenuBtn && els.sidebar) {
      els.mobileMenuBtn.addEventListener('click', () => {
        els.sidebar.classList.toggle('open');
      });
    }

    // Quick preset buttons
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pKey = btn.getAttribute('data-preset');
        if (presets[pKey]) {
          applyPreset(presets[pKey]);
        }
      });
    });
  }

  function applyHashRoute() {
    let hash = window.location.hash.replace('#/', '').trim();
    if (!hash) hash = 'designer';

    // Aliases & Fallbacks
    if (hash === 'analysis') hash = 'designer';

    // Check if it's a chapter route (e.g. #/ch1, #/ch2, #/ch3, #/ch4)
    if (hash.startsWith('ch')) {
      const validCh = ['ch1', 'ch2', 'ch3', 'ch4'];
      const targetCh = validCh.includes(hash) ? hash : 'ch1';
      state.currentChapter = targetCh;
      switchTab('theory', targetCh);
      renderChapterContent(targetCh);
      return;
    }

    const validTabs = ['designer', 'circuit', 'matlab', 'compare', 'theory'];
    if (!validTabs.includes(hash)) {
      hash = 'designer';
    }

    switchTab(hash);
  }

  function switchTab(tabId, chapterId = null) {
    state.currentTab = tabId;
    const activeNavKey = (tabId === 'theory' && (chapterId || state.currentChapter)) ? (chapterId || state.currentChapter) : tabId;

    // Update nav items - only highlight the single relevant item
    els.navItems.forEach(item => {
      const dataTab = item.getAttribute('data-tab');
      if (dataTab === activeNavKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update views
    els.tabViews.forEach(view => {
      if (view.id === 'view-' + tabId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // Update Breadcrumb
    const tabTitles = {
      designer: 'İnteraktif Filtre Tasarımcısı',
      circuit: 'Bölüm 4: Aktif Devre Şematiği',
      matlab: 'MATLAB & SPICE Kodu',
      compare: 'Filtre Karşılaştırma Laboratuvarı',
      theory: 'Kitap & Teori'
    };
    if (els.breadcrumbCurrent) {
      if (tabId === 'theory' && typeof BookContent !== 'undefined') {
        const ch = BookContent.chapters.find(c => c.id === (chapterId || state.currentChapter));
        els.breadcrumbCurrent.textContent = ch ? ch.title : 'Kitap & Teori';
      } else {
        els.breadcrumbCurrent.textContent = tabTitles[tabId] || 'Tasarımcı';
      }
    }

    if (els.sidebar) els.sidebar.classList.remove('open');

    // Redraw plots if switching into a view with canvases
    setTimeout(() => {
      drawAllPlots();
      if (tabId === 'compare') {
        drawComparePlot();
      }
      renderAllMath();
    }, 60);
  }

  function renderAllMath() {
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (e) {
        // Silent fallback
      }
    }
  }

  // Form Controls Binding
  function setupFormEvents() {
    // Mode Switcher (Normalize vs. Normalize Olmayan)
    if (els.btnModeUnnormalized && els.btnModeNormalized) {
      els.btnModeUnnormalized.addEventListener('click', () => {
        setCalcMode('unnormalized');
      });
      els.btnModeNormalized.addEventListener('click', () => {
        setCalcMode('normalized');
      });
    }

    // Filter Type
    els.filterTypeSelect.addEventListener('change', (e) => {
      state.type = e.target.value;
      const isBand = state.type === 'bandpass' || state.type === 'bandstop';
      els.fpass2Group.style.display = isBand ? 'flex' : 'none';
      els.fstop2Group.style.display = isBand ? 'flex' : 'none';
      updateFrequencyLabelsAndUnits();
      recalculateAll();
    });

    // Approximation buttons
    els.approxButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        els.approxButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.approx = btn.getAttribute('data-approx');
        recalculateAll();
      });
    });

    // Frequency & Attenuation inputs
    const numInputs = [
      { el: els.fpassInput, prop: 'fpass' },
      { el: els.fstopInput, prop: 'fstop' },
      { el: els.fpass2Input, prop: 'fpass2' },
      { el: els.fstop2Input, prop: 'fstop2' },
      { el: els.passDbInput, prop: 'passDb' },
      { el: els.stopDbInput, prop: 'stopDb' },
      { el: els.orderInput, prop: 'order' }
    ];

    numInputs.forEach(({ el, prop }) => {
      if (!el) return;
      el.addEventListener('input', () => {
        const val = parseFloat(el.value);
        if (!isNaN(val) && val > 0) {
          state[prop] = val;
          recalculateAll();
        }
      });
    });

    // Order auto/manual
    els.autoOrderToggle.addEventListener('change', (e) => {
      state.manualOrder = !e.target.checked;
      els.orderInputGroup.style.display = state.manualOrder ? 'flex' : 'none';
      recalculateAll();
    });

    // Standard Components Toggle
    els.standardCompToggle.addEventListener('change', (e) => {
      state.useStandard = e.target.checked;
      recalculateAll();
    });

    // Base Capacitor Select
    els.baseCSelect.addEventListener('change', (e) => {
      state.baseC = parseFloat(e.target.value);
      recalculateAll();
    });

    // Copy & Download buttons
    els.copyMatlabBtn.addEventListener('click', () => {
      copyToClipboard(els.matlabCodePre.textContent, els.copyMatlabBtn, 'Kopyalandı!');
    });

    els.downloadMatlabBtn.addEventListener('click', () => {
      downloadFile('filter_design.m', els.matlabCodePre.textContent);
    });

    els.copySpiceBtn.addEventListener('click', () => {
      copyToClipboard(els.spiceCodePre.textContent, els.copySpiceBtn, 'SPICE Kopyalandı!');
    });
  }

  function applyPreset(p) {
    state.approx = p.approx;
    state.type = p.type;
    state.fpass = p.fpass;
    state.fstop = p.fstop;
    state.passDb = p.passDb;
    state.stopDb = p.stopDb;
    state.order = p.order;
    state.manualOrder = p.manualOrder;

    if (p.fpass2) state.fpass2 = p.fpass2;
    if (p.fstop2) state.fstop2 = p.fstop2;

    // Sync UI inputs
    els.filterTypeSelect.value = state.type;
    els.approxButtons.forEach(btn => {
      if (btn.getAttribute('data-approx') === state.approx) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    els.fpassInput.value = state.fpass;
    els.fstopInput.value = state.fstop;
    if (els.fpass2Input) els.fpass2Input.value = state.fpass2;
    if (els.fstop2Input) els.fstop2Input.value = state.fstop2;
    els.passDbInput.value = state.passDb;
    els.stopDbInput.value = state.stopDb;
    els.orderInput.value = state.order;
    els.autoOrderToggle.checked = !state.manualOrder;
    els.orderInputGroup.style.display = state.manualOrder ? 'flex' : 'none';

    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    els.fpass2Group.style.display = isBand ? 'flex' : 'none';
    els.fstop2Group.style.display = isBand ? 'flex' : 'none';

    recalculateAll();
  }

  // Calculation Mode Switcher (Normalize vs. Normalize Olmayan)
  function setCalcMode(mode, triggerRecalc = true) {
    if (!mode) mode = 'unnormalized';
    state.calcMode = mode;
    const isNorm = mode === 'normalized';

    if (els.btnModeNormalized) els.btnModeNormalized.classList.toggle('active', isNorm);
    if (els.btnModeUnnormalized) els.btnModeUnnormalized.classList.toggle('active', !isNorm);

    if (els.calcModeBadgeText) {
      els.calcModeBadgeText.textContent = isNorm
        ? 'Bölüm 2: Ω_p = 1.0 rad/s Normalize Prototip Hesabı'
        : 'Bölüm 3 & 4: Gerçek Frekans & Aktif Devre Sentezi';
      els.calcModeBadgeText.style.background = isNorm ? 'rgba(61,90,254,0.1)' : 'rgba(16,185,129,0.1)';
      els.calcModeBadgeText.style.color = isNorm ? '#3d5afe' : '#10b981';
    }

    if (els.formulaModeBadge) {
      els.formulaModeBadge.textContent = isNorm
        ? 'Bölüm 2 Normalize Prototip Formülleri'
        : 'Bölüm 2-3-4 Canlı Çözüm';
    }

    if (els.formulaWindowSubtitle) {
      els.formulaWindowSubtitle.textContent = isNorm
        ? 'Ω_p = 1 rad/s Normalize Prototip için Les Thede Bölüm 2 Formülleri ve Sayısal İkame'
        : 'Girdiğiniz spesifikasyonlara göre Les Thede formülleri ve canlı sayısal çözümler';
    }

    if (isNorm) {
      // Remember previous unnormalized settings
      if (state.fpass !== 1.0) state.priorFpass = state.fpass;
      if (state.fstop !== 2.0) state.priorFstop = state.fstop;
      state.priorType = state.type;
      state.priorUnit = state.unit;

      state.type = 'lowpass';
      if (els.filterTypeSelect) {
        els.filterTypeSelect.value = 'lowpass';
        els.filterTypeSelect.disabled = true;
        els.filterTypeSelect.title = 'Bölüm 2 standartları gereği normalize filtre prototipi daima Ω_p = 1 rad/s alçak geçirendir.';
      }

      state.fpass = 1.0;
      if (els.fpassInput) {
        els.fpassInput.value = '1.0';
        els.fpassInput.disabled = true;
      }

      if (els.fstopInput) {
        let curStop = parseFloat(els.fstopInput.value);
        if (isNaN(curStop) || curStop <= 1.05 || curStop > 50) {
          curStop = 2.0;
          els.fstopInput.value = '2.0';
        }
        state.fstop = curStop;
      }

      if (els.fpassLabel) els.fpassLabel.textContent = 'Normalize Geçirme (Ω_p)';
      if (els.fpassUnit) els.fpassUnit.textContent = 'rad/s';
      if (els.fstopLabel) els.fstopLabel.textContent = 'Normalize Durdurma (Ω_s = r)';
      if (els.fstopUnit) els.fstopUnit.textContent = 'rad/s';

      if (els.fpass2Group) els.fpass2Group.style.display = 'none';
      if (els.fstop2Group) els.fstop2Group.style.display = 'none';
      if (els.fpassHint) els.fpassHint.textContent = 'Normalize temel açısal frekans Ω_p = 1.0 rad/s.';
      if (els.fstopHint) els.fstopHint.textContent = `Normalize durdurma bandı geçiş oranı r = ${state.fstop.toFixed(2)}.`;
    } else {
      if (els.filterTypeSelect) {
        els.filterTypeSelect.disabled = false;
        els.filterTypeSelect.title = '';
        state.type = state.priorType || 'lowpass';
        els.filterTypeSelect.value = state.type;
      }

      state.fpass = state.priorFpass || 1000;
      state.fstop = state.priorFstop || 2500;
      if (els.fpassInput) {
        els.fpassInput.disabled = false;
        els.fpassInput.value = state.fpass;
      }
      if (els.fstopInput) {
        els.fstopInput.value = state.fstop;
      }

      const isBand = state.type === 'bandpass' || state.type === 'bandstop';
      if (els.fpass2Group) els.fpass2Group.style.display = isBand ? 'flex' : 'none';
      if (els.fstop2Group) els.fstop2Group.style.display = isBand ? 'flex' : 'none';

      updateFrequencyLabelsAndUnits();
      updateFrequencyHints();
    }

    if (triggerRecalc) recalculateAll();
  }

  // Core Calculation Pipeline
  function recalculateAll() {
    const isNorm = state.calcMode === 'normalized';
    const isBand = !isNorm && (state.type === 'bandpass' || state.type === 'bandstop');
    const isRadS = isNorm ? true : (state.unit === 'rad/s');

    let fp, fs, wp, ws;
    if (isNorm) {
      fp = 1.0;
      fs = Math.max(1.05, state.fstop);
      wp = 1.0;
      ws = fs; // transition ratio r = Omega_s
    } else {
      fp = isBand ? [state.fpass, state.fpass2] : state.fpass;
      fs = isBand ? [state.fstop, state.fstop2] : state.fstop;
      const toOmega = (v) => (isRadS ? v : 2 * Math.PI * v);
      wp = isBand ? [toOmega(fp[0]), toOmega(fp[1])] : toOmega(fp);
      ws = isBand ? [toOmega(fs[0]), toOmega(fs[1])] : toOmega(fs);
    }

    // 1. Calculate Order
    const filterTypeForOrder = isNorm ? 'lowpass' : state.type;
    let calcN = FilterMath.calculateOrder(filterTypeForOrder, state.approx, state.passDb, state.stopDb, wp, ws);
    let effectiveN = state.manualOrder ? state.order : calcN;
    state.order = effectiveN;
    if (!state.manualOrder && els.orderInput) {
      els.orderInput.value = effectiveN;
    }

    // 2. Normalized Prototype (Chapter 2)
    const ratio_r = isNorm ? ws : (isBand ? Math.abs(ws[0] - ws[1]) / Math.abs(wp[0] - wp[1]) : (Array.isArray(ws) ? ws[0] / wp[0] : ws / wp));
    const proto = FilterMath.getNormalizedPrototype(state.approx, effectiveN, state.passDb, state.stopDb, ratio_r);
    state.proto = proto;

    // 3. Unnormalize to target specs (Chapter 3)
    let filterModel;
    if (isNorm) {
      // Prototype filter with cutoff 1 rad/s
      filterModel = FilterMath.unnormalizeFilter(proto, 'lowpass', 1.0 / (2 * Math.PI), ws / (2 * Math.PI), false);
    } else {
      filterModel = FilterMath.unnormalizeFilter(proto, state.type, fp, fs, isRadS);
    }
    state.filterModel = filterModel;

    // 4. Synthesize Active Circuit (Chapter 4)
    const circuitModel = CircuitEngine.synthesizeCircuit(filterModel, state.baseC, state.baseRA, state.useStandard);
    state.circuitModel = circuitModel;

    // 5. Update UI Summary and conversion hints
    if (!isNorm) updateFrequencyHints();
    updateSummaryBanner(effectiveN, filterModel, circuitModel);

    // 5b. Render Live Analytical Calculation Steps & Substituted Formulas (Chapters 1-4)
    renderComprehensiveFormulas(proto, filterModel, circuitModel, effectiveN);

    // 6. Draw Plots
    drawAllPlots();

    // 7. Update Circuit Schematics View
    updateCircuitView(circuitModel);

    // 8. Generate MATLAB and SPICE Code
    updateCodeView(filterModel, circuitModel);
  }

  function updateSummaryBanner(n, filterModel, circuitModel) {
    const totalStages = circuitModel.stages.length;
    els.sumOrder.textContent = `N = ${n}`;
    els.sumStages.textContent = `${totalStages} Aşama (${totalStages} Op-Amp)`;

    const isNorm = state.calcMode === 'normalized';
    const isBand = !isNorm && (state.type === 'bandpass' || state.type === 'bandstop');
    const isRadS = isNorm ? true : (state.unit === 'rad/s');

    if (isNorm) {
      els.sumW0.textContent = `Ω_p = 1.0 rad/s | Ω_s = ${state.fstop.toFixed(2)} rad/s (r = ${state.fstop.toFixed(2)})`;
      els.sumGain.textContent = (state.proto && state.proto.gain) ? `G = ${state.proto.gain.toFixed(3)}` : 'G = 1.000';
    } else if (isBand) {
      if (isRadS) {
        const w0 = Math.sqrt(state.fpass * state.fpass2);
        const f0 = w0 / (2 * Math.PI);
        els.sumW0.textContent = `ω₀ = ${w0.toFixed(1)} rad/s (${f0.toFixed(1)} Hz) | B = ${(state.fpass2 - state.fpass).toFixed(1)} rad/s`;
      } else {
        const f0 = Math.sqrt(state.fpass * state.fpass2);
        const w0 = 2 * Math.PI * f0;
        els.sumW0.textContent = `f₀ = ${f0.toFixed(1)} Hz (${w0.toFixed(0)} rad/s) | B = ${(state.fpass2 - state.fpass).toFixed(1)} Hz`;
      }
      els.sumGain.textContent = `K_tot = ${circuitModel.Ktot.toFixed(3)}`;
    } else {
      if (isRadS) {
        const f = state.fpass / (2 * Math.PI);
        els.sumW0.textContent = `ω_kesim = ${state.fpass} rad/s (${f.toFixed(2)} Hz)`;
      } else {
        const w = 2 * Math.PI * state.fpass;
        els.sumW0.textContent = `f_kesim = ${state.fpass} Hz (${w.toFixed(0)} rad/s)`;
      }
      els.sumGain.textContent = `K_tot = ${circuitModel.Ktot.toFixed(3)}`;
    }

    // Render transfer function H(s) in LaTeX or text
    let latex = isNorm ? 'H(S) = ' : 'H(s) = ';
    latex += `\\prod_{m=1}^{${totalStages}} ${isNorm ? 'H_m(S)' : 'H_m(s)'}`;
    if (window.katex && els.transferFuncMath) {
      try {
        window.katex.render(latex, els.transferFuncMath, { throwOnError: false });
      } catch (err) {
        els.transferFuncMath.textContent = latex;
      }
    }
  }

  // Comprehensive Live Analytical Calculations & Formulas Window (Chapters 1, 2, 3, 4)
  function renderComprehensiveFormulas(proto, filterModel, circuitModel, effectiveN) {
    const inlineContainer = els.analyticalStepsBody;
    const modalContainer = els.formulaModalBody;
    if (!inlineContainer || !proto || !proto.details) return;

    const isNorm = state.calcMode === 'normalized';
    const isBand = !isNorm && (state.type === 'bandpass' || state.type === 'bandstop');
    const isRadS = isNorm ? true : (state.unit === 'rad/s');
    const toOmega = (v) => (isRadS ? v : 2 * Math.PI * v);

    const wp_val = isNorm ? 1.0 : (isBand ? [toOmega(state.fpass), toOmega(state.fpass2)] : toOmega(state.fpass));
    const ws_val = isNorm ? state.fstop : (isBand ? [toOmega(state.fstop), toOmega(state.fstop2)] : toOmega(state.fstop));

    // Transition ratio r
    let r_val = isNorm ? ws_val : 1.0;
    if (!isNorm) {
      if (state.type === 'lowpass') {
        r_val = ws_val / wp_val;
      } else if (state.type === 'highpass') {
        r_val = wp_val / ws_val;
      } else if (state.type === 'bandpass') {
        const Bp = wp_val[1] - wp_val[0];
        const w02 = wp_val[0] * wp_val[1];
        const r1 = Math.abs((ws_val[0] * ws_val[0] - w02) / (Bp * ws_val[0]));
        const r2 = Math.abs((ws_val[1] * ws_val[1] - w02) / (Bp * ws_val[1]));
        r_val = Math.min(r1, r2);
      } else if (state.type === 'bandstop') {
        const Bp = wp_val[1] - wp_val[0];
        const w02 = ws_val[0] * ws_val[1];
        const r1 = Math.abs((Bp * ws_val[0]) / (ws_val[0] * ws_val[0] - w02));
        const r2 = Math.abs((Bp * ws_val[1]) / (ws_val[1] * ws_val[1] - w02));
        r_val = Math.min(r1, r2);
      }
    }

    const d = proto.details;
    const eps = Math.sqrt(Math.pow(10, 0.1 * state.passDb) - 1);
    const eps_s = Math.sqrt(Math.pow(10, 0.1 * state.stopDb) - 1);

    // =========================================================================
    // SECTION 1: CHAPTER 2 NORMALIZED PROTOTYPE FORMULAS & LIVE SUBSTITUTION
    // =========================================================================
    let orderDerivationHtml = '';
    let geomParamHtml = '';

    if (d.approx === 'butterworth') {
      const logRatio = Math.log10(eps_s / eps);
      const logR = Math.log10(r_val);
      const exactN = logRatio / logR;
      orderDerivationHtml = `
        <div>• <strong>Derece Hesabı (Denklem 2.8):</strong>
          $$n_B \\ge \\frac{\\log_{10}(\\epsilon_s / \\epsilon)}{\\log_{10}(r)} = \\frac{\\log_{10}(${eps_s.toFixed(4)} / ${eps.toFixed(4)})}{\\log_{10}(${r_val.toFixed(4)})} = \\frac{${logRatio.toFixed(4)}}{${logR.toFixed(4)}} = ${exactN.toFixed(3)} \\implies n = ${effectiveN}$$
        </div>
      `;
      geomParamHtml = `
        <div>• <strong>Birim Çember Yarıçapı (Denklem 2.9):</strong>
          $$R = \\epsilon^{-1/n} = (${eps.toFixed(4)})^{-1/${effectiveN}} = ${d.R.toFixed(5)}$$
        </div>
        <div>• <strong>Kutup Açı Formülü (Denklem 2.10):</strong>
          $$\\theta_m = \\frac{2m + 1 + n}{2n}\\pi, \\quad m = 1, 2, \\dots, ${Math.floor(effectiveN / 2)}$$
        </div>
        <div>• <strong>Kutup Koordinatları & Biquad Katsayıları (Denklem 2.11, 2.12, 2.16, 2.17):</strong>
          $$\\sigma_m = R\\cos\\theta_m, \\quad \\omega_m = R\\sin\\theta_m, \\quad B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = R^2 = ${d.R.toFixed(5)}^2 = ${(d.R * d.R).toFixed(5)}$$
        </div>
      `;
    } else if (d.approx === 'chebyshev') {
      const numAc = Math.acosh(eps_s / eps);
      const denAc = Math.acosh(r_val);
      const exactN = numAc / denAc;
      orderDerivationHtml = `
        <div>• <strong>Derece Hesabı (Denklem 2.21):</strong>
          $$n_C \\ge \\frac{\\cosh^{-1}(\\epsilon_s / \\epsilon)}{\\cosh^{-1}(r)} = \\frac{\\cosh^{-1}(${(eps_s / eps).toFixed(4)})}{\\cosh^{-1}(${r_val.toFixed(4)})} = \\frac{${numAc.toFixed(4)}}{${denAc.toFixed(4)}} = ${exactN.toFixed(3)} \\implies n = ${effectiveN}$$
        </div>
      `;
      geomParamHtml = `
        <div>• <strong>Elips Parametresi D (Denklem 2.23):</strong>
          $$D = \\frac{1}{n}\\sinh^{-1}(1/\\epsilon) = \\frac{1}{${effectiveN}}\\sinh^{-1}(1/${eps.toFixed(4)}) = ${d.D.toFixed(5)}$$
        </div>
        <div>• <strong>Elips Eksenleri & Açı Formülü (Denklem 2.24 - 2.26):</strong>
          $$a = \\sinh(D) = ${d.sinhD.toFixed(5)}, \\quad b = \\cosh(D) = ${d.coshD.toFixed(5)}, \\quad \\phi_m = \\frac{2m - 1}{2n}\\pi$$
        </div>
        <div>• <strong>Kutup Koordinatları & Biquad Katsayıları (Denklem 2.27 - 2.31):</strong>
          $$\\sigma_m = -\\sinh(D)\\sin\\phi_m, \\quad \\omega_m = \\cosh(D)\\cos\\phi_m, \\quad B_{1,m} = -2\\sigma_m, \\quad B_{2,m} = \\sigma_m^2 + \\omega_m^2$$
        </div>
      `;
    } else if (d.approx === 'inv_chebyshev') {
      orderDerivationHtml = `
        <div>• <strong>Derece Hesabı (Denklem 2.21):</strong>
          $$n_{IC} \\ge \\frac{\\cosh^{-1}(\\epsilon_s / \\epsilon)}{\\cosh^{-1}(r)} \\implies n = ${effectiveN}$$
        </div>
      `;
      geomParamHtml = `
        <div>• <strong>Durdurma Bandı Parametresi D_s (Denklem 2.28):</strong>
          $$D_s = \\frac{1}{n}\\sinh^{-1}(\\epsilon_s) = \\frac{1}{${effectiveN}}\\sinh^{-1}(${eps_s.toFixed(4)}) = ${(Math.asinh(eps_s) / effectiveN).toFixed(5)}$$
        </div>
        <div>• <strong>İletim Sıfırları & Kutup Formülleri (Denklem 2.29 - 2.31):</strong>
          $$\\omega_{z,m} = \\frac{1}{\\cos\\phi_m}, \\quad \\sigma_m = \\frac{-\\sinh(D_s)\\sin\\phi_m}{\\sinh^2(D_s)\\sin^2\\phi_m + \\cosh^2(D_s)\\cos^2\\phi_m}$$
        </div>
      `;
    } else if (d.approx === 'elliptic') {
      orderDerivationHtml = `
        <div>• <strong>Jacobi Eliptik Modülü ve Derece Hesabı (Bölüm 2.5):</strong>
          $$k = \\frac{1}{r} = \\frac{1}{${r_val.toFixed(4)}} = ${(1 / r_val).toFixed(4)}, \\quad k_1 = \\frac{\\epsilon}{\\epsilon_s} = \\frac{${eps.toFixed(4)}}{${eps_s.toFixed(4)}} = ${(eps / eps_s).toFixed(4)} \\implies N_{\\min} = ${effectiveN}$$
        </div>
      `;
      geomParamHtml = `
        <div>• <strong>Eliptik Rasyonel Fonksiyonlar:</strong> Hem geçirme hem durdurma bandında Chebyshev polinomları yerine Jacobi $cd(u, k)$ eliptik fonksiyonları kullanılır.</div>
      `;
    }

    // Rows for table in Step 1
    let mRowsHtml = '';
    if (d.m_factors && d.m_factors.length > 0) {
      d.m_factors.forEach(f => {
        const wzCol = (d.approx === 'inv_chebyshev' || d.approx === 'elliptic')
          ? `<td style="font-family: var(--font-mono); color: #8b5cf6; white-space: nowrap;">±j${(f.wz || 0).toFixed(4)}</td>`
          : '';
        const angleCol = f.theta_rad !== undefined
          ? `${f.theta_rad.toFixed(4)} rad (${f.theta_deg.toFixed(1)}°)`
          : (f.phi_rad !== undefined ? `${f.phi_rad.toFixed(4)} rad (${f.phi_deg.toFixed(1)}°)` : '-');

        const biquadEq = (d.approx === 'inv_chebyshev' && f.wz)
          ? `$\\frac{${(f.B2 / (f.wz * f.wz)).toFixed(4)}S^2 + ${f.B2.toFixed(4)}}{S^2 + ${f.B1.toFixed(4)}S + ${f.B2.toFixed(4)}}$`
          : `$\\frac{${f.B2.toFixed(4)}}{S^2 + ${f.B1.toFixed(4)}S + ${f.B2.toFixed(4)}}$`;

        mRowsHtml += `
          <tr>
            <td style="font-weight: 700; font-family: var(--font-mono); color: var(--accent); white-space: nowrap;">Kat ${f.m}</td>
            <td style="font-family: var(--font-mono); white-space: nowrap;">${angleCol}</td>
            <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${f.sigma.toFixed(5)}</td>
            <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±j${f.omega.toFixed(5)}</td>
            ${wzCol}
            <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B1.toFixed(5)}</td>
            <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B2.toFixed(5)}</td>
            <td style="font-family: var(--font-mono); font-size: 12.5px; white-space: nowrap;">${biquadEq}</td>
          </tr>
        `;
      });
    }

    let realPoleRowHtml = '';
    if (d.realPole) {
      const wzCol = (d.approx === 'inv_chebyshev' || d.approx === 'elliptic') ? `<td>-</td>` : '';
      realPoleRowHtml = `
        <tr style="background: rgba(61,90,254,0.03);">
          <td style="font-weight: 700; font-family: var(--font-mono); color: #3d5afe; white-space: nowrap;">1. Derece (Reel)</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">π rad (180.0°)</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${d.realPole.sigma_R.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #787774; white-space: nowrap;">0.00000</td>
          ${wzCol}
          <td style="font-family: var(--font-mono); white-space: nowrap;">-</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${d.realPole.B2.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-size: 12.5px; white-space: nowrap;">$\\frac{${d.realPole.B2.toFixed(4)}}{S + ${d.realPole.B2.toFixed(4)}}$</td>
        </tr>
      `;
    }

    // =========================================================================
    // SECTION 2: CHAPTER 3 FREQUENCY TRANSFORMATIONS (Normalize Olmayan modda)
    // =========================================================================
    let section2Html = '';
    if (!isNorm) {
      let typeTitle = '';
      let transformKernel = '';
      let paramDerivation = '';
      let biquadScalingDesc = '';

      if (state.type === 'lowpass') {
        typeTitle = 'Alçak Geçiren (Lowpass Dönüşümü: LP → LP, Denklem 3.1 & 3.2)';
        transformKernel = 'S \\leftarrow \\frac{s}{\\omega_0}';
        const w0 = Array.isArray(wp_val) ? wp_val[0] : wp_val;
        paramDerivation = `
          $$\\omega_0 = 2\\pi \\cdot f_{\\text{pass}} = 2\\pi \\cdot ${state.fpass} = ${w0.toFixed(2)}\\text{ rad/s}$$
        `;
        biquadScalingDesc = `
          Normalize katın paydasındaki $S$ yerine $\\frac{s}{\\omega_0}$ yazıldığında:
          $$H_m(s) = \\left. \\frac{B_2}{S^2 + B_1 S + B_2} \\right|_{S = \\frac{s}{\\omega_0}} = \\frac{B_2 \\omega_0^2}{s^2 + (B_1 \\omega_0) s + (B_2 \\omega_0^2)}$$
          Buradan gerçek biquad katsayıları:
          $$b_{1,m} = B_{1,m} \\cdot \\omega_0 = B_{1,m} \\cdot ${w0.toFixed(1)}$$
          $$b_{2,m} = B_{2,m} \\cdot \\omega_0^2 = B_{2,m} \\cdot (${w0.toFixed(1)})^2$$
        `;
      } else if (state.type === 'highpass') {
        typeTitle = 'Yüksek Geçiren (Highpass Dönüşümü: LP → HP, Denklem 3.5 & 3.6)';
        transformKernel = 'S \\leftarrow \\frac{\\omega_0}{s}';
        const w0 = Array.isArray(wp_val) ? wp_val[0] : wp_val;
        paramDerivation = `
          $$\\omega_0 = 2\\pi \\cdot f_{\\text{pass}} = 2\\pi \\cdot ${state.fpass} = ${w0.toFixed(2)}\\text{ rad/s}$$
        `;
        biquadScalingDesc = `
          Normalize katın paydasındaki $S$ yerine $\\frac{\\omega_0}{s}$ yazıldığında:
          $$H_m(s) = \\left. \\frac{B_2}{S^2 + B_1 S + B_2} \\right|_{S = \\frac{\\omega_0}{s}} = \\frac{s^2}{s^2 + \\left(\\frac{B_1 \\omega_0}{B_2}\\right) s + \\left(\\frac{\\omega_0^2}{B_2}\\right)}$$
          Buradan gerçek biquad katsayıları:
          $$b_{1,m} = \\frac{B_{1,m} \\cdot \\omega_0}{B_{2,m}}, \\quad b_{2,m} = \\frac{\\omega_0^2}{B_{2,m}}$$
        `;
      } else if (state.type === 'bandpass') {
        typeTitle = 'Bant Geçiren (Bandpass Dönüşümü: LP → BP, Denklem 3.12 - 3.14)';
        transformKernel = 'S \\leftarrow \\frac{s^2 + \\omega_0^2}{B s}';
        const w0 = Math.sqrt(wp_val[0] * wp_val[1]);
        const B = wp_val[1] - wp_val[0];
        paramDerivation = `
          $$\\omega_0 = \\sqrt{\\omega_{p1} \\cdot \\omega_{p2}} = \\sqrt{${wp_val[0].toFixed(1)} \\cdot ${wp_val[1].toFixed(1)}} = ${w0.toFixed(2)}\\text{ rad/s}$$
          $$B = \\omega_{p2} - \\omega_{p1} = ${wp_val[1].toFixed(1)} - ${wp_val[0].toFixed(1)} = ${B.toFixed(2)}\\text{ rad/s}, \\quad Q = \\frac{\\omega_0}{B} = ${(w0 / B).toFixed(3)}$$
        `;
        biquadScalingDesc = `
          Her 2. derece normalize prototip katı ($S^2 + B_1 S + B_2$), geometrik simetrik iki adet 2. derece bant geçiren biquad kata ayrışır:
          $$\\omega_{01} = \\omega_0 \\left(1 + \\frac{B}{2\\omega_0}\\right), \\quad \\omega_{02} = \\omega_0 \\left(1 + \\frac{B}{2\\omega_0}\\right)^{-1}$$
        `;
      } else if (state.type === 'bandstop') {
        typeTitle = 'Bant Söndüren (Bandstop / Çentik Dönüşümü: LP → BS, Denklem 3.20 - 3.22)';
        transformKernel = 'S \\leftarrow \\frac{B s}{s^2 + \\omega_0^2}';
        const w0 = Math.sqrt(ws_val[0] * ws_val[1]);
        const B = wp_val[1] - wp_val[0];
        paramDerivation = `
          $$\\omega_0 = \\sqrt{\\omega_{s1} \\cdot \\omega_{s2}} = \\sqrt{${ws_val[0].toFixed(1)} \\cdot ${ws_val[1].toFixed(1)}} = ${w0.toFixed(2)}\\text{ rad/s}$$
          $$B = \\omega_{p2} - \\omega_{p1} = ${wp_val[1].toFixed(1)} - ${wp_val[0].toFixed(1)} = ${B.toFixed(2)}\\text{ rad/s}$$
        `;
        biquadScalingDesc = `
          $j\\omega_0$ sanal ekseninde saf imajiner sıfırlar $\\pm j\\omega_0$ oluşturularak derin çentik zayıflatması sağlanır:
          $$H_m(s) = \\frac{s^2 + \\omega_0^2}{s^2 + b_1 s + \\omega_0^2}$$
        `;
      }

      // Stage rows for unnormalized filter model
      let unnormStagesRows = '';
      if (filterModel && filterModel.stages) {
        filterModel.stages.forEach((st, idx) => {
          const numStr = st.order === 1
            ? (st.stageType === 'highpass_1st' ? 's' : `${(st.b2 || 0).toFixed(1)}`)
            : (st.a2 && st.a0 ? `${st.a2.toFixed(3)}s^2 + ${st.a0.toFixed(1)}` : (st.a2 ? 's^2' : (st.a1 ? `${st.a1.toFixed(1)}s` : `${st.b2.toFixed(1)}`)));
          const denStr = st.order === 1
            ? `s + ${st.b2.toFixed(1)}`
            : `s^2 + ${st.b1.toFixed(1)}s + ${st.b2.toFixed(1)}`;

          unnormStagesRows += `
            <tr>
              <td style="font-weight: 700; font-family: var(--font-mono); color: #10b981;">Aşama ${idx + 1}</td>
              <td>${st.order}. Derece (${st.stageType})</td>
              <td style="font-family: var(--font-mono);">${st.w0 ? st.w0.toFixed(1) : '-'} rad/s (${(st.w0 / (2 * Math.PI)).toFixed(1)} Hz)</td>
              <td style="font-family: var(--font-mono); font-weight: 600;">Q = ${st.Q ? st.Q.toFixed(3) : '-'}</td>
              <td style="font-family: var(--font-mono);">${st.b1 ? st.b1.toFixed(2) : '-'}</td>
              <td style="font-family: var(--font-mono);">${st.b2.toFixed(2)}</td>
              <td style="font-family: var(--font-mono); font-size: 12.5px; white-space: nowrap;">$H_${idx + 1}(s) = \\frac{${numStr}}{${denStr}}$</td>
            </tr>
          `;
        });
      }

      section2Html = `
        <div class="formula-step-card stage-ch3">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="stage-badge" style="background: #10b981; color: #fff; font-weight: 700;">AŞAMA 2</span>
              <strong style="font-size: 15px; color: var(--text-h);">${typeTitle}</strong>
            </div>
            <span class="stage-badge" style="background: rgba(16,185,129,0.1); color: #10b981;">Frekans Dönüşümü</span>
          </div>

          <div class="formula-param-grid">
            <div class="formula-param-item">
              <div class="formula-param-label">Dönüşüm Çekirdeği Formülü</div>
              <div class="formula-param-val" style="color: #10b981;">$${transformKernel}$</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Frekans Birimi</div>
              <div class="formula-param-val">${isRadS ? 'Açısal (rad/s)' : 'Hertz (Hz) → ω = 2πf'}</div>
            </div>
          </div>

          <div class="formula-math-box">
            ${paramDerivation}
            <div style="font-size: 13px; color: var(--text); margin-top: 6px;">
              ${biquadScalingDesc}
            </div>
          </div>

          <div class="formula-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Aşama</th>
                  <th>Kat Yapısı</th>
                  <th>Kutup Frekansı (ω₀)</th>
                  <th>Kalite Faktörü (Q)</th>
                  <th>b₁ Katsayısı</th>
                  <th>b₂ Katsayısı</th>
                  <th>Gerçek Frekanslı Transfer Katı H(s)</th>
                </tr>
              </thead>
              <tbody>
                ${unnormStagesRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // SECTION 3: CHAPTER 4 ACTIVE OP-AMP CIRCUIT SYNTHESIS (Normalize Olmayan modda)
    // =========================================================================
    let section3Html = '';
    if (!isNorm && circuitModel && circuitModel.stages) {
      let stagesCircuitRows = '';
      circuitModel.stages.forEach(st => {
        const lbl = st.labels || {};
        let compSummary = '';
        if (lbl.R1 && lbl.R2) {
          compSummary = `R₁ = ${lbl.R1}, R₂ = ${lbl.R2}, C₁ = ${lbl.C1 || '-'}, C₂ = ${lbl.C2 || '-'}`;
        } else if (lbl.R1 && lbl.C1) {
          compSummary = `R₁ = ${lbl.R1}, C₁ = ${lbl.C1}`;
        } else if (lbl.R && lbl.C) {
          compSummary = `R = ${lbl.R}, C = ${lbl.C}${lbl.R_half ? `, R/2 = ${lbl.R_half}` : ''}${lbl.C_double ? `, 2C = ${lbl.C_double}` : ''}`;
        } else {
          compSummary = 'R, C Elemanları';
        }

        const gainResistors = (lbl.RA && lbl.RB)
          ? `R_A = ${lbl.RA}, R_B = ${lbl.RB}`
          : (st.K === 1 ? 'Tampon (Geribesleme Direnci Gerekmez)' : '-');

        stagesCircuitRows += `
          <tr>
            <td style="font-weight: 700; font-family: var(--font-mono); color: #f59e0b;">Kat ${st.stageNum}</td>
            <td>${st.topology}</td>
            <td style="font-family: var(--font-mono); font-weight: 700; color: #3d5afe;">K = ${st.K ? st.K.toFixed(3) : '1.000'}</td>
            <td style="font-family: var(--font-mono);">${compSummary}</td>
            <td style="font-family: var(--font-mono);">${gainResistors}</td>
          </tr>
        `;
      });

      const div = circuitModel.divider;
      const divHtml = div && div.needed ? `
        <div style="background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.25); border-radius: 6px; padding: 12px 16px; margin-top: 12px;">
          <div style="font-size: 13px; font-weight: 700; color: #b45309; margin-bottom: 4px;">
            ⚡ Çıkış Gerilim Bölücüsü ile Kazanç Dengeleme (0 dB DC Kazanç Hedefi):
          </div>
          <div style="font-size: 12.5px; color: var(--text);">
            Filtre katlarının toplam kazancı $K_{\\text{tot}} = ${circuitModel.Ktot.toFixed(3)}$ olduğundan, hedef $1.000$ kazancı elde etmek için çıkış gerilim bölücüsü zayıflatması:
            $$G_A = \\frac{1}{K_{\\text{tot}}} = \\frac{1}{${circuitModel.Ktot.toFixed(3)}} = ${div.GA.toFixed(3)}$$
            Hedef $10\\text{ k}\\Omega$ çıkış empedansı için bölücü dirençleri:
            $$R_x = \\frac{R_{\\text{hedef}}}{G_A} = ${div.labelRx}, \\quad R_y = \\frac{R_{\\text{hedef}}}{1 - G_A} = ${div.labelRy}$$
          </div>
        </div>
      ` : `
        <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.25); border-radius: 6px; padding: 10px 14px; margin-top: 12px; font-size: 12.5px; color: #065f46;">
          ✓ Toplam devre kazancı hedeflenen kazanç ile uyumludur ($K_{\\text{tot}} = ${circuitModel.Ktot.toFixed(3)}$), ilave gerilim bölücü zayıflatması gerekmez.
        </div>
      `;

      section3Html = `
        <div class="formula-step-card stage-ch4">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="stage-badge" style="background: #f59e0b; color: #fff; font-weight: 700;">AŞAMA 3</span>
              <strong style="font-size: 15px; color: var(--text-h);">Op-Amp Aktif Devre Sentezi & Eleman Değerleri Formülleri (Les Thede Bölüm 4)</strong>
            </div>
            <span class="stage-badge" style="background: rgba(245,158,11,0.1); color: #f59e0b;">Sallen-Key Devreleri</span>
          </div>

          <div class="formula-param-grid">
            <div class="formula-param-item">
              <div class="formula-param-label">Seçilen Taban Kapasitör (C)</div>
              <div class="formula-param-val" style="color: #f59e0b;">${(state.baseC * 1e9).toFixed(1)} nF</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Geri Besleme Referans Direnci (RA)</div>
              <div class="formula-param-val">10.0 kΩ</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Standart Değer Yuvarlama</div>
              <div class="formula-param-val">${state.useStandard ? 'E24 / E12 Standart Değerler' : 'Hassas (Tam) Değerler'}</div>
            </div>
          </div>

          <div class="formula-math-box">
            <div style="font-weight: 700; color: var(--text-h); margin-bottom: 4px;">Devre Elemanı Tasarım Formülleri (Denklem 4.6 - 4.12):</div>
            <div>• <strong>Eşit Direnç Formülü:</strong> $R = \\frac{1}{C\\sqrt{b_2}}$ (1. Derece RC Tampon katı için: $R = \\frac{1}{b_2 C}$)</div>
            <div>• <strong>Op-Amp DC Kazancı Formülü:</strong> $K = 3 - \\frac{b_1}{\\sqrt{b_2}}$ (1. Derece Tampon için: $K = 1.0$)</div>
            <div>• <strong>Geri Besleme Direnci Formülü:</strong> $R_B = (K - 1) \\cdot R_A = (K - 1) \\cdot 10\\text{ k}\\Omega$</div>
          </div>

          <div class="formula-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kat</th>
                  <th>Devre Topolojisi</th>
                  <th>Kat Kazancı (K)</th>
                  <th>Filtre Elemanları (R & C)</th>
                  <th>Geri Besleme Dirençleri (RA & RB)</th>
                </tr>
              </thead>
              <tbody>
                ${stagesCircuitRows}
              </tbody>
            </table>
          </div>

          ${divHtml}
        </div>
      `;
    }

    // =========================================================================
    // COMBINED HTML COMPOSITION
    // =========================================================================
    const fullHtml = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- STAGE 1: Chapter 2 Normalized Prototype -->
        <div class="formula-step-card stage-ch2">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="stage-badge" style="background: #3d5afe; color: #fff; font-weight: 700;">AŞAMA 1</span>
              <strong style="font-size: 15px; color: var(--text-h);">Normalize Filtre Prototipi & Yaklaşım Fonksiyonu Hesabı (Les Thede Bölüm 2)</strong>
            </div>
            <span class="stage-badge" style="background: rgba(61,90,254,0.1); color: #3d5afe;">Ω_p = 1.0 rad/s Prototip</span>
          </div>

          <!-- Top Parameter Cards -->
          <div class="formula-param-grid">
            <div class="formula-param-item">
              <div class="formula-param-label">Geçiş Oranı (r = Ω_s / Ω_p)</div>
              <div class="formula-param-val" style="color: #3d5afe;">r = ${r_val.toFixed(4)}</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Dalgalanma Faktörü (ε)</div>
              <div class="formula-param-val">$$\\epsilon = \\sqrt{10^{0.1 \\cdot ${state.passDb}} - 1} = ${eps.toFixed(5)}$$</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Durdurma Faktörü (ε_s)</div>
              <div class="formula-param-val">$$\\epsilon_s = \\sqrt{10^{0.1 \\cdot ${state.stopDb}} - 1} = ${eps_s.toFixed(5)}$$</div>
            </div>
            <div class="formula-param-item">
              <div class="formula-param-label">Filtre Derecesi (n)</div>
              <div class="formula-param-val" style="color: var(--accent);">n = ${effectiveN} ${state.manualOrder ? '(Manuel)' : '(Otomatik)'}</div>
            </div>
          </div>

          <!-- Equations Box -->
          <div class="formula-math-box">
            ${orderDerivationHtml}
            ${geomParamHtml}
          </div>

          <!-- Prototype Table -->
          <div class="formula-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Kat</th>
                  <th>Kutup Açısı</th>
                  <th>Reel (σ)</th>
                  <th>İmajiner (±jω)</th>
                  ${(d.approx === 'inv_chebyshev' || d.approx === 'elliptic') ? '<th>Sıfır (±jω_z)</th>' : ''}
                  <th>B₁ Katsayısı</th>
                  <th>B₂ Katsayısı</th>
                  <th>Normalize Biquad Katı H_m(S)</th>
                </tr>
              </thead>
              <tbody>
                ${mRowsHtml}
                ${realPoleRowHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- STAGE 2: Chapter 3 Frequency Transformations -->
        ${section2Html}

        <!-- STAGE 3: Chapter 4 Active Circuits -->
        ${section3Html}
      </div>
    `;

    // Render into inline accordion container
    inlineContainer.innerHTML = fullHtml;

    // Render into expanded modal container
    if (modalContainer) {
      modalContainer.innerHTML = fullHtml;
    }

    // Trigger KaTeX rendering
    if (window.renderMathInElement) {
      window.renderMathInElement(inlineContainer, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
      if (modalContainer) {
        window.renderMathInElement(modalContainer, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
    }
  }

  function setupAnalyticalStepsToggle() {
    const toggleBtn = els.toggleAnalyticalStepsBtn;
    const bodyEl = els.analyticalStepsBody;
    const accordionBtn = els.btnToggleAnalyticalStepsAccordion;
    const textEl = els.analyticalStepsToggleText;

    const doToggle = () => {
      if (!bodyEl) return;
      const isHidden = bodyEl.style.display === 'none';
      bodyEl.style.display = isHidden ? 'block' : 'none';
      if (textEl) textEl.textContent = isHidden ? '▾ Detayları Gizle' : '▸ Detayları Göster';
    };

    if (accordionBtn) {
      accordionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        doToggle();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        if (e.target.closest('#btnOpenFormulaModal') || e.target.closest('#btnToggleAnalyticalStepsAccordion')) return;
        doToggle();
      });
    }

    // Setup Fullscreen Formula Modal
    if (els.btnOpenFormulaModal && els.formulaModalOverlay) {
      els.btnOpenFormulaModal.addEventListener('click', (e) => {
        e.stopPropagation();
        els.formulaModalOverlay.style.display = 'flex';
        if (window.renderMathInElement && els.formulaModalBody) {
          window.renderMathInElement(els.formulaModalBody, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        }
      });
    }

    if (els.closeFormulaModalBtn && els.formulaModalOverlay) {
      els.closeFormulaModalBtn.addEventListener('click', () => {
        els.formulaModalOverlay.style.display = 'none';
      });
    }

    if (els.formulaModalOverlay) {
      els.formulaModalOverlay.addEventListener('click', (e) => {
        if (e.target === els.formulaModalOverlay) {
          els.formulaModalOverlay.style.display = 'none';
        }
      });
    }

    if (els.btnPrintFormulaReportBtn) {
      els.btnPrintFormulaReportBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  function drawAllPlots() {
    if (!state.filterModel) return;

    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    const isRadS = state.unit === 'rad/s';

    const toHz = (v) => (isRadS ? v / (2 * Math.PI) : v);
    const fpHz = isBand ? [toHz(state.fpass), toHz(state.fpass2)] : toHz(state.fpass);
    const fsHz = isBand ? [toHz(state.fstop), toHz(state.fstop2)] : toHz(state.fstop);

    let fMin = isBand ? Math.min(fpHz[0], fsHz[0]) / 5 : fpHz / 10;
    let fMax = isBand ? Math.max(fpHz[1], fsHz[1]) * 5 : fsHz * 10;
    fMin = Math.max(0.01, fMin);

    // Compute frequency response
    const resp = FilterMath.computeFrequencyResponse(state.filterModel, fMin, fMax, 350);

    // 1. Bode Magnitude
    FilterPlotter.drawBodeMag(
      els.canvasBodeMag,
      resp.freqs,
      resp.magDb,
      state.passDb,
      state.stopDb,
      fpHz,
      fsHz
    );

    // 2. Bode Phase
    FilterPlotter.drawBodePhase(els.canvasBodePhase, resp.freqs, resp.phaseDeg);

    // 3. Pole-Zero Map (Normalized s-plane prototype from Chapter 2)
    const protoPoles = (state.proto && state.proto.poles) ? state.proto.poles : [];
    const protoZeros = (state.proto && state.proto.zeros) ? state.proto.zeros : [];
    FilterPlotter.drawPoleZero(els.canvasPoleZero, protoPoles, protoZeros);

    // 4. Step Response - Window sized for full settling
    const baseFreq = isBand ? Math.sqrt(fpHz[0] * fpHz[1]) : fpHz;
    const tMax = 12 / (2 * Math.PI * Math.max(0.01, baseFreq));
    const step = FilterMath.computeStepResponse(state.filterModel, Math.max(1e-4, tMax), 250);
    FilterPlotter.drawStepResponse(els.canvasStep, step.times, step.stepResponse);
  }

  function drawComparePlot() {
    const canvas = els.canvasCompare;
    if (!canvas || canvas.clientWidth <= 10 || canvas.clientHeight <= 10) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const pad = { left: 55, right: 30, top: 40, bottom: 40 };
    const pw = Math.max(10, w - pad.left - pad.right);
    const ph = Math.max(10, h - pad.top - pad.bottom);

    const fMin = Math.max(1, state.fpass / 10);
    const fMax = state.fstop * 10;
    const logMinF = Math.log10(fMin);
    const logMaxF = Math.log10(fMax);

    const minDb = -80;
    const maxDb = 5;

    const xMap = (f) => pad.left + ((Math.log10(f) - logMinF) / (logMaxF - logMinF)) * pw;
    const yMap = (db) => pad.top + ((maxDb - db) / (maxDb - minDb)) * ph;

    // Grid lines for frequency decades
    ctx.strokeStyle = '#f0efe9';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#787774';
    ctx.font = '10.5px Inter, sans-serif';

    const minDecade = Math.floor(logMinF);
    const maxDecade = Math.ceil(logMaxF);

    for (let d = minDecade; d <= maxDecade; d++) {
      for (let m = 1; m <= 9; m++) {
        const val = m * Math.pow(10, d);
        if (val < fMin || val > fMax) continue;
        const x = xMap(val);
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + ph);
        ctx.stroke();

        if (m === 1) {
          ctx.fillText(formatFreqShort(val), x - 10, pad.top + ph + 16);
        }
      }
    }

    // Grid dB
    for (let db = maxDb; db >= minDb; db -= 20) {
      const y = yMap(db);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pw, y);
      ctx.stroke();
      ctx.fillText(`${db} dB`, pad.left - 45, y + 4);
    }

    const approxList = [
      { id: 'butterworth', name: 'Butterworth', color: '#3d5afe' },
      { id: 'chebyshev', name: 'Chebyshev I', color: '#ef4444' },
      { id: 'inv_chebyshev', name: 'Ters Chebyshev', color: '#10b981' },
      { id: 'elliptic', name: 'Eliptik (Cauer)', color: '#8b5cf6' }
    ];

    approxList.forEach((app, idx) => {
      const proto = FilterMath.getNormalizedPrototype(app.id, state.order, state.passDb, state.stopDb);
      const model = FilterMath.unnormalizeFilter(proto, state.type, state.fpass, state.fstop);
      const resp = FilterMath.computeFrequencyResponse(model, fMin, fMax, 300);

      ctx.strokeStyle = app.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i < resp.freqs.length; i++) {
        const x = xMap(resp.freqs[i]);
        const y = Math.max(pad.top - 5, Math.min(pad.top + ph + 5, yMap(resp.magDb[i])));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Legend entry evenly spaced across plot width
      const itemW = pw / 4;
      const legX = pad.left + idx * itemW + 4;
      ctx.fillStyle = app.color;
      ctx.fillRect(legX, pad.top - 22, 10, 10);
      ctx.fillStyle = '#2f2e2b';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText(`${app.name}`, legX + 14, pad.top - 13);
    });

    ctx.strokeStyle = '#e3e2de';
    ctx.lineWidth = 1;
    ctx.strokeRect(pad.left, pad.top, pw, ph);
  }

  function formatFreqShort(f) {
    if (f >= 1e6) return (f / 1e6).toFixed(0) + 'M';
    if (f >= 1e3) return (f / 1e3).toFixed(0) + 'k';
    return f.toFixed(0);
  }

  function updateCircuitView(circuitModel) {
    if (!els.circuitStagesWrap) return;
    const total = circuitModel.stages.length;

    let html = '';
    circuitModel.stages.forEach((st, idx) => {
      html += CircuitEngine.renderStageSVG(st, idx, total, circuitModel.divider);
    });

    els.circuitStagesWrap.innerHTML = html;

    if (els.circuitDividerWrap) {
      els.circuitDividerWrap.innerHTML = CircuitEngine.renderDividerCard(circuitModel.divider);
    }
  }

  function updateCodeView(filterModel, circuitModel) {
    const config = {
      approx: state.approx,
      type: state.type,
      unit: state.unit,
      fpass: (state.type === 'bandpass' || state.type === 'bandstop') ? [state.fpass, state.fpass2] : state.fpass,
      fstop: (state.type === 'bandpass' || state.type === 'bandstop') ? [state.fstop, state.fstop2] : state.fstop,
      passDb: state.passDb,
      stopDb: state.stopDb,
      order: state.order,
      manualOrder: state.manualOrder
    };

    const matlabCode = MatlabEngine.generateMatlabCode(config, filterModel, circuitModel);
    const spiceNetlist = MatlabEngine.generateSpiceNetlist(config, circuitModel);

    if (els.matlabCodePre) els.matlabCodePre.textContent = matlabCode;
    if (els.spiceCodePre) els.spiceCodePre.textContent = spiceNetlist;
  }

  // Theory Module Rendering
  function renderTheoryNav() {
    if (!els.chapterPills) return;
    let html = '';
    BookContent.chapters.forEach(ch => {
      html += `<button class="chapter-pill ${ch.id === state.currentChapter ? 'active' : ''}" data-ch="${ch.id}">${ch.title}</button>`;
    });
    els.chapterPills.innerHTML = html;

    els.chapterPills.querySelectorAll('[data-ch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const chId = btn.getAttribute('data-ch');
        window.location.hash = '#/' + chId;
      });
    });
  }

  function renderChapterContent(chId) {
    if (!els.theoryBody) return;
    const ch = BookContent.chapters.find(c => c.id === chId) || BookContent.chapters[0];

    // Sync chapter navigation pills
    if (els.chapterPills) {
      els.chapterPills.querySelectorAll('.chapter-pill').forEach(btn => {
        if (btn.getAttribute('data-ch') === ch.id) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    let html = `
      <div class="theory-header" style="margin-bottom: 22px;">
        <span class="stage-badge">${ch.badge}</span>
        <h2 style="font-size: 22px; font-weight: 700; margin: 8px 0 4px; color: var(--text-h);">${ch.title}</h2>
        <p style="color: var(--muted); font-size: 13.5px;">${ch.summary}</p>
      </div>
    `;

    ch.sections.forEach(sec => {
      html += `
        <div class="theory-section card">
          <h3 style="font-size: 16px; font-weight: 700; color: var(--text-h); margin-bottom: 12px;">${sec.title}</h3>
          <div>${sec.content}</div>
        </div>
      `;
    });

    els.theoryBody.innerHTML = html;

    // Populate chapter examples if available
    const chNumMap = { ch2: 2, ch3: 3, ch4: 4 };
    const chNum = chNumMap[ch.id];
    if (chNum && typeof BookExamples !== 'undefined') {
      const container = document.getElementById(`${ch.id}ExamplesContainer`);
      if (container) {
        const chExamples = BookExamples.filter(e => e.chapter === chNum);
        let exHtml = '';
        chExamples.forEach(ex => {
          const isBand = ex.type === 'bandpass' || ex.type === 'bandstop';
          const freqStr = isBand
            ? `Pass: [${ex.fpass}, ${ex.fpass2}] ${ex.unit} | Stop: [${ex.fstop}, ${ex.fstop2}] ${ex.unit}`
            : `Pass: ${ex.fpass} ${ex.unit} | Stop: ${ex.fstop} ${ex.unit}`;

          // Conversion note for 2*pi*f
          let convNote = '';
          if (ex.unit === 'Hz') {
            const w1 = (ex.fpass * 2 * Math.PI).toFixed(1);
            convNote = `2πf Dönüşümü: ω = 2π · ${ex.fpass} = ${w1} rad/s`;
          } else {
            const f1 = (ex.fpass / (2 * Math.PI)).toFixed(2);
            convNote = `Frekans Dönüşümü: f = ${ex.fpass} / 2π = ${f1} Hz`;
          }

          exHtml += `
            <div class="theory-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <strong style="color: var(--text-h); font-size: 13.5px;">Örnek ${ex.number}: ${ex.title}</strong>
                  <span class="example-badge">s.${ex.page}</span>
                </div>
                <div style="font-size: 11.5px; font-family: var(--font-mono); color: var(--muted); margin-bottom: 6px;">
                  ${ex.approx.toUpperCase()} | ${ex.type.toUpperCase()} | N=${ex.order} | ${freqStr}
                </div>
                <div style="font-size: 11px; color: var(--accent); font-family: var(--font-mono); margin-bottom: 6px;">
                  ${convNote}
                </div>
                <p style="font-size: 12px; color: var(--text); line-height: 1.4; margin-bottom: 12px;">${ex.description}</p>
              </div>
              <button class="btn btn-sm btn-primary" data-theory-load="${ex.id}" style="width: 100%; justify-content: center;">
                ⚡ Bu Örneği Tasarımcıda Aç ve Hesapla
              </button>
            </div>
          `;
        });
        container.innerHTML = exHtml;

        container.querySelectorAll('[data-theory-load]').forEach(btn => {
          btn.addEventListener('click', () => {
            const exId = btn.getAttribute('data-theory-load');
            const targetEx = BookExamples.find(e => e.id === exId);
            if (targetEx) loadBookExample(targetEx);
          });
        });
      }
    }

    // Trigger KaTeX rendering on math blocks if KaTeX is present
    if (window.renderMathInElement) {
      window.renderMathInElement(els.theoryBody, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  // Utilities
  function copyToClipboard(text, btn, feedbackText) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btn.innerHTML;
      btn.innerHTML = `✓ ${feedbackText}`;
      setTimeout(() => { btn.innerHTML = orig; }, 1800);
    });
  }

  function downloadFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // Run on start
  init();
});
