import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';

export function ScreenMisionPlaceholder() {
  const content = h('div', { class: 'screen-message' },
    h('p', null, 'Has desbloqueado la misión final. ¡Buen trabajo!'),
    h('p', null, h('small', null, 'La misión "El último coche del día" se implementará en el próximo sprint.')),
    h('button', {
      class: 'btn btn--primary',
      type: 'button',
      onclick: () => navigate('/mapa')
    }, 'Volver al mapa')
  );

  return {
    title: 'Misión final',
    content
  };
}