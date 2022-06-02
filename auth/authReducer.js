import { auth } from "./firebase";

const defaultState = {
    isAuth: !!auth.currentUser,
}

export default function AuthReducer(state = defaultState, action) {
    if (action.type === 'LOGIN') {
        return {...state, isAuth: true};
    }
    if (action.type === 'LOGOUT') {
        return {...state, isAuth: false};
    }
    return state;
}

