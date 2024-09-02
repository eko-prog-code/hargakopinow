import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import CSS file

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const handleRegister = async () => {
    const auth = getAuth();
    const database = getDatabase();
    setLoading(true); // Tampilkan loading saat proses dimulai
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data pengguna ke Realtime Database, termasuk password
      await set(ref(database, 'users/' + user.uid), {
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: user.email,
        password: password,
      });

      alert("Registration successful!");
      navigate('/'); // Arahkan ke halaman Home setelah registrasi berhasil
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Sembunyikan loading setelah proses selesai
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle visibility password
  };

  return (
    <div className="register-container">
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
      <h2 className="register-heading">Register</h2>
      <div className="register-form">
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="register-input"
        />
        <input
          type="text"
          placeholder="No Telpon WhatsApp"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="register-input"
          />
          <span onClick={togglePasswordVisibility} className="password-toggle-icon">
            {showPassword ? '🙈' : '🐵'}
          </span>
        </div>
        <button onClick={handleRegister} className="register-button" disabled={loading}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;