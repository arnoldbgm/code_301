# Diseño de Interfaz — Sistema de Inventarios

## Contexto del Producto

Sistema de gestión de inventarios para uso interno de una empresa. El usuario administra productos, categorías y proveedores. Necesita una vista general de métricas y un panel de administración para el CRUD de cada entidad.

**Público objetivo:** Operadores de almacén y gerentes de inventario.
**Tono:** Profesional, limpio, funcional. Sin adornos innecesarios.

---

## Stack Visual

| Elemento | Decisión |
|----------|----------|
| Framework | Next.js 16 (App Router) |
| Estilos | Tailwind CSS 4 (utility-first, sin librería de componentes externa) |
| Tipografía | Geist Sans (ya cargada en el proyecto) |
| Íconos | SVG inline, sin librería externa |
| Colores | Paleta Tailwind zinc/slate, sin colores llamativos |
| Border radius | `rounded-lg` consistente |
| Sombras | `shadow-sm` en cards y elementos elevados |

---

## Estructura de Navegación

### Layout general

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (fijo, 240px)  │   CONTENIDO           │
│                          │                       │
│  Logo / Nombre app       │   (varía por ruta)    │
│                          │                       │
│  ─ Dashboard             │                       │
│  ─ Productos             │                       │
│  ─ Categorías            │                       │
│  ─ Proveedores           │                       │
│                          │                       │
└─────────────────────────────────────────────────┘
```

- **Sidebar:** Fijo a la izquierda en desktop. En móvil se oculta con botón hamburguesa.
- **Sección activa:** Indicador visual de fondo/borde diferente en el link activo.
- **Rutas:**
  - `/` → Dashboard
  - `/admin/productos` → Gestión de productos
  - `/admin/categorias` → Gestión de categorías
  - `/admin/proveedores` → Gestión de proveedores

---

## Pantallas

### 1. Dashboard (`/`)

Grid de **6 tarjetas de métricas** (2 columnas en desktop, 1 en móvil):

| Tarjeta | Contenido | Icono sugerido |
|---------|-----------|----------------|
| Proveedores | Número total | Personas/empresa |
| Productos | Número total | Caja/producto |
| Precio Promedio | Valor con formato S/. XX.XX | Moneda |
| Stock Promedio | Número entero | Inventario |
| Mayor Precio | Nombre del producto + precio | Flecha arriba |
| Mayor Stock | Nombre del producto + stock | Flecha arriba |

- Tarjetas con fondo blanco, `shadow-sm`, `rounded-lg`, `p-6`.
- Métricas numéricas grandes y bold. Etiquetas pequeñas y en color secundario (zinc-500).

---

### 2. Módulos de Administración (`/admin/*`)

Cada módulo sigue el **mismo layout** con dos componentes principales:

```
┌──────────────────────────────────────────────┐
│  Título del módulo                [Botón +]  │
├──────────────────────────────────────────────┤
│  FORMULARIO (colapsado o visible)            │
│  ┌────────────────────────────────────────┐  │
│  │  Campos de entrada + Botones           │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  TABLA de registros                          │
│  ┌────────────────────────────────────────┐  │
│  │  Encabezados de columna                │  │
│  │  Filas con datos                       │  │
│  │  Acciones: editar / eliminar           │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### Formulario
- Ubicación: Arriba de la tabla, dentro de un card con borde sutil.
- Modo creación: Visible por defecto con botón "Agregar [entidad]".
- Modo edición: Se activa al hacer clic en "Editar" en la tabla. El formulario se rellena con los datos existentes y el botón cambia a "Actualizar".
- Botones: "Guardar" (primario) y "Cancelar" (secundario, solo en modo edición).
- Validación visual: Bordes rojos + mensaje debajo del campo con error.

#### Tabla
- Encabezados de columna en fondo zinc-100, texto zinc-600, peso semibold.
- Filas alternas con fondo blanco / zinc-50.
- Hover en fila: fondo zinc-100.
- Columna de acciones al final: iconos de editar (lápiz) y eliminar (basura).
- Estado vacío: Mensaje centrado "No hay [entidad] registrados" con ilustración simple o icono.

---

### 2a. Productos

**Columnas de tabla:**

| Columna | Formato |
|---------|---------|
| Nombre | Texto |
| Precio | Formato moneda S/. XX.XX |
| Stock | Número entero + indicador de color |
| Categoría | Nombre de la categoría |
| Proveedor | Nombre del proveedor |
| Acciones | Iconos editar/eliminar |

**Indicador de stock (badges):**

| Nivel | Rango | Color de fondo | Color de texto |
|-------|-------|----------------|----------------|
| Bajo | < 10 | Rojo claro | Rojo oscuro |
| Medio | 10 - 50 | Amarillo claro | Amarillo oscuro |
| Alto | > 50 | Verde claro | Verde oscuro |

**Formulario — campos:**

| Campo | Tipo | Detalle |
|-------|------|---------|
| Nombre | Texto | Requerido |
| Precio | Número | Step 0.01, formato moneda |
| Stock | Número | Step 1, entero |
| Categoría | Select (dropdown) | Opciones cargadas desde datos existentes |
| Proveedor | Select (dropdown) | Opciones cargadas desde datos existentes |

---

### 2b. Categorías

**Columnas de tabla:**

| Columna | Formato |
|---------|---------|
| Nombre | Texto |
| Productos asociados | Número (cantidad) |
| Acciones | Iconos editar/eliminar |

**Formulario — campos:**

| Campo | Tipo | Detalle |
|-------|------|---------|
| Nombre | Texto | Requerido, único |

**Eliminación:** Si la categoría tiene productos asociados, mostrar modal de advertencia: "Esta categoría tiene X producto(s) asociado(s). ¿Estás seguro de eliminarla?"

---

### 2c. Proveedores

**Columnas de tabla:**

| Columna | Formato |
|---------|---------|
| Nombre | Texto |
| RUC | Texto, 11 caracteres |
| Email | Texto, enlace mailto |
| Productos asociados | Número (cantidad) |
| Acciones | Iconos editar/eliminar |

**Formulario — campos:**

| Campo | Tipo | Detalle |
|-------|------|---------|
| Nombre | Texto | Requerido |
| RUC | Texto | maxlength 11, formato peruano |
| Email | Email | Requerido |

**Eliminación:** Si el proveedor tiene productos asociados, mostrar modal de advertencia: "Este proveedor tiene X producto(s) asociado(s). ¿Estás seguro de eliminarlo?"

---

## Componentes Globales

### Modal de Confirmación
- Se muestra al intentar eliminar un registro.
- Título: "Confirmar eliminación"
- Mensaje descriptivo con el nombre del registro.
- Botones: "Cancelar" (secundario) y "Eliminar" (rojo, primario).

### Mensajes de Feedback
- **Éxito:** Mensaje temporal (toast) en la esquina superior derecha, fondo verde, duración 3 segundos.
- **Error:** Mensaje inline debajo del formulario o toast rojo.
- **Cargando:** Skeleton o spinner centrado mientras se cargan datos.

### Botones
- **Primario:** Fondo zinc-900, texto blanco, `rounded-lg`.
- **Secundario:** Fondo blanco, borde zinc-300, texto zinc-700.
- **Peligro:** Fondo rojo-600, texto blanco (solo para eliminar).
- **Todos:** Padding `px-4 py-2`, transición de color en hover, cursor pointer.

### Inputs
- Bordered: `border border-zinc-300`, `rounded-lg`, `px-3 py-2`.
- Focus: `ring-2 ring-zinc-500 ring-offset-2`.
- Error: `border-red-500` + texto de error debajo en rojo.

---

## Responsive

| Breakpoint | Comportamiento |
|------------|----------------|
| Desktop (>1024px) | Sidebar fijo + contenido amplio |
| Tablet (768-1024px) | Sidebar colapsable (iconos) + contenido |
| Móvil (<768px) | Sidebar oculto con menú hamburguesa, contenido a pantalla completa |

---

## Paleta de Colores

| Rol | Color | Uso |
|-----|-------|-----|
| Background | zinc-50 | Fondo de página |
| Superficie | white | Cards, tablas, formularios |
| Texto primario | zinc-900 | Títulos, datos |
| Texto secundario | zinc-500 | Labels, descripciones |
| Borde | zinc-200 | Separadores, bordes de cards |
| Primario | zinc-900 | Botones principales, links |
| Éxito | green-600 | Feedback positivo, stock alto |
| Advertencia | yellow-500 | Stock medio |
| Peligro | red-600 | Eliminar, errores, stock bajo |
| Hover | zinc-100 | Interacciones en filas y botones |
