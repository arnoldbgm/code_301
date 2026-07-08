# 🧠 Guia — Next.js 16 + TypeScript + Prisma

<p align="center">
  <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" height="80">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" height="80">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" height="80">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/prisma/2D3748" alt="Prisma" height="80">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/postman/FF6C37" alt="Postman" height="70">
</p>

Buenas causa. Bienvenido al curso donde dejas de hacer "páginas" y empezás a hacer **aplicaciones reales**. Ya sabés HTML, CSS, JavaScript y React — perfecto, porque acá construimos sobre eso, no desde cero.

Vamos a crear un backend propio con base de datos real, conectarlo con un frontend moderno, y pasar por TODO el flujo de una aplicación profesional. Nada de código de juguete.

Reglas de la casa antes de empezar:

- Todo se prueba en **Postman** apenas creás un endpoint. No hay "ya después lo pruebo". Se prueba YA.
- Nada de atajos raros: acá escribimos código explícito, con `for` tradicional y variables acumuladoras. Si algo se puede escribir en 3 líneas crípticas o en 10 líneas claras, elegimos las 10. Tiene que **verse** qué está pasando.
- Las validaciones se hacen con `try/catch`, no con trucos caseros.
- Cada tema tiene una **Demo** (yo codeo, la solución queda a la vista) y un **Reto** (lo intentás vos, la solución está oculta en un desplegable — no la mires antes de sudar un rato).

Dale, arrancamos.

---

## 0. Setup — crear el proyecto desde cero

Antes de escribir UNA sola línea de lógica, necesitamos el proyecto parado. Si no sabés hacer esto sin ayuda, aprendételo de memoria porque lo vas a hacer cientos de veces en tu carrera.

```bash
npx create-next-app@latest nextjs-prisma --typescript --tailwind --eslint --app --src-dir
```

| Flag | Que hace |
|------|----------|
| `--typescript` | TypeScript configurado y listo |
| `--tailwind` | Tailwind CSS incluido |
| `--eslint` | ESLint con reglas de Next.js |
| `--app` | App Router (NO el pages router viejo) |
| `--src-dir` | Codigo dentro de `src/`, mas ordenado |

```bash
cd nextjs-prisma
```

**Tailwind CSS v4 ya viene configurado.** No necesitás `tailwind.config.js`. El archivo `src/app/globals.css` importa Tailwind directo:

```css
/* src/app/globals.css */
@import "tailwindcss";
```

Y el PostCSS (`postcss.config.mjs`) usa el plugin `@tailwindcss/postcss`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

No toques estos archivos. Ya están listos. Las clases de Tailwind (como `px-2`, `bg-blue-500`, `text-red-500`) funcionan en cualquier componente del proyecto sin configuración extra.

```bash
npm run dev
```

Andá a `http://localhost:3000`. Si ves la página de bienvenida de Next.js, estás listo. No sigas hasta que tengas eso funcionando.

**Estructura del proyecto:**

```
src/
  app/
    layout.tsx       → layout raiz (header, footer, etc.)
    page.tsx         → pagina de inicio
    globals.css      → estilos globales (Tailwind v4 importado aca)
```

---

## 1. El App Router de Next.js

<p align="center">
  <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" height="50">
</p>

### Que es y por que existe?

Next.js tiene DOS formas de organizar rutas: el **Pages Router** (viejo, basado en archivos dentro de `pages/`) y el **App Router** (el actual, basado en carpetas dentro de `app/`). Aca SOLO usamos App Router. Es el estandar profesional desde 2024.

La idea es simple: **cada carpeta dentro de `app/` es un segmento de ruta**, y el archivo `page.tsx` dentro de esa carpeta es lo que se renderiza en esa URL.

```
src/app/
  page.tsx          → ruta "/"
  productos/
    page.tsx        → ruta "/productos"
    [id]/
      page.tsx      → ruta "/productos/123" (ruta dinamica)
  layout.tsx         → envuelve TODO lo de adentro
```

Archivos especiales que tenes que conocer:

