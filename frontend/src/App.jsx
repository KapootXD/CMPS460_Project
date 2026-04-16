import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage('Backend not connected yet'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1>☕ OneCafe</h1>
      <p>A One Piece Themed Coffee Shop</p>
      <p style={{ color: '#888' }}>Backend status: {message}</p>
    </div>
  );
}

export default App;
