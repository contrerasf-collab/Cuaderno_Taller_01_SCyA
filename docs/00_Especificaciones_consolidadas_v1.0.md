# ESPECIFICACIÓN CONSOLIDADA v1.0
## Cuaderno Interactivo de Taller — Electricidad Básica del Automóvil
### Documento de referencia única para la generación de `content.json` y el desarrollo de v1.0

---

## 1. REGISTRO DE CAMBIOS APROBADOS

### 1.1. Correcciones aplicadas (CRÍTICAS)

| ID | Corrección aplicada | Documento afectado | Decisión final adoptada |
|----|---------------------|--------------------|-------------------------|
| A1 | Resultado de acciones A06/A07 coherente con síntoma intermitente del cliente | Misión final (`content.json`) | A06: "Pita a veces (contacto intermitente)". A07: "A veces pita, a veces no". Causa secundaria reformulada: **conexión Faston floja en el relé de focos** (coherente con Estación 1). |
| A2 | Eliminación de la evaluación automática cualitativa | Especificación funcional §10, Arquitectura §2.6, Misión final | Se sustituye `evaluation.js` por `evidence-summary.js`. El sistema **no asigna nivel**. Genera resumen de evidencias (acciones ejecutadas, clave ejecutadas/no ejecutadas, hipótesis, conclusión, plan, tiempo, ayudas). El **profesor asigna** `correct` / `partial` / `insufficient` leyendo el resumen. Se elimina `evaluation.missionCriteria` y `evaluation.levels` de `content.json`; se sustituyen por `evidenceSummary` con campos descriptivos. |
| C1 | Arranque local documentado y automatizado | Arquitectura §0, README | Se incluyen `start.bat`, `start.sh` y `README.md` con instrucciones de 3 líneas. Servidor local vía `python -m http.server 8000`. Alternativa `npx serve` documentada. |

### 1.2. Correcciones aplicadas (IMPORTANTES)

| ID | Corrección aplicada | Documento afectado | Decisión final adoptada |
|----|---------------------|--------------------|-------------------------|
| A3 | Contador de pantallas de estación | `content.json` meta | `totalStationScreens: 10` (se renombra a `totalStationContentBlocks: 9` + `closingScreenGenerated: true`). |
| A4 | Service Worker fuera de v1.0 | Funcional §7.4, Arquitectura §0, MVP | SW diferido a v2.0. v1.0 funciona offline por ser estática y servirse desde local. Eliminado `service-worker.js` de la estructura. |
| A5 | Panel del profesor fuera de v1.0 | Funcional §1.1, §8, MVP | S08 eliminado de v1.0. El profesor consulta exportaciones JSON/Markdown. Panel centralizado → v2.0. |
| A6 | Sección S01 "Herramientas básicas" eliminada | Funcional §1.1, UX Tarea 3 | S01 eliminada. La seguridad ya está en el pie de S00 y en cada pantalla de situación. Los roles los asigna el profesor. Flujo: **S00 → S02 → S03/S06 → S07**. |
| A7 | Tarjetas del manual simplificadas | `content.json` manual, Estación 1 `documentation.cardIds` | Una sola tarjeta `M06` para relés (funcionamiento, bornes, NA/NC, esquema). `documentation.cardIds` de E1 = `["M06"]`. Eliminadas `M06b`, `M06c`, `M06d`. |
| A8 | Header consistente por contexto | UX Tarea 2, Tarea 4, Tarea 5 | Definición: S00 → nada. S02 → barra 4 estaciones + "X/4". S03 → "Paso X de 10" + nombre estación (sin barra de 4). S06 → "Paso X de 10". S07 → nada. Eliminados los 8 puntos de paso; se sustituyen por texto. |
| A9 | Separación de estado persistido y efímero | Arquitectura §5.1, §5.4 | `store.persisted` = `{ session, stations, mission, globalReflection }`. `store.ephemeral` = `{ ui }`. `store.get()` fusiona ambos para lectura. Persistencia guarda solo `persisted`. |
| A10 | Eliminación de ruta `/manual` | Arquitectura §4.1, §4.4 | `/manual` eliminada de `ROUTES`. El manual se abre solo vía `ui.manualOpen = true`. Sin deep-link. |
| C2 | `content.json` completo para las 4 estaciones | `content.json` | Antes de desarrollo, generar `content.json` con las 4 estaciones completas (9 bloques de contenido + 4 niveles de ayuda cada una), usando la Estación 1 como plantilla. Validación obligatoria con `schema.js`. |
| D1 | Eliminación de S01 del flujo | Funcional §1.1, Router | Flujo definitivo: **S00 → S02 → (S03 × 4) → S06 → S07**. Eliminadas 3 pantallas y 1 archivo (`s01-herramientas.js`). |
| D2 | Sustitución de evaluación automática | Arquitectura §2.6, `js/core/evaluation.js` | Eliminado `evaluation.js`. Nuevo `js/core/evidence-summary.js` (≈50 líneas) que produce un resumen estructurado. El profesor decide el nivel. |

