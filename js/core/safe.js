export function safe(value, fallback = '—') {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number' && Number.isNaN(value)) return fallback;
  return String(value);
}

export function translateStationState(state) {
  switch (state) {
    case 'pending': return 'Pendiente';
    case 'in_progress': return 'En curso';
    case 'completed': return 'Completada';
    default: return safe(state);
  }
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m} min ${rem} s` : `${m} min`;
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('es-ES');
  } catch (_) {
    return '—';
  }
}