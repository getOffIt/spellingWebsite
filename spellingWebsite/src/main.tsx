import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from 'react-oidc-context'
import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from './contexts/ProgressProvider'
import './index.css'

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_XeQbQOSjJ",
  client_id: "3ua09or8n2k4cqldeu3u8bv585",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "openid email phone",
  automaticSilentRenew: true,
  onSigninCallback: () => {

   console.log(document.title)
   window.history.replaceState({}, document.title, "/");
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)