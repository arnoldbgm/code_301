# Supabase + React — Storage: subir y mostrar imágenes

> **Nivel:** Intermedio — asumimos el patrón CRUD de la guía 01
> **React 19 · Vite 8 · Supabase js v2**
> *"Guardás el nombre del archivo, no la URL."*

---

## 📋 Qué vamos a ver

| # | Tema |
|---|------|
| 1 | ⚡ Referencia rápida: Storage API |
| 2 | Creamos el bucket y la columna en imagenes |
| 3 | Subir archivo a Storage |
| 4 | Guardar el nombre en la base de datos |
| 5 | Mostrar imágenes desde Storage |
| 6 | 🧠 CRUD completo de imagenes con foto |
| 7 | 🏋️ Bonus: reemplazar y eliminar imagen |

---

## 1️⃣ ⚡ Referencia rápida: Storage API

Todo archivo se sube a un **bucket**. En la DB guardás el **path** del archivo. Para mostrar, generás la **URL pública** en el momento.

### Subir archivo

```js
let { data, error } = await supabase.storage
  .from('imagenes')
  .upload('nombre-del-archivo.jpg', archivoFile)
// data.path → 'nombre-del-archivo.jpg'
```

### Generar URL pública para mostrar

```js
let { data } = supabase.storage
  .from('imagenes')
  .getPublicUrl('nombre-del-archivo.jpg')
// data.publicUrl → 'https://xxx.supabase.co/storage/v1/object/public/imagenes/nombre-del-archivo.jpg'
```

### Eliminar archivo

```js
let { data, error } = await supabase.storage
  .from('imagenes')
  .remove(['nombre-del-archivo.jpg'])
```

### Input file en React

```jsx
<input
  type="file"
  accept="image/*"
  onChange={e => setArchivo(e.target.files[0])}
/>
```

`e.target.files[0]` te da el objeto `File` que espera `.upload()`.

### El flujo en una frase

```
upload → path → guardar path en DB → leer path de DB → getPublicUrl(path) → mostrar
```

---

## 2️⃣ Creamos el bucket y la columna en imagenes

### Bucket en Supabase Dashboard

1. Supabase → Storage → Create bucket
2. Nombre: `imagenes`
3. ✅ Public bucket

También podés crearlo con SQL:

```sql
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true);
```

### Agregar columna a imagenes

La tabla `imagenes` ya existe de la guía 01. Solo falta agregar la columna para guardar el nombre del archivo.

```sql
alter table imagenes
add column imagen_url text;
```

> `imagen_url` guarda el **nombre del archivo** (ej: `1712345678900-messi.jpg`), no la URL completa.

Schema de `imagenes` después del ALTER:

| Columna | Tipo |
|---------|------|
| id | int8 (PK) |
| nombre | text |
| edad | int2 |
| posicion | text |
| equipo_id | int8 (FK → equipos.id) |
| imagen_url | text |

---

## 3️⃣ Subir archivo a Storage

Conectamos React con Storage.

### Cliente Supabase

