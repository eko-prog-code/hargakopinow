// components/Shopee.js
import React, { useEffect, useState, useRef } from 'react';
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database';
import './Shopee.css';

const Shopee = () => {
    const [shopeePrices, setShopeePrices] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const database = getDatabase();
        const shopeeRef = databaseRef(database, 'GreenBeansShopeePrice');
        const unsubscribeShopee = onValue(shopeeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const prices = Object.values(data);
                setShopeePrices((prev) => (JSON.stringify(prev) !== JSON.stringify(prices) ? prices : prev));
            }
        });

        return () => {
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

    return (
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
    );
};

export default Shopee;
