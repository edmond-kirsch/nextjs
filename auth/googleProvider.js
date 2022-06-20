import { GoogleAuthProvider } from "firebase/auth";

const GoogleProvider = new GoogleAuthProvider();
GoogleProvider.setCustomParameters({
    "hd": process.env.NEXT_PUBLIC_ALLOWED_DOMAIN,
    "prompt": "select_account"
})

export { GoogleProvider };
