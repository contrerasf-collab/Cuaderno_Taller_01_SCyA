import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';

export function renderSituacion(station) {
  const content = h('div', { class: 'screen-station' },
    h('div', { class: 'card' },
      h('h2', { class: 'card__title' }, 'Situación de taller'),
      h('p', null, station.situation.narrative)
    ),
    h('div', { class: 'grid-2' },
      h('div', { class: 'card' },
        h('h3', { class: 'card__subtitle' }, 'Material disponible'),
        h('ul', { class: 'list' },
          station.situation.materials.map(m => h('li', null, m))
        )
      ),
      h('div', { class: 'card card--safety' },
        h('h3', { class: 'card__subtitle' }, 'Seguridad'),
        h('ul', { class: 'list list--safety' },
          station.situation.safetyNotes.map(n => h('li', null, `⚠ ${n}`))
        )
      )
    )
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mapa')
  }, '← Volver al mapa');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/pregunta`)
  }, 'Continuar →');

  return {
    title: `${station.order}. ${station.title} — Situación`,
    showManual: true,
    showHelp: false,
    content,
    footerActions: { left: backBtn, right: nextBtn }
  };
}