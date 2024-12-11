'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/firebase/authHelpers';
import { useAuth } from '@/lib/firebase/authContext';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    // Redirect logged-in users to the homepage
    if (!loading && user) {
        router.push('/');
        return null;
    }

    /**
     * Handles the password reset process.
     * Validates input and calls the `resetPassword` helper function.
     * Provides feedback on success or error.
     */
    const handlePasswordReset = async () => {
        setMessage(null); // Clear previous success message
        setError(null); // Clear previous error message

        // Input validation
        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await resetPassword(email);
            setMessage('A password reset email has been sent. Please check your inbox.');
        } catch (error) {
            // Handle Firebase-specific errors with detailed messages
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email address. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                setError('The email address is not valid. Please try again.');
            } else {
                setError('Failed to send password reset email. Please try again later.');
            }
        }
    };

    // Show a loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
                {/* Input field for email address */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null); // Clear error when input changes
                    }}
                    placeholder="Enter your email"
                    className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Display success or error messages */}
                {message && <p className="text-green-500 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    onClick={handlePasswordReset}
                    className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
                >
                    Reset Password
                </button>

                {/* Link to the login page */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <a href="/account/login" className="text-blue-500 hover:underline">
                            Login here
                        </a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
