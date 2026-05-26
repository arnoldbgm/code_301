// Crear un componente en React

// function NombreComponente () {}
// un componente siempre retorna un valor
// Un componente siempre se exporta

// Para llamar un componente, debemos de importarlo
// import NombreComponente from "./NombreComponete"

import Card from "./Card"

import Header from "./Header"

export default function App() {
  return (
    <div>
      <Header></Header>
      <Card></Card>
      <h1>Este es mi primer componente</h1>
      <Card></Card>
      <Card></Card>
    </div>
  )
}