| Archivo | Responsabilidad |
|---------|---------------|
| `page.tsx` | Define el contenido visible de una ruta |
| `layout.tsx` | Envuelve paginas hijas, se mantiene entre navegaciones (header, sidebar) |
| `loading.tsx` | Se muestra mientras la pagina carga datos |

### Demo (A) — Estructura basica

Creamos un layout raiz que envuelve todo, y dos paginas.

```tsx
// src/app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header>
          <h1>Mi Curso de Next.js 16</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
```

```tsx
// src/app/page.tsx
export default function HomePage() {
  return <p>Bienvenido a la pagina de inicio.</p>;
}
```

```tsx
// src/app/productos/page.tsx
export default function ProductosPage() {
  return <p>Acá van a estar los productos.</p>;
}
```

Corrés `npm run dev`, entrás a `localhost:3000` y después a `localhost:3000/productos`. Fíjate cómo el header del `layout.tsx` aparece en las dos rutas — el layout envuelve todo, no se redibuja al navegar.

### Reto (B) — Ruta contacto + ruta dinamica

Crea una ruta `/contacto` que muestre un formulario simple (solo HTML, sin lógica) y una ruta dinámica `/productos/[id]` que muestre el ID que viene en la URL.

**IMPORTANTE para Next.js 16:** los `params` ahora son `Promise`, hay que usar `await`.

<details>
<summary>Ver solucion</summary>

```tsx
// src/app/contacto/page.tsx
export default function ContactoPage() {
  return (
    <form>
      <label htmlFor="nombre">Nombre</label>
      <input id="nombre" name="nombre" type="text" />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

```tsx
// src/app/productos/[id]/page.tsx
export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <p>Estas viendo el producto con id: {id}</p>;
}
```

</details>

### Errores comunes

- Poner `page.tsx` fuera de una carpeta con el nombre correcto y preguntarse por qué no aparece la ruta.
- Olvidar que `layout.tsx` necesita renderizar `{children}` — sin eso no se ve nada.
- Confundir carpetas normales con carpetas de ruta dinámica `[id]` (los corchetes son obligatorios, no decorativos).
- **En Next.js 16:** olvidar `await params` — si accedés a `params.id` sin await, TypeScript te marca error y la app falla en runtime.

### Resumen del bloque

- El App Router usa carpetas dentro de `app/` como rutas.
- `page.tsx` es el contenido visible, `layout.tsx` es el envoltorio persistente.
- Las rutas dinámicas se crean con `[nombre]` y los params se leen con `await`.

---

## 2. Consumir APIs con `fetch`

### Que es y por que es util?

Tu aplicación Next.js puede pedirle datos a otras APIs del mundo. Como los componentes corren en el servidor, el `fetch` se hace desde ahí — sin exponer nada al navegador y sin los problemas de CORS que tenías en React puro.

**Profe dice:** "En React puro, el navegador hace el fetch, muestra un loader, espera, y recién ahí pinta los datos. Acá es al revés: el servidor hace el fetch, arma el HTML completo con los datos, y te lo manda listo. La página llega terminada al navegador."

Next.js extiende el `fetch` nativo con opciones de caché:

```ts
fetch(url, { cache: "force-cache" });  // cachea siempre (default)
fetch(url, { cache: "no-store" });     // nunca cachea, siempre fresco
fetch(url, { next: { revalidate: 60 } }); // cachea pero revalida cada 60s
```

### Demo (A) — Productos desde FakeStore API

Vamos a usar la API pública [FakeStore API](https://fakestoreapi.com/products) que devuelve productos reales con título, precio, imagen, categoría y rating. Podés pegarle a la URL desde el navegador para ver la respuesta completa.

```tsx
// src/app/productos/page.tsx
interface Producto {
  id: number;
  title: string;
  price: number;
}

async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener los productos");
  }

  const datos: Producto[] = await respuesta.json();
  return datos;
}

export default async function ProductosPage() {
  try {
    const productos = await obtenerProductos();

    return (
      <ul>
        {productos.map((p) => (
          <li key={p.id}>
            {p.title} — S/ {p.price}
          </li>
        ))}
      </ul>
    );
  } catch {
    return <p>No se pudieron cargar los productos.</p>;
  }
}
```

Fíjate en lo que NO usamos: no hay `useEffect`, no hay `useState`, no hay `isLoading`. El componente es `async` y hace `await` directo. Eso es posible porque esto corre en el servidor, no en el navegador (ya vamos a ver qué significa exactamente esto).

**Profe dice:** "Abri `https://fakestoreapi.com/products` en el navegador, despues corre la pagina. La respuesta es EXACTAMENTE la misma."

