import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import serviceAccountKey from '../serviceAccountKey.json';


const firebaseConfig = {
    apiKey: "AIzaSyD55Ecn3NX35pcLEorwuxiufNSXh49nym8",
    authDomain: "react-firebase-64ed0.firebaseapp.com",
    projectId: "react-firebase-64ed0",
    storageBucket: "react-firebase-64ed0.appspot.com",
    messagingSenderId: "1048283904561",
    appId: "1:1048283904561:web:a866361bc59149c4e1b310",
    measurementId: "G-4GWVJQG0BL"
};


// Firebase App の初期化
const app = initializeApp({
    ...firebaseConfig,
    credential: {
        type: serviceAccountKey.type,
        project_id: serviceAccountKey.project_id,
        private_key_id: serviceAccountKey.private_key_id,
        private_key: serviceAccountKey.private_key,
        client_email: serviceAccountKey.client_email,
        client_id: serviceAccountKey.client_id,
        auth_uri: serviceAccountKey.auth_uri,
        token_uri: serviceAccountKey.token_uri,
        auth_provider_x509_cert_url: serviceAccountKey.auth_provider_x509_cert_url,
        client_x509_cert_url: serviceAccountKey.client_x509_cert_url,
      // 他のプロパティも必要に応じて追加
    },
    });


    const analytics = getAnalytics(app);

// Firestore の初期化
const db = getFirestore(app);

// Authentication の初期化
const auth = getAuth(app);

// Google 認証プロバイダーの初期化
const provider = new GoogleAuthProvider();

export { db, auth, provider };