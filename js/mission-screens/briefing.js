import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';

const SYMPTOMS = [
  'Funcionamiento irregular del alumbrado.',
  'Activación irregular del electroventilador.',
  'Sustitución reciente de un relé.',
  'Fusibles aparentemente correctos.',
  'Batería con tensión correcta.'
];

export function renderBriefing() {
  const body = h('div', { class: 'screen-mission' },
    h('div', { class: 'card' },
      h('h2', { class: 'card__title' }, '⭐ El último coche del día'),
      h('p', null, '18:55 h. El taller está a punto de cerrar.'),
      h('p', null, 'Cuando ya se están recogiendo las herramientas, entra un último vehículo. El cliente necesita el coche para primera hora de la mañana. El jefe de taller te asigna el diagnóstico final.'),
      h('p', null, 'Dispones de toda la experiencia adquirida durante la jornada. Es momento de resolver el caso.')
    ),
    h('div', { class: 'card' },
      h('h3', { class: 'card__subtitle' }, 'Síntomas observados'),
      h('ul', { class: 'list' },
        SYMPTOMS.map(s => h('li', null, s))
      )
    ),
    h('div', { class: 'card card--info' },
      h('p', null, 'Objetivo: determinar la causa más probable del problema y proponer una reparación.')
    )
  );

  const nextBtn = h('button', {
    class: 'btn btn--primary',
    type: 'button',
    onclick: () => navigate('/mision/hipotesis')
  }, 'Analizar caso →');

  return {
    title: 'Misión final — Briefing',
    content: body,
    footerActions: { right: nextBtn },
    onMount() {
      const fm = store.getPersisted().finalMission;
      if (fm && !fm.startedAt) {
        store.updatePersisted(s => ({
          finalMission: { ...s.finalMission, startedAt: new Date().toISOString() }
        }));
        store.flush();
      }
    }
  };
}