# project-continuity.md — olivacraft.com 2.0

## ESTADO ACTUAL — 2026-08-19, QA de código (último paso antes de que Anelisse tome el proyecto) — leer esto primero

Francisco pidió una QA general a nivel de código como **último paso antes del handoff a Anelisse (Directora de Diseño) para deploy**: eliminar valores sueltos, dar precisión al `:root`, y más. Alcance: `css/styles.css`, `index.html`, `404.html`.

**Hallazgo crítico no relacionado con la limpieza de tokens, encontrado en el camino:** el `<link>` de Google Fonts en `index.html` y `404.html` solo pedía Fraunces en estilo normal (`family=Fraunces:opsz,wght@...`, sin eje `ital`). Cualquier `font-style: italic` sobre Fraunces (el wordmark `.wm-oliva` y `.framework-oliva-title`) no tenía ninguna cara itálica cargada y el navegador caía a Georgia — visible en el wordmark del nav y en la tarjeta "Oliva" de El Framework. **Corregido** agregando el eje `ital` a la URL en ambos archivos. Verificado con `document.fonts` que italic 400 y 700 ahora cargan.

**Limpieza de valores sueltos (`css/styles.css`):**
- **Nuevos tokens en `:root`:** `--shadow-mockup` (la sombra `0 30px 70px -24px rgba(0,0,0,.55)` estaba repetida idéntica en los 4 embeds de capacidades), `--chrome-bg` y `--chrome-address-text` (toolbar/address bar de los mockups tipo browser, repetidos igual en GATO/Koyam/Auditoría/Estrategia), `--c-whatsapp` (el verde `#25D366`, antes suelto en `.wa-float`).
- **Bug real encontrado de paso:** los toolbars de Auditoría y Estrategia (`.cc-toolbar`/`.rm-toolbar`) tenían el borde hardcodeado a `#e6e2da` (el valor de GATO, copiado sin adaptar) en vez de usar su propio token `--cc-border`/`--rm-border` (`#e4e7ec`) — un mismatch real de 1 dígito hex, invisible a simple vista pero inconsistente. Corregido para que cada uno use su propio token.
- **Todo `#fff`/`#ffffff` suelto** (dentro y fuera de los tokens scopeados de cada mockup) reemplazado por `var(--c-white)` — ya existía el token, solo no se usaba consistentemente.
- **12 estilos inline en `index.html`** (los 3 puntos de semáforo × 4 mockups: `style="background:#ff5f57"` etc.) reemplazados por clases CSS nuevas (`.gato-dot--red/--yellow/--green`) — ya no hay color hardcodeado en el HTML.
- **Valores fuera de la grilla de 4px corregidos:** `.servicio-tag` padding `3px` → `var(--sp-1)`; `.step-dot` margin-top `8px` → `var(--sp-2)`.
- **Token existente no usado, corregido:** `.framework-node` tenía `border-radius: 8px` hardcodeado en vez de `var(--radius-sm)` (que vale exactamente 8px) — pieza propia de esta misma sesión, se coló sin token.
- **Precisión de root:** `.rm-cal-head div` tenía `font-size: .656rem` (10.496px, valor no redondo, probablemente un artefacto de cálculo) — corregido a `.625rem` (10px), igual que su vecino `.rm-cal-row-label span`.

**Qué se dejó tal como está (y por qué):**
- Los tokens propios scopeados de cada mockup (`--g-*`, `--k-*`, `--cc-*`, `--rm-*`) — patrón ya establecido y documentado, no es "valor suelto", es la arquitectura intencional para no cruzar con los tokens del sitio real.
- Los `font-size` en rem crudo dentro de los mockups (ej. `.6rem`, `.72rem`) — excepción tipográfica ya declarada explícitamente en el código (comentario en `css/styles.css` cerca de `.gato-address`): los mockups simulan una captura de pantalla real de otro producto, no son UI de navegación del sitio, el piso de 14px no aplica ahí.
- `--text-xs` (0.72rem/12px) y `--text-2xs` (0.68rem/11px) del sitio real están técnicamente bajo el piso de 14px que exige el CLAUDE.md del workspace — pero es un uso extendido y consistente en todo el sitio (tags, eyebrows, labels) desde el diseño original, no un error nuevo. **No se tocó** — cambiar esto es una decisión de diseño con impacto visual grande (afecta prácticamente cada tag/label del sitio), no una limpieza de código segura. Si Anelisse o Francisco quieren resolver esta tensión, es una conversación aparte, no parte de este QA.
- `gap: 5px` en `.nav-toggle` (barras del ícono hamburguesa) — geometría de ícono, no espaciado de contenido, no se tokeniza contra la escala de `--sp-*`.

**Verificado:** los 4 toolbars de mockup ahora computan exactamente el mismo `background-color` (`rgb(242,240,234)`), confirmando que la consolidación no cambió nada visualmente, solo eliminó la duplicación. Sitio revisado completo en `localhost:8001` sin regresiones visibles.

**Sin commits.** Ver más abajo el detalle de la etapa 1 de QA de diseño (padding/separaciones) y el cierre del refresh.

---


Tras cerrar el "refresh" (ver sección debajo), Francisco abrió una nueva etapa: **QA de diseño**, empezando por padding de secciones/componentes y consistencia de separadores entre secciones. Metodología: **auditar con mediciones reales del navegador (`getComputedStyle`/`getBoundingClientRect`) antes de tocar código** — no confiar en lo que dice el CSS estático solamente, verificar el DOM renderizado.

**Hallazgos confirmados y corregidos (todos con medición antes/después):**
1. `#servicios` (Capacidades) tenía `padding:0` mientras el resto de las secciones usa `var(--section-py)` (128px arriba/abajo) — rompía el ritmo vertical entre secciones. Corregido: `#servicios { padding: var(--section-py) 0; }`, se le quitó el padding-top redundante a `.servicios-header` y se puso `padding-bottom:0` al último `.narrative-block` para no duplicar espacio.
2. Los 4 mockups de capacidades (GATO/Koyam/Auditoría/Estrategia) tenían anchos distintos (656/720/600/600px) dentro de la misma columna de 816px — unificados los 4 a 720px.
3. `.faq-list` tenía `max-width:1040px` centrado en un contenedor de ~1583px — dejaba 400px vacíos a la derecha. Se le quitó el `max-width`, ahora ocupa el ancho completo como el resto de las secciones (empty-right bajó a 143px, igual al padding del contenedor).
4. `#estructura::before` era la única sección con una línea de acento cyan además del borde gris estándar — sin justificación funcional encontrada. Eliminada a pedido explícito de Francisco ("quítala, que todas usen solo el borde gris").
5. **El hallazgo más sutil:** `.narrative-visual { justify-content: center }` centraba cada mockup dentro de su columna de 816px sin importar si la fila estaba invertida (`--reverse`, como Koyam/Estrategia). En filas no invertidas esto no se nota (imagen a la derecha, sin referencia de alineación), pero en filas invertidas (imagen a la izquierda, como Koyam) dejaba ~48px de margen izquierdo que no coincide con el borde real donde arranca el texto de las filas no invertidas — y ese mismo margen "robado" achicaba el espacio visible entre texto e imagen. Corregido: el mockup ahora se pega al borde exterior de su columna (`justify-content: flex-end` en filas normales, `flex-start` en invertidas) en vez de centrarse. Verificado: los 4 bloques quedan con el mismo offset de 32px desde el borde real del contenedor y el mismo gap de 176px entre texto e imagen — antes variaba.

**Patrón de trabajo para el resto de esta etapa de QA:** medir con JS antes de proponer un fix (evita gastar turnos discutiendo percepciones subjetivas cuando hay un número exacto disponible). Francisco identifica el problema visualmente, se verifica con medición real, se corrige, se re-mide para confirmar.

**Sin commits.** Detalle del cierre del refresh anterior más abajo.

---

## ESTADO ANTERIOR — 2026-08-19, cierre del "refresh" vía QA externo (Gemini)

Francisco declaró finalizado el refresh del sitio en esta fecha. Próximo bloque de trabajo: **QA de diseño** (sin alcance definido aún — retomar preguntando qué cubre antes de empezar).

**Proceso usado toda la sesión (repetible para futuras rondas de feedback externo):** Francisco compartía capturas de cada sección a Gemini (misma conversación larga) → yo cruzaba cada hallazgo contra el código real antes de aceptarlo (ver [[feedback_segunda_opinion_ia_externa]]) → para cambios de layout/estética con más de una salida razonable, construía 2-3 bocetos comparables en `scratchpad/`, los enviaba con `SendUserFile` sin cerrar ninguna pestaña, y Francisco elegía.

**Bug sistémico encontrado y corregido en 6+ lugares distintos esta sesión:** superficies (`--c-surface`/`--c-od-bg`) casi idénticas al fondo de su sección padre, y texto en `--c-ink-muted`/`--c-ink-faint` fallando WCAG AA. Afectó: tags de capacidades, tarjetas de equipo (Estructura), líneas del acordeón FAQ, inputs/checkboxes de Contacto. Regla para el futuro: **todo nuevo componente con fondo propio debe verificarse contra el fondo real de su sección padre, no asumir que el token de superficie ya da suficiente contraste.**

