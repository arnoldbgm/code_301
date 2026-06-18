import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductoPage from "../pages/ProductoPage";
import VentasPage from "../pages/VentasPage";
import LayoutPage from "../layout/LayoutPage";

export default function Enrutador() {
   return (
      <BrowserRouter>
         <Routes>
            <Route element={<LayoutPage/>}>
               <Route path="/" element={<ProductoPage />} />
               <Route path="/ventas" element={< VentasPage />} />
            </Route>
         </Routes>
      </BrowserRouter>
   )
}