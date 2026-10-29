# ESPECIFICACIÓN FUNCIONAL
## Cuaderno Interactivo de Taller — Electricidad Básica del Automóvil
### Documento para desarrollo · Versión 1.0

---

## 0. RESUMEN EJECUTIVO

| Aspecto | Definición |
|---------|------------|
| Tipo de aplicación | SPA HTML estática, sin servidor, offline-first |
| Público | Alumnado 1º GM Electromecánica del Automóvil |
| Uso | Acompañamiento de práctica presencial de taller |
| Duración de sesión | 2-3 h (4 estaciones + misión final) |
| Dispositivo prioritario | Portátil de aula (1366×768 mínimo) |
| Almacenamiento | LocalStorage del navegador + exportación JSON |
| Dependencias externas | Ninguna (sin CDN, sin fuentes externas, sin analítica) |
| Framework sugerido | Vanilla JS o framework ligero (Preact/Alpine). No React pesado. |

---

## 1. MAPA COMPLETO DE PANTALLAS

### 1.1. Árbol jerárquico

```
APP
│
├── S00 · PANTALLA DE INICIO
│   ├── S00.1 · Identificación de grupo (modal)
│   └── S00.2 · Continuar sesión existente (si hay progreso)
│
├── S01 · HERRAMIENTAS BÁSICAS
│   ├── S01.1 · ¿Cómo usar este cuaderno? (onboarding 3 pasos)
│   ├── S01.2 · Roles del equipo
│   └── S01.3 · Normas de seguridad
│
├── S02 · MAPA DE ESTACIONES
│   ├── S02.1 · Tarjeta Estación 1
│   ├── S02.2 · Tarjeta Estación 2
│   ├── S02.3 · Tarjeta Estación 3
│   ├── S02.4 · Tarjeta Estación 4
│   └── S02.5 · Tarjeta Misión Final (bloqueada hasta 4/4)
│
├── S03 · ESTACIÓN (plantilla reutilizable ×4)
│   ├── S03.01 · Situación de taller
│   ├── S03.02 · Pregunta inicial
│   ├── S03.03 · Predicción
│   ├── S03.04 · Documentación opcional (acceso a Manual contextual)
│   ├── S03.05 · Experimento (guía de montaje)
│   ├── S03.06 · Registro de medidas
│   ├── S03.07 · Comprobación (predicción vs resultado)
│   ├── S03.08 · Conclusión
│   ├── S03.09 · Aplicación al vehículo
│   └── S03.10 · Cierre de estación
│
├── S04 · MANUAL TÉCNICO (overlay global)
│   ├── S04.1 · Buscador
│   ├── S04.2 · Índice por categorías
│   ├── S04.3 · Tarjeta de consulta
│   └── S04.4 · Historial de consultas
│
├── S05 · AYUDAS ESCALONADAS (overlay global)
│   ├── S05.1 · Panel de niveles (1-4)
│   ├── S05.2 · Tarjeta de nivel
│   └── S05.3 · Feedback de utilidad
│
├── S06 · MISIÓN FINAL
│   ├── S06.01 · Recepción del vehículo
│   ├── S06.02 · Declaración del cliente
│   ├── S06.03 · Observaciones iniciales
│   ├── S06.04 · Hipótesis
│   ├── S06.05 · Plan de diagnóstico
│   ├── S06.06 · Ejecución de medidas (panel de acciones)
│   ├── S06.07 · Comprobación de hipótesis
│   ├── S06.08 · Conclusión diagnóstica
│   ├── S06.09 · Informe final de taller
│   └── S06.10 · Cierre de misión
│
├── S07 · CIERRE GLOBAL
│   ├── S07.1 · Resumen de estaciones
│   ├── S07.2 · Ayudas utilizadas
│   ├── S07.3 · Conclusiones registradas
│   ├── S07.4 · Reflexión final
│   └── S07.5 · Exportación de evidencias
│
└── S08 · PANEL DEL PROFESOR (ruta oculta)
    ├── S08.1 · Vista de grupos
    ├── S08.2 · Detalle de grupo
    ├── S08.3 · Exportación masiva
    └── S08.4 · Desbloqueo manual de misión final
```