**Secciones tocadas esta sesión (todas con boceto previo salvo la primera ronda de Capacidades, que fueron fixes puntuales):**
- Capacidades (GATO/Koyam/Auditoría/Estrategia): contraste de tags, CTA de GATO inactivo, tarjeta de Koyam reposicionada a la derecha, Auditoría despersonalizada de Creacort — ver sesión "continuación 7" abajo.
- El Framework: diagrama sincronizado al scroll, sticky se suelta después de Fase 03, tarjeta rediseñada de negra a vidrio esmerilado — ver "continuación 8".
- Estructura: tarjetas de equipo con contraste real, CTA movido al cierre — ver "continuación 9".
- FAQ: ancho corregido (1040px, no 760px — se veía angosto contra el contenedor de 1360px), ícono "+" cyan por defecto, todo alineado a la izquierda — ver "continuación 10" (buscar más abajo).
- Contacto: sidebar como tarjeta con 3 datos (correo, tiempo de respuesta, modalidad), checkboxes con contraste real, botón "Enviar" ya no ocupa el 100% del ancho — ver "continuación 10".
- **Nota Cloudflare:** el error rojo de Turnstile que aparece en `localhost:8001` es esperado — el sitekey solo valida en el dominio real de producción. No es un bug, no se toca.

**Sin commits en toda la sesión** — todo en working tree, pendiente de que Francisco lo pida explícitamente.

---


**Proyecto:** olivacraft.com — rediseño completo
**Tipo:** Landing page comercial consultora tecnológica boutique
**Ruta real:** `Interno/www.olivacraft.com/` (esta nota de "Productos/olivacraft.com 2.0/" de abajo quedó desactualizada — repo real confirmado con `git remote`, es el que despliega a producción)
**Stack:** Vanilla HTML + CSS (tokens OLIVA OS) + JS mínimo — sin build

---

## Estado Actual — 2026-08-18 (implementación en código real de todo lo acordado en revisión de diseño/copy)

**Contexto:** sesión previa (larga, sin código) revisó y aprobó sección por sección un relato menos técnico + nuevo accent color + mockups reales de producto (GATO, Koyam) en un artifact de trabajo. Esta sesión aplicó todo eso al repo real.

### Completado

- **Color base:** `--c-cyan` `#3EC6D4` → `#BCF7FD` en `styles.css` (token único, propaga a todo lo que usa `var()`) + 67 valores hardcodeados en hex/rgba dentro de los `<svg>` de `index.html` reemplazados con `sed`. También `--c-blue-dark` (hover) recalculado a un tono coherente con el nuevo accent.
- **Copy — todas las secciones ya actualizadas:** Hero, las 4 Capacidades (UI/UX, Desarrollo Web, Auditoría, Estrategia Digital), El Framework (3 fases + intro + diferenciador + tarjeta OLIVA), Estructura (equipo 2→4 personas: Francisco, Anelisse, **Ariel Sáez** — Director Comercial, **Madelen Sanzana** — Directora de Marketing), FAQ (+1 pregunta nueva "¿Sirve si hoy llevo todo en Excel o WhatsApp?" primera en la lista, 2 corregidas de portabilidad→continuidad), Contacto (3 checkboxes renombrados + "Auditoría UX"/"Auditoría Web" unificados a "Auditoría").
- **Wordmark corregido:** "Oliva" en Fraunces itálica, "craft" en bold, el punto pasó de carácter "·" a círculo CSS real.
- **Hero visual:** SVG abstracto viejo ("DESIGN→OLIVA BUILD→DEPLOY") reemplazado por el diagrama de convergencia real (chips Excel/WhatsApp/Papel → panel 2×2 con íconos torta/barras/lista/tendencia), HTML/CSS + SVG de íconos, con animación sutil de líneas al cargar (respeta `prefers-reduced-motion`).
- **UI/UX Design:** SVG viejo reemplazado por el mockup real y completo del browser de GATO (`Productos/gato/index_v4.html` como fuente) — 3 tamaños con íconos de árbol reales del código fuente, accesorios, panel "Tu Configuración". Layout con la nueva clase `.narrative-block--wide` (texto en columna fija ~400px, mockup ancho — ya no 50/50).
- **Desarrollo Web:** SVG viejo reemplazado por el mockup real de Koyam — dos ventanas superpuestas (Dashboard con KPIs + Finanzas con gráfico de barras Ingresos/Egresos). Mismo patrón `--wide` combinado con `--reverse` (mockup queda a la izquierda).
- **Auditoría y Estrategia Digital:** los SVG (funnel y flowchart) ya no usan `font-family="monospace"` ni mayúsculas tipo terminal — ahora Plus Jakarta Sans real, texto en formato oración, tamaños más grandes, con separación real entre título/contenido/pie de página. Bug de "alcance sin control" (texto cortado) confirmado resuelto.
- **`--max-w` global:** 1100px → 1360px — afecta a todo el sitio, no solo las secciones con mockup, le da más aire a todo.

### Pendiente — siguiente sesión (en este orden, según lo indicado por Francisco)

1. ~~**El Framework**~~ — CERRADO 2026-08-19, ver sesión de abajo.
2. **Estructura** — el copy ya está en 4 personas, pero no tiene ilustración visual — confirmar con Francisco si necesita alguna pieza nueva o se queda solo con las 4 `persona-card`.
3. **FAQ** — copy ya cerrado. Francisco mencionó una idea de pieza visual (papel/Excel → paneles, similar al hero) para esta sección, sin definir aún — retomar esa conversación antes de dar por cerrada la sección.

---

## Sesión 2026-08-19

- **Estrategia Digital** (SVG "Roadmap · Decisiones", `index.html:461-490`): paleta mixta blanco/cyan/verde unificada a un solo tono cyan (`#BCF7FD`) con jerarquía por opacidad — nodo inicial, flechas, "alcance sin control" y el check final ya no usan verde/blanco suelto. Detectado a partir de una comparación visual de Francisco contra un wireframe de referencia (sin Figma detrás, solo referencia visual a ojo). Verificado en local.
- **El Framework — `.framework-oliva-card` — CERRADO:** los 3 bloques del SVG ("Entender" → "Diseño" → "Entrega", `index.html:583-607`) pasaron de `font-family="monospace"` a `'Plus Jakarta Sans', sans-serif`, mismo criterio ya aplicado a Auditoría/Estrategia Digital. Tamaños ajustados levemente. Verificado en local — screenshot confirma consistencia con el resto del sitio.
  - **Corrección post-fix (ronda 1):** el bloque central decía "OLIVA" en el código (así estaba antes de esta sesión, no fue algo que se introdujera acá) pero el diseño validado por Francisco usa "**Diseño**" — corregido el texto para que coincida exactamente con la referencia visual aprobada.
  - **Corrección post-fix (ronda 2):** el título grande `.framework-oliva-title` seguía sin coincidir con el validado — decía "OLIVA" en mayúsculas y cyan (`--c-cyan`); el validado usa "**Oliva**" en formato título, itálica, **blanco** (`--c-ink`), igual que el wordmark del nav (`.wm-oliva`). También `.framework-oliva-sub` ("AUDITORÍA · INTERFAZ · SEGURIDAD") estaba en `--text-xs` (12px) y `--c-ink-muted` (gris apagado) — el validado lo muestra más grande y en blanco. Ambos corregidos en `css/styles.css:613-632` (`.framework-oliva-title` → color `--c-ink` + `font-style: italic`; `.framework-oliva-sub` → tamaño `--text-sm` + color `--c-ink`) y el texto en `index.html` de "OLIVA" a "Oliva". Verificado en local con recarga forzada (caché de navegador hizo falta limpiar dos veces durante esta sesión).
  - **Corrección post-fix (ronda 3):** aun con `font-family: var(--font-display)` (Fraunces) ya correcto y confirmado cargado (verificado con `getComputedStyle` + `document.fonts`), el peso no coincidía — `.framework-oliva-title` tenía `font-weight: var(--fw-bold)` (700) mientras el wordmark del resto del sitio (`.wm-oliva`, nav) usa `var(--fw-regular)` (400) con el mismo italic. Igualado a `--fw-regular` en `css/styles.css:619-626`.
  - **Lección (aplica a las 3 rondas):** al retocar tipografía de una pieza ya validada, comparar el resultado completo contra la referencia visual real antes de dar el cambio por cerrado — no alcanza con verificar que el criterio puntual pedido (sans-serif, tamaños) se aplicó bien, ni con confirmar que la familia tipográfica es la correcta; hay que revisar cada atributo (texto, color, peso, estilo, tamaño) contra la imagen aprobada y contra el mismo elemento usado en otras partes del sitio (ej. el wordmark del nav para "Oliva").

## Sesión 2026-08-19 (continuación) — QA de tamaño en mockups GATO/Koyam

Francisco hizo QA visual y detectó que `.gato-embed`/`.koyam-embed` quedaban desproporcionados frente a los diagramas SVG abstractos de Auditoría/Estrategia, generando desbalance de padding entre secciones. También compartió una captura de una "propuesta de Gemini" para el UI de GATO — al revisar el código se confirmó que esa captura **no es una propuesta nueva**, es básicamente el panel real de `Productos/gato/index_v4.html` (mismo copy, mismo layout) — el gap real estaba en que el embed de olivacraft.com se había simplificado de más al portarlo.

