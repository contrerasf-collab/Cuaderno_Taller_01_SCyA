import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';

export function renderPregunta(station) {
  const content = h('div', { class: 'screen-station' },
    h('div', { class: 'card card--question' },
      h('h2', { class: 'card__title' }, 'Pregunta inicial'),
      h('p', { class: 'question-text' }, station.question)
    ),
    h('div', { class: 'card card--info' },
      h('p', null, '💡 No respondas todavía. Primero predice.')
    )
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/situacion`)
  }, '← Atrás');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/prediccion`)
  }, 'Hacer mi predicción →');

  return {
    title: `${station.order}. ${station.title} — Pregunta`,
    showManual: true,
    showHelp: false,
    content,
    footerActions: { left: backBtn, right: nextBtn }
  };
}