**Total pantallas:** 8 secciones principales, 38 pantallas/estados.

### 1.2. Pantallas con overlays

Los overlays **Manual (S04)** y **Ayudas (S05)** son accesibles desde **cualquier** pantalla de estación (S03) y desde la misión final (S06). Al cerrarse, retornan al punto exacto de origen (scroll incluido).

---

## 2. MODELO DE DATOS

### 2.1. Entidades

#### `Session` (sesión de trabajo)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `sessionId` | string (UUID) | Identificador único de sesión |
| `groupName` | string | Nombre del equipo |
| `members` | string[] | Nombres de integrantes (1-3) |
| `startedAt` | ISO 8601 | Fecha/hora de inicio |
| `lastActivityAt` | ISO 8601 | Última actividad registrada |
| `currentScreen` | string | ID de la pantalla actual (para restaurar) |
| `screenScroll` | number | Posición de scroll guardada |
| `schemaVersion` | string | Versión del esquema (para migraciones) |

#### `StationProgress` (progreso por estación) — array de 4

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `stationId` | enum `"E1"｜"E2"｜"E3"｜"E4"` | Identificador |
| `state` | enum `"pending"｜"in_progress"｜"completed"` | Estado |
| `startedAt` | ISO 8601 \| null | Inicio de la estación |
| `completedAt` | ISO 8601 \| null | Fin de la estación |
| `timeSpentSec` | number | Tiempo acumulado en la estación |
| `prediction` | `Prediction` | Predicción registrada |
| `measurements` | `Measurement[]` | Medidas registradas |
| `check` | `Check` | Comprobación |
| `conclusion` | string | Texto de conclusión |
| `vehicleApplication` | string | Texto de aplicación |
| `helpsUsed` | `HelpUse[]` | Ayudas solicitadas |
| `manualQueries` | `ManualQuery[]` | Consultas al manual |

#### `Prediction`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `text` | string | Respuesta libre del alumno |
| `guidedAnswers` | `{ question: string, answer: string }[]` | Respuestas a preguntas guía |
| `lockedAt` | ISO 8601 | Momento en que se bloqueó (no editable) |

#### `Measurement`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `measureId` | string | ID único de la fila |
| `label` | string | Qué se mide |
| `value` | string | Valor obtenido (texto, no numérico: admite "OL", "pita", etc.) |
| `unit` | string \| null | Unidad ("V", "Ω", "—") |
| `observations` | string | Observaciones |
| `createdAt` | ISO 8601 | Marca de tiempo |

#### `Check`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `matchesPrediction` | boolean | Sí/No |
| `explanation` | string | Explicación de diferencias |
| `lockedAt` | ISO 8601 | Bloqueo |

#### `HelpUse`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `stationId` | string | Estación donde se solicitó |
| `screenId` | string | Pantalla de origen |
| `level` | 1-4 | Nivel solicitado |
| `requestedAt` | ISO 8601 | Marca de tiempo |
| `usefulness` | enum `"yes"｜"no"｜"somewhat"` \| null | Feedback |

#### `ManualQuery`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `queryText` | string | Término buscado |
| `cardId` | string | Tarjeta consultada |
| `openedAt` | ISO 8601 | Marca de tiempo |

#### `MissionProgress` (misión final)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `state` | enum `"locked"｜"available"｜"in_progress"｜"completed"` | Estado |
| `startedAt` | ISO 8601 \| null | Inicio |
| `completedAt` | ISO 8601 \| null | Fin |
| `timeSpentSec` | number | Tiempo acumulado |
| `relevantInfoFilter` | string | Criba de información |
| `hypotheses` | string[] | Hipótesis iniciales (mín. 2) |
| `diagnosticPlan` | string | Orden de pasos escrito |
| `executedActions` | `MissionAction[]` | Medidas ejecutadas |
| `check` | `Check` | Comprobación de hipótesis |
| `conclusion` | string | Conclusión diagnóstica |
| `report` | `MissionReport` | Informe final |
| `helpsUsed` | `HelpUse[]` | Ayudas |
| `manualQueries` | `ManualQuery[]` | Consultas |

