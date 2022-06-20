import { Auth } from "../auth/Auth"
import verifyToken from "../auth/verifyToken";
import nookies from 'nookies';
import { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ToastContext } from "../auth/components/ToastContext";

export default function AuthPage() {
    const [toastIsOpened, setToastIsOpened] = useState(false);
    const [toastMessage, setToastMessage] = useState('toast message');
    const closeToast = () => setToastIsOpened(false);
    const showToast = (message) => {
        setToastMessage(message);
        setToastIsOpened(true);
    }
    return (
        <ToastContext.Provider value={{showToast}}>
            <Auth />
            <Snackbar open={toastIsOpened} autoHideDuration={6000} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={closeToast} severity="error" sx={{width: '100%'}}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    )
}

export async function getServerSideProps(ctx) {
    const cookieLocale = nookies.get(ctx).locale;
    if (cookieLocale && ctx.locale !== cookieLocale) {
      return {
        redirect: {
          permanent: false,
          destination: `${cookieLocale}/auth`,
        },
        props: {},
      };
    }
    try {
        const token = nookies.get(ctx).token;
        if (token) {
            await verifyToken(token);
            return {
                redirect: {
                    destination: '/'
                }
            }
        } else {
            throw new Error('no token')
        }
    } catch(error) {
        console.log('return internal server error');
    }
    return {
        props: {},
    };

}
