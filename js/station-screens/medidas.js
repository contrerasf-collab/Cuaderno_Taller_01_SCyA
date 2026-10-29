import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderMedidas(station) {
  const content = station.measurements || {};
  const suggestedRows = content.suggestedRows || [];

  const progress = store.getPersisted().stations.find(s => s.stationId === station.id);
  let measurements = (progress && progress.measurements && progress.measurements.length > 0)
    ? progress.measurements.map(m => ({ ...m }))
    : suggestedRows.map(row => ({
        label: row.label,
        unit: row.unit || '',
        value: '',
        observations: '',
        createdAt: new Date().toISOString()
      }));

  function persist() {
    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id ? { ...st, measurements } : st
      )
    }));
  }

  const tbody = h('tbody');

  function renderRows() {
    tbody.innerHTML = '';
    measurements.forEach((m, i) => {
      const row = h('tr', null,
        h('td', null,
          h('input', {
            class: 'field__input',
            type: 'text',
            value: m.label || '',
            placeholder: 'Qué se mide',
            oninput: (e) => { measurements[i].label = e.target.value; persist(); }
          })
        ),
        h('td', null,
          h('input', {
            class: 'field__input',
            type: 'text',
            value: m.value || '',
            placeholder: m.unit ? `Valor (${m.unit})` : 'Valor',
            oninput: (e) => { measurements[i].value = e.target.value; persist(); }
          })
        ),
        h('td', null,
          h('input', {
            class: 'field__input',
            type: 'text',
            value: m.observations || '',
            placeholder: 'Observaciones',
            oninput: (e) => { measurements[i].observations = e.target.value; persist(); }
          })
        ),
        h('td', null,
          h('button', {
            class: 'measure-table__delete',
            type: 'button',
            title: 'Eliminar fila',
            'aria-label': 'Eliminar fila',
            onclick: () => {
              measurements.splice(i, 1);
              persist();
              renderRows();
            }
          }, '×')
        )
      );
      tbody.appendChild(row);
    });
  }

  renderRows();

  const addBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => {
      measurements.push({
        label: '',
        unit: '',
        value: '',
        observations: '',
        createdAt: new Date().toISOString()
      });
      persist();
      renderRows();
    }
  }, '+ Añadir fila');

  const table = h('table', { class: 'measure-table' },
    h('thead', null,
      h('tr', null,
        h('th', null, 'Qué se mide'),
        h('th', null, 'Valor'),
        h('th', null, 'Observaciones'),
        h('th', null, '')
      )
    ),
    tbody
  );

  const body = h('div', { class: 'screen-station' },
    h('h2', null, 'Registro de medidas'),
    h('p', { class: 'screen-station__intro' }, content.intro || ''),
    table,
    h('div', { style: { marginBottom: 'var(--space-4)' } }, addBtn),
    content.hint
      ? h('div', { class: 'card card--info' }, h('p', null, `💡 ${content.hint}`))
      : null
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/experimento`)
  }, '← Atrás');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => {
      persist();
      store.flush();
      navigate(`/estacion/${station.id}/comprobacion`);
    }
  }, 'Guardar y comprobar →');

  return {
    title: `${station.order}. ${station.title} — Medidas`,
    showManual: true,
    showHelp: false,
    content: body,
    footerActions: { left: backBtn, right: nextBtn }
  };
}