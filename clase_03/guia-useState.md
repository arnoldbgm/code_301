# 🧠 useState en React — El Estado te hace libre

> **Nivel:** Principiante — asumimos que ya sabés componentes y props  
> **React 19 · Vite 6**  
> *"El estado no es magia. Es una variable que React vigila."*

---

## 📋 Qué vamos a ver

| # | Tema |
|---|------|
| 1 | Arrow functions (repaso rápido) |
| 2 | JSX — el HTML con superpoderes |
| 3 | `.map()` — pintar listas como un pro |
| 4 | Eventos en React |
| 5 | `useState` — la memoria del componente |
| 6 | 🏋️ Reto: Calculadora con estilo mínimo |

---

# 1️⃣ Arrow Functions — las funciones modernas

Antes de meternos de lleno en React, necesitás tener clara **una sola cosa**: las funciones flecha.

## Sintaxis

```js
// Función tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function — misma funcionalidad
const sumar = (a, b) => {
  return a + b;
};

// Arrow modo ultra — return implícito (una sola línea, sin llaves)
const sumar = (a, b) => a + b;
```

## ¿Por qué nos importan en React?

Porque en React pasás funciones como si fueran objetos. Las pasás a eventos, a hooks, a todo. Y las arrow functions hacen que eso sea más corto y legible.

Compará:

```js
// Tradicional
function saludar() {
  alert('Hola');
}
button.onclick = saludar;

// Arrow
const saludar = () => alert('Hola');
button.onclick = saludar;
```

## La clave con las arrows

Una arrow function **es una expresión** — podés crearla en el momento y pasarla como argumento:

```js
const numeros = [1, 2, 3];
const duplicados = numeros.map(n => n * 2);
//                           ▲
//               arrow function creada al vuelo
```

Eso de crear funciones en el lugar lo vas a usar en cada evento, cada `map`, cada `useState`. Vas a ver.

### Cuidado con los paréntesis

```js
function saludar() {
  alert('Hola');
}

// ✅ PASÁS la función (referencia)
const fn = saludar;    // guardás la función para usarla después

// ❌ LLAMÁS a la función (ejecutás)
const fn = saludar();  // ejecutás saludar YA, guardás el resultado (undefined)
```

En React esto es CRÍTICO:

```jsx
// ✅ BIEN — le pasás la función, React la llama cuando ocurre el evento
<button onClick={saludar}>Click</button>

// ❌ MAL — la ejecutás en el render, el resultado va al onClick
<button onClick={saludar()}>Click</button>
```

> **`onClick={saludar}`** le das la función. **`onClick={saludar()}`** ejecutás la función ya y pasás lo que devuelva. No es lo mismo.

---

# 2️⃣ JSX — HTML adentro de JavaScript mirá vos

JSX no es HTML. Es **JavaScript que parece HTML**. El navegador NO entiende JSX. React lo transforma a JavaScript puro.

## Cómo se escriben las cosas

```jsx
export default function Tarjeta({ nombre }) {
  return (
    <div className="tarjeta">
      <h1 style={{ color: 'blue' }}>{nombre}</h1>
      <p>Bienvenido</p>
    </div>
  );
}
```

### Reglas sagradas de JSX

| Regla | Explicación | Cómo se hace |
|-------|-------------|--------------|
| **Un solo padre** | Solo podés devolver UN elemento raíz | Envolvé todo en `<div>` o `<> </>` (fragment) |
| **className, no class** | `class` es palabra reservada en JS | `<div className="mi-clase">` |
| **style es un objeto** | No va como string, va como `{}` | `<p style={{ color: 'red', fontSize: 20 }}>` |
| **Llaves `{}` = JavaScript** | Abrís una ventana a JS adentro del HTML | `{nombre}`, `{2 + 2}`, `{fn()}` |

### Fragment — el div invisible

```jsx
export default function Grupo() {
  return (
    <>
      <h1>Título</h1>
      <p>Párrafo</p>
    </>
  );
}
// El <> no renderiza nada. Es solo para cumplir la regla del padre único.
```

### Las llaves son la clave de todo

```jsx
export default function Ejemplo() {
  const nombre = 'Martina';
  const activo = true;

  return (
    <div>
      <h1>{nombre}</h1>
      <p>{activo ? 'Está activa 🟢' : 'Está inactiva 🔴'}</p>
      <p>{2 + 2}</p>
      <p>{nombre.toUpperCase()}</p>
      <p>{new Date().toLocaleDateString()}</p>
    </div>
  );
}
```

> **Recordá:** adentro de `{}` va cualquier expresión JavaScript. NO va un `if` ni un `for`. Expresiones = cosas que DEVUELVEN un valor.

### Operadores lógicos en JSX — `&&`, `||`, ternario

