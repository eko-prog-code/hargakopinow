import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import Shopee from './Shopee';
import HargaNow from './HargaNow';
import Community from './Community';
import SinarRobusta from './SinarRobusta';
import './MainHome.css';

const Home = () => {
    const [hargaRobustaIDR, setHargaRobustaIDR] = useState(null);
    const [hargaRobustaDunia, setHargaRobustaDunia] = useState(null);
    const [usdIdr, setUsdIdr] = useState(null);
    const [shopeePrices, setShopeePrices] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
                navigate('/'); // Redirects to login if no user is authenticated
            }
        });
        return () => unsubscribe();
    }, [navigate]);

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

    return (
        <div className="home-container">
            <h2>Catatan Kopi</h2>
            {currentUser && (
                <p>Hi, {currentUser.displayName || 'User'} selamat datang</p>
            )}

            <SinarRobusta />

            <Shopee shopeePrices={shopeePrices} />
            <HargaNow hargaRobustaIDR={hargaRobustaIDR} hargaRobustaDunia={hargaRobustaDunia} usdIdr={usdIdr} />
            <Community currentUser={currentUser} />
        </div>
    );
};

export default Home;
