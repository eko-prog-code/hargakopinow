import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useUser } from '../context/UserContext'; // Pastikan Anda memiliki konteks pengguna
import ReactPlayer from 'react-player';
import './Ica.css'; // Import CSS untuk styling

Modal.setAppElement('#root'); // Penting untuk aksesibilitas

const Ica = () => {
  const { user } = useUser(); // Mendapatkan user yang sedang login
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [fullName, setFullName] = useState('');
  const [playVideo, setPlayVideo] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk hide/show password

  useEffect(() => {
    const database = getDatabase();
    const academyRef = databaseRef(database, 'academy');

    const unsubscribeAcademy = onValue(academyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Mengonversi objek menjadi array
        const videoList = Object.keys(data).map((key) => data[key]);
        setVideos(videoList);
      }
    });

    // Mendapatkan nama lengkap pengguna
    if (user) {
      const userRef = databaseRef(database, `users/${user.uid}/fullName`);
      const unsubscribeUser = onValue(userRef, (snapshot) => {
        const name = snapshot.val();
        setFullName(name || 'User');
      });

      return () => {
        unsubscribeAcademy();
        unsubscribeUser();
      };
    } else {
      return () => {
        unsubscribeAcademy();
      };
    }
  }, [user]);

  // Filter video berdasarkan judul
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  // Handle klik video
  const handleVideoClick = (video) => {
    if (video.access && user && video.access[user.uid]) {
      // Video memiliki proteksi password dan user memiliki akses
      setSelectedVideo(video);
      setIsModalOpen(true);
    } else if (video.access && user && !video.access[user.uid]) {
      // Video memiliki proteksi password tetapi user tidak memiliki akses
      alert('Anda tidak memiliki akses ke video ini.');
    } else {
      // Video tidak memiliki proteksi password
      setSelectedVideo(video);
      setPlayVideo(true); // Mulai memutar video langsung tanpa modal
    }
  };

  // Handle submit password
  const handleSubmitPassword = () => {
    if (selectedVideo && user) {
      const userPassword = selectedVideo.access[user.uid];
      if (passwordInput === userPassword) {
        setIsModalOpen(false);
        setPlayVideo(true); // Set untuk memutar video setelah password benar
      } else {
        alert('Password salah.');
      }
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPasswordInput('');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle play/pause video
  const handlePlayPauseVideo = () => {
    setPlayVideo(!playVideo);
  };

  return (
    <div className="unix-929-ica-container">
      <h1 className="unix-929-h1">Welcome {fullName}</h1>
      <p className="unix-929-p">Search and select a video to watch:</p>
      <input
        type="text"
        className="unix-929-search-input"
        placeholder="Search by title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
      />
      <div className="unix-929-video-grid">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="unix-929-video-card"
            onClick={() => handleVideoClick(video)}
          >
            <h3>{video.title}</h3>
            <p>{video.desc}</p>
          </div>
        ))}
      </div>
      {playVideo && selectedVideo && (
        <div className="unix-929-video-player">
          <ReactPlayer url={selectedVideo.url} controls />
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="unix-929-modal"
        overlayClassName="unix-929-modal-overlay"
      >
        <div className="unix-929-modal-content">
          <span className="unix-929-close-icon" onClick={handleCloseModal}>
            &times;
          </span>
          <h2>Enter Password</h2>
          <div className="unix-929-password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              className="unix-929-password-input"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button className="unix-929-toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? '🙈' : '🙉'}
            </button>
          </div>
          <div className="unix-929-modal-buttons">
            <button className="unix-929-submit-button" onClick={handleSubmitPassword}>
              Submit
            </button>
            <button className="unix-929-cancel-button" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Ica;
