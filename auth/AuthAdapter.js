import { signOut, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {initializeApp as initializeClientApp, getApp as getClientApp, getAuth as getClientAuth} from 'firebase/app';
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { GoogleProvider } from "./googleProvider";
import serviceAccount from './secrets.json';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export default class AuthAdapter {
    constructor() {}

    static async logout() {
        await signOut(getAuth());
    }

    static async loginWithGoogle() {
        try {
            await signInWithPopup(getAuth(), GoogleProvider);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async loginWithEmail(email, password) {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async createUser(email, password) {
        try {
            await createUserWithEmailAndPassword(getAuth(), email, password);
        } catch (error) {
            throw new Error(error);
        }
    }

    static getUser() {
        return getAuth().currentUser;
    }

    static IdTokenChangedListener() {
        return getAuth().onIdTokenChanged(async (user) => user);
    }

    static getFirebaseAdmin() {
        if (!getApps().length) {
            return initializeApp({
                credential: cert({
                    privateKey: serviceAccount.private_key,
                    clientEmail: serviceAccount.client_email,
                    projectId: serviceAccount.project_id,
                }),
                databaseURL: 'https://auth-b4734.firebaseio.com',
            });
        }
        return getApp();
    }

    static initFirebaseClient() {
        try {
            return getClientApp()
        } catch (err) {
            return initializeClientApp(firebaseConfig);
        }
    }

    static getAuth() {
        return getAuth();
    }

    static getToken() {
        return getAuth().currentUser ? getAuth().currentUser.accessToken : null
    }
}
