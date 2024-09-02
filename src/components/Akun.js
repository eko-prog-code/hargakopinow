import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { database, auth, storage } from '../firebase/firebase';
import { ref as databaseRef, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Akun.css';

const Akun = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profession, setProfession] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true); // State untuk loading
  const currentUser = auth.currentUser;

  useEffect(() => {
    const userRef = databaseRef(database, `users/${userId}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.val());
        setProfession(snapshot.val().profession || '');
        setImageUrl(snapshot.val().profileImage || '');
      }
      setLoading(false); // Set loading ke false setelah data diambil
    });
  }, [userId]);

  const handleImageUpload = (e) => {
    if (currentUser && currentUser.uid === userId) {
      const file = e.target.files[0];
      if (file) {
        setLoading(true); // Tampilkan loading saat upload gambar
        const imageRef = storageRef(storage, `profileImages/${userId}/${file.name}`);
        uploadBytes(imageRef, file).then(() => {
          getDownloadURL(imageRef).then((url) => {
            setImageUrl(url);
            update(databaseRef(database, `users/${userId}`), { profileImage: url });
            setLoading(false); // Set loading ke false setelah upload selesai
          });
        });
      }
    }
  };

  const handleProfessionChange = (e) => {
    setProfession(e.target.value);
    if (currentUser && currentUser.uid === userId) {
      update(databaseRef(database, `users/${userId}`), { profession: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <video src="https://firebasestorage.googleapis.com/v0/b/medlink-3efcf.appspot.com/o/loading-icon%2Fj9JiPlC6B0.webm?alt=media&token=2800b2f3-7098-47d5-9c82-5f9280750f5f" autoPlay loop muted />
      </div>
    );
  }

  return (
    <div className="account-container">
      <h3>{userData.fullName}</h3>
      <div className="profile-info">
        <img
          src={imageUrl || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-image"
        />
        <p>Profesi: {profession || 'Belum diatur'}</p>
        <p>Email: {userData.email}</p>
        <p>No Telepon WhatsApp: {userData.phoneNumber}</p>
        {currentUser && currentUser.uid === userId && (
          <>
            <p>Upload Photo Profile</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="unix-input"
            />
            <p>Profesi Anda:</p>
            <input
              type="text"
              value={profession}
              onChange={handleProfessionChange}
              placeholder="Masukkan profesi Anda"
              className="unix-input"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Akun;