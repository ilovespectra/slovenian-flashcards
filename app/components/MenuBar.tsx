"use client";

import React from 'react';
import Link from 'next/link';
import styles from './MenuBar.module.css'; // Import your CSS module for styling

interface MenuBarProps {
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const MenuBar: React.FC<MenuBarProps> = ({ setActiveTab }) => {
    return (
        <div className={styles.menuBar}>
            <button onClick={() => setActiveTab('translator')} className={styles.menuItem}>Translator</button>
            <button onClick={() => setActiveTab('camera-translator')} className={styles.menuItem}>Camera Translator</button>
            <button onClick={() => setActiveTab('flashcard')} className={styles.menuItem}>Flashcards</button>
            {/* Add more links here if needed */}
        </div>
    );
};

export default MenuBar;
