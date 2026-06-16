# Inventario con Ant Design — Guía paso a paso

> **Flujo incremental:** primero la maquetación, después la lógica, después la tabla, después la persistencia.
> Así aprendés cada concepto de forma aislada, sin mezclarlo todo.
>
> **React 19 · Vite 8 · Ant Design v6 · react-router-dom v7 · Desktop Web**
> *"Sin CSS. Sin magia. Solo componentes."*

---

## Índice

| # | Tema |
|---|------|
| 1 | Instalación de React con Ant Design |
| 2 | Cómo se usan los componentes de Ant Design |
| 3 | Rutas con React Router DOM (routes.jsx) |
| 4 | Crear las vistas (Pages) |
| 5 | Productos — Maquetación (solo UI, nada de lógica) |
| 6 | Productos — Introducir lógica (useState, handleChange, guardar) |
| 7 | Productos — Renderizar datos en la tabla |
| 8 | Productos — localStorage (persistencia, editar, eliminar, buscar) |
| 9 | Ventas — Misma secuencia (maquetación → lógica → tabla → persistencia) |

---

# 1️⃣ Instalación de React con Ant Design

Arrancamos desde cero con Vite.

```bash
pnpm create vite inventario --template react
cd inventario
pnpm add antd @ant-design/icons react-router-dom dayjs
pnpm run dev
```

**¿Qué instalamos?**

| Paquete | Para qué sirve |
|---------|---------------|
| `antd` | Los componentes visuales (Button, Table, Modal, Layout, etc.) |
| `@ant-design/icons` | Iconos listos para usar (PlusOutlined, DeleteOutlined, etc.) |
| `react-router-dom` | Para navegar entre páginas sin recargar |
| `dayjs` | Ant Design lo usa internamente para formatear fechas |

**¿Y el CSS?** Ant Design v6 no necesita import adicional — los estilos vienen incluidos en el paquete.

Limpiamos los archivos que sobran de Vite:

- Borrá `src/App.css`
- Borrá `src/assets/` (la carpeta entera)
- Reemplazá `src/index.css` con esto:

```css
body {
  margin: 0;
}
```

Ese es TODO el CSS que vamos a escribir. El resto lo hacen los componentes de Ant Design con sus props.

---

# 2️⃣ Cómo se usan los componentes de Ant Design

Antd no es magia. Son componentes de React comunes y corrientes. Se importan, se ponen en el JSX, y se configuran con props.

```jsx
import { Button, Input } from 'antd'

function Ejemplo() {
  return (
    <div>
      <Input placeholder="Nombre" />
      <Button type="primary">Enviar</Button>
    </div>
  )
}
```

**Conceptos clave:**

1. **Cada componente es un elemento HTML estilizado.** `Button` renderiza un `<button>` con estilos de Ant Design. `Input` renderiza un `<input>` con diseño propio.

2. **Cada componente tiene props específicas.** No necesitás CSS. Los componentes ya vienen con diseño:

   ```jsx
   <Button type="primary" danger>Eliminar</Button>
   <Typography.Title level={4}>Título</Typography.Title>
   ```

   Las props como `type`, `size`, `variant` controlan cómo se ve el componente sin escribir una línea de CSS.

3. **`ConfigProvider`** va en la raíz si querés personalizar colores globales. No es obligatorio — los componentes funcionan sin él con el tema default azul.

4. **Los iconos son componentes.** Se importan de `@ant-design/icons` y se usan como cualquier componente:

   ```jsx
   import { PlusOutlined } from '@ant-design/icons'
   <Button icon={<PlusOutlined />}>Agregar</Button>
   ```

5. **No hay `sx`, no hay `styled()`, no hay `style={{}}` forzado.** Los componentes de Antd se configuran con props nativas. Punto.

**No necesitás saber más para arrancar.** El resto lo aprendés viendo los ejemplos.

---

# 3️⃣ Rutas con React Router DOM

En lugar de tener las rutas en `App.jsx`, las separamos en su propio archivo. La estructura queda más limpia y escalable.

## 3.1 Crear el router

