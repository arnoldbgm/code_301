# 🧠 Guía — Sesión 1: CRM de Ventas — Requerimientos + Modelo de Datos (Vibe Coding + SDD)

<p align="center">
  <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/prisma/2D3748" alt="Prisma" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" height="60">
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" height="60">
</p>

Bienvenidos al curso de **vibe coding**: la IA escribe el código, pero VOS sos el arquitecto. La diferencia entre alguien que pide código y un profesional es que el profesional **sabe qué pedir, sabe revisar lo que le dan, y sabe si está bien hecho**. Eso es lo que aprendemos hoy.

Reglas de la casa para esta sesión:

- La IA no piensa por vos: **le das el contexto, la tarea, las restricciones y los criterios de aceptación**. Si el prompt es vago, la respuesta es vaga.
- Todo lo que escribimos pasa por el ciclo **SDD**: especificar ANTES de codear, verificar DESPUÉS. Sin eso, el vibe coding es una lotería.
- Esta sesión es de **puras demos**: yo armo el prompt, vemos qué produce, y lo seguís vos en tu máquina. Todos vamos al mismo ritmo.
- El código lo genera la IA, pero **la verificación es tuya**: corrés la app, probás los endpoints, y si algo no cumple lo pedido, lo volvés a pedir. La IA nunca dice "esto está mal". Vos lo tenés que ver.

---

## 0. La plantilla: qué tenemos y qué hay que tocar

Ya tenés el proyecto base: **NextAdmin 1.3.0** — un dashboard de Next.js 16 con Tailwind v4, Prisma 7, PostgreSQL y BetterAuth (login) ya configurado. **La base de datos ya está conectada**: el `.env.local` tiene tu `DATABASE_URL` apuntando a tu Postgres.

**Lo que YA funciona y no tocás:**
- Autenticación con BetterAuth (`src/lib/auth/`). Las tablas `User`, `Session`, `Account`, `Verification` ya están en Prisma.
- El layout del panel con sidebar y header (`src/app/(with-layout)/`).
- Estilos, componentes UI, charts.

**Lo que vamos a construir hoy (Fase 1 del modelo de datos):**

| Tabla | Para qué |
|-------|----------|
| `Cliente` | Personas/empresas que compran |
| `Producto` | Lo que se vende |
| `Blog` | Artículos de contenido |

Ojo: hoy NO hacemos ventas. Las ventas tienen su propia sesión (Sesión 2), porque necesitan una cabecera + ítems + facturación. Si las metemos hoy, se arma un lío.

### Las DOS vistas del CRM (importante de acá en adelante)

Nuestro CRM no es una sola app: son **dos experiencias** sobre los mismos datos. La plantilla ya preparó esto con *route groups* (carpetas entre paréntesis en App Router):

```
src/app/(with-layout)/            → VISTA ADMIN: dashboard con sidebar y header.
                                     El admin gestiona: CRUD de clientes,
                                     productos, blog, ventas, facturación.
src/app/(without-layout)/         → VISTA CLIENTE: página pública SIN sidebar.
                                     Hoy solo tiene el login/sign-up. Acá vive
                                     la tienda que ve el cliente, el detalle
                                     de producto y (en sesiones siguientes)
                                     su historial de compras.
```

| Vista | Ruta | Quién entra | Qué ve |
|-------|------|-------------|--------|
| **Admin** | `/`, `/clientes`, `/productos`, `/blog` | Vos (logueado) | Tablas CRUD, formularios, gestión total |
| **Cliente** | `/tienda`, `/tienda/[id]`, `/blog` | Cualquiera | Catálogo, detalle de producto, contenido |

Misma base de datos, dos caras.

**Mapa de la plantilla (aprendételo de memoria, lo vas a usar TODO el día):**

```
prisma/schema.prisma              → modelos de datos
src/lib/db/index.ts               → exporta `db` (PrismaClient listo)
src/app/api/                      → route handlers (GET/POST/PUT/DELETE)
src/app/(with-layout)/            → VISTA ADMIN (panel con sidebar)
src/app/(without-layout)/         → VISTA CLIENTE (pública, sin sidebar)
src/components/Layouts/sidebar/data/index.ts → menú del sidebar (NAV_DATA)
src/generated/prisma              → client generado (no tocar a mano)
```

