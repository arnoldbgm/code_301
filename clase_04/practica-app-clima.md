# 🧪 Práctica: App del Clima + Conversor

> **Instrucciones:** En cada paso te doy el HTML de un componente. Tu tarea es:
> 1. Crear el archivo `.jsx`
> 2. Envolver el HTML en un componente con `export default function`
> 3. Corregir los errores de JSX (`class` → `className`, `for` → `htmlFor`)
> 4. Agregar la lógica de React donde haga falta (props, eventos, useState, .map())

---

## ⚙️ Setup

```bash
pnpm create vite app-clima --template react
cd app-clima
pnpm install
pnpm dev
```

Borrá el contenido de `src/App.jsx` y `src/App.css`.

---

## Paso 1 — Los datos

Creá `src/data.js` con el array de ciudades. Esto ya viene sin errores:

```js
const ciudades = [
  { id: 1, nombre: 'Buenos Aires', temp: 28, condicion: 'Soleado', icono: '☀️' },
  { id: 2, nombre: 'Córdoba', temp: 32, condicion: 'Parcialmente nublado', icono: '⛅' },
  { id: 3, nombre: 'Rosario', temp: 22, condicion: 'Lluvioso', icono: '🌧️' },
  { id: 4, nombre: 'Mendoza', temp: 18, condicion: 'Nublado', icono: '☁️' },
  { id: 5, nombre: 'Bariloche', temp: 8, condicion: 'Nevado', icono: '❄️' },
];

export default ciudades;
```

---

## Paso 2 — CityCard

**Archivo:** `src/CityCard.jsx`

**HTML:**

```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
  <p class="text-4xl mb-2">☀️</p>
  <h3 class="text-lg font-bold text-slate-800">Buenos Aires</h3>
  <p class="text-2xl font-semibold text-indigo-600">28°C</p>
  <p class="text-sm text-slate-500">Soleado</p>
</div>
```

**Consigna:**
- Creá el componente `CityCard`
- Recibe `{ nombre, temp, condicion, icono }` por props
- Reemplazá los valores fijos por las props
- Corrige el error que hay en un atributo


**Probá:** Importá CityCard en App, pasale una ciudad hardcodeada (enviar una ciudad en duro), y fijate si se ve bien.

---

## Paso 3 — CityList

**Archivo:** `src/CityList.jsx`

**HTML:**

```html
<div>
  <h2 class="text-xl font-bold text-slate-800 mb-4">🌍 Ciudades</h2>
  <div class="grid grid-cols-3 gap-4">
    <!-- acá va UNA card por cada ciudad -->
  </div>
</div>
```

**Consigna:**
- Importá `ciudades` desde `./data`
- Importá `CityCard` desde `./CityCard`
- Usá `.map()` para renderizar una `CityCard` por cada ciudad
- **Cuidado:** Cada `CityCard` necesita un `key`. ¿Qué valor le pondrías?

**Probá:** Importá CityList en App. ¿Ves las 5 ciudades?

---

## Paso 4 — App (layout principal)

**Archivo:** `src/App.jsx`

**HTML:**

```html
<div class="min-h-screen bg-slate-50 p-6">
  <h1 class="text-3xl font-bold text-center text-slate-800 mb-8">
    ⛅ App del Clima
  </h1>

  <div class="max-w-4xl mx-auto">
    <!-- acá va CityList -->

    <h2 class="text-xl font-bold text-slate-800 mb-4 mt-8">🔄 Conversor de Temperatura</h2>
    <div class="grid grid-cols-2 gap-4">
      <!-- acá van los dos conversores -->
    </div>
  </div>
</div>
```

**Consigna:**
- Importá `CityList`
- Corregí `class` → `className`
- Por ahora los conversores dejalos comentados, los creamos a continuación

---

## Paso 5 — CelsiusConverter

**Archivo:** `src/CelsiusConverter.jsx`

**HTML:**

```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  <h3 class="font-semibold text-slate-800 mb-3">°C → °F</h3>
  <input type="number" class="w-full rounded-lg border border-slate-300 px-3 py-2 mb-2" placeholder="Ej: 25" />
  <button class="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium">Convertir a °F</button>
  <p class="mt-3 text-lg font-semibold text-indigo-600">77 °F</p>
</div>
```

**Consigna:**
- Corregí `class` → `className`
- Agregá `useState`: necesitás un estado para el valor del input (`celsius`) y otro para el resultado (`resultado`)
- El input tiene que ser controlado: `value={celsius}` + `onChange`
- El botón tiene que ejecutar la conversión al hacer click. **Ojo:** `onClick={fn()}` ejecuta la función en el render, no al hacer click. Pasá la función, no la llamada.
- **Fórmula:** `°F = °C × 9/5 + 32`
- Si el input está vacío, no hagas la conversión
- El resultado solo se muestra si existe (`{resultado && <p>...</p>}`)

**Probá:** Importalo en App. Escribí 25, apretá el botón → ¿ves "77 °F"?

---

## Paso 6 — FahrenheitConverter

**Archivo:** `src/FahrenheitConverter.jsx`

**HTML:**

```html
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
  <h3 class="font-semibold text-slate-800 mb-3">°F → °C</h3>
  <input type="number" class="w-full rounded-lg border border-slate-300 px-3 py-2 mb-2" placeholder="Ej: 77" />
  <button class="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium">Convertir a °C</button>
  <p class="mt-3 text-lg font-semibold text-indigo-600">25 °C</p>
</div>
```

**Consigna:**
- Misma estructura que CelsiusConverter pero al revés
- **Fórmula:** `°C = (°F − 32) × 5/9`
- **Atención:** acá también necesitás DOS estados. Una variable común (`let resultado = ''`) no funciona — React no vigila las variables comunes, solo vigila el estado.

**Probá:** Importalo en App. Escribí 77, apretá el botón → ¿ves "25 °C"?

---

## Paso 7 — Uní todo en App

Descomentá los conversores en `App.jsx` y verifica que se vean lado a lado en un grid de 2 columnas.

---

## Verificación final

- [ ] ¿Las 5 ciudades se renderizan con `.map()`?
- [ ] ¿Cada card tiene ícono, nombre, temperatura y condición?
- [ ] ¿No hay errores de `class` en la consola? (solo debe haber `className`)
- [ ] ¿CityList tiene `key={c.id}`?
- [ ] ¿El conversor °C → °F funciona? (25°C → 77°F)
- [ ] ¿El conversor °F → °C funciona? (77°F → 25°C)
- [ ] ¿Si el input está vacío y apretás el botón, no pasa nada raro?
- [ ] ¿Los `onClick` pasan la función sin paréntesis?

---

Mostrale el resultado al profe cuando funcione todo. 🎉
