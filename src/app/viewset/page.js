"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ViewAllSets = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);

  useEffect(() => {
    const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    setFlashcardSets(storedSets);
  }, []);

  if (flashcardSets.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        No flashcard sets available.
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-blue-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back to Home
          </button>
        </Link>
        <div className="text-lg font-bold ml-auto mr-auto">Flashcard Sets</div>
      </div>

      {/* Flashcard Sets with Stacked Effect */}
      <div className="flex flex-col items-center mt-8 space-y-8">
        {flashcardSets.map((set, index) => (
          <div
            key={index}
            className="relative bg-white rounded-lg p-6 w-3/4 shadow-lg transition-transform hover:scale-105"
          >
            {/* Simulated Layers */}
            <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg shadow-lg -z-10"></div>
            <div className="absolute top-4 left-4 w-full h-full bg-gray-300 rounded-lg shadow-md -z-20"></div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-black">{set.title}</h2>
            <p className="text-gray-600 mb-4">{set.description}</p>
            <Link href={`/viewset/${index}`}>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
                View Set
              </button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default ViewAllSets;
