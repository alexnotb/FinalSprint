import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/LoadingSpinner.css' // Add import for loading spinner styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
