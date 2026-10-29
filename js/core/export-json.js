export function downloadSessionJSON(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: state.session.schemaVersion,
    session: state.session,
    stations: state.stations,
    ...(state.mission ? { mission: state.mission } : {}),
    ...(state.finalMission ? { finalMission: state.finalMission } : {}),
    ...(state.globalReflection ? { globalReflection: state.globalReflection } : {})
  };

  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const groupName = (state.session.groupName || 'sesion')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .slice(0, 40) || 'sesion';
  const date = new Date().toISOString().slice(0, 10);

  const a = document.createElement('a');
  a.href = url;
  a.download = `sesion_${groupName}_${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}