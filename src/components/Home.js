// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainHome.css'; // Import file CSS

const Home = () => {
    const navigate = useNavigate();

    const handleIncomeClick = () => {
        navigate('/income');
    };

    const handleOutcomeClick = () => {
        navigate('/outcome');
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
        </div>
    );
};

export default Home;
