import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderHipotesis() {
  let text = store.getPersisted().finalMission.hypothesis || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: { ...s.finalMission, hypothesis: text }
    }));
  }

  const textarea = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 5,
    placeholder: 'Escribe tu hipótesis inicial...',
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
      navigate('/mision/plan');
    }
  }, 'Continuar →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/briefing')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Hipótesis inicial'),
    h('p', { class: 'screen-station__intro' },
      '¿Cuál crees que puede ser la causa principal del problema?'),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Tu hipótesis'),
        textarea
      )
    )
  );

  return {
    title: 'Misión final — Hipótesis',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}