Creá `src/router/index.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Productos from '../pages/Productos'
import Ventas from '../pages/Ventas'
import AppLayout from '../layouts/AppLayout'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/productos" replace />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <h1>404 — Página no encontrada</h1>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

**Explicación:**
- `<Route element={<AppLayout />}>` es la ruta padre. Todas las hijas se renderizan dentro del `<Outlet />` del layout.
- `<Navigate to="/productos" replace />` redirige de `/` a `/productos`.
- `path="*"` captura cualquier ruta no definida y muestra un 404.

## 3.2 App.jsx — solo renderiza el router

Reemplazá `src/App.jsx`:

```jsx
import Router from './router'

export default function App() {
  return <Router />
}
```

## 3.3 main.jsx — ConfigProvider (opcional)

Reemplazá `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ConfigProvider theme={{ token: { colorPrimary: '#1565C0' } }}> */}
      <App />
    {/* </ConfigProvider> */}
  </StrictMode>
)
```

**¿Por qué el BrowserRouter está en router/index.jsx y no acá?** Porque el router es una responsabilidad separada. `main.jsx` se encarga del tema global y de montar la app. El router decide qué renderizar.

---

# 4️⃣ Crear las vistas (Pages)

Las vistas son los componentes que renderiza cada ruta. Las creamos dentro de `src/pages/`.

Primero, necesitamos el layout que envuelve todas las páginas.

## 4.1 Layout principal

Ant Design viene con un sistema de layout incorporado: `Layout.Header`, `Layout.Sider`, `Layout.Content`, `Layout.Footer`. No necesitás flexbox manual.

Creá `src/layouts/AppLayout.jsx`:

```jsx
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from '../components/AppHeader'
import AppSider from '../components/AppSider'
import AppFooter from '../components/AppFooter'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout>
        <AppSider />
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
      <AppFooter />
    </Layout>
  )
}
```

**Estructura del layout:** `AppHeader` arriba (ancho completo), debajo `AppSider` + contenido lado a lado, `AppFooter` al fondo.

## 4.2 Componentes del layout

**AppHeader** (`src/components/AppHeader.jsx`):

```jsx
import { Layout, Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function AppHeader() {
  return (
    <Header>
      <InboxOutlined style={{ color: '#fff', fontSize: 24, marginRight: 8 }} />
      <Typography.Title level={4} style={{ color: '#fff', margin: 0, display: 'inline' }}>
        Inventario
      </Typography.Title>
    </Header>
  )
}
```

**AppSider** (`src/components/AppSider.jsx`):

```jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  InboxOutlined, ShoppingCartOutlined, TeamOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const menuItems = [
  { key: '/productos', icon: <InboxOutlined />, label: 'Productos' },
  { key: '/ventas', icon: <ShoppingCartOutlined />, label: 'Ventas' },
  { key: '/clientes', icon: <TeamOutlined />, label: 'Clientes' },
]

export default function AppSider() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ height: '100%', borderRight: 0 }}
      />
    </Sider>
  )
}
```

**AppFooter** (`src/components/AppFooter.jsx`):

```jsx
import { Layout, Typography } from 'antd'

