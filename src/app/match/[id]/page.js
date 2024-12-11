"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers"; // Import Firestore helper function

const MatchFlashcard = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params; // Extract flashcard set ID from URL parameters

  // State variables
  const [shuffledItems, setShuffledItems] = useState([]); // Store shuffled flashcard terms and definitions
  const [selectedBoxes, setSelectedBoxes] = useState([]); // Track currently selected boxes
  const [incorrectBoxes, setIncorrectBoxes] = useState([]); // Track boxes with incorrect matches
  const [matchedBoxes, setMatchedBoxes] = useState([]); // Track matched boxes
  const [time, setTime] = useState(0); // Track elapsed time
  const [running, setRunning] = useState(true); // Manage timer state

  /**
   * Fetch flashcard set and initialize game state
   */
  useEffect(() => {
    if (!id) {
      alert("Invalid flashcard set ID."); // Handle invalid or missing ID
      router.push("/"); // Redirect to home page
      return;
    }

    const fetchFlashcardSet = async () => {
      try {
        const selectedSet = await getFlashcardSetById(id); // Fetch the flashcard set by ID

        if (selectedSet?.terms?.length > 0) {
          // Take the first 5 terms and shuffle them for the game
          const newSet = selectedSet.terms.slice(0, 5);
          const items = newSet.flatMap((card) => [
            { text: card.term, type: "term", pairId: card.term },
            { text: card.definition, type: "definition", pairId: card.term },
          ]);
          setShuffledItems(items.sort(() => Math.random() - 0.5)); // Randomize order of items
        } else {
          alert("No terms available in this flashcard set."); // Handle empty flashcard set
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error.message); // Log error
        alert("Failed to load the flashcard set. Please try again."); // Inform the user
        router.push("/"); // Redirect to home page
      }
    };

    fetchFlashcardSet();
  }, [id, router]);

  /**
   * Timer logic to track elapsed time
   */
  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((prevTime) => prevTime + 10), 10); // Increment time every 10ms
    }
    return () => clearInterval(interval); // Cleanup interval when component unmounts or timer stops
  }, [running]);

  /**
   * Handles user interaction with a box
   */
  const handleBoxClick = (index) => {
    // Ignore clicks on already matched boxes or if two boxes are selected
    if (matchedBoxes.includes(index) || selectedBoxes.length === 2) return;

    // Add or remove the clicked box from the selection
    const newSelection = selectedBoxes.includes(index)
      ? selectedBoxes.filter((i) => i !== index)
      : [...selectedBoxes, index];

    setSelectedBoxes(newSelection);

    if (newSelection.length === 2) {
      // Check if the two selected boxes form a match
      const [first, second] = newSelection;
      const isMatch =
        shuffledItems[first].pairId === shuffledItems[second].pairId &&
        shuffledItems[first].type !== shuffledItems[second].type;

      if (isMatch) {
        setMatchedBoxes((prev) => [...prev, first, second]); // Add matched boxes to the matched list
        if (matchedBoxes.length + 2 === shuffledItems.length) {
          setRunning(false); // Stop timer if all boxes are matched
        }
      } else {
        setIncorrectBoxes([first, second]); // Highlight incorrect boxes
        setTimeout(() => setIncorrectBoxes([]), 500); // Clear incorrect boxes after a delay
      }
      setTimeout(() => setSelectedBoxes([]), 500); // Reset selection after a delay
    }
  };

  /**
   * Formats time in mm:ss:ms format for display
   */
  const formatTime = (ms) => {
    const minutes = Math.floor((ms / 60000) % 60).toString().padStart(2, "0");
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
    const milliseconds = Math.floor((ms / 10) % 100).toString().padStart(2, "0");
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  if (!shuffledItems.length) {
    // Show loading state while fetching flashcard set
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with timer */}
      <Header id={id} time={time} formatTime={formatTime} />

      {/* Game board with flashcards */}
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

      {/* Show completion screen when the game ends */}
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
    className={`w-[250px] flex justify-center items-center bg-white p-6 rounded-lg shadow-lg transition cursor-pointer ${
      isMatched ? "opacity-0 pointer-events-none" : ""
    } ${isSelected ? "border-solid border-4 border-blue-200" : "hover:bg-gray-200"} ${
      isIncorrect ? "animate-shake border-red-500 border-4" : ""
    }`}
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
