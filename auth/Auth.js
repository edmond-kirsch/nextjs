
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import { SwitchTransition, CSSTransition, Transition } from 'react-transition-group';
import { ChakraProvider } from '@chakra-ui/react';
import styles from './styles/Auth.module.css';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Loading from './components/Loading';
import firebaseClient from './firebaseClient';

export function Auth() {
    firebaseClient();
    const [isSignup, setIsSignup] = useState(false);
    const nodeRef = useRef(null);
    const routes = useRouter();
    const [pending, setPending] = useState(true);

    useEffect(() => {
        return getAuth().onAuthStateChanged(async (user) => {
            if (user) {
                routes.push('/');
            } else {
                setPending(false);
            }
        })
    }, [])
    if (pending) {
        return <Loading />
    }
    
    return (
        <ChakraProvider>
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
                            <SignupForm setIsSignup={setIsSignup} />
                        </div>
                        : 
                        <div ref={nodeRef} className={styles.authWrapper}>
                            <LoginForm setIsSignup={setIsSignup} />    
                        </div>
                    }
                </CSSTransition>
            </SwitchTransition>
        </div>
        </ChakraProvider>
    )
}