### Reto (B) — Producto individual por ID

Crea una ruta dinámica `/productos/[id]` que consuma `https://fakestoreapi.com/products/{id}` y muestre el título, precio, categoría y una imagen.

<details>
<summary>Ver solucion</summary>

```tsx
// src/app/productos/[id]/page.tsx
interface Producto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

async function obtenerProducto(id: string): Promise<Producto> {
  const respuesta = await fetch(`https://fakestoreapi.com/products/${id}`, {
    cache: "no-store",
  });
  if (!respuesta.ok) {
    throw new Error("Producto no encontrado");
  }
  return respuesta.json();
}

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const producto = await obtenerProducto(id);

    return (
      <div>
        <h2>{producto.title}</h2>
        <p>Precio: S/ {producto.price}</p>
        <p>Categoria: {producto.category}</p>
        <img src={producto.image} alt={producto.title} width="200" />
      </div>
    );
  } catch {
    return <p>Producto no encontrado.</p>;
  }
}
```

**Probá:** `http://localhost:3000/productos/1` y `http://localhost:3000/productos/5`

</details>

### Errores comunes

- Olvidar que `fetch` en el servidor NO tiene CORS (los alumnos vienen de hacer fetch en el navegador y se confunden).
- No verificar `respuesta.ok` y asumir que `.json()` siempre funciona.
- Usar `cache: "force-cache"` (el default) para datos cambiantes, y preguntarse por qué la info está "vieja".

### Resumen del bloque

- Los componentes de Next.js son Server Components por defecto: corren en el servidor.
- Pueden usar `async/await` directo para hacer `fetch` sin `useEffect`.
- Next.js agrega opciones de caché: `force-cache`, `no-store`, `revalidate`.

---

## 3. Crear endpoints propios con `route.ts`

### Que es y por que ahora cambia todo?

Hasta ahora consumimos APIs de otros. Ahora vamos a crear las NUESTRAS.

**Profe dice:** "Hasta acá fuimos clientes. Ahora somos dueños del negocio. Vamos a crear nuestra propia API, con nuestros datos, nuestras reglas."

En Next.js, un endpoint se define con un archivo llamado exactamente `route.ts` dentro de una carpeta bajo `app/api/`.

```
src/app/
  api/
    productos/
      route.ts     → maneja /api/productos (GET, POST, etc.)
```

Dentro de `route.ts` exportás funciones con el nombre del método HTTP: `GET`, `POST`, `PUT`, `DELETE`. Cada función recibe la petición y devuelve una respuesta JSON.

### Demo (A) — GET y POST con datos en memoria

**Profe dice:** "Primero guardamos datos en un arreglo en memoria. Después le metemos base de datos. Paso a paso."

```ts
// src/app/api/productos/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Producto {
  id: number;
  title: string;
  price: number;
}

let productos: Producto[] = [
  { id: 1, title: "Fjallraven Backpack", price: 109.95 },
  { id: 2, title: "Mens Casual T-Shirt", price: 22.30 },
];

export async function GET() {
  return NextResponse.json(productos);
}

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json();
    if (!cuerpo.title || !cuerpo.price) {
      return NextResponse.json(
        { error: "Los campos title y price son obligatorios" },
        { status: 400 }
      );
    }
    const nuevoId = productos.length > 0
      ? productos[productos.length - 1].id + 1
      : 1;
    const nuevoProducto: Producto = {
      id: nuevoId,
      title: cuerpo.title,
      price: cuerpo.price,
    };
    productos.push(nuevoProducto);
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la peticion invalido" },
      { status: 400 }
    );
  }
}
```

**CUANDO CREAS ESTE ENDPOINT, LO PRIMERO QUE HACES ES ABRIR POSTMAN.** No lo consumas desde el navegador todavía. Postman primero, siempre.

