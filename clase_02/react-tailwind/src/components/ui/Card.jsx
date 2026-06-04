export default function Card({numero, titulo, descripcion}) {
   return (
      <article className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
         <img
            src="https://static.vecteezy.com/system/resources/thumbnails/058/144/254/small/beautiful-flowers-wallpaper-image-of-flowers-free-photo.jpg"
            alt=""
            className="w-full h-48 object-cover"
         />
         <div className="p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
               <span className="text-indigo-600 text-lg font-bold">{numero || "0"}</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-900">{titulo || "Titulo"}</h4>
            <p className="mt-2 text-sm text-slate-500">{descripcion || "Descripcion"}</p>
         </div>
      </article>
   )
}