**Decisión de Francisco:** reducir tamaño + visual más rico pero **estático** — sin interactividad, sin dependencia de código compartido con GATO a futuro ("contenedor exportable": se copian valores calculados una sola vez, después viven separados).

**Aplicado:**
- `.gato-embed` `max-width`: 820px → **656px** (80%)
- `.koyam-embed` `max-width`: 900px → **720px** (80%)
- `.gato-preview__stage` (`css/styles.css:1234`): height 150px→240px, padding 14px→20px, grid de fondo alineado al real (16px, opacidad .02) + `box-shadow: inset` sutil
- SVG del árbol (`index.html`, dentro de `.gato-preview__stage`): reemplazado el ícono plano de 4 rectángulos por un **render estático calculado con la misma fórmula que `drawTree()` de GATO real** (viewBox 220×320, estado "Árbol Mediano" — 2 plataformas, 80cm, sin extras) — no es una ilustración inventada, son los mismos valores que el JS real produciría para ese estado, solo que hardcodeados una vez.
- Verificado en local: proporción del mockup ahora balanceada contra el resto de las secciones, árbol con base + poste con rayado sisal + 2 plataformas + sombra, sobre el grid.

**Fuente de los cálculos:** `Productos/gato/index_v4.html:1791-1866` (`drawTree()`) y `:1714-1718` (tabla `sizes`). Si GATO cambia sus proporciones/precios reales, este snapshot **no se actualiza solo** — es una decisión consciente (Francisco no quiere esa dependencia).

## Sesión 2026-08-19 (continuación 2) — Francisco cambió de decisión: demo funcional, no estático

Francisco pidió que el "Diseño Personalizado" (GATO) tenga las mismas funciones que GATO real: cambiar tamaño, agregar accesorios, todo en vivo. Se implementó **puerto completo de la lógica** (no un iframe ni link al proyecto real) — mismo criterio de "contenedor exportable" ya acordado: se copió la lógica una sola vez, vive 100% en el sitio, sin dependencia con `Productos/gato/` de ahí en más.

**Implementado:**
- `index.html`: `data-size`/`data-extra` en las cards de tamaño/accesorios, IDs en preview (nombre, tags, SVG del árbol, precios del breakdown, fila de accesorios), `.gato-cta` convertido de `<div>` a `<a target="_blank">`.
- `css/styles.css`: estado activo para `.gato-extra-card` (checkbox con check visual), `cursor:pointer` en las cards.
- `js/main.js` (bloque nuevo al final, guardado con `if (document.querySelector('.gato-embed'))`): estado (`gatoState`), catálogo (`GATO_SIZES`/`GATO_EXTRAS`, mismos valores que el real), `gatoDrawTree()` (puerto exacto de `drawTree()` de GATO — misma fórmula, incluye rampa diagonal y casa/techo cuando corresponde), `gatoRender()` (actualiza nombre, tags, precios, clases activas, SVG, y el link de WhatsApp), listeners de click en cards.

**Verificado en local (vía consola, clicks reales):**
- Cambio de tamaño (Pequeño/Mediano/Grande) actualiza precio, tags y altura del árbol.
- Los 3 accesorios simultáneos (Casa + Rampa + Base grande) calculan bien ($149.000+$85.000=$234.000) y el árbol renderiza correctamente los 3 elementos a la vez (techo, rampa diagonal, base ancha).
- Caso "Grande + Rampa": $199.000+$25.000=$224.000, se ven las 3 plataformas con la rampa conectando las dos primeras — igual que el cálculo real de GATO.
- Link de WhatsApp se arma con el mensaje completo (tamaño, accesorios, total).

**Punto resuelto:** Francisco decidió dejar el botón "Encargar por WhatsApp" **decorativo** — no navega a ningún número. `js/main.js`: se eliminó `gatoWhatsappUrl()` y la asignación de `href` real; en su lugar, un listener en `#gato-order-btn` hace `e.preventDefault()`. El resto de la interactividad (tamaño, accesorios, precio, render del árbol) sigue 100% funcional. Verificado: el botón mantiene `href="#"` y el click no navega.

---

## Cierre de sesión — 2026-08-19

**Completado hoy (resumen):**
1. Estrategia Digital — paleta unificada a monocromo cyan.
2. El Framework (`.framework-oliva-card`) — tipografía Fraunces regular italic blanco (ya no monospace/bold/cyan), texto corregido a "Diseño" y subheader más grande en blanco — 3 rondas de corrección hasta calzar exacto con el diseño validado.
3. GATO/Koyam — tamaño reducido 80%, visual del árbol porteado con fórmula real de GATO.
4. GATO — **convertido a demo 100% funcional** (tamaño, accesorios, precio, render en vivo), self-contained, sin dependencia futura con `Productos/gato/`.
5. Botón WhatsApp del demo — decorativo a propósito (GATO está en stand by, no es canal de venta real).

**Pendiente — siguiente sesión:**
1. **Estructura** — confirmar con Francisco si necesita pieza visual nueva o se queda solo con las 4 `persona-card` (pendiente desde antes, no tocado hoy).
2. **FAQ** — pieza visual papel/Excel→paneles, sin definir (pendiente desde antes).
3. QA visual general de la sección GATO ya interactiva: revisar en mobile (breakpoint `.gato-grid` a 640px) que el click en las cards funcione bien táctil, no solo con mouse.

**Archivos tocados esta sesión:** `index.html`, `css/styles.css`, `js/main.js` (todos en `Interno/www.olivacraft.com/`). Sin commit — pendiente de que Francisco lo pida explícitamente.

**Siguiente paso exacto:** retomar con QA mobile de GATO interactivo, luego Estructura.

## Sesión 2026-08-19 (continuación 3) — QA sección por sección, empezando por el navbar

Francisco pidió una revisión "pulcra", sección por sección desde el navbar hasta el footer, con regla explícita: **prohibido parchar con `!important` o hacks salvo estrictamente necesario** (evita doble trabajo en un QA de código posterior). Solo hay 2 usos preexistentes de `!important` en todo el CSS (reduced-motion y un color de barra en Koyam) — no se agregó ninguno nuevo.

**Navbar — 2 problemas reales encontrados y corregidos:**
1. **Hover casi invisible:** `.nav-links a:hover` solo tenía `background: rgba(255,255,255,.06)` sobre header casi negro. Subido a `.10` — ahora perceptible. Se agregó también `:focus-visible` (outline cyan), que no existía.
2. **Sin indicador de "sección actual":** nunca existió tracking de scroll. Se agregó clase `.nav-links a.active` (texto cyan + línea inferior, mismo lenguaje visual que `.narrative-label`) + `IntersectionObserver` en `js/main.js` (bloque nuevo "Nav — sección activa al hacer scroll").
   - **Primer intento con bug:** `rootMargin: '-40% 0px -55% 0px'` dejaba una franja de detección de solo 5% de la pantalla — el scroll continuo la saltaba y el link activo se quedaba pegado en la sección anterior. Corregido a `rootMargin: '-64px 0px -60% 0px'` (64px = altura real de `--nav-h`), banda robusta de ~32% de la pantalla justo bajo el nav. Verificado con scroll real: Capacidades → El Framework → Estructura actualizan correctamente.

**Estado:** navbar cerrado y verificado.

**Hero — cerrado y verificado.** Copy intacto (Francisco pidió explícitamente no tocarlo). Único ajuste: contraste de la ilustración de convergencia (`.hero-chip svg`, `.hero-panel-cell:nth-child(1)/(3) svg`) — de `--c-ink-muted` (38%) a `--c-ink-soft` (60%), css/styles.css:1073-1123. Se evaluó agregar interactividad (hover/click con info) y **se descartó a propósito**: es una ilustración conceptual, el copy ya explica el valor, y más abajo GATO sí es interactivo de verdad — una interacción falsa en el hero le restaría señal a esa diferencia. Verificado visualmente.

**Capacidades — UI/UX Design (GATO) — cerrado.** Francisco marcó 3 problemas reales del patrón `.narrative-block--wide`: texto "flotando" (sin anclaje visual, causado por `align-items:center` en dos columnas de altura muy distinta), mockup "ventana sin contexto" (sin marco equivalente al del texto), y desbalance de tamaño/densidad. Fix aplicado (combinación de 2 alternativas, aprobado explícitamente por Francisco):