| Metodo | URL | Body | Codigo esperado |
|--------|-----|------|:----------------:|
| `GET` | `http://localhost:3000/api/productos` | - | 200 — arreglo con 2 productos |
| `POST` | `http://localhost:3000/api/productos` | `{"title": "Monitor 24", "price": 599}` | 201 — producto creado |
| `POST` | `http://localhost:3000/api/productos` | `{}` | 400 — "title y price son obligatorios" |

### Reto (B) — Agregar ruta dinamica con PUT y DELETE

Crea `src/app/api/productos/[id]/route.ts` con `GET`, `PUT` y `DELETE`. Los datos se siguen guardando en el arreglo en memoria.

**RECORDATORIO:** en Next.js 16 los `params` son `Promise`. Hay que `await`earlos.

<details>
<summary>Ver solucion</summary>

```ts
// src/app/api/productos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Producto {
  id: number;
  title: string;
  price: number;
}

let productos: Producto[] = [
  { id: 1, title: "Fjallraven Backpack", price: 109.95 },
  { id: 2, title: "Mens Casual T-Shirt", price: 22.30 },
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const producto = productos.find((p) => p.id === Number(id));
    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(producto);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cuerpo = await request.json();
    if (!cuerpo.title) {
      return NextResponse.json(
        { error: "El campo title es obligatorio" },
        { status: 400 }
      );
    }
    const producto = productos.find((p) => p.id === Number(id));
    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    producto.title = cuerpo.title;
    if (cuerpo.price) producto.price = cuerpo.price;
    return NextResponse.json({ mensaje: "Producto actualizado" });
  } catch {
    return NextResponse.json(
      { error: "Cuerpo de la peticion invalido" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const indice = productos.findIndex(p => p.id === Number(id));
    if (indice === -1) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    productos.splice(indice, 1);
    return NextResponse.json({ mensaje: "Producto eliminado" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
```

**Probá todo en Postman:**

| Metodo | URL | Body | Codigo |
|--------|-----|------|:------:|
| `GET` | `/api/productos/1` | - | 200 |
| `GET` | `/api/productos/99` | - | 404 |
| `PUT` | `/api/productos/1` | `{"title": "Fjallraven Backpack Pro", "price": 129.95}` | 200 |
| `DELETE` | `/api/productos/2` | - | 200 |

</details>

### Errores comunes

- Nombrar el archivo `routes.ts` o `index.ts` en vez de `route.ts` — el endpoint no responde.
- Olvidar `await request.json()` y tratar de leer el body directo.
- No devolver códigos de status correctos (`400`, `404`, `500` segun corresponda).
- En Next.js 16: no `await`ear los `params` — TypeError en runtime.

### Resumen del bloque

- `route.ts` define un endpoint; exportás `GET`, `POST`, `PUT`, `DELETE`.
- Todo endpoint se prueba PRIMERO en Postman.
- Las validaciones van con `try/catch` y códigos de status apropiados.

---

## 4. Server Components vs Client Components

### Que son y por que importan AHORA?

Hasta acá escribiste componentes con `async/await`, `fetch` directo, `for` loops... y todo funcionó. Sabés por qué? Porque **todo componente en el App Router es un Server Component por defecto**.

**Profe dice:** "Hasta ahora no necesitaste interactividad. Pero ahora vas a querer un boton que haga algo cuando le haces click, o un input que guarde lo que escribis. Ahi te va a explotar. Y justo por eso existe esta distincion."

Un **Server Component** se ejecuta en el servidor. Su JavaScript NUNCA llega al navegador. Puede consultar la base de datos, leer archivos, hacer fetch directo.

Un **Client Component** se ejecuta en el navegador. Necesita `"use client"` en la primera linea. Puede usar `useState`, `useEffect`, `onClick`, `onSubmit`.

| | Server Component | Client Component |
|---|---|---|
| Donde corre | Servidor | Navegador |
| Puede usar `useState` / `useEffect` | No | Si |
| Puede hacer `fetch` a BD directo | Si | No (necesita endpoint) |
| Afecta el bundle de JS del usuario | No | Si, suma peso |
| Puede usar `async/await` directo | Si | No |

