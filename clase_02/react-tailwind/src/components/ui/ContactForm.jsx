export default function ContactForm() {
   return (
      <section className="bg-white py-16 border-t border-slate-200">
         <div className="max-w-xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-8">Contactanos</h3>
            <form className="space-y-5">

               <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input type="text" id="nombre" name="nombre" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Tu nombre" />
               </div>

               <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" id="email" name="email" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="tu@email.com" />
               </div>

               <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                  <textarea id="mensaje" name="mensaje" rows="4" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Escribi tu mensaje..."></textarea>
               </div>

               <button type="submit" className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition">Enviar mensaje</button>
            </form>
         </div>
      </section>
   )
}