Ya deberías tenerlo de la guía 01. Si no, crealo en `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### Componente que sube una foto

`src/pages/SubirFotoJugador.jsx`:

```jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SubirFotoJugador() {
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!archivo) return

    setSubiendo(true)

    let nombreUnico = `${Date.now()}-${archivo.name}`

    let { data, error } = await supabase.storage
      .from('imagenes')
      .upload(nombreUnico, archivo)

    if (error) {
      alert('Error al subir: ' + error.message)
    } else {
      alert('Subido correctamente. Path: ' + data.path)
    }

    setSubiendo(false)
  }

  return (
    <div>
      <h1>Subir foto</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={e => setArchivo(e.target.files[0])}
        />
        <button type="submit" disabled={subiendo}>
          {subiendo ? 'Subiendo...' : 'Subir'}
        </button>
      </form>
    </div>
  )
}
```

### ¿Qué pasó acá?

1. Capturás el archivo con `input type="file"`
2. Generás un nombre único con `Date.now()` para evitar que se pisen archivos
3. Llamás a `.upload()` y Storage te devuelve `data.path`

Hasta acá el archivo ya está en Supabase Storage. Ahora falta guardar el path en la DB.

---

## 4️⃣ Guardar el nombre en la base de datos

El paso anterior solo subió el archivo. Ahora conectamos eso con el registro del jugador.

`src/pages/SubirFotoJugador.jsx`:

```jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SubirFotoJugador() {
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [posicion, setPosicion] = useState('')
  const [equipoId, setEquipoId] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!archivo || !nombre) return

    setSubiendo(true)

    // 1 — Subir a Storage
    let nombreUnico = `${Date.now()}-${archivo.name}`
    let { data: storageData, error: storageError } = await supabase.storage
      .from('imagenes')
      .upload(nombreUnico, archivo)

    if (storageError) {
      alert('Error al subir imagen: ' + storageError.message)
      setSubiendo(false)
      return
    }

    // 2 — Guardar solo el path en la tabla
    let { error: dbError } = await supabase
      .from('imagenes')
      .insert({
        nombre,
        edad: parseInt(edad),
        posicion,
        equipo_id: parseInt(equipoId),
        imagen_url: storageData.path   // ← guardamos el path, NO la URL
      })

    if (dbError) {
      alert('Error al guardar: ' + dbError.message)
    } else {
      alert('Jugador creado')
      setNombre('')
      setEdad('')
      setPosicion('')
      setEquipoId('')
      setArchivo(null)
    }

    setSubiendo(false)
  }

  return (
    <div>
      <h1>Nuevo jugador</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={e => setEdad(e.target.value)}
          required
        />
        <input
          placeholder="Posición"
          value={posicion}
          onChange={e => setPosicion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID del equipo"
          value={equipoId}
          onChange={e => setEquipoId(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setArchivo(e.target.files[0])}
          required
        />
        <button type="submit" disabled={subiendo}>
          {subiendo ? 'Guardando...' : 'Guardar jugador'}
        </button>
      </form>
    </div>
  )
}
```

### Lo que cambió

| Antes (mal) | Ahora (bien) |
|---|---|
| `getPublicUrl()` → guardar URL completa | Guardar `storageData.path` directo |
| La URL queda fija y puede vencerse | El path es inmutable, la URL se genera al leer |

---

## 5️⃣ Mostrar imágenes desde Storage

Ahora leemos los imagenes. Por cada uno, tomamos `imagen_url` (que es el path) y generamos la URL pública con `getPublicUrl()`.

`src/pages/Jugadores.jsx`:

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Jugadores() {
  const [imagenes, setJugadores] = useState([])

  useEffect(() => {
    cargarJugadores()
  }, [])

  async function cargarJugadores() {
    let { data, error } = await supabase
      .from('imagenes')
      .select('*, equipo:equipos(nombre)')
      .order('nombre')

    if (!error) setJugadores(data)
  }

  function obtenerUrl(path) {
    if (!path) return null
    let { data } = supabase.storage
      .from('imagenes')
      .getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div>
      <h1>Jugadores</h1>

      <ul>
        {imagenes.map(j => (
          <li key={j.id}>
            {j.imagen_url ? (
              <img
                src={obtenerUrl(j.imagen_url)}
                alt={j.nombre}
              />
            ) : (
              <span>Sin foto</span>
            )}
            <br />
            {j.nombre} — {j.edad} años — {j.posicion}
            <br />
            Equipo: {j.equipo?.nombre}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### ¿Qué pasó acá?

1. `.select('*, equipo:equipos(nombre)')` trae imagenes con su equipo
2. La función `obtenerUrl(path)` recibe el path y devuelve la URL pública
3. En el `src` del `<img>` llamamos a `obtenerUrl(j.imagen_url)`
4. Si no hay path, mostramos "Sin foto"

No guardamos URLs en la DB. Las generamos en el momento.

---

## 6️⃣ 🧠 CRUD completo de imagenes con foto

Todo junto: crear, listar, editar y eliminar imagenes con imagen.

```jsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Jugadores() {
  const [imagenes, setJugadores] = useState([])
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [posicion, setPosicion] = useState('')
  const [equipoId, setEquipoId] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [editNombre, setEditNombre] = useState('')
  const [editEdad, setEditEdad] = useState('')
  const [editPosicion, setEditPosicion] = useState('')
  const [editEquipoId, setEditEquipoId] = useState('')
  const [editArchivo, setEditArchivo] = useState(null)

  useEffect(() => {
    cargarJugadores()
  }, [])

  async function cargarJugadores() {
    let { data, error } = await supabase
      .from('imagenes')
      .select('*, equipo:equipos(nombre)')
      .order('nombre')
    if (!error) setJugadores(data)
  }

  function obtenerUrl(path) {
    if (!path) return null
    let { data } = supabase.storage
      .from('imagenes')
      .getPublicUrl(path)
    return data.publicUrl
  }

  async function agregarJugador(e) {
    e.preventDefault()
    if (!archivo) return

    let nombreUnico = `${Date.now()}-${archivo.name}`
    let { data: storageData, error: storageError } = await supabase.storage
      .from('imagenes')
      .upload(nombreUnico, archivo)

    if (storageError) {
      alert('Error al subir imagen: ' + storageError.message)
      return
    }

    let { error: dbError } = await supabase
      .from('imagenes')
      .insert({
        nombre,
        edad: parseInt(edad),
        posicion,
        equipo_id: parseInt(equipoId),
        imagen_url: storageData.path
      })

    if (dbError) {
      alert('Error: ' + dbError.message)
    } else {
      setNombre('')
      setEdad('')
      setPosicion('')
      setEquipoId('')
      setArchivo(null)
      cargarJugadores()
    }
  }

  function iniciarEdicion(j) {
    setEditandoId(j.id)
    setEditNombre(j.nombre)
    setEditEdad(String(j.edad))
    setEditPosicion(j.posicion)
    setEditEquipoId(String(j.equipo_id))
    setEditArchivo(null)
  }

  async function guardarEdicion(id) {
    let imagenPath

    if (editArchivo) {
      let nombreUnico = `${Date.now()}-${editArchivo.name}`
      let { data: storageData, error: storageError } = await supabase.storage
        .from('imagenes')
        .upload(nombreUnico, editArchivo)

      if (storageError) {
        alert('Error al subir imagen: ' + storageError.message)
        return
      }

      imagenPath = storageData.path
    }

    let updates = {
      nombre: editNombre,
      edad: parseInt(editEdad),
      posicion: editPosicion,
      equipo_id: parseInt(editEquipoId)
    }

    if (imagenPath) updates.imagen_url = imagenPath

    let { error } = await supabase
      .from('imagenes')
      .update(updates)
      .eq('id', id)

    if (!error) {
      setEditandoId(null)
      cargarJugadores()
    }
  }

  async function eliminarJugador(id, path) {
    let confirmar = confirm('¿Eliminar este jugador?')
    if (!confirmar) return

    if (path) {
      await supabase.storage.from('imagenes').remove([path])
    }

    let { error } = await supabase
      .from('imagenes')
      .delete()
      .eq('id', id)

    if (!error) cargarJugadores()
  }

  return (
    <div>
      <h1>Jugadores</h1>

      <h2>Agregar jugador</h2>
      <form onSubmit={agregarJugador}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={e => setEdad(e.target.value)}
          required
        />
        <input
          placeholder="Posición"
          value={posicion}
          onChange={e => setPosicion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID del equipo"
          value={equipoId}
          onChange={e => setEquipoId(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setArchivo(e.target.files[0])}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      <h2>Listado</h2>
      <ul>
        {imagenes.map(j => (
          <li key={j.id}>
            {editandoId === j.id ? (
              <div>
                <input
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                />
                <input
                  type="number"
                  value={editEdad}
                  onChange={e => setEditEdad(e.target.value)}
                />
                <input
                  value={editPosicion}
                  onChange={e => setEditPosicion(e.target.value)}
                />
                <input
                  type="number"
                  value={editEquipoId}
                  onChange={e => setEditEquipoId(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setEditArchivo(e.target.files[0])}
                />
                <button onClick={() => guardarEdicion(j.id)}>Guardar</button>
                <button onClick={() => setEditandoId(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                {j.imagen_url ? (
                  <img
                    src={obtenerUrl(j.imagen_url)}
                    alt={j.nombre}
                  />
                ) : (
                  <span>Sin foto</span>
                )}
                <br />
                {j.nombre} — {j.edad} años — {j.posicion}
                <br />
                Equipo: {j.equipo?.nombre}
                <br />
                <button onClick={() => iniciarEdicion(j)}>✏️</button>
                <button onClick={() => eliminarJugador(j.id, j.imagen_url)}>🗑️</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Puntos clave

- En la DB guardás el **path**, no la URL
- Para mostrar, usás `getPublicUrl(path)` en el momento
- Al editar, si no hay archivo nuevo, el path se conserva
- Al eliminar, borrás de Storage y de la DB

---

## 7️⃣ 🏋️ Bonus: reemplazar y eliminar imagen

### Reemplazar imagen (sin cambiar datos del jugador)

```js
async function reemplazarImagen(jugadorId, pathViejo, archivoNuevo) {
  await supabase.storage.from('imagenes').remove([pathViejo])

  let nombreUnico = `${Date.now()}-${archivoNuevo.name}`
  let { data: storageData } = await supabase.storage
    .from('imagenes')
    .upload(nombreUnico, archivoNuevo)

  await supabase
    .from('imagenes')
    .update({ imagen_url: storageData.path })
    .eq('id', jugadorId)
}
```

### Eliminar solo la imagen (sin borrar el jugador)

```js
async function eliminarImagen(jugadorId, path) {
  await supabase.storage.from('imagenes').remove([path])

  await supabase
    .from('imagenes')
    .update({ imagen_url: null })
    .eq('id', jugadorId)
}
```

---

## 📋 Resumen

| Operación | Storage | DB |
|-----------|---------|-----|
| Crear jugador con foto | `.upload()` | `.insert()` con `imagen_url = path` |
| Leer imagenes | `.getPublicUrl(path)` | `.select('*')` |
| Editar (nueva foto) | `.upload()` + `.remove()` | `.update()` con nuevo path |
| Eliminar jugador | `.remove()` | `.delete()` |

### Flujo mental

```
Archivo → upload → path → guardar path en DB
                                        ↓
                         leer path de DB → getPublicUrl(path) → img
```