**Profe dice:** "Server Component es el default. Solo bajas a Client Component la parte MINIMA que necesita interactividad. No marques todo como `'use client'` por flojo."

### Demo (A) — Server Component puro + Client Component

```tsx
// src/app/productos/page.tsx (Server Component)
async function obtenerProductos() {
  return [
    { id: 1, title: "Fjallraven Backpack", price: 109.95 },
    { id: 2, title: "Mens Casual T-Shirt", price: 22.30 },
  ];
}

export default async function ProductosPage() {
  const productos = await obtenerProductos();
  return <ul>{productos.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

Ahora queremos un boton con `useState`. Necesita ser Client Component:

```tsx
// src/components/BotonAgregarCarrito.tsx
"use client";
import { useState } from "react";

export default function BotonAgregarCarrito() {
  const [agregado, setAgregado] = useState(false);
  function manejarClick() {
    setAgregado(true);
  }
  return (
    <button onClick={manejarClick}>
      {agregado ? "Agregado!" : "Agregar al carrito"}
    </button>
  );
}
```

**Profe dice:** "El Server Component se encarga de los datos. El Client Component se encarga de la interaccion. Cada uno hace lo que sabe hacer."

### Reto (B) — Server + Client combinados

Toma el `ProductosPage` y agregale `BotonAgregarCarrito` a cada producto. La pagina SIGUE siendo Server Component.

<details>
<summary>Ver solucion</summary>

```tsx
import BotonAgregarCarrito from "@/components/BotonAgregarCarrito";

async function obtenerProductos() {
  return [
    { id: 1, title: "Fjallraven Backpack", price: 109.95 },
    { id: 2, title: "Mens Casual T-Shirt", price: 22.30 },
  ];
}

export default async function ProductosPage() {
  const productos = await obtenerProductos();
  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>
          {p.title}
          <BotonAgregarCarrito />
        </li>
      ))}
    </ul>
  );
}
```

</details>

### Errores comunes

- Poner `"use client"` en el layout raiz — perdes TODOS los beneficios de rendimiento.
- Intentar usar `useState` en un Server Component — error de compilacion.
- Consultar la BD dentro de un Client Component — no se puede, necesitas un endpoint.

### Resumen del bloque

- Server Component es el default: rapido, seguro, cero JS extra al cliente.
- Client Component es la excepcion: solo para lo que necesita interactividad.
- Se marca con `"use client"` en la primera linea del archivo.

---

## 5. Frontend — consumir la API desde la interfaz

### Que es y por que ahora?

Ya tenes una API funcionando. La probaste en Postman y funciona. Ahora conectamos el frontend.

Regla simple:
- **Leer datos**: Server Component con `fetch` a tu propia API.
- **Crear o eliminar**: Client Component con `fetch` en un evento.

**Profe dice:** "Los datos se leen desde el servidor. Las acciones se ejecutan desde el navegador. Cada cosa en su lugar."

### Demo (A) — Lista de productos + formulario

Server Component que lee productos:

```tsx
// src/app/productos/page.tsx
import FormularioProducto from "@/components/FormularioProducto";

interface Producto {
  id: number;
  title: string;
  price: number;
}

async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch("http://localhost:3000/api/productos", {
    cache: "no-store",
  });
  if (!respuesta.ok) {
    throw new Error("Error al obtener productos");
  }
  return respuesta.json();
}

