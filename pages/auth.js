import { Auth } from "../auth/Auth"
import verifyToken from "../auth/verifyToken";

export default function AuthPage() {
    return (
        <Auth />
    )
}

export async function getServerSideProps(context) {
    try {
        const token = context.req.cookies ? context.req.cookies.token : null;
        if (token) {
            await verifyToken(token);
            context.res.writeHead(301, {
                Location: '/'
            });
            context.res.end();
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