Como no podés usar `if` adentro de JSX, usás estos tres operadores. Son expresiones, devuelven un valor.

#### `&&` — "mostrá esto SOLO si se cumple"

```jsx
export default function Alerta({ mensaje }) {
  return (
    <div>
      {mensaje && <div className="alerta">⚠️ {mensaje}</div>}
    </div>
  );
}
```

> Si `mensaje` es `true` (existe), React muestra el `<div>`. Si es `false`, `null`, `undefined` o `""` (falsy), React no muestra nada.

**Cómo pensar `&&` en JSX:**

```
condición && <Componente />
```

Si la condición es verdadera → devuelve `<Componente />`.  
Si es falsa → devuelve `false`, React no renderiza nada.

#### `||` — "mostrá esto si no hay otro valor"

```jsx
export default function Avatar({ usuario }) {
  return (
    <div>
      <img src={usuario.foto || '/default.png'} alt={usuario.nombre} />
    </div>
  );
}
```

> Si `usuario.foto` existe la usa. Si no (`undefined`, `null`, `""`), usa `'/default.png'`.

#### Ternario `? :` — "elegí entre dos opciones"

```jsx
export default function Item({ producto }) {
  return (
    <div>
      <h3>{producto.nombre}</h3>
      <p>
        {producto.stock > 0
          ? `✅ ${producto.stock} en stock`
          : '❌ Sin stock'}
      </p>
    </div>
  );
}
```

**Estructura del ternario:**

```
condición ? "esto si es true" : "esto si es false"
```

Es un `if/else` en una sola línea. Y como devuelve un valor, podés usarlo adentro de `{}`.

#### Ejemplo combinado

```jsx
export default function Perfil({ usuario }) {
  return (
    <div>
      <h1>{usuario.nombre || 'Invitado'}</h1>
      {usuario.admin && <span>👑 Admin</span>}
      <p>{usuario.edad ? `${usuario.edad} años` : 'Edad no especificada'}</p>
    </div>
  );
}
```

---

# 3️⃣ `.map()` — transformá listas como un campeón

`.map()` es un método de array que **crea un NUEVO array** aplicando una función a cada elemento.

```js
const numeros = [1, 2, 3];
const duplicados = numeros.map(n => n * 2);
// duplicados → [2, 4, 6]
```

En React lo usás para convertir datos en JSX:

```jsx
export default function ListaAlumnos() {
  const alumnos = ['Ana', 'Luis', 'Sofía', 'Carlos'];

  return (
    <ul>
      {alumnos.map((nombre, index) => (
        <li key={index}>{nombre}</li>
      ))}
    </ul>
  );
}
```

## Cómo se lee

```
alumnos = ['Ana', 'Luis', 'Sofía', 'Carlos']

.map() agarra cada uno:
  'Ana'    → <li>Ana</li>
  'Luis'   → <li>Luis</li>
  'Sofía'  → <li>Sofía</li>
  'Carlos' → <li>Carlos</li>

Resultado: [<li>Ana</li>, <li>Luis</li>, <li>Sofía</li>, <li>Carlos</li>]
```

## Con objetos (lo más común)

```jsx
const productos = [
  { id: 1, nombre: 'Teclado', precio: 85 },
  { id: 2, nombre: 'Mouse', precio: 45 },
  { id: 3, nombre: 'Monitor', precio: 350 },
];

export default function ListaProductos() {
  return (
    <div>
      {productos.map(p => (
        <div key={p.id}>
          <h3>{p.nombre}</h3>
          <p>${p.precio}</p>
        </div>
      ))}
    </div>
  );
}
```

### ⚠️ La key importa y no es joda

```jsx
// ✅ BIEN — usá un ID único
productos.map(p => <div key={p.id}>...</div>)

// ❌ MAL — el índice cambia si la lista se modifica
productos.map((p, i) => <div key={i}>...</div>)
```

> React usa la `key` para identificar cada elemento. Si usás el índice y metés un elemento al principio, React mezcla todo. Usá IDs.

---

# 4️⃣ Eventos en React — escuchá al usuario

En HTML común:

```html
<button onclick="saludar()">Saludar</button>
```

En React:

```jsx
<button onClick={saludar}>Saludar</button>
```

Tres diferencias clave:

| HTML | React |
|------|-------|
| `onclick` (minúscula) | `onClick` (camelCase) |
| `onchange` | `onChange` |
| `onsubmit` | `onSubmit` |
| Pasás un string: `"fn()"` | Pasás la función: `{fn}` |

### Pasar la función vs. llamarla

En los eventos de React siempre se pasa la función, no el resultado de llamarla.

#### Sin parámetros

```jsx
<button onClick={saludar}>Click</button>
//           └───────┘
//       se pasa saludar (la función)
```