export default async function ProductosPage() {
  let productos: Producto[] = [];
  try {
    productos = await obtenerProductos();
  } catch {
    return (
      <p className="text-red-500">
        Error al cargar productos. Verifica que el servidor este corriendo.
      </p>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Productos</h2>
      <ul className="mb-6">
        {productos.map((p) => (
          <li key={p.id} className="py-1">
            {p.title} — S/ {p.price}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold mb-2">Agregar producto</h3>
      <FormularioProducto />
    </div>
  );
}
```

Client Component con formulario:

```tsx
// src/components/FormularioProducto.tsx
"use client";
import { useState } from "react";

export default function FormularioProducto() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  async function manejarEnvio(evento: React.FormEvent) {
    evento.preventDefault();
    try {
      const respuesta = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, price: Number(price) }),
      });
      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || "No se pudo crear");
      }
      setTitle("");
      setPrice("");
      setError("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="flex gap-2 items-end">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input id="title" value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Teclado RGB"
          className="border px-3 py-2 rounded" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium">Price</label>
        <input id="price" value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej: 99.99"
          type="number" step="0.01"
          className="border px-3 py-2 rounded" />
      </div>
      <button type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Crear
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
```

**Profe dice:** "Server Component usa URL absoluta (`http://localhost:3000/...`) porque corre en el servidor. Client Component usa ruta relativa (`/api/...`) porque corre en el navegador."

### Reto (B) — Boton eliminar

Agrega un boton "Eliminar" a cada producto usando `DELETE /api/productos/{id}`.

<details>
<summary>Ver solucion</summary>

```tsx
// src/components/BotonEliminarProducto.tsx
"use client";

export default function BotonEliminarProducto({ id }: { id: number }) {
  async function manejarClick() {
    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!respuesta.ok) throw new Error("No se pudo eliminar");
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    }
  }
  return (
    <button onClick={manejarClick}
      className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600 ml-2">
      Eliminar
    </button>
  );
}
```

Y en `ProductosPage`, importalo y agregalo dentro del `.map()`:

```tsx
import BotonEliminarProducto from "@/components/BotonEliminarProducto";
// dentro del .map():
<li key={p.id} className="py-1">
  {p.title} — S/ {p.price}
  <BotonEliminarProducto id={p.id} />
</li>
```

</details>

### Errores comunes

- Olvidar `"Content-Type": "application/json"` en el `fetch` POST.
- Confundir URL absoluta (Server Component) con relativa (Client Component).
- Poner `"use client"` en toda la pagina en vez de aislar solo el componente interactivo.

### Resumen del bloque

- Lectura: Server Component + `fetch` a tu API.
- Escritura: Client Component + `fetch` en evento.
- URL absoluta en servidor, relativa en navegador.
- Todo `fetch` envuelto en `try/catch`.

---

## 6. Base de datos con Prisma

<p align="center">
  <img src="https://cdn.simpleicons.org/prisma/2D3748" alt="Prisma" height="50">
</p>

### Que es Prisma y por que ahora?

Los productos viven en un arreglo en memoria. Apenas reinicias el servidor, todo desaparece. Eso no es una aplicación real.

**Prisma** es un ORM: te deja hablarle a tu base de datos con TypeScript en vez de SQL.

Tres piezas:
1. **Schema** — describis tus tablas como modelos.
2. **Migraciones** — Prisma traduce el schema a SQL y lo ejecuta.
3. **Prisma Client** — cliente autogenerado para consultar.

### Instalacion

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Crea `prisma/schema.prisma` y `.env` con `DATABASE_URL`.

### Configuracion

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/mi_base"
```

Usa PostgreSQL local, Neon, Supabase o Railway.

### Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Producto {
  id        Int      @id @default(autoincrement())
  title     String
  price     Float
  creadoEn  DateTime @default(now())
}
```

### Migraciones

```bash
npx prisma migrate dev --name crear_producto
```

### Prisma Client

```ts
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### Reto (B) — Modelo Categoria

Agrega `Categoria` con `id` y `nombre`. Corre la migracion.

<details>
<summary>Ver solucion</summary>

```prisma
model Categoria {
  id     Int    @id @default(autoincrement())
  nombre String
}
```

```bash
npx prisma migrate dev --name crear_categoria
```

</details>

### Errores comunes

- Crear `new PrismaClient()` en cada archivo — se agotan las conexiones.
- Olvidar `npx prisma migrate dev` despues de editar el schema.
- Poner la contraseña directo en el schema en vez de `.env`.

### Resumen del bloque

- Prisma = schema + migraciones + client.
- El client se instancia UNA sola vez.

---

## 7. CRUD con Prisma

| Operacion | Metodo |
|-----------|--------|
| Leer todos | `findMany()` |
| Leer uno | `findUnique()` |
| Crear | `create()` |
| Actualizar | `update()` |
| Eliminar | `delete()` |

### Demo (A) — Las 5 operaciones

```ts
import { prisma } from "@/lib/prisma";

async function listarProductos() {
  return await prisma.producto.findMany();
}

async function obtenerProductoPorId(id: number) {
  return await prisma.producto.findUnique({ where: { id } });
}

async function crearProducto(title: string, price: number) {
  return await prisma.producto.create({ data: { title, price } });
}

async function actualizarProducto(id: number, title: string, price?: number) {
  const data: { title?: string; price?: number } = { title };
  if (price !== undefined) data.price = price;
  return await prisma.producto.update({ where: { id }, data });
}

async function eliminarProducto(id: number) {
  return await prisma.producto.delete({ where: { id } });
}
```

### Reto (B) — Busqueda por nombre

Usa `findMany` con `contains`.

<details>
<summary>Ver solucion</summary>

```ts
async function buscarProductosPorNombre(texto: string) {
  try {
    return await prisma.producto.findMany({
      where: { title: { contains: texto } },
    });
  } catch {
    throw new Error("Error al buscar productos");
  }
}
```

</details>

---

## 8. Conectar Prisma con los endpoints

Ahora reemplazamos el arreglo en memoria por Prisma. **El frontend no cambia.**

### Demo (A) — GET y POST con Prisma

```ts
// src/app/api/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json();
    if (!cuerpo.title || !cuerpo.price) {
      return NextResponse.json(
        { error: "Los campos title y price son obligatorios" },
        { status: 400 }
      );
    }
    const nuevoProducto = await prisma.producto.create({
      data: { title: cuerpo.title, price: Number(cuerpo.price) },
    });
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
```

**Profe dice:** "La API responde IGUAL que antes. El frontend ni se entera de que cambiamos la implementacion. Esa es la magia de una API bien disenada."

Verificá con Postman:

| Metodo | URL | Body | Codigo |
|-------|-----|------|:------:|
| `GET` | `/api/productos` | - | 200 |
| `POST` | `/api/productos` | `{"title": "Monitor 24", "price": 599}` | 201 |

Y con `npx prisma studio` los ves en la BD.

### Reto (B) — Endpoint dinamico con Prisma

Crea `src/app/api/productos/[id]/route.ts` con `GET`, `PUT` y `DELETE` usando Prisma.

<details>
<summary>Ver solucion</summary>

```ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });
    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(producto);
  } catch {
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cuerpo = await request.json();
    const productoActualizado = await prisma.producto.update({
      where: { id: Number(id) },
      data: { title: cuerpo.title, price: cuerpo.price },
    });
    return NextResponse.json(productoActualizado);
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.producto.delete({ where: { id: Number(id) } });
    return NextResponse.json({ mensaje: "Producto eliminado" });
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}
```

</details>

---

## Que construiste?

```
src/app/productos/page.tsx        → Server Component: lista
src/app/api/productos/route.ts    → GET + POST con Prisma
src/app/api/productos/[id]/route.ts → GET + PUT + DELETE con Prisma
src/components/FormularioProducto.tsx → Client Component: crear
src/components/BotonEliminarProducto.tsx → Client Component: eliminar
prisma/schema.prisma              → Modelos Producto y Categoria
src/lib/prisma.ts                 → Instancia unica de Prisma Client
```

**Hiciste:** App Router, fetch a APIs externas, API propia, Server/Client Components, frontend conectado, Prisma con BD real, y migracion de memoria a persistencia.

---

## Tabla resumen

| Bloque | Concepto clave | Archivos |
|--------|---------------|----------|
| 0 | Setup | `create-next-app`, Tailwind v4 |
| 1 | App Router | `page.tsx`, `layout.tsx`, `[id]` |
| 2 | Consumir APIs externas | `fetch` + `try/catch` |
| 3 | Endpoints propios | `route.ts` + Postman |
| 4 | Server vs Client Components | `"use client"` |
| 5 | Frontend conectado | Server (leer) + Client (escribir) |
| 6 | Prisma | schema + migrations + client |
| 7 | CRUD con Prisma | `findMany`, `create`, `update`, `delete` |
| 8 | Prisma + endpoints | Memoria → BD real |

---

<sub>Iconos: Simple Icons. Logos usados solo con fines educativos.</sub>