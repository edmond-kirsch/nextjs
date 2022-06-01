
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import SignUp from './signup';
import styles from './Auth.module.css';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
export const logout = async () => signOut(auth);

export function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPopupShowed, setIsPopupShowed] = useState(false);
    const [isLoginErrorShowed, setIsLoginErrorShowed] = useState(false);
    const showCreateForm = () => setIsPopupShowed(true);
    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                "hd": process.env.NEXT_PUBLIC_ALLOWED_DOMAIN,
                "prompt": "select_account"
            })
            await signInWithPopup(auth, provider);
        } catch (error) {
            if (error.code = "auth/popup-closed-by-user") {
                return;
            }
            console.log(error.code);
        }
    }
    const loginWithEmail = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setIsLoginErrorShowed(true);
        }
    }
    
    const handleEmailInput = e => {
        setEmail(e.target.value);
        setIsLoginErrorShowed(false);
    }

    const handlePasswordInput = e => {
        setPassword(e.target.value);
        setIsLoginErrorShowed(false);
    }

    return (
        <div className={styles.wrapper}>
            {isPopupShowed ? <SignUp setIsPopupShowed={setIsPopupShowed} auth={auth} createUserWithEmailAndPassword={createUserWithEmailAndPassword} /> : null}
            <div className={styles.logoWrapper}></div> 
            <div className={styles.loginWrapper}>
                <div className={styles.login}>
                    <h2>Login to your Account</h2>
                    <p>Lorem Ipsum is simply dummy text</p>
                    <button className={styles.googleSignIn} onClick={loginWithGoogle}>
                        <div className={styles.googleIcon}></div>
                        Continue with Google</button>
                    <p className={styles.emailSignIn}>----------- or Sign in with Email ----------- </p>
                    <form className={styles.loginForm}>
                        <label htmlFor='email'>Email</label>
                        <input type="email" value={email} onInput={handleEmailInput} id="email" />
                        <label htmlFor='password'>Password</label>
                        <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                        {isLoginErrorShowed ? <div className={styles.errorMessage}>Invalid email or password</div> : null}
                        <input className={styles.loginButton} type="submit" value="Login" onClick={loginWithEmail} />
                    </form>
                </div>
                <div className={styles.createAccount}>Not registered yet? <a onClick={showCreateForm}>Create an account</a></div>
            </div>
        </div>
    )
}