const { Footer } = Layout

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: 'center' }}>
      <Typography.Text type="secondary">
        Inventario CRUD &copy;{new Date().getFullYear()} — Bootcamp React
      </Typography.Text>
    </Footer>
  )
}
```

**Resumen del layout:**
- `AppHeader` arriba con `Layout.Header`, ocupa todo el ancho
- `AppSider` + contenido lado a lado con `Layout.Sider` + `Layout.Content`
- `Layout.Sider` tiene width fijo de 200px, el contenido ocupa el resto
- Footer al fondo gracias a `minHeight: '100vh'` en el layout padre
- En el `AppLayout` usamos un `style` mínimo para la altura total — es el único lugar en la app

---

# 5️⃣ Productos — Maquetación (solo UI, nada de lógica)

Primero construimos la interfaz visual. Sin estado, sin funciones, sin guardar nada. Solo maquetamos los componentes.

Creá `src/pages/Productos.jsx`:

```jsx
import {
  Row, Col, Card, Typography, Input, InputNumber, Button,
  Table, Tag, Select, Space, Modal, Divider,
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  InboxOutlined, DollarOutlined, AppstoreOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const CATEGORIAS = [
  'Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros',
]

const COLORES_CATEGORIA = {
  Electrónica: 'blue',
  Ropa: 'pink',
  Alimentos: 'orange',
  Hogar: 'green',
  Otros: 'default',
}

export default function Productos() {
  return (
    <div>
      {/* Stats — hardcodeadas */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Space>
              <InboxOutlined style={{ fontSize: 24, color: '#1677ff' }} />
              <div>
                <Text type="secondary">Productos</Text>
                <Title level={4} style={{ margin: 0 }}>0</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space>
              <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div>
                <Text type="secondary">Valor en stock</Text>
                <Title level={4} style={{ margin: 0 }}>$0</Title>
              </div>
            </Space>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Space>
              <AppstoreOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <div>
                <Text type="secondary">Categorías</Text>
                <Title level={4} style={{ margin: 0 }}>0</Title>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Formulario + Tabla en grid */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Formulario — sin value, sin onChange */}
        <Col span={8}>
          <Card title="Nuevo Producto" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="Nombre del producto" />
              <InputNumber placeholder="Precio" style={{ width: '100%' }} />
              <InputNumber placeholder="Stock" style={{ width: '100%' }} />
              <Select placeholder="Seleccioná una categoría" style={{ width: '100%' }}>
                {CATEGORIAS.map(cat => (
                  <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                ))}
              </Select>
              <Button type="primary" icon={<PlusOutlined />} disabled block>
                Agregar Producto
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Tabla — solo headers, sin datos */}
        <Col span={16}>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Buscar producto..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Select placeholder="Categoría" style={{ width: 140 }} allowClear>
              {CATEGORIAS.map(cat => (
                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
              ))}
            </Select>
          </Space>

          <Table
            dataSource={[]}
            rowKey={(_, index) => index}
            pagination={false}
            size="small"
            locale={{ emptyText: 'Todavía no hay productos registrados' }}
          >
            <Table.Column title="Producto" dataIndex="nombre" key="nombre" />
            <Table.Column title="Precio" dataIndex="precio" key="precio" />
            <Table.Column title="Stock" dataIndex="stock" key="stock" />
            <Table.Column title="Categoría" dataIndex="categoria" key="categoria" />
            <Table.Column title="Acciones" key="acciones" align="right" />
          </Table>
        </Col>
      </Row>
    </div>
  )
}
```

**¿Qué logramos acá?**
- La interfaz completa ya se ve
- Las stats muestran 0 (hardcodeado)
- El formulario tiene los campos pero no funcionan
- La tabla tiene los encabezados y el mensaje de vacío
- El Modal y mensajes no se disparan todavía

Todo es **estático**. No hay `useState`, no hay `onChange`, no hay `guardar`. La UI existe, pero no hace nada. Eso es maquetación pura.

> **Nota sobre Ant Design Table:** En vez de construir filas manualmente con `<tr>` y `<td>`, Ant Design usa el componente `<Table>` con un array de `columns` y otro de `dataSource`. Las columnas se definen con `<Table.Column>` y cada una sabe qué campo mostrar con `dataIndex`. Esto es más declarativo y te ahorra escribir el mapeo manual de celdas.

---

# 6️⃣ Productos — Introducir lógica (useState, handleChange, guardar)

Ahora sí, le ponemos estado al formulario. El formulario "a la antigua": sin magia, sin `Form` de Ant Design. `value` + `onChange`, como se hizo toda la vida.

## 6.1 Estado del formulario

Agregamos `useState` y cambiamos los imports:

```jsx
import { useState } from 'react'
```

El estado del formulario es un solo objeto:

```jsx
const INITIAL_FORM = { nombre: '', precio: '', stock: '', categoria: '' }

