"use client";

import React, { useState, useEffect } from 'react';
import Flashcards from './components/Flashcards';
import "./globals.css";

const Home: React.FC = () => {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const handleCloseWelcome = () => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setShowWelcome(false);
    };

    const handleOpenWelcome = () => {
        setShowWelcome(true);
    };

    return (
        <div>
            {showWelcome && (
                <div className="welcomeOverlay">
                    <div className="welcomeModal">
                        <h1>Learn Slovene!</h1>
                        <p>
                            These Flashcards go along with the English/Slovene lessons available at{' '}
                            <a href="https://slonline.si" target="_blank" rel="noopener noreferrer">
                                slonline.si
                            </a>{' '}
                            <ul><br></br>
                                <li><b>- Login with Google to log your score</b></li>
                                <li><b>- View progress on the Leaderboard</b></li>
                                <li><b>- Select the Level in the sidebar on the left</b></li>
                            </ul>
                        </p><br></br>
                        <p>Happy studying!</p>
                        <button onClick={handleCloseWelcome}>Get Started</button>
                    </div>
                </div>
            )}
            <Flashcards />

            <button className="hintButtonSmall" onClick={handleOpenWelcome}>
                ?
            </button>
        </div>
    );
};

export default Home;
