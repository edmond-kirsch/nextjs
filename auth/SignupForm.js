import { useState } from 'react';
import validateEmail from './utils/validateEmail';
import validatePassword from './utils/validatePassword';
import styles from './Signup.module.css';

export default function SignupForm({setIsSignup, auth, createUserWithEmailAndPassword}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailErrorShowed, setIsEmailErrorShowed] = useState(false);
    const [isPasswordErrorShowed, setIsPasswordErrorShowed] = useState(false);
    const createUser = async (e) => {
        e.preventDefault();
        if (!validateEmail(email, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN) || !validatePassword(password)) {
            if (!validateEmail(email, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN)) {
                console.log(email);
                console.log(process.env.NEXT_PUBLIC_ALLOWED_DOMAIN)
                console.log(validateEmail(email, process.env.NEXT_PUBLIC_ALLOWED_DOMAIN));
                setIsEmailErrorShowed(true);
            }

            if (!validatePassword(password)) {
                setIsPasswordErrorShowed(true);
            }

            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setIsSignup(false);
        } catch (error) {
            console.log(error)
        }
    }

    const handleEmailInput = (e) => {
        setIsEmailErrorShowed(false);
        setEmail(e.target.value);
    }

    const handlePasswordInput = (e) => {
        setIsPasswordErrorShowed(false);
        setPassword(e.target.value);
    }

    const backToLogin = () => {
        setIsSignup(false);
    }
    
    return (
        <div>
            <div className={styles.signup}>
                <h2>Create an Account</h2>
                <p>Lorem Ipsum is simply dummy text</p>
                <form className={styles.signupForm}>
                    <label htmlFor='email'>Email</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    {isEmailErrorShowed ? <div className={styles.errorMessage}>Enter valid email</div> : null}
                    <label htmlFor='password'>Password</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    {isPasswordErrorShowed ? <div className={styles.errorMessage}>Password must contain at least 8 symbols, at least 1 number, at least 1 capital</div> : null}
                    <input className={styles.signupButton} type="submit" value="Create an Account" onClick={createUser} />
                </form>
                <div className={styles.loginAccount}>Already have an Account? <a onClick={backToLogin}>Login</a></div>
            </div>
        </div>
    )
}
