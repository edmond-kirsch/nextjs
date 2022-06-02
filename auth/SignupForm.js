import { useState } from 'react';
import validateEmail from './utils/validateEmail';
import validatePassword from './utils/validatePassword';
import styles from './Auth.module.css';
import { auth } from './firebase';
import { createUserWithEmailAndPassword} from "firebase/auth";
import { useDispatch } from 'react-redux';
import { loginAction } from '../app/store/actions';

export default function SignupForm({setIsSignup}) {
    const dispatch = useDispatch();
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
            dispatch(loginAction())
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
            <div className={styles.auth}>
                <h2>Create an Account</h2>
                <p>Lorem Ipsum is simply dummy text</p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>Email</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    {isEmailErrorShowed ? <div className={styles.errorMessage}>Enter valid email</div> : null}
                    <label htmlFor='password'>Password</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    {isPasswordErrorShowed ? <div className={styles.errorMessage}>Password must contain at least 8 symbols, at least 1 number, at least 1 capital</div> : null}
                    <input className={styles.authButton} type="submit" value="Create an Account" onClick={createUser} />
                </form>
                <div className={styles.otherOption}>Already have an Account? <a onClick={backToLogin}>Login</a></div>
            </div>
        </div>
    )
}
