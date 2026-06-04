export default function Test() {

   const nombre = "Arnold"
   const mayorEdad = false
   const oficios = ["actor", "cineasta", "gobernante"]
   const edad = 30

   return (
      <>
         <h1>Hola {nombre}</h1>
         <p>El tiene { 14 + 25} años</p>
         <p>El es ademas {oficios[0]}</p>
         <p>{ mayorEdad ? "Si es mayor" : "No es mayor" }</p>
         <p>{ edad > 15 ? "Adelante pasa" : "Retirate"}</p>
      </>
   )
}