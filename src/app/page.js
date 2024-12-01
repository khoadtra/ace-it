"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const query = e.target.value.trim();

      if (query) {
        router.push(`/search?query=${encodeURIComponent(query)}`);
      }
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
            onKeyDown={handleKeyDown}
          />
        </div>
      </nav>

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
