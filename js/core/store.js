const STORAGE_KEY = 'cuaderno_taller_v1';
const SCHEMA_VERSION = '1.0.0';
const SAVE_DEBOUNCE_MS = 500;

let persisted = null;
const ephemeral = { ui: {} };
let saveTimer = null;
const subscribers = new Set();

function makeDefaultFinalMission() {
  return {
    startedAt: null,
    completedAt: null,
    hypothesis: '',
    selectedChecks: [],
    checksReasoning: '',
    interpretation: '',
    diagnosis: '',
    repair: '',
    reflection1: '',
    reflection2: '',
    reflection3: ''
  };
}

function makeDefaultPersisted() {
  return {
    session: {
      sessionId: (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : String(Date.now()),
      groupName: '',
      members: [],
      startedAt: null,
      lastActivityAt: null,
      currentScreen: '/',
      lastWorkingScreen: null,
      screenScroll: 0,
      schemaVersion: SCHEMA_VERSION
    },
    stations: ['E1', 'E2', 'E3', 'E4'].map(id => ({
      stationId: id,
      state: 'pending',
      startedAt: null,
      completedAt: null,
      timeSpentSec: 0,
      prediction: null,
      measurements: [],
      check: null,
      conclusion: '',
      vehicleApplication: '',
      helpsUsed: [],
      manualQueries: []
    })),
    mission: {
      state: 'locked',
      startedAt: null,
      completedAt: null,
      timeSpentSec: 0,
      relevantInfoFilter: '',
      hypotheses: [],
      diagnosticPlan: '',
      executedActions: [],
      check: null,
      conclusion: '',
      report: null,
      helpsUsed: [],
      manualQueries: []
    },
    finalMission: makeDefaultFinalMission(),
    globalReflection: { r1: '', r2: '', r3: '' }
  };
}

export const store = {
  init() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.session && parsed.session.schemaVersion === SCHEMA_VERSION) {
          persisted = parsed;
          if (!persisted.finalMission) {
            persisted.finalMission = makeDefaultFinalMission();
          }
          if (persisted.session.lastWorkingScreen === undefined) {
            persisted.session.lastWorkingScreen = null;
          }
          return;
        }
        console.warn('Sesión incompatible. Se reinicia.');
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error cargando sesión:', err);
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
    persisted = makeDefaultPersisted();
  },

  get() {
    return { ...persisted, ...ephemeral };
  },

  getPersisted() {
    return persisted;
  },

  getEphemeral() {
    return ephemeral;
  },

  updatePersisted(fn) {
    const patch = fn(persisted);
    if (patch) Object.assign(persisted, patch);
    scheduleSave();
    notify();
  },
    replaceState(partial) {
    if (!partial || typeof partial !== 'object') {
      console.error('replaceState: estado inválido');
      return;
    }

    const defaults = makeDefaultPersisted();
    const session = {
      ...defaults.session,
      ...(partial.session || {}),
      schemaVersion: SCHEMA_VERSION,
      currentScreen: '/',
      lastWorkingScreen: '/mapa'
    };

    persisted = { ...defaults, ...partial, session };

    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (err) {
      console.error('Error guardando sesión importada:', err);
    }
    notify();
  },

  setEphemeral(patch) {
    Object.assign(ephemeral, patch);
    notify();
  },

  subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },

  flush() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (err) {
      console.error('Error guardando sesión:', err);
    }
  },

  reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    persisted = makeDefaultPersisted();
    notify();
  }
};

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch (err) {
      console.error('Error guardando sesión:', err);
    }
  }, SAVE_DEBOUNCE_MS);
}

function notify() {
  for (const fn of subscribers) {
    try { fn(); } catch (e) { console.error(e); }
  }
}

window.addEventListener('beforeunload', () => store.flush());