1. **Layout base (afecta a TODA la variante `--wide`, incluye Desarrollo Web/Koyam cuando se revise):** `align-items: start` en `.narrative-block.narrative-block--wide` (antes centraba verticalmente) + nueva regla `.narrative-block--wide .narrative-text` con fondo `--c-frost`, borde izquierdo cyan 2px, padding `--sp-6` — le da al texto el mismo peso de "objeto anclado" que ya tenía el mockup. `css/styles.css:1448-1465` aprox.
2. **Compactación específica del mockup GATO** (4 tácticas, todas en `css/styles.css` sección `.gato-*`):
   - Excepción tipográfica **declarada explícitamente en comentario** (14px→12px, `--text-sm`→`--text-xs`) en `.gato-size-card__name`, `.gato-size-card__price`, `.gato-preview__name`, `.gato-row` — solo dentro del mockup, no afecta el resto del sitio.
   - `.gato-subtitle` max-width 360px→440px → pasa de 3 a 2 líneas sin tocar el copy.
   - `.gato-cta` padding 13px→10px, margin-top 16px→12px, texto a `--text-xs`.
   - `index.html`: ícono de refrescar quitado de la barra de direcciones del mockup (quedó solo el candado).

**Pendiente explícito:** el toolbar de Koyam tiene el mismo patrón de 2 íconos (candado + refrescar) — NO se tocó todavía, a propósito, fuera del alcance aprobado hoy. Aplicar el mismo criterio cuando se revise la sección Desarrollo Web.

**Consistencia entre mockups (2026-08-19, mismo cierre de UI/UX Design):** Francisco notó 2 inconsistencias entre los toolbars de GATO y Koyam — corregidas:
- GATO no tenía URL en la barra de direcciones (Koyam sí) → agregada `www.olivacraft.com/demo-gato` (`index.html`, `.gato-address`). CSS: se eliminó `.gato-address__bar` (span vacío sin usar) y se agregó `font-size:.68rem` a `.gato-address` para que el texto se vea bien.
- Koyam tenía ícono de refrescar en el toolbar que GATO ya no tiene (se había quitado antes en esta misma sesión) → quitado también de Koyam para que ambos queden con el mismo criterio (candado + URL, sin refrescar).

**Desarrollo Web (Koyam) — cerrado.** Francisco confirmó que el fix heredado (layout base) ya lo dejó "pulcro", sin compactación adicional necesaria. Único ajuste: mismo tratamiento del punto de URL/ícono aplicado a GATO (ver arriba).

**Auditoría — CERRADO. Migrado de diagrama SVG abstracto a mockup real (2026-08-19).**

Francisco detectó desproporción real ("espacio muy grande al medio, contenido muy separado"). Medí las alturas reales en el DOM antes de diagnosticar: el bloque de Auditoría en sí NO estaba desbalanceado (texto 333px vs. SVG 317px, casi calzados) — el vacío real venía de que el bloque anterior (Koyam) mide 795px por el `padding-bottom:120px` de `.koyam-embed` (bug real, **diferido a propósito al QA final**, no corregido hoy).

Aparte de ese hallazgo, Francisco decidió ir más allá: dado que 2 de 4 capacidades ya son mockups reales (GATO, Koyam) y Auditoría/Estrategia seguían en SVG abstracto, pidió migrar Auditoría a mockup real también, usando **Creacort** (`Clientes/Creacort/creacort-web/`) como referencia visual — prospecto real pero en stand-by, Francisco autorizó explícitamente usar su marca.

**Implementado:**
- `index.html`: bloque de Auditoría pasó de `.narrative-block` a `.narrative-block--wide` (hereda el fix de alineación arriba + tarjeta de texto). El SVG del embudo se reemplazó por `.cc-embed` — mismo patrón de chrome de navegador que GATO/Koyam (3 puntos + candado + URL), con contenido recreando el hero real de Creacort (`SAN BERNARDO, SANTIAGO`, "Fabricamos herramientas de corte con precisión industrial.") en sus colores reales (`#0D2040` navy, `#D45800` naranja — tokens reales tomados de `css/tokens.css` de Creacort).
- **Dominio ficticio a pedido explícito de Francisco:** `www.auditoria-demo.test` (TLD `.test`, reservado oficialmente para uso ficticio/testing, nunca resuelve) — NO se usó el dominio real `creacort.cl` en el link visible, aunque sí se usa su marca/copy/colores.
- Copy y porcentajes del embudo **sin cambios** (Visitantes 100% / Interacción 68% + "Navegación confusa" / Consideración 41% + "CTA oculto" / Conversión 18%) — solo cambió el contenedor visual, sigue siendo ilustrativo, no una auditoría real de Creacort.
- `css/styles.css`: nuevo bloque `.cc-embed` con tokens propios scopeados (`--cc-*`), agregado a los resets ya documentados (`.gato-embed svg, .koyam-embed svg, .cc-embed svg` — mismo bug de íconos anidados que ya se vigila).

**2 bugs de overflow encontrados y corregidos en la primera pasada (antes de mostrarlo a Francisco):**
1. URL del address bar se cortaba en 2 líneas — faltaba `white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0` en `.cc-address`.
2. El flag "Navegación confusa" se cortaba contra el borde del card (`overflow:hidden` de `.cc-embed`) — la fila de 87% de ancho no dejaba espacio suficiente a la derecha. Corregido con `.cc-funnel { max-width: 65% }`, reservando gutter fijo para los flags sin importar el ancho individual de cada fila.

**Pendiente diferido a propósito para el QA final de toda la página:**
1. `padding-bottom: 120px` de `.koyam-embed` — investigar y quitar si es innecesario.
2. Evaluar si Estrategia Digital también migra a mockup real (Francisco no lo pidió explícitamente todavía, solo Auditoría).

**Estrategia Digital — CERRADO. Migrado a mockup real tipo roadmap/timeline (2026-08-19).**

Mismo fix de layout heredado (`.narrative-block--wide`), pero contenido totalmente distinto a Auditoría — Francisco pidió algo tipo calendario: qué se hizo, cuándo, y qué impacto tuvo, con "crear un sitio web simple" como ejemplo (no ligado a ningún cliente real, a diferencia de Auditoría/Creacort).

**Implementado:**
- `index.html`: SVG del diagrama de decisión reemplazado por `.rm-embed` — mismo chrome de navegador (candado + `www.roadmap-demo.test`, dominio ficticio `.test`). Adentro: timeline vertical de 4 pasos (Semana 1 Diagnóstico → Semana 2 Diseño → Semana 3–4 Desarrollo → Semana 5 Lanzamiento), cada uno con marcador (check o círculo vacío para el paso actual), título, descripción corta, y una "píldora" de impacto (ej. "Define el alcance real, evita construir de más").
- `css/styles.css`: nuevo bloque `.rm-embed` con tokens propios (`--rm-*`), acento índigo `#4F46E5` (distinto del verde de GATO y el azul de Koyam, mismo criterio de "cada mockup con su propio acento"). Línea conectora del timeline vía `::before` en cada `.rm-step`. Agregado a los resets de `svg` ya documentados (mismo bug de íconos anidados).
- Copy de texto (H3, párrafo, tags) y caption final **sin cambios** — caption ya alineado a la izquierda y en `--text-base` desde el ajuste anterior (mismo criterio aplicado consistentemente).

**Sin bugs de overflow esta vez** — aprendizaje de Auditoría (URL con `white-space:nowrap`+ellipsis, gutter reservado) se aplicó desde el primer intento, verificado limpio de una pasada.

**El Framework — se evaluó un rediseño y se descartó (2026-08-19).** Francisco mostró una referencia externa (infografía circular tipo Canva/SmartArt, "Beneficios de un negocio digital") preguntando si convenía algo similar para esta sección. Se le dio feedback honesto: la referencia es un patrón genérico de infografía corporativa, no calzaría con la estética del sitio; tampoco tenía sentido replicar el patrón de browser-mockup acá porque El Framework es el método propio de Oliva, no un "sitio" que se visita. Se rescató la idea de fondo (ciclo iterativo entre fases, no lineal) y se construyó un boceto aparte (`scratchpad/boceto-framework-ciclo.html`, nunca tocó el sitio real) — 3 nodos (Ingesta Lógica/Component Design/Refactorización QA) en triángulo con flechas punteadas de retroalimentación, "Oliva" al centro. **Francisco lo descartó tras verlo.** El Framework se queda como está (cerrado en la ronda anterior de esta misma sesión — tipografía Fraunces regular en "Diseño", ver más arriba).

## Sesión 2026-08-19 (continuación 4) — Estrategia Digital iteró de nuevo: de timeline vertical a calendario tipo Gantt

Tras cerrar Estrategia Digital con el timeline vertical (`.rm-timeline`), Francisco mostró una referencia real de Linear (vista de calendario) y pidió una versión acotada de eso en su lugar. Proceso seguido — **boceto aparte antes de tocar el sitio real**, dos rondas:

1. Primer boceto (`scratchpad/boceto-roadmap-calendario.html`) — grilla tipo Gantt con fechas reales de encabezado (3 NOV–1 DIC), una fila por fase, barra de color por fase. Enviado a Francisco vía `SendUserFile` (aprendizaje: cerrar la pestaña de un boceto sin avisar hace que Francisco no pueda verlo — siempre mandar el archivo, no solo mostrar screenshot).
2. **Corrección de Francisco (5 puntos):** nada en dorado (el 🔒 emoji del address bar se veía dorado — reemplazado por el mismo ícono SVG de candado que usa el resto del sitio); los chips de impacto necesitaban el título resaltado (bold) vs. la descripción atenuada, no todo al mismo peso; quitar `.rm-caption` por completo; usar tonos neutros con el accent como base, no colores arbitrarios por fase (4 colores random → 3 barras neutras + 1 sola en accent para "Live", el hito destacado); mismo criterio de un solo accent ya aplicado a la eyebrow.
3. Segundo boceto corregido, aprobado ("Validado, pásalo al diseño") → implementado en el sitio real.