React guarda `saludar` y la ejecuta cuando el usuario hace click.

#### Con parámetros

```jsx
<button onClick={() => elegir('Manzana')}>Manzana</button>
//           └─────────────────────────┘
//       se pasa una función nueva que llama a elegir('Manzana')
```

La arrow `() =>` crea una función envoltorio. React guarda esa arrow. Cuando el usuario hace click, React ejecuta la arrow, y la arrow ejecuta `elegir('Manzana')`.

#### Los tres casos lado a lado

```jsx
export default function ListaFrutas() {
  function elegir(fruta) {
    alert(`Elegiste ${fruta}`);
  }

  return (
    <div>
      {/* ✅ Sin parámetros: pasa la función directo */}
      <button onClick={elegir}>Elegir fruta</button>

      {/* ❌ Con parámetros MAL: se ejecuta en el render */}
      <button onClick={elegir('Manzana')}>Manzana</button>

      {/* ✅ Con parámetros BIEN: arrow envuelve la llamada */}
      <button onClick={() => elegir('Manzana')}>Manzana</button>
    </div>
  );
}
```

> `onClick={elegir}` → pasa la función.  
> `onClick={elegir('Manzana')}` → ejecuta la función inmediatamente.  
> `onClick={() => elegir('Manzana')}` → crea una función que se ejecutará después.

**Paso a paso:**

```
1. React renderiza el componente
2. Encuentra onClick={() => elegir('Manzana')}
3. Guarda la arrow function
4. El usuario hace click
5. React ejecuta la arrow function
6. La arrow ejecuta elegir('Manzana') → aparece el alert
```

### El parámetro `e` (evento)

```jsx
export default function Formulario() {
  function manejarSubmit(e) {
    e.preventDefault(); // 🔴 CORTA la recarga de página
    console.log('Form enviado');
  }

  return (
    <form onSubmit={manejarSubmit}>
      <input type="text" />
      <button type="submit">Enviar</button>
    </form>
  );
}
```

> El parámetro `e` es el **evento**. React te pasa una versión envuelta del evento del navegador. `e.preventDefault()` es el más común: evita comportamientos default (como recargar la página en un form).

---

# 5️⃣ `useState` — el plato fuerte

## El problema que resuelve

Vos tenés una variable:

```js
let contador = 0;
```

Si hacés `contador = 5`, React no se entera. La pantalla no cambia.

Necesitás una variable que **React SEPA** que cambió. Ahí entra `useState`:

```jsx
import { useState } from 'react';

export default function Contador() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>Valor: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>+1</button>
    </div>
  );
}
```

## Cómo se lee esta línea mágica

```jsx
const [valor, setValor] = useState(0);
//        ▲         ▲              ▲
//        │         │              └── valor inicial (arranca en 0)
//        │         └── función para CAMBIAR el valor
//        └── valor ACTUAL (solo lectura, nunca asignación directa)
```

> **Destructuring de array.** `useState` devuelve un array con dos cosas: [0] el valor, [1] la función para cambiarlo. Con `const [x, setX] = ...` los agarramos con nombre.

## El ciclo de vida de un estado

```
1. Componente se renderiza por primera vez
2. useState(0) → contador = 0
3. Usuario hace click → setContador(contador + 1)
4. React detecta que contador cambió
5. React RE-RENDERIZA el componente (vuelve a ejecutar la función)
6. useState(0) → IGNORA el 0 porque ya existe un valor: 1
7. La pantalla se actualiza sola
```

## Ejemplo 1: Contador con límites

```jsx
export default function ContadorLimitado() {
  const [contador, setContador] = useState(0);

  return (
    <div>
      <p>{contador}</p>
      <button
        onClick={() => setContador(contador + 1)}
        disabled={contador >= 10}
      >
        +1
      </button>
      <button
        onClick={() => setContador(contador - 1)}
        disabled={contador <= 0}
      >
        -1
      </button>
      {contador >= 10 && <p style={{ color: 'red' }}>Límite alcanzado ⛔</p>}
      {contador <= 0 && <p style={{ color: 'orange' }}>No podés bajar más ⛔</p>}
    </div>
  );
}
```

## Ejemplo 2: Input controlado

```jsx
export default function SaludoPersonalizado() {
  const [nombre, setNombre] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Escribí tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <p>
        {nombre
          ? `Hola, ${nombre} 👋`
          : 'Esperando que escribas algo...'}
      </p>
    </div>
  );
}
```

> `onChange` se dispara en CADA tecla. `e.target.value` tiene lo que escribió el usuario. Con `setNombre` actualizamos el estado, y React actualiza el `value` del input y el `<p>`.

## Ejemplo 3: Estado con objetos

