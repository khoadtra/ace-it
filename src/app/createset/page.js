"use client";
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CreateSet = () => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const termRefs = useRef([]);
  const definitionRefs = useRef([]);
  const searchParams = useSearchParams();

  const [flashcardSet, setFlashcardSet] = useState({
    title: "",
    description: "",
    terms: [{ term: "", definition: "" }],
  });

  useEffect(() => {
    const editIndex = searchParams.get("edit");
    if (editIndex !== null) {
      const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
      const setToEdit = storedSets[editIndex];
      if (setToEdit) {
        setFlashcardSet(setToEdit);
      }
    }
  }, [searchParams]);

  const saveFlashCardSet = () => {
    const updatedSet = {
      title: titleRef.current.value || "Untitled Set",
      description: descriptionRef.current.value || "No description provided.",
      terms: flashcardSet.terms.map((_, index) => ({
        term: termRefs.current[index]?.value || "",
        definition: definitionRefs.current[index]?.value || "",
      })),
    };

    const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    const editIndex = searchParams.get("edit");
    if (editIndex !== null) {
      // Update the existing set
      storedSets[editIndex] = updatedSet;
    } else {
      // Add a new set
      storedSets.push(updatedSet);
    }

    localStorage.setItem("flashcardSets", JSON.stringify(storedSets));
    alert("Flashcard set saved!");
  };

  const addNewCard = () => {
    setFlashcardSet({
      ...flashcardSet,
      terms: [...flashcardSet.terms, { term: "", definition: "" }],
    });
  };

  const deleteCard = (indexToDelete) => {
    setFlashcardSet({
      ...flashcardSet,
      terms: flashcardSet.terms.filter((_, index) => index !== indexToDelete),
    });
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-blue-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href="/">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            Back to Home
          </button>
        </Link>
        <div className="text-lg font-bold ml-auto mr-auto">
          Create or Edit Flashcard Set
        </div>
        <div className="ml-auto mr-20">
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-1"
            onClick={saveFlashCardSet}
          >
            Save Set
          </button>
        </div>
      </div>

      {/* Title, Description */}
      <div className="w-full px-10 py-8">
        <input
          type="text"
          ref={titleRef}
          defaultValue={flashcardSet.title}
          placeholder="Enter a title..."
          className="w-full text-4xl font-bold text-gray-400 placeholder:text-gray-300 bg-transparent outline-none mb-4"
          onChange={(e) => (e.target.style.color = e.target.value ? "black" : "gray")}
        />
        <textarea
          ref={descriptionRef}
          defaultValue={flashcardSet.description}
          placeholder="Add a description..."
          className="w-full text-xl font-semibold text-gray-400 placeholder:text-gray-300 bg-transparent outline-none resize-none"
          onChange={(e) => (e.target.style.color = e.target.value ? "black" : "gray")}
        />
      </div>

      {/* Flashcards */}
      <div className="flex flex-col items-center mt-8">
        {flashcardSet.terms.map((card, index) => (
          <div
            key={index}
            className="relative bg-white mb-6 rounded-lg shadow-lg p-6 w-3/4 hover:scale-105 transition-transform"
          >
            {/* Delete Button */}
            <div
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => deleteCard(index)}
            >
              X
            </div>
            <div className="flex gap-4 justify-between">
              {/* Term Input */}
              <textarea
                type="text"
                ref={(el) => (termRefs.current[index] = el)}
                defaultValue={card.term}
                placeholder="term"
                className="w-1/2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-green-500"
              ></textarea>

              {/* Definition Input */}
              <textarea
                type="text"
                ref={(el) => (definitionRefs.current[index] = el)}
                defaultValue={card.definition}
                placeholder="definition"
                className="w-1/2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-green-500"
              ></textarea>
            </div>
          </div>
        ))}
        <button
          onClick={addNewCard}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition mt-4"
        >
          Add New Card
        </button>
      </div>
    </>
  );
};

export default CreateSet;