---

## 1. La planificación: qué vamos a construir HOY y en qué orden

Antes de abrir opencode hay una regla de oro: **la planificación es tuya, no de la IA.** El vibe coding NO significa "abrís la IA y pedís cosas al azar". Significa "yo planifico, la IA ejecuta". Si no planificás, terminás con un monstruo de 400 archivos que nadie entiende.

La planificación de una sesión se responde con 4 preguntas:

| Pregunta | Respuesta de esta sesión |
|----------|--------------------------|
| **¿Qué entregamos al final?** | CRM con clientes, productos y blog gestionables desde el panel admin + tienda pública visible |
| **¿En qué orden lo construimos?** | Requerimientos → modelo de datos → migración → endpoints → vista admin → vista cliente |
| **¿Qué hacemos primero y qué es lo último?** | Primero los requerimientos y el schema (sin datos no hay nada). Lo último, la vista cliente (depende de que los endpoints existan) |
| **¿Cómo sabemos que está listo?** | Checklist de entrega al final de esta guía |

Este es el **plan de la sesión** (copiátelo, es tu mapa):

```
FASE 1 — REQUERIMIENTOS
  1.1 Requerimientos de la base de datos      → qué entidades y reglas (sección 3)
FASE 2 — MODELO DE DATOS
  2.1 Modelo Prisma + migración               → clientes, productos, blog (secciones 4 y 5)
FASE 3 — API
  3.1 Endpoints CRUD                          → GET/POST/PUT/DELETE (secciones 6 y 7)
FASE 4 — VISTA ADMIN
  4.1 Páginas CRUD en el panel                → clientes y productos (secciones 8 y 9)
FASE 5 — VISTA CLIENTE
  5.1 Catálogo público                        → tienda + detalle (secciones 10 y 11)
```

**Reglas de planificación que NO se negocian:**

1. **Las fases no se saltean.** No arranques con la tienda sin tener los endpoints. Cada fase se apoya en la anterior.
2. **Una tarea a la vez.** Cuando estás en la fase 3.1, el prompt es SOLO sobre endpoints. No le mezcles a la IA "creá los endpoints Y la página Y la tienda". Prompt chico = resultado verificable.
3. **Cada fase termina con verificación.** Si la fase 2.1 no compila, no seguís a la API. Parás, corregís, avanzás.
4. **El plan puede cambiar, pero conscientemente.** Si una fase se hace larga, no "improvisás a los apurones": ajustás el plan y continuás.

**Profe dice:** "El vibe coding mata a los que no planifican. La IA genera código a la velocidad de la luz — pero si no sabés qué código necesitás, te llena el proyecto de basura. Planificás en 5 minutos y te ahorrás 2 horas de depuración. Los 5 minutos más productivos de la clase."

---

## 2. Los prompts: anatomía de un buen prompt

Antes de pedirle nada a opencode, entendé la estructura. Todo prompt profesional tiene estas 5 partes:

| Parte | Qué logra |
|-------|-----------|
| **Rol** | Le decís QUÉ es (arquitecto, senior, experto en Prisma) |
| **Contexto** | Le das el mapa del proyecto (stack, archivos clave, convenciones) |
| **Tarea** | Le decís QUÉ hacer, concreta y verificable |
| **Restricciones** | Lo que NO puede hacer, o cómo debe hacerlo |
| **Criterios de aceptación** | Cómo sabés que quedó bien hecho |

**Profe dice:** "Un buen prompt es un contrato. Si le decís 'hacé una tabla de clientes', la IA va a inventar archivos, nombres, convenciones, y te va a romper el proyecto. Si le decís 'agregá el modelo Cliente a prisma/schema.prisma con estos campos, corré la migración y creá los endpoints siguiendo el patrón que ya existe en app/api', la IA hace exactamente lo que necesitás."

### Plantilla oficial de prompt (copiala y completala siempre)

Esta es la plantilla que usás en TODOS los prompts de las 3 sesiones. No es opcional: es el formato. Solo cambiás lo que está entre `<corchetes>`.

