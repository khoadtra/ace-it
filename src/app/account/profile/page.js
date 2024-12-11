"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const { user, loading, updateUser } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [iconColor, setIconColor] = useState("#4a90e2"); // Default icon color
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Populate user data once loading is complete.
     * Redirects to the login page if no user is logged in.
     */
    useEffect(() => {
        if (!loading) {
            if (user) {
                setUsername(user.userName || "Guest"); // Load username or default to "Guest"
                setIconColor(user.iconColor || "#4a90e2"); // Load user's icon color or default
            } else {
                router.push("/account/login"); // Redirect to login page if not authenticated
            }
        }
    }, [user, loading, router]);

    /**
     * Validates the username format.
     * Ensures it is 3-20 characters long and contains only alphanumeric characters or underscores.
     */
    const isUsernameValid = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);

    /**
     * Handles saving profile changes, including username and icon color.
     * Validates the username before attempting to update user data.
     */
    const handleSaveChanges = async () => {
        setMessage(null);
        setError(null);

        // Validate username
        if (!isUsernameValid(username)) {
            setError(
                "Username must be 3-20 characters long and can only contain letters, numbers, and underscores."
            );
            return;
        }

        try {
            await updateUser({ userName: username, iconColor }); // Update user profile
            setMessage("Profile updated successfully."); // Show success message
        } catch (error) {
            console.error("Error updating profile:", error.message); // Log the error for debugging
            if (error.code === "firestore/permission-denied") {
                setError("You do not have permission to update this profile.");
            } else {
                setError("Failed to update profile. Please try again.");
            }
        }
    };

    // Show a loading indicator while authentication state is being determined
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-6">
                {/* Display profile icon and allow color selection */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
                        style={{ backgroundColor: iconColor }}
                    >
                        {user?.userName?.charAt(0)?.toUpperCase() || "U"} {/* Display first letter of username */}
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 font-semibold mb-1">
                            Profile Color:
                        </label>
                        <input
                            type="color"
                            value={iconColor}
                            onChange={(e) => setIconColor(e.target.value)}
                            className="w-full h-10 p-0 border rounded-md"
                        />
                    </div>
                </div>

                {/* Username input with validation */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-1">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setMessage(null); // Clear success message on change
                            setError(null); // Clear error message on change
                        }}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 mt-1">{error}</p>} {/* Error message */}
                </div>

                {/* Success message after saving changes */}
                {message && <p className="text-green-500">{message}</p>}

                {/* Save changes button */}
                <button
                    onClick={handleSaveChanges}
                    className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