**Implementado en el sitio real:**
- `index.html`: `.rm-timeline`/`.rm-step*` reemplazado por `.rm-cal` (grilla: columna de fase + 5 columnas de fecha) + `.rm-impacts` (4 chips con `<b>` en el título). `.rm-caption` eliminado del HTML.
- `css/styles.css`: bloque `.rm-timeline`/`.rm-step*`/`.rm-caption` reemplazado por `.rm-cal*`/`.rm-bar`/`.rm-impacts` — nuevo token `--rm-neutral: #d5d8de` para las barras no destacadas, `--rm-accent` (#4F46E5) reservado solo para la barra "Live".

**Lección de proceso para sesiones futuras:** cuando Francisco pide "boceto para ver, luego decido si pasa a código", el flujo correcto es: construir en `scratchpad/` (nunca tocar el sitio real todavía) → previsualizar en pestaña nueva → **enviar el archivo con `SendUserFile`** (no solo describir/screenshotear) → cerrar la pestaña de preview y el server temporal solo después de que Francisco confirme que ya lo vio → aplicar correcciones sobre el mismo boceto aparte hasta validación → recién ahí pasar al sitio real.

## Sesión 2026-08-19 (continuación 5) — `.framework-oliva-card` con spec exacta (px + tokens)

Francisco dio spec exacta con una imagen de referencia: título "Oliva" Fraunces **bold** italic 48px (revierte la decisión "regular" de la ronda anterior en esta misma sesión — la spec explícita de hoy manda), bajada Plus Jakarta regular 12px, texto de las cajas (Entender/Diseño/Entrega) 14px. Instrucción explícita: los px son referenciales para el tamaño visual, pero la implementación **debe pasar por tokens del `:root`**, no valores sueltos.

**Implementado:**
- `css/styles.css` — nuevo token `--text-2xl: 3rem` (48px, no existía nada entre `--text-xl` 19px y `--text-h2` clamp 24-36px) agregado a la escala tipográfica del `:root`.
- `.framework-oliva-title`: `font-size: var(--text-2xl)`, `font-weight: var(--fw-bold)` (antes `--fw-regular`).
- `.framework-oliva-sub`: `font-family: var(--font)` (Plus Jakarta, antes heredaba sin declarar), `font-size: var(--text-xs)` (0.72rem ≈ 12px, el propio comentario del token ya lo documenta como "~12px"), `font-weight: var(--fw-regular)`.
- `index.html`: los 3 textos del SVG (Entender/Diseño/Entrega) de 12.5/15/12.5px → **14px** uniforme (coincide exacto con `--text-sm`, aunque quedó como atributo SVG plano `font-size="14"` — las presentational attributes de SVG no soportan `var()`, es el mismo criterio ya usado en el resto de SVGs del sitio).

Verificado visualmente — calza con la referencia.

## Sesión 2026-08-19 (continuación 6) — Estructura: grid 2×2 + recorte de copy

Francisco mostró referencia (imagen) vs. estado actual: `.estudio-aside` apilaba las 4 tarjetas de equipo en una sola columna angosta a la derecha (`flex-direction: column`), con círculos de iniciales innecesarios, dejando mucho espacio muerto.

**Implementado:**
- `css/styles.css`: `.estudio-aside` de `flex-direction:column` → `display:grid; grid-template-columns: 1fr 1fr` (grid 2×2). `.estudio-layout` — columna del aside ampliada de `300px` fijo → `420px` (con 300px las tarjetas quedaban demasiado angostas, nombres cortándose a 2-3 líneas). Regla `.persona-initial` (círculo con iniciales) eliminada por completo — ya no se usa.
- `index.html`: los 4 `.persona-card` perdieron su `<div class="persona-initial">` — ahora solo nombre + rol.
- **Copy recortado** (aprobado explícitamente tras verificar visualmente el desbalance): H2 "El equipo detrás del framework" → "Detrás del framework"; segundo párrafo ("Sin subcontrataciones, sin desvíos de proyecto...") eliminado, queda solo el primero.
- **Corrección de dato real:** rol de Anelisse Sáez — "Directora de Ingeniería" → "**Directora de Diseño**" (confirmado por Francisco, no era un cambio de criterio de diseño sino un dato incorrecto).

Verificado visualmente — calza con la referencia.

**FAQ — visual aprobado, contenido pendiente de segunda revisión.** Francisco confirmó que visualmente la sección "responde" bien tal como está — no necesitó la pieza visual papel/Excel→paneles que había mencionado antes, se descartó implícitamente. Queda pendiente **revisar el contenido/copy de las preguntas** en una sesión futura ("quizás una segunda mirada sería precisa para el content") — sin definir qué específicamente, retomar preguntando qué le preocupa del contenido antes de tocar nada.

---

## Sesión 2026-08-19 (continuación 7) — QA externo (Gemini) sobre las 4 capacidades ya cerradas

Francisco pidió feedback a Gemini sobre capturas de las 4 secciones de Capacidades (ya cerradas en la sesión anterior). Cada hallazgo se cruzó contra el código real antes de actuar (no se tomó ninguno como válido solo por venir de la captura) — 2 de las 4 críticas de Gemini de más peso resultaron ser reales y sistémicas; una (barra "Desarrollo" del Gantt representando 1 semana en vez de 2) resultó ser un error de lectura de Gemini, el código ya estaba correcto.

**Aplicado:**
1. **`.servicio-tag` (css/styles.css:1770-1779)** — contraste roto: `color: var(--c-ink-muted)` (rgba blanco 38%, ~3.4:1) sobre fondo oscuro en texto de 11.5px, falla AA. Corregido a `var(--c-ink-soft)` (60%, mismo token ya usado en el resto del sitio para texto secundario). Afecta a los tags de las 4 capacidades + El Framework + Estrategia Digital (clase compartida).
2. **CTA de GATO "Encargar por WhatsApp" (`.gato-cta`, css/styles.css:1270-1287 + index.html:275)** — compartía el mismo `#25D366` con el botón flotante real de WhatsApp, dos CTAs idénticos compitiendo en pantalla. Como el botón ya era decorativo (GATO en stand by, no navega a ningún número — ver sesión anterior), se pasó a **estado inactivo real**: fondo/texto con tokens neutros de GATO (`--g-border`/`--g-muted`), `cursor:not-allowed`, `pointer-events:none`, `aria-disabled="true"` + `tabindex="-1"` en el HTML (saca el link del tab order ya que no hace nada). El listener de JS que hacía `preventDefault()` en el click se eliminó de `js/main.js` — quedó redundante, el CSS ya bloquea toda interacción (mouse y teclado).
3. **`.koyam-float` (css/styles.css:1383-1397)** — la tarjeta flotante de Finanzas tapaba casi todo el sidebar real (`left:-6%; width:62%`).
   - **Primer intento (rechazado por Francisco):** reducir a `left:4%; width:50%` — seguía tapando parte del sidebar y además la tarjeta quedó desalineada, sin padding interno real (paneles pegados al borde).
   - **Fix correcto (aprobado):** en vez de reducir tamaño, se **espejó la posición** — de `left:-6%` a `right:-6%` (mismo offset del diseño original, mismo `width:62%`, ahora "cargada a la derecha"). El sidebar queda 100% libre; la tarjeta pasa a apoyarse sobre el bloque de KPIs de la derecha, específicamente sobre **Saldo Neto** (duplicado exacto de "Balance del período activo" más abajo) y roza Colaboradores/Dotación mensual en el borde — "Obras activas", el único KPI sin duplicado, queda completamente libre. Padding interno subido de `10px 10px 16px` a `16px 16px 18px` para que los 2 paneles internos no toquen el borde. Verificado con `getBoundingClientRect()`: sidebar 0-172px, float ahora 316.8-763.2px (sin intersección).
   - **Lección:** cuando una tarjeta superpuesta tapa contenido real, la solución no es necesariamente achicarla — es reposicionarla para que tape específicamente el contenido de menor valor (duplicado/redundante), no el de mayor valor (navegación, dato único).
4. **`.cc-embed` (Auditoría) — despersonalizado de Creacort a mockup ilustrativo, mismo criterio que Estrategia Digital.** Decisión más grande de la sesión: Francisco notó que de los 4 mockups de capacidades, 2 son trabajo real (GATO = producto propio, Koyam = cliente real) y 2 son ilustrativos (Auditoría, Estrategia Digital) — y que los 2 ilustrativos no tenían por qué tener paletas distintas entre sí, a diferencia de los 2 reales que sí ganan su identidad propia. Se resolvió reutilizando literalmente los tokens de `.rm-embed` (Estrategia Digital) en `.cc-embed`: de fondo oscuro navy/naranja de Creacort (`--cc-dark:#0D2040`, `--cc-orange:#D45800`) a fondo blanco + acento índigo `#4F46E5` (`--cc-bg`, `--cc-surface`, `--cc-border`, `--cc-text`, `--cc-muted`, `--cc-accent`, css/styles.css:1406-1481). Copy cambiado de la marca real de Creacort ("San Bernardo, Santiago" / "Fabricamos herramientas de corte con precisión industrial") a "Ejemplo · Auditoría UX" / "Detectar dónde se pierden las conversiones" (index.html:440-441) — mismo patrón de eyebrow "Ejemplo · X" que ya usaba Estrategia Digital. El embudo (funnel), sus porcentajes y los flags de advertencia ("Navegación confusa"/"CTA oculto", en ámbar semántico) quedaron sin cambios.

**Descartado explícitamente (no implementar):** mover los 4 chips de impacto de Estrategia Digital (`.rm-impacts`) a tooltips on-hover sobre las barras del Gantt (sugerencia de Gemini). Motivo: hover no existe en touch — escondería esa info en mobile sin un fallback de tap adicional — y va en contra del pivote deliberado del sitio hacia un relato menos técnico. Se deja el contenido siempre visible tal como está.

**Regla nueva para futuros mockups de "Lo que construimos":** antes de darle una paleta propia a un mockup nuevo, primero decidir si representa **trabajo real** (marca propia, como GATO/Koyam) o es **ilustrativo** (como Auditoría/Estrategia). Solo lo real se gana una identidad de color distinta — lo ilustrativo comparte la paleta neutra + acento índigo ya establecida en `.rm-embed`/`.cc-embed`.

**Verificado en local** (`localhost:8001`, servidor ya corriendo) — los 4 cambios se vieron correctos en pantalla: tags legibles, CTA de GATO gris/inerte, sidebar de Koyam 100% libre con la tarjeta cargada a la derecha sobre KPIs redundantes, Auditoría con el mismo lenguaje visual claro que Estrategia Digital.

**Sin commits** — todo en working tree, pendiente de que Francisco lo pida explícitamente.

## Sesión 2026-08-19 (continuación 8) — El Framework: sync + reposición sticky + rediseño de tarjeta a vidrio esmerilado

Francisco pidió pasar a El Framework, section que consideraba "lo más bajo estéticamente" del sitio. Mismo proceso de QA externo cruzado contra código (Gemini revisó capturas de las 4 capacidades otra vez y agregó El Framework a la conversación) — 2 hallazgos de Gemini confirmados reales al inspeccionar en vivo:

1. **Diagrama desincronizado:** el SVG "Entender → Diseño → Entrega" tenía "Diseño" permanentemente resaltado sin importar qué Fase (01/02/03) se estuviera leyendo a la izquierda.
2. **Espacio muerto grande:** al llegar a Fase 03, la tarjeta sticky quedaba pegada arriba con ~280px de negro vacío debajo mientras "Diferenciador" seguía bajando en la columna izquierda — confirmado visualmente con scroll real, no solo por lo que decía Gemini.

**Implementado (primera ronda, aprobada explícitamente antes de tocar código):**
- **Sync scroll↔diagrama:** nuevo bloque en `js/main.js` ("El Framework — nodo del diagrama sincronizado"), mismo patrón de `IntersectionObserver` que ya usa el scrollspy del navbar. Cada `.framework-step` lleva `data-node="entender|diseno|entrega"`.
- **Sticky se suelta después de Fase 03:** `.framework-closing` ("Diferenciador") se sacó del grid de 2 columnas (`.framework-layout`) y pasó a ser un bloque full-width fuera de él — al no tener nodo propio en el diagrama, ya no tiene sentido que la tarjeta lo seguiera acompañando. Verificado con scroll real: la tarjeta se despega justo al terminar Fase 03.
- **Más padding entre fases** (pedido explícito, "se ve todo muy junto"): `.framework-step` padding-bottom de `--sp-8` (32px) a `--sp-12` (48px).

**Segunda ronda — rediseño visual completo de la tarjeta "Oliva":** Francisco, tras ver el resultado, lo encontró "visualmente horrible" a pesar de ser diseño que él mismo había pedido — y mencionó que había seguido conversando con Gemini por su cuenta pidiéndole una propuesta de rediseño ("visualmente es horrible, qué propuesta harías?"). **Aprendizaje de proceso:** había cerrado la pestaña de Gemini sin preguntar tras la primera ronda de esta misma sesión — Francisco siguió usando esa conversación por su cuenta y tuve que reabrirla para ver el mensaje nuevo. Ver [[feedback_pestana_nueva_revision_browser]], extender la regla: no cerrar una conversación de referencia activa sin confirmar que ya no se va a seguir usando.

Gemini propuso un rediseño completo ("Claridad Estratégica"): fondo off-white, acento azul `#1B4DFF` + coral, tipografía Inter — **paleta y tipografía fuera de marca, no se adoptó tal cual**. Se tomó la idea de fondo (la tarjeta negra se siente ajena al resto del sitio) pero resuelta dentro del sistema de diseño real: mismo criterio de "real vs. ilustrativo" ya aplicado a Auditoría/Estrategia — la tarjeta Oliva es parte del mismo lenguaje visual que los mockups de capacidades, no una isla aparte.

**Proceso de boceto (2 rondas, en `scratchpad/`, nunca tocó el sitio real hasta validación):**
1. Primer boceto: tarjeta clara (blanco puro) + números gigantes reemplazados por un punto cyan simple sobre la línea conectora. Feedback de Francisco: "el fondo tan blanco es un golpe visual fuerte" + no le gustó el anillo tipo focus/hover en el nodo activo (`box-shadow` alrededor, parecía un input).
2. Segundo boceto, 3 variantes lado a lado para decidir rápido: **A)** papel cálido + línea de acento cyan arriba, **B)** vidrio esmerilado (sin bloque claro, se queda 100% en el tema oscuro), **C)** papel cálido más compacta. Francisco eligió **B**.

