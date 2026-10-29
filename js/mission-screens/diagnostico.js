import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderDiagnostico() {
  let text = store.getPersisted().finalMission.diagnosis || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: { ...s.finalMission, diagnosis: text }
    }));
  }

  const textarea = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 5,
    placeholder: 'Escribe el diagnóstico final más probable...',
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
      navigate('/mision/reparacion');
    }
  }, 'Continuar →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/interpretacion')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Diagnóstico final'),
    h('p', { class: 'screen-station__intro' },
      '¿Cuál es el diagnóstico final más probable?'),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Tu diagnóstico'),
        textarea
      )
    )
  );

  return {
    title: 'Misión final — Diagnóstico',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}