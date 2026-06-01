# 🚀 React desde Cero

> **Nivel:** Principiante absoluto  
> **React 19 · Vite 6 · Node 22 LTS · pnpm 10**  
> *"No hace falta saber todo para empezar. Hace falta empezar."*

---

## 📋 Hoja de ruta

| Sesión | Temas |
|--------|-------|
| **1** | ¿Qué es React? · Empresas que lo usan · Setup · JSX · Tu primer componente |
| **2** | Props · useState · Eventos · Formularios |
| **3** | Renderizado condicional · Listas · Composición · Ejercicios |

---

# 🌟 ¿Qué es React y por qué nos importa?

React es una **biblioteca de JavaScript** creada por **Meta (Facebook)** en 2013. Se usa para construir interfaces de usuario (UI) que se actualizan solas cuando los datos cambian.

> **En criollo:** Escribís HTML y lógica en un mismo lugar, React se encarga de mostrar y actualizar todo en pantalla.

### ¿Por qué aprender React en vez de otro?

| Esto | Pasa con React |
|------|----------------|
| Tengo que actualizar la pantalla cuando algo cambia | React lo hace solo |
| Tengo 500 elementos que se repiten con datos distintos | Creás UN componente y lo reutilizás |
| Quiero usar lo mismo en web y mobile | React y React Native comparten lógica |
| Necesito ayuda / quiero buscar trabajo | Comunidad más grande del ecosistema frontend |

---

# 🏢 ¿Qué empresas usan React?

## Gigantes globales

| Empresa | ¿Qué parte usa React? |
|---------|----------------------|
| **Meta** (Facebook, Instagram, WhatsApp Web) | El creador de React. Toda su UI web. |
| **Netflix** | Plataforma web completa. |
| **Airbnb** | Búsqueda, perfiles, reservas. |
| **Uber** | Dashboard de conductores, app web. |
| **Spotify** | Web player. |
| **Discord** | App de escritorio (Electron + React). |
| **TikTok** | Web app. |
| **X (Twitter)** | Web app completa. |
| **Pinterest** | Feed visual entero. |
| **Microsoft** | Office 365 web, Teams web, Outlook. |
| **GitHub** | Partes de la interfaz. |
| **NY Times** | CMS y sitio principal. |
| **Yahoo!** | Yahoo Mail. |
| **Cloudflare** | Dashboard principal. |
| **WhatsApp Web** | 100% React. |

## Demanda laboral (datos 2026)

| Indicador | Valor |
|-----------|-------|
| Cuota de mercado (frameworks JS) | ~70% |
| Sitios activos que usan React | 5.3 millones+ |
| Descargas semanales en npm | 25 millones+ |
| Ofertas en Glassdoor (EE.UU.) | ~6.500 activas |
| Ofertas en NodeFlair | ~6.000 activas |
| Ofertas en Computrabajo (Argentina) | ~65 activas |

### Rangos salariales aproximados

| Nivel | EE.UU. (anual) | Latinoamérica / Argentina |
|-------|----------------|--------------------------|
| Junior | $80K — $100K USD | $1.5M — $2.5M ARS/mes |
| Semi-Senior | $100K — $140K USD | $2.5M — $4M ARS/mes |
| Senior | $140K — $185K+ USD | Remote a EE.UU.: $40K — $100K USD/año |

> **En resumen:** No es una tecnología de nicho ni una moda pasajera. React está en todos lados, lo usan las empresas más grandes, y tiene una comunidad enorme. Aprender React te da una base sólida para trabajar, sea como frontend, fullstack o mobile (React Native).

---

# 🧠 ¿Cómo funciona React? (lo mínimo que necesitás saber)

No hace falta entender TODO el motor interno para usar React. Pero hay UN concepto que te va a salvar de bugs raros.

## El Virtual DOM (explicado en 30 segundos)

El navegador tiene el **DOM** (la representación de tu HTML). Cada vez que lo tocás, es medio lento.

React mantiene una **copia liviana en JavaScript** llamada Virtual DOM. Cuando algo cambia:

