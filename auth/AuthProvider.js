import React, {useState, useEffect, useContext, createContext} from 'react';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import nookies from 'nookies';
import Loading from './components/Loading';
import firebaseClient from './firebaseClient';
import { logout } from './utils/logout';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [pending, setPending] = useState(true);
    const routes = useRouter();
    firebaseClient();
    
    useEffect(() => {
        return getAuth().onIdTokenChanged(async (user) => {
            if (!user) {
                await routes.push('/auth');
                setPending(false);
                setUser(null);
                nookies.set(undefined, "token", "", {});
                nookies.set(undefined, "exp", "", {});
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = nookies.get().exp;
            if (expirationTime && expirationTime < currentTime) {
                await logout();
                setUser(null);
                nookies.set(undefined, "token", "", {});
                nookies.set(undefined, "exp", "", {});
                await routes.push('/auth');
                setPending(false);
                return;
            }

            const result = await user.getIdTokenResult();
            setUser(user);
            setPending(false);
            nookies.set(undefined, "token", result.token, {});
            nookies.set(undefined, "exp", result.claims.exp, {});
        })
    }, []);
    
    return pending ? <Loading /> : <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
