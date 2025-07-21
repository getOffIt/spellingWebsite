import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from 'react-oidc-context'
import { BrowserRouter } from 'react-router-dom'
import { ProgressProvider } from './contexts/ProgressProvider'
import './index.css'

// Debug: Check what storage is available
console.log('Available storage:', {
  localStorage: typeof localStorage !== 'undefined',
  sessionStorage: typeof sessionStorage !== 'undefined'
});

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_XeQbQOSjJ",
  client_id: "3ua09or8n2k4cqldeu3u8bv585",
  redirect_uri: window.location.origin + "/",
  silent_redirect_uri: window.location.origin + "/silent-renew.html",
  response_type: "code",
  scope: "openid",
  automaticSilentRenew: true,
  onSigninCallback: () => {
   console.log('Sign-in callback triggered');
   window.history.replaceState({}, document.title, "/");
  },
  onSilentRenewError: (error: any) => {
    console.error('Silent renew error:', error);
  },
  onSigninSilent: () => {
    console.log('Silent sign-in completed');
  },
  onSignoutSilent: () => {
    console.log('Silent sign-out completed');
  },
  monitorSession: true,
  loadUserInfo: true,
  storage: localStorage,
  // Add refresh token settings
  accessTokenExpiringNotificationTime: 60,
  checkSessionInterval: 60,
  revokeAccessTokenOnSignout: true,
  // Add error handling
  onSigninError: (error: any) => {
    console.error('Sign-in error:', error);
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