```text
Trabajás como <rol, ej: desarrollador senior de Next.js con Prisma>.

CONTEXTO: proyecto NextAdmin en este directorio. <stack + archivos clave
que necesita saber para responder bien, ej: el schema está en
prisma/schema.prisma, los endpoints en src/app/api/, la página de ejemplo
está en src/app/(with-layout)/tables/page.tsx. Usá este contexto para
seguir las convenciones del proyecto, no inventes otras.>

TAREA: <qué hacer, concreta y verificable, ej: creá el modelo Cliente en
el schema con estos campos: nombre, email, telefono, direccion,
createdAt, updatedAt.>

RESTRICCIONES:
- <lo que NO debe hacer, ej: no modifiques los modelos de BetterAuth>
- <cómo debe hacerlo, ej: seguí el patrón del modelo User para las fechas>
- <si aplica: no ejecutes X todavía, solo escribí el código>

CRITERIOS DE ACEPTACIÓN:
- <verificable, ej: npm run db:generate compila sin errores>
- <verificable, ej: un POST con email duplicado devuelve 409>
- <verificable, ej: /clientes aparece en el sidebar y navega>
```

**Reglas de oro de la plantilla:**

1. **El contexto siempre incluye archivos reales.** Si el prompt no nombra ningún archivo del proyecto, la IA adivina. Adivinar = romper.
2. **Un criterio de aceptación que no puedas probar no sirve.** "Que funcione" no es criterio. "`curl` devuelve 200 y la tabla muestra el cliente" sí.
3. **Si algo del resultado no te gusta, no arreglás a mano:** se lo pedís de nuevo con un prompt corto que apunte al problema. La IA itera, vos dirigís.
4. **Las restricciones son para protegerte a VOS.** La restricción "no modifiques los modelos de BetterAuth" existe porque si la IA toca el auth, se rompe el login y perdés media clase depurando.

---

## 3. Demo (A) — Requerimientos de la base de datos

Este es el paso que casi nadie hace y el que más te diferencia: **antes de pedir que construya la base, escribimos los requerimientos** — qué entidades existen, qué campos tiene cada una, qué reglas de negocio las gobiernan. Es el "contrato" entre vos y la IA.

Abro opencode en la carpeta del proyecto y pego esto:

```text
Trabajás como analista de datos senior con 10 años de experiencia
diseñando bases de datos para sistemas de ventas.

CONTEXTO: estoy construyendo un CRM de ventas sobre el proyecto NextAdmin
(Next.js 16 + Prisma 7 + PostgreSQL). En esta fase NO vamos a escribir
código ni tocar el schema: vamos a DEFINIR los requerimientos de la base
de datos en lenguaje claro, para después pasárselos a otro prompt que sí
implementará el modelo Prisma.

El CRM tendrá estas entidades de negocio:
- Cliente: personas/empresas que compran.
- Producto: lo que se vende.
- Blog: artículos de contenido.
(No incluyas ventas ni facturación todavía: son fases posteriores del
proyecto.)

TAREA: generá el documento de REQUERIMIENTOS DE LA BASE DE DATOS que
cubra, para cada entidad:

1. DEFINICIÓN: para qué sirve la entidad en una línea.
2. CAMPOS: nombre, tipo (texto, número, fecha, booleano), si es
   obligatorio, y ejemplos de valores.
3. RESTRICCIONES: qué reglas de negocio aplican. Ejemplos: email único,
   precio mayor a 0, stock no negativo, texto no vacío.
4. RELACIONES: cómo se conectan las entidades entre sí (1 a muchos,
   muchos a muchos, etc.).

Para Cliente incluí: nombre, email, teléfono, tipo de documento (DNI o
RUC), número de documento, dirección.
Para Producto incluí: nombre, descripción, precio, stock, categoría,
imagen (opcional por ahora).
Para Blog incluí: título, contenido, autor, fecha de publicación.

RESTRICCIONES:
- Lenguaje claro para un humano, no SQL ni Prisma.
- Cada campo debe decir si es obligatorio o no.
- Las reglas de negocio deben ser verificables (ej: "el email no se
  puede repetir entre clientes").

CRITERIOS DE ACEPTACIÓN:
- Cada entidad tiene sus 4 secciones (definición, campos, restricciones,
  relaciones).
- Al menos 3 reglas de negocio por entidad.
- El documento queda en formato markdown para pegarlo en el próximo
  prompt.
```

