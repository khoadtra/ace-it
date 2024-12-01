'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signInUser } from '@/lib/firebase/authHelpers';
import { useAuth } from '@/lib/firebase/authContext';

const LoginPage = () => {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const firebaseUiInitialized = useRef(false);

    useEffect(() => {
        if (!loading && user) {
            router.push('/'); // Redirect logged-in users to the home page
        }
    }, [user, loading, router]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null);

        if (!emailOrUsername || !password) {
            setError('Please enter your username/email and password.');
            return;
        }

        try {
            await signInUser(emailOrUsername, password);
            router.push('/'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Error signing in:', error.message);
            setError('Invalid credentials. Please try again.');
        }
    };

    useEffect(() => {
        if (!firebaseUiInitialized.current && typeof window !== 'undefined') {
            firebaseUiInitialized.current = true;

            const loadFirebaseUI = async () => {
                const { startFirebaseUI } = await import('@/lib/firebase/firebaseui');

                if (!document.querySelector('#firebaseui-auth-container').hasChildNodes()) {
                    startFirebaseUI('#firebaseui-auth-container');
                }
            };

            loadFirebaseUI();
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (user) {
        return null; // Prevent rendering if the user is logged in
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login to Ace-It</h1>

                <form onSubmit={handleSignIn}>
                    <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => {
                            setEmailOrUsername(e.target.value);
                            setError(null);
                        }}
                        placeholder="Enter your username or email"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="username"
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null);
                        }}
                        placeholder="Enter your password"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="current-password"
                    />

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="show-password"
                            checked={showPassword}
                            onChange={() => setShowPassword((prev) => !prev)}
                            className="mr-2"
                        />
                        <label htmlFor="show-password" className="text-gray-700">
                            Show Password
                        </label>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    <a href="/account/forgot-password" className="text-blue-500 hover:underline">
                        Forgot password?
                    </a>
                </p>

                <div id="firebaseui-auth-container" className="mt-6"></div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Don’t have an account?{' '}
                    <a href="/account/register" className="text-blue-500 hover:underline">
                        Register here.
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
