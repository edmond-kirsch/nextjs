import { useState } from 'react';
import styles from './Auth.module.css';
import { auth, GoogleProvider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { loginAction } from '../app/store/actions';

export default function LoginForm({setIsSignup}) {
    const dispatch = useDispatch();
    const [isLoginErrorShowed, setIsLoginErrorShowed] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const showCreateForm = () => {
        setIsLoginErrorShowed(false);
        setIsSignup(true);
    }
    const handleEmailInput = e => {
        setEmail(e.target.value);
        setIsLoginErrorShowed(false);
    }

    const handlePasswordInput = e => {
        setPassword(e.target.value);
        setIsLoginErrorShowed(false);
    }

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, GoogleProvider);
            dispatch(loginAction())
        } catch (error) {
            if (error.code = "auth/popup-closed-by-user") {
                return;
            }
        }
    }

    const loginWithEmail = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            dispatch(loginAction())
        } catch (error) {
            setIsLoginErrorShowed(true);
        }
    }
    return (
        <>
            <div className={styles.auth}>
                <h2>Login to your Account</h2>
                <p>Lorem Ipsum is simply dummy text</p>
                <button className={styles.googleSignIn} onClick={loginWithGoogle}>
                    <div className={styles.googleIcon}></div>
                    Continue with Google</button>
                <p className={styles.emailSignIn}>----------- or Sign in with Email ----------- </p>
                <form className={styles.authForm}>
                    <label htmlFor='email'>Email</label>
                    <input type="email" value={email} onInput={handleEmailInput} id="email" />
                    <label htmlFor='password'>Password</label>
                    <input type="password" value={password} onInput={handlePasswordInput} id="password" />
                    {isLoginErrorShowed ? <div className={styles.errorMessage}>Invalid email or password</div> : null}
                    <input className={styles.authButton} type="submit" value="Login" onClick={loginWithEmail} />
                </form>
            </div>
            <div className={styles.otherOption}>Not registered yet? <a onClick={showCreateForm}>Create an account</a></div>
        </>
    )
}
