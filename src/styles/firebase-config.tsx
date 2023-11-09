// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD55Ecn3NX35pcLEorwuxiufNSXh49nym8",
    authDomain: "react-firebase-64ed0.firebaseapp.com",
    projectId: "react-firebase-64ed0",
    storageBucket: "react-firebase-64ed0.appspot.com",
    messagingSenderId: "1048283904561",
    appId: "1:1048283904561:web:a866361bc59149c4e1b310",
    measurementId: "G-4GWVJQG0BL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);