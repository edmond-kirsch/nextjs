import * as firebase from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const FirebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth();
const GoogleProvider = new GoogleAuthProvider();
GoogleProvider.setCustomParameters({
    "hd": process.env.NEXT_PUBLIC_ALLOWED_DOMAIN,
    "prompt": "select_account"
})

export { FirebaseApp, auth, GoogleProvider };
