// localStorage schema: load/save/defaults, defensive parsing.

const STORAGE_KEY = 'tbm-coach-state-v1';
const SCHEMA_VERSION = 1;

export function getDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: {
      name: '',
      bodyWeightKg: null,
      weeklyFrequency: 2,
      startDate: null,
      onboardingComplete: false,
    },
    equipment: {
      hasLoopBand: true,
      hasLongBandDoorAnchor: true,
      hasDumbbellsOrKettlebell: true,
      dumbbellWeightKg: 8,
    },
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      restTimerAutoStart: true,
    },
    sessionHistory: [],
    activeSession: null,
    ui: {
      domsTipDismissedAtWeek: null,
      reassessDismissedAtWeek: null,
    },
  };
}

let warnedOnce = false;

export function loadState() {
  let raw;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return getDefaultState();
  }
  if (!raw) return getDefaultState();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || parsed.schemaVersion !== SCHEMA_VERSION) {
      throw new Error('unrecognized schema');
    }
    // Merge onto defaults so any missing keys from an older/partial save are filled in.
    const defaults = getDefaultState();
    return {
      ...defaults,
      ...parsed,
      profile: { ...defaults.profile, ...parsed.profile },
      equipment: { ...defaults.equipment, ...parsed.equipment },
      settings: { ...defaults.settings, ...parsed.settings },
      ui: { ...defaults.ui, ...parsed.ui },
      sessionHistory: Array.isArray(parsed.sessionHistory) ? parsed.sessionHistory : [],
    };
  } catch {
    if (!warnedOnce) {
      warnedOnce = true;
      console.warn('tbm-coach: could not read saved data, starting fresh.');
    }
    return getDefaultState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
