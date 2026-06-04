import Card from "./components/ui/Card";
import ContactForm from "./components/ui/ContactForm";
import Footer from "./components/ui/Footer";
import Hero from "./components/ui/Hero";
import Navbar from "./components/ui/Navbar";
import Test from "./components/ui/Test";

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased">
      <Navbar />
      <Hero />
      <div className="flex">
        <Card numero="1" titulo="Demo" descripcion="Descrip"/>
        <Card descripcion="Una descripcion generica"/>
        <Card />
      </div>
      <ContactForm />

      <Test />
      <Footer />
    </div>
  )
}