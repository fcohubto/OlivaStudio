# olivacraft.com 2.0

Landing page comercial de Olivacraft — consultora tecnológica boutique. Rediseño completo del sitio actual en olivacraft.com.

**Stack:** HTML + CSS + JS vanilla. Sin dependencias, sin build, sin bundler.

---

## Estructura

```
olivacraft.com 2.0/
├── index.html          # Página única — toda la landing
├── css/
│   └── styles.css      # Único stylesheet — tokens + secciones
├── js/
│   └── main.js         # Nav mobile, modal legal, formulario
└── assets/
    └── logo.png        # Wordmark circular (favicon + og:image)
```

---

## Desarrollo local

Cualquier servidor estático funciona. Lo más directo:

```bash
python -m http.server 8001
# → http://localhost:8001
```

O con Node:

```bash
npx serve .
```

> **Nota:** El widget de Cloudflare Turnstile solo renderiza en el dominio `olivacraft.com`. En local, el formulario mostrará el widget pero no completará la verificación — el formulario no enviará hasta estar en producción.

---

## Deploy

Este sitio reemplaza al olivacraft.com actual. El destino es el **mismo servidor PHP**.

### Pasos

1. Subir todos los archivos al root del dominio (reemplaza el sitio actual)
2. Verificar que `index.html` sirve como documento raíz
3. Activar el formulario (ver sección siguiente)
4. Confirmar redirección DNS si aplica

### Lo que NO se necesita

- No npm install
- No compilación ni build
- No variables de entorno
- No servidor Node

---

## Activación del formulario

El formulario está completamente implementado en el frontend. Al hacer deploy solo falta un archivo en el servidor:

### `send.php` — crear en el root del dominio

El formulario hace `POST /send.php` con los siguientes campos:

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre` | string | Nombre o empresa del contacto |
| `email` | string | Email del contacto |
| `servicio[]` | array | Servicios seleccionados (múltiples valores posibles) |
| `descripcion` | string | Mensaje libre (opcional) |
| `cf-turnstile-response` | string | Token de verificación Cloudflare Turnstile |

El `send.php` debe:
1. Validar el token Turnstile contra la API de Cloudflare (secret key en el servidor)
2. Enviar el email a `contacto@olivacraft.com`
3. Retornar HTTP 200 en éxito — el JS no lee el body de la respuesta

### Cloudflare Turnstile

- **Sitekey** (ya configurado en el HTML): `0x4AAAAAADSnY2mre0cXsjnc`
- **Secret key**: está en el panel de Cloudflare del dominio — se usa solo en `send.php`
- El widget ya existe en el form y los callbacks JS están implementados

### Comportamiento del formulario al enviar

1. Valida nombre (≥2 chars) y email (formato válido)
2. Verifica token Turnstile
3. Muestra estado "Enviando..." en el botón
4. En éxito: muestra "✓ Mensaje enviado", resetea el form, muestra `#contacto-success`
5. En error: restaura el botón y resetea Turnstile

---

## Pendientes antes del go-live

| Item | Estado | Nota |
|---|---|---|
| `send.php` | Pendiente | Ver sección anterior |
| Foto Francisco | Pendiente | Reemplazar badge inicial "F" en sección Estructura |
| Foto Anelisse | Pendiente | Reemplazar badge inicial "A" en sección Estructura |
| `og:image` 1200×630 | Pendiente | El `assets/logo.png` actual es cuadrado — no ideal para OG/Twitter |

---

## Decisiones de diseño relevantes

- **Dark theme total** — diverge intencionalmente del manual de marca (que define fondo blanco frío). Decisión documentada.
- **Tipografía:** Fraunces (display/títulos) + Plus Jakarta Sans (cuerpo/UI)
- **Framework OLIVA** — nombre del framework propietario de Olivacraft; no es un framework externo
- **Sin favicon .ico** — se usa `assets/logo.png` directamente; funciona en todos los browsers modernos
- **Nav breakpoint: 1024px** — hamburger hasta 1023px (4 ítems + logo + CTA no caben en 768px)

---

## Contacto del proyecto

**Francisco Orellana** — CEO / Product Designer  
contacto@olivacraft.com  
[LinkedIn](https://www.linkedin.com/in/francisco-orellana-v)