#### `MissionAction`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `actionId` | string | ID de la acción elegida |
| `label` | string | Descripción de la acción |
| `result` | string | Resultado devuelto por el sistema |
| `executedAt` | ISO 8601 | Marca de tiempo |

#### `MissionReport`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `vehicle` | string | Datos del vehículo |
| `symptoms` | string | Síntomas |
| `measurements` | string | Resumen de medidas |
| `diagnosis` | string | Diagnóstico |
| `repairProposal` | string | Reparación propuesta |
| `observations` | string | Observaciones de seguridad |

#### `GlobalReflection` (cierre global)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `bestUnderstood` | string | Qué ha entendido mejor |
| `hardest` | string | Qué le ha costado más |
| `doDifferently` | string | Qué haría distinto |

#### `Evaluation` (calculada, no almacenada como verdad)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `missionLevel` | enum `"correct"｜"partial"｜"insufficient"` | Nivel de diagnóstico |
| `criteria` | `{ key: string, met: boolean }[]` | Criterios cumplidos |
| `computedAt` | ISO 8601 | Momento de cálculo |

### 2.2. Contenido estático (no almacenado como datos de usuario)

Los contenidos de estaciones, tarjetas de manual, ayudas y narrativa se cargan desde **un único archivo `content.json`** empaquetado con la app. No se modifican en tiempo de ejecución.

```json
{
  "schemaVersion": "1.0",
  "stations": [ /* 4 estaciones con sus pantallas */ ],
  "manualCards": [ /* 12+ tarjetas */ ],
  "helps": [ /* niveles 1-4 por estación */ ],
  "mission": { /* caso completo */ }
}
```

### 2.3. Persistencia

- **Clave LocalStorage:** `cuaderno_taller_v1`
- **Contenido:** objeto `Session` completo serializado.
- **Autoguardado:** en cada cambio de campo (debounce 500 ms) y en cada transición de pantalla.
- **Migración:** al cargar, si `schemaVersion` < actual, aplicar migración.

---

## 3. NAVEGACIÓN COMPLETA

### 3.1. Flujo principal (happy path)

```
INICIO (S00)
  │ [Empezar]
  ▼
HERRAMIENTAS BÁSICAS (S01)
  │ [Continuar]
  ▼
MAPA DE ESTACIONES (S02)
  │ [E1]
  ▼
ESTACIÓN 1 (S03)
  │ Situación → Pregunta → Predicción → Experimento
  │ → Medidas → Comprobación → Conclusión → Aplicación
  │ [Cerrar estación]
  ▼
CIERRE ESTACIÓN (S03.10)
  │ [Volver al mapa]
  ▼
MAPA (S02)  ──► [E2] ──► ... ──► [E4]
  │
  │ (cuando 4/4 completadas)
  ▼
MISIÓN FINAL (S06)
  │ Recepción → Cliente → Observación → Hipótesis
  │ → Plan → Medidas → Comprobación → Conclusión
  │ → Informe → Cierre
  ▼
CIERRE GLOBAL (S07)
  │ [Exportar]
  ▼
FIN
```

### 3.2. Flujos alternativos

| Flujo | Disparador | Comportamiento |
|-------|------------|----------------|
| **Reanudar sesión** | Al abrir la app con `Session` existente | Modal "¿Continuar donde lo dejaste?" → retorna a `currentScreen` |
| **Nueva sesión** | Botón "Nueva sesión" en inicio | Borra `Session` previa (con confirmación) |
| **Acceso a estación ya completada** | Clic en tarjeta completada | Modo lectura (no editable) + botón "Reabrir" (solo si profesor lo permite) |
| **Acceso a misión bloqueada** | Clic en tarjeta bloqueada | Mensaje "Completa las 4 estaciones para desbloquear" |
| **Desbloqueo manual** | Profesor en panel S08 | Fuerza `MissionProgress.state = "available"` |
| **Cerrar overlay Manual** | Botón "Volver al taller" o ESC | Retorna a pantalla de origen con scroll restaurado |
| **Cerrar overlay Ayudas** | Botón "Volver al taller" o ESC | Igual que manual |
| **Cierre de sesión forzado** | Profesor en panel S08 | Botón "Finalizar sesión de grupo" → bloquea edición |
| **Pérdida de datos** | LocalStorage corrupto | Mensaje de error + opción de empezar nueva sesión |

