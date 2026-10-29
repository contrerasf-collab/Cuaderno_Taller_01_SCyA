import { renderSituacion } from './situacion.js';
import { renderPregunta } from './pregunta.js';
import { renderPrediccion } from './prediccion.js';
import { renderDocumentacion } from './documentacion.js';
import { renderExperimento } from './experimento.js';
import { renderMedidas } from './medidas.js';
import { renderComprobacion } from './comprobacion.js';
import { renderConclusion } from './conclusion.js';
import { renderAplicacion } from './aplicacion.js';
import { renderCierreEstacion } from './cierre-estacion.js';

export function getStationScreen(station, screenId) {
  switch (screenId) {
    case 'situacion':     return renderSituacion(station);
    case 'pregunta':      return renderPregunta(station);
    case 'prediccion':    return renderPrediccion(station);
    case 'documentacion': return renderDocumentacion(station);
    case 'experimento':   return renderExperimento(station);
    case 'medidas':       return renderMedidas(station);
    case 'comprobacion':  return renderComprobacion(station);
    case 'conclusion':    return renderConclusion(station);
    case 'aplicacion':    return renderAplicacion(station);
    case 'cierre':        return renderCierreEstacion(station);
    default:              return null;
  }
}