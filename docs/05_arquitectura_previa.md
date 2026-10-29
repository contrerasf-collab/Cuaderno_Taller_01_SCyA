# ARQUITECTURA DEL CUADERNO INTERACTIVO DE TALLER

## 1. ESTRUCTURA GLOBAL

### 1.1. Pantallas principales

| Pantalla | Función | Duración media |
|----------|---------|----------------|
| **Inicio** | Identidad, narrativa, acceso a estaciones y manual, progreso | 1-2 min |
| **Mapa de estaciones** | Vista de las 4 estaciones con estado (pendiente / en curso / completada) | 10-20 s |
| **Estación — Situación y pregunta** | Contexto de taller y reto | 1-2 min |
| **Estación — Predicción** | Registro de hipótesis antes de manipular | 3-5 min |
| **Estación — Experimento** | Guía de montaje y medición (consulta rápida) | 15-20 min |
| **Estación — Registro de medidas** | Tabla de medidas y observaciones | 5-8 min |
| **Estación — Comprobación** | Comparación predicción vs resultado | 3-5 min |
| **Estación — Conclusión** | Registro de aprendizaje | 3-5 min |
| **Estación — Aplicación al vehículo** | Transferencia al contexto real | 2-3 min |
| **Cierre de estación** | Resumen y paso a siguiente estación | 1 min |
| **Manual técnico (overlay)** | Consulta rápida indexada | 30 s por consulta |
| **Ayudas escalonadas (overlay)** | Solicitud de pistas por niveles | 30-60 s por ayuda |
| **Pantalla final de cierre** | Resumen global, evidencias, reflexión | 5-10 min |

### 1.2. Flujo de navegación global

```
┌─────────────┐
│   INICIO    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ MAPA ESTACIONES │◄──────────────────────┐
└──────┬──────────┘                       │
       │                                  │
       ▼                                  │
┌─────────────────┐                       │
│ ESTACIÓN 1      │                       │
│ (flujo interno) │                       │
└──────┬──────────┘                       │
       │ completada                        │
       ▼                                  │
┌─────────────────┐                       │
│ CIERRE ESTACIÓN │───────────────────────┘
└──────┬──────────┘   (vuelve al mapa,
       │               marca completada)
       │ tras las 4 estaciones
       ▼
┌─────────────────┐
│ CIERRE GLOBAL   │
└─────────────────┘

OVERLAYS PERMANENTES (accesibles desde cualquier pantalla):
  ┌──────────────┐    ┌──────────────┐
  │   MANUAL     │    │   AYUDAS     │
  │  (consulta)  │    │ (escalonadas)│
  └──────────────┘    └──────────────┘
```

### 1.3. Orden recomendado

El orden recomendado es **1 → 2 → 3 → 4**, pero el mapa permite **acceso libre** a cualquier estación. La razón es logística: en taller real las estaciones rotan, y el cuaderno no debe imponer un orden rígido si el profesor ha organizado la rotación de otra manera.

**Excepción:** la Estación 4 (Inspectores eléctricos) requiere haber pasado por las estaciones 1-3 para que el alumno tenga las habilidades mínimas de medición. El sistema puede mostrar una **recomendación** (no un bloqueo) si se accede a la Estación 4 sin haber completado las anteriores.

### 1.4. Relación entre pantallas

- **Inicio → Mapa:** acceso directo.
- **Mapa → Estación:** selección de estación.
- **Estación → Manual/Ayudas:** overlays que no interrumpen el flujo; al cerrarse, se vuelve al mismo punto.
- **Estación → Cierre de estación → Mapa:** al completar, se vuelve al mapa con la estación marcada.
- **Cierre global:** solo accesible cuando las 4 estaciones están completadas (o cuando el profesor lo habilita manualmente).

---

## 2. PANTALLA DE INICIO

### 2.1. Identidad visual (descripción, no diseño)

- **Título:** "JORNADA TÉCNICA DE ELECTRICIDAD BÁSICA DEL AUTOMÓVIL".
- **Subtítulo:** "Cuaderno interactivo de taller".
- **Icono:** un multímetro estilizado o un relé.
- **Paleta:** colores de taller (gris oscuro, amarillo de seguridad, azul técnico). Sin degradados llamativos ni animaciones.

### 2.2. Introducción narrativa (breve, 3-4 líneas)

