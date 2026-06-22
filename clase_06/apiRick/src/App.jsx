import { useEffect } from "react"
import { useState } from "react"
import { ClipLoader } from "react-spinners"

export default function App() {

  const [carga, setCarga] = useState(true)
  // Este codigo solo se usara cuando se haga el llamado a una API
  const [personaje, setPersonaje] = useState([])
  useEffect(() => {
    async function obtenerPersonajes() {
      try {
        const respuesta = await fetch("https://rickandmortyapi.com/api/character")
        const data = await respuesta.json()
        setCarga(false)
        console.log(data.results)
        setPersonaje(data.results)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerPersonajes()
  }, [])

  if(carga){
    return <ClipLoader/>
  }

  return (
    <div>
      {personaje.map((elmt) => (
        <div className="bg-blue-900 w-60 p-4 rounded-3xl mb-2">
          <h2 className="text-white">Nombre: {elmt.name}</h2>
          <h3 className="text-white">Estado: {elmt.status}</h3>
          <img className="rounded-3xl" src={elmt.image} alt="" />
        </div>
      ))}
    </div>
  )
}