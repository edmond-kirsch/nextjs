import { signOut } from "firebase/auth";
import { auth } from "../firebase";
export const logout = async () => signOut(auth);