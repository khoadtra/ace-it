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

    // Redirect logged-in users to the homepage
    useEffect(() => {
        if (!loading && user) {
            router.push('/'); // Automatically navigate if already logged in
        }
    }, [user, loading, router]);

    /**
     * Handles user login when the form is submitted.
     * Validates input and calls the `signInUser` function.
     * Redirects to the home page on success or shows an error message on failure.
     */
    const handleSignIn = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous error messages

        // Input validation
        if (!emailOrUsername || !password) {
            setError('Please enter both your username/email and password.');
            return;
        }

        try {
            await signInUser(emailOrUsername, password);
            router.push('/'); // Redirect to home page after successful login
        } catch (error) {
            console.error('Error signing in:', error.message);

            // Provide specific error messages based on Firebase error codes
            if (error.code === 'auth/user-not-found') {
                setError('No account found with the provided credentials.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address format. Please check and try again.');
            } else {
                setError('Failed to sign in. Please try again later.');
            }
        }
    };

    // Dynamically load Firebase UI and initialize it if not already initialized
    useEffect(() => {
        if (!firebaseUiInitialized.current && typeof window !== 'undefined') {
            firebaseUiInitialized.current = true;

            const loadFirebaseUI = async () => {
                const { startFirebaseUI } = await import('@/lib/firebase/firebaseui');
                if (!document.querySelector('#firebaseui-auth-container').hasChildNodes()) {
                    startFirebaseUI('#firebaseui-auth-container'); // Initialize Firebase UI
                }
            };

            loadFirebaseUI();
        }
    }, []);

    // Display a loading state while checking the authentication status
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // Prevent rendering of the page content if the user is already logged in
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Login to Ace-It</h1>

                {/* Login Form */}
                <form onSubmit={handleSignIn}>
                    <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => {
                            setEmailOrUsername(e.target.value);
                            setError(null); // Clear error when user starts typing
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
                            setError(null); // Clear error when user starts typing
                        }}
                        placeholder="Enter your password"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        autoComplete="current-password"
                    />

                    {/* Show/Hide Password Option */}
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

                    {/* Error Message */}
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full transition-all duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Sign In
                    </button>
                </form>

                {/* Forgot Password Link */}
                <p className="text-sm text-gray-600 mt-4 text-center">
                    <a href="/account/forgot-password" className="text-blue-500 hover:underline">
                        Forgot password?
                    </a>
                </p>

                {/* Firebase UI Authentication Container */}
                <div id="firebaseui-auth-container" className="mt-6"></div>

                {/* Register Link */}
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
