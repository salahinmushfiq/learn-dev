//src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FlowProvider } from "./contexts/FlowContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FlowProvider>
        <App />
    </FlowProvider>
  </StrictMode>,
)
