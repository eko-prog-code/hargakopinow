import React, { useState, useEffect } from 'react';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useUser } from '../context/UserContext'; // Pastikan Anda memiliki konteks pengguna
import ReactPlayer from 'react-player';
import './Ica.css'; // Import CSS untuk styling

// Set modal untuk aksesibilitas
Modal.setAppElement('#root');

// Definisikan modalStyles
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    height: '80%',
    maxHeight: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
};

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
  // Handle klik video
const handleVideoClick = (video) => {
  if (!user) {
    // Jika pengguna belum login, arahkan ke halaman login
    navigate('/login');
  } else if (video.access && user && video.access[user.uid]) {
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


  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle play/pause video
  const handlePlayPauseVideo = () => {
    setPlayVideo(!playVideo);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);  // Menutup modal
    setPasswordInput('');   // Mengosongkan input password
    setPlayVideo(false);    // Mematikan video
  };


  return (
    <div className="marketplace-container">
      <div className="title-marketplace">
        <img src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/DALLE2024-09-0622.31.38-Abluevideoplayiconwithasinglebrowncoffeebeanleaningagainstitsetonasimplecleanbackground-ezgif.com-webp-to-png-converter-removebg-preview.png?alt=media&token=a6356c26-6c43-47ab-b669-2200c8b2889a" alt="Logo" className="logo" />
        <h1>Welcome, {fullName}</h1>
      </div>

      <div className="marketplace-search-container">
        <input
          type="text"
          className="marketplace-search-input"
          placeholder="Search..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
      </div>

      <div className="marketplace-card-container">
        {filteredVideos.map((video) => (
          <div key={video.id} className="marketplace-card">
            <h3>{video.title}</h3>
            <p>{video.desc}</p>
            <button className="view-more-button" onClick={() => handleVideoClick(video)}>
              {video.access ? 'Enter Password' : 'View More'}
            </button>
          </div>
        ))}
      </div>

      {selectedVideo && playVideo && (
        <div className="video-player-container">
          <button className="close-video-button" onClick={handleCloseModal}>×</button>
          <ReactPlayer
            url={selectedVideo.url}
            playing={playVideo}
            controls={true}
            width="100%"
            height="100%"
          />
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={modalStyles}
        contentLabel="Password Protected Video"
      >
        <button className="close-video-button" onClick={handleCloseModal}>
          ×
        </button>
        <h2>{selectedVideo?.title}</h2>
        <p>{selectedVideo?.desc}</p>
        <p>Enter the password to access the video:</p>
        <input
          type={showPassword ? 'text' : 'password'}
          className="password-input"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <span className="password-toggle" onClick={togglePasswordVisibility}>
          {showPassword ? '🙈' : '🙉'}
        </span>
        <button className="submit-button" onClick={handleSubmitPassword}>
          Submit
        </button>
      </Modal>

    </div>
  );
};

export default Ica;
