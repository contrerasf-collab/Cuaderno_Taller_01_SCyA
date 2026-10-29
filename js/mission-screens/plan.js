import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

const CHECK_OPTIONS = [
  { id: 'power', label: 'Verificar alimentación' },
  { id: 'relay', label: 'Comprobar relés' },
  { id: 'ground', label: 'Comprobar masas' },
  { id: 'continuity', label: 'Comprobar continuidad' },
  { id: 'drop', label: 'Medir caídas de tensión' },
  { id: 'consumers', label: 'Comprobar consumidores' },
  { id: 'replace', label: 'Sustituir componentes directamente' }
];

export function renderPlan() {
  const fm = store.getPersisted().finalMission;
  const selectedSet = new Set(fm.selectedChecks || []);
  let reasoning = fm.checksReasoning || '';

  function persist() {
    store.updatePersisted(s => ({
      finalMission: {
        ...s.finalMission,
        selectedChecks: Array.from(selectedSet),
        checksReasoning: reasoning
      }
    }));
  }

  const checkboxes = CHECK_OPTIONS.map(opt => {
    const input = h('input', {
      type: 'checkbox',
      value: opt.id,
      onchange: (e) => {
        if (e.target.checked) selectedSet.add(opt.id);
        else selectedSet.delete(opt.id);
        persist();
      }
    });
    input.checked = selectedSet.has(opt.id);
    return h('label', { class: 'checkbox-item' }, input, h('span', null, opt.label));
  });

  const reasoningInput = h('textarea', {
    class: 'field__input field__input--textarea',
    rows: 3,
    placeholder: 'Explica por qué has elegido esas comprobaciones.',
    oninput: (e) => {
      reasoning = e.target.value;
      persist();
    }
  });
  reasoningInput.value = reasoning;

  const saveBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => {
      persist();
      store.flush();
      navigate('/mision/resultados');
    }
  }, 'Continuar →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/hipotesis')
  }, '← Atrás');

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Plan de diagnóstico'),
    h('p', { class: 'screen-station__intro' },
      '¿Qué comprobaciones realizarías primero?'),
    h('div', { class: 'card' },
      h('div', { class: 'checkbox-group' }, checkboxes),
      h('label', { class: 'field', style: { marginTop: 'var(--space-4)' } },
        h('span', { class: 'field__label' },
          '¿Por qué has elegido esas comprobaciones?'),
        reasoningInput
      )
    )
  );

  return {
    title: 'Misión final — Plan',
    content: body,
    footerActions: { left: backBtn, right: saveBtn }
  };
}