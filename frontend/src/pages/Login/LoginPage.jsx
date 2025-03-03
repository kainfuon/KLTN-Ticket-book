import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "./loginHandler";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password, setError, navigate);
    };

    return (
        <section className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-6">
                    <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">
                        Sign in to your account
                    </h1>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="name@company.com" required />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="••••••••" required />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="w-4 h-4 border rounded bg-gray-50 dark:bg-gray-700" />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-500 dark:text-gray-300">Remember me</label>
                            </div>
                            <a href="#" className="text-sm text-primary-600 hover:underline dark:text-gray-300">Forgot password?</a>
                        </div>
                        <button type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
                            Sign in
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            Don’t have an account yet? <a href="/signup" className="text-primary-600 hover:underline text-white">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );

};

export default LoginPage;
