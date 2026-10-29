import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { getContent } from '../core/content.js';
import { navigate } from '../core/router.js';

export function ScreenMapa() {
  const state = store.get();
  const content = getContent();

  const completed = state.stations.filter(s => s.state === 'completed').length;
  const helpsTotal = state.stations.reduce(
    (sum, s) => sum + (s.helpsUsed || []).length, 0
  );
  const timeTotalSec = state.stations.reduce(
    (sum, s) => sum + (s.timeSpentSec || 0), 0
  );
  const timeTotalMin = Math.round(timeTotalSec / 60);

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

  const missionUnlocked = completed >= 4;

  const missionCard = h('article', {
    class: `station-card screen-mapa__mission ${missionUnlocked ? '' : 'station-card--locked'}`
  },
    h('div', { class: 'station-card__header' },
      h('span', { class: 'station-card__number' }, missionUnlocked ? '★' : '🔒'),
      h('h3', { class: 'station-card__title' }, 'Misión final: El último coche del día')
    ),
    h('p', { class: 'station-card__state' },
      missionUnlocked ? '● Desbloqueada' : '🔒 Bloqueada'),
    h('p', { class: 'station-card__hint' },
      missionUnlocked
        ? 'Has desbloqueado la misión. Demuestra lo que has aprendido.'
        : 'Completa las 4 estaciones para desbloquear la misión final.'),
    h('button', {
      class: missionUnlocked ? 'btn btn--primary' : 'btn btn--secondary',
      type: 'button',
      disabled: !missionUnlocked,
      onclick: () => {
        if (missionUnlocked) navigate('/mision');
      }
    }, missionUnlocked ? 'Empezar misión' : 'Bloqueada')
  );

  const stats = h('div', { class: 'map-stats' },
    h('div', { class: 'map-stats__item' },
      h('span', { class: 'map-stats__label' }, 'Estaciones'),
      h('span', { class: 'map-stats__value' }, `${completed}/4`)
    ),
    h('div', { class: 'map-stats__item' },
      h('span', { class: 'map-stats__label' }, 'Ayudas'),
      h('span', { class: 'map-stats__value' }, String(helpsTotal))
    ),
    h('div', { class: 'map-stats__item' },
      h('span', { class: 'map-stats__label' }, 'Tiempo'),
      h('span', { class: 'map-stats__value' }, `${timeTotalMin} min`)
    )
  );

  const contentEl = h('div', { class: 'screen-mapa' },
    stats,
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
    content: contentEl
  };
}