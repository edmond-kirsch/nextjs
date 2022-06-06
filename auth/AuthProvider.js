import React, {useState, useEffect, useContext, createContext} from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import nookies from 'nookies';
import Loading from './components/Loading';
import firebaseClient from './firebaseClient';
import { logout } from './utils/logout';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    firebaseClient();
    const [user, setUser] = useState(null);
    const [pending, setPending] = useState(true);
    const routes = useRouter();

    useEffect(() => {
        return getAuth().onIdTokenChanged(async (user) => {
            setPending(true);
            if (!user) {
                routes.push('/auth');
                setPending(false);
                setUser(null);
                nookies.set(undefined, "token", "", {});
                nookies.set(undefined, "exp", "", {});
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = nookies.get().exp;
            if (expirationTime && expirationTime < currentTime) {
                logout();
                setPending(false);
                setUser(null);
                nookies.set(undefined, "token", "", {});
                nookies.set(undefined, "exp", "", {});
                routes.push('/auth');
                return;
            }

            const result = await user.getIdTokenResult();
            setUser(user);
            setPending(false);
            nookies.set(undefined, "token", result.token, {});
            nookies.set(undefined, "exp", result.claims.exp, {});
        })
    }, [])


    if (pending) {
        return <Loading />
    }

    return (<AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>)
}

export const useAuth = () => useContext(AuthContext);
