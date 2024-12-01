"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/authContext";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [user, loading, router]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/account/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  // Handle Search
  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Prevent rendering until redirect completes
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Main Title */}
        <div className="text-green-500 ml-3 text-xl font-bold">Ace-It</div>
        <p className="text-lg text-gray-600 mb-8">
          Your go-to tool for creating, studying, and mastering flashcards.
        </p>
        {/* Buttons */}
        <div className="space-x-4">
          <Link href="/createset">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition">
              Create Flashcards
            </button>
          </Link>
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
