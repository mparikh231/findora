import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './context/UserContext.tsx'
import { CityProvider } from './context/CityContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </UserProvider>
      <ToastContainer />
    </BrowserRouter>
  </StrictMode>,
)