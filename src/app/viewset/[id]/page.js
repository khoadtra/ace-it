"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers"; // Import Firestore helper

const ViewSingleSet = () => {
  const { id } = useParams(); // Destructure id directly from params
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!id) {
        console.warn("Invalid ID for fetching flashcard set");
        setLoading(false);
        return;
      }
      try {
        const selectedSet = await getFlashcardSetById(id); // Fetch set by ID
        if (selectedSet) {
          setFlashcardSet(selectedSet);
        } else {
          console.warn("Flashcard set not found for the provided ID");
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

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

  // Reusable Button Component
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
      {/* Header */}
      <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href="/viewset">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back to Sets
          </button>
        </Link>
      </div>

      {/* Title and Description */}
      <div className="mt-8 text-center">
        <h1 className="text-4xl font-bold text-black">{flashcardSet.title}</h1>
        <p className="text-lg text-gray-600 mt-2">{flashcardSet.description}</p>
      </div>

      {/* Navigation Buttons */}
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
        {/* Edit Button */}
        <Link
          href={{
            pathname: "/createset",
            query: { edit: id }, // Pass the id of the current set as a query parameter
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