### 1.3. Correcciones aplicadas (OPCIONALES)

| ID | Corrección aplicada | Documento afectado | Decisión final adoptada |
|----|---------------------|--------------------|-------------------------|
| A11 | Texto "complétalo en tu cuaderno" | UX Tarea 5.6 | Cambiado a: *"Este es el esquema incompleto. Tu predicción describe cómo completarlo."* |
| A12 | Icono de ayudas en S00 | UX Tarea 3 | Oculto (`showHelp: false` en S00). |
| A13 | Exportación unificada | Funcional §7.3, UX Tarea 9 | Un solo botón "Descargar evidencias" que genera un único archivo `.md` con el JSON embebido al final en bloque de código. |
| A14 | Migración de esquema | Arquitectura §5.4 | Sin migración en v1.0. Si `schemaVersion` no coincide: modal "Sesión incompatible. ¿Empezar nueva?" → borra y reinicia. |
| B1 | Eliminar evaluación automática | (cubierto por A2 y D2) | — |
| B2 | Eliminar S01 | (cubierto por A6 y D1) | — |
| B3 | Eliminar sub-tarjetas del manual | (cubierto por A7) | — |
| B4 | Diferir S08 | (cubierto por A5) | — |
| B5 | Diferir SW | (cubierto por A4) | — |
| B6 | Eliminar migración | (cubierto por A14) | — |
| C3 | Falta UX de S01 y S08 | (resuelto por A5 y A6) | Ambas se eliminan de v1.0. |
| C4 | Manejo de LocalStorage corrupto | Arquitectura §5.4 | `try/catch` en `JSON.parse` → modal "Sesión corrupta. ¿Empezar nueva?" → borra. Sin más lógica. |
| C5 | Precisión del cronómetro | Funcional §2.4 | Tiempo orientativo. No es evidencia crítica. Sin corrección. |
| D3 | Una tarjeta de manual por tema | (cubierto por A7) | — |
| D4 | Diferir S08 | (cubierto por A5) | — |
| D5 | Diferir SW | (cubierto por A4) | — |
| D6 | Exportación en un solo archivo | (cubierto por A13) | — |

### 1.4. Resumen de impacto

| Métrica | Antes | Después |
|---------|-------|---------|
| Secciones principales | 9 (S00–S08) | **7** (S00, S02, S03, S04, S05, S06, S07) |
| Pantallas/estados totales | 60+ | **53** |
| Archivos de pantalla | 10 secciones + 20 estaciones/misión | **8 secciones + 20 estaciones/misión** |
| Archivos core | 9 | **8** (eliminado `evaluation.js`, añadido `evidence-summary.js`) |
| Archivos de assets | 1 (sprite) + SW | **1** (sprite), SW diferido |
| Evaluación | Automática (NLP) | **Manual asistida por resumen** |
| Rutas del router | 8 | **6** (sin `/manual`, sin `/teacher`) |

---

## 2. REQUISITOS CONGELADOS v1.0

> **Estos requisitos son la única referencia válida para generar `content.json` y desarrollar la aplicación. Cualquier desviación requiere una nueva auditoría y aprobación.**

### 2.1. Alcance funcional

