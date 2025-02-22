"use client";

import React, { useState } from 'react';
import Flashcard from './components/Flashcards';
import "./globals.css";

const Home: React.FC = () => {
    return (
        <div>
            <Flashcard />
        </div>
    );
};

export default Home;