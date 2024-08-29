"use client";

import MenuSection from "@/sections/menu";
import Head from "next/head";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function Menu() {
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>Marich Menu</title>
        </Head>

        <main className="min-h-screen relative overflow-hidden">
          <MenuSection />
        </main>
      </Provider>
    </>
  );
}
