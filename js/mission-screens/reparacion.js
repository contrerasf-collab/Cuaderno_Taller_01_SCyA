import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderReparacion() {
  let text = store.getPersisted().finalMission.repair || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: { ...s.finalMission, repair: text }
    }));
  }

  const textarea = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 5,
    placeholder: 'Describe la reparación que realizarías...',
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
      navigate('/mision/reflexion');
    }
  }, 'Continuar →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/diagnostico')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Reparación propuesta'),
    h('p', { class: 'screen-station__intro' },
      '¿Qué reparación realizarías?'),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Tu propuesta de reparación'),
        textarea
      )
    )
  );

  return {
    title: 'Misión final — Reparación',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}