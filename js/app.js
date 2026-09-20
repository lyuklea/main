import { loadState } from './state.js';
import * as onboarding from './onboarding.js';
import * as dashboard from './dashboard.js';
import * as sessionCoach from './session-coach.js';
import * as exerciseReference from './exercise-reference.js';
import * as progress from './progress.js';
import * as settings from './settings.js';

const routes = {
  onboarding,
  dashboard,
  session: sessionCoach,
  exercises: exerciseReference,
  progress,
  settings,
};

const appEl = document.getElementById('app');
const navEl = document.getElementById('bottom-nav');
const settingsBtn = document.getElementById('settings-btn');

let currentView = null;
let state = loadState();

export function getState() {
  return state;
}

export function refreshState() {
  state = loadState();
}

function currentRouteName() {
  const hash = window.location.hash.replace(/^#\//, '') || 'dashboard';
  return routes[hash] ? hash : 'dashboard';
}

function render() {
  refreshState();
  let routeName = currentRouteName();

  if (!state.profile.onboardingComplete && routeName !== 'onboarding') {
    window.location.hash = '#/onboarding';
    routeName = 'onboarding';
  }
  if (state.profile.onboardingComplete && routeName === 'onboarding') {
    window.location.hash = '#/dashboard';
    routeName = 'dashboard';
  }

  if (currentView && typeof currentView.cleanup === 'function') {
    currentView.cleanup();
  }

  navEl.style.display = routeName === 'onboarding' ? 'none' : 'flex';
  for (const item of navEl.querySelectorAll('.nav-item')) {
    item.classList.toggle('active', item.dataset.route === routeName);
  }

  appEl.innerHTML = '';
  currentView = routes[routeName];
  currentView.render(appEl, state, { navigate, refresh: render });
  appEl.scrollTo({ top: 0 });
}

export function navigate(path) {
  window.location.hash = path;
}

window.addEventListener('hashchange', render);
settingsBtn.addEventListener('click', () => navigate('#/settings'));

render();