1. React modifica su copia virtual (rapidísimo)
2. Compara la copia nueva con la vieja
3. Toca el DOM real **solo en los lugares que cambiaron**

```
Estado cambia ──→ React recalcula ──→ Compara con lo anterior ──→ Actualiza solo lo distinto
```

> **No tenés que acordarte de esto para codear.** Pero cuando veas que algo no se actualiza, sabé que probablemente React no "detectó" el cambio porque modificaste el estado de forma incorrecta.

## Cómo piensa React

React es **declarativo**: vos decís QUÉ querés mostrar, React se encarga de CÓMO.

```
❌ Imperativo (JavaScript puro):
   "Agarrá este div, ponele este texto, y si el usuario hace click cambialo a este otro"

✅ Declarativo (React):
   "Si el contador es 0, mostra x. Si es 1, mostra y."
```

---

# ⚙️ Setup — en 5 minutos

## 1. Node.js

Andá a [nodejs.org](https://nodejs.org), descargá la versión **LTS** (22.x). Instalá con Siguiente → Siguiente → Listo.

```bash
# Verificá que quedó bien:
node --version   # v22.x.x
npm --version    # 10.x.x
```

## 2. pnpm (opcional, pero recomendado)

```bash
npm install -g pnpm
pnpm --version   # 10.x.x
```

## 3. Crear proyecto con Vite

```bash
pnpm create vite mi-app-react --template react
# o con npm:
# npm create vite@latest mi-app-react -- --template react
```

## 4. Correr el proyecto

```bash
cd mi-app-react
pnpm install
pnpm dev
```

Abrí `http://localhost:5173/` en el navegador. 🎉

---

# 🧱 Componentes — el corazón de React

## Tu primer componente (4 líneas)

Creá `src/Saludo.jsx`:

```jsx
function Saludo() {
  return <h1>Hola, mundo 👋</h1>;
}

export default Saludo;
```

Usalo en `App.jsx`:

```jsx
import Saludo from './Saludo';

function App() {
  return (
    <div>
      <Saludo />
    </div>
  );
}

export default App;
```

> 💡 **Un componente ES una función que devuelve HTML.** Nada más, nada menos.

## Reglas de los componentes

| # | Regla | ¿Por qué? |
|---|-------|-----------|
| 1 | **Nombre con mayúscula** | `Saludo` → componente. `saludo` → HTML. React se fija en eso. |
| 2 | **Devuelve un solo elemento raíz** | `<div>...</div>` o `<>...</>` (fragment) |
| 3 | **Exportalo** | Así lo podés importar en otro archivo |

## Analogía: Lego

Cada componente es una pieza de Lego. Una pieza sola no hace mucho, pero combinando muchas piezas construís cosas enormes. Y una misma pieza la usás mil veces en distintos lugares.

---

# 🎨 JSX — HTML adentro de JavaScript

JSX es como HTML, pero lo escribís adentro de un archivo `.jsx` y podés mezclarlo con JavaScript.

```jsx
function Tarjeta() {
  const nombre = 'Martina';
  const edad = 22;

  return (
    <div className="tarjeta">
      <h1>{nombre}</h1>
      <p>Edad: {edad}</p>
      <p>El año que viene va a tener {edad + 1}</p>
    </div>
  );
}
```

> **Las llaves `{}` son el truco:** abren una ventana a JavaScript adentro del HTML.

## Diferencias con HTML comunes

| HTML | JSX |
|------|-----|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `style="color: red"` | `style={{ color: 'red' }}` |
| `onclick="fn()"` | `onClick={fn}` |
| `autofocus` | `autoFocus` |
| `tabindex` | `tabIndex` |

---

# 📦 Props — pasando datos entre componentes

## De padre a hijo

```jsx
// Tarjeta.jsx — recibe datos por props
function Tarjeta({ nombre, edad, ciudad }) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>{edad} años, {ciudad}</p>
    </div>
  );
}

// App.jsx — pasa los datos
function App() {
  return (
    <div>
      <Tarjeta nombre="Ana" edad={25} ciudad="CABA" />
      <Tarjeta nombre="Luis" edad={30} ciudad="Córdoba" />
      <Tarjeta nombre="Sofía" edad={22} ciudad="Rosario" />
    </div>
  );
}
```

### Flujo de datos

```
App (tiene los datos)
 │
 ├─ Tarjeta (recibe: nombre, edad, ciudad)
 ├─ Tarjeta (recibe: nombre, edad, ciudad)
 └─ Tarjeta (recibe: nombre, edad, ciudad)
```

**Los datos siempre bajan.** De padre a hijo.

## Valores por defecto

```jsx
function Boton({ texto = "Click", color = "azul" }) {
  return <button style={{ backgroundColor: color }}>{texto}</button>;
}
```

## `children` — la prop invisible

```jsx
function Caja({ children }) {
  return <div style={{ border: '2px solid black', padding: '1rem' }}>{children}</div>;
}

<Caja>
  <h1>Todo esto</h1>
  <p>entra como children</p>
</Caja>
```

---

# 🔄 Estado con useState — la memoria del componente

## El problema

Sin React, para hacer un contador tenés que:

```js
let contador = 0;
boton.onclick = () => {
  contador++;
  document.querySelector('p').textContent = contador; // 😫 a mano
};
```

Con React:

```jsx
import { useState } from 'react';

function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>{contador}</p>
      <button onClick={() => setContador(contador + 1)}>+1</button>
    </div>
  );
}
```

## Cómo se lee

```jsx
const [valor, setValor] = useState(0);
//        ▲         ▲              ▲
//        │         │              └── valor inicial: arranca en 0
//        │         └── función para actualizar
//        └── valor actual (SÓLO se lee, no se asigna)
```

## Pasos para usar useState

```
1. Importás:       import { useState } from 'react';
2. Declarás:        const [contador, setContador] = useState(0);
3. Leés:            <p>{contador}</p>
4. Actualizás:      setContador(contador + 1)
```

### Regla de ORO

```jsx
// ❌ MAL
contador = 5;        // React nunca se entera

// ✅ BIEN
setContador(5);      // React detecta el cambio y actualiza la pantalla
```

Siempre usás la función que te da `useState` para cambiar el valor. Nunca lo asignás directamente.

## Mini-ejemplo: input que se actualiza solo

```jsx
function NombreForm() {
  const [nombre, setNombre] = useState('');

  return (
    <div>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <p>Escribiste: {nombre}</p>
    </div>
  );
}
```

> A esto se le llama **formulario controlado**: React controla el valor del input.

---

# 🎯 Eventos

```jsx
function Boton() {
  function handleClick() {
    alert('Hiciste click 🖱️');
  }

  return <button onClick={handleClick}>Click</button>;
}
```

> **Sin paréntesis:** `onClick={handleClick}` no `onClick={handleClick()}`. Le estás pasando la función, no el resultado de llamarla.

## Con parámetros

```jsx
function Lista() {
  const frutas = ['Manzana', 'Banana', 'Naranja'];

  function elegir(nombre) {
    alert(`Elegiste: ${nombre}`);
  }

  return (
    <ul>
      {frutas.map(f => (
        <li key={f} onClick={() => elegir(f)}>{f}</li>
      ))}
    </ul>
  );
}
```

## Formulario completo

```jsx
function Formulario() {
  const [email, setEmail] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // ❗sin esto la página recarga
    alert(`Email ingresado: ${email}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
      />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

---

# 🔀 Renderizado condicional

Mostrar cosas según una condición:

```jsx
function Mensaje({ estaLogueado }) {
  if (estaLogueado) {
    return <p>Bienvenido 🎉</p>;
  }
  return <p>Iniciá sesión 🔐</p>;
}
```

### Forma corta con `&&`

```jsx
function Alerta({ mensaje }) {
  return (
    <div>
      {mensaje && <div className="alerta">{mensaje}</div>}
    </div>
  );
}
// Si mensaje es "", null, undefined o false → no se muestra
```

### Forma intermedia con ternario

```jsx
function Item({ producto }) {
  return (
    <div>
      <h3>{producto.nombre}</h3>
      {producto.stock > 0
        ? <span style={{ color: 'green' }}>En stock</span>
        : <span style={{ color: 'red' }}>Sin stock</span>
      }
    </div>
  );
}
```

---

# 📋 Listas

```jsx
function ListaTareas() {
  const tareas = [
    { id: 1, texto: 'Estudiar React' },
    { id: 2, texto: 'Practicar' },
    { id: 3, texto: 'Armar proyecto' },
  ];

  return (
    <ul>
      {tareas.map(t => <li key={t.id}>{t.texto}</li>)}
    </ul>
  );
}
```

### La key importa. Usá ID, no índice.

```jsx
// ✅ BIEN
tareas.map(t => <li key={t.id}>{t.texto}</li>)

// ❌ MAL (si la lista cambia)
tareas.map((t, i) => <li key={i}>{t.texto}</li>)
```

**¿Por qué?** React usa la `key` para saber qué elemento es cuál. Si usás el índice y el orden cambia, React mezcla todo.

---

# 🏗️ Composición — juntando todo

Componentes chicos que forman algo más grande:

```jsx
// Avatar.jsx
function Avatar({ url, nombre }) {
  return <img src={url} alt={nombre} width={50} />;
}

// Info.jsx
function Info({ nombre, email }) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>{email}</p>
    </div>
  );
}

// TarjetaUsuario.jsx
function TarjetaUsuario({ usuario }) {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <Avatar url={usuario.avatar} nombre={usuario.nombre} />
      <Info nombre={usuario.nombre} email={usuario.email} />
    </div>
  );
}
```

> Dividí en componentes chicos. Si un componente pasa las 80 líneas, probablemente se puede dividir.

---

# 🏋️ Ejercicios

### 🟢 Nivel 1 — Tarjeta de presentación

Creá `Tarjeta` que reciba `nombre`, `edad`, `profesion`, `foto`. Mostrala con estilo.

---

### 🟡 Nivel 2 — Contador con límites

Contador de 0 a 10. No baja de 0 ni pasa de 10. Mostrá "Límite" al llegar al borde.

---

### 🟡 Nivel 3 — Conversor Celsius ↔ Fahrenheit

Dos inputs sincronizados. Escribís en uno, se actualiza el otro.

```
°F = °C × 9/5 + 32
°C = (°F − 32) × 5/9
```

---

### 🔴 Nivel 4 — Lista de tareas

- Input + botón Agregar
- Checkbox para marcar hecha
- Botón eliminar
- Tareas hechas se tachan
- Filtro: Todas / Pendientes / Completadas

---

### 🔴 Nivel 5 — Buscador de productos

```js
const productos = [
  { id: 1, nombre: 'Teclado mecánico', precio: 85, categoria: 'periféricos' },
  { id: 2, nombre: 'Mouse', precio: 45, categoria: 'periféricos' },
  { id: 3, nombre: 'Monitor 27"', precio: 350, categoria: 'monitores' },
];
```

- Input de búsqueda que filtra por nombre
- Selector por categoría
- Resultados en tiempo real
- "No se encontraron resultados" si no hay match

---

# 📚 Resumen rápido

| Concepto | Explicación |
|----------|-------------|
| **Componente** | Función que devuelve HTML |
| **JSX** | HTML con JavaScript adentro (`{}`) |
| **Props** | Datos que le pasás a un componente (de padre a hijo) |
| **useState** | Estado local del componente. Cambiás el estado → React actualiza la pantalla |
| **Eventos** | `onClick`, `onChange`, `onSubmit` — en camelCase, sin llamar la función |
| **Key** | Identificador único en listas. Usá ID, no índice |
| **Composición** | Componentes chicos se combinan para formar algo grande |

---

> **Manos al teclado.** No hace falta entender TODO para arrancar. Escribí código, rompelo, arreglalo. Así se aprende React.
