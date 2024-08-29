"use client"
import { store, useAppSelector } from "@/redux/store";
import { Provider, useSelector } from 'react-redux';
import DragableFeed from '@/sections/menu/Dragable-feed';
import { listenForAuthChanges } from "@/redux/api/auth.api";
import { useEffect } from "react";


export default function Menu() {
    useEffect(() => {
        store.dispatch(listenForAuthChanges());
    }, []);
    return (
        <Provider store={store}>
            <DragableFeed />
        </Provider>
    );
}
