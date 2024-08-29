"use client";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Marich</title>
      </Head>
      <main className="min-h-screen w-full bg-fixed">
        <div className="bg-center" style={{ background: `url(/slide2.jpg)`, backgroundPosition: 'center' }}>
          <div className="inset-0 min-h-screen w-full bg-transparent flex flex-col items-center justify-around">
            <Link href="/" className="font-semibold cursor-pointer">
              <img src=
                "/logo/marichcafe.jpeg"
                alt="Sample Image" className="rounded-full h-32" />
            </Link>
            <section id="hero" className="hero flex justify-center mt-12">
              <div className="hero__slider">
                <button className="action-button prev" aria-label="previous slide">
                  <i className="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
                <div className="hero__slide-indicators">
                  <button className="hero__slide-indicator slide-indicator checked" aria-label="slide 1" aria-current="step"></button>
                  <button className="hero__slide-indicator slide-indicator" aria-label="slide 2"></button>
                  <button className="hero__slide-indicator slide-indicator" aria-label="slide 3"></button>
                  <button className="hero__slide-indicator slide-indicator" aria-label="slide 4"></button>
                </div>
                <button className="action-button next" aria-label="next slide">
                  <i className="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
              </div>
              <div className="hero__slide-description-wrapper">
                <h3 className="hero__slide-title">Marich Cafe</h3>
                <p className="hero__slide-description">Welcome to 
                  <span className="highlight-two"> Marich Cafe</span>, where good vibes meet great company. Discover a place to relax, connect, and enjoy the moment. Your favorite spot just got better!
                </p>

                <div className="hero__slide-btns">
                  <Link
                    href="/menu"
                    className="tracking-widest font-semibold cursor-pointer rounded-full flex items-center justify-center px-9 py-2 bg-[#D3AE49] text-black"
                  >
                    Menu
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
