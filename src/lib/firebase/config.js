// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTFC9lOC0CdN5-CotzsbcDgx52RpGTC-w",
    authDomain: "ace-it-ca939.firebaseapp.com",
    projectId: "ace-it-ca939",
    storageBucket: "ace-it-ca939.firebasestorage.app",
    messagingSenderId: "1015578743623",
    appId: "1:1015578743623:web:e3b450d97df5b708a7f262"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fbdb = getFirestore(app)

export { app, auth, fbdb }
