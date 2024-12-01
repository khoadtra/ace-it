"use client";
import React, { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { saveFlashcardSet, getFlashcardSetById } from "@/lib/firebase/firestoreHelpers";
import { useAuth } from "@/lib/firebase/authContext";

const CreateSet = () => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const termRefs = useRef([]);
  const definitionRefs = useRef([]);
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [flashcardSet, setFlashcardSet] = useState({
    id: null,
    title: "",
    description: "",
    terms: [{ term: "", definition: "" }],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && user) {
      const fetchFlashcardSet = async () => {
        setLoading(true);
        try {
          const setToEdit = await getFlashcardSetById(editId);
          if (setToEdit) {
            setFlashcardSet(setToEdit);
          } else {
            alert("Flashcard set not found. Redirecting to create a new set.");
          }
        } catch (error) {
          console.error("Error fetching flashcard set:", error.message);
          alert("Failed to fetch flashcard set.");
        } finally {
          setLoading(false);
        }
      };
      fetchFlashcardSet();
    }
  }, [searchParams, user]);

  const saveFlashCardSet = async () => {
    if (!user) {
      alert("You must be logged in to save a flashcard set.");
      return;
    }

    const updatedSet = {
      id: flashcardSet.id || Date.now().toString(),
      title: titleRef.current.value.trim() || "Untitled Set",
      description: descriptionRef.current.value.trim() || "No description provided.",
      terms: flashcardSet.terms.map((_, index) => ({
        term: termRefs.current[index]?.value.trim() || "",
        definition: definitionRefs.current[index]?.value.trim() || "",
      })),
      ownerName: user.userName,
      iconColor: user.iconColor || "#cccccc",
    };

    // Validate terms
    const invalidTerms = updatedSet.terms.some(
      (card) => !card.term || !card.definition
    );
    if (invalidTerms) {
      alert("All terms and definitions must be filled out before saving.");
      return;
    }

    try {
      await saveFlashcardSet(user.uid, updatedSet);
      alert("Flashcard set saved successfully!");
    } catch (error) {
      console.error("Error saving flashcard set:", error.message);
      alert("Failed to save flashcard set. Please try again.");
    }
  };

  const addNewCard = () => {
    setFlashcardSet((prevSet) => ({
      ...prevSet,
      terms: [...prevSet.terms, { term: "", definition: "" }],
    }));
  };

  const deleteCard = (indexToDelete) => {
    setFlashcardSet((prevSet) => ({
      ...prevSet,
      terms: prevSet.terms.filter((_, index) => index !== indexToDelete),
    }));
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <>
      {/* Header */}
      <header className="top-0 bg-blue-100 h-14 flex items-center justify-between px-4 border-b-2 border-solid border-black z-10">
        <div>
          <Link href="/">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
              Back to Home
            </button>
          </Link>
        </div>
        <h1 className="text-lg font-bold mx-auto text-center">
          {flashcardSet.id ? "Edit Flashcard Set" : "Create Flashcard Set"}
        </h1>
        <div>
          <button
            className="bg-blue-500 text-white rounded-lg px-4 py-1"
            onClick={saveFlashCardSet}
          >
            Save Set
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-14 px-10 py-8">
        {/* Title and Description */}
        <section className="mb-8">
          <input
            type="text"
            ref={titleRef}
            defaultValue={flashcardSet.title}
            placeholder="Enter a title..."
            className="w-full text-4xl font-bold text-gray-400 placeholder:text-gray-300 bg-transparent outline-none mb-4"
            onChange={(e) =>
              (e.target.style.color = e.target.value ? "black" : "gray")
            }
          />
          <textarea
            ref={descriptionRef}
            defaultValue={flashcardSet.description}
            placeholder="Add a description..."
            className="w-full text-xl font-semibold text-gray-400 placeholder:text-gray-300 bg-transparent outline-none resize-none"
            onChange={(e) =>
              (e.target.style.color = e.target.value ? "black" : "gray")
            }
          />
        </section>

        {/* Flashcards */}
        <section className="flex flex-col items-center">
          {flashcardSet.terms.map((card, index) => (
            <div
              key={index}
              className="relative bg-white mb-6 rounded-lg shadow-lg p-6 w-3/4 hover:scale-105 transition-transform"
            >
              <button
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-full cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => deleteCard(index)}
              >
                X
              </button>
              <div className="flex gap-4 justify-between">
                <textarea
                  ref={(el) => (termRefs.current[index] = el)}
                  defaultValue={card.term}
                  placeholder="Term"
                  className="w-1/2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-green-500"
                />
                <textarea
                  ref={(el) => (definitionRefs.current[index] = el)}
                  defaultValue={card.definition}
                  placeholder="Definition"
                  className="w-1/2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-green-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addNewCard}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition mt-4"
          >
            Add New Card
          </button>
        </section>
      </main>
    </>
  );
};

export default function CreateSetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateSet />
    </Suspense>
  );
}
