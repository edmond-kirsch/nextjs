
import { useState, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import styles from './Auth.module.css';
import { SwitchTransition, CSSTransition, Transition } from 'react-transition-group';

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
    const [isSignup, setIsSignup] = useState(false);
    const [isLoginErrorShowed, setIsLoginErrorShowed] = useState(false);
    const nodeRef = useRef(null);
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
    
    return (
        <div className={styles.wrapper}>
            <style jsx>{`
                .${styles.logo}.entering {
                    animation: logo 1000ms forwards
                }
                .${styles.logo}.entered {
                    opacity: 1
                }
                .${styles.logo}.exiting {
                    animation: logo 1000ms forwards
                }
                .${styles.logo}.exited {
                    opacity: 1
                }
                .fade-enter-active {
                    animation: fade-in 500ms forwards
                }
                .fade-exit-active {
                    animation: fade-out 500ms forwards
                }
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translate(400px);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(0);
                    }
                }
                @keyframes fade-out {
                    0% {
                        opacity: 1;
                        transform: translate(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(400px);
                    }
                }
                @keyframes logo {
                    0% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
            <div className={styles.logoWrapper}>
                <Transition
                    in={isSignup}
                    timeout={500}
                    nodeRef={nodeRef}
                >
                    {state => <div ref={nodeRef} className={`${styles.logo} ${state}`}></div>}
                </Transition>
            </div> 
            <SwitchTransition>
                <CSSTransition
                    key={isSignup}
                    timeout={500}
                    classNames='fade'
                    nodeRef={nodeRef}
                >
                    {isSignup ?
                        <div ref={nodeRef} className={styles.authWrapper}>
                            <SignupForm
                                setIsSignup={setIsSignup}
                                auth={auth}
                                createUserWithEmailAndPassword={createUserWithEmailAndPassword}
                            />
                        </div>
                        : 
                        <div ref={nodeRef} className={styles.authWrapper}>
                            <LoginForm
                                loginWithGoogle={loginWithGoogle}
                                setIsSignup={setIsSignup}
                                loginWithEmail={loginWithEmail}
                                isLoginErrorShowed={isLoginErrorShowed}
                                setIsLoginErrorShowed={setIsLoginErrorShowed}
                            />    
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>
        </div>
    )
}
