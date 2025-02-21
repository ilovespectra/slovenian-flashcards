"use client";

import React, { useState } from 'react';
import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Leaderboard from './components/Leaderboard'; 
import "./globals.css";

const Home: React.FC = () => {
    return (
        <div>
            {/* <MenuBar /> */}
            <Flashcard />
            {/* <Leaderboard /> */}
            {/* <MemoryGame /> */}
        </div>
    );
};

export default Home;