### 3.3. Diagrama de transiciones (detalle)

```
┌─────────────┐
│  S00 INICIO │
└──┬───────┬──┘
   │       │
   │       └──► S00.1 (modal identificación) ──┐
   │                                           │
   ▼                                           ▼
┌─────────────┐                          ┌─────────────┐
│ S01 HERRAM. │◄─────────────────────────│ S00.2 (continuar)
└──┬──────────┘                          └─────────────┘
   │
   ▼
┌─────────────┐
│ S02 MAPA    │◄────────────────────────────────────┐
└──┬──────────┘                                     │
   │                                                │
   ├──► S03 (E1..E4) ──► S03.10 ──► (vuelve S02) ──┤
   │                                                │
   ├──► S06 (misión, si 4/4) ──► S06.10 ──► S07 ───┤
   │                                                │
   └──► S07 (cierre, si 4/4)                        │
                                                    │
   OVERLAYS (desde S03 y S06):                      │
   ├──► S04 MANUAL (overlay) ──► vuelve al origen ──┘
   └──► S05 AYUDAS (overlay) ──► vuelve al origen
```

### 3.4. Botones de navegación (inventario)

| Botón | Ubicación | Acción |
|-------|-----------|--------|
| "Empezar" | S00 | → S01 |
| "Continuar" | S00 (si hay sesión) | → `currentScreen` |
| "Nueva sesión" | S00 | Confirmación → borra datos → S00.1 |
| "Ir al mapa" | S01, S03, S06 | → S02 (con confirmación si hay cambios sin guardar) |
| "Manual" (icono lupa) | Global (header) | Abre S04 overlay |
| "Ayudas" (icono ?) | Global (header, solo en S03/S06) | Abre S05 overlay |
| "Siguiente" | Cada pantalla de estación | Avanza a la siguiente pantalla |
| "Atrás" | Cada pantalla de estación | Retrocede (con confirmación si hay campos sin guardar) |
| "Guardar y continuar" | Formularios | Persiste + avanza |
| "Volver al mapa" | S03.10 | → S02 |
| "Cerrar sesión" | S07 | → S00 |

---

## 4. COMPONENTES REUTILIZABLES

### 4.1. `StationCard`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `stationId` | string | E1-E4 |
| `title` | string | Nombre de la estación |
| `description` | string | Breve (1 línea) |
| `state` | enum | pending/in_progress/completed |
| `progressPct` | number | 0-100 |
| `onClick` | function | Acción al pulsar |

### 4.2. `SituationPanel`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `narrative` | string | Texto de situación |
| `materials` | string[] | Lista de materiales |
| `safetyNotes` | string[] | Normas específicas |

### 4.3. `PredictionForm`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `questions` | string[] | Preguntas guía |
| `onSave` | function | Callback con predicción |
| `locked` | boolean | Si ya está guardada |
| `existingValue` | object \| null | Para modo lectura |

### 4.4. `MeasurementTable`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `rows` | Measurement[] | Filas actuales |
| `suggestedLabels` | string[] | Filas predefinidas vacías |
| `onAddRow` | function | Añadir fila |
| `onEditRow` | function | Editar fila |
| `onDeleteRow` | function | Eliminar fila |
| `editable` | boolean | Modo lectura/edición |

### 4.5. `CheckPanel`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `prediction` | object | Predicción original |
| `measurements` | Measurement[] | Medidas registradas |
| `onSave` | function | Callback con `Check` |
| `locked` | boolean | Modo lectura |

