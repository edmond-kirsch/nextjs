import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import styles from '../styles/Auth.module.css';
import useTranslation from 'next-translate/useTranslation';
import AuthAdapter from '../AuthAdapter';
import nookies from 'nookies';

export default function LoginForm({ setIsSignup }) {
    const toast = useToast();
    const router = useRouter();
    const { t } = useTranslation('auth');
    const email = useRef();
    const password = useRef();
    const showCreateForm = () => setIsSignup(true);

    const loginWithGoogle = async () => {
        AuthAdapter.loginWithGoogle().then(async () => await router.push('/')).catch((error) => {
            const message = error.message;
            toast({
                position: 'top',
                title: "An error ocurred",
                description: message,
                status: "error",
                duration: 6000,
                isClosable: true
            })
        })
    }
    
    const loginWithEmail = async (event) => {
        event.preventDefault();
        AuthAdapter.loginWithEmail(email.current.value, password.current.value).then(async () => await router.push('/')).catch((error) => {
            const message = error.message;
            toast({
                position: 'top',
                title: "An error ocurred",
                description: message,
                status: "error",
                duration: 6000,
                isClosable: true
            })
        })
    }

    return (
        <>
            <div className={styles.auth}>
                <h2>{t('loginHeader')}</h2>
                <p>{t('loginParagraph')}</p>
                <button className={styles.googleSignIn} onClick={loginWithGoogle}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={25} height={25} viewBox="0 0 48 48">
                    <defs>
                        <path id="a" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
                    </defs>
                    <clipPath id="b">
                        <use xlinkHref="#a" overflow="visible"/>
                    </clipPath>
                    <path clipPath="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z"/>
                    <path clipPath="url(#b)" fill="#EA4335" d="m0 11 17 13 7-6.1L48 14V0H0z"/>
                    <path clipPath="url(#b)" fill="#34A853" d="m0 37 30-23 7.9 1L48 0v48H0z"/>
                    <path clipPath="url(#b)" fill="#4285F4" d="M48 48 17 24l-4-3 35-10z"/>
                </svg>
                    {t('loginWithGoogle')}
                </button>
                <p className={styles.emailSignIn}>{t('loginWithEmail')}</p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>{t('email')}</label>
                    <input ref={email} type="email" id="email" />
                    <label htmlFor='password'>{t('password')}</label>
                    <input ref={password} type="password" id="password" />
                    <input className={styles.authButton} type="submit" value={t('login')} onClick={loginWithEmail} disabled={email === "" || password === ""}/>
                </form>
            </div>
            <div className={styles.otherOption}>{t('loginNotRegistered')}<a onClick={showCreateForm}>{t('create')}</a></div>
        </>
    )
}
