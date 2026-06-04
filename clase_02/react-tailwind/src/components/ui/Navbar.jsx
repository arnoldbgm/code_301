export default function Navbar() {
   return (
      <header className="bg-white shadow-sm sticky top-0 z-10">
         <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-indigo-600">LinkUp</h1>
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
               <a href="#" className="hover:text-indigo-600 transition">Inicio</a>
               <a href="#" className="hover:text-indigo-600 transition">Funciones</a>
               <a href="#" className="hover:text-indigo-600 transition">Precios</a>
               <a href="#" className="hover:text-indigo-600 transition">Contacto</a>
            </nav>
         </div>
      </header>
   )
}