Cuando la IA devuelve el documento, lo revisás con estos filtros:

1. **¿El email es único?** — Obvio: dos clientes no comparten email.
2. **¿Los campos cubren lo que pedimos?** — Compará contra tu lista.
3. **¿Las reglas son verificables?** — "precio mayor a 0" es verificable; "precio razonable" no.
4. **¿Las relaciones están?** — Producto no se relaciona con Cliente todavía (en esta fase); Blog tampoco. Está bien así.

**Profe dice:** "Este documento es la mitad del trabajo. Cuando después le digas a la IA 'implementá estos requerimientos en Prisma', la calidad del modelo depende 100% de la calidad de los requerimientos. Basura entra, basura sale. Si la IA se olvidó de una regla, no la corregís a mano: le pedís 'agregá al documento la regla de stock no negativo'."

---

## 4. Demo (A) — Prompt para crear el modelo Prisma + migración

Ya tenemos los requerimientos de la base de datos. Ahora le pedimos a la IA que los convierta en el modelo Prisma. Pego esto:

```text
Trabajás como desarrollador senior de Next.js con Prisma.

CONTEXTO: proyecto NextAdmin, Next.js 16 + Prisma 7 + PostgreSQL.
El schema está en prisma/schema.prisma (ya tiene los modelos de BetterAuth).
Configuración de migraciones en prisma.config.ts, se ejecutan con
`npm run db:migrate`. El client se genera en src/generated/prisma con
`npm run db:generate`. Usamos convenciones snake_case para columnas con
@map, y @@map para tablas (mirá el modelo User que ya existe como
referencia de estilo).

TAREA: implementá en prisma/schema.prisma los modelos Cliente, Producto
y Blog a partir de estos requerimientos:

[pegá acá el documento de requerimientos de la Demo anterior]

RESTRICCIONES:
- Los ids son String con @id.
- createdAt/updatedAt siguen la convención del modelo User
  (@default(now()) y @updatedAt con @map("created_at"/"updated_at")).
- No elimines ni modifiques los modelos de BetterAuth.
- No ejecutes la migración todavía, solo escribí el schema.
- Cada regla de negocio del documento debe verse en el modelo
  (@unique, @default, tipos estrictos, etc.).

CRITERIOS DE ACEPTACIÓN:
- El schema compila (npm run db:generate termina sin errores).
- Cada campo del documento está representado con el tipo correcto.
- Cada restricción del documento está implementada.
- Los 3 modelos tienen sus relaciones (si el documento las pide).
```

**Profe dice:** "El prompt dice 'NO ejecutes la migración todavía'. ¿Por qué? Porque vos querés ver el schema ANTES de quemar una migración. La IA en una sola respuesta puede hacer demasiado: primero revisás, después decís 'dale, corré la migración'. Control del proceso, gente."

Cuando el schema está listo, revisás que compile:

```bash
npm run db:generate
```

Si da error, se lo pasás a la IA tal cual y pedís que lo arregle:

```text
npm run db:generate falla con este error:
[pegá el error completo]
Arreglá el schema para que compile. No cambies los modelos de BetterAuth.
```

Con el schema limpio, corrés la migración vos:

```bash
npm run db:migrate
```

---

## 5. Demo (A) — Verificación visual con Prisma Studio

La migración creó las tablas. Ahora verificamos con los ojos: Prisma Studio es una interfaz gráfica para mirar y tocar la base.

```bash
npm run db:studio
```

Se abre una ventana en el navegador. Fijate que ahora existen las tablas `Cliente`, `Producto` y `Blog` además de las de BetterAuth (`User`, `Session`, `Account`, `Verification`).

**Criterio de verificación:** las 3 tablas nuevas existen y muestran sus campos (columnas). Podés insertar un registro de prueba desde Studio para confirmar que la base funciona.

---

## 6. Demo (A) — Prompt para crear los endpoints de la API

