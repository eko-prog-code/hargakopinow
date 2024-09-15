import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import Community from './Community';
import { FaRegEye, FaRegEyeSlash, FaTimes } from 'react-icons/fa';
import './MainHome.css';
import { FaPhone } from 'react-icons/fa'; 

const Home = () => {
    const [hargaRobustaIDR, setHargaRobustaIDR] = useState(null);
    const [hargaRobustaDunia, setHargaRobustaDunia] = useState(null);
    const [usdIdr, setUsdIdr] = useState(null);
    const [shopeePrices, setShopeePrices] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [nextPage, setNextPage] = useState('');

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmitPassword = () => {
        if (password === 'ethan') {
            setShowModal(false);
            navigate(nextPage); // Navigate to the next page based on the image clicked
        } else {
            setError('Password salah, coba lagi.');
        }
    };

    const handleImageClick = () => {
        navigate('/ica');
    };

    const closeModal = () => setShowModal(false);

    const handleIncomeClick = () => {
        setNextPage('/income');
        setShowModal(true);
    };

    const handleOutcomeClick = () => {
        setNextPage('/outcome');
        setShowModal(true);
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchFullName(user.uid);
            } else {
                setCurrentUser(null);
                navigate('/'); // Redirects to login if no user is authenticated
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchFullName = (uid) => {
        const database = getDatabase();
        const userRef = databaseRef(database, `users/${uid}/fullName`);
        onValue(userRef, (snapshot) => {
            const fullName = snapshot.val();
            if (fullName) {
                setFullName(fullName);
            }
        });
    };

    useEffect(() => {
        const database = getDatabase();
        const robustaRef = databaseRef(database, 'RealTimeRobusta');

        const unsubscribeRobusta = onValue(robustaRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const { hargaRobustaDunia, UsdIdr } = data;
                const newHargaRobustaIDR = hargaRobustaDunia * UsdIdr;

                setHargaRobustaDunia((prev) => (prev !== hargaRobustaDunia ? hargaRobustaDunia : prev));
                setUsdIdr((prev) => (prev !== UsdIdr ? UsdIdr : prev));
                setHargaRobustaIDR((prev) => (prev !== newHargaRobustaIDR ? newHargaRobustaIDR : prev));
            }
        });

        const shopeeRef = databaseRef(database, 'GreenBeansShopeePrice');
        const unsubscribeShopee = onValue(shopeeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const prices = Object.values(data);
                setShopeePrices((prev) => (JSON.stringify(prev) !== JSON.stringify(prices) ? prices : prev));
            }
        });

        return () => {
            unsubscribeRobusta();
            unsubscribeShopee();
        };
    }, []);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handleChartPriceClick = () => {
        navigate('/chartPrice');
    };

    const handleDesignClick = () => {
        navigate('/desain'); // Navigate to Desain.js page
    };
    
    return (
        <div className="home-container">
            <h2 className="home-title">Sinar Robusta</h2>
            <p>Temanggung</p>
            {currentUser && (
                <p>Hi, {fullName || 'User'} selamat datang</p>
            )}
            <div className="icon-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/income.png?alt=media&token=cd48abbb-a975-42fd-be0c-18ade53866eb"
                    alt="Income Icon"
                    className="icon"
                    onClick={handleIncomeClick}
                />
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/outcome.png?alt=media&token=fa3c4024-e941-436d-913f-c26d5caf0351"
                    alt="Outcome Icon"
                    className="icon"
                    onClick={handleOutcomeClick}
                />
            </div>

            <div className="contact-section">
                <h4>Beli & Cari tau Harga Kopi Sinar Robusta Temanggung</h4>
                <div className="contact-links">
                    <a href="https://wa.me/6281568483152" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <FaPhone className="phone-icon" /> Owner I +6281568483152 
                    </a>
                    <a href="https://wa.me/6289671464086" target="_blank" rel="noopener noreferrer" className="contact-link">
                        <FaPhone className="phone-icon" /> Owner II +6289671464086 
                    </a>
                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <FaTimes className="close-icon" onClick={closeModal} />
                        <h3>Masukkan Password Admin Sinar Robusta</h3>
                        <div className="password-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Masukkan Password"
                            />
                            <span onClick={toggleShowPassword} className="eye-icon">
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </span>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button onClick={handleSubmitPassword}>Submit</button>
                    </div>
                </div>
            )}
            <div className="harga-robusta-container">
                <h3>Robusta London Berjangka:</h3>
                {hargaRobustaIDR ? (
                    <>
                        <p>{`Rp ${hargaRobustaIDR.toLocaleString('id-ID')} /kg`}</p>
                        <p>Rumus: Harga Robusta Dunia (USD/ton) x Nilai Tukar USD ke IDR</p>
                        <p>{`Rumus: ${hargaRobustaDunia} (USD/ton) x ${usdIdr} (USD to IDR)`}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <div className="sumber-informasi">
                <p>Sumber Informasi: <a href="https://id.investing.com/commodities/london-coffee" target="_blank" rel="noopener noreferrer">Investing-Commodities</a></p>
            </div>
            <button className="green-button" onClick={handleDesignClick}>
                Buat Desain Produk
            </button>
            <div className="shopee-prices-container">
                <h3>Harga Kopi di Shopee:</h3>
                <button className="scroll-button left" onClick={scrollLeft}>&#10094;</button>
                <div className="shopee-prices-carousel" ref={scrollContainerRef}>
                    {shopeePrices.map((price, index) => (
                        <div key={index} className="shopee-price-card">
                            <p><strong>Toko:</strong> {price.toko}</p>
                            <p><strong>Harga:</strong> {price.harga}</p>
                            <p><strong>Penjualan:</strong> {price.penjualan}</p>
                            <p><strong>Rating:</strong> {price['5Bintang']} {price.bintang}</p>
                            <a href={price.url} className="shopee-link" target="_blank" rel="noopener noreferrer">Lihat di Shopee</a>
                        </div>
                    ))}
                </div>
                <button className="scroll-button right" onClick={scrollRight}>&#10095;</button>
            </div>
             <button className="blue-button" onClick={handleChartPriceClick}>
                    Lihat Chart
                </button>
            <div className="centered-image-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/ICA.png?alt=media&token=d9e0db40-a278-4d14-bf49-6960fe5dc91e"
                    alt="ICA"
                    className="centered-image"
                    onClick={handleImageClick}
                />
            </div>
            <Community currentUser={currentUser} fullName={fullName} />
        </div>
    );
};

export default Home;