> "Hoy vas a trabajar como un técnico de taller. Cuatro estaciones, cuatro retos. No se trata de leer: se trata de montar, medir, equivocarte y entender. El cuaderno te acompaña, pero el trabajo lo haces tú con las manos."

### 2.3. Accesos

- **Botón principal:** "Empezar / Continuar" (según haya progreso guardado).
- **Botón secundario:** "Ver mapa de estaciones".
- **Acceso al manual:** icono de libro o lupa en la esquina superior derecha, siempre visible.
- **Acceso a ayudas:** icono de signo de interrogación, siempre visible (pero las ayudas se solicitan, no aparecen solas).

### 2.4. Progreso

- Barra de progreso visual: **0/4 estaciones completadas**.
- Indicador de estaciones: 4 iconos con estado (pendiente / en curso / completada).
- Tiempo total de sesión (opcional, para el alumno).

### 2.5. Qué ve exactamente el alumno

```
┌──────────────────────────────────────────────────────────────┐
│  [LOGO]   JORNADA TÉCNICA DE ELECTRICIDAD BÁSICA DEL AUTOMÓVIL│
│                                                              │
│           Cuaderno interactivo de taller                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ "Hoy vas a trabajar como un técnico de taller..."      │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  PROGRESO:  [■][ ][ ][ ]   0/4 estaciones                   │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  EMPEZAR    │  │    MAPA     │  │   MANUAL    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  [🔍 Manual]                                    [❓ Ayudas]  │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. EXPERIENCIA COMPLETA DENTRO DE UNA ESTACIÓN

### 3.1. Estación 1: El relé misterioso — pantalla por pantalla

#### Pantalla 1: Situación

- **Título:** "ESTACIÓN 1 — EL RELÉ MISTERIOSO".
- **Texto breve (4-5 líneas):** "Un cliente ha instalado unos focos auxiliares. El sistema ha sido desmontado. Solo tienes relé, interruptor, bombilla, cableado, portafusibles y terminales Faston. Debes reconstruir el circuito y conseguir que funcione."
- **Material disponible:** lista compacta con iconos.
- **Botón:** "Entendido, ver la pregunta".

#### Pantalla 2: Pregunta inicial

- **Pregunta destacada:** "¿Cómo debemos conectar el relé para que el interruptor active la bombilla sin que pase por él la corriente de la bombilla? ¿Qué papel juega el electroimán interno?"
- **Nota:** "No respondas todavía. Primero predice."
- **Botón:** "Hacer mi predicción".

#### Pantalla 3: Predicción

- **Campo de texto libre** para dibujar o describir la conexión (puede ser texto o un esquema simple con herramientas básicas).
- **Preguntas guía:**
  - ¿Qué tensión esperas en el borne 87 cuando la bobina está excitada? ¿Y cuando no?
  - ¿Qué continuidad esperas entre 30 y 87 con y sin excitación?
- **Botón:** "Guardar predicción y pasar al taller".
- **Aviso:** "Una vez guardada, no podrás modificarla. Podrás consultarla después."
- **Registro:** la predicción se almacena con marca de tiempo.

#### Pantalla 4: Documentación opcional (consulta rápida)

- **No es una pantalla obligatoria.** Es un acceso desde el botón "Manual" o desde un enlace "¿Necesitas ayuda con los bornes?".
- **Contenido:** tarjetas de consulta rápida:
  - "¿Qué es un relé?" (30 s de lectura).
  - "Bornes 85, 86, 30, 87, 87a" (tabla).
  - "Contactos NA y NC" (esquema ASCII).
- **Botón:** "Volver al taller".

#### Pantalla 5: Experimento (guía de montaje y medición)

- **Lista de pasos numerados, breve:**
  1. Identifica los bornes del relé.
  2. Crimpa terminales Faston en un cable de pruebas.
  3. Monta el circuito según tu predicción. Usa siempre fusible.
  4. Verifica con el multímetro: continuidad 85-86, continuidad 30-87a sin excitar, continuidad 30-87 al excitar, tensión en 87.
- **No da la solución:** los pasos indican qué hacer, no cómo conectar.
- **Botón:** "Ir a registrar medidas".

#### Pantalla 6: Registro de medidas

- **Tabla editable:**
  - Qué se mide | Valor obtenido | Observaciones
- **Filas predefinidas (vacías):** continuidad 85-86, continuidad 30-87a, continuidad 30-87, tensión en 87 sin excitar, tensión en 87 excitado, resistencia de bobina.
- **El alumno puede añadir filas.**
- **Botón:** "Guardar medidas y comprobar".

#### Pantalla 7: Comprobación

- **Comparación automática:** el sistema muestra la predicción guardada y las medidas registradas.
- **Pregunta:** "¿Coincide con tu predicción?" [Sí / No].
- **Campo de texto:** "¿Por qué? Explica las diferencias."
- **Botón:** "Guardar comprobación".

#### Pantalla 8: Conclusión

- **Pregunta:** "Explica con tus palabras qué hace el relé, qué relación tiene con el electroimán y por qué se usa en el automóvil."
- **Campo de texto libre.**
- **Botón:** "Guardar conclusión".

#### Pantalla 9: Aplicación al vehículo

- **Pregunta:** "Cita tres consumidores del vehículo que utilizan relé y explica por qué."
- **Campo de texto.**
- **Botón:** "Guardar y cerrar estación".

#### Pantalla 10: Cierre de estación

- **Resumen:** estación completada, ayudas usadas, tiempo empleado.
- **Botón:** "Volver al mapa".
- **Estado:** la estación se marca como completada.

### 3.2. Reutilización para las demás estaciones

La estructura es **idéntica** en las cuatro estaciones, cambiando únicamente el contenido:

| Pantalla | Estación 1 | Estación 2 | Estación 3 | Estación 4 |
|----------|------------|------------|------------|------------|
| Situación | Focos auxiliares | Fabricante de alumbrado | Electroventilador | Batería se descarga |
| Pregunta | Conexión del relé | Serie o paralelo | Resistencia y velocidad | Diagnóstico de carga |
| Predicción | Tensión en 87 | Brillo y fusible | Tensión en motor | Tensiones esperadas |
| Documentación | Relé, NA/NC | Serie/paralelo, fusibles | Caída de tensión | Batería, alternador |
| Experimento | Montaje y medición | Montaje y medición | Montaje y medición | Protocolo de diagnóstico |
| Medidas | Continuidad, tensión | Tensión en lámparas | Tensión en motor y R | Tensiones y caídas |
| Comprobación | Predicción vs medidas | Predicción vs medidas | Predicción vs medidas | Predicción vs medidas |
| Conclusión | Función del relé | Conexión elegida | Relación V-velocidad | Diagnóstico |
| Aplicación | Consumidores con relé | Luces del vehículo | Electroventilador real | Informe de taller |

**Ventaja:** el alumno aprende una sola estructura y la repite cuatro veces. Reduce la carga cognitiva de navegación y concentra la atención en el contenido técnico.

---

## 4. SISTEMA DE AYUDAS ESCALONADAS

### 4.1. Cuándo aparecen

- **Nunca automáticamente.** El alumno debe solicitar la ayuda.
- **Botón visible pero discreto:** "¿Necesitas una pista?" en la esquina inferior derecha de las pantallas de Experimento, Registro de medidas y Comprobación.
- **No hay ayudas en las pantallas de Predicción ni de Conclusión** (para no condicionar el pensamiento del alumno).

### 4.2. Cómo se solicitan

- El alumno pulsa "¿Necesitas una pista?".
- Se abre un panel con **4 niveles** (Nivel 1 a Nivel 4). El Nivel 0 es "sin ayuda" y no se muestra.
- **El Nivel 1 está siempre disponible.** Para desbloquear el Nivel 2, el alumno debe haber leído el Nivel 1. Para el 3, haber leído el 2. Para el 4, haber leído el 3.
- **No se puede saltar niveles.**
- Cada nivel muestra una pista breve (2-4 líneas). **Nunca da la solución completa.**
- **Botón:** "He entendido, volver al taller".

### 4.3. Cómo evitar que el alumno vaya directamente a la solución

- **Bloqueo secuencial:** no se puede acceder al Nivel 3 sin haber leído el 2, ni al 4 sin el 3.
- **Registro obligatorio:** al cerrar una ayuda, el sistema pregunta: "¿Te ha ayudado?" [Sí / No / Un poco]. Esto queda registrado.
- **Las ayudas no son la solución:** el Nivel 4 es "casi completo", pero sigue exigiendo al alumno montar, medir y concluir. El sistema no muestra el circuito montado ni la conclusión.
- **Tiempo mínimo de lectura:** cada nivel tiene un temporizador de 10 s antes de poder pasar al siguiente. Evita el "clic rápido" sin leer.
- **Aviso al profesor:** si un grupo consume el Nivel 4 en una estación, el sistema lo marca en el registro para que el profesor lo sepa (no para penalizar, sino para hacer seguimiento).

### 4.4. Cómo registrar el uso de ayudas

Cada solicitud de ayuda genera un registro con:

- Estación.
- Pantalla en la que se solicitó.
- Nivel solicitado (1-4).
- Marca de tiempo.
- Respuesta a "¿Te ha ayudado?".

El registro es visible para el alumno en la pantalla final de cierre y para el profesor en el panel de seguimiento.

### 4.5. Diagrama de flujo de ayudas

```
Alumno pulsa "¿Necesitas una pista?"
       │
       ▼
