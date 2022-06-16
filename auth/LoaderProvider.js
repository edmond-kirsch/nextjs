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
            if (window.location.pathname === '/auth' && user) {
                const token = AuthAdapter.getToken();
                nookies.set(undefined, "token", token, {});
                setUser(user);
                setPending(false);
                return routes.push('/');
            }
            const cookies = nookies.get().token;
            if (!cookies && window.location.pathname !== '/auth') {
                setPending(false);
                return;
            }
            if (!user && window.location.pathname !== '/auth') {
                nookies.destroy(undefined, 'token');
                setPending(false);
                setUser(null);
                return routes.push('/auth');
            }
            setUser(user);
            setPending(false);
        })
    }, []);
    
    return pending ? <Loading /> : <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
