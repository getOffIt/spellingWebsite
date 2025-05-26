import React from 'react';
import { useAuth } from 'react-oidc-context';
import './Login.css';

export default function Login() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Welcome to SpellingMate</h1>
          <div>You are already signed in.</div>
          <button onClick={() => auth.removeUser()}>Log out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to SpellingMate</h1>
        <button onClick={() => auth.signinRedirect()}>Sign In with Cognito</button>
        {/* <button onClick={() => auth.removeUser()}>Log out</button> */}
      </div>
    </div>
  );
} 