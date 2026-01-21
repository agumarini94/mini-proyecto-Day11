import React from 'react';

// Esta es la URL de tu backend en Render
const API_URL = "https://mini-proyecto-day11.onrender.com/api/user/login";

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Proyecto Día 11</h1>
      <p>El frontend está conectado a: <code>{API_URL}</code></p>

      {/* Aquí iría tu formulario de Login */}
      <div style={{ marginTop: '20px' }}>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" style={{ marginLeft: '10px' }} />
        <button style={{ marginLeft: '10px' }}>Login</button>
      </div>
    </div>
  );
}

export default App;