"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminSignIn } from '@/redux/api/auth.api';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'
import { useAppSelector } from '@/redux/store';


export default function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setloader] = useState(true);

    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const handleLogin = async (e: any) => {
        setloader(true)
        e.preventDefault();
        try {
            const user = await adminSignIn(email, password);
            if (user.user.email) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Login Successful`,
                    showConfirmButton: false,
                    timer: 2200,
                });
                setloader(false);
                router.push('/admin/menu');
            }
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Login failed`,
                showConfirmButton: false,
                timer: 2200,
            });
            setloader(false);
            console.error("Login failed:", error);
        }
    };

    useEffect(() => {
        if (user?.email) {
            router.push('/admin/menu');
        } else {
            setloader(false)
        }
    }, [user]);

    return (
        <div className='relative'>
            {
                loader &&
                <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
                    <div className="flex items-center">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#D3AE49]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="text-2xl ml-4">Loading...</span>
                    </div>
                </div>
            }
            <form onSubmit={handleLogin}>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="font-semibold cursor-pointer">
                        <img src="/logo/marichcafe.jpeg"
                            alt="Sample Image" className="rounded-full h-32" />
                    </Link>
                    <div className="w-full bg-white rounded-xl shadow mt-10 sm:max-w-md xl:p-0 dark:bg-gray-900">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white w-full ">
                                Admin Login
                            </h1>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" onChange={(e) => { setEmail(e.target.value) }} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required={true} disabled={loader} />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required={true} disabled={loader} />
                            </div>
                            <button type="submit" className="w-full bg-[#D9232A] text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loader ? "Loading..." : "Login"}</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
