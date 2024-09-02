// components/HargaNow.js
import React from 'react';

const HargaNow = ({ hargaRobustaIDR, hargaRobustaDunia, usdIdr }) => {
    return (
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
            <div className="sumber-informasi">
                <p>Sumber Informasi: <a href="https://id.investing.com/commodities/london-coffee" target="_blank" rel="noopener noreferrer">https://id.investing.com/commodities/london-coffee</a></p>
            </div>
        </div>
    );
};

export default HargaNow;
