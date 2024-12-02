"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFlashcardSets, deleteFlashcardSet } from "@/lib/firebase/firestoreHelpers"; // Import the correct helper functions
import { useAuth } from "@/lib/firebase/authContext";

// Reusable Card Component
const FlashcardSetCard = ({ set, onDelete }) => (
  <div className="relative bg-white rounded-lg p-6 w-3/4 shadow-lg transition-transform hover:scale-105">
    {/* Simulated Layers */}
    <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg shadow-lg -z-10"></div>
    <div className="absolute top-4 left-4 w-full h-full bg-gray-300 rounded-lg shadow-md -z-20"></div>

    {/* Content */}
    <h2 className="text-2xl font-bold text-black">{set.title}</h2>
    <p className="text-gray-600 mb-4">{set.description}</p>
    <div className="flex justify-between items-center">
      <Link href={`/viewset/${set.id}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
          View Set
        </button>
      </Link>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={() => onDelete(set.id)}
      >
        Delete
      </button>
    </div>
  </div>
);

const ViewAllSets = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (!user) {
        alert("You must be logged in to view your flashcard set.");
        return;
      }

      try {
        const sets = await getFlashcardSets(user.uid); // Fetch all sets by userId
        setFlashcardSets(sets);
      } catch (error) {
        console.error("Error fetching flashcard sets:", error.message);
      }
    };

    fetchFlashcardSets();
  }, [user]);

  const handleDelete = async (setId) => {
    if (confirm("Are you sure you want to delete this flashcard set?")) {
      try {
        await deleteFlashcardSet(setId); // Call Firestore helper to delete the set
        setFlashcardSets((prevSets) => prevSets.filter((set) => set.id !== setId)); // Update state
      } catch (error) {
        console.error("Error deleting flashcard set:", error.message);
      }
    }
  };

  return (
    <>
      {/* Navbar Header */}
      <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back to Home
          </button>
        </Link>
        <div className="text-lg font-bold ml-auto mr-auto">Flashcard Sets</div>
      </div>

      {/* Main Content */}
      <div className="text-center mt-20">
        {flashcardSets.length === 0 ? (
          <>
            <p className="text-gray-500 mb-4">No flashcard sets available.</p>
            <Link href="/createset">
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
                Create a Flashcard Set
              </button>
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center mt-8 space-y-8">
            {flashcardSets.map((set) => (
              <FlashcardSetCard key={set.id} set={set} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewAllSets;