**Implementado en el sitio real (variante B):**
- `index.html`: el `<svg>` del diagrama se reemplazó por HTML plano — `.framework-diagram` con 3 `.framework-node` (div) + `.framework-arrow` (span "→"). Los `<span class="step-num">01</span>` de las 3 fases pasaron a `<span class="step-dot">` (sin texto, solo el punto vía CSS).
- `css/styles.css`:
  - `.framework-oliva-card`: de `background: var(--c-surface)` + borde cyan sólido a `background: rgba(255,255,255,.05)` + `border: 1px solid rgba(255,255,255,.10)` + `backdrop-filter: blur(6px)`. Se eliminó el `::before` (línea de acento superior — no aplica a esta variante).
  - `.framework-oliva-sub`: color de `--c-ink` a `--c-ink-soft` (match exacto del boceto aprobado).
  - Reemplazadas las reglas SVG (`.framework-node rect/text`) por reglas HTML (`.framework-node`, `.framework-node--active`, `.framework-arrow`, `.framework-diagram`) — mismo mecanismo de toggle de clase, ahora sobre `<div>` en vez de `<g>` SVG. Sin anillo/box-shadow en el estado activo — ahora es relleno tintado (`rgba(188,247,253,.10)`) + borde cyan sólido, plano.
  - `.framework-step`: `grid-template-columns` de `36px 1fr` a `20px 1fr` (columna angosta para el punto). `.step-num` reemplazado por `.step-dot` (9px, círculo cyan sólido).
- `js/main.js`: el observer ya no busca `.framework-oliva-card svg` — ahora selecciona `.framework-oliva-card .framework-node` directo (son `<div>`, no hace falta el paso extra por el SVG).

**Verificado en local con scroll real:** tarjeta de vidrio visible sin bloque blanco, "Diseño" se resalta exactamente cuando Fase 02 está en pantalla, sticky se suelta después de Fase 03, "Diferenciador" queda como tarjeta completa aparte.

**Sin commits** — todo en working tree, pendiente de que Francisco lo pida explícitamente.

## Sesión 2026-08-19 (continuación 9) — Estructura: bugs de contraste + reorganización, mismo ejercicio de 3 propuestas

Gemini (misma conversación) revisó "Detrás del framework" sin que se le pidiera — Francisco: "me parece acertado, haz el mismo ejercicio". 2 bugs reales confirmados contra código (no solo contra lo que decía Gemini):
1. `.persona-card` con `background: var(--c-surface)` (#141417) sobre `#estructura { background: var(--c-frost) }` (#0E0E11) — casi el mismo tono, tarjetas prácticamente invisibles sin depender de brillo de pantalla.
2. `.persona-role` con `color: var(--c-ink-muted)` (38%) — mismo bug de contraste recurrente ya corregido en `.servicio-tag` esta misma sesión.

**No se incluyó en las propuestas:** la sugerencia de Gemini de agregar fotografías reales — requiere fotos de las 4 personas (no disponibles) y contradice la decisión ya tomada esta sesión de sacar los círculos de iniciales (`.persona-initial` eliminada por completo).

**3 propuestas (boceto en `scratchpad/boceto-estructura-variantes.html`):** A) tarjeta elevada + iniciales con acento cyan (un "rostro" sin foto real), B) lista editorial con borde de acento, sin avatar, C) grid completo de 4 + CTA movido al cierre de la sección. Francisco eligió **C**.

