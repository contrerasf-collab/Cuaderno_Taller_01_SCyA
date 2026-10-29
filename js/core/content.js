let content = null;

export async function loadContent() {
  const res = await fetch('./data/content.json');
  if (!res.ok) {
    throw new Error(`No se pudo cargar content.json (HTTP ${res.status})`);
  }
  const data = await res.json();
  validate(data);
  content = data;
  return data;
}

export function getContent() {
  if (!content) throw new Error('content.json no está cargado');
  return content;
}

export function getStation(id) {
  return getContent().stations.find(s => s.id === id) || null;
}

function validate(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('content.json inválido: no es un objeto');
  }
  if (!data.schemaVersion) {
    throw new Error('content.json inválido: falta schemaVersion');
  }
  if (!Array.isArray(data.stations) || data.stations.length !== 4) {
    throw new Error('content.json inválido: deben existir 4 estaciones');
  }
  for (const s of data.stations) {
    if (!s.id || !s.title || !s.situation || !s.question || !s.prediction) {
      throw new Error(`Estación incompleta: ${s.id || '?'}`);
    }
    if (!Array.isArray(s.situation.materials) || !Array.isArray(s.situation.safetyNotes)) {
      throw new Error(`Estación ${s.id}: situación incompleta`);
    }
    if (!Array.isArray(s.prediction.fields) || s.prediction.fields.length === 0) {
      throw new Error(`Estación ${s.id}: prediction.fields vacío`);
    }
  }
  if (!data.manual || !Array.isArray(data.manual.cards)) {
    throw new Error('content.json inválido: manual.cards ausente');
  }
  if (!data.mission || !Array.isArray(data.mission.actions)) {
    throw new Error('content.json inválido: mission.actions ausente');
  }
}