export default function Productos() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  // ...
```

## 6.2 HandleChange — la closure

Creamos una función que devuelve otra función. Cada campo llama a `handleChange('suNombre')` y la closure actualiza solo esa propiedad:

```jsx
function handleChange(field) {
  return (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))
}
```

**¿Qué hace?**
- `handleChange('nombre')` devuelve `(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))`
- `{ ...prev, [field]: value }` copia todo el estado anterior y pisa solo el campo que cambió

> **Para Select e InputNumber:** Ant Design pasa el `value` directamente, no un evento. Usamos una función intermedia:
> ```jsx
> function handleSelect(field) {
>   return (value) => setFormData(prev => ({ ...prev, [field]: value }))
> }
> function handleNumber(field) {
>   return (value) => setFormData(prev => ({ ...prev, [field]: value ?? '' }))
> }
> ```
> `value ?? ''` evita que `null` se quede como valor cuando borrás el input.

## 6.3 Guardar en memoria

Agregamos un array de productos en memoria (sin localStorage todavía):

```jsx
const [productos, setProductos] = useState([])
```

Y la función `guardar`:

```jsx
function guardar() {
  const { nombre, precio, stock, categoria } = formData
  if (!nombre.trim() || !precio || !stock || !categoria) return

  setProductos([...productos, {
    nombre: nombre.trim(),
    precio: Number(precio),
    stock: Number(stock),
    categoria,
  }])
  setFormData(INITIAL_FORM)
}
```

- Validación básica: si algún campo está vacío, no hace nada
- Crea un objeto producto con los datos del formulario
- Lo agrega al array con `setProductos([...productos, nuevo])`
- Resetea el formulario

## 6.4 Conectar los campos

Cada `Input` / `InputNumber` / `Select` necesita `value` y `onChange`:

```jsx
<Input
  placeholder="Nombre del producto"
  value={formData.nombre}
  onChange={handleChange('nombre')}
/>
```

```jsx
<InputNumber
  placeholder="Precio"
  value={formData.precio}
  onChange={handleNumber('precio')}
  style={{ width: '100%' }}
/>
```

El `Select` también:

```jsx
<Select
  value={formData.categoria || undefined}
  onChange={handleSelect('categoria')}
  placeholder="Seleccioná una categoría"
  style={{ width: '100%' }}
>
```

El botón ya no está `disabled` y llama a `guardar`:

```jsx
<Button type="primary" icon={<PlusOutlined />} onClick={guardar} block>
  Agregar Producto
</Button>
```

**En este punto:** el formulario funciona, los datos se guardan en memoria, pero al recargar la página se pierden. Eso lo solucionamos en el paso 8 con localStorage.

---

# 7️⃣ Productos — Renderizar datos en la tabla

Ahora que tenemos productos en memoria, los mostramos en la tabla.

## 7.1 Pasar datos a la tabla

Reemplazamos el `<Table>` vacío por uno con datos:

```jsx
<Table
  dataSource={productos}
  rowKey={(_, index) => index}
  pagination={false}
  size="small"
  locale={{ emptyText: 'Todavía no hay productos registrados' }}
>
  <Table.Column title="Producto" dataIndex="nombre" key="nombre" />
  <Table.Column
    title="Precio"
    dataIndex="precio"
    key="precio"
    render={(val) => `$${Number(val).toFixed(2)}`}
  />
  <Table.Column title="Stock" dataIndex="stock" key="stock" />
  <Table.Column
    title="Categoría"
    dataIndex="categoria"
    key="categoria"
    render={(cat) => (
      <Tag color={COLORES_CATEGORIA[cat] || 'default'}>{cat}</Tag>
    )}
  />
  <Table.Column
    title="Acciones"
    key="acciones"
    align="right"
    render={(_, record, index) => (
      <Space>
        <Button type="link" size="small" icon={<EditOutlined />} />
        <Button type="link" size="small" danger icon={<DeleteOutlined />} />
      </Space>
    )}
  />
</Table>
```

- `dataSource={productos}` le pasa los datos a la tabla
- `rowKey={(_, index) => index}` usa el índice como key
- `render` en cada columna permite formatear el valor (precio con `$`, categoría con `Tag`)
- Las acciones reciben `(text, record, index)` donde `record` es el producto y `index` su posición

## 7.2 Stats con useMemo

Actualizamos las stats para que muestren datos reales:

```jsx
import { useState, useMemo } from 'react'

// ...

