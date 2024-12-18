"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers"; // Import Firestore helper

const ViewSingleSet = () => {
  const { id } = useParams(); // Extract the flashcard set ID from the URL
  const [flashcardSet, setFlashcardSet] = useState(null); // Store the fetched flashcard set
  const [loading, setLoading] = useState(true); // Manage the loading state
  const [error, setError] = useState(null); // Manage error messages

  /**
   * Fetches the flashcard set by ID from Firestore.
   * Handles loading state and errors gracefully.
   */
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!id) {
        setError("Invalid ID provided for the flashcard set.");
        setLoading(false);
        return;
      }
      try {
        const selectedSet = await getFlashcardSetById(id); // Fetch the flashcard set by ID
        if (selectedSet) {
          setFlashcardSet(selectedSet); // Set the flashcard set in state
        } else {
          setError("Flashcard set not found for the provided ID.");
        }
      } catch (fetchError) {
        console.error("Error fetching flashcard set:", fetchError.message); // Log error details
        setError("Failed to fetch the flashcard set. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    fetchFlashcardSet();
  }, [id]);

  // Show a loading message while fetching the data
  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

  // Show an error message if an error occurred
  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        {error}
        <Link href="/viewset">
          <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600">
            Back to All Sets
          </button>
        </Link>
      </div>
    );
  }

  // Show a message if no flashcard set is found
  if (!flashcardSet) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Flashcard set not found.
        <Link href="/viewset">
          <button className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600">
            Back to All Sets
          </button>
        </Link>
      </div>
    );
  }

  // Reusable Button Component for navigation with icon and label
  const IconButton = ({ href, iconSrc, label }) => (
    <Link href={href}>
      <button className="flex flex-col items-center p-2 bg-white shadow-md hover:scale-105 transition-transform rounded-lg">
        <img
          src={iconSrc}
          alt={label}
          className="h-12"
          onError={(e) => (e.target.src = "/fallback-icon.png")} // Fallback for broken images
        />
        <span>{label}</span>
      </button>
    </Link>
  );

  return (
    <>
      {/* Header with navigation back to all sets */}
      <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href="/viewset">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back to Sets
          </button>
        </Link>
      </div>

      {/* Title and Description of the Flashcard Set */}
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-black">{flashcardSet.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{flashcardSet.description}</p>
      </div>

      {/* Navigation Buttons for Flashcard, Quiz, and Match modes */}
      <div className="flex w-3/4 ml-auto mr-auto mt-5 gap-5">
        <IconButton
          href={`/flashcard/${id}`}
          iconSrc="https://img.icons8.com/?size=100&id=21743&format=png&color=000000"
          label="Flashcard"
        />
        <IconButton
          href={`/quiz/${id}`}
          iconSrc="https://img.icons8.com/?size=100&id=13720&format=png&color=000000"
          label="Quiz"
        />
        <IconButton
          href={`/match/${id}`}
          iconSrc="https://img.icons8.com/?size=100&id=21743&format=png&color=000000"
          label="Match"
        />
      </div>

      {/* Flashcard Viewer */}
      <div className="flex flex-col items-center mt-10">
        {flashcardSet.terms.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 w-3/4 mb-4 hover:scale-105 transition-transform"
          >
            <p className="text-2xl font-bold">{card.term}</p>
            <p className="text-xl text-gray-600 mt-4">{card.definition}</p>
          </div>
        ))}
        {/* Edit Button for modifying the flashcard set */}
        <Link
          href={{
            pathname: "/createset",
            query: { edit: id }, // Pass the ID for editing the current set
          }}
        >
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition mt-6">
            Edit Set
          </button>
        </Link>
      </div>
    </>
  );
};

export default ViewSingleSet;
