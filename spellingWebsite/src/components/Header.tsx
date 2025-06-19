import React from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const profile = auth.user?.profile;
  const username = profile?.['cognito:username'] || profile?.email || profile?.sub;
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.5rem 2rem',
      background: '#2563eb', 
      color: 'white', 
      minHeight: 44,
      width: '100%'
    }}>
      <div
        style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1, cursor: 'pointer', userSelect: 'none' }}
        onClick={() => navigate('/')}
      >
        SpellingMate
      </div>
      {auth.isAuthenticated && username && (
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8 }} onClick={() => navigate('/profile')}>
          <span style={{ display: 'inline-block', width: 28, height: 28, borderRadius: '50%', background: '#fff3', color: '#fff', fontWeight: 600, fontSize: 15, textAlign: 'center', lineHeight: '28px', marginRight: 8 }}>
            {username[0]?.toUpperCase() || '?'}
          </span>
          <span style={{ fontSize: 14 }}>{username}</span>
        </div>
      )}
    </header>
  );
} 