const stats = useMemo(() => {
  const total = productos.length
  const valorTotal = productos.reduce(
    (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.stock) || 0), 0
  )
  const categorias = new Set(productos.map(p => p.categoria)).size
  return { total, valorTotal, categorias }
}, [productos])
```

Y reemplazamos los valores hardcodeados:

```jsx
<Title level={4} style={{ margin: 0 }}>{stats.total}</Title>
<Title level={4} style={{ margin: 0 }}>${stats.valorTotal.toLocaleString()}</Title>
<Title level={4} style={{ margin: 0 }}>{stats.categorias}</Title>
```

**useMemo** se asegura de que estos cálculos solo se ejecuten cuando cambie `productos`. Si no usáramos `useMemo`, se recalcularían en CADA render (ineficiente).

**Estado actual:** los datos viven en memoria. Al recargar la página, todo se pierde.

---

# 8️⃣ Productos — localStorage (persistencia, editar, eliminar)

## 8.1 Hook useLocalStorage

Creá `src/hooks/useLocalStorage.js`:

```jsx
import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    localStorage.setItem(key, JSON.stringify(valueToStore))
  }

  return [storedValue, setValue]
}
```

**¿Qué hace?**
- Lee `localStorage` al montar el componente
- Si hay datos guardados, los usa; si no, usa el valor inicial
- Cada vez que actualizamos, guarda automáticamente en `localStorage`
- Se usa igual que `useState`: `const [productos, setProductos] = useLocalStorage('productos', [])`

## 8.2 Reemplazar useState por useLocalStorage

Cambiamos el import y la declaración:

```jsx
import { useLocalStorage } from '../hooks/useLocalStorage'

// Reemplazar:
const [productos, setProductos] = useState([])
// Por:
const [productos, setProductos] = useLocalStorage('productos', [])
```

**Eso es todo.** La interfaz del hook es idéntica a `useState`. Los datos ahora persisten entre recargas.

## 8.3 Editar producto

Agregamos estado para controlar la edición:

```jsx
const [editandoIndex, setEditandoIndex] = useState(null)
```

Función para cargar los datos al formulario:

```jsx
function editar(index) {
  const p = productos[index]
  setFormData({
    nombre: p.nombre,
    precio: String(p.precio),
    stock: String(p.stock),
    categoria: p.categoria,
  })
  setEditandoIndex(index)
}
```

Actualizamos `guardar` para que detecte edición:

```jsx
if (editandoIndex !== null) {
  const nuevos = [...productos]
  nuevos[editandoIndex] = { ...nuevos[editandoIndex], ...producto }
  setProductos(nuevos)
} else {
  setProductos([...productos, producto])
}
resetForm()
```

El botón cambia según el modo:

```jsx
<Button type="primary"
  icon={editandoIndex !== null ? <SaveOutlined /> : <PlusOutlined />}
  onClick={guardar} block
>
  {editandoIndex !== null ? 'Actualizar' : 'Agregar'}
</Button>
{editandoIndex !== null && (
  <Button icon={<CloseOutlined />} onClick={resetForm} block>
    Cancelar
  </Button>
)}
```

Conectamos el botón de editar en la tabla:

```jsx
<Button type="link" size="small" icon={<EditOutlined />} onClick={() => editar(index)} />
```

## 8.4 Eliminar producto con confirmación

```jsx
const [deleteIndex, setDeleteIndex] = useState(null)

function eliminar() {
  if (deleteIndex === null) return
  setProductos(productos.filter((_, i) => i !== deleteIndex))
  setDeleteIndex(null)
}
```

Y el Modal:

```jsx
<Modal
  title="Eliminar producto"
  open={deleteIndex !== null}
  onCancel={() => setDeleteIndex(null)}
  footer={[
    <Button key="cancel" onClick={() => setDeleteIndex(null)}>Cancelar</Button>,
    <Button key="delete" type="primary" danger onClick={eliminar}>Eliminar</Button>,
  ]}
>
  <p>
    ¿Eliminar <strong>{deleteIndex !== null ? productos[deleteIndex]?.nombre : ''}</strong>?
    Esta acción no se puede deshacer.
  </p>
</Modal>
```

## 8.5 Búsqueda y filtro

Agregamos los estados:

```jsx
const [search, setSearch] = useState('')
const [filtroCategoria, setFiltroCategoria] = useState(undefined)
```

Y los datos derivados con `useMemo`:

```jsx
const productosFiltrados = useMemo(() => {
  return productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filtroCategoria || p.categoria === filtroCategoria
    return matchSearch && matchCat
  })
}, [productos, search, filtroCategoria])
```

Conectamos los inputs de búsqueda:

```jsx
<Input
  placeholder="Buscar producto..."
  prefix={<SearchOutlined />}
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ width: 200 }}
/>
<Select
  placeholder="Categoría"
  value={filtroCategoria}
  onChange={setFiltroCategoria}
  style={{ width: 140 }}
  allowClear