┌──────────────────┐
│ Panel de ayudas  │
│ Nivel 1 disponible│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Lee Nivel 1      │
│ (10 s mínimo)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ ¿Te ha ayudado?  │
│ [Sí][No][Un poco]│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ ¿Necesitas más?  │
│ [Sí, Nivel 2]    │
│ [No, volver]     │
└────────┬─────────┘
         │
         ▼
   (repite secuencia
    hasta Nivel 4)
```

---

## 5. INTEGRACIÓN DEL MANUAL TÉCNICO COMO CONSULTA RÁPIDA

### 5.1. Filosofía

El manual **no es un libro digital**. Es un **buscador de respuestas rápidas**. El alumno no lee capítulos: busca una duda concreta y obtiene una respuesta en menos de 30 segundos.

### 5.2. Formato

- **Tarjetas de consulta** (cards) de 30-60 segundos de lectura.
- Cada tarjeta responde a **una sola pregunta**.
- **Buscador** con palabras clave.
- **Índice por categorías** (multímetro, tensión, resistencia, continuidad, fusibles, relés, serie/paralelo, caída de tensión, batería, alternador, diagnóstico).
- **Acceso desde cualquier pantalla** mediante el icono de lupa/libro.

### 5.3. Ejemplos de consultas rápidas

| El alumno busca... | El sistema muestra... |
|--------------------|----------------------|
| "continuidad" | Tarjeta "¿Cómo comprobar continuidad?" con esquema ASCII y 3 pasos. |
| "borne 87" | Tarjeta "Bornes del relé" con tabla 85-86-30-87-87a. |
| "batería cargada" | Tarjeta "Tensión de batería" con tabla de valores. |
| "caída de tensión" | Tarjeta "¿Qué es la caída de tensión?" con esquema y valores orientativos. |
| "fusible" | Tarjeta "Fusibles: tipos y comprobación" con tabla de colores. |
| "serie paralelo" | Tarjeta "Serie vs paralelo" con dos esquemas ASCII y efectos. |
| "alternador" | Tarjeta "Comprobar carga del alternador" con valores 13,5-14,5 V. |

### 5.4. Estructura de cada tarjeta

```
┌─────────────────────────────────────────┐
│  TÍTULO DE LA CONSULTA                  │
│  (pregunta concreta)                    │
├─────────────────────────────────────────┤
│  RESPUESTA BREVE (2-4 líneas)           │
│                                         │
│  ESQUEMA ASCII (si aplica)              │
│                                         │
│  VALORES ORIENTATIVOS (si aplica)       │
│                                         │
│  ERROR HABITUAL (1 línea)               │
├─────────────────────────────────────────┤
│  [Volver al taller]                     │
└─────────────────────────────────────────┘
```

### 5.5. Búsqueda

- **Buscador predictivo:** al escribir 2 letras, aparecen sugerencias.
- **Sin resultados:** "No encontramos esa consulta. Prueba con: continuidad, relé, fusible, batería..."
- **Historial:** las últimas 5 consultas quedan accesibles (para el alumno y para el registro).

### 5.6. Diagrama de flujo del manual

```
Alumno pulsa icono Manual
       │
       ▼
