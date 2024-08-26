"use client";

import React, { useState, useEffect } from 'react';
import styles from './MemoryGame.module.css';
import { initialWordsOne, initialWordsTwo, initialWordsThree, initialWordsFour, initialWordsFive } from './initialWords';

interface Card {
    word: string;
    type: 'english' | 'slovenian';
}

const getRandomWords = (difficulty: number): Card[] => {
    const allWords = [
        ...initialWordsOne,
        ...initialWordsTwo,
        ...initialWordsThree,
        ...initialWordsFour,
        ...initialWordsFive
    ].slice(0, difficulty * 6);

    // Ensure this is returning the correct format
    const formattedPairs: Card[] = allWords.flatMap((word) => [
        { word: word.english, type: 'english' },
        { word: word.slovenian, type: 'slovenian' }
    ]);

    // Shuffle and double the pairs
    const shuffled = [...formattedPairs, ...formattedPairs]
        .sort(() => Math.random() - 0.5);

    return shuffled;
};

const MemoryGame = () => {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
    const [difficulty, setDifficulty] = useState(1);

    useEffect(() => {
        setCards(getRandomWords(difficulty));
        setFlippedIndices([]);
        setMatchedIndices([]);
    }, [difficulty]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;

        setFlippedIndices([...flippedIndices, index]);

        if (flippedIndices.length === 1) {
            const [firstIndex] = flippedIndices;
            const secondCard = cards[index];
            const firstCard = cards[firstIndex];

            if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
                setMatchedIndices([...matchedIndices, firstIndex, index]);
            }

            setTimeout(() => setFlippedIndices([]), 1000);
        }
    };

    const getCardClassName = (index: number) => {
        if (matchedIndices.includes(index)) return styles.matchedCard;
        if (flippedIndices.includes(index)) return styles.flippedCard;
        return styles.card;
    };

    return (
        <div>
            <div className={styles.grid}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={getCardClassName(index)}
                        onClick={() => handleCardClick(index)}
                    >
                        {flippedIndices.includes(index) || matchedIndices.includes(index) ? (
                            <span>{card.word}</span>
                        ) : (
                            <span>?</span>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.dropdownContainer}>
                <label htmlFor="difficulty">Difficulty: </label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className={styles.difficultyDropdown}
                >
                    {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MemoryGame;