### 4.6. `HelpPanel` (overlay)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `stationId` | string | Estación |
| `currentLevel` | 1-4 | Nivel máximo desbloqueado |
| `onRequestLevel` | function | Solicitar nivel |
| `onClose` | function | Cerrar overlay |

### 4.7. `ManualSearch`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `categories` | object[] | Índice por categorías |
| `onSearch` | function | Callback con término |
| `onCardOpen` | function | Callback con cardId |
| `recentQueries` | ManualQuery[] | Últimas 5 consultas |

### 4.8. `ProgressBar`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `completed` | number | Estaciones completadas |
| `total` | number | Total (4) |
| `showLabels` | boolean | Mostrar nombres |

### 4.9. `Header`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `title` | string | Título de pantalla actual |
| `onManualOpen` | function | Abrir manual |
| `onHelpOpen` | function | Abrir ayudas (solo si aplica) |
| `onBack` | function \| null | Volver |
| `showProgress` | boolean | Mostrar barra de progreso |

### 4.10. `Modal`

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `title` | string | Título |
| `body` | string/HTML | Contenido |
| `actions` | `{ label, onClick }[]` | Botones |
| `onClose` | function | Cerrar |

### 4.11. `Toast` (feedback no intrusivo)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `message` | string | Texto |
| `type` | enum `"info"｜"success"｜"warning"` | Tipo |
| `duration` | number | ms (default 2000) |

### 4.12. `ActionSelector` (Misión final)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `actions` | `{ id, label, result }[]` | Acciones disponibles |
| `executed` | MissionAction[] | Acciones ya ejecutadas |
| `onExecute` | function | Callback con acción |

---

## 5. SISTEMA DE ESTADO

### 5.1. Estados de estación

| Estado | Descripción | Transiciones permitidas |
|--------|-------------|-------------------------|
| `pending` | No iniciada | → `in_progress` (al entrar) |
| `in_progress` | Iniciada, no completada | → `completed` (al cerrar S03.10) |
| `completed` | Completada | → `in_progress` (solo si profesor reabre) |

### 5.2. Estados de misión final

| Estado | Descripción | Condición |
|--------|-------------|-----------|
| `locked` | Bloqueada | < 4 estaciones completadas |
| `available` | Desbloqueada | 4/4 completadas o profesor fuerza |
| `in_progress` | En curso | Al entrar en S06.01 |
| `completed` | Completada | Al cerrar S06.10 |

### 5.3. Estados de consulta al manual

| Estado | Descripción |
|--------|-------------|
| `available` | Siempre disponible |
| `opened` | Se ha abierto el overlay |
| `queried` | Se ha realizado al menos una búsqueda |
| `card_viewed` | Se ha consultado al menos una tarjeta |

*(No se bloquea nunca; solo se registra para evidencias.)*

### 5.4. Estados de ayuda

| Estado | Descripción | Transición |
|--------|-------------|------------|
| `level_locked` | Nivel no accesible (falta leer el anterior) | → `level_available` al leer anterior |
| `level_available` | Nivel accesible | → `level_read` al leer |
| `level_read` | Nivel leído | → feedback de utilidad |

### 5.5. Máquina de estados global

```
[sin sesión]
   │ crear sesión
   ▼
[sesión activa]
   │
   ├── estaciones: pending → in_progress → completed
   ├── misión: locked → available → in_progress → completed
   │
   │ 4/4 + misión completada
   ▼
[sesión cerrada] ──► exportable
```

---

## 6. EXPERIENCIA RESPONSIVE

### 6.1. Prioridad y breakpoints

| Dispositivo | Prioridad | Breakpoint | Layout |
|-------------|-----------|------------|--------|
| **Portátil aula** | **P0 (crítico)** | ≥ 1024 px | 2 columnas en estación (guía + formulario), sidebar manual |
| Chromebook | P0 | ≥ 1024 px | Igual que portátil |
| Tablet | P1 | 768–1023 px | 1 columna, overlays a pantalla completa |
| Móvil | P2 | < 768 px | 1 columna, botones grandes, sin sidebar |

