# PROJECT DESIGN SYSTEM

Este proyecto utiliza tres Design Skills:

1. Taste
2. Impeccable
3. Emil Design Engineering

## ORDEN DE PRIORIDAD

### 1. Taste
Define la dirección visual general.

Responsabilidades:
- Personalidad visual
- Jerarquía visual
- Densidad de información
- Composición
- Contraste
- Identidad visual
- Evitar diseños genéricos

Taste define la dirección visual, pero no debe modificar arbitrariamente
la arquitectura funcional del producto.

### 2. Impeccable
Después de definida la dirección visual, aplicar Impeccable para revisar:

- Layout
- Espaciado
- Tipografía
- Responsive
- Accesibilidad
- Consistencia
- Componentes
- Estados de interacción
- Formularios
- Tablas
- Navegación

Impeccable debe respetar la dirección visual establecida por Taste.

### 3. Emil Design Engineering
Aplicar después de completar la estructura visual.

Responsabilidades:

- Animaciones
- Transiciones
- Microinteracciones
- Feedback visual
- Motion
- Hover
- Focus
- Loading
- Estados de entrada y salida

Las animaciones deben ser discretas y funcionales.
No agregar animaciones únicamente por decoración.

## REGLA GENERAL

No rehacer componentes que ya cumplen los criterios.

Antes de modificar una pantalla:

1. Analizar la interfaz existente.
2. Identificar problemas.
3. Definir los cambios.
4. Aplicar Taste para dirección visual.
5. Aplicar Impeccable para refinamiento UX/UI.
6. Aplicar Emil para motion e interacción.
7. Revisar nuevamente toda la pantalla.

## RESTRICCIONES

No introducir:
- Gradientes innecesarios
- Sombras excesivas
- Animaciones excesivas
- Componentes visualmente genéricos
- Cambios arbitrarios de colores
- Cambios arbitrarios de tipografía
- Elementos decorativos sin función

Mantener consistencia entre todas las pantallas del proyecto.

Antes de crear un componente nuevo, revisar si existe uno equivalente.

Antes de modificar el Design System, verificar el impacto en las demás pantallas.