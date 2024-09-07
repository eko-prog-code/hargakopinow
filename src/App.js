// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
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
import './App.css';

const App = () => {
  const { user, setUser } = useUser(); // Use the useUser hook
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        <button className="menu-icon" onClick={() => setIsSheetOpen(true)}>
          <FontAwesomeIcon icon={faCoffee} />
        </button>

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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/cashflow" element={<CashFlow />} />
          <Route path="/income" element={<Income />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/community" element={<Community />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/akun/:userId" element={<Akun />} />
          <Route path="/ica" element={<Ica />} />
          <Route path="/chartprice" element={<ChartPrice />} /> 
        </Routes>

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
