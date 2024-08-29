"use client";

import React, { useState } from 'react';
import Flashcard from './components/Flashcards';
import MemoryGame from './components/MemoryGame';
import Translator from './components/Translator';
import CameraTranslator from './components/CameraTranslator';
import MenuBar from './components/MenuBar';

const Home: React.FC = () => {
    const [activeTab, setActiveTab] = useState('camera-translator'); // Default tab

    const renderComponent = () => {
        switch (activeTab) {
            case 'translator':
                return <Translator />;
            case 'camera-translator':
                return <CameraTranslator />;
            case 'flashcard':
                return <Flashcard />;
            default:
                return <CameraTranslator />;
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
