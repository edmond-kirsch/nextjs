import { useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';
import validateEmail from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';
import useTranslation from 'next-translate/useTranslation';
import AuthAdapter from '../AuthAdapter';
import { ToastContext } from './ToastContext';
import { useContext } from 'react';

export default function SignupForm({setIsSignup}) {
    const router = useRouter();
    const { t } = useTranslation('auth');
    const email = useRef();
    const password = useRef();
    const backToLogin = () => setIsSignup(false);
    const { showToast } = useContext(ToastContext);

    const createUser = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(email.current.value, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN)) {
            return showToast('Enter valid email');
        }

        if (!validatePassword(password.current.value)) {
            return showToast('Password must contain at least 8 symbols, at least 1 number, at least 1 capital');
        }

        AuthAdapter.createUser(email.current.value, password.current.value)
            .then(() => router.push('/'))
            .catch(error => {
                const message = error.message;
                showToast(message);
            })
    }

    return (
        <div>
            <div className={styles.auth}>
                <h2>{t('create')}</h2>
                <p>{t('createParagraph')}</p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>{t('email')}</label>
                    <input ref={email} type="email" id="email" />
                    <label htmlFor='password'>{t('password')}</label>
                    <input ref={password} type="password" id="password" />
                    <input className={styles.authButton} type="submit" value={t('create')} onClick={createUser} />
                </form>
                <div className={styles.otherOption}>{t('createAlreadyHave')}<a onClick={backToLogin}>{t('login')}</a></div>
            </div>
        </div>
    )
}
