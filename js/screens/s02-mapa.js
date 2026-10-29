import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { getContent } from '../core/content.js';
import { navigate } from '../core/router.js';

export function ScreenMapa() {
  const state = store.get();
  const content = getContent();
  const completed = state.stations.filter(s => s.state === 'completed').length;

  function openStation(stationId) {
    navigate(`/estacion/${stationId}/situacion`);
  }

  const stationCards = content.stations.map(station => {
    const progress = state.stations.find(s => s.stationId === station.id);
    const cardClass = `station-card station-card--${progress.state}`;

    const stateLabel = progress.state === 'completed'
      ? '● Completada'
      : progress.state === 'in_progress'
        ? '◐ En curso'
        : '○ Pendiente';

    const buttonLabel = progress.state === 'completed'
      ? 'Ver / Reabrir'
      : progress.state === 'in_progress'
        ? 'Continuar'
        : 'Abrir estación';

    const buttonClass = progress.state === 'in_progress'
      ? 'btn btn--primary'
      : 'btn btn--secondary';

    return h('article', { class: cardClass },
      h('div', { class: 'station-card__header' },
        h('span', { class: 'station-card__number' }, String(station.order)),
        h('h3', { class: 'station-card__title' }, station.title)
      ),
      h('p', { class: 'station-card__state' }, stateLabel),
      h('button', {
        class: buttonClass,
        type: 'button',
        onclick: () => openStation(station.id)
      }, buttonLabel)
    );
  });

  const missionLocked = completed < 4;

  const missionCard = h('article', {
    class: `station-card screen-mapa__mission ${missionLocked ? 'station-card--locked' : ''}`
  },
    h('div', { class: 'station-card__header' },
      h('span', { class: 'station-card__number' }, '★'),
      h('h3', { class: 'station-card__title' }, 'Misión final: El último coche del día')
    ),
    h('p', { class: 'station-card__state' }, missionLocked ? '🔒 Bloqueada' : '● Disponible'),
    h('p', { class: 'station-card__hint' },
      missionLocked
        ? 'Completa las 4 estaciones para desbloquear.'
        : 'En el Sprint 3 se implementará la misión final.'
    )
  );

  const content_el = h('div', { class: 'screen-mapa' },
    h('div', { class: 'screen-mapa__progress' }, `Progreso: ${completed}/4 estaciones completadas`),
    h('div', { class: 'screen-mapa__grid' }, stationCards),
    missionCard,
    h('div', { class: 'screen-mapa__nav' },
      h('button', {
        class: 'btn btn--secondary',
        type: 'button',
        onclick: () => navigate('/')
      }, '← Volver al inicio')
    )
  );

  return {
    title: 'Mapa de estaciones',
    showManual: true,
    showHelp: false,
    content: content_el
  };
}