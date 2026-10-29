import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderCierreEstacion(station) {
  const state = store.getPersisted();
  const progress = state.stations.find(s => s.stationId === station.id);

  if (!progress) {
    return {
      title: 'Error',
      content: h('div', { class: 'screen-message' },
        h('p', null, 'No se encontró la estación.')
      )
    };
  }

  let timeSpentSec = progress.timeSpentSec || 0;

  if (progress.state !== 'completed') {
    const started = progress.startedAt
      ? new Date(progress.startedAt).getTime()
      : Date.now();
    timeSpentSec = Math.round((Date.now() - started) / 1000);

    store.updatePersisted(s => ({
      stations: s.stations.map(st => {
        if (st.stationId !== station.id) return st;
        return {
          ...st,
          state: 'completed',
          completedAt: new Date().toISOString(),
          timeSpentSec
        };
      })
    }));
    store.flush();
  }

  const measurementCount = (progress.measurements && progress.measurements.length) || 0;
  const helpsList = progress.helpsUsed || [];
  const helpsCount = helpsList.length;
  const manualQueriesCount = (progress.manualQueries || []).length;

  const summaryItems = [
    h('li', null,
      h('strong', null, 'Tiempo: '),
      formatDuration(timeSpentSec)),
    h('li', null,
      h('strong', null, 'Medidas registradas: '),
      String(measurementCount)),
    h('li', null,
      h('strong', null, 'Conclusión: '),
      progress.conclusion ? 'Registrada' : 'No registrada'),
    h('li', null,
      h('strong', null, 'Aplicación al vehículo: '),
      progress.vehicleApplication ? 'Registrada' : 'No registrada')
  ];

  if (helpsCount > 0) {
    const levels = helpsList.map(h => h.level).join(', ');
    summaryItems.splice(2, 0,
      h('li', null,
        h('strong', null, 'Ayudas utilizadas: '),
        `${helpsCount} (niveles: ${levels})`));
  }

  if (manualQueriesCount > 0) {
    summaryItems.splice(3, 0,
      h('li', null,
        h('strong', null, 'Consultas al manual: '),
        String(manualQueriesCount)));
  }

  const body = h('div', { class: 'screen-station' },
    h('div', { class: 'completion-badge' },
      h('div', { class: 'completion-badge__icon' }, '✓'),
      h('div', { class: 'completion-badge__title' }, 'Estación completada')
    ),
    h('div', { class: 'card' },
      h('h3', { class: 'card__subtitle' }, 'Resumen'),
      h('ul', { class: 'list' }, summaryItems)
    )
  );

  const mapBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate('/mapa')
  }, 'Volver al mapa');

  return {
    title: `${station.order}. ${station.title} — Completada`,
    content: body,
    footerActions: { right: mapBtn }
  };
}

function formatDuration(seconds) {
  if (!seconds || seconds < 60) return `${seconds || 0} s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} min ${s} s` : `${m} min`;
}