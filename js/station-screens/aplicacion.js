import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';
import { showToast } from '../components/toast.js';

export function renderAplicacion(station) {
  const progress = store.getPersisted().stations.find(s => s.stationId === station.id);
  let text = (progress && progress.vehicleApplication) || '';

  function persist() {
    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id ? { ...st, vehicleApplication: text } : st
      )
    }));
  }

  const textarea = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: station.vehicleApplication.rows || 3,
    placeholder: 'Escribe tu aplicación al vehículo...',
    oninput: (e) => {
      text = e.target.value;
      persist();
      saveBtn.disabled = text.trim().length === 0;
    }
  });
  textarea.value = text;

  const saveBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    disabled: text.trim().length === 0,
    onclick: () => {
      persist();
      store.flush();
      showToast('Aplicación guardada', 'success');
      navigate(`/estacion/${station.id}/cierre`);
    }
  }, 'Guardar y cerrar estación →');

  const body = h('div', { class: 'screen-station' },
    h('h2', null, 'Aplicación al vehículo'),
    h('p', { class: 'screen-station__intro' }, station.vehicleApplication.prompt),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Tu respuesta'),
        textarea
      )
    )
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/conclusion`)
  }, '← Atrás');

  const saveBtnWrapper = h('div', { class: 'btn-with-hint' },
    saveBtn,
    h('p', { class: 'btn-hint' }, 'Escribe tu respuesta')
  );

  return {
    title: `${station.order}. ${station.title} — Aplicación`,
    showManual: true,
    showHelp: false,
    content: body,
    footerActions: { left: backBtn, right: saveBtnWrapper }
  };
}