# 🎓 Curso Full Stack: Next.js + TypeScript + Prisma

![Next.js](https://cdn.simpleicons.org/nextdotjs/000000) ![TypeScript](https://cdn.simpleicons.org/typescript/3178C6) ![Prisma](https://cdn.simpleicons.org/prisma/2D3748) ![Postman](https://cdn.simpleicons.org/postman/FF6C37)

Buenas causa. Bienvenido a este curso. Ya sabes HTML, CSS, JavaScript y React — perfecto, porque acá vamos a construir sobre eso, no desde cero en lo básico. Vamos a hacer aplicaciones reales, con backend propio, base de datos y todo el flujo completo. Nada de código de juguete.

Reglas de la casa antes de empezar:

- Todo se prueba en **Postman** apenas creas un endpoint. No hay "ya después lo pruebo". Se prueba YA.
- Nada de atajos raros: acá escribimos código explícito, con `for` tradicional y variables acumuladoras. Si algo se puede escribir en 3 líneas crípticas o en 10 líneas claras, elegimos las 10. Tú tienes que **ver** qué está pasando.
- Las validaciones se hacen con `try/catch` (el equivalente en TypeScript a `try/except`), no con trucos caseros.
- Cada tema tiene una **Demo** (yo codeo en vivo, la solución queda a la vista) y un **Reto** (tú lo intentas, la solución está oculta en un desplegable — no la mires antes de sudar un poco).

Dale, empezamos.

---

## Bloque 1: El App Router de Next.js

![Next.js](https://cdn.simpleicons.org/nextdotjs/000000)

### Teoría

Next.js tiene dos formas de organizar rutas: el **Pages Router** (viejo, basado en la carpeta `pages/`) y el **App Router** (el actual, basado en la carpeta `app/`). Acá SOLO usamos App Router. Es el estándar profesional hoy.

La idea central: **cada carpeta dentro de `app/` es un segmento de ruta**, y el archivo `page.tsx` dentro de esa carpeta es lo que se renderiza en esa URL.

```
app/
  page.tsx          → ruta "/"
  productos/
    page.tsx        → ruta "/productos"
    [id]/
      page.tsx      → ruta "/productos/123" (ruta dinámica)
  layout.tsx         → envuelve TODO lo de adentro
```

Archivos especiales que tienes que conocer:

| Archivo | Responsabilidad |
|---|---|
| `page.tsx` | Define el contenido visible de una ruta |
| `layout.tsx` | Envuelve páginas hijas, se mantiene entre navegaciones (por ejemplo un header) |
| `loading.tsx` | Se muestra mientras la página carga datos |
| `route.ts` | Define un endpoint de API (lo vemos en el Bloque 4) |

### Demo (A)

Creamos una estructura básica:

```tsx
// app/layout.tsx
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
          <h1>Mi Curso de Next.js</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function HomePage() {
  return <p>Bienvenido a la página de inicio.</p>;
}
```

```tsx
// app/productos/page.tsx
export default function ProductosPage() {
  return <p>Acá van a estar los productos.</p>;
}
```

Corres `npm run dev`, entras a `localhost:3000` y luego a `localhost:3000/productos`. Fíjate cómo el header del `layout.tsx` se mantiene en las dos.

### Reto (B)

Crea una ruta `/contacto` que muestre un formulario simple (solo el HTML, sin lógica todavía) y una ruta dinámica `/productos/[id]` que muestre el `id` que viene en la URL usando `params`.

<details>
<summary>Ver solución</summary>

```tsx
// app/contacto/page.tsx
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
// app/productos/[id]/page.tsx
export default function ProductoDetallePage({
  params,
}: {
  params: { id: string };
}) {
  return <p>Estás viendo el producto con id: {params.id}</p>;
}
```

</details>

### Errores comunes

- Poner `page.tsx` fuera de una carpeta con el nombre correcto y preguntarse por qué no aparece la ruta.
- Olvidar que `layout.tsx` necesita renderizar `{children}`, si no, tu página nunca aparece.
- Confundir carpetas normales con carpetas de ruta dinámica `[id]` (los corchetes son obligatorios, no decorativos).

### Resumen del bloque

- El App Router usa carpetas dentro de `app/` como rutas.
- `page.tsx` es el contenido, `layout.tsx` es el envoltorio persistente.
- Las rutas dinámicas se crean con `[nombre]`.

---

## Bloque 2: Server Components vs Client Components

### Teoría

Esto es LO MÁS IMPORTANTE de todo Next.js moderno, prestá atención.

Por defecto, **todo componente en el App Router es un Server Component**. Se ejecuta en el servidor, nunca llega su código JavaScript al navegador, y por eso puede hacer cosas como consultar una base de datos directamente o leer archivos del servidor.

Un **Client Component** es uno que necesita interactividad del navegador: `useState`, `useEffect`, `onClick`, formularios controlados, etc. Para convertirlo, ponés `"use client"` en la primera línea del archivo.

| | Server Component | Client Component |
|---|---|---|
| Dónde corre | Servidor | Navegador |
| Puede usar `useState`/`useEffect` | No | Sí |
| Puede hacer `fetch` a una base de datos directo | Sí | No (tiene que pasar por un endpoint) |
| Afecta el bundle de JS | No | Sí, suma peso |

La estrategia profesional: usa Server Components por defecto y solo bajás a Client Component la parte mínima que realmente necesita interactividad. No marques todo el archivo como `"use client"` por pereza.

### Demo (A)

```tsx
// app/productos/page.tsx  (Server Component, sin "use client")
async function obtenerProductos() {
  // esto podría ser una consulta a base de datos, más adelante con Prisma
  return [
    { id: 1, nombre: "Teclado mecánico" },
    { id: 2, nombre: "Mouse inalámbrico" },
  ];
}

export default async function ProductosPage() {
  const productos = await obtenerProductos();

  return (
    <ul>
      {(() => {
        const elementos = [];
        for (let i = 0; i < productos.length; i = i + 1) {
          const producto = productos[i];
          elementos.push(<li key={producto.id}>{producto.nombre}</li>);
        }
        return elementos;
      })()}
    </ul>
  );
}
```

Fíjate: NO usé `.map()` para renderizar la lista con un atajo funcional escondido, armé un `for` tradicional con una variable acumuladora (`elementos`). Sé que se ve más largo. Así es como vas a entender exactamente qué está pasando en cada vuelta del ciclo.

Ahora, el botón de "agregar al carrito" SÍ necesita estado, entonces ese pedazo lo aislamos:

```tsx
// components/BotonAgregarCarrito.tsx
"use client";

import { useState } from "react";

export default function BotonAgregarCarrito() {
  const [agregado, setAgregado] = useState(false);

  function manejarClick() {
    setAgregado(true);
  }

  return (
    <button onClick={manejarClick}>
      {agregado ? "¡Agregado!" : "Agregar al carrito"}
    </button>
  );
}
```

### Reto (B)

Toma el `ProductosPage` de la demo y agrégale, a cada producto, el `BotonAgregarCarrito`. La página sigue siendo Server Component, solo el botón es Client Component.

<details>
<summary>Ver solución</summary>

```tsx
// app/productos/page.tsx
import BotonAgregarCarrito from "@/components/BotonAgregarCarrito";

async function obtenerProductos() {
  return [
    { id: 1, nombre: "Teclado mecánico" },
    { id: 2, nombre: "Mouse inalámbrico" },
  ];
}

export default async function ProductosPage() {
  const productos = await obtenerProductos();
  const elementos = [];

  for (let i = 0; i < productos.length; i = i + 1) {
    const producto = productos[i];
    elementos.push(
      <li key={producto.id}>
        {producto.nombre}
        <BotonAgregarCarrito />
      </li>
    );
  }

  return <ul>{elementos}</ul>;
}
```

</details>

### Errores comunes

- Poner `"use client"` en el layout raíz "para que no falle nada" — esto convierte TODO tu proyecto en Client Component y perdés todos los beneficios de Next.js.
- Intentar usar `useState` en un Server Component (te va a tirar error).
- Intentar hacer una consulta a base de datos dentro de un Client Component (no se puede, ahí necesitás un endpoint).

### Resumen del bloque

- Server Component es el default: rápido, seguro, sin JS extra al cliente.
- Client Component es la excepción: solo para lo que necesita interactividad.
- Se marca con `"use client"` en la primera línea del archivo.

---

## Bloque 3: Consumir APIs con `fetch` en Server Components

### Teoría

Como los Server Components corren en el servidor, pueden hacer `fetch` directo a una API externa sin exponer nada al navegador — ni siquiera una API key, si la necesitaras.

Next.js extiende el `fetch` nativo con opciones de caché propias:

```ts
fetch(url, { cache: "force-cache" }); // cachea siempre (default)
fetch(url, { cache: "no-store" });    // nunca cachea, pide fresco cada vez
fetch(url, { next: { revalidate: 60 } }); // cachea pero revalida cada 60s
```

### Demo (A)

```tsx
// app/clima/page.tsx
interface RespuestaClima {
  temperatura: number;
  ciudad: string;
}

async function obtenerClima(): Promise<RespuestaClima> {
  const respuesta = await fetch("https://api.ejemplo.com/clima/lima", {
    cache: "no-store",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el clima");
  }

  const datos: RespuestaClima = await respuesta.json();
  return datos;
}

export default async function ClimaPage() {
  try {
    const clima = await obtenerClima();
    return (
      <p>
        En {clima.ciudad} hay {clima.temperatura}°C
      </p>
    );
  } catch (error) {
    return <p>No se pudo cargar el clima en este momento.</p>;
  }
}
```

Fíjate que envolví todo en `try/catch`. Así se maneja un error en este curso — no con validaciones caseras revisando si el dato "parece" correcto.

### Reto (B)

Crea una página `/noticias` que consuma un endpoint público de noticias (podés inventar la URL de ejemplo) y muestre una lista de títulos usando `for` tradicional, con manejo de error con `try/catch`.

<details>
<summary>Ver solución</summary>

```tsx
// app/noticias/page.tsx
interface Noticia {
  id: number;
  titulo: string;
}

async function obtenerNoticias(): Promise<Noticia[]> {
  const respuesta = await fetch("https://api.ejemplo.com/noticias", {
    next: { revalidate: 120 },
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener las noticias");
  }

  const datos: Noticia[] = await respuesta.json();
  return datos;
}

export default async function NoticiasPage() {
  try {
    const noticias = await obtenerNoticias();
    const elementos = [];

    for (let i = 0; i < noticias.length; i = i + 1) {
      elementos.push(<li key={noticias[i].id}>{noticias[i].titulo}</li>);
    }

    return <ul>{elementos}</ul>;
  } catch (error) {
    return <p>No se pudieron cargar las noticias.</p>;
  }
}
```

</details>

### Errores comunes

- Olvidar que `fetch` en el servidor no tiene los mismos límites de CORS que en el navegador (a veces confunden a los alumnos porque "en el navegador esto no andaba").
- No manejar el caso `respuesta.ok === false` y asumir que el `.json()` siempre va a funcionar.
- Usar `cache: "force-cache"` (el default) para datos que cambian todo el tiempo, y preguntarse por qué la información se ve "vieja".

### Resumen del bloque

- `fetch` en Server Components se ejecuta en el servidor, seguro y sin exponer nada.
- Next.js agrega opciones de caché: `force-cache`, `no-store`, `revalidate`.
- Todo fetch va envuelto en `try/catch`.

---

## Bloque 4: Endpoints propios con `app/api` y `route.ts`

### Teoría

Hasta ahora consumimos APIs de otros. Ahora vamos a crear las nuestras. En el App Router, un endpoint se define con un archivo llamado exactamente `route.ts` dentro de una carpeta bajo `app/api/`.

```
app/
  api/
    productos/
      route.ts     → maneja /api/productos
```

Dentro de `route.ts` exportas funciones con el nombre del método HTTP: `GET`, `POST`, `PUT`, `DELETE`.

### Demo (A)

```ts
// app/api/productos/route.ts
import { NextRequest, NextResponse } from "next/server";

interface Producto {
  id: number;
  nombre: string;
}

// Simulamos una "base de datos" en memoria por ahora
let productos: Producto[] = [
  { id: 1, nombre: "Teclado mecánico" },
  { id: 2, nombre: "Mouse inalámbrico" },
];

export async function GET() {
  return NextResponse.json(productos);
}

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json();

    if (!cuerpo.nombre) {
      return NextResponse.json(
        { error: "El campo nombre es obligatorio" },
        { status: 400 }
      );
    }

    const nuevoProducto: Producto = {
      id: productos.length + 1,
      nombre: cuerpo.nombre,
    };

    productos.push(nuevoProducto);

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }
}
```

**CUANDO CREAS ESTE ENDPOINT, LO PRIMERO QUE HACES ES ABRIR POSTMAN.** No lo consumas desde el navegador todavía, no escribas el frontend todavía. Postman primero, siempre.

En Postman:
1. Creas una petición `GET` a `http://localhost:3000/api/productos` → deberías ver el arreglo.
2. Creas una petición `POST` a la misma URL, con body tipo `raw` → `JSON`, mandando `{ "nombre": "Monitor 24 pulgadas" }` → deberías recibir el producto creado con status `201`.
3. Probás mandar un POST sin el campo `nombre` → deberías recibir el error `400`.

### Reto (B)

Agrega los métodos `PUT` (actualizar por `id`, viene en el body) y `DELETE` (eliminar por `id`, viene en el body) al mismo `route.ts`. Probá los cuatro métodos en Postman antes de seguir.

<details>
<summary>Ver solución</summary>

```ts
export async function PUT(request: NextRequest) {
  try {
    const cuerpo = await request.json();

    if (!cuerpo.id || !cuerpo.nombre) {
      return NextResponse.json(
        { error: "Se necesita id y nombre" },
        { status: 400 }
      );
    }

    let encontrado = false;

    for (let i = 0; i < productos.length; i = i + 1) {
      if (productos[i].id === cuerpo.id) {
        productos[i].nombre = cuerpo.nombre;
        encontrado = true;
      }
    }

    if (!encontrado) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ mensaje: "Producto actualizado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cuerpo = await request.json();
    const productosFiltrados: Producto[] = [];

    for (let i = 0; i < productos.length; i = i + 1) {
      if (productos[i].id !== cuerpo.id) {
        productosFiltrados.push(productos[i]);
      }
    }

    productos = productosFiltrados;

    return NextResponse.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cuerpo de la petición inválido" },
      { status: 400 }
    );
  }
}
```

</details>

### Errores comunes

- Nombrar el archivo distinto a `route.ts` (por ejemplo `routes.ts` o `index.ts`) y no entender por qué el endpoint no responde.
- Olvidar el `await request.json()` y tratar de leer el body directo.
- No devolver códigos de status correctos (todo `200` aunque sea un error — un profesional siempre usa `400`, `404`, `500` según corresponda).
- Consumir el endpoint desde el frontend ANTES de probarlo en Postman. Acá eso está prohibido.

### Resumen del bloque

- `route.ts` define un endpoint; exportas `GET`, `POST`, `PUT`, `DELETE`.
- Todo endpoint se prueba primero en Postman.
- Las validaciones van con `try/catch` y códigos de status apropiados.

---

## Bloque 5: Prisma desde cero

![Prisma](https://cdn.simpleicons.org/prisma/2D3748)

### Teoría

Prisma es un **ORM** (Object-Relational Mapper): te deja hablarle a tu base de datos con código TypeScript en vez de escribir SQL a mano. Trabaja con tres piezas:

1. **Schema** (`schema.prisma`): describís tus tablas como si fueran modelos de TypeScript.
2. **Migraciones**: Prisma traduce ese schema a comandos SQL reales y los aplica a la base de datos.
3. **Prisma Client**: un cliente autogenerado, con autocompletado, que usás en tu código para consultar.

### Instalación

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Esto crea una carpeta `prisma/` con un `schema.prisma`, y un archivo `.env` con una variable `DATABASE_URL`.

### Configuración

```env
# .env
DATABASE_URL="postgresql://usuario:password@localhost:5432/mi_base"
```

Cambia esto por los datos reales de tu base (podés usar PostgreSQL local, o un servicio como Neon o Supabase para no instalar nada local).

### Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Producto {
  id        Int      @id @default(autoincrement())
  nombre    String
  precio    Float
  creadoEn  DateTime @default(now())
}
```

### Migraciones

```bash
npx prisma migrate dev --name crear_producto
```

Esto crea la tabla real en tu base de datos y genera el Prisma Client actualizado.

### Prisma Client

Se recomienda crear una única instancia reutilizable (para no abrir mil conexiones):

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Esto evita el error clásico de "demasiadas conexiones a la base de datos" que pasa cuando Next.js recarga en modo desarrollo y creás un `PrismaClient` nuevo cada vez.

### Reto (B)

Agrega un segundo modelo `Categoria` con `id`, `nombre`, y corre la migración correspondiente.

<details>
<summary>Ver solución</summary>

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

- Crear un `new PrismaClient()` en cada archivo distinto en vez de reutilizar una instancia — agota las conexiones de la base de datos.
- Olvidar correr `npx prisma migrate dev` después de editar el schema, y preguntarse por qué la tabla "no existe".
- Poner la contraseña de la base de datos directo en el schema en vez de usar `.env`.

### Resumen del bloque

- Prisma = schema + migraciones + client.
- El schema describe tus tablas en TypeScript-like.
- Las migraciones aplican esos cambios a la base real.
- El client se instancia una sola vez y se reutiliza.

---

## Bloque 6: CRUD con Prisma

### Teoría

Con el Prisma Client ya generado, las operaciones básicas son métodos directos sobre el modelo:

| Operación | Método |
|---|---|
| Leer todos | `findMany()` |
| Leer uno | `findUnique()` |
| Crear | `create()` |
| Actualizar | `update()` |
| Eliminar | `delete()` |

### Demo (A)

```ts
import { prisma } from "@/lib/prisma";

// Leer todos
async function listarProductos() {
  const productos = await prisma.producto.findMany();
  return productos;
}

// Leer uno
async function obtenerProductoPorId(id: number) {
  const producto = await prisma.producto.findUnique({
    where: { id: id },
  });
  return producto;
}

// Crear
async function crearProducto(nombre: string, precio: number) {
  const nuevoProducto = await prisma.producto.create({
    data: { nombre: nombre, precio: precio },
  });
  return nuevoProducto;
}

// Actualizar
async function actualizarProducto(id: number, nombre: string) {
  const productoActualizado = await prisma.producto.update({
    where: { id: id },
    data: { nombre: nombre },
  });
  return productoActualizado;
}

// Eliminar
async function eliminarProducto(id: number) {
  const productoEliminado = await prisma.producto.delete({
    where: { id: id },
  });
  return productoEliminado;
}
```

### Reto (B)

Escribe una función `buscarProductosPorNombre(texto: string)` usando `findMany` con un filtro `contains` sobre el campo `nombre`, envuelta en `try/catch`.

<details>
<summary>Ver solución</summary>

```ts
async function buscarProductosPorNombre(texto: string) {
  try {
    const productos = await prisma.producto.findMany({
      where: {
        nombre: {
          contains: texto,
        },
      },
    });
    return productos;
  } catch (error) {
    throw new Error("Error al buscar productos");
  }
}
```

</details>

### Errores comunes

- Usar `findUnique` con un campo que no es único ni la llave primaria (Prisma te va a tirar error de tipos).
- Olvidar el `where` en `update` o `delete` — sin eso, Prisma no sabe cuál registro tocar.
- No envolver las operaciones en `try/catch`: si el registro no existe, `update` y `delete` lanzan una excepción.

### Resumen del bloque

- `findMany`, `findUnique`, `create`, `update`, `delete` son el CRUD base de Prisma.
- Todas son funciones `async`, todas se envuelven en `try/catch` cuando pueden fallar.

---

## Bloque 7: Conectar Prisma con los endpoints de Next.js

### Teoría

Ahora unimos el Bloque 4 (endpoints) con el Bloque 6 (Prisma). En vez de guardar los productos en un arreglo en memoria, los guardamos de verdad en la base de datos.

### Demo (A)

```ts
// app/api/productos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cuerpo = await request.json();

    if (!cuerpo.nombre || !cuerpo.precio) {
      return NextResponse.json(
        { error: "nombre y precio son obligatorios" },
        { status: 400 }
      );
    }

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre: cuerpo.nombre,
        precio: cuerpo.precio,
      },
    });

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
```

Ahora sí, PROBÁ ESTO EN POSTMAN antes de seguir. Un `GET` te debe traer lo que hay en la tabla real, y un `POST` te debe crear una fila real en la base de datos. Anda a ver la tabla con `npx prisma studio` para confirmarlo con tus propios ojos.

### Reto (B)

Crea `app/api/productos/[id]/route.ts` con `GET` (traer uno), `PUT` (actualizar) y `DELETE` (eliminar), usando Prisma. Probá los tres en Postman.

<details>
<summary>Ver solución</summary>

```ts
// app/api/productos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id: Number(params.id) },
    });

    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cuerpo = await request.json();

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(params.id) },
      data: { nombre: cuerpo.nombre, precio: cuerpo.precio },
    });

    return NextResponse.json(productoActualizado);
  } catch (error) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.producto.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }
}
```

</details>

### Errores comunes

- Olvidar que `params.id` llega como `string`, no `number` — hay que convertirlo con `Number()`.
- No manejar el caso en que Prisma no encuentra el registro (`update`/`delete` lanzan excepción, no devuelven `null`).
- Seguir probando desde el navegador en vez de Postman para métodos que no son `GET`.

### Resumen del bloque

- Los endpoints ahora usan Prisma en vez de un arreglo en memoria.
- `npx prisma studio` te deja ver la base de datos visualmente para confirmar que todo funciona.
- Cada endpoint se prueba en Postman antes de tocar el frontend.

---

## Bloque 8: Consumir los endpoints desde la interfaz con `fetch`

### Teoría

Ahora sí conectamos el frontend. Para **leer** datos al cargar la página, usamos un Server Component con `fetch` (como en el Bloque 3). Para **crear, actualizar o eliminar** desde una acción del usuario (un clic, un submit), necesitamos un Client Component, porque ahí sí hay interactividad.

### Demo (A)

```tsx
// app/productos/page.tsx (Server Component: lee los datos)
import FormularioProducto from "@/components/FormularioProducto";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
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
  const productos = await obtenerProductos();
  const elementos = [];

  for (let i = 0; i < productos.length; i = i + 1) {
    const producto = productos[i];
    elementos.push(
      <li key={producto.id}>
        {producto.nombre} - S/ {producto.precio}
      </li>
    );
  }

  return (
    <div>
      <ul>{elementos}</ul>
      <FormularioProducto />
    </div>
  );
}
```

```tsx
// components/FormularioProducto.tsx
"use client";

