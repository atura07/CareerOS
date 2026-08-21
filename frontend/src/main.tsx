import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.tsx'

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '277452983880-l16lgkp6n1rbp139vj9smcpl0ji0qp5e.apps.googleusercontent.com'

if (typeof window !== 'undefined') {
  console.log('[Google Auth Audit] window.location.origin:', window.location.origin)
  console.log('[Google Auth Audit] window.location.host:', window.location.host)
  console.log(
    '[Google Auth Audit] Active Client ID:',
    googleClientId
      ? `${googleClientId.substring(0, 12)}...${googleClientId.slice(-28)}`
      : 'NOT_CONFIGURED'
  )
}



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)

