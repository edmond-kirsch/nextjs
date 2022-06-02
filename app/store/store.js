
import { createStore } from "redux";
import rootReducer from "./reducers";
import { auth } from "../../auth/firebase";


// const initStore = {
//     auth: {
//         isAuth: !!auth.currentUser,
//     }
// }

export const store = createStore(rootReducer);