import { useState } from "react";

export default function FormularioProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  async function manejarEnvio(evento: React.FormEvent) {
    evento.preventDefault();

    try {
      const respuesta = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nombre, precio: Number(precio) }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo crear el producto");
      }

      setNombre("");
      setPrecio("");
      setError("");
      window.location.reload(); // versión simple, más adelante lo hacemos mejor
    } catch (error) {
      setError("Ocurrió un error al crear el producto");
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <input
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        placeholder="Nombre"
      />
      <input
        value={precio}
        onChange={(evento) => setPrecio(evento.target.value)}
        placeholder="Precio"
      />
      <button type="submit">Crear</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Reto (B)

Agrega un botón de "Eliminar" a cada producto en la lista, que haga `fetch` con método `DELETE` al endpoint correspondiente. Tiene que ser parte de un Client Component nuevo.

<details>
<summary>Ver solución</summary>

```tsx
// components/BotonEliminarProducto.tsx
"use client";

export default function BotonEliminarProducto({ id }: { id: number }) {
  async function manejarClick() {
    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar");
      }

      window.location.reload();
    } catch (error) {
      alert("Ocurrió un error al eliminar el producto");
    }
  }

  return <button onClick={manejarClick}>Eliminar</button>;
}
```

</details>

### Errores comunes

- Usar `window.location.reload()` como solución permanente (sirve para aprender, pero no es profesional — lo arreglamos en el Bloque 9).
- Olvidar el header `"Content-Type": "application/json"` en el `fetch` con método `POST`, lo que hace que el servidor no pueda leer el body.
- Llamar al endpoint con la URL absoluta `http://localhost:3000/...` desde un Client Component en vez de la ruta relativa `/api/...`.

### Resumen del bloque

- Lectura de datos: Server Component + `fetch`.
- Escritura (crear/actualizar/eliminar): Client Component + `fetch` disparado por un evento.
- Todo `fetch` envuelto en `try/catch`, con manejo de error visible para el usuario.

---

## Bloque 9: SWR y TanStack Query

![TanStack Query](https://cdn.simpleicons.org/reactquery/FF4154)

### Teoría

En el bloque anterior usamos `window.location.reload()` para refrescar los datos después de crear o eliminar algo. Eso es un parche, no una solución. Acá es donde entran **SWR** y **TanStack Query**: librerías para manejar datos del lado del cliente con caché, revalidación automática, estados de carga y error ya resueltos.

¿Cuándo conviene usarlas en vez de `fetch` manual?

- Cuando necesitas que los datos se **revaliden solos** después de una mutación (crear/editar/eliminar), sin recargar la página entera.
- Cuando tienes **múltiples componentes** pidiendo los mismos datos y no quieres duplicar peticiones (estas librerías comparten caché).
- Cuando necesitas manejar **loading** y **error** de forma consistente en toda la app, sin repetir la misma lógica de `useState` en cada componente.

Si tu app es chica y solo lees datos una vez por página, `fetch` manual en un Server Component (como venimos haciendo) es más que suficiente — no le metas una librería extra por moda.

### Demo (A) — con TanStack Query

Instalación:

```bash
npm install @tanstack/react-query
```

Configuración del provider:

```tsx
// components/Providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

```tsx
// app/layout.tsx
import Providers from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Uso en un Client Component:

```tsx
// components/ListaProductosClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await fetch("/api/productos");

  if (!respuesta.ok) {
    throw new Error("Error al obtener productos");
  }

  return respuesta.json();
}

export default function ListaProductosClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productos"],
    queryFn: obtenerProductos,
  });

  if (isLoading) {
    return <p>Cargando productos...</p>;
  }

  if (isError) {
    return <p>Ocurrió un error al cargar los productos.</p>;
  }

  const elementos = [];
  const productos = data ?? [];

  for (let i = 0; i < productos.length; i = i + 1) {
    elementos.push(<li key={productos[i].id}>{productos[i].nombre}</li>);
  }

  return <ul>{elementos}</ul>;
}
```

### Reto (B)

Usando `useMutation` de TanStack Query, crea una función para eliminar un producto que, al terminar con éxito, invalide la query `["productos"]` para que la lista se refresque sola (sin `window.location.reload()`).

<details>
<summary>Ver solución</summary>

```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

async function eliminarProducto(id: number) {
  const respuesta = await fetch(`/api/productos/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar");
  }
}

