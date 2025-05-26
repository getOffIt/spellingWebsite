import React from 'react';
import { useAuth } from 'react-oidc-context';

export default function ProfilePage() {
  const auth = useAuth();
  if (!auth.isAuthenticated || !auth.user) return null;
  const profile = auth.user.profile;
  const username = profile['cognito:username'] || profile.email || profile.sub;
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: 400, width: '100%', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: 10, boxShadow: '0 2px 8px #0001', textAlign: 'center' }}>
        <h2 style={{ color: '#2563eb', marginBottom: '1.5rem' }}>Account Profile</h2>
        <div style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
          <strong>Username:</strong> {username}
        </div>
        <button
          onClick={() => auth.removeUser()}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#1d4ed8')}
          onMouseOut={e => (e.currentTarget.style.background = '#2563eb')}
        >
          Log out
        </button>
      </div>
    </div>
  );
} 