| ID | Requisito | Estado |
|----|-----------|--------|
| RF-01 | La app es una SPA estática, offline, sin servidor de aplicación, sin dependencias externas en runtime. | CONGELADO |
| RF-02 | El flujo de navegación es: **S00 Inicio → S02 Mapa → (S03 Estación × 4) → S06 Misión Final → S07 Cierre Global**. | CONGELADO |
| RF-03 | Existen **4 estaciones** (E1 Relé, E2 Alumbrado, E3 Electroventilador, E4 Inspectores). No se añaden ni eliminan. | CONGELADO |
| RF-04 | Cada estación tiene **9 bloques de contenido + 1 pantalla de cierre generada** = 10 pantallas. | CONGELADO |
| RF-05 | La misión final tiene **10 pantallas** (S06.01–S06.10). | CONGELADO |
| RF-06 | No existen S01 (Herramientas básicas) ni S08 (Panel del profesor) en v1.0. | CONGELADO |
| RF-07 | No hay Service Worker en v1.0. | CONGELADO |
| RF-08 | No hay migración de esquema en v1.0. | CONGELADO |
| RF-09 | No hay evaluación automática de nivel. El sistema genera resumen de evidencias; el profesor asigna nivel. | CONGELADO |
| RF-10 | El manual es un overlay con buscador y tarjetas de consulta. No es una ruta. | CONGELADO |
| RF-11 | Las ayudas son un overlay escalonado (niveles 1–4) con bloqueo secuencial y temporizador de 10 s. No son una ruta. | CONGELADO |
| RF-12 | La exportación es un único archivo `.md` con el JSON embebido al final. Un solo botón. | CONGELADO |
| RF-13 | El arranque se documenta con `start.bat`, `start.sh` y `README.md`. Servidor local vía `python -m http.server 8000`. | CONGELADO |

### 2.2. Modelo de datos (persistido)

| ID | Requisito | Estado |
|----|-----------|--------|
| RD-01 | `store.persisted` contiene: `session`, `stations[4]`, `mission`, `globalReflection`. | CONGELADO |
| RD-02 | `store.ephemeral` contiene: `ui` (overlays, foco, scroll). No se persiste. | CONGELADO |
| RD-03 | `store.get()` devuelve `persisted` + `ephemeral` fusionados para lectura. | CONGELADO |
| RD-04 | Persistencia: LocalStorage con clave `cuaderno_taller_v1`, debounce 500 ms, guardado inmediato en transición de ruta y `beforeunload`. | CONGELADO |
| RD-05 | `schemaVersion` actual: `1.0.0`. Si no coincide al cargar: modal "Sesión incompatible. ¿Empezar nueva?" → borra. | CONGELADO |
| RD-06 | `StationProgress` incluye: `stationId`, `state`, `startedAt`, `completedAt`, `timeSpentSec`, `prediction`, `measurements[]`, `check`, `conclusion`, `vehicleApplication`, `helpsUsed[]`, `manualQueries[]`. | CONGELADO |
| RD-07 | `MissionProgress` incluye: `state`, `startedAt`, `completedAt`, `timeSpentSec`, `relevantInfoFilter`, `hypotheses[]`, `diagnosticPlan`, `executedActions[]`, `check`, `conclusion`, `report`, `helpsUsed[]`, `manualQueries[]`. | CONGELADO |
| RD-08 | Los campos de medidas son **texto libre**. Sin validación numérica. Admite "OL", "pita", "no pita", "12,4 V", "infinito". | CONGELADO |

### 2.3. `content.json`

