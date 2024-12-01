"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

const ViewSingleSet = ({ params }) => {
  const { id } = params; // Get the set id from the route parameters
  const [flashcardSet, setFlashcardSet] = useState(null);

  useEffect(() => {
    const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    const selectedSet = storedSets.find((set) => set.id === parseInt(id));
    if (selectedSet) {
      setFlashcardSet(selectedSet);
    } else {
      alert("Flashcard set not found!");
    }
  }, [id]);



  if (!flashcardSet) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

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

      {/* Buttons */}
      <div className="flex w-3/4 ml-auto mr-auto mt-5 gap-5">
        <button className="flex flex-col items-center p-2 bg-white">
          <img
            src="https://img.icons8.com/?size=100&id=21743&format=png&color=000000"
            className="h-12" />
          <span>Flashcard</span>
        </button>
        <Link href={`/quiz/${id}`}>
          <button className="flex flex-col items-center p-2 bg-white">
            <img
              src="https://img.icons8.com/?size=100&id=13720&format=png&color=000000"
              className="h-12"
            />
            <span>Quiz</span>
          </button>
        </Link>
        <Link href={`/match/${id}`}>
          <button className="flex flex-col items-center p-2 bg-white">
            <img
              src="https://img.icons8.com/?size=100&id=21743&format=png&color=000000"
              className="h-12" />
            <span>Match</span>
          </button>
        </Link>
      
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