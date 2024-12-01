"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerUser, checkUsernameExists } from "@/lib/firebase/authHelpers";
import { useAuth } from "@/lib/firebase/authContext";
import debounce from "lodash.debounce";

const RegisterPage = () => {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [emailConfirmation, setEmailConfirmation] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        numeric: false,
    });
    const [usernameError, setUsernameError] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && user) {
            router.push("/"); // Redirect logged-in users
        }
    }, [user, loading, router]);

    const handlePasswordChange = (value) => {
        setPassword(value);
        setPasswordValidations({
            length: value.length >= 6,
            uppercase: /[A-Z]/.test(value),
            numeric: /[0-9]/.test(value),
        });
        setError(null); // Clear error message on password change
    };

    const isUsernameValid = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

    const checkUsernameAvailability = debounce(async (username) => {
        if (isUsernameValid(username)) {
            try {
                const usernameExists = await checkUsernameExists(username);
                setUsernameError(usernameExists ? "Username is already taken." : null);
            } catch {
                setUsernameError("Error checking username availability.");
            }
        } else {
            setUsernameError(
                "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
            );
        }
    }, 500);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username || !email || !emailConfirmation || !password || !passwordConfirmation || !termsAccepted || usernameError) {
            setError("Please fill out all fields correctly.");
            return;
        }

        if (email !== emailConfirmation) {
            setError("Emails do not match.");
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await registerUser(username, email, password);
            router.push("/"); // Redirect to the home page after successful registration
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setError("The email address is already in use by another account.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    if (user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
                <form onSubmit={handleRegister}>
                    {/* Username Input */}
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setUsernameError(null);
                            checkUsernameAvailability(e.target.value);
                        }}
                        placeholder="Username"
                        autoComplete="username"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {usernameError && <p className="text-red-500 mb-4">{usernameError}</p>}

                    {/* Email Inputs */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        autoComplete="email"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        value={emailConfirmation}
                        onChange={(e) => setEmailConfirmation(e.target.value)}
                        placeholder="Confirm Email"
                        autoComplete="email"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Password Inputs */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        placeholder="Password"
                        autoComplete="new-password"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-left mb-4">
                        <p className={`text-sm ${passwordValidations.length ? "text-green-500" : "text-red-500"}`}>
                            • Minimum password length of 6 characters
                        </p>
                        <p className={`text-sm ${passwordValidations.uppercase ? "text-green-500" : "text-red-500"}`}>
                            • At least one uppercase character
                        </p>
                        <p className={`text-sm ${passwordValidations.numeric ? "text-green-500" : "text-red-500"}`}>
                            • At least one numeric character
                        </p>
                    </div>
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        className="mb-4 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Terms and Conditions */}
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mr-2 mt-0 w-4 h-4"
                        />
                        <label>
                            I have read and consent to the{" "}
                            <a href="/terms-of-service" className="text-blue-500 hover:underline">
                                terms of service
                            </a>.
                        </label>
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </button>
                </form>

                {/* Centered Already Have an Account */}
                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <a href="/account/login" className="text-blue-500 hover:underline">
                        Login here.
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