### 6.2. Reglas por dispositivo

**Portátil (P0):**
- Layout de dos columnas en S03: columna izquierda con guía/pregunta, columna derecha con formulario activo.
- Manual en sidebar lateral (no overlay) para consulta simultánea.
- Tablas de medidas con mínimo 4 columnas visibles.
- Fuente mínima 16px.
- Botones de acción ≥ 44×44 px.

**Chromebook (P0):**
- Igual que portátil. Verificar en 1366×768 (resolución más común en aulas).

**Tablet (P1):**
- Layout de una columna con scroll vertical.
- Manual y ayudas como overlays a pantalla completa.
- Tablas de medidas con scroll horizontal si es necesario.
- Botones ≥ 48×48 px (touch).

**Móvil (P2):**
- Una columna, apilado vertical.
- Manual como overlay a pantalla completa.
- Tablas de medidas en formato tarjeta (no tabla).
- Botones ≥ 48×48 px.
- Evitar inputs que abran teclado en campos numéricos (usar teclado numérico nativo).

### 6.3. Restricciones técnicas

- Sin dependencias de fuentes externas (usar system fonts).
- Sin imágenes pesadas (usar SVG inline o CSS).
- Sin animaciones > 300 ms.
- Peso total de la app < 500 KB (sin contar `content.json`).
- Funcionar en Chrome/Edge/Firefox actualizados (últimas 2 versiones).

---

## 7. ALMACENAMIENTO

### 7.1. Qué se almacena

**LocalStorage (`cuaderno_taller_v1`):**
- `Session` completo (ver §2.1).
- Incluye `StationProgress` (4), `MissionProgress`, `GlobalReflection`.
- Tamaño estimado: < 200 KB por sesión.

**No se almacena:**
- Contenido estático (`content.json` se carga en memoria).
- Estado de UI efímero (scroll, overlays abiertos, foco).
- Métricas de rendimiento.

### 7.2. Cuándo se guarda

| Evento | Acción |
|--------|--------|
| Cambio en campo de texto | Debounce 500 ms → guardar |
| Transición de pantalla | Guardar inmediato |
| Cierre de overlay | Guardar |
| Cierre de estación | Guardar + marcar `completed` |
| Cierre de sesión | Guardar + marcar `lastActivityAt` |
| Visibilidad de pestaña → oculta | Guardar (por si acaso) |

### 7.3. Qué se exporta

**Formato:** JSON + copia legible en Markdown.

**Estructura del JSON exportado:**

```json
{
  "exportedAt": "2026-10-29T14:30:00Z",
  "schemaVersion": "1.0",
  "session": { /* Session completo */ },
  "summary": {
    "stationsCompleted": 4,
    "missionCompleted": true,
    "timeTotalSec": 9300,
    "helpsUsed": 5,
    "manualQueries": 12
  },
  "evaluation": { /* Evaluation calculada */ }
}
```

**Estructura del Markdown exportado:**
- Portada con datos del grupo y fecha.
- Resumen de progreso.
- Por cada estación: predicción, medidas, comprobación, conclusión, aplicación.
- Misión final: hipótesis, plan, medidas, conclusión, informe.
- Ayudas usadas.
- Reflexión final.

### 7.4. Offline

- **Service Worker** opcional en v1.0: cachea `index.html` + assets.
- **Sin conexión:** la app funciona completamente.
- **Sin servidor:** no hay sincronización.

---

## 8. FLUJO DEL PROFESOR

### 8.1. Acceso

- Ruta oculta: `#/teacher` o botón oculto (triple clic en logo).
- **Sin contraseña en v1.0** (el profesor es el único que conoce la ruta).
- En v2.0: PIN simple o parámetro de URL.

### 8.2. Qué puede consultar

| Vista | Contenido |
|-------|-----------|
| **S08.1 · Grupos** | Lista de sesiones guardadas en el dispositivo (si el profesor usa el mismo portátil) |
| **S08.2 · Detalle de grupo** | Progreso, estaciones completadas, ayudas usadas, tiempos, conclusiones |
| **S08.3 · Exportación** | Exportar JSON/Markdown de un grupo o de todos |
| **S08.4 · Desbloqueo** | Forzar `MissionProgress.state = "available"` |

