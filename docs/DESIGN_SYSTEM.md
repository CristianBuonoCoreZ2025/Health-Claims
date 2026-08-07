# Sistema de diseno — Health Claims

Reglas de interfaz aplicables a todo el proyecto. Antes de modificar un `.tsx`, revisar este documento.

## 1. Tipografia

- Fuentes: DM Sans para cuerpo, Sora para titulos. Cargadas desde `next/font/google` en `layout.tsx`.
- Escala fija:
  - Titulos de pagina, modal, seccion, card: 13px, semibold.
  - Labels: 12px, regular.
  - Badges, tabs: 12px, medium.
  - Texto de grilla: 11px, regular.
  - Titulos de columnas: 11px, semibold.
  - Cuerpo/valores: 11px, regular.
  - Botones: 11px, semibold.
- Convencion `Propercase` para textos controlados por clases.

### Clases de tipografia

| Uso | Clase |
|---|---|
| Titulo de pagina | `.app-page-title` |
| Titulo de seccion | `.app-section-title` |
| Titulo generico | `.app-title` |
| Label de campo | `.app-field-label`, `.app-data-label` |
| Texto de grilla | `.app-grid-text` |
| Titulo de columna | `.app-grid-title` |
| Cuerpo | `.app-text`, `.app-body` |
| Boton | `.app-button-text` |

## 2. Botones

- Clase obligatoria: `.pg-btn-platinum`.
- Texto de una palabra: `Guardar`, `Cerrar`, `Cancelar`, `Crear`, `Nuevo`, `Editar`, `Eliminar`.
- Prohibido: `btn-danger`, `btn-neutral`, `btn-save`, `btn-create`, `liquid-button`, etc.
- Botones de icono en grilla: `.btn-icon-sm`.

## 3. Inputs y formularios

- Inputs: `.app-input`.
- Labels: `.app-field-label`.
- Buscadores: `.liquid-search`.
- Placeholders en espanol, cortos y descriptivos.
- Altura estandar: 28px.
- Tamano de fuente en inputs: 11px.

## 4. Selects / Dropdowns

- Renderizar con `Portal`.
- `position="popper"` para escapar contenedores con `overflow`.
- `side="bottom"`, `sideOffset={0}`.
- Clase `z-9999` sobre el contenido del popup.
- No usar `isolate` en overlays o positioners.

## 5. Modales

- Tamanos canonicos: `.modal-sm` (520px), `.modal-md` (560px), `.modal-lg` (720px).
- Estructura interna: `.modal-header`, `.modal-body`, `.modal-footer`.
- Titulo: `.modal-title`.
- Botones del modal: `.pg-btn-platinum`.

## 6. Tablas

- Usar `.app-data-table` en el contenedor de la tabla.
- Celdas: `.app-grid-text`.
- Encabezados: `.app-grid-title`.
- Sin checkboxes; usar `Eye/EyeOff` o `Switch` de shadcn si es necesario.

## 7. Iconos

- Usar `lucide-react`. No mezclar familias.

## 8. Layout

- `.app-page` para el contenedor de pagina.
- `.app-page-header` para el bloque de titulo + descripcion.
- `.app-card` para tarjetas de navegacion o datos.
- `.app-panel` para paneles de contenido.

## 9. Colores y branding

- Paleta profesional de salud: tonos de aguamarina/teal como primarios, acentos suaves y gris azulado.
- Modo oscuro: superficies oscuras, acentos invertidos, bordes translucidos.
- Skins dinamicas disponibles en `ui-style-skins.css`.

## 10. Animaciones

- Animaciones clave en `animations.css`: `app-progress-slide`, `fade-up`, `count-pop`.

## 11. Restricciones

- Sin `style={{ ... }}` en JSX para estilos visuales.
- Sin `any`, `console.log`, TODO/FIXME ni comentarios en codigo.
- Maximo 300 lineas por archivo.
- Idioma neutro (Chile) en interfaz, codigo, commits y documentacion.
