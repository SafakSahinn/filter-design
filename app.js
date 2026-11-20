/**
 * FilterDesign Studio - Main Application Controller
 * Handles UI interactions, live calculations, drawing and routing
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentTab: 'designer', // 'designer', 'circuit', 'matlab', 'compare', 'theory'
    currentChapter: 'ch1',
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

  function setFrequencyUnit(newUnit) {
    const oldUnit = state.unit;
    state.unit = newUnit;

    els.unitHzBtn.classList.toggle('active', newUnit === 'Hz');
    els.unitRadBtn.classList.toggle('active', newUnit === 'rad/s');

    const isRadS = newUnit === 'rad/s';
    const unitText = isRadS ? 'rad/s' : 'Hz';

    if (els.fpassUnit) els.fpassUnit.textContent = unitText;
    if (els.fstopUnit) els.fstopUnit.textContent = unitText;
    if (els.fpass2Unit) els.fpass2Unit.textContent = unitText;
    if (els.fstop2Unit) els.fstop2Unit.textContent = unitText;

    if (els.fpassLabel) els.fpassLabel.textContent = isRadS ? 'Açısal Frekans (ω_pass)' : 'Geçirme Frekansı (f_pass)';
    if (els.fstopLabel) els.fstopLabel.textContent = isRadS ? 'Açısal Frekans (ω_stop)' : 'Durdurma Frekansı (f_stop)';

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

    const isRadS = state.unit === 'rad/s';
    const unitText = isRadS ? 'rad/s' : 'Hz';
    if (els.fpassUnit) els.fpassUnit.textContent = unitText;
    if (els.fstopUnit) els.fstopUnit.textContent = unitText;
    if (els.fpass2Unit) els.fpass2Unit.textContent = unitText;
    if (els.fstop2Unit) els.fstop2Unit.textContent = unitText;

    if (els.fpassLabel) els.fpassLabel.textContent = isRadS ? 'Açısal Frekans (ω_pass)' : 'Geçirme Frekansı (f_pass)';
    if (els.fstopLabel) els.fstopLabel.textContent = isRadS ? 'Açısal Frekans (ω_stop)' : 'Durdurma Frekansı (f_stop)';

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

    // Check if it's a chapter route (e.g. #/ch1, #/ch2, #/ch3, #/ch4)
    if (hash.startsWith('ch')) {
      state.currentChapter = hash;
      switchTab('theory', hash);
      renderChapterContent(hash);
      return;
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
    // Filter Type
    els.filterTypeSelect.addEventListener('change', (e) => {
      state.type = e.target.value;
      const isBand = state.type === 'bandpass' || state.type === 'bandstop';
      els.fpass2Group.style.display = isBand ? 'flex' : 'none';
      els.fstop2Group.style.display = isBand ? 'flex' : 'none';
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

  // Core Calculation Pipeline
  function recalculateAll() {
    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    const isRadS = state.unit === 'rad/s';
    const fp = isBand ? [state.fpass, state.fpass2] : state.fpass;
    const fs = isBand ? [state.fstop, state.fstop2] : state.fstop;

    const toOmega = (v) => (isRadS ? v : 2 * Math.PI * v);
    const wp = isBand ? [toOmega(fp[0]), toOmega(fp[1])] : toOmega(fp);
    const ws = isBand ? [toOmega(fs[0]), toOmega(fs[1])] : toOmega(fs);

    // 1. Calculate Order
    let calcN = FilterMath.calculateOrder(state.type, state.approx, state.passDb, state.stopDb, wp, ws);
    let effectiveN = state.manualOrder ? state.order : calcN;
    state.order = effectiveN;
    if (!state.manualOrder && els.orderInput) {
      els.orderInput.value = effectiveN;
    }

    // 2. Normalized Prototype (Chapter 2)
    const proto = FilterMath.getNormalizedPrototype(state.approx, effectiveN, state.passDb, state.stopDb);
    state.proto = proto;

    // 3. Unnormalize to target specs (Chapter 3) - supports isRadS directly
    const filterModel = FilterMath.unnormalizeFilter(proto, state.type, fp, fs, isRadS);
    state.filterModel = filterModel;

    // 4. Synthesize Active Circuit (Chapter 4)
    const circuitModel = CircuitEngine.synthesizeCircuit(filterModel, state.baseC, state.baseRA, state.useStandard);
    state.circuitModel = circuitModel;

    // 5. Update UI Summary and 2*pi*f conversion hints
    updateFrequencyHints();
    updateSummaryBanner(effectiveN, filterModel, circuitModel);

    // 5b. Render Live Analytical Calculation Steps (Les Thede Chapter 2 Equations)
    renderAnalyticalSteps(proto, filterModel, effectiveN);

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

    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    const isRadS = state.unit === 'rad/s';
    if (isBand) {
      if (isRadS) {
        const w0 = Math.sqrt(state.fpass * state.fpass2);
        const f0 = w0 / (2 * Math.PI);
        els.sumW0.textContent = `ω₀ = ${w0.toFixed(1)} rad/s (${f0.toFixed(1)} Hz) | B = ${(state.fpass2 - state.fpass).toFixed(1)} rad/s`;
      } else {
        const f0 = Math.sqrt(state.fpass * state.fpass2);
        const w0 = 2 * Math.PI * f0;
        els.sumW0.textContent = `f₀ = ${f0.toFixed(1)} Hz (${w0.toFixed(0)} rad/s) | B = ${(state.fpass2 - state.fpass).toFixed(1)} Hz`;
      }
    } else {
      if (isRadS) {
        const f = state.fpass / (2 * Math.PI);
        els.sumW0.textContent = `ω_kesim = ${state.fpass} rad/s (${f.toFixed(2)} Hz)`;
      } else {
        const w = 2 * Math.PI * state.fpass;
        els.sumW0.textContent = `f_kesim = ${state.fpass} Hz (${w.toFixed(0)} rad/s)`;
      }
    }

    els.sumGain.textContent = `K_tot = ${circuitModel.Ktot.toFixed(3)}`;

    // Render transfer function H(s) in LaTeX or text
    let latex = 'H(s) = ';
    latex += `\\prod_{m=1}^{${totalStages}} H_m(s)`;
    if (window.katex && els.transferFuncMath) {
      try {
        window.katex.render(latex, els.transferFuncMath, { throwOnError: false });
      } catch (err) {
        els.transferFuncMath.textContent = latex;
      }
    }
  }

  // Render Live Analytical Steps Card (Les Thede Chapter 2 Equations & Tables)
  function renderAnalyticalSteps(proto, filterModel, effectiveN) {
    const container = document.getElementById('analyticalStepsBody');
    if (!container || !proto || !proto.details) return;

    const d = proto.details;
    const isBand = state.type === 'bandpass' || state.type === 'bandstop';
    const isRadS = state.unit === 'rad/s';
    const toOmega = (v) => (isRadS ? v : 2 * Math.PI * v);
    const wp_val = isBand ? toOmega(state.fpass) : toOmega(state.fpass);
    const ws_val = isBand ? toOmega(state.fstop) : toOmega(state.fstop);

    let html = '';

    if (d.approx === 'butterworth') {
      const eps = d.eps;
      const R = d.R;
      const mRows = d.m_factors.map(f => `
        <tr>
          <td style="font-weight: 700; font-family: var(--font-mono); color: var(--accent); white-space: nowrap;">m = ${f.m}</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${f.theta_rad.toFixed(4)} rad (${f.theta_deg.toFixed(1)}°)</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${f.sigma.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±${f.omega.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B1.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B2.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; white-space: nowrap;">$H_${f.m}(S) = \\frac{${f.B2.toFixed(4)}}{S^2 + ${f.B1.toFixed(4)}S + ${f.B2.toFixed(4)}}$</td>
        </tr>
      `).join('');

      const realPoleRow = d.realPole ? `
        <tr style="background: rgba(61,90,254,0.03);">
          <td style="font-weight: 700; font-family: var(--font-mono); color: #3d5afe; white-space: nowrap;">1. Derece (Reel)</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">π rad (180.0°)</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${d.realPole.sigma_R.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #787774; white-space: nowrap;">0.00000</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">-</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${d.realPole.B2.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; white-space: nowrap;">$H_0(S) = \\frac{${d.realPole.B2.toFixed(4)}}{S + ${d.realPole.B2.toFixed(4)}}$</td>
        </tr>
      ` : '';

      html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Top Parameter Badges -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 10px;">
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">DALGALANMA FAKTÖRÜ (Denklem 2.7)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-h); font-family: var(--font-mono); margin-top: 2px;">
                $\\epsilon = \\sqrt{10^{${(d.A_pass/10).toFixed(2)}} - 1} = ${eps.toFixed(6)}$
              </div>
            </div>

            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">FİLTRE DERECESİ (Denklem 2.8)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-h); font-family: var(--font-mono); margin-top: 2px;">
                $n_B = ${effectiveN}$ (Yuvarlanan Tamsayı)
              </div>
            </div>

            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; border-left: 3px solid var(--accent);">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">ÇEMBER YARIÇAPI (Denklem 2.9)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--accent); font-family: var(--font-mono); margin-top: 2px;">
                $R = \\epsilon^{-1/n} = ${R.toFixed(6)}$
              </div>
            </div>
          </div>

          <!-- Step by Step Equations Summary -->
          <div style="background: #fafaf9; border: 1px solid var(--border); border-radius: 6px; padding: 12px 16px;">
            <div style="font-size: 12.5px; font-weight: 700; color: var(--text-h); margin-bottom: 6px;">
              Les Thede Bölüm 2.2 Analitik Kutup ve Katsayı Formülleri:
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 8px; font-size: 12px; color: var(--text);">
              <div>• <strong>Açı Hesabı (2.10):</strong> $\\theta_m = \\frac{2m + 1 + n}{2n}\\pi$</div>
              <div>• <strong>Kutup Koordinatları (2.11 & 2.12):</strong> $\\sigma_m = R\\cos\\theta_m, \\; \\omega_m = R\\sin\\theta_m$</div>
              <div>• <strong>Biquad Katsayıları (2.16 & 2.17):</strong> $B_{1,m} = -2\\sigma_m, \\; B_{2,m} = \\sigma_m^2 + \\omega_m^2 = R^2$</div>
              <div>• <strong>Tek Derece Reel Kutup (2.13 & 2.14):</strong> $\\sigma_R = -R \\implies H_0(S) = \\frac{R}{S + R}$</div>
            </div>
          </div>

          <!-- Poles and Biquad Table -->
          <div style="overflow-x: auto;">
            <table class="compare-table" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="white-space: nowrap;">Kat (m)</th>
                  <th style="white-space: nowrap;">Açı ($\\theta_m$)</th>
                  <th style="white-space: nowrap;">Reel ($\\sigma_m$)</th>
                  <th style="white-space: nowrap;">İmajiner ($\\pm\\omega_m$)</th>
                  <th style="white-space: nowrap;">$B_{1,m}$ ($-2\\sigma_m$)</th>
                  <th style="white-space: nowrap;">$B_{2,m}$ ($R^2$)</th>
                  <th style="white-space: nowrap;">Normalize Biquad Katı $H_m(S)$ (Denklem 2.15)</th>
                </tr>
              </thead>
              <tbody>
                ${mRows}
                ${realPoleRow}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (d.approx === 'chebyshev') {
      const eps = d.eps;
      const D = d.D;
      const mRows = d.m_factors.map(f => `
        <tr>
          <td style="font-weight: 700; font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">m = ${f.m}</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${f.phi_rad.toFixed(4)} rad (${f.phi_deg.toFixed(1)}°)</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${f.sigma.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±${f.omega.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B1.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B2.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; white-space: nowrap;">$H_${f.m}(S) = \\frac{${f.B2.toFixed(4)}}{S^2 + ${f.B1.toFixed(4)}S + ${f.B2.toFixed(4)}}$</td>
        </tr>
      `).join('');

      const realPoleRow = d.realPole ? `
        <tr style="background: rgba(239,68,68,0.03);">
          <td style="font-weight: 700; font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">1. Derece (Reel)</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">-</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${d.realPole.sigma_R.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #787774; white-space: nowrap;">0.00000</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">-</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${d.realPole.B2.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; white-space: nowrap;">$H_0(S) = \\frac{${d.realPole.B2.toFixed(4)}}{S + ${d.realPole.B2.toFixed(4)}}$</td>
        </tr>
      ` : '';

      html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">DALGALANMA FAKTÖRÜ (Denklem 2.20)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-h); font-family: var(--font-mono); margin-top: 2px;">
                $\\epsilon = ${eps.toFixed(6)}$
              </div>
            </div>
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">ELİPS PARAMETRESİ D (Denklem 2.23)</div>
              <div style="font-size: 15px; font-weight: 700; color: #ef4444; font-family: var(--font-mono); margin-top: 2px;">
                $D = ${D.toFixed(6)}$ ($\\sinh=${d.sinhD.toFixed(4)}, \\cosh=${d.coshD.toFixed(4)}$)
              </div>
            </div>
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">KAZANÇ AYARI (Denklem 2.32)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-h); font-family: var(--font-mono); margin-top: 2px;">
                ${effectiveN % 2 === 0 ? `$G = 10^{0.05 a_p} = ${d.G_even.toFixed(4)}$` : `$G = 1.0$ (Tek $n$)`}
              </div>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="compare-table" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="white-space: nowrap;">Kat (m)</th>
                  <th style="white-space: nowrap;">Açı ($\\phi_m$)</th>
                  <th style="white-space: nowrap;">Reel ($\\sigma_m$)</th>
                  <th style="white-space: nowrap;">İmajiner ($\\pm\\omega_m$)</th>
                  <th style="white-space: nowrap;">$B_{1,m}$</th>
                  <th style="white-space: nowrap;">$B_{2,m}$</th>
                  <th style="white-space: nowrap;">Normalize Biquad Katı $H_m(S)$ (Denklem 2.29)</th>
                </tr>
              </thead>
              <tbody>
                ${mRows}
                ${realPoleRow}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (d.approx === 'inv_chebyshev') {
      const mRows = d.m_factors.map(f => `
        <tr>
          <td style="font-weight: 700; font-family: var(--font-mono); color: #10b981; white-space: nowrap;">m = ${f.m}</td>
          <td style="font-family: var(--font-mono); white-space: nowrap;">${f.phi_rad.toFixed(4)} rad</td>
          <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±${f.wz.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${f.sigma.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±${f.omega.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B1.toFixed(5)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B2.toFixed(5)}</td>
        </tr>
      `).join('');

      html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px;">
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">DURDURMA FAKTÖRÜ ε_s (Denklem 2.27)</div>
              <div style="font-size: 15px; font-weight: 700; color: #10b981; font-family: var(--font-mono); margin-top: 2px;">
                $\\epsilon_s = ${d.eps_s.toFixed(6)}$
              </div>
            </div>
            <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
              <div style="font-size: 11px; color: var(--muted); font-weight: 600;">İLETİM SIFIRLARI (Denklem 2.29)</div>
              <div style="font-size: 15px; font-weight: 700; color: var(--text-h); font-family: var(--font-mono); margin-top: 2px;">
                $\\omega_{z,m} = 1 / \\cos(\\phi_m)$
              </div>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="compare-table" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="white-space: nowrap;">Kat (m)</th>
                  <th style="white-space: nowrap;">Açı ($\\phi_m$)</th>
                  <th style="white-space: nowrap;">Sıfır ($\\pm j\\omega_{z,m}$)</th>
                  <th style="white-space: nowrap;">Reel ($\\sigma_m$)</th>
                  <th style="white-space: nowrap;">İmajiner ($\\pm\\omega_m$)</th>
                  <th style="white-space: nowrap;">$B_{1,m}$</th>
                  <th style="white-space: nowrap;">$B_{2,m}$</th>
                </tr>
              </thead>
              <tbody>
                ${mRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (d.approx === 'elliptic') {
      const mRows = d.m_factors.map(f => `
        <tr>
          <td style="font-weight: 700; font-family: var(--font-mono); color: #8b5cf6; white-space: nowrap;">m = ${f.m}</td>
          <td style="font-family: var(--font-mono); color: #8b5cf6; white-space: nowrap;">±${f.wz.toFixed(4)}</td>
          <td style="font-family: var(--font-mono); color: #ef4444; white-space: nowrap;">${f.sigma.toFixed(4)}</td>
          <td style="font-family: var(--font-mono); color: #10b981; white-space: nowrap;">±${f.omega.toFixed(4)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B1.toFixed(4)}</td>
          <td style="font-family: var(--font-mono); font-weight: 600; white-space: nowrap;">${f.B2.toFixed(4)}</td>
        </tr>
      `).join('');

      html = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px;">
            <div style="font-size: 11px; color: var(--muted); font-weight: 600;">ELİPTİK (CAUER) MODÜL PARAMETRELERİ (Bölüm 2.5)</div>
            <div style="font-size: 14px; font-weight: 600; color: var(--text-h); font-family: var(--font-mono); margin-top: 4px;">
              $k = \\omega_p / \\omega_s = ${(wp_val / ws_val).toFixed(4)}$ | $N_{\\text{min}} = ${effectiveN}$ (Jacobi Eliptik Rasyonel Katları)
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="compare-table" style="font-size: 12px; width: 100%;">
              <thead>
                <tr>
                  <th style="white-space: nowrap;">Kat (m)</th>
                  <th style="white-space: nowrap;">İletim Sıfırı ($\\pm j\\omega_z$)</th>
                  <th style="white-space: nowrap;">Kutup Reel ($\\sigma$)</th>
                  <th style="white-space: nowrap;">Kutup İmajiner ($\\pm\\omega$)</th>
                  <th style="white-space: nowrap;">$B_{1,m}$</th>
                  <th style="white-space: nowrap;">$B_{2,m}$</th>
                </tr>
              </thead>
              <tbody>
                ${mRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Trigger KaTeX rendering on math in the container
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  }

  function setupAnalyticalStepsToggle() {
    const toggleBtn = document.getElementById('toggleAnalyticalStepsBtn');
    const bodyEl = document.getElementById('analyticalStepsBody');
    if (toggleBtn && bodyEl) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = bodyEl.style.display === 'none';
        bodyEl.style.display = isHidden ? 'block' : 'none';
        const textEl = document.getElementById('analyticalStepsToggleText');
        if (textEl) textEl.textContent = isHidden ? '▾ Detayları Gizle' : '▸ Detayları Göster';
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