**Implementado:**
- `index.html`: la sección se reestructuró — de `.estudio-layout` (grid 2 columnas: texto+CTA a la izquierda, equipo 2×2 a la derecha) a 3 bloques apilados: `.estudio-intro` (h2+párrafo, ancho completo), `.estudio-team` (grid de 4 en una fila, ya no confinado a una columna de 420px), `.estudio-cta` (banda de cierre con texto de apoyo + el botón, separada por `border-top`).
- `css/styles.css`: `.persona-card` — de `background:var(--c-surface); border:1px solid var(--c-border)` a sin `background` (transparente, se apoya en el fondo de la sección) + `border:1px solid var(--c-border-mid)`, hover con `border-color: rgba(188,247,253,.45)` + `background: rgba(188,247,253,.03)`. `.persona-role` a `--c-ink-soft`. Reglas viejas (`.estudio-layout`, `.estudio-main`, `.estudio-aside`, `.estudio-body`, `.persona-info`) eliminadas — ya no las usa ningún elemento.
- `.estudio-team`: `grid-template-columns: 1fr 1fr` en mobile, `repeat(4, 1fr)` desde 700px (antes el equipo vivía en una columna fija de 420px, ahora usa todo el ancho de la sección).

**Verificado en local:** tarjetas con borde visible, roles legibles, layout de una fila de 4 en desktop, CTA como cierre separado.

**Sin commits** — todo en working tree, pendiente de que Francisco lo pida explícitamente.

## Sesión 2026-08-19 (continuación 10) — FAQ + Contacto: cierre del refresh completo

Mismo ejercicio de 3 propuestas, esta vez con bocetos livianos (solo 2-3 campos/preguntas de muestra en vez del contenido completo, a pedido explícito de Francisco para ahorrar tokens).

**FAQ — elegida variante C (todo alineado a la izquierda, ancho completo, mismo ritmo que Capacidades/Framework/Estructura):**
- Bugs confirmados: `.faq-item` border al 7% (`--c-border`) casi invisible, `.section-sub` y `.faq-a-inner p` en `--c-ink-muted` (38%, mismo bug recurrente de siempre).
- `css/styles.css`: `.faq-list` de `max-width:720px; margin:auto` (centrado) a `max-width:1040px; margin:0` (izquierda). `.faq-item` border a `--c-border-mid`. `.section-sub`/`.faq-a-inner p` a `--c-ink-soft`. `.faq-icon::before/::after` de `--c-ink-muted` (gris, solo cyan en hover) a `--c-cyan` por defecto (acento permanente, no solo al interactuar) — regla redundante de hover eliminada.
- **Corrección post-aprobación:** el primer intento (`max-width:760px`) se veía angosto comparado con el boceto — el boceto vivía dentro de un contenedor "mock" más chico, así que 760px lucía "ancho" ahí pero no contra el `container` real de 1360px del sitio. Subido a 1040px. **Lección:** al portar un boceto al sitio real, verificar proporciones contra el ancho real del contenedor, no solo copiar el valor px del boceto.

**Contacto — elegida variante C (sidebar como tarjeta con borde propio, 3 datos en vez de 1 dato huérfano):**
- Bugs confirmados: `.checkbox-label` border al 7%: `#contacto` background casi idéntico al de los inputs (mismo patrón de siempre). Botón "Enviar mensaje" se estiraba a 100% del ancho por heredar `align-items:stretch` del `.contact-form` flex.
- **Nota importante de Francisco, no tocar:** el error rojo de Cloudflare Turnstile visible en `localhost:8001` es esperado — el sitekey solo valida contra el dominio real de producción. No es un bug del sitio.
- `index.html`: `.contact-info` (aside) pasó de 1 solo item (Correo) a 3 (Correo, Tiempo de respuesta, Modalidad — "Llamada por Google Meet").
- `css/styles.css`: `.contact-info` ahora es una tarjeta real (`border:1px solid var(--c-border-mid); border-radius:var(--radius); padding:var(--sp-6)`), antes era texto flotando sin contenedor. Nueva regla `.contact-info-item a, .contact-info-item > span:last-child` para que el valor de cada dato (no solo los `<a>`) tenga contraste correcto. `.checkbox-label` border a `--c-border-mid`. `.contact-form .btn-lg { align-self: flex-start; }` para que el botón deje de ocupar el 100% del ancho.
- **No incluido a propósito:** el rediseño de checkboxes a "chips sin cuadrado visible" que sugería Gemini — el checkbox real (`<input type="checkbox">` con `accent-color` cyan) ya funciona bien, solo tenía un problema de contraste en el borde, no de patrón. Se corrigió el contraste, no se rediseñó el componente.

**Verificado en local:** ambas secciones con scroll real, sin cerrar ninguna pestaña sin confirmación (ver [[feedback_pestana_nueva_revision_browser]] — corregido 2 veces esta sesión).

**Con esto, Francisco declaró finalizado el "refresh" del sitio.** Ver resumen consolidado al inicio de este archivo. Próximo bloque: QA de diseño (sin alcance definido, retomar preguntando).

**Sin commits en toda la sesión.**

---

## CIERRE DE SESIÓN — 2026-08-19 (leer esto primero al retomar)

Revisión "pulcra" sección por sección, de punta a punta del sitio (navbar → footer), con regla dura vigente para toda la sesión: **prohibido `!important`/hacks salvo estrictamente inevitable** (ver [[feedback_sin_parches_codigo]] en memoria).

### Estado por sección (todas cerradas salvo lo indicado)
| Sección | Estado |
|---|---|
| Navbar | ✅ Cerrado — hover más visible, estado `.active` con scrollspy (`IntersectionObserver`) |
| Hero | ✅ Cerrado — solo contraste de la ilustración, copy intacto, sin interactividad (decisión consciente) |
| Capacidades → UI/UX (GATO) | ✅ Cerrado — layout `--wide` anclado arriba + tarjeta de texto, mockup compactado, demo 100% interactivo, URL+ícono consistentes |
| Capacidades → Desarrollo Web (Koyam) | ✅ Cerrado — hereda fix de layout, mismo criterio de URL/ícono aplicado |
| Capacidades → Auditoría | ✅ Cerrado — migrado de SVG abstracto a mockup real (marca Creacort, dominio ficticio `.test`) |
| Capacidades → Estrategia Digital | ✅ Cerrado — migrado 2 veces: primero timeline vertical, después calendario tipo Gantt (referencia real de Linear) tras feedback de Francisco |
| El Framework | ✅ Cerrado — spec exacta aplicada (Fraunces bold italic 48px vía nuevo token `--text-2xl`, bajada 12px, cajas 14px) |
| Estructura | ✅ Cerrado — grid 2×2 sin avatares, copy recortado, rol de Anelisse corregido a "Directora de Diseño" |
| FAQ | ✅ Visual cerrado — **contenido pendiente de segunda revisión** (sin definir aún qué) |
| Footer | ⏳ **No revisado todavía** — siguiente paso al retomar |

### Pendiente explícito para el QA final (diferido a propósito durante toda la sesión)
1. `padding-bottom: 120px` de `.koyam-embed` — investigar si es necesario o es sobrante (causaba un salto de espacio grande antes de Auditoría).
2. Revisar Footer (no tocado esta sesión).
3. Segunda revisión de contenido de FAQ (sin alcance definido).

### Decisiones/aprendizajes de proceso que quedaron como reglas para sesiones futuras (memoria)
- [[feedback_sin_parches_codigo]] — sin hacks/`!important` salvo inevitable.
- [[feedback_pestana_nueva_revision_browser]] — nunca navegar la pestaña que Francisco sigue a otro sitio.
- [[feedback_bocetos_enviar_archivo]] — todo boceto de revisión se entrega con `SendUserFile`, nunca solo se describe o se cierra sin enviar.
- [[feedback_rol_diseno]] (extendida) — al retocar una pieza ya validada, comparar el resultado completo contra la referencia real, no solo el punto puntual pedido.

### Estado técnico
- Servidor local de verificación: `http-server` en `localhost:8001` sirviendo `Interno/www.olivacraft.com/` — puede seguir corriendo en background; verificar con `curl localhost:8001` antes de levantar uno nuevo.
- **Sin commits realizados** — todo el trabajo de esta sesión está en el working tree, pendiente de que Francisco lo pida explícitamente.
- Archivos tocados: `index.html`, `css/styles.css` (ambos con múltiples cambios acumulados de toda la sesión).

**Siguiente paso exacto al retomar:** confirmar con Francisco si quiere partir por Footer o por la segunda revisión de contenido de FAQ.

### Temas abiertos — NO tocar sin decisión explícita de Francisco

- `<title>` y meta description siguen diciendo "Consultora Tecnológica Boutique" — nunca confirmó sacarlo.
- "Sin subcontrataciones, sin desvíos de proyecto" (sección Estructura) — tensión real con Jez (contratista no nombrado en Delcocar) — es decisión de negocio, no de copy.

### Decisiones estructurales tomadas (para no repreguntar)

