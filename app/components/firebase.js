import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup as firebaseSignInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAIIakVWNyr2QiCrTdF2ohBXkV2A4OPsls",
    authDomain: "flashcards-74ea0.firebaseapp.com",
    databaseURL: "https://flashcards-74ea0-default-rtdb.firebaseio.com",
    projectId: "flashcards-74ea0",
    storageBucket: "flashcards-74ea0.appspot.com",
    messagingSenderId: "194528277436",
    appId: "1:194528277436:web:5eb05f9a0f5a540cffb1b9",
    measurementId: "G-QXEZZVYE03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = getFirestore(app);

// Export Firebase-provided methods directly
export const signInWithPopup = (auth, provider) => firebaseSignInWithPopup(auth, provider);
export const signOut = () => firebaseSignOut(auth);