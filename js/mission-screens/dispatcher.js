import { renderBriefing } from './briefing.js';
import { renderHipotesis } from './hipotesis.js';
import { renderPlan } from './plan.js';
import { renderResultados } from './resultados.js';
import { renderInterpretacion } from './interpretacion.js';
import { renderDiagnostico } from './diagnostico.js';
import { renderReparacion } from './reparacion.js';
import { renderReflexion } from './reflexion.js';
import { renderCierreMision } from './cierre-mision.js';

export function getMissionScreen(screenId) {
  switch (screenId) {
    case 'briefing':       return renderBriefing();
    case 'hipotesis':      return renderHipotesis();
    case 'plan':           return renderPlan();
    case 'resultados':     return renderResultados();
    case 'interpretacion': return renderInterpretacion();
    case 'diagnostico':    return renderDiagnostico();
    case 'reparacion':     return renderReparacion();
    case 'reflexion':      return renderReflexion();
    case 'cierre':         return renderCierreMision();
    default:               return null;
  }
}