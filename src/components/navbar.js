"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useEffect } from "react";

export default function Navbar() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // Get the current path

    // Define paths where Navbar should be hidden
    const hideNavbarPaths = [
        "/account/login",
        "/account/register",
        "/account/forgot-password",
        "/createset", // Exclude Navbar on the createset page
        "/viewset", // Exclude Navbar on the viewset page
    ];

    // Paths with dynamic segments (e.g., /match/[id], /quiz/[id])
    const hideNavbarDynamicPaths = [
        "/match/",
        "/quiz/",
    ];

    // Check if the current path matches any hide conditions
    const shouldHideNavbar = () => {
        if (hideNavbarPaths.some((path) => pathname.startsWith(path))) {
            return true;
        }

        // Check if the current path starts with any dynamic segment paths
        if (hideNavbarDynamicPaths.some((dynamicPath) => pathname.startsWith(dynamicPath))) {
            return true;
        }

        return false;
    };

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!loading && !user && !shouldHideNavbar()) {
            router.push("/account/login");
        }
    }, [loading, user, pathname, router]);

    // Handle Logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/account/login");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    // Handle Search
    const handleSearch = (e) => {
        const query = e.target.value.trim();
        if (!query) {
            router.push("/"); // Redirect to home page if search bar is cleared
        } else {
            router.push(`/search?query=${encodeURIComponent(query)}`); // Update query in URL dynamically
        }
    };

    // Hide Navbar if the current path matches a path in `hideNavbarPaths` or `hideNavbarDynamicPaths`
    if (shouldHideNavbar()) {
        return null;
    }

    return (
        <nav className="bg-green-100 flex justify-between items-center h-14 px-6">
            {/* Logo and Title */}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => router.push("/")} // Navigate to home when clicked
            >
                <div className="h-10 w-10 bg-green-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                    A
                </div>
                <div className="text-green-900 ml-3 text-xl font-bold">Ace-It</div>
            </div>
            {/* Search Bar */}
            <div className="flex w-full max-w-lg">
                <input
                    className="bg-gray-50 text-gray-700 flex-grow rounded p-2 pl-10 outline-gray-300 bg-no-repeat bg-[length:1rem] bg-[position:5px_50%] bg-[url('https://img.icons8.com/?size=100&id=59878&format=png&color=000000')]"
                    placeholder="Search keywords"
                    onChange={handleSearch} // Update results dynamically
                />
            </div>
            {/* Profile Section */}
            <div className="flex items-center space-x-4">
                {/* Profile Icon and Username */}
                <div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => router.push("/account/profile")} // Navigate to profile page when clicked
                >
                    <div
                        className="h-8 w-8 text-white flex items-center justify-center rounded-full text-sm font-bold"
                        style={{ backgroundColor: user?.iconColor || "#4a90e2" }} // Use user's selected icon color
                    >
                        {user?.icon || "U"}
                    </div>
                    <span className="text-gray-800 font-medium text-sm">{user?.userName || "Guest"}</span>
                </div>
                {/* Logout Button */}
                {user && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
