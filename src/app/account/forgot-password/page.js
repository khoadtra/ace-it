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

    const handlePasswordReset = async () => {
        setMessage(null);
        setError(null);

        if (!email) {
            setError('Please enter your email address.');
            return;
        }

        try {
            await resetPassword(email);
            setMessage('A password reset email has been sent.');
        } catch (error) {
            setError('Failed to send password reset email.');
        }
    };

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
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {message && <p className="text-green-500 mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <button
                    onClick={handlePasswordReset}
                    className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
                >
                    Reset Password
                </button>

                {/* Centered Remember Password Link */}
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