Con los 3 modelos en la base, le pedimos a la IA los route handlers. Pego esto:

```text
Trabajás como desarrollador senior de Next.js App Router.

CONTEXTO: proyecto NextAdmin (Next.js 16). Los route handlers viven en
src/app/api/. El acceso a la base es `import { db } from "@/lib/db"`.
El client de Prisma está en src/generated/prisma. Usamos zod para validar
input en los endpoints.

TAREA: creá los route handlers completos para el modelo Cliente:
- GET /api/clientes → lista todos, ordenado por nombre ascendente
- GET /api/clientes/[id] → uno solo, 404 si no existe
- POST /api/clientes → crea, valida con zod, 409 si el email ya existe
- PUT /api/clientes/[id] → actualiza, 404 si no existe
- DELETE /api/clientes/[id] → elimina, 404 si no existe

Seguí este patrón de estructura de carpetas:
src/app/api/clientes/route.ts
src/app/api/clientes/[id]/route.ts

RESTRICCIONES:
- Todo endpoint que falle devuelve JSON con { message: "..." } y el status
  HTTP correcto (400/404/409).
- Las respuestas exitosas devuelven los datos crudos de Prisma.
- Usá try/catch y devolvés 500 genérico con message en el catch.
- No uses next/server Request como tipo genérico: usá el type nativo de
  route handler de Next.js.
- Los campos obligatorios del documento de requerimientos se validan con
  zod ANTES de tocar la base.

CRITERIOS DE ACEPTACIÓN:
- Puedo probar los 5 endpoints con curl/Postman.
- Un POST con email duplicado devuelve 409.
- Un GET de un id inexistente devuelve 404.
```

Probá con curl (o Postman):

```bash
curl http://localhost:3000/api/clientes
curl -X POST http://localhost:3000/api/clientes -H "Content-Type: application/json" -d "{\"nombre\":\"Juan Perez\",\"email\":\"juan@mail.com\"}"
```

**Profe dice:** "Cada endpoint que crea la IA, lo probás vos. No hay excepción. La IA puede mezclar los status HTTP, olvidar el 404, o validar mal. El curl es tu ojo. Si algo falla, copiás el error y se lo das a la IA para que lo corrija."

---

## 7. Demo (A) — Endpoints de Producto y Blog

Mismo patrón, y ahora lo hacés vos siguiendo la demo anterior. Copiá el prompt de la sección 6 y adaptalo para Producto y Blog.

Para Producto, agregá al prompt las reglas de negocio del documento de requerimientos: `POST` con precio negativo o stock negativo debe devolver **400** (falla de validación).

Verificá:
- `GET /api/productos` y `GET /api/blog` listan.
- Un `POST /api/productos` con `precio: -5` devuelve 400.
- Un `POST /api/blog` con `titulo` vacío devuelve 400.

---

## 8. Demo (A) — Prompt para la página CRUD en el panel

Que los datos se vean y se editen desde el panel. Pego esto en opencode:

```text
Trabajás como desarrollador senior de Next.js con Tailwind CSS v4.

CONTEXTO: proyecto NextAdmin. Las páginas del panel viven en
src/app/(with-layout)/. La página de ejemplo está en
src/app/(with-layout)/tables/page.tsx (usá su estructura de referencia:
Breadcrumb + tarjetas). El menú lateral se configura en
src/components/Layouts/sidebar/data/index.ts dentro de NAV_DATA.
Usamos Tailwind v4, componentes de NextAdmin ya existentes y sonner para
toasts de éxito/error.

TAREA: creá la página /clientes dentro del panel con:
1. Una tabla que liste los clientes desde GET /api/clientes.
2. Un formulario de "Nuevo cliente" (modal o sección) que haga POST.
3. Editar un cliente existente (PUT) desde la misma tabla.
4. Eliminar un cliente (DELETE) con confirmación.
5. Un botón de "Actualizar" que re-fetch la lista.

RESTRICCIONES:
- Los componentes de la página deben ser Client Components ('use client').
- El fetch a la API se hace desde el cliente (relative paths, sin host).
- Estilos con clases Tailwind y componentes de NextAdmin, no styles inline.
- El formulario valida los campos obligatorios antes del submit.
- Toast de éxito al crear/editar/eliminar, toast de error si la API falla.

CRITERIOS DE ACEPTACIÓN:
- /clientes aparece en el sidebar y navega correctamente.
- Puedo crear, editar y eliminar un cliente desde el panel.
- La lista se actualiza después de cada operación.
- El menú del sidebar no rompe las demás secciones.
```

