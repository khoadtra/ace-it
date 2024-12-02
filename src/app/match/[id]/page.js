"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers"; // Import Firestore helper function

const MatchFlashcard = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [shuffledItems, setShuffledItems] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [incorrectBoxes, setIncorrectBoxes] = useState([]);  // Track incorrect selections
  const [matchedBoxes, setMatchedBoxes] = useState([]);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  // Load flashcard set and initialize state
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      try {
        const selectedSet = await getFlashcardSetById(id); // Fetch from global collection

        if (selectedSet && selectedSet.terms) {
          const newSet = selectedSet.terms.slice(0, 5);
          const items = newSet.flatMap((card) => [
            { text: card.term, type: "term", pairId: card.term },
            { text: card.definition, type: "definition", pairId: card.term },
          ]);
          setShuffledItems(items.sort(() => Math.random() - 0.5));
        } else {
          alert("Flashcard set not found!");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error.message);
        alert("Failed to load flashcard set.");
        router.push("/");
      }
    };

    fetchFlashcardSet();
  }, [id, router]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((prevTime) => prevTime + 10), 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  // Handle box click
  const handleBoxClick = (index) => {
    if (matchedBoxes.includes(index) || selectedBoxes.length === 2) return;

    const newSelection = selectedBoxes.includes(index)
      ? selectedBoxes.filter((i) => i !== index)
      : [...selectedBoxes, index];

    setSelectedBoxes(newSelection);

    if (newSelection.length === 2) {
      const [first, second] = newSelection;
      const isMatch =
        shuffledItems[first].pairId === shuffledItems[second].pairId &&
        shuffledItems[first].type !== shuffledItems[second].type;

      if (isMatch) {
        setMatchedBoxes((prev) => [...prev, first, second]);
        if (matchedBoxes.length + 2 === shuffledItems.length) {
          setRunning(false);
        }
      } else {
        setIncorrectBoxes([first, second]);
        setTimeout(() => setIncorrectBoxes([]), 500);
      }
      setTimeout(() => setSelectedBoxes([]), 500);
    }
  };

  // Timer display
  const formatTime = (ms) => {
    const minutes = Math.floor((ms / 60000) % 60).toString().padStart(2, "0");
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
    const milliseconds = Math.floor((ms / 10) % 100).toString().padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  if (!shuffledItems.length) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header id={id} time={time} formatTime={formatTime} />

      {/* Match game body */}
      <div className="flex-1 flex justify-center items-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-5 p-10">
          {shuffledItems.map((item, index) => (
            <FlashcardBox
              key={index}
              item={item}
              index={index}
              handleClick={handleBoxClick}
              isMatched={matchedBoxes.includes(index)}
              isSelected={selectedBoxes.includes(index)}
              isIncorrect={incorrectBoxes.includes(index)}
            />
          ))}
        </div>
      </div>

      {/* Game complete screen */}
      {!running && <CompletionScreen id={id} time={time} formatTime={formatTime} />}
    </div>
  );
};

// Header Component
const Header = ({ id, time, formatTime }) => (
  <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
    <Link href={`/viewset/${id}`}>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
        X
      </button>
    </Link>
    <div className="flex-1 text-center font-bold">{formatTime(time)}</div>
  </div>
);

// Flashcard Box Component
const FlashcardBox = ({ item, index, handleClick, isMatched, isSelected, isIncorrect }) => (
  <div
    onClick={() => handleClick(index)}
    className={`w-[250px] flex justify-center items-center bg-white p-6 rounded-lg shadow-lg transition cursor-pointer ${isMatched ? "opacity-0 pointer-events-none" : ""
      } ${isSelected ? "border-solid border-4 border-blue-200" : "hover:bg-gray-200"}
        ${isIncorrect? "animate-shake border-red-500 border-4" : ""}`}
  >
    <div className="text-center leading-tight">{item.text}</div>
  </div>
);

// Completion Screen Component
const CompletionScreen = ({ id, time, formatTime }) => (
  <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col">
    <Header id={id} time={time} formatTime={formatTime} />
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Nice work!</h1>
      <p className="text-xl">Your time: {(time / 1000).toFixed(2)} seconds</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 mt-4"
      >
        Play Again
      </button>
    </div>
  </div>
);

export default MatchFlashcard;
