import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

export function renderReflexion() {
  const fm = store.getPersisted().finalMission;

  let r1 = fm.reflection1 || '';
  let r2 = fm.reflection2 || '';
  let r3 = fm.reflection3 || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: {
        ...s.finalMission,
        reflection1: r1,
        reflection2: r2,
        reflection3: r3
      }
    }));
  }

  function makeTextarea(initial, onChange, placeholder) {
    const el = h('textarea', {
      class: 'field__input field__input--textarea',
      rows: 3,
      placeholder,
      oninput: (e) => {
        onChange(e.target.value);
        persist();
        updateBtn();
      }
    });
    el.value = initial;
    return el;
  }

  const ta1 = makeTextarea(r1, v => r1 = v,
    '¿Qué estación te ha ayudado más a resolver el caso?');
  const ta2 = makeTextarea(r2, v => r2 = v,
    '¿Qué concepto consideras más importante?');
  const ta3 = makeTextarea(r3, v => r3 = v,
    '¿Qué comprobación realizarías siempre en un diagnóstico eléctrico?');

  const saveBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => {
      persist();
      store.flush();
      navigate('/mision/cierre');
    }
  }, 'Finalizar misión →');

  function updateBtn() {
    saveBtn.disabled = [r1, r2, r3].some(v => v.trim().length === 0);
  }
  updateBtn();

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/reparacion')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Reflexión profesional'),
    h('div', { class: 'card' },
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, '1. ¿Qué estación te ha ayudado más a resolver el caso?'),
        ta1
      ),
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, '2. ¿Qué concepto consideras más importante?'),
        ta2
      ),
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, '3. ¿Qué comprobación realizarías siempre en un diagnóstico eléctrico?'),
        ta3
      )
    )
  );

  return {
    title: 'Misión final — Reflexión',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}