const EXPECTED_STATION_IDS = ['E1', 'E2', 'E3', 'E4'];
const VALID_STATES = ['pending', 'in_progress', 'completed'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function readSessionFile(file, currentVersion = '1.0.0') {
  if (!file) {
    return { ok: false, error: 'No se ha seleccionado ningún archivo.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, error: 'El archivo es demasiado grande (máximo 5 MB).' };
  }

  let text;
  try {
    text = await readFileAsText(file);
  } catch (_) {
    return { ok: false, error: 'No se pudo leer el archivo.' };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_) {
    return { ok: false, error: 'El archivo no es un JSON válido.' };
  }

  return validate(parsed, currentVersion);
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function parseVersion(v) {
  if (typeof v !== 'string') return null;
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function isVersionCompatible(importedVersion, currentVersion) {
  const i = parseVersion(importedVersion);
  const c = parseVersion(currentVersion);
  if (!i || !c) return false;
  return i.major === c.major;
}

function validate(parsed, currentVersion) {
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      error: 'El archivo no contiene una sesión válida (se esperaba un objeto).'
    };
  }

  if (typeof parsed.schemaVersion !== 'string' || parsed.schemaVersion.length === 0) {
    return {
      ok: false,
      error: 'El archivo no pertenece a esta aplicación (falta schemaVersion).'
    };
  }

  if (!isVersionCompatible(parsed.schemaVersion, currentVersion)) {
    return {
      ok: false,
      error: `Versión incompatible. El archivo es de la versión ${parsed.schemaVersion}; esta aplicación usa ${currentVersion}.`
    };
  }

  const session = parsed.session;
  if (!session || typeof session !== 'object') {
    return { ok: false, error: 'El archivo está incompleto: falta la sección session.' };
  }

  if (typeof session.groupName !== 'string' || session.groupName.trim().length === 0) {
    return { ok: false, error: 'El archivo está incompleto: falta el nombre del equipo.' };
  }

  if (!Array.isArray(session.members)) {
    return { ok: false, error: 'El archivo está incompleto: faltan los integrantes del equipo.' };
  }

  if (typeof session.schemaVersion !== 'string' ||
      !isVersionCompatible(session.schemaVersion, currentVersion)) {
    return {
      ok: false,
      error: 'La sesión del archivo es de una versión incompatible.'
    };
  }

  const stations = parsed.stations;
  if (!Array.isArray(stations) || stations.length !== 4) {
    return {
      ok: false,
      error: 'El archivo está incompleto: deben existir exactamente 4 estaciones.'
    };
  }

  const importedIds = stations
    .map(s => (s && typeof s === 'object') ? s.stationId : null)
    .sort();
  const expectedIds = [...EXPECTED_STATION_IDS].sort();
  if (JSON.stringify(importedIds) !== JSON.stringify(expectedIds)) {
    return {
      ok: false,
      error: 'Las estaciones del archivo no son válidas (deben ser E1, E2, E3 y E4).'
    };
  }

  for (const s of stations) {
    if (!VALID_STATES.includes(s.state)) {
      return {
        ok: false,
        error: `El estado de la estación ${s.stationId} no es válido (${s.state}).`
      };
    }

    if (s.timeSpentSec !== undefined) {
      if (typeof s.timeSpentSec !== 'number' ||
          Number.isNaN(s.timeSpentSec) ||
          s.timeSpentSec < 0) {
        return {
          ok: false,
          error: `La estación ${s.stationId} tiene un tiempo inválido.`
        };
      }
    }

    if (Array.isArray(s.helpsUsed)) {
      for (const h of s.helpsUsed) {
        if (!h || typeof h.level !== 'number' ||
            Number.isNaN(h.level) ||
            h.level < 1 || h.level > 4) {
          return {
            ok: false,
            error: `La estación ${s.stationId} tiene ayudas con nivel inválido.`
          };
        }
      }
    }

    if (Array.isArray(s.manualQueries)) {
      for (const q of s.manualQueries) {
        if (q && typeof q !== 'object') {
          return {
            ok: false,
            error: `La estación ${s.stationId} tiene consultas al manual inválidas.`
          };
        }
      }
    }
  }

  const state = {
    session: {
      ...session,
      currentScreen: '/',
      lastWorkingScreen: '/mapa'
    },
    stations
  };

  if (parsed.mission && typeof parsed.mission === 'object') {
    state.mission = parsed.mission;
  }
  if (parsed.finalMission && typeof parsed.finalMission === 'object') {
    state.finalMission = parsed.finalMission;
  }
  if (parsed.globalReflection && typeof parsed.globalReflection === 'object') {
    state.globalReflection = parsed.globalReflection;
  }

  return { ok: true, state };
}