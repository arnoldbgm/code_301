export default function Form() {

   function enviarFormulario(event){
      event.preventDefault()
   }

   return (
      <form onSubmit={enviarFormulario}>
         <input type="text" />
         <button type="submit" className="bg-green-600">Enviar</button>
      </form>
   )
}