"use client";

import React, { useState, useEffect } from 'react';
import { FaFire, FaMedal, FaLightbulb, FaCheckCircle } from "react-icons/fa";
import confetti from 'canvas-confetti'; // Import the confetti library
import { initialWordsOne, 
    initialWordsTwo, 
    initialWordsThree, 
    initialWordsFour, 
    initialWordsFive, 
    initialWordsSix, 
    initialWordsSeven, 
    initialWordsEight, 
    initialWordsNine, 
    initialWordsTen, 
    initialWordsEleven,
    initialWordsTwelve,
    initialWordsThirteen,
    initialWordsFourteen,
    initialWordsColors, 
    initialWordsNumbers, 
    initialWordsBody,
    initialWordsHouse, 
    initialWordsPharmacy, 
    initialWordsWeekdays,
    initialWordsPhrases
} from './initialWords';
import styles from './Flashcards.module.css';

const difficultyOptions = [
    { label: "ALL", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "12", value: 12 },
    { label: "13", value: 13 },
    { label: "14", value: 14 },
    { label: "15", value: 15 },
    { label: "16", value: 16 },
    { label: "17", value: 17 },
    { label: "18", value: 18 },
    { label: "19", value: 19 },
    { label: "20", value: 20 }
];

const Flashcards = () => {
    const [difficulty, setDifficulty] = useState(1);
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [hint, setHint] = useState('');
    const [showHints, setShowHints] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [finalLevel, setFinalLevel] = useState(false);
    const [wordsTranslated, setWordsTranslated] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [user, setUser] = useState(null); // Firebase user state

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //         setUser(user);
    //         if (user) {
    //             await loadUserData(user.uid);
    //         } else {
    //             resetGameData();
    //         }
    //     });

    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        const shuffledWords = getWordsByDifficulty();
        shuffleArray(shuffledWords);
        setWords(shuffledWords);
        setCurrentWordIndex(0);
        setShowModal(false);
        setHint('');
        setLevelCompleted(false);
        setFinalLevel(false);
    }, [difficulty]);

    useEffect(() => {
        if (levelCompleted || finalLevel) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [levelCompleted, finalLevel]);

    const getWordsByDifficulty = () => {
        if (difficulty === 0) {
            return [
                ...initialWordsOne,
                ...initialWordsTwo,
                ...initialWordsThree,
                ...initialWordsFour,
                ...initialWordsFive,
                ...initialWordsSix,
                ...initialWordsSeven,
                ...initialWordsEight,
                ...initialWordsNine,
                ...initialWordsTen,
                ...initialWordsEleven,
                ...initialWordsTwelve,
                ...initialWordsThirteen,
                ...initialWordsColors,
                ...initialWordsNumbers,
                ...initialWordsBody,
                ...initialWordsHouse,
                ...initialWordsPharmacy,
                ...initialWordsWeekdays,
                ...initialWordsPhrases
            ];
        }
    
        switch (difficulty) {
            case 1:
                return [...initialWordsOne];
            case 2:
                return [...initialWordsTwo];
            case 3:
                return [...initialWordsThree];
            case 4:
                return [...initialWordsFour];
            case 5:
                return [...initialWordsFive];
            case 6:
                return [...initialWordsSix];
            case 7:
                return [...initialWordsSeven];
            case 8:
                return [...initialWordsEight];
            case 9:
                return [...initialWordsNine];
            case 10:
                return [...initialWordsTen];
            case 11:
                return [...initialWordsEleven];
            case 12:
                return [...initialWordsTwelve];
            case 13:
                return [...initialWordsThirteen];
            case 14:
                return [...initialWordsColors];
            case 15:
                return [...initialWordsNumbers];
            case 16:
                return [...initialWordsBody];
            case 17:
                return [...initialWordsWeekdays];
            case 18:
                return [...initialWordsHouse];
            case 19:
                return [...initialWordsPharmacy];
            case 20:
                return [...initialWordsPhrases];
            default:
                return [...initialWordsOne];
        }
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    const sanitizeText = (text) => {
        return text
            .toLowerCase()
            .replace(/[.,!?;:]/g, '');
    };

    const handleSubmit = () => {
        if (words.length === 0 || currentWordIndex >= words.length) return;

        const currentWord = words[currentWordIndex]?.slovenian;
        const sanitizedCurrentWord = sanitizeText(currentWord);
        const sanitizedInput = sanitizeText(userInput);

        if (sanitizedInput === sanitizedCurrentWord) {
            setIsCorrect(true);
            setShowModal(true);
            setUserInput('');
            setCurrentWordIndex(currentWordIndex + 1);
            setWordsTranslated(wordsTranslated + 1);
            setStreak(streak + 1);

            // Update longest streak if current streak exceeds it
            if (streak + 1 > longestStreak) {
                setLongestStreak(streak + 1);
            }

            if (currentWordIndex === words.length - 1) {
                if (difficulty === 6) {
                    setFinalLevel(true);
                    setShowModal(true);
                } else {
                    setLevelCompleted(true);
                    setShowModal(true);
                }
            }

            if (user) {
                saveUserData(user.uid);
            }
        } else {
            setIsCorrect(false);
            setShowModal(true);
            setStreak(0); // Reset streak if wrong answer
        }
    };

    const handleNext = () => {
        if (finalLevel) {
            // Reset or handle the final level if needed
            return;
        }

        if (levelCompleted) {
            setDifficulty(difficulty + 1);
        }

        setUserInput('');
        setHint('');
        setShowModal(false);
        setLevelCompleted(false); // Reset levelCompleted state after moving to next level

        if (user) {
            saveUserData(user.uid);
        }
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(Number(event.target.value));
    };

    const handleHint = () => {
        if (words.length === 0 || currentWordIndex >= words.length) return;
    
        const currentWord = words[currentWordIndex].slovenian;
        if (hint.length < currentWord.length) {
            const nextHint = currentWord.substring(0, hint.length + 2); // Provide a better hint
            setHint(nextHint);
            setHintsUsed(hintsUsed + 1);
            setStreak(0); // Reset streak if hint is used
    
            if (user) {
                saveUserData(user.uid);
            }
        }
    };

    const handleSpecialCharacter = (char) => {
        setUserInput(userInput + char);
    };

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    
    const handleLogout = async () => {
        try {
            await signOut();
            resetGameData();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };    

    const saveUserData = async (userId) => {
        const userRef = doc(firestore, 'users', userId);
        await setDoc(userRef, {
            wordsTranslated,
            streak,
            longestStreak,
            hintsUsed,
            difficulty
        }, { merge: true });
    };

    const loadUserData = async (userId) => {
        const userRef = doc(firestore, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setWordsTranslated(data.wordsTranslated || 0);
            setStreak(data.streak || 0);
            setLongestStreak(data.longestStreak || 0);
            setHintsUsed(data.hintsUsed || 0);
            setDifficulty(data.difficulty || 1);
        }
    };

    const resetGameData = () => {
        setWordsTranslated(0);
        setStreak(0);
        setLongestStreak(0);
        setHintsUsed(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const currentWord = words[currentWordIndex] || {};

    // New function to toggle hints modal
    const toggleHintsModal = () => {
        setShowHints(!showHints);
    };

    return (
        <div className={styles.container}>
            <div className={styles.counters}>
            <div><FaCheckCircle /> Words Translated: {wordsTranslated}</div>
                <div><FaFire /> Streak: {streak}</div>
                <div><FaMedal /> Longest Streak: {longestStreak}</div>
                <div><FaLightbulb /> Hints Used: {hintsUsed}</div>
            </div>
            <div className={styles.flashcard}>
                <div className={styles.englishWord}>{currentWord.english || "Loading..."}</div>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                />
                <div className={styles.specialButtons}>
                    <button className={styles.specialCharBtn} onClick={() => handleSpecialCharacter('č')}>č</button>
                    <button className={styles.specialCharBtn} onClick={() => handleSpecialCharacter('š')}>š</button>
                    <button className={styles.specialCharBtn} onClick={() => handleSpecialCharacter('ž')}>ž</button>
                </div>
                <button className={styles.submitBtn} onClick={handleSubmit}>Submit</button>
                <div className={styles.hintContainer}>
                    <button className={styles.hintButton} onClick={handleHint}>Hint</button>
                    <div className={styles.hintDisplay}>{hint}</div> 
                </div>
                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.resultText}>
                            {isCorrect ? 'Correct!' : 'Incorrect!'}
                        </div>
                        <button className={styles.modalButton} onClick={handleNext}>
                            {finalLevel ? 'Start Over' : 'Next'}
                        </button>
                    </div>
                )}
            </div>
            <div className={styles.dropdownContainer}>
            <select
    className={styles.difficultyDropdown}
    value={difficulty}
    onChange={(e) => setDifficulty(Number(e.target.value))}
>
    {difficultyOptions.map((option) => (
        <option key={option.value} value={option.value}>
            {option.label === "ALL" ? "All Words" : `Difficulty ${option.label}`}
        </option>
    ))}
</select>

            </div>
            <button className={styles.hintButton} onClick={toggleHintsModal}>Show Hints</button>

            {/* Hints Modal */}
            {showHints && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <span className={styles.close} onClick={toggleHintsModal}>&times;</span>
                        <h2>Hints</h2>
                        <ul>
                            {words.map((word, index) => (
                                <li key={index}>
                                    <strong>{word.english}</strong> - {word.slovenian}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {/* {user ? (
                <button className={styles.authButton} onClick={handleLogout}>Logout</button>
            ) : (
                <button className={styles.authButton} onClick={handleLogin}>Login</button>
            )} */}
        </div>
    );
};

export default Flashcards;
