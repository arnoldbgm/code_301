// Limpiar el componente App.jsx
// Para empezar desde cero

import Card from "./components/ui/Card"
import Button from "./components/ui/Button"

export default function App() {
  return (
    <div>
      <Card heading="GOLD EDITION"/>
      <Card title="Este es otro prop" heading="MAX EDITION"/>
      <Card title="Musica melomano" heading="SILVER EDITION"/>
      <Card title="La mejor musica" heading="LIMITED EDITION"/>
    
      <Button txtButton="Haz click aqui"/>
      <Button txtButton="Hola como estas"/>
      <Button txtVuton="Adios" txtButton="ok"/>
    </div>
  )
}