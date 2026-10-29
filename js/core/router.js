import { h } from './dom.js';
import { store } from './store.js';
import { getStation } from './content.js';
import { ScreenInicio } from '../screens/s00-inicio.js';
import { ScreenMapa } from '../screens/s02-mapa.js';
import { ScreenResumen } from '../screens/s09-resumen.js';
import { getStationScreen } from '../station-screens/dispatcher.js';
import { getMissionScreen } from '../mission-screens/dispatcher.js';
import { openHelpPanel } from '../components/help-panel.js';
import { openManualPanel } from '../components/manual-panel.js';

const ROUTES = [
  { pattern: /^\/?$/, handler: 'inicio', guard: null },
  { pattern: /^\/mapa\/?$/, handler: 'mapa', guard: 'requireSession' },
  { pattern: /^\/estacion\/(E[1-4])\/(situacion|pregunta|prediccion|documentacion|experimento|medidas|comprobacion|conclusion|aplicacion|cierre)\/?$/, handler: 'estacion', guard: 'requireSession' },
  { pattern: /^\/mision\/(briefing|hipotesis|plan|resultados|interpretacion|diagnostico|reparacion|reflexion|cierre)\/?$/, handler: 'mision', guard: 'requireMissionUnlocked' },
  { pattern: /^\/resumen\/?$/, handler: 'resumen', guard: 'requireSession' }
];

const GUARDS = {
  requireSession: () => {
    const s = store.getPersisted();
    return !!(s.session && s.session.groupName && s.session.groupName.length > 0);
  },
  requireMissionUnlocked: () => {
    const s = store.getPersisted();
    const completed = s.stations.filter(st => st.state === 'completed').length;
    return completed === 4;
  }
};

const GUARD_REDIRECTS = {
  requireSession: '/',
  requireMissionUnlocked: '/mapa'
};

let currentScreenInstance = null;

export function initRouter() {
  window.addEventListener('hashchange', render);
  render();
}

export function navigate(path) {
  const target = `#${path}`;
  if (window.location.hash === target) {
    render();
    return;
  }
  window.location.hash = path;
}

function parseHash() {
  return window.location.hash.replace(/^#/, '') || '/';
}

function render() {
  const path = parseHash();

  const isWorkingScreen = path !== '/' && path !== '';
  const session = store.getPersisted().session;
  const needsCurrentUpdate = session.currentScreen !== path;
  const needsWorkingUpdate = isWorkingScreen && session.lastWorkingScreen !== path;

  if (needsCurrentUpdate || needsWorkingUpdate) {
    store.updatePersisted(state => {
      const nextSession = {
        ...state.session,
        currentScreen: path,
        lastActivityAt: new Date().toISOString()
      };
      if (isWorkingScreen) {
        nextSession.lastWorkingScreen = path;
      }
      return { session: nextSession };
    });
  }

  const match = matchRoute(path);

  if (!match) {
    renderNotFound();
    return;
  }

  if (match.guard && GUARDS[match.guard] && !GUARDS[match.guard]()) {
    navigate(GUARD_REDIRECTS[match.guard] || '/');
    return;
  }

  let screen;
  try {
    screen = buildScreen(match);
  } catch (err) {
    console.error(err);
    renderError(err.message);
    return;
  }

  if (!screen) {
    renderNotFound();
    return;
  }

  if (currentScreenInstance && typeof currentScreenInstance.onUnmount === 'function') {
    try { currentScreenInstance.onUnmount(); } catch (e) { console.error(e); }
  }
  currentScreenInstance = null;

  const app = document.getElementById('app');
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');

  app.innerHTML = '';
  header.innerHTML = '';
  footer.innerHTML = '';

  renderHeader(header, screen, match);
  app.appendChild(screen.content);
  renderFooter(footer, screen);

  currentScreenInstance = screen;

  if (typeof screen.onMount === 'function') {
    try { screen.onMount(); } catch (e) { console.error(e); }
  }

  window.scrollTo(0, 0);
  store.flush();
}

function matchRoute(path) {
  for (const route of ROUTES) {
    const m = path.match(route.pattern);
    if (m) {
      return { handler: route.handler, guard: route.guard, params: m.slice(1) };
    }
  }
  return null;
}

function buildScreen(match) {
  if (match.handler === 'inicio') {
    return ScreenInicio();
  }
  if (match.handler === 'mapa') {
    return ScreenMapa();
  }
  if (match.handler === 'resumen') {
    return ScreenResumen();
  }
  if (match.handler === 'mision') {
    const screenId = match.params[0];
    return getMissionScreen(screenId);
  }
  if (match.handler === 'estacion') {
    const stationId = match.params[0];
    const screenId = match.params[1];
    const station = getStation(stationId);
    if (!station) return null;

    const progress = store.getPersisted().stations.find(s => s.stationId === stationId);
    if (progress && progress.state === 'pending') {
      store.updatePersisted(state => ({
        stations: state.stations.map(st =>
          st.stationId === stationId
            ? { ...st, state: 'in_progress', startedAt: new Date().toISOString() }
            : st
        )
      }));
    }

    return getStationScreen(station, screenId);
  }
  return null;
}

function renderHeader(header, screen, match) {
  header.appendChild(h('h1', { class: 'header__title' }, screen.title || ''));

  const right = h('div', { class: 'header__right' });

  if (match && match.handler === 'estacion') {
    const station = getStation(match.params[0]);
    if (station) {
      right.appendChild(h('button', {
        class: 'header__icon-btn',
        type: 'button',
        title: 'Manual',
        'aria-label': 'Abrir manual',
        onclick: () => openManualPanel(station)
      }, 'M'));

      right.appendChild(h('button', {
        class: 'header__icon-btn',
        type: 'button',
        title: 'Ayudas',
        'aria-label': 'Abrir ayudas',
        onclick: () => openHelpPanel(station)
      }, '?'));
    }
  }

  if (right.childNodes.length > 0) {
    header.appendChild(right);
  }
}

function renderFooter(footer, screen) {
  if (!screen.footerActions) return;

  const left = h('div', { class: 'footer__left' });
  const right = h('div', { class: 'footer__right' });

  if (screen.footerActions.left) left.appendChild(screen.footerActions.left);
  if (screen.footerActions.right) right.appendChild(screen.footerActions.right);

  if (left.childNodes.length > 0) footer.appendChild(left);
  if (right.childNodes.length > 0) footer.appendChild(right);
}

function renderNotFound() {
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  app.innerHTML = '';
  header.innerHTML = '';
  footer.innerHTML = '';
  header.appendChild(h('h1', { class: 'header__title' }, 'Página no encontrada'));
  app.appendChild(h('div', { class: 'screen-message' },
    h('p', null, 'La ruta no existe.'),
    h('button', {
      class: 'btn btn--primary',
      onclick: () => navigate('/')
    }, 'Volver al inicio')
  ));
}

function renderError(message) {
  const app = document.getElementById('app');
  const header = document.getElementById('header');
  const footer = document.getElementById('footer');
  app.innerHTML = '';
  header.innerHTML = '';
  footer.innerHTML = '';
  header.appendChild(h('h1', { class: 'header__title' }, 'Error'));
  app.appendChild(h('div', { class: 'screen-message' },
    h('p', null, 'No se pudo cargar la pantalla.'),
    h('p', null, h('small', null, message)),
    h('button', {
      class: 'btn btn--primary',
      onclick: () => navigate('/')
    }, 'Volver al inicio')
  ));
}