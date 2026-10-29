import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { openModal } from './modal.js';

const SCREEN_MAX_LEVEL = {
  situacion: 0,
  pregunta: 0,
  prediccion: 2,
  documentacion: 4,
  experimento: 4,
  medidas: 4,
  comprobacion: 4,
  conclusion: 4,
  aplicacion: 4,
  cierre: 0
};

function computeMaxLevel(screenId) {
  if (!screenId) return 4;
  if (SCREEN_MAX_LEVEL[screenId] !== undefined) {
    return SCREEN_MAX_LEVEL[screenId];
  }
  return 4;
}

export function openHelpPanel(station, screenId = null) {
  const helps = station.helps || [];
  const maxLevel = computeMaxLevel(screenId);

  if (helps.length === 0 || maxLevel === 0) {
    openModal({
      title: 'Ayudas',
      content: h('p', null,
        'No hay ayudas disponibles en esta pantalla. Continúa con la actividad.')
    });
    return;
  }

  const state = store.getPersisted();
  const progress = state.stations.find(s => s.stationId === station.id);
  const usedLevels = (progress && progress.helpsUsed ? progress.helpsUsed : [])
    .map(h => h.level);
  let currentLevel = usedLevels.length > 0 ? Math.max(...usedLevels) : 0;

  function registerLevel(level) {
    const now = new Date().toISOString();
    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id
          ? {
              ...st,
              helpsUsed: [...(st.helpsUsed || []), { level, timestamp: now }]
            }
          : st
      )
    }));
    store.flush();
  }

  function buildBody() {
    const body = h('div', { class: 'help-panel' });

    if (currentLevel === 0) {
      body.appendChild(h('p', { class: 'help-panel__intro' },
        'Las ayudas son escalonadas. Empieza por la primera y solicita más solo si la necesitas.'));
    } else {
      body.appendChild(h('p', { class: 'help-panel__intro' },
        `Has consultado ${currentLevel} de ${helps.length} ayudas.`));
    }

    const visibleLevels = Math.min(currentLevel, helps.length);
    for (let level = 1; level <= visibleLevels; level++) {
      const help = helps[level - 1];
      if (!help) continue;
      body.appendChild(h('div', {
        class: `help-card help-card--level-${level}`
      },
        h('div', { class: 'help-card__header' },
          h('span', { class: 'help-card__level' }, `Nivel ${level}`),
          h('span', { class: 'help-card__title' }, help.title || '')
        ),
        h('p', { class: 'help-card__text' }, help.text || '')
      ));
    }

    if (currentLevel === 0) {
      body.appendChild(h('button', {
        class: 'btn btn--primary',
        type: 'button',
        onclick: () => {
          registerLevel(1);
          currentLevel = 1;
          refresh();
        }
      }, 'Leer ayuda 1'));
    } else if (currentLevel < helps.length) {
      if (currentLevel < maxLevel) {
        body.appendChild(h('button', {
          class: 'btn btn--primary',
          type: 'button',
          onclick: () => {
            registerLevel(currentLevel + 1);
            currentLevel = currentLevel + 1;
            refresh();
          }
        }, `Solicitar ayuda ${currentLevel + 1}`));
      } else {
        body.appendChild(h('div', { class: 'card card--warning' },
          h('p', null,
            'Disponible en fases posteriores. Continúa con la actividad para acceder a más ayuda.')));
      }
    } else {
      body.appendChild(h('div', { class: 'card card--info' },
        h('p', null, 'No hay más ayudas disponibles. Es momento de montar y medir.')));
    }

    return body;
  }

  function refresh() {
    const dialogBody = document.querySelector('.modal__body');
    if (dialogBody) {
      dialogBody.innerHTML = '';
      dialogBody.appendChild(buildBody());
    }
  }

  openModal({
    title: 'Ayudas',
    content: buildBody(),
    size: 'md'
  });
}