# Reto: Armá la web de LinkUp

## Objetivo

Abajo tenes el HTML de **5 componentes** con errores. No hay funciones ni exports — eso lo tenes que escribir vos. Tu tarea es:

1. Crear cada componente en su propio archivo (ej: `Navbar.jsx`)
2. Corregir los errores de JSX en cada uno
3. Importarlos y armarlos en `App.jsx`
4. La pagina final tiene que verse **identica** al `index.html` de esta carpeta

Tampoco te damos el `App.jsx` completo — solo un esqueleto. Decidi vos como acomodar cada componente.

## Reglas

- No podes modificar la estructura HTML ni los estilos de Tailwind
- Solo corregi los errores de sintaxis de JSX
- El `alt` vacio en las imagenes no es un error, es a proposito

---
## App

## 1 — `App.jsx`

```jsx
const App = () => {
  return (
    <div class="bg-slate-50 text-slate-800 font-sans antialiased">

      {/* AQUI VAN TODOS TUS COMPONENTES,
      NO TE OLVIDES DE COLOCAR LOS ESTILOS QUE HEMOS CREADO */}

    </div>
  );
};

export default App;
```

## Componentes

### 1 — `Navbar.jsx`

```html
<header class="bg-white shadow-sm sticky top-0 z-10">
  <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
    <h1 class="text-2xl font-bold text-indigo-600">LinkUp</h1>
    <nav class="flex gap-6 text-sm font-medium text-slate-600">
      <a href="#" class="hover:text-indigo-600 transition">Inicio</a>
      <a href="#" class="hover:text-indigo-600 transition">Funciones</a>
      <a href="#" class="hover:text-indigo-600 transition">Precios</a>
      <a href="#" class="hover:text-indigo-600 transition">Contacto</a>
    </nav>
  </div>
</header>
```

### 2 — `Hero.jsx`

```html
<section class="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
  <h2 class="text-4xl font-extrabold text-slate-900 sm:text-5xl">
    Conectate con quien mas importa
  </h2>
  <p class="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
    LinkUp es la plataforma que te acerca a tus colegas, mentores y proyectos.
    Todo en un solo lugar.
  </p>
  <div class="mt-8 flex justify-center gap-4">
    <a href="#" class="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition">Empeza gratis</a>
    <a href="#" class="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Saber mas</a>
  </div>
</section>
```

### 3 — `Card.jsx`

```html
<article class="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
  <img
    src="https://static.vecteezy.com/system/resources/thumbnails/058/144/254/small/beautiful-flowers-wallpaper-image-of-flowers-free-photo.jpg"
    alt=""
    class="w-full h-48 object-cover"
  />
  <div class="p-6">
    <div class="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
      <span class="text-indigo-600 text-lg font-bold">{numero}</span>
    </div>
    <h4 class="text-lg font-semibold text-slate-900">{titulo}</h4>
    <p class="mt-2 text-sm text-slate-500">{descripcion}</p>
  </div>
</article>
```

> Pista: este componente recibe `props`. Fijate como declararlo.

### 4 — `ContactForm.jsx`

```html
<section class="bg-white py-16 border-t border-slate-200">
  <div class="max-w-xl mx-auto px-6">
    <h3 class="text-2xl font-bold text-center text-slate-900 mb-8">Contactanos</h3>
    <form class="space-y-5">

      <div>
        <label for="nombre" class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
        <input type="text" id="nombre" name="nombre" class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tu nombre" />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" id="email" name="email" class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tu@email.com" />
      </div>

      <div>
        <label for="mensaje" class="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="4" class="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Escribi tu mensaje..."></textarea>
      </div>

      <button type="submit" class="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition">Enviar mensaje</button>
    </form>
  </div>
</section>
```

### 5 — `Footer.jsx`

```html
<footer class="bg-slate-800 text-slate-400 text-sm text-center py-6">
  <p>&copy; 2026 LinkUp. Todos los derechos reservados.</p>
</footer>
```


---

## Pistas (solo si te trabas)

- En JSX los atributos HTML tienen nombres distintos
- Fijate bien en `class` y en `for`
- Son los unicos dos errores que hay en todos los componentes
- Son 40 errores en total (37 de `class` + 3 de `for`)

---

## Resolve

Cuando corrijas todo, la pagina deberia verse identica a `index.html`. Si ves diferencias, revisa que no hayas dejado pasar algun `class` o `for` sin convertir.

Si terminaste, mostra el resultado al profe antes de seguir.
