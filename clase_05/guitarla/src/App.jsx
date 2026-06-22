import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Contactanos from "./pages/Contactanos"
import Acerca from "./pages/Acerca"
import Error404 from "./pages/Error404"
import Layout from "./pages/Layout"
import Producto from "./pages/Producto"

export default function App() {
  // El App va actuar como nuestro enrutador
  // Es decir aqui podemos definir si una persona
  // Entra a una determina ruta, que componente debe 
  // de mostrarse
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contactanos />} />
        <Route path="/acerca" element={<Acerca />} />
        <Route path="/productos/:id" element={<Producto />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  )
}