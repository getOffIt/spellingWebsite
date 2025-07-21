import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from 'react-oidc-context'
import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from './contexts/ProgressProvider'
import { WebStorageStateStore } from 'oidc-client-ts'
import './index.css'

// Create proper localStorage stores using WebStorageStateStore
const localStorageStore = new WebStorageStateStore({ store: localStorage });

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_XeQbQOSjJ",
  client_id: "3ua09or8n2k4cqldeu3u8bv585",
  redirect_uri: window.location.origin + "/",
  silent_redirect_uri: window.location.origin + "/silent-renew.html",
  response_type: "code",
  scope: "openid",
  automaticSilentRenew: true,
  onSigninCallback: () => {
   window.history.replaceState({}, document.title, "/");
  },
  onSilentRenewError: (error: ErrorResponse) => {
    console.error('Silent renew error:', error?.error, error?.error_description);
  },
  monitorSession: true,
  loadUserInfo: true,
  stateStore: localStorageStore,
  userStore: localStorageStore,
  accessTokenExpiringNotificationTime: 60,
  checkSessionInterval: 60,
  revokeAccessTokenOnSignout: true
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