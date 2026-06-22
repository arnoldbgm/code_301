import { useState } from "react";

export default function Button() {

   // let numero = 5

   // function aumentarNumero(){
   //    numero = numero + 1;
   //    console.log(numero)
   // }

   // Los hooks son funciones propias de react que nos permiten
   // modificar el estado
   // useState

   // 1. Importar el hook useState

   const [ numero, setNumero ] = useState(0)
   //                            useState("")
   //                            useState(false)
   //                            usestate([])

   function restarNumero(){
      setNumero(numero - 1)
   }
   return (
      <>
         <button
            className="bg-blue-500"
            onClick={() => setNumero(numero + 1)}
         >
             + 1
         </button>

         <button 
            className="bg-red-400"
            onClick={restarNumero}
         >
             - 1 
         </button>

         <p>Estamos en el numero {numero}</p>
      </>
   )
}