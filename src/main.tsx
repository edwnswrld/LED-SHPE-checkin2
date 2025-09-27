import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import CheckinHubApp from './CheckinHubApp.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CheckinHubApp />
  </StrictMode>,
)