| ID | Requisito | Estado |
|----|-----------|--------|
| RC-01 | `content.json` contiene: `schemaVersion`, `meta`, `safety`, `stations[4]`, `manual`, `mission`, `closing`. | CONGELADO |
| RC-02 | `meta.totalStationContentBlocks: 9`, `meta.closingScreenGenerated: true`, `meta.totalMissionScreens: 10`. | CONGELADO |
| RC-03 | Cada estación incluye: `id`, `order`, `title`, `shortTitle`, `icon`, `situation`, `question`, `prediction`, `documentation`, `experiment`, `measurements`, `check`, `conclusion`, `vehicleApplication`, `helps[4]`. | CONGELADO |
| RC-04 | `documentation.cardIds` de E1 = `["M06"]`. Sin sub-tarjetas. | CONGELADO |
| RC-05 | El manual tiene **12 tarjetas** (`M01`–`M12`), cada una con: `id`, `category`, `title`, `keywords[]`, `readingTimeSec`, `answer`, `schema` (ASCII opcional), `values[]` (opcional), `commonError`. | CONGELADO |
| RC-06 | La misión final tiene 10 pantallas con el contenido definido en el documento "Misión Final Integradora". | CONGELADO |
| RC-07 | Las acciones de la misión son **8** (`A01`–`A08`) con los resultados corregidos: A06 "Pita a veces (contacto intermitente)", A07 "A veces pita, a veces no". | CONGELADO |
| RC-08 | La causa principal del caso es: **caída de tensión en masa del motor por corrosión**. Causa secundaria: **conexión Faston floja en el relé de focos**. Pistas falsas: fusible de más amperaje, electroventilador. | CONGELADO |
| RC-09 | No existe `evaluation.missionCriteria` ni `evaluation.levels`. Existe `evidenceSummary` con campos descriptivos. | CONGELADO |
| RC-10 | El `content.json` completo (4 estaciones) se genera **antes** de empezar el desarrollo y se valida con `schema.js`. | CONGELADO |

### 2.4. Stack técnico

| ID | Requisito | Estado |
|----|-----------|--------|
| RT-01 | Vanilla JS + ES Modules nativos. Sin build step. Sin frameworks. | CONGELADO |
| RT-02 | Router hash-based (`#/ruta`). 6 rutas: `/`, `/mapa`, `/estacion/:id/:screen`, `/mision/:screen`, `/cierre`, `/teacher` (eliminada). **5 rutas efectivas**. | CONGELADO |
| RT-03 | Estado con store propio (pub/sub, ≈60 líneas). Sin Redux, sin MobX. | CONGELADO |
| RT-04 | Renderizado con helper `h()` (hyperscript). Sin Virtual DOM. Re-render completo en navegación; actualizaciones puntuales dentro de pantalla. | CONGELADO |
| RT-05 | CSS nativo con custom properties (tokens). Sin preprocesador. | CONGELADO |
| RT-06 | SVG inline en sprite (`assets/icons/sprite.svg`). Sin dependencias de iconos. | CONGELADO |
| RT-07 | System fonts. Sin fuentes externas. | CONGELADO |
| RT-08 | Sin CDN, sin analítica, sin llamadas de red en runtime. | CONGELADO |

### 2.5. Estructura de archivos

| ID | Requisito | Estado |
|----|-----------|--------|
| RE-01 | Estructura de carpetas según Arquitectura §1, con las siguientes eliminaciones: `s01-herramientas.js`, `s08-teacher.js`, `service-worker.js`, `evaluation.js`, `manifest.json`. | CONGELADO |
| RE-02 | Añadidos: `js/core/evidence-summary.js`, `start.bat`, `start.sh`, `README.md`. | CONGELADO |
| RE-03 | El sprite de iconos incluye: casa, cuadrícula, libro, interrogación, número en círculo, check, punto, círculo vacío, flecha izquierda, flecha derecha, disquete/check, flecha abajo, casco/triángulo, símbolo de bobina, símbolo de V. | CONGELADO |

### 2.6. UX congelada

| ID | Requisito | Estado |
|----|-----------|--------|
| RU-01 | Paleta: fondo `#F2F3F5`, superficie `#FFFFFF`, texto `#1F2328`, acento `#1F5FA8`, taller `#F2B705`, completado `#2E7D4F`, error `#C0392B`. | CONGELADO |
| RU-02 | Tipografía: system fonts. Títulos 24 px/600, cuerpo 16 px/400, datos monoespaciados 15 px. | CONGELADO |
| RU-03 | Header por contexto: S00 nada; S02 barra 4 estaciones; S03 "Paso X de 10" + nombre; S06 "Paso X de 10"; S07 nada. | CONGELADO |
| RU-04 | Icono de ayudas oculto en S00. Icono de manual visible en S00 y S02. Ambos visibles en S03 y S06. | CONGELADO |
| RU-05 | Ayudas: overlay lateral derecho 420 px, niveles 1–4 con colores progresivos frío→cálido, bloqueo secuencial, temporizador 10 s. | CONGELADO |
| RU-06 | Manual: overlay a pantalla completa, buscador predictivo, índice por categorías, tarjetas de 30–60 s. | CONGELADO |
| RU-07 | Misión final: fondo `#E8EAED`, header carbón `#1F2328`, acento naranja `#E67E22`. Diferenciada visualmente de las estaciones. | CONGELADO |
| RU-08 | Cierre global: sin gamificación (sin puntos, medallas, rankings, confeti). Check verde 64 px, resumen, conclusiones, reflexión, mensaje final. | CONGELADO |