```jsx
export default function Perfil() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    edad: '',
  });

  const actualizar = (campo, valor) => {
    setUsuario({ ...usuario, [campo]: valor });
  };

  return (
    <div>
      <input
        placeholder="Nombre"
        value={usuario.nombre}
        onChange={(e) => actualizar('nombre', e.target.value)}
      />
      <input
        placeholder="Email"
        value={usuario.email}
        onChange={(e) => actualizar('email', e.target.value)}
      />
      <input
        type="number"
        placeholder="Edad"
        value={usuario.edad}
        onChange={(e) => actualizar('edad', e.target.value)}
      />
      <div>
        <h3>Vista previa</h3>
        <p>Nombre: {usuario.nombre || '—'}</p>
        <p>Email: {usuario.email || '—'}</p>
        <p>Edad: {usuario.edad || '—'}</p>
      </div>
    </div>
  );
}
```

> El `...usuario` (spread operator) copia todas las propiedades viejas y después pisás solo la que cambiás. Sin el spread, **perdés las otras propiedades**.

## Regla de ORO (no la rompas)

```jsx
// ❌ MAL — React nunca se entera
contador = 5;
usuario.nombre = 'Ana';

// ✅ BIEN — React reacciona
setContador(5);
setUsuario({ ...usuario, nombre: 'Ana' });
```

### Checklist mental cada vez que usás estado

```
□ ¿importé { useState } de 'react'?
□ ¿usé const [algo, setAlgo] = useState(valorInicial)?
□ ¿NUNCA asigné directamente (algo = x)?
□ ¿Siempre usé setAlgo() para cambiar?
□ Si es objeto: ¿usé ... spread para no perder propiedades?
```

---

# 🏋️ Reto: Calculadora

Ahora te toca a vos. Con lo que vimos —arrow functions, JSX, `.map()`, eventos y useState— estás listo para armar una **calculadora funcional**.

## Consigna

Armá una calculadora que tenga:

- **4 botones de operación:** Sumar, Restar, Multiplicar, Dividir
- **2 inputs numéricos** para los operandos
- **Un resultado** que se actualice cuando cambien los inputs o la operación
- **Validación mínima:** mostrá "Error" si se divide por cero
- **Estilo mínimo:** un contenedor centrado, inputs prolijos, botones que se vean bien. No hace falta magia CSS, solo que sea legible.

## Diseño sugerido

```
┌──────────────────────────────┐
│        CALCULADORA           │
│                              │
│  ┌──────────┐  ┌──────────┐  │
│  │    5     │  │    3     │  │
│  └──────────┘  └──────────┘  │
│                              │
│  [+]  [-]  [×]  [÷]         │
│                              │
│  ┌──────────────────────┐    │
│  │  Resultado: 8        │    │
│  └──────────────────────┘    │
└──────────────────────────────┘
```

## Pistas (si las necesitas)

- Usá **un solo estado** para la operación: `const [operacion, setOperacion] = useState('suma')`
- Usá **dos estados** para los números: `const [num1, setNum1] = useState('')` y `const [num2, setNum2] = useState('')`
- El resultado lo calculás en el render con una función, no lo guardes en estado (es un valor DERIVADO)

```jsx
const calcular = () => {
  const a = Number(num1);
  const b = Number(num2);
  switch (operacion) {
    case 'suma': return a + b;
    case 'resta': return a - b;
    case 'multiplicacion': return a * b;
    case 'division': return b === 0 ? 'Error: división por cero' : a / b;
    default: return 0;
  }
};
```

---

# 📚 Resumen rápido

| Concepto | Explicación |
|----------|-------------|
| **Arrow function** | `() => {}` — creás funciones cortas. En eventos: `onClick={() => fn()}` |
| **Eventos** | `onClick`, `onChange`, `onSubmit` en camelCase. Pasás la función, no la llamada |
| **JSX** | HTML que escribís en JS. Llaves `{}` para meter JavaScript. `className` reemplaza `class` |
| **`&&` / `||` / ternario** | Control de flujo adentro de JSX. `{cond && <X/>}`, `{valor || fallback}`, `{cond ? <A/> : <B/>}` |
| **`.map()`** | Convertí arrays en JSX. `datos.map(item => <li key={item.id}>{item}</li>)` |
| **useState** | `const [x, setX] = useState(valorInicial)`. Cambiás con `setX()`, nunca asignando directo |
| **Valor derivado** | Si algo se puede calcular con los estados que ya tenés, NO lo pongas en otro estado |
| **spread operator** | `{ ...objeto, clave: nuevoValor }` — actualizás una propiedad sin perder las demás |

---

> **Manos al código.** Copiá los ejemplos, modificalos, rompelos, arreglalos. Vas a aprender mucho más escribiendo código que leyendo teoría.
>
> *"No entendés React hasta que codeas un estado y ves cómo se actualiza la pantalla sola."*
