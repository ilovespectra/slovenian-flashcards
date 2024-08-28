"use client"; // Ensure this is a client-side component

import Link from 'next/link';
import styles from './MenuBar.module.css'; // Create this CSS module for styling

const MenuBar: React.FC = () => {
    return (
        <div className={styles.menuBar}>
            <Link href="/" className={styles.menuItem}>Home</Link>
            <Link href="/flashcard" className={styles.menuItem}>Flashcard</Link>
            <Link href="/translator" className={styles.menuItem}>Translator</Link>
            <Link href="/camera-translator" className={styles.menuItem}>Camera Translator</Link>
            {/* Add more links here if needed */}
        </div>
    );
};

export default MenuBar;
