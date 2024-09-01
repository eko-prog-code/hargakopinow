import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import './MainHome.css';

const Home = () => {
    const [hargaRobustaIDR, setHargaRobustaIDR] = useState(null);
    const [hargaRobustaDunia, setHargaRobustaDunia] = useState(null);
    const [usdIdr, setUsdIdr] = useState(null);
    const [shopeePrices, setShopeePrices] = useState([]);
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const robustaRef = ref(database, 'RealTimeRobusta');
        onValue(robustaRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const { hargaRobustaDunia, UsdIdr } = data;
                setHargaRobustaDunia(hargaRobustaDunia);
                setUsdIdr(UsdIdr);
                const hargaRobustaPerKgIDR = hargaRobustaDunia * UsdIdr;
                setHargaRobustaIDR(hargaRobustaPerKgIDR);
            }
        });

        const shopeeRef = ref(database, 'GreenBeansShopeePrice');
        onValue(shopeeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const prices = Object.values(data);
                setShopeePrices(prices);
            }
        });
    }, []);

    const handleIncomeClick = () => {
        navigate('/income');
    };

    const handleOutcomeClick = () => {
        navigate('/outcome');
    };

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

    return (
        <div className="home-container">
            <h2>Catatan Kopi</h2>
            <h2 className="home-title">Sinar Robusta</h2>
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
            <div className="harga-robusta-container">
                <h3>Harga Robusta Hari Ini:</h3>
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
                <p>Sumber Informasi: <a href="https://id.investing.com/commodities/london-coffee" target="_blank" rel="noopener noreferrer">https://id.investing.com/commodities/london-coffee</a></p>
            </div>
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
        </div>
    );
};

export default Home;
