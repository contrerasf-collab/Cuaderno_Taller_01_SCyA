import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';

const RESULTS = [
  { label: 'Alimentación', value: 'Correcta', status: 'ok' },
  { label: 'Relé', value: 'Correcto', status: 'ok' },
  { label: 'Continuidad de masas', value: 'Correcta', status: 'ok' },
  { label: 'Caída de tensión en masa principal', value: '0,8 V (elevada)', status: 'warning' },
  { label: 'Consumidores', value: 'Operativos', status: 'ok' }
];

export function renderResultados() {
  const items = RESULTS.map(r =>
    h('li', { class: `results-list__item results-list__item--${r.status}` },
      h('span', { class: 'results-list__label' }, r.label),
      h('span', { class: `results-list__status results-list__status--${r.status}` }, r.value)
    )
  );

  const body = h('div', { class: 'screen-mission' },
    h('h2', null, 'Resultados de las pruebas'),
    h('p', { class: 'screen-station__intro' },
      'El taller ha completado las siguientes comprobaciones. Analiza los resultados antes de continuar.'),
    h('div', { class: 'card' },
      h('ul', { class: 'results-list' }, items)
    ),
    h('div', { class: 'card card--info' },
      h('p', null, 'No hay una única respuesta correcta. Interpreta los datos con lo aprendido durante la jornada.')
    )
  );

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate('/mision/interpretacion')
  }, 'Interpretar resultados →');

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mision/plan')
  }, '← Atrás');

  return {
    title: 'Misión final — Resultados',
    content: body,
    footerActions: { left: backBtn, right: nextBtn }
  };
}