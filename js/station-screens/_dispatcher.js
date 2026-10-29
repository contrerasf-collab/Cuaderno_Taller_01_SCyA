import { renderSituacion } from './situacion.js';
import { renderPregunta } from './pregunta.js';
import { renderPrediccion } from './prediccion.js';

export function getStationScreen(station, screenId) {
  switch (screenId) {
    case 'situacion':  return renderSituacion(station);
    case 'pregunta':   return renderPregunta(station);
    case 'prediccion': return renderPrediccion(station);
    default:           return null;
  }
}