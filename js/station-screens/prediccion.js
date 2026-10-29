import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';
import { showToast } from '../components/toast.js';

export function renderPrediccion(station) {
  const state = store.getPersisted();
  const progress = state.stations.find(s => s.stationId === station.id);
  const existing = progress ? progress.prediction : null;

  if (existing && existing.lockedAt) {
    return renderLocked(station, existing);
  }
  return renderForm(station);
}

function renderForm(station) {
  const inputs = {};

  const fields = station.prediction.fields.map(field => {
    inputs[field.id] = h('textarea', {
      class: 'field__input field__input--textarea',
      rows: field.rows || 3,
      placeholder: field.required ? 'Obligatorio' : 'Opcional',
      oninput: updateSaveState
    });
    return h('div', { class: 'field' },
      h('label', { class: 'field__label' },
        field.label + (field.required ? ' *' : '')),
      inputs[field.id]
    );
  });

  const saveBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    disabled: true,
    onclick: savePrediction
  }, 'Guardar predicción y seguir →');

  function updateSaveState() {
    const requiredFields = station.prediction.fields.filter(f => f.required);
    const allRequiredFilled = requiredFields.every(
      f => inputs[f.id].value.trim().length > 0
    );
    saveBtn.disabled = !allRequiredFilled;
  }

  function savePrediction() {
    const prediction = { lockedAt: new Date().toISOString() };
    for (const [id, input] of Object.entries(inputs)) {
      prediction[id] = input.value.trim();
    }

    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id
          ? { ...st, prediction }
          : st
      )
    }));

    store.flush();
    showToast('Predicción guardada', 'success');
    navigate(`/estacion/${station.id}/documentacion`);
  }

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => {
      const hasData = Object.values(inputs).some(i => i.value.trim().length > 0);
      if (!hasData || window.confirm('¿Volver atrás sin guardar la predicción?')) {
        navigate(`/estacion/${station.id}/pregunta`);
      }
    }
  }, '← Atrás');

  const content = h('div', { class: 'screen-station' },
    h('h2', null, 'Predicción'),
    h('p', { class: 'screen-station__intro' },
      station.prediction.intro || 'Antes de montar, escribe lo que crees que ocurrirá.'),
    h('div', { class: 'card' }, fields),
    h('div', { class: 'card card--warning' },
      h('p', null, station.prediction.lockWarning)
    )
  );

  const saveBtnWrapper = h('div', { class: 'btn-with-hint' },
    saveBtn,
    h('p', { class: 'btn-hint' }, 'Completa los campos obligatorios')
  );

  return {
    title: `${station.order}. ${station.title} — Predicción`,
    showManual: true,
    showHelp: false,
    content,
    footerActions: { left: backBtn, right: saveBtnWrapper },
    onMount() {
      updateSaveState();
    }
  };
}

function renderLocked(station, prediction) {
  const fields = station.prediction.fields.map(field =>
    h('div', { class: 'field' },
      h('label', { class: 'field__label' }, field.label),
      h('p', { class: 'field__value' }, prediction[field.id] || '—')
    )
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mapa')
  }, '← Volver al mapa');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/documentacion`)
  }, 'Continuar →');

  const content = h('div', { class: 'screen-station' },
    h('h2', null, 'Predicción (bloqueada)'),
    h('p', { class: 'screen-station__intro' },
      'Esta predicción ya ha sido guardada y no puede modificarse.'),
    h('div', { class: 'card' }, fields)
  );

  return {
    title: `${station.order}. ${station.title} — Predicción (bloqueada)`,
    showManual: true,
    showHelp: false,
    content,
    footerActions: { left: backBtn, right: nextBtn }
  };
}