>
  {CATEGORIAS.map(cat => (
    <Select.Option key={cat} value={cat}>{cat}</Select.Option>
  ))}
</Select>
```

Y la tabla itera sobre `productosFiltrados` pero obtiene el índice real con `productos.indexOf(record)`:

```jsx
<Table
  dataSource={productosFiltrados}
  rowKey={(_, index) => index}
  pagination={false}
  size="small"
  locale={{ emptyText: 'Todavía no hay productos registrados' }}
>
  <Table.Column title="Producto" dataIndex="nombre" key="nombre" />
  <Table.Column
    title="Precio"
    dataIndex="precio"
    key="precio"
    render={(val) => `$${Number(val).toFixed(2)}`}
  />
  <Table.Column title="Stock" dataIndex="stock" key="stock" />
  <Table.Column
    title="Categoría"
    dataIndex="categoria"
    key="categoria"
    render={(cat) => (
      <Tag color={COLORES_CATEGORIA[cat] || 'default'}>{cat}</Tag>
    )}
  />
  <Table.Column
    title="Acciones"
    key="acciones"
    align="right"
    render={(_, record) => {
      const realIndex = productos.indexOf(record)
      return (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => editar(realIndex)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => setDeleteIndex(realIndex)} />
        </Space>
      )
    }}
  />
</Table>
```

**¿Por qué `realIndex`?** Cuando buscás o filtrás, el índice del array filtrado NO coincide con el índice del array original. `productos.indexOf(record)` te da la posición verdadera para editar/eliminar el producto correcto.

## 8.6 message para feedback

Ant Design tiene `message` como función imperativa — no necesitás estado ni componente:

```jsx
import { message } from 'antd'

// En guardar:
message.success('Producto registrado')

// En validación:
message.warning('Completá todos los campos')