export default function BotonEliminarProducto({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutacion = useMutation({
    mutationFn: () => eliminarProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return (
    <button onClick={() => mutacion.mutate()}>
      {mutacion.isPending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
```

</details>

### Errores comunes

- Meter TanStack Query o SWR en un Server Component (son librerías de cliente, necesitan `"use client"`).
- Olvidar el `queryKey` o usar uno distinto en la query y en la invalidación — si no coinciden, la lista nunca se refresca.
- Usar estas librerías para datos que solo se leen una vez y nunca cambian (ahí un `fetch` simple en el servidor es más que suficiente, no compliques).

### Resumen del bloque

- SWR y TanStack Query resuelven caché, revalidación y estados de loading/error del lado del cliente.
- Se usan cuando hay mutaciones frecuentes que necesitan refrescar datos sin recargar la página.
- No reemplazan al `fetch` en Server Components para lecturas simples.

---

## 📋 Tabla resumen de conceptos cubiertos

| Bloque | Concepto clave | Herramienta |
|---|---|---|
| 1 | App Router: carpetas = rutas | `page.tsx`, `layout.tsx` |
| 2 | Server vs Client Components | `"use client"` |
| 3 | Consumo de APIs externas | `fetch` + `try/catch` |
| 4 | Endpoints propios | `app/api/.../route.ts` + Postman |
| 5 | Prisma desde cero | schema, migraciones, client |
| 6 | CRUD con Prisma | `findMany`, `findUnique`, `create`, `update`, `delete` |
| 7 | Conectar Prisma con endpoints | `route.ts` + Prisma Client |
| 8 | Consumir endpoints desde la UI | Server Component (leer) + Client Component (escribir) |
| 9 | SWR / TanStack Query | `useQuery`, `useMutation` |

Eso es todo por ahora, causa. Repasa cada bloque, no te saltees los Retos — ahí es donde realmente se aprende, no leyendo la solución de una. Nos vemos en el siguiente.