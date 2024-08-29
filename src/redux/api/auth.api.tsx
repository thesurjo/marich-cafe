import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../config";
import { loginFailure, loginStart, loginSuccess, logout, setUser } from "../authSlice";
import { AppDispatch } from "../store";

export const adminSignIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error: any) {
        console.error('Error logging in: ', error);
        throw new Error('Error logging in');
    }
};

export const adminSignOut = () => async (dispatch: AppDispatch) => {
    try {
        await signOut(auth);
        dispatch(logout());
    } catch (error) {
        console.error(error);
    }
};

export const listenForAuthChanges = () => (dispatch: AppDispatch) => {
    onAuthStateChanged(auth, (user: User | null) => {
        dispatch(loginStart());
        if (user) {
            dispatch(setUser(user));
            dispatch(loginSuccess(user));
        } else {
            dispatch(logout());
            dispatch(loginFailure('logout'));
        }
    });
};