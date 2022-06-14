import { signOut, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {initializeApp as initializeClientApp, getApp as getClientApp} from 'firebase/app';
import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { GoogleProvider } from "./googleProvider";
import nookies from 'nookies';
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
        signOut(getAuth());
    }

    static async loginWithGoogle() {
        try {
            const { user } = await signInWithPopup(getAuth(), GoogleProvider);
            const token = await user.getIdToken();
            nookies.set(undefined, "token", token, {});
        } catch (error) {
            throw new Error(error);
        }
    }

    static async loginWithEmail(email, password) {
        try {
            const { user } = await signInWithEmailAndPassword(getAuth(), email, password);
            const token = await user.getIdToken();
            nookies.set(undefined, "token", token, {});
        } catch (error) {
            throw new Error(error);
        }
    }

    static async createUser(email, password) {
        try {
            const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
            const token = await user.getIdToken();
            nookies.set(undefined, "token", token, {});
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
            getClientApp()
        } catch (err) {
            initializeClientApp(firebaseConfig);
        }
    }

    static async verifyToken(token) {
        await this.getFirebaseAdmin().auth().verifyIdToken(token);
    }

    static getAuth() {
        return getAuth();
    }
    static getToken() {
        const token = getAuth().currentUser.accessToken;
        return token;
    }
}