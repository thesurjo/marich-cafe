"use client";
import { store } from "@/redux/store";
import { Provider } from 'react-redux';
import EditableFeed from '@/sections/menu/Editable-feed';
import { useEffect } from "react";
import { listenForAuthChanges } from "@/redux/api/auth.api";


const AddMenuPage = () => {
    useEffect(() => {
        store.dispatch(listenForAuthChanges());
    }, []);
    return (
        <Provider store={store}>
            <EditableFeed />
        </Provider>
    );
};

export default AddMenuPage;
