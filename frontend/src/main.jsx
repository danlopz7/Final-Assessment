import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { LoadScript } from '@react-google-maps/api';


const googleLibraries = ['places'];

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadScript
      googleMapsApiKey="AIzaSyBPK15nwpPCQEndo378nriZyZA9ALqIMOY"
      libraries={googleLibraries}
    >
      <App />
    </LoadScript>

  </StrictMode>,
)
