import Link from "next/link";

export default function PaginaNoEncontrada() {
   return (
      <div>
         <h2>Lo sentimos pagina no encontrada</h2>
         <Link href="/"><button>Volver al inicio</button></Link>
      </div>
   )
}