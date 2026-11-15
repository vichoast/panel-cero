import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { escucharInstalacion, registrarSinConexion } from './data/instalacion'

// Se escucha antes de dibujar la app: Chrome avisa una sola vez que se puede instalar.
escucharInstalacion()
registrarSinConexion()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