### 8.3. Limitaciones

- **No hay vista multi-dispositivo** en v1.0 (sin servidor).
- El profesor debe recoger las exportaciones de cada portátil.
- En v2.0: panel centralizado con servidor ligero (opcional).

### 8.4. Evaluación asistida

El panel muestra la `Evaluation` calculada para cada grupo, con:
- Nivel (`correct` / `partial` / `insufficient`).
- Criterios cumplidos.
- Evidencias clave (medidas que justifican el nivel).
- Ayudas usadas (para contextualizar).

**El profesor decide la calificación final.** El sistema solo sugiere.

---

## 9. RIESGOS DE IMPLEMENTACIÓN

### 9.1. Complejidades innecesarias (evitar)

| Riesgo | Por qué | Mitigación |
|--------|---------|------------|
| Framework pesado (React + Redux) | Sobredimensionado para SPA estática | Vanilla JS o Preact/Alpine |
| Backend / base de datos | No hay requisito multi-dispositivo en v1.0 | LocalStorage + exportación |
| Autenticación compleja | No aporta en taller | Sin login en v1.0 |
| Animaciones elaboradas | Distraen y ralentizan | Transiciones CSS simples |
| Gráficos interactivos / simuladores | El taller real es el simulador | No incluir |
| Gamificación (puntos, badges) | Desplaza el foco | Solo progreso visual |
| Multi-idioma | No requerido | Solo español |
| Tests E2E complejos | No hay tiempo | Tests manuales + smoke tests |
| PWA completa | No requerido | Service Worker opcional |

### 9.2. Funcionalidades prescindibles (pueden esperar a v2.0)

- Panel del profesor centralizado.
- Sincronización entre dispositivos.
- Autenticación.
- Historial de sesiones anteriores.
- Comparativa entre grupos.
- Analítica de uso.
- Modo oscuro.
- Accesibilidad avanzada (WCAG AA completo).
- Internacionalización.
- Tests automatizados.

### 9.3. Elementos que podrían ralentizar la app

| Elemento | Impacto | Mitigación |
|----------|---------|------------|
| `content.json` muy grande | Carga inicial lenta | Lazy loading por estación |
| Muchas tarjetas de manual | Búsqueda lenta | Índice precalculado en build |
| Guardado frecuente en LocalStorage | Bloqueo de UI | Debounce 500 ms |
| Renderizado de tablas grandes | Lag en tablets | Virtualización si > 50 filas (no esperado) |
| Fuentes externas | FOUT, dependencia de red | System fonts |
| Imágenes grandes | Carga lenta | SVG inline |

### 9.4. Riesgos técnicos específicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| LocalStorage lleno | Baja | Alto | Límite 5 MB; sesión < 200 KB; aviso si > 4 MB |
| Pérdida de datos por cierre de pestaña | Media | Alto | Autoguardado + `beforeunload` |
| Incompatibilidad de navegador | Baja | Medio | Target Chrome/Edge/Firefox últimas 2 versiones |
| Corrupción de `content.json` | Baja | Alto | Validación al cargar + fallback |
| Errores de migración de esquema | Media | Medio | `schemaVersion` + migraciones probadas |

---

## 10. MVP (VERSIÓN 1.0)

### 10.1. Debe incluir obligatoriamente

