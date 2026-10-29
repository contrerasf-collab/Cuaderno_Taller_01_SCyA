import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { getContent } from '../core/content.js';

export function renderDocumentacion(station) {
  const content = getContent();
  const cardIds = (station.documentation && station.documentation.cardIds) || [];
  const cards = cardIds
    .map(id => content.manual.cards.find(c => c.id === id))
    .filter(Boolean);

  const cardsEl = cards.length > 0
    ? cards.map(card => renderCard(card))
    : [h('p', null, 'No hay tarjetas disponibles para esta estación.')];

  const body = h('div', { class: 'screen-station' },
    h('h2', null, 'Documentación de consulta'),
    h('p', { class: 'screen-station__intro' },
      (station.documentation && station.documentation.intro) || ''),
    h('div', null, cardsEl),
    station.documentation && station.documentation.footnote
      ? h('div', { class: 'card card--info' },
          h('p', null, `💡 ${station.documentation.footnote}`))
      : null
  );

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/prediccion`)
  }, '← Atrás');

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate(`/estacion/${station.id}/experimento`)
  }, 'Ir al experimento →');

  return {
    title: `${station.order}. ${station.title} — Documentación`,
    showManual: true,
    showHelp: false,
    content: body,
    footerActions: { left: backBtn, right: nextBtn }
  };
}

function renderCard(card) {
  const parts = [h('p', null, card.answer)];

  if (card.schema) {
    parts.push(h('pre', { class: 'manual-card__schema' }, card.schema));
  }

  if (Array.isArray(card.values) && card.values.length > 0) {
    parts.push(h('ul', { class: 'list' },
      card.values.map(v =>
        h('li', null, h('strong', null, `${v.label}: `), v.value))
    ));
  }

  if (card.commonError) {
    parts.push(h('p', { class: 'manual-card__error' }, `⚠ ${card.commonError}`));
  }

  return h('details', { class: 'manual-card' },
    h('summary', null, card.title),
    h('div', { class: 'manual-card__body' }, parts)
  );
}