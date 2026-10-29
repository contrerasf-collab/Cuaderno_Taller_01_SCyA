import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderCierreMision() {
  const state = store.getPersisted();
  const fm = state.finalMission;

  if (fm.startedAt && !fm.completedAt) {
    store.updatePersisted(s => ({
      finalMission: { ...s.finalMission, completedAt: new Date().toISOString() }
    }));
    store.flush();
  }

  const fresh = store.getPersisted();
  const freshFm = fresh.finalMission;

  const completedStations = fresh.stations.filter(s => s.state === 'completed').length;
  const helpsTotal = fresh.stations.reduce(
    (sum, s) => sum + (s.helpsUsed || []).length, 0
  );
  const queriesTotal = fresh.stations.reduce(
    (sum, s) => sum + (s.manualQueries || []).length, 0
  );

  const stationsTimeSec = fresh.stations.reduce(
    (sum, s) => sum + (s.timeSpentSec || 0), 0
  );

  let missionTimeSec = 0;
  if (freshFm.startedAt) {
    const end = freshFm.completedAt
      ? new Date(freshFm.completedAt).getTime()
      : Date.now();
    missionTimeSec = Math.round(
      (end - new Date(freshFm.startedAt).getTime()) / 1000
    );
  }

  const totalTimeSec = stationsTimeSec + missionTimeSec;
  const totalTimeMin = Math.floor(totalTimeSec / 60);
  const totalTimeRestSec = totalTimeSec % 60;

  const summaryItems = [
    h('li', null,
      h('strong', null, 'Estaciones completadas: '),
      `${completedStations}/4`),
    h('li', null,
      h('strong', null, 'Ayudas utilizadas: '),
      String(helpsTotal)),
    h('li', null,
      h('strong', null, 'Consultas al manual: '),
      String(queriesTotal)),
    h('li', null,
      h('strong', null, 'Tiempo total invertido: '),
      `${totalTimeMin} min ${totalTimeRestSec} s`)
  ];

  const body = h('div', { class: 'screen-mission' },
    h('div', { class: 'completion-badge' },
      h('div', { class: 'completion-badge__icon' }, '✓'),
      h('div', { class: 'completion-badge__title' }, 'Jornada completada')
    ),
    h('div', { class: 'card' },
      h('h3', { class: 'card__subtitle' }, 'Resumen de la jornada'),
      h('ul', { class: 'list' }, summaryItems)
    ),
    h('div', { class: 'card card--info' },
      h('p', null,
        'Caso final resuelto. Has completado con éxito la jornada técnica de electricidad básica del automóvil.'),
      h('p', null,
        'Has pensado como un técnico: has observado, has planificado, has medido, has interpretado y has concluido.')
    )
  );

  const homeBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => {
      store.updatePersisted(s => ({
        session: { ...s.session, lastWorkingScreen: '/mapa' }
      }));
      store.flush();
      navigate('/');
    }
  }, 'Volver al inicio');

  return {
    title: 'Misión final — Completada',
    content: body,
    footerActions: { right: homeBtn }
  };
}