| # | Funcionalidad | Justificación |
|---|---------------|---------------|
| 1 | Pantalla de inicio con identificación de grupo | Sin esto no hay sesión |
| 2 | Herramientas básicas (onboarding + roles + seguridad) | Contexto mínimo para taller |
| 3 | Mapa de estaciones con estado | Navegación principal |
| 4 | 4 estaciones completas (S03.01–S03.10) | Núcleo de la práctica |
| 5 | Ficha común digital (predicción, medidas, comprobación, conclusión, aplicación) | Evidencias |
| 6 | Manual técnico (12+ tarjetas) con buscador | Consulta rápida |
| 7 | Sistema de ayudas escalonadas (niveles 1-4, secuencial) | Descubrimiento guiado |
| 8 | Misión final completa (S06.01–S06.10) | Cierre integrador |
| 9 | Cierre global con reflexión y exportación | Evidencias finales |
| 10 | Almacenamiento LocalStorage + autoguardado | Persistencia |
| 11 | Exportación JSON + Markdown | Entrega al profesor |
| 12 | Evaluación cualitativa calculada (correct/partial/insufficient) | Feedback |
| 13 | Responsive P0 (portátil y Chromebook) | Dispositivo principal |
| 14 | Sin dependencias externas, offline | Requisito de aula |

### 10.2. Puede esperar a v2.0

| # | Funcionalidad | Motivo |
|---|---------------|--------|
| 1 | Panel del profesor multi-dispositivo (servidor) | No crítico en v1.0 |
| 2 | Autenticación / login | No requerido |
| 3 | Responsive P2 (móvil optimizado) | Portátil es prioritario |
| 4 | Modo oscuro | Estético |
| 5 | Accesibilidad WCAG AA completa | Mejora, no bloqueante |
| 6 | Service Worker (offline cache) | Nice to have; la app ya es estática |
| 7 | Historial de sesiones anteriores | No crítico |
| 8 | Comparativa entre grupos | Analítica avanzada |
| 9 | Tests automatizados | Proceso de desarrollo |
| 10 | Internacionalización | No requerido |
| 11 | Animaciones de refuerzo | Estético |

### 10.3. Criterios de aceptación del MVP

- [ ] Un alumno puede completar las 4 estaciones sin conexión.
- [ ] Un alumno puede completar la misión final tras las 4 estaciones.
- [ ] Los datos persisten al cerrar y reabrir la pestaña.
- [ ] La exportación JSON contiene todas las evidencias.
- [ ] La exportación Markdown es legible e imprimible.
- [ ] La app funciona en Chrome y Edge actualizados en 1366×768.
- [ ] El manual responde a búsquedas en < 1 s.
- [ ] Las ayudas respetan el bloqueo secuencial 1→2→3→4.
- [ ] La evaluación cualitativa se calcula correctamente.
- [ ] El tiempo total de una sesión completa es < 3 h.

---

## 11. NOTAS PARA EL DESARROLLADOR

### 11.1. Estructura de archivos sugerida

```
/app
  ├── index.html
  ├── /css
  │   ├── base.css
  │   ├── layout.css
  │   └── components.css
  ├── /js
  │   ├── app.js           (bootstrap, router)
  │   ├── state.js         (Session, LocalStorage)
  │   ├── router.js        (navegación SPA)
  │   ├── components/      (uno por componente §4)
  │   ├── screens/         (uno por pantalla §1)
  │   └── evaluation.js    (cálculo de Evaluation)
  ├── /data
  │   └── content.json     (estaciones, manual, ayudas, misión)
  └── /assets
      └── icons/           (SVG inline)
```

### 11.2. Convenciones

- **IDs de pantalla:** `S00`, `S01`, ..., `S06.01`, etc. (consistentes con §1).
- **IDs de estación:** `E1`, `E2`, `E3`, `E4`.
- **IDs de tarjeta de manual:** `M01`...`M12`.
- **Claves de LocalStorage:** prefijo `cuaderno_taller_`.
- **Rutas SPA:** `#/inicio`, `#/mapa`, `#/estacion/E1/prediccion`, `#/mision/hipotesis`, `#/teacher`.

### 11.3. Criterios de calidad

- Sin `console.log` en producción.
- Sin dependencias externas en runtime.
- Sin llamadas de red.
- Tiempo de carga inicial < 2 s en portátil de aula.
- Tiempo de transición entre pantallas < 300 ms.
- Tamaño total < 500 KB (sin `content.json`).

---

**Fin de la especificación funcional v1.0.**
**Listo para aprobación y paso a desarrollo.**