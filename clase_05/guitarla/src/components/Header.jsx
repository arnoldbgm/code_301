import { Link } from "react-router-dom";

export default function Header(){
   return (
      <nav className="bg-amber-500 h-10 p-5 rounded-4xl flex gap-2">
         <Link to="/">Inicio</Link>
         <Link to="/contacto">Contactanos</Link>
         <Link to="/acerca">Acerca</Link>
      </nav>
   )
}