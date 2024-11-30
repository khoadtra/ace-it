'use client'

import Link from "next/link";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../lib/firebase/config";
import { useState } from "react";


export default function Home() {

  const [userId, setUserId] = useState(null);

  const handleGoogle = async (e) => {
    const provider = await new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Firebase user object
      setUserId(user.uid); // Set the user id in state
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }
  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-green-100 flex justify-between items-center h-14 px-6">
        {/* Logo and Title */}
        <div className="flex items-center">
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
          />
        </div>
      </nav>
      <button
        onClick={handleGoogle}
        className="bg-green-600">
        Sign in with Google
      </button>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-screen gap-5">
        {/* Main Title */}
        <div className="text-green-500 ml-3 text-xl font-bold">Ace-It</div>
        <p className="text-lg text-gray-600">
          Your go-to tool for creating, studying, and mastering flashcards.
        </p>
        {/* Buttons */}
        <div className="flex gap-5">
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
        <div className="flex gap-5">
          <Link href={`/viewteam?uid=${userId}`}>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
              View My Team
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
