import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../utils/useAuth';
import axios from 'axios';

function Login() {
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', loginData);
            // console.log("login response: ", response)
            const user  = response.data.data.user;
            await login(user );
        } catch (error) {
            console.error('Error logging in:', error);
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const isValidForm = loginData.email.trim() !== '' && loginData.password.trim() !== '';

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Form  */}
            <div className="md:w-1/2 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-lg w-full">
                        <div className="mb-8">
                            <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">High-Quality Proxies</h1>
                            <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
                                Easily integrate an unblockable IP pool with the best pricing in the market. Pay only for the gigabytes you use and forget about monthly fees.
                            </p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
                            <p className="text-center text-lg font-medium">Sign in to your account</p>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <div className="relative">
                                    <input
                                        id='email'
                                        type="email"
                                        name="email"
                                        value={loginData.email}
                                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                        placeholder="Enter email"
                                        onChange={handleChange}
                                    />
                                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <div className="relative">
                                    <input
                                        id='password'
                                        type="password"
                                        name='password'
                                        value={loginData.password}
                                        className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                        placeholder="Enter password"
                                        onChange={handleChange}
                                    />
                                    <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="size-4 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-500 px-1">
                                    No account?{' '}
                                    <Link className="underline px-1 text-blue-500" to="/signup">
                                        Sign up
                                    </Link>
                                </p>
                                <button
                                    type="submit"
                                    className={`inline-block rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white ${!isValidForm || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!isValidForm || loading}
                                >
                                    {loading ? 'Loading...' : 'Sign in'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* image */}
            <div className="max-sm:hidden md:w-1/2 overflow-hidden">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}

export default Login;
