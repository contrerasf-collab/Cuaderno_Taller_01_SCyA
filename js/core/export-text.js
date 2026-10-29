import { getContent } from './content.js';
import { safe, translateStationState, formatDuration, formatDate } from './safe.js';

export function buildPlainTextSummary(state) {
  const content = getContent();
  const lines = [];

  lines.push('JORNADA TÉCNICA DE ELECTRICIDAD BÁSICA DEL AUTOMÓVIL');
  lines.push('Resumen de la sesión');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Equipo: ${safe(state.session.groupName)}`);
  lines.push(`Integrantes: ${(state.session.members || []).filter(Boolean).join(', ') || '—'}`);
  lines.push(`Inicio: ${formatDate(state.session.startedAt)}`);
  lines.push(`Última actividad: ${formatDate(state.session.lastActivityAt)}`);
  lines.push('');

  for (const stationContent of content.stations) {
    const progress = state.stations.find(s => s.stationId === stationContent.id);
    if (!progress) continue;

    lines.push('-'.repeat(60));
    lines.push(`ESTACIÓN ${stationContent.order} · ${stationContent.title}`);
    lines.push(`Estado: ${translateStationState(progress.state)}`);
    lines.push('');

    if (progress.prediction) {
      lines.push('PREDICCIÓN');
      for (const field of stationContent.prediction.fields || []) {
        const value = progress.prediction[field.id];
        lines.push(`  ${field.label}`);
        lines.push(`  → ${safe(value)}`);
      }
      lines.push('');
    }

    const measurements = progress.measurements || [];
    const validMeasurements = measurements.filter(m => m.label || m.value || m.observations);
    if (validMeasurements.length > 0) {
      lines.push('MEDIDAS');
      for (const m of validMeasurements) {
        const unit = m.unit ? ` ${m.unit}` : '';
        const obs = m.observations ? ` (${m.observations})` : '';
        lines.push(`  ${safe(m.label)}: ${safe(m.value)}${unit}${obs}`);
      }
      lines.push('');
    }

    if (progress.check) {
      lines.push('COMPROBACIÓN');
      lines.push(`  ¿Coincide con la predicción?: ${progress.check.matchesPrediction ? 'Sí' : 'No'}`);
      if (progress.check.explanation) {
        lines.push(`  Explicación: ${progress.check.explanation}`);
      }
      lines.push('');
    }

    if (progress.conclusion) {
      lines.push('CONCLUSIÓN');
      lines.push(`  ${progress.conclusion}`);
      lines.push('');
    }

    if (progress.vehicleApplication) {
      lines.push('APLICACIÓN AL VEHÍCULO');
      lines.push(`  ${progress.vehicleApplication}`);
      lines.push('');
    }

    lines.push(`Ayudas utilizadas: ${(progress.helpsUsed || []).length}`);
    lines.push(`Consultas al manual: ${(progress.manualQueries || []).length}`);
    lines.push(`Tiempo: ${formatDuration(progress.timeSpentSec || 0)}`);
    lines.push('');
  }

  const fm = state.finalMission || {};
  if (fm.startedAt || fm.hypothesis || fm.diagnosis) {
    lines.push('-'.repeat(60));
    lines.push('MISIÓN FINAL · EL ÚLTIMO COCHE DEL DÍA');
    const missionState = fm.completedAt
      ? 'Completada'
      : fm.startedAt
        ? 'En curso'
        : 'No iniciada';
    lines.push(`Estado: ${missionState}`);
    lines.push('');

    if (fm.hypothesis) {
      lines.push('Hipótesis inicial:');
      lines.push(`  ${fm.hypothesis}`);
      lines.push('');
    }

    if ((fm.selectedChecks || []).length > 0) {
      lines.push(`Comprobaciones seleccionadas: ${fm.selectedChecks.join(', ')}`);
      if (fm.checksReasoning) lines.push(`Razonamiento: ${fm.checksReasoning}`);
      lines.push('');
    }

    if (fm.interpretation) {
      lines.push('Interpretación:');
      lines.push(`  ${fm.interpretation}`);
      lines.push('');
    }

    if (fm.diagnosis) {
      lines.push('Diagnóstico final:');
      lines.push(`  ${fm.diagnosis}`);
      lines.push('');
    }

    if (fm.repair) {
      lines.push('Reparación propuesta:');
      lines.push(`  ${fm.repair}`);
      lines.push('');
    }

    if (fm.reflection1 || fm.reflection2 || fm.reflection3) {
      lines.push('Reflexión profesional:');
      if (fm.reflection1) lines.push(`  1. ${fm.reflection1}`);
      if (fm.reflection2) lines.push(`  2. ${fm.reflection2}`);
      if (fm.reflection3) lines.push(`  3. ${fm.reflection3}`);
      lines.push('');
    }
  }

  const completed = state.stations.filter(s => s.state === 'completed').length;
  const totalHelps = state.stations.reduce((sum, s) => sum + (s.helpsUsed || []).length, 0);
  const totalQueries = state.stations.reduce((sum, s) => sum + (s.manualQueries || []).length, 0);
  const totalTime = state.stations.reduce((sum, s) => sum + (s.timeSpentSec || 0), 0);

  lines.push('='.repeat(60));
  lines.push('TOTALES');
  lines.push(`  Estaciones completadas: ${completed}/4`);
  lines.push(`  Ayudas utilizadas: ${totalHelps}`);
  lines.push(`  Consultas al manual: ${totalQueries}`);
  lines.push(`  Tiempo en estaciones: ${formatDuration(totalTime)}`);

  return lines.join('\n');
}