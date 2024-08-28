"use client";

import React, { useState } from 'react';
import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Translator from './components/Translator';
import CameraTranslator from './components/CameraTranslator';
import MenuBar from './components/MenuBar';

const Home: React.FC = () => {
    const [activeTab, setActiveTab] = useState('flashcard'); // Default tab

    const renderComponent = () => {
        switch (activeTab) {
            case 'flashcard':
                return <Flashcard />;
            case 'translator':
                return <Translator />;
            case 'camera-translator':
                return <CameraTranslator />;
            default:
                return <Flashcard />;
        }
    };

    return (
        <div>
            <MenuBar setActiveTab={setActiveTab} />
            <div>
                {renderComponent()}
            </div>
        </div>
    );
};

export default Home;
