import { getAuth } from 'firebase-admin/auth';
import AuthAdapter from './AuthAdapter';

export default async function verifyToken(token) {
    try {
        AuthAdapter.getFirebaseAdmin(); //necessary
        await getAuth().verifyIdToken(token);
        console.log('success in verify token function')
    } catch(error) {
        console.log('error in verify token function')
    }
}
