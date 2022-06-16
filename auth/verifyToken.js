import { getAuth } from 'firebase-admin/auth';
import AuthAdapter from './AuthAdapter';

export default async function verifyToken(token) {
    try {
        AuthAdapter.getFirebaseAdmin();
        await getAuth().verifyIdToken(token);
    } catch(error) {
    }
}
