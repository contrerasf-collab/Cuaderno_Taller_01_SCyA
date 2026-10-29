import { h } from '../core/dom.js';
import { store } from '../core/store.js';
import { getContent } from '../core/content.js';
import { navigate } from '../core/router.js';

export function ScreenInicio() {
  const state = store.get();
  const content = getContent();
  const hasSession = !!(state.session.groupName && state.session.groupName.length > 0);
  const intro = content.introNarrative || '';

  let groupInput = null;
  let member1 = null;
  let member2 = null;
  let member3 = null;

  function saveAndStart() {
    const groupName = groupInput.value.trim();
    if (!groupName) {
      groupInput.classList.add('field__input--error');
      groupInput.focus();
      return;
    }
    const members = [member1, member2, member3]
      .map(i => i.value.trim())
      .filter(Boolean);

    store.updatePersisted(s => ({
      session: {
        ...s.session,
        groupName,
        members,
        startedAt: s.session.startedAt || new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      }
    }));

    navigate('/mapa');
  }

  function continueSession() {
    const fresh = store.getPersisted();
    const target = fresh.session.lastWorkingScreen || '/mapa';
    navigate(target);
  }

  function newSession() {
    if (!window.confirm('¿Empezar una nueva sesión? Se borrará el progreso actual.')) return;
    store.reset();
    navigate('/');
    window.location.reload();
  }

  const actions = hasSession
    ? [
        h('button', {
          class: 'btn btn--primary',
          type: 'button',
          onclick: continueSession
        }, `Continuar sesión (${state.stations.filter(s => s.state === 'completed').length}/4)`),
        h('button', {
          class: 'btn btn--secondary',
          type: 'button',
          onclick: newSession
        }, 'Nueva sesión')
      ]
    : h('button', {
        class: 'btn btn--primary',
        type: 'button',
        onclick: saveAndStart
      }, 'Empezar la jornada');

  const el = h('div', { class: 'screen-inicio' },
    h('div', { class: 'screen-inicio__hero' },
      h('h1', { class: 'screen-inicio__title' }, 'Jornada Técnica de Electricidad Básica del Automóvil'),
      h('p', { class: 'screen-inicio__subtitle' }, 'Cuaderno interactivo de taller'),
      intro
        ? h('p', { class: 'screen-inicio__intro' }, intro)
        : null
    ),
    h('div', { class: 'card screen-inicio__card' },
      h('h2', { class: 'card__title' }, 'Identificación del equipo'),
      h('label', { class: 'field' },
        h('span', { class: 'field__label' }, 'Nombre del equipo'),
        groupInput = h('input', {
          class: 'field__input',
          type: 'text',
          placeholder: 'Ej. Equipo A',
          value: state.session.groupName || '',
          oninput: () => groupInput.classList.remove('field__input--error')
        })
      ),
      h('div', { class: 'field-group' },
        h('span', { class: 'field__label' }, 'Integrantes'),
        member1 = h('input', { class: 'field__input', type: 'text', placeholder: 'Integrante 1', value: state.session.members[0] || '' }),
        member2 = h('input', { class: 'field__input', type: 'text', placeholder: 'Integrante 2', value: state.session.members[1] || '' }),
        member3 = h('input', { class: 'field__input', type: 'text', placeholder: 'Integrante 3 (opcional)', value: state.session.members[2] || '' })
      )
    ),
    h('div', { class: 'screen-inicio__actions' }, actions),
    h('p', { class: 'screen-inicio__safety' }, '⚠ Gafas de protección · Fusible obligatorio · No medir intensidad')
  );

  return {
    title: 'Inicio',
    showManual: false,
    showHelp: false,
    content: el,
    onMount() {
      if (!hasSession && groupInput) {
        setTimeout(() => { try { groupInput.focus(); } catch (_) {} }, 50);
      }
    }
  };
}