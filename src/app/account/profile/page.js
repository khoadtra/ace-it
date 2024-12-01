"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/firebase/authContext";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
    const { user, loading, updateUser } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [iconColor, setIconColor] = useState("#4a90e2"); // Default color
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading) {
            if (user) {
                setUsername(user.userName || "Guest");
                setIconColor(user.iconColor || "#4a90e2"); // Load user's icon color or default
            } else {
                router.push("/account/login"); // Redirect to login if not logged in
            }
        }
    }, [user, loading, router]);

    const isUsernameValid = (username) =>
        /^[a-zA-Z0-9_]{3,20}$/.test(username);

    const handleSaveChanges = async () => {
        setMessage(null);
        setError(null);

        if (!isUsernameValid(username)) {
            setError(
                "Username must be 3-20 characters and can only contain letters, numbers, and underscores."
            );
            return;
        }

        try {
            await updateUser({ userName: username, iconColor }); // Update username and icon color
            setMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error.message);
            setError("Failed to update profile. Please try again.");
        }
    };

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
                {/* Profile Icon */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white"
                        style={{ backgroundColor: iconColor }}
                    >
                        {user?.userName?.charAt(0)?.toUpperCase() || "U"}
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

                {/* Username Section */}
                <div>
                    <label className="block text-gray-600 font-semibold mb-1">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setMessage(null);
                            setError(null);
                        }}
                        className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 mt-1">{error}</p>}
                </div>

                {/* Success Message */}
                {message && <p className="text-green-500">{message}</p>}

                {/* Save Changes Button */}
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
