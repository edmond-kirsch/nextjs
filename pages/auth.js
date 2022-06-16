import { Auth } from "../auth/Auth"
import verifyToken from "../auth/verifyToken";
import nookies from 'nookies';

export default function AuthPage() {
    return (
        <Auth />
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
