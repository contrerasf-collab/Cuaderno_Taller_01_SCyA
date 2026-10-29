/app
│
├── index.html                    # Shell SPA (único HTML)
├── manifest.json                 # (opcional v2.0) PWA manifest
├── service-worker.js             # (opcional v2.0) cache offline
├── README.md                     # Instrucciones de ejecución
│
├── /css
│   ├── 01-tokens.css             # Custom properties: colores, spacing, tipografía
│   ├── 02-base.css               # Reset + elementos base (body, h1-h6, p, a)
│   ├── 03-layout.css             # Header, footer, main, grid, overlays
│   ├── 04-components.css         # Botones, tarjetas, tablas, forms, badges
│   └── 05-screens.css            # Ajustes por pantalla (mínimos)
│
├── /js
│   ├── main.js                   # Bootstrap: carga content, init store, init router
│   │
│   ├── /core
│   │   ├── dom.js                # h(), mount(), frag(), text(), on()
│   │   ├── store.js              # Estado global + persistencia + pub/sub
│   │   ├── router.js             # Hash router + guardas de navegación
│   │   ├── content.js            # Carga y validación de content.json
│   │   ├── schema.js             # Validación de estructura de content
│   │   ├── persistence.js        # LocalStorage: load, save, migrate, clear
│   │   ├── export.js             # Exportación JSON + Markdown
│   │   ├── evaluation.js         # Cálculo de Evaluation (misión final)
│   │   └── time.js               # Cronómetro por estación/misión
│   │
│   ├── /components
│   │   ├── header.js             # Header con título, progreso, manual, ayudas
│   │   ├── footer-actions.js     # Atrás / Siguiente / Guardar
│   │   ├── progress-bar.js       # 4 segmentos de estación
│   │   ├── step-dots.js          # 8 puntos de pasos de estación
│   │   ├── station-card.js       # Tarjeta de estación (mapa)
│   │   ├── situation-panel.js    # Situación + material + seguridad
│   │   ├── prediction-form.js    # Formulario de predicción
│   │   ├── measurement-table.js  # Tabla editable de medidas
│   │   ├── check-panel.js        # Comparación predicción vs medidas
│   │   ├── textarea-field.js     # Campo de texto con label + contador
│   │   ├── help-panel.js         # Overlay de ayudas escalonadas
│   │   ├── manual-panel.js       # Overlay de manual con buscador
│   │   ├── manual-card.js        # Tarjeta de consulta del manual
│   │   ├── action-selector.js    # Lista de acciones (misión final)
│   │   ├── modal.js              # Modal genérico (confirmaciones)
│   │   ├── toast.js              # Feedback no intrusivo
│   │   └── icon.js               # Render de SVG desde sprite
│   │
│   ├── /screens
│   │   ├── s00-inicio.js
│   │   ├── s01-herramientas.js
│   │   ├── s02-mapa.js
│   │   ├── s07-cierre.js
│   │   └── s08-teacher.js
│   │
│   ├── /station-screens         # Reutilizables por las 4 estaciones
│   │   ├── _dispatcher.js       # Enruta :screenId → función
│   │   ├── situacion.js
│   │   ├── pregunta.js
│   │   ├── prediccion.js
│   │   ├── documentacion.js
│   │   ├── experimento.js
│   │   ├── medidas.js
│   │   ├── comprobacion.js
│   │   ├── conclusion.js
│   │   ├── aplicacion.js
│   │   └── cierre-estacion.js
│   │
│   └── /mission-screens
│       ├── _dispatcher.js
│       ├── recepcion.js
│       ├── cliente.js
│       ├── observaciones.js
│       ├── hipotesis.js
│       ├── plan.js
│       ├── ejecucion.js
│       ├── comprobacion.js
│       ├── conclusion.js
│       ├── informe.js
│       └── cierre-mision.js
│
├── /data
│   └── content.json              # TODO el contenido pedagógico
│
└── /assets
    ├── /icons
    │   └── sprite.svg            # Sprite con todos los iconos
    └── (sin fuentes: system fonts)