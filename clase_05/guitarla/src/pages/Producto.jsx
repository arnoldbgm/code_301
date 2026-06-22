import { useParams } from "react-router-dom"


const guitarras = [
  { id: 1, nombre: 'Heritage Custom', marca: 'Luthier House', precio: 2450 },
  { id: 2, nombre: '1964 ES-335', marca: 'Gibson Vintage', precio: 8900 },
  { id: 3, nombre: 'OM-Series Artisan', marca: 'Luthier & Co.', precio: 3100 },
]

export default function Producto(){
   const { id } = useParams() // 2
   
   const guitarra = guitarras.find((elemt) => elemt.id === Number(id))

   if(!guitarra){
      return <h2>Producto no encontrado</h2>
   }

   return(
      <div>
         <h1>{guitarra.nombre}</h1>
         <p>$ {guitarra.precio}</p>
         <p>La marca es {guitarra.marca}</p>
      </div>
   )
}