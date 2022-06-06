import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import styles from '../styles/Auth.module.css';
import { GoogleProvider } from '../googleProvider';

export default function LoginForm({setIsSignup}) {
    const toast = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const showCreateForm = () => setIsSignup(true);
    const handleEmailInput = e => setEmail(e.target.value);
    const handlePasswordInput = e => setPassword(e.target.value);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(getAuth(), GoogleProvider);
            router.push('/');
        } catch (error) {
            const message = error.message;
            toast({
                title: "An error ocurred",
                description: message,
                status: "error",
                duration: 6000,
                isClosable: true
            })
        }
    }

    const loginWithEmail = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(getAuth(), email, password);
            router.push('/');
        } catch (error) {
            const message = error.message;
            toast({
                title: "An error ocurred",
                description: message,
                status: "error",
                duration: 6000,
                isClosable: true
            })
        }
    }

    return (
        <>
            <div className={styles.auth}>
                <h2>Login to your Account</h2>
                <p>Lorem Ipsum is simply dummy text</p>
                <button className={styles.googleSignIn} onClick={loginWithGoogle}>
                    <div className={styles.googleIcon}></div>
                    Continue with Google
                </button>
                <p className={styles.emailSignIn}>----------- or Sign in with Email ----------- </p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>Email</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    <label htmlFor='password'>Password</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    <input className={styles.authButton} type="submit" value="Login" onClick={loginWithEmail} disabled={email === "" || password === ""}/>
                </form>
            </div>
            <div className={styles.otherOption}>Not registered yet? <a onClick={showCreateForm}>Create an account</a></div>
        </>
    )
}
