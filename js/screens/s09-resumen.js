import { h } from '../core/dom.js';
import { navigate } from '../core/router.js';
import { store } from '../core/store.js';
import { getContent } from '../core/content.js';
import { safe, translateStationState, formatDuration, formatDate } from '../core/safe.js';
import { buildPlainTextSummary } from '../core/export-text.js';
import { downloadSessionJSON } from '../core/export-json.js';
import { copyToClipboard } from '../core/clipboard.js';

export function ScreenResumen() {
  const state = store.getPersisted();
  const content = getContent();

  function renderField(label, value) {
    return h('div', { class: 'resumen-field' },
      h('span', { class: 'resumen-field__label' }, label),
      h('span', { class: 'resumen-field__value' }, safe(value))
    );
  }

  function renderBlock(title, contentEl) {
    return h('div', { class: 'resumen-block' },
      h('h4', { class: 'resumen-block__title' }, title),
      contentEl
    );
  }

  function renderStation(stationContent) {
    const progress = state.stations.find(s => s.stationId === stationContent.id);
    if (!progress) return null;

    const parts = [];

    parts.push(h('div', { class: 'resumen-row' },
      h('span', { class: 'resumen-row__label' }, 'Estado'),
      h('span', {
        class: `resumen-row__value resumen-row__value--${progress.state}`
      }, translateStationState(progress.state))
    ));

    if (progress.prediction) {
      const predFields = (stationContent.prediction.fields || []).map(field =>
        renderField(field.label, progress.prediction[field.id])
      );
      if (predFields.length > 0) {
        parts.push(renderBlock('Predicción', h('div', null, predFields)));
      }
    }

    const measurements = (progress.measurements || []).filter(
      m => m.label || m.value || m.observations
    );
    if (measurements.length > 0) {
      parts.push(renderBlock('Medidas', h('div', null,
        measurements.map(m => {
          const unit = m.unit ? ` ${m.unit}` : '';
          const obs = m.observations ? ` (${m.observations})` : '';
          return renderField(safe(m.label), `${safe(m.value)}${unit}${obs}`);
        })
      )));
    }

    if (progress.check) {
      parts.push(renderBlock('Comprobación', h('div', null,
        renderField('¿Coincide con la predicción?',
          progress.check.matchesPrediction ? 'Sí' : 'No'),
        progress.check.explanation
          ? renderField('Explicación', progress.check.explanation)
          : null
      )));
    }

    if (progress.conclusion) {
      parts.push(renderBlock('Conclusión', h('p', null, progress.conclusion)));
    }

    if (progress.vehicleApplication) {
      parts.push(renderBlock('Aplicación al vehículo',
        h('p', null, progress.vehicleApplication)));
    }

    parts.push(h('div', { class: 'resumen-station__footer' },
      h('span', null, `Ayudas: ${(progress.helpsUsed || []).length}`),
      h('span', null, `Consultas: ${(progress.manualQueries || []).length}`),
      h('span', null, `Tiempo: ${formatDuration(progress.timeSpentSec || 0)}`)
    ));

    return h('details', {
      class: 'resumen-station',
      open: progress.state === 'completed'
    },
      h('summary', { class: 'resumen-station__summary' },
        `Estación ${stationContent.order} · ${stationContent.title}`
      ),
      h('div', { class: 'resumen-station__body' }, parts)
    );
  }

  function renderMission() {
    const fm = state.finalMission || {};
    if (!fm.startedAt && !fm.hypothesis && !fm.diagnosis) {
      return h('div', { class: 'resumen-mission resumen-mission--empty' },
        h('h3', null, 'Misión final · El último coche del día'),
        h('p', { class: 'resumen-muted' }, 'No iniciada.')
      );
    }

    const missionState = fm.completedAt
      ? 'Completada'
      : fm.startedAt
        ? 'En curso'
        : 'No iniciada';

    const parts = [
      h('div', { class: 'resumen-row' },
        h('span', { class: 'resumen-row__label' }, 'Estado'),
        h('span', { class: 'resumen-row__value' }, missionState)
      )
    ];

    if (fm.hypothesis) {
      parts.push(renderBlock('Hipótesis inicial', h('p', null, fm.hypothesis)));
    }

    if ((fm.selectedChecks || []).length > 0) {
      parts.push(renderBlock('Plan de diagnóstico', h('div', null,
        renderField('Comprobaciones', fm.selectedChecks.join(', ')),
        fm.checksReasoning
          ? renderField('Razonamiento', fm.checksReasoning)
          : null
      )));
    }

    if (fm.interpretation) {
      parts.push(renderBlock('Interpretación', h('p', null, fm.interpretation)));
    }
    if (fm.diagnosis) {
      parts.push(renderBlock('Diagnóstico final', h('p', null, fm.diagnosis)));
    }
    if (fm.repair) {
      parts.push(renderBlock('Reparación propuesta', h('p', null, fm.repair)));
    }

    const hasReflection = fm.reflection1 || fm.reflection2 || fm.reflection3;
    if (hasReflection) {
      parts.push(renderBlock('Reflexión profesional', h('div', null,
        fm.reflection1
          ? renderField('1. Estación que más ayudó', fm.reflection1)
          : null,
        fm.reflection2
          ? renderField('2. Concepto más importante', fm.reflection2)
          : null,
        fm.reflection3
          ? renderField('3. Comprobación que siempre harías', fm.reflection3)
          : null
      )));
    }

    return h('div', { class: 'resumen-mission' },
      h('h3', null, 'Misión final · El último coche del día'),
      h('div', null, parts)
    );
  }

  function renderTotals() {
    const completed = state.stations.filter(s => s.state === 'completed').length;
    const totalHelps = state.stations.reduce(
      (sum, s) => sum + (s.helpsUsed || []).length, 0
    );
    const totalQueries = state.stations.reduce(
      (sum, s) => sum + (s.manualQueries || []).length, 0
    );
    const totalTime = state.stations.reduce(
      (sum, s) => sum + (s.timeSpentSec || 0), 0
    );

    return h('div', { class: 'resumen-totals' },
      h('h3', null, 'Totales'),
      h('div', { class: 'resumen-totals__grid' },
        h('div', { class: 'resumen-totals__item' },
          h('span', { class: 'resumen-totals__label' }, 'Estaciones'),
          h('span', { class: 'resumen-totals__value' }, `${completed}/4`)
        ),
        h('div', { class: 'resumen-totals__item' },
          h('span', { class: 'resumen-totals__label' }, 'Ayudas'),
          h('span', { class: 'resumen-totals__value' }, String(totalHelps))
        ),
        h('div', { class: 'resumen-totals__item' },
          h('span', { class: 'resumen-totals__label' }, 'Consultas'),
          h('span', { class: 'resumen-totals__value' }, String(totalQueries))
        ),
        h('div', { class: 'resumen-totals__item' },
          h('span', { class: 'resumen-totals__label' }, 'Tiempo'),
          h('span', { class: 'resumen-totals__value' }, formatDuration(totalTime))
        )
      )
    );
  }

  function showToast(message) {
    const toast = h('div', { class: 'resumen-toast' }, message);
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('resumen-toast--visible'));
    setTimeout(() => {
      toast.classList.remove('resumen-toast--visible');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 2000);
  }

  function handleCopy() {
    const text = buildPlainTextSummary(state);
    copyToClipboard(text).then(ok => {
      showToast(ok ? 'Resumen copiado al portapapeles' : 'No se pudo copiar. Usa Imprimir.');
    });
  }

  function handlePrint() {
    document.querySelectorAll('.resumen-station').forEach(d => {
      d.open = true;
    });
    setTimeout(() => window.print(), 100);
  }

  function handleDownload() {
    try {
      downloadSessionJSON(state);
      showToast('Sesión descargada en JSON');
    } catch (err) {
      console.error(err);
      showToast('No se pudo descargar la sesión');
    }
  }

  const teamBlock = h('div', { class: 'resumen-header' },
    h('h2', { class: 'resumen-header__title' }, 'Resumen de la sesión'),
    h('div', { class: 'resumen-header__meta' },
      h('div', { class: 'resumen-field' },
        h('span', { class: 'resumen-field__label' }, 'Equipo'),
        h('span', { class: 'resumen-field__value' }, safe(state.session.groupName))
      ),
      h('div', { class: 'resumen-field' },
        h('span', { class: 'resumen-field__label' }, 'Integrantes'),
        h('span', { class: 'resumen-field__value' },
          (state.session.members || []).filter(Boolean).join(', ') || '—')
      ),
      h('div', { class: 'resumen-field' },
        h('span', { class: 'resumen-field__label' }, 'Inicio'),
        h('span', { class: 'resumen-field__value' }, formatDate(state.session.startedAt))
      )
    )
  );

  const actions = h('div', { class: 'resumen-actions no-print' },
    h('button', {
      class: 'btn btn--primary',
      type: 'button',
      onclick: handleCopy
    }, 'Copiar resumen'),
    h('button', {
      class: 'btn btn--secondary',
      type: 'button',
      onclick: handlePrint
    }, 'Imprimir / Guardar PDF'),
    h('button', {
      class: 'btn btn--secondary',
      type: 'button',
      onclick: handleDownload
    }, 'Descargar sesión (JSON)')
  );

  const stationSections = content.stations
    .map(st => renderStation(st))
    .filter(Boolean);

  const missionSection = renderMission();
  const totalsSection = renderTotals();

  const backBtn = h('button', {
    class: 'btn btn--secondary',
    type: 'button',
    onclick: () => navigate('/mapa')
  }, '← Volver al mapa');

  const contentEl = h('div', { class: 'screen-resumen' },
    teamBlock,
    actions,
    h('div', { class: 'resumen-stations' }, stationSections),
    missionSection,
    totalsSection
  );

  return {
    title: 'Resumen de la sesión',
    content: contentEl,
    footerActions: { left: backBtn }
  };
}