┌──────────────────┐
│ Buscador + índice│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Escribe palabra  │
│ o elige categoría│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Tarjeta de       │
│ consulta rápida  │
│ (< 30 s lectura) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ [Volver al taller]│
└──────────────────┘
```

---

## 6. SISTEMA DE RECOGIDA DE EVIDENCIAS

### 6.1. Qué se registra

| Dato | Cuándo | Formato |
|------|--------|---------|
| Identificación del grupo | Inicio | Texto (nombres, estación) |
| Predicción | Pantalla de Predicción | Texto libre + marca de tiempo |
| Medidas | Pantalla de Registro | Tabla (qué se mide, valor, observaciones) |
| Comprobación (Sí/No) | Pantalla de Comprobación | Booleano |
| Explicación de diferencias | Pantalla de Comprobación | Texto libre |
| Conclusión | Pantalla de Conclusión | Texto libre |
| Aplicación al vehículo | Pantalla de Aplicación | Texto libre |
| Ayudas solicitadas | Cualquier pantalla | Estación, nivel, marca de tiempo, utilidad percibida |
| Consultas al manual | Cualquier pantalla | Término buscado, tarjeta consultada, marca de tiempo |
| Tiempo por estación | Automático | Inicio y fin de estación |
| Estación completada | Al cerrar estación | Booleano + marca de tiempo |

### 6.2. Almacenamiento

- **Local (navegador):** para que el alumno no pierda el progreso si se cierra la pestaña.
- **Exportable:** botón "Descargar mis evidencias" en la pantalla final (formato texto o JSON simple).
- **No requiere servidor** en la versión inicial. Si más adelante se quiere centralizar, se puede añadir.

### 6.3. Visualización para el alumno

- En la pantalla final de cierre, el alumno ve un **resumen de sus evidencias**: predicciones, medidas, conclusiones, ayudas usadas.
- Puede **comparar** su predicción con su conclusión.
- Puede **descargar** el resumen para entregarlo al profesor.

### 6.4. Visualización para el profesor

- Panel de seguimiento (opcional, fuera del cuaderno del alumno) con:
  - Grupos que han completado cada estación.
  - Ayudas usadas por grupo y estación.
  - Tiempos.
  - Conclusiones registradas.

---

## 7. PANTALLA FINAL DE CIERRE

### 7.1. Contenido

```
┌──────────────────────────────────────────────────────────────┐
│  CIERRE DE LA JORNADA                                        │
│                                                              │
│  ESTACIONES COMPLETADAS: 4/4                                 │
│  [■][■][■][■]                                                │
│                                                              │
│  TIEMPO TOTAL: 2 h 35 min                                    │
│                                                              │
│  AYUDAS UTILIZADAS:                                          │
│  - Estación 1: Nivel 2 (1 vez)                               │
│  - Estación 3: Nivel 1 (2 veces), Nivel 3 (1 vez)            │
│  - Estación 4: Nivel 2 (1 vez)                               │
│                                                              │
│  PRINCIPALES CONCLUSIONES:                                   │
│  [Resumen automático de las conclusiones registradas]        │
│                                                              │
│  APLICACIÓN AL VEHÍCULO:                                     │
│  [Resumen de las aplicaciones registradas]                   │
│                                                              │
│  REFLEXIÓN FINAL:                                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ¿Qué es lo que mejor has entendido hoy?                │  │
│  │ ______________________________________________________ │  │
│  │ ______________________________________________________ │  │
│  │ ¿Qué te ha costado más?                                │  │
│  │ ______________________________________________________ │  │
│  │ ______________________________________________________ │  │
│  │ ¿Qué harías distinto la próxima vez?                   │  │
│  │ ______________________________________________________ │  │
│  │ ______________________________________________________ │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [DESCARGAR EVIDENCIAS]        [VOLVER AL INICIO]            │
└──────────────────────────────────────────────────────────────┘
```

### 7.2. Elementos

- **Resumen de estaciones completadas** con iconos de estado.
- **Ayudas utilizadas:** lista por estación y nivel, con número de veces.
- **Principales conclusiones:** extracto de las conclusiones registradas en cada estación.
- **Aplicación al vehículo:** extracto de las aplicaciones registradas.
- **Reflexión final:** tres preguntas breves (qué has entendido mejor, qué te ha costado más, qué harías distinto).
- **Botón de descarga de evidencias.**
- **Botón de volver al inicio** (para reiniciar o consultar).

---

## 8. ANÁLISIS DE POSIBLES ERRORES DE DISEÑO

### 8.1. Elementos que pueden distraer

| Elemento | Por qué distrae | Alternativa |
|----------|-----------------|-------------|
| Animaciones largas | El alumno mira la pantalla en lugar de manipular | Animaciones de < 1 s, solo para feedback |
| Notificaciones emergentes | Interrumpen el trabajo en taller | Feedback silencioso (cambio de color, icono) |
| Música o sonidos | Ruido en taller, distracción | Sin sonido, salvo pitido de continuidad del multímetro (que es físico) |
| Menús profundos | El alumno se pierde navegando | Navegación plana: máximo 2 niveles |
| Textos largos | El alumno lee en lugar de manipular | Tarjetas de 30-60 s, bullets, esquemas |
| Colores muy saturados | Cansancio visual | Paleta sobria, alto contraste solo en alertas |
| Gamificación excesiva (puntos, badges) | Desplaza el foco al juego | Progreso visual discreto (4 iconos) |
| Foros o comentarios | No aportan en taller | Sin interacción social |

### 8.2. Elementos que romperían la filosofía de taller

| Elemento | Por qué rompe la filosofía |
|----------|----------------------------|
| Teoría extensa | Convierte el cuaderno en libro digital |
| Videos de 10 minutos | El alumno mira, no manipula |
| Simuladores que sustituyen el montaje | El alumno aprende en pantalla, no en taller |
| Soluciones automáticas | Elimina el descubrimiento |
| Ayudas que aparecen solas | El alumno no pide, no reflexiona |
| Exámenes tipo test | No es un cuaderno de taller, es un examen |
| Contenido bloqueado por tiempo | Artificial, frustrante |
| Registro obligatorio de demasiados datos | Ralentiza el taller |

### 8.3. Qué NO debe incluirse

- ❌ **Manual completo en HTML.** Solo tarjetas de consulta rápida.
- ❌ **Foros, chats o comentarios.** No aportan en taller.
- ❌ **Gamificación con puntos, niveles o rankings.** El progreso es la propia estación completada.
- ❌ **Animaciones 3D o simuladores complejos.** El taller real es el simulador.
- ❌ **Exámenes o cuestionarios.** La evaluación es la ficha y la observación.
- ❌ **Contenido teórico extenso.** Solo lo necesario para resolver la duda concreta.
- ❌ **Notificaciones push o correos.** El cuaderno es local.
- ❌ **Login complejo.** Identificación mínima (nombre del grupo).
- ❌ **Dependencia de conexión a internet.** Debe funcionar offline.
- ❌ **Videos largos.** Como máximo, GIF de 3 s para un gesto técnico (ej. crimpado).
- ❌ **Menús de más de 2 niveles.** Navegación plana.
- ❌ **Textos que el alumno deba leer antes de actuar.** La acción primero, la consulta después.

### 8.4. Riesgos específicos del diseño

| Riesgo | Descripción | Mitigación |
|--------|-------------|------------|
| **Sustitución del taller por la pantalla** | El alumno pasa más tiempo en el cuaderno que manipulando | Pantallas breves, botones grandes, transiciones rápidas |
| **Dependencia de ayudas** | El alumno pide ayuda sin pensar | Bloqueo secuencial + registro + tiempo mínimo de lectura |
| **Pérdida de evidencias** | El alumno cierra la pestaña y pierde todo | Guardado automático local + exportación |
| **Distracción con el dispositivo** | El alumno usa el móvil/tablet para otras cosas | El cuaderno no incluye enlaces externos ni redes |
| **Frustración por navegación** | El alumno no encuentra lo que busca | Manual con buscador predictivo + índice visual |
| **Evaluación no prevista** | El profesor no sabe qué ha hecho cada grupo | Panel de seguimiento + exportación de evidencias |
| **Sobrecarga visual** | Demasiada información en pantalla | Una idea por pantalla, máximo 3 botones |

---

## SÍNTESIS DE LA ARQUITECTURA

```
INICIO
  │
  ├──► MAPA DE ESTACIONES ◄──────────────────┐
  │       │                                  │
  │       ├──► ESTACIÓN 1 ──► CIERRE E1 ─────┤
  │       ├──► ESTACIÓN 2 ──► CIERRE E2 ─────┤
  │       ├──► ESTACIÓN 3 ──► CIERRE E3 ─────┤
  │       └──► ESTACIÓN 4 ──► CIERRE E4 ─────┤
  │                                          │
  │       (tras las 4)                       │
  │       ▼                                  │
  │   CIERRE GLOBAL ◄────────────────────────┘
  │
  ├──► MANUAL (overlay, siempre accesible)
  └──► AYUDAS (overlay, siempre accesible, escalonadas)
```

**Principio rector:** el cuaderno es un **asistente de taller**, no un libro. Cada pantalla debe poder resolverse en menos de 2 minutos, y el alumno debe volver al taller cuanto antes. La pantalla más importante no es la del cuaderno: es la del taller.