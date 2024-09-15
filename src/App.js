import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { Sheet } from 'react-modal-sheet';
import Home from './components/Home';
import Detail from './components/Detail';
import Income from './components/Income';
import Outcome from './components/Outcome';
import CashFlow from './components/CashFlow';
import Community from './components/Community';
import Akun from './components/Akun';
import Login from './components/Login';
import Register from './components/Register';
import { auth } from './firebase/firebase';
import { requestForToken, onMessageListener } from './firebase/fcm';
import { useUser } from './context/UserContext'; // Import the useUser hook
import Ica from './components/Ica';
import ChartPrice from './components/ChartPrice';
import Desain from './components/Desain';
import './App.css';

const App = () => {
  const { user, setUser } = useUser(); // Use the useUser hook
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio and store it in a ref
    audioRef.current = new Audio('https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/Sinar%20Robusta.mp3?alt=media&token=e005ac33-8c97-4a99-8258-6dc412488440');

    const handleAudioEnd = () => setIsPlaying(false);

    // Add event listener to reset play state when the audio ends
    audioRef.current.addEventListener('ended', handleAudioEnd);

    return () => {
      // Cleanup: remove event listener and stop the audio when component unmounts
      audioRef.current.removeEventListener('ended', handleAudioEnd);
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => console.error('Failed to play audio:', error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    requestForToken();

    const unsubscribeMessageListener = onMessageListener()
      .then((payload) => {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
        });
      })
      .catch((err) => console.log('failed: ', err));

    return () => unsubscribeMessageListener;
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      window.location.href = '/';
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <video
          src="https://firebasestorage.googleapis.com/v0/b/medlink-3efcf.appspot.com/o/loading-icon%2Fj9JiPlC6B0.webm?alt=media&token=2800b2f3-7098-47d5-9c82-5f9280750f5f"
          autoPlay
          loop
          muted
          className="loading-video"
        ></video>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Menu Icon */}
        <button className="menu-icon" onClick={() => setIsSheetOpen(true)}>
          <FontAwesomeIcon icon={faCoffee} />
        </button>

        {/* Play/Pause Audio Control */}
        <button className="audio-control-icon" onClick={toggleAudio}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>

        {/* Bottom Sheet */}
        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          snapPoints={[450, 0]}
          initialSnap={0}
        >
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <button className="close-sheet-button" onClick={() => setIsSheetOpen(false)}>
                &#10006;
              </button>
              <div className="modal-card-container">
                <Link to="/" onClick={() => setIsSheetOpen(false)} className="modal-card">
                  Home
                </Link>
                <Link to="/community" onClick={() => setIsSheetOpen(false)} className="modal-card">
                  Community
                </Link>
                <Link
                  to={user ? `/akun/${user.uid}` : '/login'}
                  onClick={() => setIsSheetOpen(false)}
                  className="modal-card"
                >
                  Akun Ku
                </Link>
                <Link to="/register" onClick={() => setIsSheetOpen(false)} className="modal-card">
                  Register
                </Link>
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsSheetOpen(false);
                    }}
                    className="modal-card"
                  >
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsSheetOpen(false)} className="modal-card">
                    Login
                  </Link>
                )}
              </div>
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="/income" element={<Income />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/akun/:userId" element={<Akun />} />
          <Route path="/ica" element={<Ica />} />
          <Route path="/chartprice" element={<ChartPrice />} />
          <Route path="/desain" element={<Desain />} />
        </Routes>

        {/* Notification Popup */}
        {notification.title && (
          <div className="notification-popup">
            <h2>{notification.title}</h2>
            <p>{notification.body}</p>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
