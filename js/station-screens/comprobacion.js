import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';
import { showToast } from '../components/toast.js';

export function renderComprobacion(station) {
  const progress = store.getPersisted().stations.find(s => s.stationId === station.id);
  const prediction = progress && progress.prediction;
  const measurements = (progress && progress.measurements) || [];
  const existingCheck = progress && progress.check;

  let matchesPrediction = existingCheck ? existingCheck.matchesPrediction : null;
  let explanation = existingCheck ? (existingCheck.explanation || '') : '';

  const predictionFields = (station.prediction.fields || []).map(field => {
    const value = prediction ? prediction[field.id] : '';
    return h('div', { class: 'field' },
      h('span', { class: 'field__label' }, field.label),
      h('p', { class: 'field__value' }, value || '—')
    );
  });

  const predictionBlock = h('div', { class: 'card' },
    h('h3', { class: 'card__subtitle' }, 'Tu predicción'),
    predictionFields.length > 0
      ? predictionFields
      : h('p', null, 'Sin predicción registrada.')
  );

  const measurementsBlock = h('div', { class: 'card' },
    h('h3', { class: 'card__subtitle' }, 'Tus medidas'),
    measurements.length === 0
      ? h('p', null, 'Sin medidas registradas.')
      : h('ul', { class: 'list' },
          measurements.map(m => h('li', null,
            h('strong', null, `${m.label || '(sin nombre)'}: `),
            `${m.value || '—'}${m.unit ? ` ${m.unit}` : ''}`,
            m.observations ? ` (${m.observations})` : ''
          ))
        )
  );

  function persist() {
    if (matchesPrediction === null && !explanation) return;
    const check = {
      matchesPrediction: matchesPrediction === null ? false : matchesPrediction,
      explanation,
      lockedAt: new Date().toISOString()
    };
    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id ? { ...st, check } : st
      )
    }));
  }

  const yesBtn = h('button', {
    class: `choice-btn ${matchesPrediction === true ? 'choice-btn--active' : ''}`,
    type: 'button',
    onclick: () => setMatch(true)
  }, 'Sí');

  const noBtn = h('button', {
    class: `choice-btn ${matchesPrediction === false ? 'choice-btn--active' : ''}`,
    type: 'button',
    onclick: () => setMatch(false)
  }, 'No');

  function setMatch(value) {
    matchesPrediction = value;
    yesBtn.classList.toggle('choice-btn--active', value === true);
    noBtn.classList.toggle('choice-btn--active', value === false);
    persist();
    saveBtn.disabled = false;
  }

  const explanationInput = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 4,
    placeholder: '¿Por qué? Explica las diferencias.',
    oninput: (e) => { explanation = e.target.value; persist(); }
  });
  explanationInput.value = explanation;

  const saveBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    disabled: matchesPrediction === null,
    onclick: () => {
      persist();
      store.flush();
      showToast('Comprobación guardada', 'success');
      navigate(`/estacion/${station.id}/conclusion`);
    }
  }, 'Guardar y concluir →');

  const body = h('div', { class: 'screen-station' },
    h('h2', null, 'Comprobación'),
    h('p', { class: 'screen-station__intro' }, station.check.intro || ''),
    h('div', { class: 'comparison-grid' }, predictionBlock, measurementsBlock),
    h('div', { class: 'card' },
      h('h3', { class: 'card__subtitle' }, '¿Coincide con tu predicción?'),
      h('div', { class: 'choice-group' }, yesBtn, noBtn),
      h('label', { class: 'field' },
        h('span', { class: 'field__label' },
          station.check.promptIfMismatch || '¿Por qué?'),
        explanationInput
      )
    )
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/medidas`)
  }, '← Atrás');

  const saveBtnWrapper = h('div', { class: 'btn-with-hint' },
    saveBtn,
    h('p', { class: 'btn-hint' }, 'Selecciona una respuesta')
  );

  return {
    title: `${station.order}. ${station.title} — Comprobación`,
    showManual: true,
    showHelp: false,
    content: body,
    footerActions: { left: backBtn, right: saveBtnWrapper }
  };
}