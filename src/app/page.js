"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function Home() {
  const { user, loading } = useAuth(); // Access user and loading state from authentication context
  const router = useRouter();

  /**
   * Redirects unauthenticated users to the login page.
   * Executes when the component loads or when `user` or `loading` changes.
   */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login"); // Redirect to login if not logged in
    }
  }, [user, loading, router]);

  /**
   * Handles user logout.
   * Signs the user out and redirects them to the login page.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out using Firebase authentication
      router.push("/account/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error signing out:", error.message); // Log error for debugging
      alert("Failed to log out. Please try again."); // Show user-friendly error message
    }
  };

  /**
   * Handles search functionality.
   * Redirects to the search results page with the given query.
   */
  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`); // Navigate to the search page with the query parameter
    } else {
      alert("Please enter a valid search query."); // Inform user if the query is empty
    }
  };

  // Show a loading screen while the authentication state is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Prevent rendering if the user is not authenticated (redirect will occur)
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        {/* Main Title */}
        <div className="text-green-500 ml-3 text-3xl font-bold mb-4">Ace-It</div>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Your go-to tool for creating, studying, and mastering flashcards.
        </p>

        {/* Navigation Buttons */}
        <div className="space-x-4">
          {/* Button to Create Flashcards */}
          <Link href="/createset">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
              Create Flashcards
            </button>
          </Link>
          {/* Button to View Flashcards */}
          <Link href="/viewset">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
              View Flashcards
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
