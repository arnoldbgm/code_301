import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Enrutador from './router'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Enrutador/>
  </StrictMode>,
)
