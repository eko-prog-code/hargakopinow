import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaTimes } from 'react-icons/fa';

const SinarRobusta = ({ handleIncomeClick, handleOutcomeClick }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const toggleShowPassword = () => setShowPassword(!showPassword);
    const handleSubmitPassword = () => {
        if (password === 'ethan') {
            setShowModal(false);
            // Navigate or perform action
        } else {
            setError('Password salah, coba lagi.');
        }
    };
    const closeModal = () => setShowModal(false);

    return (
        <div>
            <h2 className="home-title">Sinar Robusta Temanggung</h2>
            <p>Supported by Indonesia Coffee Organization</p>

            <div className="icon-container">
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/income.png?alt=media&token=cd48abbb-a975-42fd-be0c-18ade53866eb"
                    alt="Income Icon"
                    className="icon"
                    onClick={() => setShowModal(true)}
                />
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/outcome.png?alt=media&token=fa3c4024-e941-436d-913f-c26d5caf0351"
                    alt="Outcome Icon"
                    className="icon"
                    onClick={() => setShowModal(true)}
                />
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
        </div>
    );
};

export default SinarRobusta;
