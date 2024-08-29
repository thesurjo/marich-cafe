// src/pages/admin/login.tsx

"use client";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);



    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl text-white font-bold mb-8 animate-pulse">
                Coming Soon
            </h1>
            <p className="text-white text-lg mb-8">
               This section is under development
            </p>
        </div>
    );
}
