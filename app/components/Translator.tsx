"use client";

import React, { useState, useCallback } from 'react';
import styles from './Translator.module.css';

const Translator: React.FC = () => {
    const [englishText, setEnglishText] = useState('');
    const [slovenianText, setSlovenianText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [reversedEnglishText, setReversedEnglishText] = useState('');

    const translateText = useCallback(async (text: string) => {
        const apiKey = 'AIzaSyDo_f7XW3XaJd8RB9aeDVX6vaDqz_9LcIg'; // Directly use the API key for testing
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        try {
            // Translate English to Slovenian
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: 'sl', // Language code for Slovenian
                    format: 'text',
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Translation API error: ${errorDetails.error.message}`);
            }

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;
            setSlovenianText(translatedText);

            // Translate Slovenian back to English
            const reversedResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: translatedText,
                    target: 'en', // Language code for English
                    format: 'text',
                }),
            });

            if (!reversedResponse.ok) {
                const errorDetails = await reversedResponse.json();
                throw new Error(`Translation API error: ${errorDetails.error.message}`);
            }

            const reversedData = await reversedResponse.json();
            setReversedEnglishText(reversedData.data.translations[0].translatedText);

            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to translate text');
            setSlovenianText('');
            setReversedEnglishText('');
        }
    }, []);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setEnglishText(text);
        translateText(text);
    };

    const handleTextPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        // Prevent the default paste behavior
        event.preventDefault();

        // Get the pasted text
        const pastedText = event.clipboardData.getData('text');

        // Set the pasted text into the textarea
        setEnglishText(pastedText);

        // Translate the pasted text
        translateText(pastedText);
    };

    return (
        <div className={styles.container}>
            <div className={styles.flashcard}>
                <textarea
                    className={styles.input}
                    placeholder="Enter English text"
                    value={englishText}
                    onChange={handleTextChange}
                    onPaste={handleTextPaste}
                />
                <button className={styles.submitBtn} onClick={() => translateText(englishText)}>Translate</button>
                {error && <p className={styles.hint}>{error}</p>}
                <p className={styles.slovenianWord}>{slovenianText}</p>
                <p className={styles.englishWord}><i>{reversedEnglishText}</i></p>
            </div>
        </div>
    );
};

export default Translator;
