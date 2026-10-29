import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderInterpretacion() {
  let text = store.getPersisted().finalMission.interpretation || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: { ...s.finalMission, interpretation: text }
    }));
  }

  const textarea = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 5,
    placeholder: 'Explica qué conclusión extraes de los resultados...',
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
      navigate('/mision/diagnostico');
    }
  }, 'Continuar →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/resultados')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Interpretación'),
    h('p', { class: 'screen-station__intro' },
      '¿Qué conclusión extraes de los resultados obtenidos?'),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Tu interpretación'),
        textarea
      )
    )
  );

  return {
    title: 'Misión final — Interpretación',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}