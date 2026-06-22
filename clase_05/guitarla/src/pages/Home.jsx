import { Link } from "react-router-dom";

export default function Home(){
   return(
      <div>
         <h1>Bienvenidos a mi Tienda de Guitarras</h1>
         <p>Expertos en musica e instrumentos</p>
         <Link to="/contacto">Ir a la pagina Contactanos</Link> 
         <Link to="/acerca">Ir a Acerca de nosotros</Link>
      </div>
   )
}