**Profe dice:** "Fijate que le pedí componentes Client Components para una página que toca la API desde el navegador. Si la IA los hace Server Components, el fetch relativo no va a funcionar. Ese tipo de detalle en el prompt marca la diferencia entre que ande a la primera o que pases 30 minutos depurando."

---

## 9. Demo (A) — Página de Productos

Mismo patrón que /clientes. Como Producto tiene `precio` y `stock`, el formulario debe usar inputs numéricos y mostrar el precio formateado (S/ 12.50). Además, el formulario respeta las reglas del documento de requerimientos (precio mayor a 0, stock no negativo).

Verificá que puedas crear, editar y eliminar un producto desde el panel.

---

## 10. Demo (A) — La vista cliente: catálogo de productos

El CRM tiene dos caras. Ya vimos la de admin. Ahora la vista cliente: una tienda pública en `(without-layout)`, que NO tiene sidebar. Pego esto en opencode:

```text
Trabajás como desarrollador senior de Next.js con Tailwind CSS v4.

CONTEXTO: proyecto NextAdmin. La vista pública vive en
src/app/(without-layout)/ (ahí están las páginas de auth como referencia,
pero NO uses su estructura de formularios). Es una zona SIN sidebar ni
header del panel: páginas limpias para el público. Los productos se leen
de GET /api/productos. Usamos Tailwind v4 y los componentes ui de NextAdmin
si aportan.

TAREA: creá la página /tienda dentro de (without-layout) que muestre el
catálogo de productos:
1. Una grilla responsiva (1 columna en mobile, 3-4 en desktop) con tarjetas
   de producto: nombre, precio formateado (S/ 12.50), categoría y botón
   "Ver detalle".
2. Cada tarjeta enlaza a /tienda/[id] (la página de detalle la creamos en
   el próximo prompt).
3. Un título de sección tipo "Nuestros productos".

RESTRICCIONES:
- Es un Server Component: el fetch a la API usa URL absoluta
  (http://localhost:3000/api/productos).
- No uses el layout del panel. Esta página NO tiene sidebar.
- Estilos con Tailwind, sin styles inline.
- Si no hay productos, mostrá un mensaje "No hay productos disponibles".

CRITERIOS DE ACEPTACIÓN:
- /tienda renderiza el catálogo desde la API.
- Las tarjetas muestran nombre, precio con S/ y categoría.
- Se ve bien en mobile y desktop.
- /tienda no rompe las rutas de auth ni del panel.
```

**Profe dice:** "Fijate la diferencia de contexto: la página del panel era Client Component con fetch relativo, la tienda es Server Component con URL absoluta. La misma regla de siempre: el servidor usa host completo, el navegador usa ruta relativa. Y ojo que no le dije 'usá el layout del panel' — la tienda tiene que verse limpia, sin el menú admin."

---

## 11. Demo (A) — Página de detalle de producto (vista cliente)

Seguimos con la vista cliente: creá `/tienda/[id]` en `(without-layout)` que muestre un producto por su id.

Qué debe hacer:
- Leer el producto de `GET /api/productos/[id]`.
- Mostrar nombre, precio, categoría, descripción y un botón "Agregar al carrito" (por ahora sin funcionalidad, solo visual).
- Si el id no existe, mostrar "Producto no encontrado".

**Pista para el prompt:** el parámetro de ruta en App Router se lee con `params` (y en Next.js 16, `params` es una promesa que hay que esperar). Si la IA lo hace mal, el prompt de corrección es: "En Next.js 16 params es una Promise, usá `const { id } = await params`".

Verificá: `/tienda/1` muestra un producto, `/tienda/99999` muestra el mensaje de no encontrado.

---

## 12. Errores comunes (y cómo hacerlos visibles para la IA)

