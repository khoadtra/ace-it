"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getFlashcardSets, deleteFlashcardSet } from "@/lib/firebase/firestoreHelpers";
import { useAuth } from "@/lib/firebase/authContext";

// Reusable Card Component for displaying each flashcard set
const FlashcardSetCard = ({ set, onDelete }) => (
  <div className="relative bg-white rounded-lg p-6 w-3/4 shadow-lg transition-transform hover:scale-105">
    {/* Simulated Layers for 3D Effect */}
    <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg shadow-lg -z-10"></div>
    <div className="absolute top-4 left-4 w-full h-full bg-gray-300 rounded-lg shadow-md -z-20"></div>

    {/* Flashcard Set Content */}
    <h2 className="text-2xl font-bold text-black">{set.title}</h2>
    <p className="text-gray-600 mb-4">{set.description}</p>
    <div className="flex justify-between items-center">
      {/* View Set Button */}
      <Link href={`/viewset/${set.id}`}>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
          View Set
        </button>
      </Link>
      {/* Delete Set Button */}
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        onClick={() => onDelete(set.id)} // Trigger delete action
      >
        Delete
      </button>
    </div>
  </div>
);

const ViewAllSets = () => {
  const [flashcardSets, setFlashcardSets] = useState([]); // State to store all flashcard sets
  const [error, setError] = useState(null); // State to manage error messages
  const [loading, setLoading] = useState(true); // State to manage loading state
  const { user } = useAuth();
  /**
   * Fetches all flashcard sets when the component loads.
   * Handles loading and error states gracefully.
   */
  useEffect(() => {
    const fetchFlashcardSets = async () => {
      setLoading(true);
      try {
        const sets = await getFlashcardSets(user.uid); // Fetch all sets by userId
        setFlashcardSets(sets); // Store the fetched sets in state
      } catch (fetchError) {
        console.error("Error fetching flashcard sets:", fetchError.message); // Log error details
        setError("Failed to fetch flashcard sets. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchFlashcardSets();
  }, [user]);

  /**
   * Handles the deletion of a flashcard set.
   * Updates the state to remove the deleted set.
   */
  const handleDelete = async (setId) => {
    if (confirm("Are you sure you want to delete this flashcard set?")) {
      try {
        await deleteFlashcardSet(setId); // Call Firestore helper to delete the set
        setFlashcardSets((prevSets) => prevSets.filter((set) => set.id !== setId)); // Remove the deleted set from state
      } catch (deleteError) {
        console.error("Error deleting flashcard set:", deleteError.message); // Log error details
        alert("Failed to delete the flashcard set. Please try again later."); // Inform user
      }
    }
  };

  // Show a loading message while fetching data
  if (loading) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Loading flashcard sets...</p>
      </div>
    );
  }

  // Show an error message if an error occurred
  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p>{error}</p>
        <Link href="/createset">
          <button className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
            Create a Flashcard Set
          </button>
        </Link>
      </div>
    );
  }

  // Render a message if no flashcard sets are available
  if (flashcardSets.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500 mb-4">No flashcard sets available.</p>
        <Link href="/createset">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
            Create a Flashcard Set
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header with Navigation */}
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
