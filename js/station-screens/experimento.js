import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';

export function renderExperimento(station) {
  const exp = station.experiment || {};
  const steps = (exp.steps || []).map(step => h('li', null, step));

  const schemaEl = exp.incompleteSchema && exp.incompleteSchema.ascii
    ? h('div', { class: 'card' },
        h('h3', { class: 'card__subtitle' },
          exp.incompleteSchema.title || 'Esquema'),
        h('pre', { class: 'manual-card__schema' }, exp.incompleteSchema.ascii)
      )
    : null;

  const body = h('div', { class: 'screen-station' },
    h('h2', null, 'Experimento'),
    h('p', { class: 'screen-station__intro' }, exp.intro || ''),
    h('div', { class: 'card' },
      h('h3', { class: 'card__subtitle' }, 'Pasos'),
      h('ol', null, steps)
    ),
    schemaEl
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/documentacion`)
  }, '← Atrás');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/medidas`)
  }, 'Registrar medidas →');

  return {
    title: `${station.order}. ${station.title} — Experimento`,
    showManual: true,
    showHelp: false,
    content: body,
    footerActions: { left: backBtn, right: nextBtn }
  };
}