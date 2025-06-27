import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import './ApiTest.css';

interface ApiResponse {
  message: string;
  timestamp: string;
}

interface TokenInfo {
  decoded: string;
  raw: string;
}

// Component to display token information
const TokenDisplay: React.FC<{ tokenInfo: TokenInfo | null }> = ({ tokenInfo }) => {
  if (!tokenInfo) return null;
  
  return (
    <div className="response-box">
      <h2>Token Information:</h2>
      <pre>{tokenInfo.decoded}</pre>
    </div>
  );
};

// Component to display API response
const ResponseDisplay: React.FC<{ response: ApiResponse | null }> = ({ response }) => {
  if (!response) return null;

  return (
    <div className="response-box">
      <h2>API Response:</h2>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
};

// Function to decode JWT token
const decodeToken = (token: string): TokenInfo | null => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    return {
      decoded: JSON.stringify(payload, null, 2),
      raw: token
    };
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

// Function to fetch API data
const fetchApiData = async (token: string): Promise<ApiResponse> => {
  const response = await fetch('https://api.spellingninjas.com/api/progress/testauthOnly', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  return response.json();
};

export default function ApiTest() {
  const auth = useAuth();
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.isAuthenticated) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const token = auth.user?.access_token;
        if (!token) {
          throw new Error('No access token available');
        }

        // Decode token
        const decodedToken = decodeToken(token);
        setTokenInfo(decodedToken);

        // Fetch API data
        const data = await fetchApiData(token);
        setResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.isAuthenticated, auth.user?.access_token]);

  if (loading) {
    return <div className="api-test-container">Loading...</div>;
  }

  return (
    <div className="api-test-container">
      <h1>API Test Page</h1>
      {error ? (
        <div className="error">Error: {error}</div>
      ) : (
        <ResponseDisplay response={response} />
      )}
      <TokenDisplay tokenInfo={tokenInfo} />
    </div>
  );
} 