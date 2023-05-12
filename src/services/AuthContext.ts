import { initializeApp } from "firebase/compat/app";
// 3. Authを使うので、以下をインポートする
import firebase from 'firebase/compat/app';
import "firebase/compat/auth";


const firebaseConfig = {
    apiKey: "AIzaSyD55Ecn3NX35pcLEorwuxiufNSXh49nym8",
    authDomain: "react-firebase-64ed0.firebaseapp.com",
    projectId: "react-firebase-64ed0",
    storageBucket: "react-firebase-64ed0.appspot.com",
    messagingSenderId: "1048283904561",
    appId: "1:1048283904561:web:a866361bc59149c4e1b310",
    measurementId: "G-4GWVJQG0BL"
};


firebase.initializeApp(firebaseConfig);
// exportしてどこからでも使えるようにする
export const auth = firebase.auth();
