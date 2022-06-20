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
    const cookieLocale = nookies.get().locale;
    const output = !cookieLocale || cookieLocale === 'en' ? '' : `/${cookieLocale}`;
    AuthAdapter.initFirebaseClient();
    
    useEffect(() => {
        return AuthAdapter.getAuth().onIdTokenChanged(async (user) => {
            const pathname = window.location.pathname.slice(window.location.pathname.lastIndexOf('/'))
            if (pathname === '/auth' && user) {
                const token = AuthAdapter.getToken();
                nookies.set(undefined, "token", token, {});
                setUser(user);
                setPending(false);
                return routes.push(`${output}/`);
            }
            const cookies = nookies.get().token;
            if (!cookies && pathname !== '/auth') {
                setPending(false);
                return;
            }
            if (!user && pathname !== '/auth') {
                nookies.destroy(undefined, 'token');
                setPending(false);
                setUser(null);
                return routes.push(`${output}/auth`);
            }
            setUser(user);
            setPending(false);
        })
    }, []);
    
    return pending ? <Loading /> : <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
