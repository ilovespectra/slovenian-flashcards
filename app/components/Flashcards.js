"use client";

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti'; // Import the confetti library
import { initialWordsOne, initialWordsTwo, initialWordsThree, initialWordsFour, initialWordsFive } from './initialWords';
import styles from './Flashcards.module.css';

const difficultyOptions = [1, 2, 3, 4, 5];

const Flashcards = () => {
    const [difficulty, setDifficulty] = useState(1);
    const [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [hint, setHint] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [finalLevel, setFinalLevel] = useState(false);
    const [wordsTranslated, setWordsTranslated] = useState(0);
    const [streak, setStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0); // New state for longest streak
    const [hintsUsed, setHintsUsed] = useState(0);

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
                if (difficulty === 5) {
                    setFinalLevel(true);
                    setShowModal(true);
                } else {
                    setLevelCompleted(true);
                    setShowModal(true);
                }
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
    };

    const handleDifficultyChange = (event) => {
        setDifficulty(Number(event.target.value));
    };

    const handleHint = () => {
        if (words.length === 0 || currentWordIndex >= words.length) return;

        const currentWord = words[currentWordIndex].slovenian;
        if (hint.length < currentWord.length) {
            const nextHint = currentWord.substring(0, hint.length + 2);
            setHint(nextHint);
            setHintsUsed(hintsUsed + 1);
            setStreak(0); // Reset streak if hint is used
        }
    };

    const handleSpecialCharacter = (char) => {
        setUserInput(userInput + char);
    };

    const currentWord = words[currentWordIndex] || {};

    return (
        <div className={styles.container}>
            <div className={styles.counters}>
                <div>Words Translated: {wordsTranslated}</div>
                <div>Streak: {streak}</div>
                <div>Longest Streak: {longestStreak}</div> {/* Display the longest streak */}
                <div>Hints Used: {hintsUsed}</div>
            </div>
            <div className={styles.flashcard}>
                <div className={styles.englishWord}>{currentWord.english || "Loading..."}</div>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                    className={styles.input}
                    placeholder="Type the Slovenian translation"
                    rows={3}
                />
                <div className={styles.specialButtons}>
                    <button onClick={() => handleSpecialCharacter('č')} className={styles.specialCharBtn}>č</button>
                    <button onClick={() => handleSpecialCharacter('š')} className={styles.specialCharBtn}>š</button>
                    <button onClick={() => handleSpecialCharacter('ž')} className={styles.specialCharBtn}>ž</button>
                    <button onClick={handleHint} className={styles.hintButton}>Hint</button>
                    <button onClick={handleSubmit} className={styles.submitBtn}>Submit</button>
                </div>
                <div className={styles.hint}>{hint}</div>
                {showModal && (
                    <div className={styles.modal}>
                        <div className={styles.resultText}>
                            {finalLevel ? 'You won!' : levelCompleted ? `You cleared level ${difficulty}` : isCorrect ? 'Correct!' : 'Try again!'}
                        </div>
                        <button onClick={handleNext} className={styles.submitBtn}>
                            {finalLevel ? 'Play Again' : 'Next'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Flashcards;
