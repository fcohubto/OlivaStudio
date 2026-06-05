# project-continuity.md — olivacraft.com 2.0

**Proyecto:** olivacraft.com — rediseño completo
**Tipo:** Landing page comercial consultora tecnológica boutique
**Ruta:** `Productos/olivacraft.com 2.0/`
**Stack:** Vanilla HTML + CSS (tokens OLIVA OS) + JS mínimo — sin build

---

## Estado Actual — 2026-06-05 (sesión 3)

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

### Pendiente

- **Revisión visual en browser** — validar framework section en desktop, tablet y mobile
- **Fotos reales** Francisco y Anelisse → reemplazar badges iniciales F/A
- **Backend formulario** — no envía (sin backend/servicio activo)
- **caso-fletes.html** — actualizar al dark theme (sin link desde index por ahora)
- **SEO** — meta description, og:tags, sitemap
- **Deploy** a olivacraft.com (confirmar DNS antes de push)

### Bloqueado

- Deploy: pendiente revisión visual completa en browser + decisión dominio

---

## Siguiente Paso Exacto

1. Levantar servidor local: `python -m http.server 8001` desde `Productos/olivacraft.com 2.0/`
2. Revisar en browser: desktop (framework dos columnas, hero dos columnas), tablet 768–1023px (hamburger nav, capacidades sin espacio vacío), mobile 375px (menú separadores, CTAs)
3. Corregir lo que rompa
4. Deploy a GitHub Pages

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
