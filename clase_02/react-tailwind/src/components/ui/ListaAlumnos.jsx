export default function ListaAlumnos() {

   const alumnos = ["Juan", "Alexis", "Luis", "Pepe"]

   // Necesitamos que nos muestres el nombre
   // de todos tus alumnos usando una lista no ordenada

   // <ul>
   //   <li>Juan</li>
   //   <li>Alex</li>
   //   <li>Luis</li>
   // </ul>

   const productos = [
      { id: 1, nombre: 'Teclado', precio: 85 },
      { id: 2, nombre: 'Mouse', precio: 45 },
      { id: 3, nombre: 'Monitor', precio: 350 },
      { id: 4, nombre: 'Parlantes', precio: 120 },
      { id: 5, nombre: 'Webcam', precio: 70 }
   ];

   const productosElectronicos = [
      { id: 1, nombre: 'Teclado', precio: 85, categoria: 'Electronica', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgypNX9mZHSIhE5oH5u325dmObDzu0_vMSjA&s' },
      { id: 2, nombre: 'Mouse', precio: 45, categoria: 'Electronica', imagen: 'https://sony.scene7.com/is/image/sonyglobalsolutions/GG25_MSE-G500_Primary_image?$categorypdpnav$&fmt=png-alpha' },
      { id: 3, nombre: 'Monitor', precio: 350, categoria: 'Electronica', imagen: 'https://sistemas.com/termino/wp-content/uploads/Monitor.jpg' },
   ]

   return (
      <div>
         {productos.map((producto, index) => (
            <div key={index}>
               <p>{producto.id}</p>
               <b>{producto.nombre}</b>
               <button>Compralo {producto.precio}</button>
            </div>
         ))}
      </div>
   )
}