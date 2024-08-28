"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import styles from './CameraTranslator.module.css'; // Import your CSS module

const CameraTranslator: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cameraId, setCameraId] = useState<string | null>(null); // Store selected camera ID
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]); // Store available cameras
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

    const handleStartCamera = async (cameraId: string | null) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: cameraId ? { deviceId: { exact: cameraId } } : true,
            });

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

    const handleCameraSelection = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCameraId = event.target.value;
        setCameraId(selectedCameraId);
        await handleStartCamera(selectedCameraId);
    };

    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);

                // Start the camera with the first available camera by default
                if (videoDevices.length > 0) {
                    setCameraId(videoDevices[0].deviceId);
                    await handleStartCamera(videoDevices[0].deviceId);
                }
            } catch (err) {
                setError('Error getting media devices: ' + err);
            }
        };

        getCameras();

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
                <select
                    onChange={handleCameraSelection}
                    value={cameraId || ''}
                    className={styles.cameraSelect}
                >
                    <option value="">Select Camera</option>
                    {cameras.map(camera => (
                        <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${camera.deviceId}`}
                        </option>
                    ))}
                </select>
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
