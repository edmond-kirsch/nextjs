import AuthAdapter from './AuthAdapter';
import React, {useState, useEffect, useContext, createContext} from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import Loading from './components/Loading';

const AuthContext = createContext({});

export const LoaderProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [pending, setPending] = useState(true);
    const routes = useRouter();
    AuthAdapter.initFirebaseClient();
    
    useEffect(() => {
        return AuthAdapter.getAuth().onIdTokenChanged(async (user) => {
            const cookies = nookies.get().token;
            if (!cookies && routes.asPath !== '/auth') {
                return;
            }
            if (!user && routes.asPath !== '/auth') {
                nookies.set(undefined, "token", "", {});
                await routes.push('/auth');;
                setPending(false);
                setUser(null);
                return 
            }
            setUser(user);
            setPending(false);
        })
    }, []);
    
    return pending ? <Loading /> : <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
