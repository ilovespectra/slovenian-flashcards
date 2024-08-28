"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import styles from './CameraTranslator.module.css'; // Import your CSS module

const CameraTranslator: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const translateText = useCallback(async (text: string) => {
        const apiKey = 'AIzaSyDo_f7XW3XaJd8RB9aeDVX6vaDqz_9LcIg'; // Directly use the API key for testing
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: 'en', // Language code for English
                    format: 'text',
                }),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Translation API error: ${errorDetails.error.message}`);
            }

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;
            setTranslatedText(translatedText);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to translate text');
            setTranslatedText(null);
        }
    }, []);

    const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result as string);
                processImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const processImage = async (imageSrc: string) => {
        try {
            setError(null);
            setText(null);
            setTranslatedText(null);

            const { data: { text } } = await Tesseract.recognize(imageSrc, 'slv', {
                logger: (info) => console.log(info),
            });

            setText(text);

            if (text) {
                await translateText(text);
            }
        } catch (err) {
            setError('Error during OCR processing: ' + err);
            setText(null);
            setTranslatedText(null);
        }
    };

    const handleStartCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            setError('Error accessing camera: ' + err);
        }
    };

    const captureFrame = async () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const { data: { text } } = await Tesseract.recognize(canvas, 'slv', {
                    logger: (info) => console.log(info),
                });

                if (text) {
                    await translateText(text);
                }
            }
        }
    };

    useEffect(() => {
        handleStartCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.flashcard}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageCapture}
                    className={styles.fileInput}
                />
                <video ref={videoRef} className={styles.video}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                <button className={styles.captureBtn} onClick={captureFrame}>
                    Capture Frame
                </button>
                {error && <p className={styles.error}>{error}</p>}
                {translatedText && (
                    <div className={styles.translation}>
                        <h2>Translated Text</h2>
                        <p>{translatedText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraTranslator;
