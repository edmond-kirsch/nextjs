import { signOut, getAuth } from "firebase/auth";
export const logout = async () => signOut(getAuth());
