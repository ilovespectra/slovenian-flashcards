"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { firestore, collection, addDoc, getDocs, query, orderBy } from './firebase'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import styles from './Translator.module.css';

const Translator: React.FC = () => {
    const [englishText, setEnglishText] = useState('');
    const [slovenianText, setSlovenianText] = useState('');
    const [reversedEnglishText, setReversedEnglishText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [savedTranslations, setSavedTranslations] = useState<any[]>([]);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState('');
    const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setVisibleTooltip(text);
        setTimeout(() => setVisibleTooltip(null), 1500); // Hide after 1.5 seconds
    };

    const translateText = useCallback(async (text: string) => {
        const apiKey = 'AIzaSyDo_f7XW3XaJd8RB9aeDVX6vaDqz_9LcIg'; // Replace with your actual API key
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

    const saveTranslation = async () => {
        try {
            const historyRef = collection(firestore, 'translations');
            await addDoc(historyRef, {
                originalText: englishText,
                translatedText: slovenianText,
                reversedText: reversedEnglishText,
                timestamp: new Date(),
            });
            fetchTranslations(); // Refresh the list of saved translations
        } catch (err) {
            console.error('Error saving translation: ', err);
        }
    };

    const fetchTranslations = async () => {
        try {
            const historyRef = collection(firestore, 'translations');
            const q = query(historyRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const translations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedTranslations(translations);
        } catch (err) {
            console.error('Error fetching translations: ', err);
        }
    };

    const deleteTranslation = async (id: string) => {
        try {
            const translationDocRef = doc(firestore, 'translations', id);
            await deleteDoc(translationDocRef);
            fetchTranslations(); // Refresh the list of saved translations
        } catch (err) {
            console.error('Error deleting translation: ', err);
        }
    };

    useEffect(() => {
        fetchTranslations(); // Fetch saved translations on component mount
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

    const insertSpecialCharacter = (char: string) => {
        setEnglishText(prevText => prevText + char);
    };

    return (
        <div className={styles.container}>
            <div className={styles.flashcard}>
                <textarea
                    className={styles.input}
                    placeholder="Enter SL or EN text"
                    value={englishText}
                    onChange={handleTextChange}
                    onPaste={handleTextPaste}
                />
                <div className={styles.specialCharacters}>
                    <button onClick={() => insertSpecialCharacter('č')} className={styles.specialCharBtn}>č</button>
                    <button onClick={() => insertSpecialCharacter('š')} className={styles.specialCharBtn}>š</button>
                    <button onClick={() => insertSpecialCharacter('ž')} className={styles.specialCharBtn}>ž</button>
                </div>
                <button className={styles.saveBtn} onClick={saveTranslation}>Save</button>
                {error && <p className={styles.hint}>{error}</p>}

                {slovenianText && (
                    <div className={styles.translationContainer}>
                        <p className={styles.slovenianWord}>
                            {slovenianText}
                            <button className={styles.copyBtn} onClick={() => copyToClipboard(slovenianText)}>
                                <FontAwesomeIcon icon={faCopy} />
                                {visibleTooltip === slovenianText && <span className={styles.tooltip}>Copied!</span>}
                            </button>
                        </p>
                    </div>
                )}
                {reversedEnglishText && (
                    <div className={styles.translationContainer}>
                        <p className={styles.englishWord}>
                            <i>{reversedEnglishText}</i>
                            <button className={styles.copyBtn} onClick={() => copyToClipboard(reversedEnglishText)}>
                                <FontAwesomeIcon icon={faCopy} />
                                {visibleTooltip === reversedEnglishText && <span className={styles.tooltip}>Copied!</span>}
                            </button>
                        </p>
                    </div>
                )}

                <div className={styles.savedTranslations}>
                    {savedTranslations.map(translation => (
                        <div key={translation.id} className={styles.translationItem}>
                            <p className={styles.savedTranslation}>
                                <i>&ldquo;{translation.originalText}&rdquo;</i>
                                <button className={styles.deleteBtn} onClick={() => deleteTranslation(translation.id)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </p>
                            <p className={styles.savedTranslation}>
                                {translation.translatedText}
                                <button className={styles.copyBtn} onClick={() => copyToClipboard(translation.translatedText)}>
                                    <FontAwesomeIcon icon={faCopy} />
                                    {visibleTooltip === translation.translatedText && <span className={styles.tooltip}>Copied!</span>}
                                </button>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Translator;
