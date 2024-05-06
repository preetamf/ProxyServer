import React, { useState } from 'react';
import { Link, Navigate, useNavigate  } from 'react-router-dom';
import { countryCode } from '../utils/CountryCode';
import Select from "react-select";
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        countryCode: 'IN',
        phoneNumber: ''
    });

    const [confirmTyping, setConfirmTyping] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Check if the change occurred in the Password Confirmation field
        if (name === 'passwordConfirmation') {
            setConfirmTyping(true);
        }
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({
            ...formData,
            countryCode: selectedOption.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            alert('Passwords do not match');
            console.error('Passwords do not match');
            return;
        }
        
        axios.post('http://localhost:8000/api/v1/users/signup', formData)
            .then(response => {
                // Handle the response from the server (success or error)
                console.log('Signup response:', response.data);
                // Navigate to home page after successful signup
                navigate("/", { replace: true });
            })
            .catch(error => {
                console.error('Signup error:', error);
            });
    };

    return (
        <section className="hidden-scrollbar bg-white dark:bg-gray-900 overflow-y-hidden">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-7">
                <aside className="relative block lg:order-last lg:col-span-3 lg:h-screen ">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </aside>

                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:px-4 lg:py-2 lg:col-span-4 lg:h-screen"
                >
                    <div className="max-w-xl lg:max-w-3xl px-8">

                        <h1 className="ext-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                            Welcome to APPEXIO 🦑
                        </h1>

                        <p className="mt-2 leading-relaxed text-gray-500 dark:text-gray-400">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam dolorum aliquam,
                            quibusdam aperiam voluptatum.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-6 gap-3 p-2">
                            <div className="col-span-6 sm:col-span-6">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    User Full Name
                                </label>

                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>
                            <div className="col-span-6">
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            {/* Repeat the same pattern for last name, email, password, password confirmation */}

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="CountryCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Country Code
                                </label>
                                <Select
                                    id="CountryCode"
                                    name="countryCode"
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    value={countryCode.find(option => option.value === formData.countryCode)}
                                    onChange={handleSelectChange}
                                    options={countryCode.map(country => ({
                                        value: country.code,
                                        label: `${country.code} (${country.name})`
                                    }))}
                                />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="PhoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="Password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label
                                    htmlFor="PasswordConfirmation"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Password Confirmation
                                </label>

                                <input
                                    type="password"
                                    id="PasswordConfirmation"
                                    name="passwordConfirmation"
                                    value={formData.passwordConfirmation}
                                    onChange={handleChange}
                                    className={`mt-1 w-full rounded-md border ${confirmTyping && formData.password !== formData.passwordConfirmation ? 'border-red-500' : 'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200`}
                                />
                                {confirmTyping && formData.password !== formData.passwordConfirmation && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                )}
                            </div>

                            <div className="col-span-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    By creating an account, you agree to our
                                    <a href="#" className="text-gray-700 underline dark:text-gray-200 px-[3px] ">
                                        terms and conditions
                                    </a>
                                    and
                                    <a href="#" className="text-gray-700 underline dark:text-gray-200 px-[3px]"> privacy policy </a>.
                                </p>
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
                                >
                                    Create an account
                                </button>

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-400">
                                    Already have an account?
                                    <a href="#" >Log in</a>.
                                    <Link className="underline text-blue-500 dark:text-gray-200 px-[3px]" to="/">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default Signup;
