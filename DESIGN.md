# Design System — Health-Claims

<!-- impeccable:design-schema 1 -->

Dirección visual: **Liquid Glass 26**
Producto: Health-Claims — SaaS de gestión y liquidación de siniestros de salud.
Plataforma: web.

---

## 1. Principles

- **Glass with purpose.** El vidrio se usa en capas flotantes (topbar, sidebar, modales, dropdowns, flyouts). El contenido denso (tablas, formularios, datos) permanece legible sobre superficies semi-sólidas.
- **Premium, not generic.** No es un dashboard de Tailwind. Es un producto SaaS moderno con materialidad, luz ambiental y profundidad.
- **No decoration.** No gradientes, sombras, animaciones o bordes redondeados innecesarios. Cada efecto resuelve una función.
- **Density by context.** Dashboards y tablas permiten alta densidad. Modales y formularios respiran más.
- **One accent per skin.** Tres skins con un acento principal distintivo. Nada de morados, rosas o naranjas arbitrarios.
- **Functional motion.** Transiciones explican cambio de estado, confirman acciones y guían la atención. Nada de orbes, drift o lente.

---

## 2. Skins

El usuario puede cambiar entre 3 skins desde `/configuracion/temas`.

### `liquid-glass-26` (default)

- **Fondo light:** `#eef2f7` con ruido sutil 2% y mesh de orbes cian `#06b6d4`, azul `#3b82f6`, teal `#14b8a6` (opacidad 0.10–0.22, blur 100–150px).
- **Fondo dark:** `#05080f` con orbes cian-azul `#1e3a8a` (opacidad 0.12–0.20).
- **Acento:** `#06b6d4` → `#0ea5e9` en gradientes funcionales.
- **Glass:** en topbar, sidebar, cards, panels, modales, dropdowns.
- **Borde glass:** `rgba(255,255,255,0.16)` light, `rgba(255,255,255,0.08)` dark.
- **Shadow:** `0 8px 32px rgba(2,8,20,0.10)`.
- **Radius:** `14px` cards, `10px` modales, `8px` botones.

### `vibrancy-operations`

- **Fondo light:** `#f8fafc` con mesh sutil cian-azul (opacidad 0.06–0.12).
- **Fondo dark:** `#0b0f15` con mesh cian-azul muy sutil.
- **Acento:** `#0ea5e9`.
- **Glass:** solo en capas flotantes (topbar, modales, dropdowns, sidebar). Cards semi-sólidas.
- **Borde:** `rgba(255,255,255,0.12)` light.
- **Shadow:** `0 4px 24px rgba(2,8,20,0.08)`.
- **Radius:** `10px` cards, `8px` botones.

### `sequoia`

- **Fondo light:** `#e8eaed` con ruido sutil 2% y un solo orbe azul-grisáceo difuminado.
- **Fondo dark:** `#1c1c1e` con ruido sutil y un orbe gris-azul.
- **Acento:** `#0a84ff` (azul macOS).
- **Glass:** en topbar, sidebar, modales; blur medio (`16–20px`), bordes definidos.
- **Borde:** `rgba(0,0,0,0.08)` light, `rgba(255,255,255,0.10)` dark.
- **Shadow:** `0 6px 20px rgba(0,0,0,0.10)`.
- **Radius:** `10px` cards, `6px` botones, más afilado.

---

## 3. Color

### Core (compartido)

| Token | Light | Dark |
|---|---|---|
| `background` | `#eef2f7` o `#f8fafc` según skin | `#05080f`, `#0b0f15`, `#1c1c1e` según skin |
| `foreground` | `#0f172a` | `#f1f5f9` |
| `card` | `rgba(255,255,255,0.74)` con glass | `rgba(20,24,32,0.74)` con glass |
| `card-foreground` | `#0f172a` | `#f1f5f9` |
| `popover` | `rgba(255,255,255,0.85)` con glass | `rgba(20,24,32,0.85)` con glass |
| `muted` | `#f1f5f9` | `#181c24` |
| `muted-foreground` | `#64748b` | `#94a3b8` |
| `border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.10)` |
| `input` | `rgba(255,255,255,0.70)` | `rgba(20,24,32,0.70)` |
| `ring` | acento del skin | acento del skin |
| `destructive` | `#ef4444` | `#ef4444` |

### Semantic

- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3b82f6`

---

## 4. Typography

- **Sans UI:** `Geist` (primary), fallback `Inter`, `ui-sans-serif`, `system-ui`.
- **Mono:** `Geist Mono` para códigos, números de siniestro, montos.
- **Heading:** mismo que sans (sin serif). Pesos `500`, `600`, `700`.
- **Escala:**
  - H1 página: `20px` / `600` / tracking `-0.01em`
  - H2 sección: `16px` / `600` / tracking `-0.01em`
  - H3 card/panel: `14px` / `600`
  - Body: `14px` / `400` / `1.5`
  - Small/label: `12px` / `500`
  - Tables: `13px` / `400`; headers `13px` / `600`
  - Mono: `13px` / `400` / `tabular-nums`

---

## 5. Spacing

- Base: `4px`.
- Page padding: `24px`.
- Card padding: `16px` o `20px`.
- Card gap: `16px`.
- Form field gap: `16px`.
- Input height: `32px`.
- Button height: `32px`.
- Table row height: `44px`.
- Sidebar width: `240px`.
- Topbar height: `56px`.

---

## 6. Shapes

- **Cards/panels:** `14px` (`liquid-glass-26`), `10px` (`vibrancy-operations`), `10px` (`sequoia`).
- **Modales:** `10px`.
- **Botones:** `8px` (`liquid-glass-26`), `8px` (`vibrancy-operations`), `6px` (`sequoia`).
- **Inputs:** `6px`.
- **Badges:** `4px`.
- **Avatars/chips:** `999px`.

---

## 7. Materials / Glass

### Uso permitido

- **Topbar:** `backdrop-blur: 18px`, glass `0.72`.
- **Sidebar:** `backdrop-blur: 20px`, glass `0.78`.
- **Modales:** `backdrop-blur: 28px`, glass `0.82`.
- **Dropdowns/flyouts:** `backdrop-blur: 16px`, glass `0.85`.
- **Cards/panels (en `liquid-glass-26` only):** `backdrop-blur: 8px`, glass `0.64`.
- **Cards/panels (otros skins):** semi-sólido sin glass para legibilidad.

### Uso prohibido

- Glass en inputs.
- Glass en celdas de tabla.
- Glass en botones primarios.
- Glass en contenido de lectura extenso.

---

## 8. Shadows

- Solo capas flotantes: `0 8px 32px rgba(2,8,20,0.10)`.
- Modales y drawers: `0 16px 48px rgba(2,8,20,0.14)`.
- Dropdowns: `0 4px 16px rgba(2,8,20,0.08)`.
- Sin sombras en cards estáticas.

---

## 9. Components

### Buttons

- **Primary:** fondo acento del skin, texto blanco, `8px` radius, `32px` height. Hover `translateY(-1px)` + `brightness(1.05)`. Active `scale(0.97)`.
- **Secondary:** fondo `muted`, texto `foreground`, borde sutil. Hover `background` un tono más claro.
- **Ghost:** transparente, texto `muted-foreground`. Hover `background` sutil.
- **Destructive:** rojo puro, sin gradientes.

### Inputs / Selects / Textareas

- Fondo `input`, borde `border`, `6px` radius, `32px` height.
- Focus: `ring-2` acento `0.25` opacidad, `border` acento.
- Placeholder `muted-foreground` `0.7`.

### Cards

- Fondo `card`, borde `1px` translúcido.
- Sin sombra.
- Header `16-20px`, padding `16px`.

### Tables

- Header `13px` semibold, filas `13px` regular.
- Row height `44px`.
- Hover fila `background` sutil.
- Bordes horizontales `1px`.
- Sin glass en celdas.

### Modales

- Glass `0.82` + blur `28px`.
- Header `16px` semibold.
- Tamaños canónicos: `520px`, `560px`, `760px`, `920px`.

### Tabs

- Indicador `2px` acento, `transition` suave.
- Sin fondos para tabs inactivos.
- Active: texto `foreground` + indicador.

### Badges

- `4px` radius, fondo semitransparente acento, texto acento oscuro.
- `12px` medium.

### Sidebar

- Glass `0.78`, ancho `240px`.
- Items `14px` medium.
- Active: fondo acento `0.12` opacidad + borde izquierdo `3px` acento.

### Topbar

- Glass `0.72`, altura `56px`.
- Breadcrumb a la izquierda, acciones y usuario a la derecha.
- Sin dock, sin lente.

---

## 10. Motion

- **Easing:** `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`).
- **Durations:** `150ms` hover, `180ms` focus, `220ms` modals, `160ms` dropdowns.
- **Buttons:** `scale(0.97)` en `:active`.
- **Modals:** `fade + scale(0.96→1)`.
- **Dropdowns/flyouts:** `fade + translateY(-4px→0)`.
- **Table rows:** background transition `150ms`.
- **Focus:** ring `180ms`.
- **No motion:** orbes, drift, lens, shimmer decorativo.

---

## 11. Responsive

- **Desktop:** `≥1280px`, sidebar expandido `240px`, grids de 3-4 columnas.
- **Tablet:** `768px–1279px`, sidebar colapsado a `72px` o drawer, grids de 2 columnas.
- **Mobile:** `<768px`, mobile drawer, stacks verticales, tablas con scroll horizontal o card view.
- Breakpoints: `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.

---

## 12. Accessibility

- Focus visible en todos los controles interactivos.
- Contraste mínimo `4.5:1` para texto, `3:1` para UI grandes.
- `prefers-reduced-motion`: desactivar orbes y acortar transiciones a `0ms`.
- Tamaños táctiles mínimos `44px` para botones y filas.
- Labels asociados a todos los inputs.

---

## 13. Modes

- Cada skin soporta **light** y **dark**.
- El modo se hereda del sistema o se fija por el usuario.
- `color-scheme` respetado.

---

## 14. What is not allowed

- Gradientes innecesarios.
- Sombras en cards estáticas.
- Bordes redondeados mayores a `14px`.
- Más de un acento principal por skin.
- Animaciones decorativas (orbs, drift, lens).
- Morados, rosas o naranjas no semánticos.
- 10 fuentes distintas; usar `Geist` + `Geist Mono`.