// En eliminar:
message.success('Producto eliminado')
```

**¿Por qué imperativo?** Porque es más simple. Llamás `message.success('texto')` y aparece un toast en la esquina superior. No necesitás estado ni JSX para el Snackbar.

---

# 9️⃣ Ventas — Misma secuencia (maquetación → lógica → tabla → persistencia)

Aplicamos el mismo enfoque incremental que en Productos.

## 9.1 Maquetación

Creá `src/pages/Ventas.jsx` con toda la UI pero sin lógica:

- Stats cards: "Ventas hoy 0" y "Total vendido $0.00"
- Select de producto (sin opciones por ahora)
- Campo de cantidad
- Botón "Agregar" deshabilitado
- Panel de carrito con mensaje "vacío"
- Historial de ventas con tabla vacía

## 9.2 Lógica (useState)

Agregamos el estado para el carrito:

```jsx
import { useState, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Ventas() {
  const [productos] = useLocalStorage('productos', [])
  const [ventas, setVentas] = useLocalStorage('ventas', [])
  const [productoSeleccionado, setProductoSeleccionado] = useState(undefined)
  const [cantidad, setCantidad] = useState(1)
  const [carrito, setCarrito] = useState([])
  // ...
```

**¿Por qué `undefined` como valor inicial del Select?** Ant Design trata `undefined` como "sin selección", y muestra el placeholder. No tenés el bug del `0` como en MUI porque Ant Design maneja `undefined` correctamente.

## 9.3 Agregar y sacar del carrito

```jsx
function quitarDelCarrito(index) {
  setCarrito(carrito.filter((_, i) => i !== index))
}

function agregarAlCarrito() {
  if (productoSeleccionado === undefined) {
    message.warning('Seleccioná un producto')
    return
  }

  const producto = productoSeleccionado
  if (!producto) return

  if (cantidad > producto.stock) {
    message.warning(`Stock insuficiente (disponible: ${producto.stock})`)
    return
  }

  const existente = carrito.findIndex(item => item.productoIndex === productos.indexOf(producto))
  if (existente >= 0) {
    const nuevos = [...carrito]
    nuevos[existente].cantidad += cantidad
    setCarrito(nuevos)
  } else {
    setCarrito([
      ...carrito,
      { productoIndex: productos.indexOf(producto), cantidad, precioUnitario: Number(producto.precio), nombre: producto.nombre },
    ])
  }

  setProductoSeleccionado(undefined)
  setCantidad(1)
}
```

## 9.4 Tabla del carrito (renderizar items)

En lugar de `<Paper>`, usamos `<Card>`:

```jsx
<Card title={`Carrito (${carrito.length})`} size="small">
  {carrito.length === 0 ? (
    <Text type="secondary">El carrito está vacío</Text>
  ) : (
    carrito.map((item, index) => (
      <Card key={index} size="small" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text strong>{item.nombre}</Text>
            <br />
            <Text type="secondary">
              ${item.precioUnitario.toFixed(2)} x {item.cantidad}
            </Text>
            <br />
            <Text strong>${(item.precioUnitario * item.cantidad).toFixed(2)}</Text>
          </div>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => quitarDelCarrito(index)}
          />
        </div>
      </Card>
    ))
  )}

  <Divider />
  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
    <Text strong>Total:</Text>
    <Text strong>${totalCarrito.toFixed(2)}</Text>
  </Space>
  <Button type="primary" block style={{ marginTop: 8 }} onClick={finalizarVenta}>
    Finalizar Venta
  </Button>
</Card>
```

## 9.5 Finalizar venta (descuenta stock)

```jsx
function finalizarVenta() {
  if (carrito.length === 0) return

  // 1. Descontar stock
  const nuevosProductos = [...productos]
  carrito.forEach(item => {
    nuevosProductos[item.productoIndex] = {
      ...nuevosProductos[item.productoIndex],
      stock: nuevosProductos[item.productoIndex].stock - item.cantidad,
    }
  })
  localStorage.setItem('productos', JSON.stringify(nuevosProductos))

  // 2. Guardar venta en el historial
  const venta = {
    items: carrito.map(item => ({
      productoIndex: item.productoIndex,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario,
    })),
    total: totalCarrito,
    fecha: new Date().toISOString(),
  }

  setVentas([...ventas, venta])
  setCarrito([])
  message.success(`Venta finalizada — $${totalCarrito.toFixed(2)}`)
}
```

**Flujo completo de una venta:**
1. El usuario selecciona producto y cantidad
2. Se agrega al carrito (con validación de stock)
3. El carrito muestra subtotales y total
4. Al finalizar, se descuenta el stock y se guarda la venta
5. El carrito se vacía y el historial se actualiza

## 9.6 Historial de ventas

```jsx
<Table
  dataSource={[...ventas].reverse()}
  rowKey={(_, index) => index}
  pagination={false}
  size="small"
  locale={{ emptyText: 'No hay ventas registradas' }}
>
  <Table.Column
    title="Fecha"
    dataIndex="fecha"
    key="fecha"
    render={(val) => new Date(val).toLocaleDateString('es-AR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })}
  />
  <Table.Column
    title="Productos"
    key="items"
    render={(_, record) => `${record.items.length} ítem(s)`}
  />
  <Table.Column
    title="Total"
    dataIndex="total"
    key="total"
    align="right"
    render={(val) => `$${val.toFixed(2)}`}
  />
</Table>
```

**`[...ventas].reverse()`** muestra las ventas más recientes primero sin mutar el array original.

---

## 🧠 Resumen de conceptos clave

| Concepto | Cómo lo aplicamos |
|----------|-------------------|
| **Maquetación primero** | Construimos la UI completa antes de agregar lógica |
| **Formulario "a la antigua"** | `useState` + `handleChange` + `value`/`onChange`, sin `Form` de Ant Design |
| **Closure pattern** | `handleChange(field) { return (e) => setState(prev => ({...prev, [field]: e.target.value })) }` |
| **Índice como ID** | El índice del array es el identificador (sin IDs generados) |
| **useMemo** | Stats y filtros que no se recalculan en cada render |
| **useLocalStorage** | Hook custom con interfaz idéntica a `useState` |
| **Mismo patrón en Ventas** | `undefined` como valor inicial del Select, carrito en memoria, descuenta stock al finalizar |
| **Desktop-only** | Sin responsive, sin menú hamburguesa, Row/Col con solo `span` |
| **Props nativas** | `type`, `size`, `variant` — sin CSS |
| **message imperativo** | `message.success()` en vez de componente Snackbar |
| **Layout de Antd** | `Layout.Header` + `Layout.Sider` + `Layout.Content` + `Layout.Footer` |
| **Table declarativa** | `<Table>` con `dataSource` y `<Table.Column>`, sin celdas manuales |

