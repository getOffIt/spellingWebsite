import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const signOutRedirect = (auth: ReturnType<typeof useAuth>) => {
  const clientId = "3ua09or8n2k4cqldeu3u8bv585";
  const logoutUri = `${window.location.origin}/`;
  const cognitoDomain = "https://eu-west-2xeqbqosjj.auth.eu-west-2.amazoncognito.com";
  auth.removeUser().then(() => {
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  });
};

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/profile');
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome to SpellingMate</h1>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
        {/* <button onClick={() => signOutRedirect(auth)}>Log out</button> */}
      </div>
    </div>
  );
} 