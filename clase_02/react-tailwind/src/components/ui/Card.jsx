export default function Card({title, heading}){
   return (
      <div className="flex bg-blue-950 rounded-3xl p-4 text-white gap-4">
         <img className="rounded-2xl" src="https://thumbs.dreamstime.com/b/auriculares-negros-o-aud%C3%ADfonos-con-fondo-de-color-brillante-espacio-copia-para-texto-dise%C3%B1o-la-vista-superior-195162367.jpg"></img>
         <div className="flex flex-col justify-center">
            <span className="
               w-fit bg-amber-600 p-1 rounded-md
            ">{heading}</span>
            <h2 className="text-3xl font-bold mt-2 mb-2">{title}</h2>
            <p>Redescubre el sonido con una profundidad acustica iniguablable y acabado en cuero natural.</p>
         </div>
      </div>
   )
}