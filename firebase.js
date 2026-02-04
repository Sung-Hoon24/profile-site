// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously // Added for Kakao "Guest" Login
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
// import { getFunctions } from "firebase/functions";


// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyDW-YtMEqry5jF6JBfBk-3o_ZKohz9OJfI",
    authDomain: "my-awesome-site-f3f94.firebaseapp.com",
    projectId: "my-awesome-site-f3f94",
    storageBucket: "my-awesome-site-f3f94.firebasestorage.app",
    messagingSenderId: "60484064662",
    appId: "1:60484064662:web:3f45d04868d26cd8aaf9b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const functions = getFunctions(app); // Added for Cloud Functions
export const provider = new GoogleAuthProvider();

export {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    doc,
    getDoc,
    setDoc
};