### 2.7. Fuera de alcance v1.0 (diferido a v2.0)

| ID | Elemento | Estado |
|----|----------|--------|
| RO-01 | Panel del profesor centralizado (S08). | DIFERIDO |
| RO-02 | Service Worker (offline cache). | DIFERIDO |
| RO-03 | Evaluación automática de nivel. | ELIMINADO |
| RO-04 | Migración de esquema. | ELIMINADO |
| RO-05 | Autenticación. | DIFERIDO |
| RO-06 | Responsive móvil optimizado (P2). | DIFERIDO |
| RO-07 | Modo oscuro. | DIFERIDO |
| RO-08 | Accesibilidad WCAG AA completa. | DIFERIDO |
| RO-09 | Internacionalización. | DIFERIDO |
| RO-10 | Historial de sesiones anteriores. | DIFERIDO |
| RO-11 | Comparativa entre grupos. | DIFERIDO |
| RO-12 | Tests automatizados. | DIFERIDO |

### 2.8. Criterios de aceptación v1.0

| ID | Criterio | Estado |
|----|----------|--------|
| RA-01 | Un alumno completa las 4 estaciones sin conexión. | CONGELADO |
| RA-02 | Un alumno completa la misión final tras las 4 estaciones. | CONGELADO |
| RA-03 | Los datos persisten al cerrar y reabrir la pestaña. | CONGELADO |
| RA-04 | La exportación `.md` contiene todas las evidencias y el JSON embebido. | CONGELADO |
| RA-05 | La app funciona en Chrome y Edge actualizados en 1366×768. | CONGELADO |
| RA-06 | El manual responde a búsquedas en < 1 s. | CONGELADO |
| RA-07 | Las ayudas respetan el bloqueo secuencial 1→2→3→4 y el temporizador. | CONGELADO |
| RA-08 | El resumen de evidencias se genera correctamente (acciones clave ejecutadas/no ejecutadas). | CONGELADO |
| RA-09 | El tiempo total de una sesión completa es < 3 h. | CONGELADO |
| RA-10 | El peso total de la app (sin `content.json`) es < 500 KB. | CONGELADO |

---

## 3. TRAZABILIDAD

| Documento previo | Estado tras consolidación |
|------------------|---------------------------|
| Práctica original (auditoría) | Histórico. No referencia válida. |
| Práctica mejorada | Histórico. Sustituido por estaciones corregidas. |
| Estaciones corregidas | **Válido** como fuente de contenido para `content.json`. |
| Manual técnico | **Válido** como fuente de tarjetas `M01`–`M12`. |
| Arquitectura del cuaderno | **Válido** con las correcciones A9, A10, A14, D2. |
| Misión final | **Válido** con las correcciones A1, A2. |
| Especificación funcional | **Válido** con las correcciones A4, A5, A6, A13, D1, D2. |
| Diseño UX | **Válido** con las correcciones A8, A11, A12. |
| Arquitectura técnica frontend | **Válido** con las correcciones A3, A4, A5, A6, A7, A9, A10, A14, C1, D2. |
| **Especificación Consolidada v1.0 (este documento)** | **ÚNICA REFERENCIA VÁLIDA** para generar `content.json` y desarrollar v1.0. |

---

## 4. PRÓXIMO PASO

Con esta especificación consolidada congelada, el siguiente artefacto a generar es:

**`content.json` completo con las 4 estaciones + manual + misión + cierre + safety.**

Debe validarse con `schema.js` antes de iniciar el desarrollo de la Fase 1 (núcleo).

---

**Fin de la Especificación Consolidada v1.0.**
**Estado: CONGELADO. Listo para generación de `content.json`.**