- **Patrón para secciones con mockup de producto real:** clase `.narrative-block--wide` — 2 columnas, texto en ancho fijo `minmax(320px,400px)`, visual toma el resto (`1fr`). Se probó apilado (texto arriba, mockup abajo) y se descartó explícitamente — Francisco lo pidió en 2 columnas.
- **Mockups de producto real (GATO, Koyam) se construyen en HTML/CSS**, no en SVG — con tokens propios scopeados (`--g-*` para GATO, `--k-*` para Koyam) para no chocar con los tokens del sitio. Motivo: mantenibilidad + evitar texto bajo 14px (regla dura del propio `CLAUDE.md`).
- **Diagramas abstractos/conceptuales (Auditoría, Estrategia Digital, próximamente Framework) se mantienen en SVG**, pero sin `font-family="monospace"` ni mayúsculas — usar `'Plus Jakarta Sans', sans-serif` inline y texto en formato oración real, tamaños de interfaz (14-18px) no de anotación de código (9-12px).
- **Mockup de teléfono (iPhone) para GATO se descartó** — igualar la fidelidad de un asset de mockup fotográfico (Shots.so/Mockuuups) a mano en CSS no rinde bien. Si se necesita a futuro, usar un mockup real con un screenshot adentro, no CSS puro.
- **Bug técnico recurrente a vigilar:** la regla `.narrative-visual svg` (genérica, afecta a TODO svg anidado dentro de esa columna) rompe el tamaño de íconos chicos dentro de `.gato-embed`/`.koyam-embed`. Ya resuelto con reset scoped (`.gato-embed svg, .koyam-embed svg { width:auto; height:auto; max-width:none; }`) + tamaños explícitos `width`/`height` en el HTML de cada ícono como respaldo — **replicar este mismo patrón si se agrega otro mockup HTML/CSS nuevo** (ej. si Framework termina necesitando uno).

---

## Estado Actual — 2026-06-11

### Completado sesión 2026-06-11

- **404.html** — página de error creada con SVG y estilos propios (commit 80f2fb5)
- **auditoria-2026-06-09.html** — informe de auditoría SEO/UX commiteado (commit 5b3fa08)
- **Footer Navegación** — FAQ agregado a `index.html` y `404.html`, orden alineado con navlinks: Capacidades → El Framework → Estructura → FAQ → Contacto (commits 7fea7bb, f9f9073)
- **Google Analytics GA4** `G-ZC1K670HJK` — snippet integrado en `index.html` local para sincronizar con live (commit 11c6033)
- **Formulario contacto** — opción "Automatización IA" eliminada, quedan 7 opciones (commit 11c6033)

### Pendiente

- **Configurar 404 en servidor** — apuntar 404.html en hosting
- **Fotos reales** Francisco y Anelisse → reemplazar badges iniciales F/A
- **caso-fletes.html** — actualizar al dark theme (sin link desde index por ahora)

### Siguiente Paso Exacto

Configurar ruta 404 en servidor/hosting (`ErrorDocument 404 /404.html` en Apache, o `not_found_page` en Netlify/Vercel).

---

## Estado Anterior — 2026-06-05 (sesión 3)

### Completado sesión 2026-06-05 (sesión 3)

**4 SVGs de Capacidades — mejora tipografía, contraste y alineación.**

#### Problemas resueltos
- font-sizes 7.7–9.9 (< 10px real) → todos los textos ahora 10–12px SVG con `dominant-baseline="central"`
- Fills demasiado bajos (0.04–0.07) → opacidades aumentadas en todos los elementos
- Textos sin centrado geométrico → y positions ajustadas al centro de sus contenedores
- SV3 "nav confusa" / "CTA oculto" clipeadas fuera del viewBox → viewBox extendido a 500, círculos a cx=420, labels a x=420 text-anchor="middle"

#### Cambios por SVG
- **SV1 (UI/UX):** font "claridad · 98%" 8.8→12, y centrado en rect, opacidades +30–40%
- **SV2 (Dev Web):** "TU PRODUCTO/COMPONENTES/DESIGN TOKENS" 9.9→12, "Button/Card/Form/Nav" 7.7→11, "portable" 7.7→11 rotate corregido, nav items height 6→8px, opacidades +40%
- **SV3 (Auditoría UX):** viewBox 460→500, todos los textos de etapas 9.9→12, "!" círculo 8.8→12, anotaciones 7.7→11 posicionadas dentro del viewBox, opacidades +30–50%
- **SV4 (Estrategia):** títulos 12, labels 11, "2 semanas" 10, "✓" 14→18, scope creep 8.3→11, opacidades +30–50%

---

### Completado sesión 2026-06-05 (sesión 2)

**Sección "El Framework" — refactorización estructural + jerarquía.**

- **Fases 01/02/03** → step list con numeración decorativa, línea conectora vertical CSS
- **Diferenciador** → bloque `.framework-closing` separado con borde cyan
- **Tags** → agregados a cada fase
- **OLIVA card** → `background: var(--c-surface)` + `::before` línea acento top cyan
- **SVG OLIVA rediseñado** → viewBox 640→344, font-size="12" + `dominant-baseline="central"`, stroke rgba inputs/outputs diferenciados
- **Layout** → `align-items: start` para sticky correcto

---

### Completado sesión 2026-06-05

**Reposicionamiento completo ejecutado.** Todo el index.html fue refactorizado para reflejar "consultora tecnológica boutique con framework propietario OLIVA IA-driven."

#### Copy y estructura
- Hero: H1 "Construimos sistemas digitales robustos." + tagline en cyan "Acelerados por OLIVA, nuestro framework propietario IA-driven." + body + 2 CTAs compactos
- Nav: Capacidades / El Framework / Estructura / Contacto
- Section "Por qué" → renombrada a **"El Framework"** como diferenciador central
- Servicios: 6 capacidades en narrative alternating (no dropdown de servicios)
- Equipo: Francisco (CEO, Product Designer & Framework Architect) + Anelisse (Director of Engineering & UI Systems Lead)
- Casos: eliminados — sección removida del sitio

#### Componentes nuevos
- **Hero dos columnas** (≥900px): texto izquierda + SVG DESIGN→OLIVA BUILD→DEPLOY derecha
- **Formulario contacto**: checkboxes multi-selección (8 opciones) reemplazó dropdown
- **WhatsApp flotante**: botón fijo bottom-right, sin glow verde
- **Framework section dos columnas**: izquierda cards con tags Fase 01/02/03 + Diferenciador, derecha `.framework-oliva-card` con título OLIVA grande + SVG node graph

#### Fixes responsive
- Navbar: breakpoint hamburger cambiado 768px → 1024px (evita overflow en tablet)
- narrative-text: `max-width: 400px` ahora solo en ≥900px (elimina espacio vacío tablet)
- narrative-visual: oculto en mobile, visible en ≥900px
- Mobile menu: separadores `border-bottom` en cada ítem + padding aumentado
- Conversemos (mobile): `color: var(--c-night)` — texto oscuro sobre cyan, pasa WCAG AA

#### Detalles visuales
- SVG font-sizes: todos aumentados 10% (6.5→7.2, 7→7.7, 7.5→8.3, 8→8.8, 8.5→9.4, 9→9.9)
- WhatsApp: glow verde removido → sombra neutra

_(ver estado actual arriba)_

---

## Decisiones Estructurales Tomadas

| Decisión | Detalle | Por qué |
|---|---|---|
| Dark theme total | `#09090B` base, sin secciones blancas | Diferenciación, alineación con fw-oliva |
| Fraunces + Plus Jakarta Sans | Display serif + sans-serif moderna | Más premium que Figtree |
| Framework como eje central | Sección "El Framework" reemplaza "Por qué" | OLIVA como diferenciador comercial, no solo tools |
| Framework two-column | Cards tags izquierda, OLIVA visual sticky derecha | Muestra el sistema, no solo lo describe |
| Nav breakpoint 1024px | Hamburger hasta 1023px | 4 ítems + logo + CTA no caben en 768px |
| Checkboxes multi-selección | 8 opciones de servicio | Clientes suelen necesitar más de uno |
| WhatsApp flotante | Fijo bottom-right, sin glow | Conversión directa sin agresividad visual |
| Casos eliminados | Sección removida del sitio | Sin material visual real — mejor ausencia que placeholders |
| SVG font-sizes +10% | Todos los textos de ilustraciones aumentados | Legibilidad en desktop y mobile |

---

## Archivos Clave

| Archivo | Estado |
|---|---|
| `index.html` | Rediseño completo + reposicionamiento + framework section nueva |
| `css/styles.css` | 18 secciones — tokens, narrative, framework layout, wa-float, checkboxes |
| `caso-fletes.html` | Existe, sin link desde index — pendiente rediseño dark |
| `js/main.js` | Sin cambios — toggle mobile nav |

---

## Historial

| Fecha | Completado |
|---|---|
| 2026-06-01 | Prototipo base, estructura, copy v1 |
| 2026-06-02 | Dark theme + copy comercial + Linear-style 4 fases |
| 2026-06-05 | Reposicionamiento completo: hero 2 cols, framework 2 cols, nav fix, responsive, SVG fonts, WA float |
| 2026-06-11 | 404.html, auditoría SEO/UX, FAQ en footer (index + 404) |
