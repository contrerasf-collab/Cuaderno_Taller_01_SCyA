import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { getContent } from '../core/content.js';
import { navigate } from '../core/router.js';
import { createStationIcon } from '../components/station-icons.js';

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
        h('span', { class: 'station-card__icon' },
          createStationIcon(station.icon, 20)
        ),
        h('h3', { class: 'station-card__title' }, station.title)
      ),
      station.cardDescription
        ? h('p', { class: 'station-card__description' }, station.cardDescription)
        : null,
      h('p', { class: 'station-card__state' }, stateLabel),
      h('button', {
        class: buttonClass,
        type: 'button',
        onclick: () => openStation(station.id)
      }, buttonLabel)
    );
  });

  const missionUnlocked = completed >= 4;
  const fm = state.finalMission;
  const missionCompleted = !!(fm && fm.completedAt);

  const missionCardClass = missionUnlocked
    ? (missionCompleted ? 'station-card station-card--completed screen-mapa__mission' : 'station-card screen-mapa__mission')
    : 'station-card screen-mapa__mission station-card--locked';

  const missionIcon = missionUnlocked ? (missionCompleted ? '✓' : '★') : '🔒';

  const missionState = missionCompleted
    ? '● Completada'
    : missionUnlocked
      ? '● Desbloqueada'
      : '🔒 Bloqueada';

  const missionHint = missionCompleted
    ? 'Has resuelto el caso. Puedes revisar tus respuestas.'
    : missionUnlocked
      ? 'Has desbloqueado la misión. Demuestra lo que has aprendido.'
      : 'Completa las 4 estaciones para desbloquear la misión final.';

  const missionButtonLabel = missionCompleted
    ? 'Ver misión'
    : 'Empezar misión';

  const missionCard = h('article', { class: missionCardClass },
    h('div', { class: 'station-card__header' },
      h('span', { class: 'station-card__number' }, missionIcon),
      h('h3', { class: 'station-card__title' }, 'Misión final: El último coche del día')
    ),
    h('p', { class: 'station-card__state' }, missionState),
    h('p', { class: 'station-card__hint' }, missionHint),
    h('button', {
      class: missionUnlocked ? 'btn btn--primary' : 'btn btn--secondary',
      type: 'button',
      disabled: !missionUnlocked,
      onclick: () => {
        if (missionUnlocked) navigate('/mision/briefing');
      }
    }, missionButtonLabel)
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
      }, '← Volver al inicio'),
      h('button', {
        class: 'btn btn--primary',
        type: 'button',
        onclick: () => navigate('/resumen')
      }, 'Resumen de la jornada →')
    )
  );

  return {
    title: 'Mapa de estaciones',
    content: contentEl
  };
}