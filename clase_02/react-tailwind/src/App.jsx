import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import ContactForm from "./components/ui/ContactForm";
import Footer from "./components/ui/Footer";
import Form from "./components/ui/Form";
import Hero from "./components/ui/Hero";
import ListaAlumnos from "./components/ui/ListaAlumnos";
import Navbar from "./components/ui/Navbar";
import Test from "./components/ui/Test";

export default function App() {

  const cardsData = [
    { id: "1", title: "Informacion", description: "Una descripcion generica" },
    { id: "2", title: "Demo", description: "Descrip" },
    { id: "3", title: "Ejemplo", description: "Otra descripcion" }
  ]

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased">
      <Navbar />
      <Hero />
      <div className="flex">
        {/* Necesito que crees un componente Card */}
        {/* Nosotros tenemos un arreglo con la informacion */}
        {cardsData.map((card) => (
          <Card key={card.id} numero={card.id} titulo={card.title} descripcion={card.title} />
        ))}
        {/* 
          <Card numero="1" titulo="Informacion" descripcion="Una descripcion generica"/>
          <Card numero="2" titulo="Demo" descripcion="Descrip"/>
          <Card numero="3" titulo="Ejemplo" descripcion="Otra descripcion"/>
        
        */}
      </div>
      <ContactForm />

      <Test />

      <ListaAlumnos />

      <Button />

      <Form />
      <Footer />
    </div>
  )
}