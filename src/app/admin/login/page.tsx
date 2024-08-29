"use client";
import { store } from "@/redux/store";
import { Provider } from 'react-redux';
import { useEffect } from "react";
import { listenForAuthChanges } from "@/redux/api/auth.api";
import LoginComponent from "@/components/login";


const Login = () => {
    useEffect(() => {
        store.dispatch(listenForAuthChanges());
    }, []);
    return (
        <Provider store={store}>
            <LoginComponent />
        </Provider>
    );
};

export default Login;
