import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayer = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState(''); // Set video URL

  useEffect(() => {
    // Ambil data user berdasarkan userId dari database (Firebase, misalnya)
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://your-api-url/users/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userId]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (userData && passwordInput === userData.password) {
      setIsAuthenticated(true);
      setErrorMessage('');
      setVideoUrl('https://your-video-url.com/video.mp4'); // Ganti dengan URL video
    } else {
      setErrorMessage('Password salah, silakan coba lagi.');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Selamat datang, {userData && userData.name}</h2>
          <ReactPlayer
            url={videoUrl} // URL video yang valid
            controls
            playing
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <form onSubmit={handlePasswordSubmit}>
          <h3>Masukkan Password untuk mengakses video</h3>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Submit</button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default VideoPlayer;
