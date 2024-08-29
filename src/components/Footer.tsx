import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-around px-6 bg-black mt-[96px] mb-2 mx-4 py-10 rounded-3xl">
      <div className="w-full max-w-[162px]">
      <Link href="/" className="font-semibold cursor-pointer">
          <img src=
            "logo/marichcafe.jpeg"
            alt="Sample Image" className="rounded-full h-20" />
        </Link>
        <p className="mt-[22px] text-white text-opacity-50">
          Created by Surya Basak,{" "}
          <Link
            href="https://www.linkedin.com/in/suryabasak/"
            target="_blank"
            className="text-blue-600 hover:underline"
          >
            Linkedin
          </Link>
        </p>
      </div>

      <div className="w-auto">
        <h1 className="text-[18px] font-bold">Pages</h1>
        <ul className="mt-[12px]">
          <li className="mb-[22px] text-[16px] text-white text-opacity-50 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="mb-[22px] text-[16px] text-white text-opacity-50 cursor-pointer">
            <Link href="/menu">Menu</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
