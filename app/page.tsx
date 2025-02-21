"use client";

import React, { useState } from 'react';
import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Leaderboard from './components/Leaderboard'; 
import "./globals.css";

const Home: React.FC = () => {
    return (
        <div className="background-image">
            {/* <MenuBar /> */}
            <Flashcard />
            {/* <Leaderboard /> */}
            {/* <MemoryGame /> */}
        </div>
    );
};

export default Home;