| Problema | Síntoma | Cómo pedírselo a la IA |
|----------|---------|------------------------|
| Migración rota | `npm run db:migrate` falla | Pegá el error completo y pedí: "Arreglá el schema para que la migración funcione" |
| Endpoint devuelve 500 | Cualquier request falla | "El GET /api/clientes devuelve 500, investigá la razón y corregí" |
| Página en blanco | /clientes no renderiza | "La página /clientes se queda en blanco, revisá los imports y el fetch" |
| Email duplicado no da 409 | POST crea duplicados | "El POST /api/clientes no valida email duplicado, agregá la validación con el código de estado correcto" |
| Fetch desde Server Component | Error de host/URL | "Esta página es Server Component, el fetch debe usar URL absoluta http://localhost:3000/..." |
| Fetch desde Client Component | Error de host/URL | "Esta página es Client Component, el fetch debe ser relativo sin http://localhost" |
| La tienda se ve con sidebar | Mezcla vistas | "La página /tienda no debe usar el layout del panel, está en (without-layout)" |
| params no funciona en Next 16 | Error de ruta dinámica | "En Next.js 16 params es una Promise, usá `const { id } = await params`" |
| La IA se salta una regla del documento | Falta @unique o validación | "El documento de requerimientos dice que X, el modelo/endpoint no lo implementa, corregí" |

---

## 13. Resumen de la sesión

Hoy aprendimos el flujo completo del vibe coding responsable:

0. **Planificar ANTES de pedir** — definís qué entregás, en qué orden y cómo sabés que está listo. Sin plan, la IA te llena el proyecto de basura.
1. **Requerimientos primero** — un documento claro de entidades, campos y reglas que se le pasa a la IA. Es el contrato entre vos y el código.
2. **Revisar los requerimientos** — los criterios de aceptación son TU contrato con la IA.
3. **Implementar por capas** — requerimientos → schema → migración → endpoints → UI. Cada capa se verifica antes de seguir.
4. **Verificar SIEMPRE** — corrés la app, probás con curl, mirás con tus ojos. La IA no verifica nada.
5. **Iterar con prompts** — el error no se arregla a mano, se le pide a la IA que lo corrija con el error a la vista.

Y un concepto clave: **el CRM tiene DOS vistas** — la de admin (`(with-layout)`, con sidebar) y la de cliente (`(without-layout)`, pública). Misma base, dos caras.

Al finalizar tenés: **3 modelos en la base (Cliente, Producto, Blog) construidos desde requerimientos, 15 endpoints CRUD, 3 páginas admin en el panel y la tienda pública con catálogo + detalle** — listo para vender.

**Próxima sesión:** la lógica de negocio — ventas con cabecera + ítems, cálculo de IGV y la integración con NubeFac para facturar. La vista cliente también va a crecer: va a poder comprar.

---

## 14. Checklist de entrega

**Planificación**
- [ ] Tengo el plan de la sesión: 5 fases, una tarea a la vez, verificación al final de cada fase
- [ ] Sé qué entrego hoy (requerimientos + modelo + API + admin + tienda) y en qué orden

**Requerimientos**
- [ ] Documento de requerimientos de la base con las 3 entidades (definición, campos, restricciones, relaciones)
- [ ] Al menos 3 reglas de negocio por entidad

**Modelo de datos**
- [ ] `npm run db:generate` compila sin errores
- [ ] `npm run db:migrate` corrió sin errores
- [ ] Prisma Studio muestra las tablas Cliente, Producto, Blog
- [ ] `curl /api/clientes` lista (puede estar vacío)
- [ ] POST con email duplicado → 409
- [ ] POST con precio negativo → 400
- [ ] POST con título vacío → 400
- [ ] GET de id inexistente → 404
- [ ] `/clientes`, `/productos`, `/blog` en el sidebar del admin y funcionales
- [ ] Puedo crear/editar/eliminar desde el panel en las 3 secciones

**Vista cliente**
- [ ] `/tienda` muestra el catálogo (vista cliente, sin sidebar)
- [ ] `/tienda/[id]` muestra un producto y "Producto no encontrado" para ids inexistentes
