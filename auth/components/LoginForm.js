import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithPopup, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import styles from '../styles/Auth.module.css';
import { GoogleProvider } from '../googleProvider';
import { locales } from '../../locales';
import nookies from 'nookies';

export default function LoginForm({setIsSignup}) {
    const toast = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const showCreateForm = () => setIsSignup(true);
    const handleEmailInput = e => setEmail(e.target.value);
    const handlePasswordInput = e => setPassword(e.target.value);
    const locale = nookies.get().locale || router.locale;

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(getAuth(), GoogleProvider);
            router.push('/');
        } catch (error) {
            const message = error.message;
            toast({
                position: 'top',
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
                position: 'top',
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
                <h2>{locales[locale].auth.loginHeader}</h2>
                <p>{locales[locale].auth.loginParagraph}</p>
                <button className={styles.googleSignIn} onClick={loginWithGoogle}>
                    <div className={styles.googleIcon}></div>
                    {locales[locale].auth.loginWithGoogle}
                </button>
                <p className={styles.emailSignIn}>{locales[locale].auth.loginWithEmail}</p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>{locales[locale].auth.email}</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    <label htmlFor='password'>{locales[locale].auth.password}</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    <input className={styles.authButton} type="submit" value={locales[locale].auth.login} onClick={loginWithEmail} disabled={email === "" || password === ""}/>
                </form>
            </div>
            <div className={styles.otherOption}>{locales[locale].auth.loginNotRegistered}<a onClick={showCreateForm}>{locales[locale].auth.create}</a></div>
        </>
    )
}
