export default function Hero() {
   return (
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
         <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
            Conectate con quien mas importa
         </h2>
         <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            LinkUp es la plataforma que te acerca a tus colegas, mentores y proyectos.
            Todo en un solo lugar.
         </p>
         <div className="mt-8 flex justify-center gap-4">
            <a href="#" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition">Empeza gratis</a>
            <a href="#" className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Saber mas</a>
         </div>
      </section>
   )
}