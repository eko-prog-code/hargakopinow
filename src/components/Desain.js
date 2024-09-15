import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image'; // Menggunakan toPng dari html-to-image
import download from 'downloadjs'; // Menggunakan downloadjs
import './Desain.css';

const Desain = () => {
    const [formData, setFormData] = useState({
        namaBrand: '',
        logoBrand: null,
        tagline: '',
        asalKopi: '',
        uniqueProses: '',
        flavorNote: '', // New field for Flavor Note
        varietasKopi: '',
        roastProfile: '',
        informasiNutrisi: '',
        expiredDate: '',
        informasiKontak: '',
        volume: '',
    });
    const previewRef = useRef(null); // Referensi untuk menangkap konten

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // Fungsi untuk menangkap gambar dari HTML dan mendownloadnya
    const handleDownload = () => {
        if (!formData.namaBrand) {
            alert("Nama Brand harus diisi untuk mendownload desain.");
            return;
        }

        toPng(previewRef.current)
            .then((dataUrl) => {
                download(dataUrl, `${formData.namaBrand}.png`);
            })
            .catch((error) => {
                console.error('Error generating image:', error);
            });
    };

    return (
        <div className="desain-container">
            <h2>Buat Desain Produk</h2>
            <form className="desain-form">
                <label>
                    Nama Brand:
                    <input
                        type="text"
                        name="namaBrand"
                        value={formData.namaBrand}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Upload Logo Brand:
                    <input
                        type="file"
                        name="logoBrand"
                        accept="image/*"
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Tagline:
                    <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Asal Kopi:
                    <input
                        type="text"
                        name="asalKopi"
                        value={formData.asalKopi}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Unique Proses:
                    <input
                        type="text"
                        name="uniqueProses"
                        value={formData.uniqueProses}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Flavor Note: {/* New input for Flavor Note */}
                    <input
                        type="text"
                        name="flavorNote"
                        value={formData.flavorNote}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Varietas Kopi:
                    <input
                        type="text"
                        name="varietasKopi"
                        value={formData.varietasKopi}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Roast Profile:
                    <input
                        type="text"
                        name="roastProfile"
                        value={formData.roastProfile}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Informasi Nutrisi:
                    <input
                        type="text"
                        name="informasiNutrisi"
                        value={formData.informasiNutrisi}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Expired Date:
                    <input
                        type="date"
                        name="expiredDate"
                        value={formData.expiredDate}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Informasi Kontak:
                    <input
                        type="text"
                        name="informasiKontak"
                        value={formData.informasiKontak}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Volume:
                    <input
                        type="text"
                        name="volume"
                        value={formData.volume}
                        onChange={handleInputChange}
                    />
                </label>
            </form>

            {/* Preview container */}
            <div className="preview-container" ref={previewRef}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/banerkopi.png?alt=media&token=fa9631b6-1b95-44d1-9b7e-678ab163311b"
                    alt="Banner Kopi"
                    className="banner-image"
                />
                <div className="overlay-content">
                    <div className="overlay-item" style={{ top: '-988px', left: '222px', fontSize: '40px', color: 'chocolate', fontWeight: 'bold' }}>
                        {formData.namaBrand}
                    </div>
                    {formData.logoBrand && (
                        <img
                            src={URL.createObjectURL(formData.logoBrand)}
                            alt="Logo Brand"
                            className="logo-image"
                        />
                    )}
                    <div className="overlay-content">
                        <div className="overlay-item" style={{ top: '-920px', left: '144px', fontSize: '24px', color: 'black' }}>
                            {formData.tagline.length > 25 ? (
                                <>
                                    {formData.tagline.slice(0, 25)} <br />
                                    {formData.tagline.slice(25)}
                                </>
                            ) : (
                                formData.tagline
                            )}
                        </div>

                        <div className="overlay-item" style={{ top: '-762px', left: '22px', fontSize: '26px', color: 'black' }}>
                            {formData.asalKopi}
                        </div>
                        <div className="overlay-item" style={{ top: '-712px', left: '152px', fontSize: '26px', color: 'black' }}>
                            {formData.uniqueProses}
                        </div>
                        <div className="overlay-item" style={{ top: '-664px', left: '73px', fontSize: '26px', color: 'black' }}>
                            {formData.flavorNote}
                        </div>
                        <div className="overlay-item" style={{ top: '-616px', left: '73px', fontSize: '26px', color: 'black' }}>
                            {formData.varietasKopi}
                        </div>
                        <div className="overlay-item" style={{ top: '-567px', left: '66px', color: 'chocolate', fontSize: '26px' }}>
                            {formData.roastProfile}
                        </div>
                        <div className="overlay-item" style={{ top: '-527px', left: '170px', fontSize: '26px', color: 'green' }}>
                            {formData.informasiNutrisi}
                        </div>
                    </div>

                    <div className="overlay-item" style={{ top: '-187px', left: '334px', color: 'red', fontSize: '26px' }}>
                        {formData.expiredDate}
                    </div>
                    <div className="overlay-item" style={{ top: '-110px', left: '436px', fontSize: '26px', color: 'black' }}>
                        {formData.informasiKontak}
                    </div>
                    <div className="overlay-item" style={{ top: '-67px', left: '262px', fontSize: '26px', color: 'black' }}>
                        {formData.volume}
                    </div>
                </div>
            </div>
            <button className="download-button" onClick={handleDownload}>
                Download Desain
            </button>
        </div>
    );
};

export default Desain;
