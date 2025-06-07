import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Application is working!');
  const [envStatus, setEnvStatus] = useState({});
  
  const testApi = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      setMessage(data.message);
      setEnvStatus(data.environment);
    } catch (error) {
      setMessage('API test failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Solana Meme Coin Tracker</h1>
      <p style={styles.message}>{message}</p>
      
      <div style={styles.envContainer}>
        <h3>Environment Status:</h3>
        <p>Supabase URL: {envStatus.supabaseUrl || 'Checking...'}</p>
        <p>Helius API Key: {envStatus.heliusKey || 'Checking...'}</p>
      </div>
      
      <button 
        onClick={testApi}
        style={styles.button}
      >
        Test API Connection
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#666',
  },
  envContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'left',
    width: '80%',
    maxWidth: '500px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
  }
};
