import { h } from '../core/dom.js';
import { getContent } from '../core/content.js';
import { store } from '../core/store.js';
import { openModal } from './modal.js';

export function openManualPanel(station) {
  const content = getContent();
  const doc = station.documentation || {};
  const cardIds = doc.cardIds || [];
  const cards = cardIds
    .map(id => content.manual.cards.find(c => c.id === id))
    .filter(Boolean);

  if (cards.length > 0) {
    const now = new Date().toISOString();
    store.updatePersisted(s => ({
      stations: s.stations.map(st =>
        st.stationId === station.id
          ? {
              ...st,
              manualQueries: [...(st.manualQueries || []), { cardIds, timestamp: now }]
            }
          : st
      )
    }));
    store.flush();
  }

  const body = h('div', { class: 'manual-panel' });

  if (cards.length === 0) {
    body.appendChild(h('p', null, 'No hay documentación disponible para esta estación.'));
  } else {
    for (const card of cards) {
      body.appendChild(renderCard(card));
    }
  }

  openModal({
    title: 'Manual',
    content: body,
    size: 'lg'
  });
}

function renderCard(card) {
  const parts = [h('p', null, card.answer)];

  if (card.schema) {
    parts.push(h('pre', { class: 'manual-card__schema' }, card.schema));
  }

  if (Array.isArray(card.values) && card.values.length > 0) {
    parts.push(h('ul', { class: 'list' },
      card.values.map(v => h('li', null, `${v.label}: ${v.value}`))
    ));
  }

  if (card.commonError) {
    parts.push(h('p', { class: 'manual-card__error' }, card.commonError));
  }

  return h('details', { class: 'manual-card', open: true },
    h('summary', null, card.title),
    h('div', { class: 'manual-card__body' }, parts)
  );
}