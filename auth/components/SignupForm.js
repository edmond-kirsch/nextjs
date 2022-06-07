import { useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, createUserWithEmailAndPassword}  from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import styles from '../styles/Auth.module.css';
import validateEmail from '../utils/validateEmail';
import validatePassword from '../utils/validatePassword';
import { locales } from '../../locales';

export default function SignupForm({setIsSignup}) {
    const toast = useToast();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleEmailInput = (e) => setEmail(e.target.value);
    const handlePasswordInput = (e) => setPassword(e.target.value);
    const backToLogin = () => setIsSignup(false);
    const locale = router.locale;

    const createUser = async (e) => {
        e.preventDefault();
        if (!validateEmail(email, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN) || !validatePassword(password)) {
            if (!validateEmail(email, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN)) {
                if (!toast.isActive('mail-error')) {
                    toast({
                        position: 'top',
                        id: 'mail-error',
                        title: "An error ocurred",
                        description: 'Enter valid email',
                        status: "error",
                        duration: 6000,
                        isClosable: true
                    })
                }
            }

            if (!validatePassword(password)) {
                if (!toast.isActive('pass-error')) {
                    toast({
                        position: 'top',
                        id: 'pass-error',
                        title: "An error ocurred",
                        description: 'Password must contain at least 8 symbols, at least 1 number, at least 1 capital',
                        status: "error",
                        duration: 6000,
                        isClosable: true
                    })
                }
            }

            return;
        }

        try {
            await createUserWithEmailAndPassword(getAuth(), email, password);
            setIsSignup(false);
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
        <div>
            <div className={styles.auth}>
                <h2>{locales[locale].auth.create}</h2>
                <p>{locales[locale].auth.createParagraph}</p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>{locales[locale].auth.email}</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    <label htmlFor='password'>{locales[locale].auth.password}</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    <input className={styles.authButton} type="submit" value={locales[locale].auth.create} onClick={createUser} />
                </form>
                <div className={styles.otherOption}>{locales[locale].auth.createAlreadyHave}<a onClick={backToLogin}>{locales[locale].auth.login}</a></div>
            </div>
        </div>
    )
}
