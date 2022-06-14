import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import Loading from './components/Loading';
import AuthAdapter from './AuthAdapter';

export const LoaderProvider = ({children}) => {
    const [pending, setPending] = useState(true);
    const routes = useRouter();
    AuthAdapter.initFirebaseClient();
    
    useEffect(() => {
        return AuthAdapter.getAuth().onIdTokenChanged(async (user) => {
            if (!user) {
                setPending(false);
                nookies.set(undefined, "token", "", {});
                return routes.push('/auth');
            }
            const token = AuthAdapter.getToken();
            setPending(false);
            nookies.set(undefined, "token", token, {});
        })
    }, []);
    
    return pending ? <Loading /> : children;
}
