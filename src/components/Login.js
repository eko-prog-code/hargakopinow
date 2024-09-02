import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleLogin = async () => {
    const auth = getAuth();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential); // Tambahkan log untuk melihat hasil login
      onLogin(); // Pastikan onLogin melakukan hal yang benar
    } catch (error) {
      console.error('Login error:', error); // Log error untuk debugging
      if (error.code === 'auth/user-not-found') {
        alert("Anda belum terdaftar.");
      } else if (error.code === 'auth/wrong-password') {
        alert("Password salah.");
      } else {
        alert("Berhasil Login.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle visibilitas password
  };

  return (
    <div className="login-container">
      {loading && (
        <div className="loading-container">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/medlink-3efcf.appspot.com/o/loading-icon%2Fj9JiPlC6B0.webm?alt=media&token=2800b2f3-7098-47d5-9c82-5f9280750f5f"
            autoPlay
            loop
            muted
          />
        </div>
      )}
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={togglePasswordVisibility} className="password-toggle-icon">
            {showPassword ? '🙈' : '🐵'}
          </span>
        </div>
        <button onClick={handleLogin} className="login-button" disabled={loading}>
          Login
        </button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;