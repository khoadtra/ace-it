'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const MatchFlashcard = () => {
  const params = useParams(); // Use Next.js hook to retrieve params
  const router = useRouter();
  const { id } = params; // Extract the `id` from params

  const [shuffledItems, setShuffledItems] = useState([]);
  const [selectedBoxes, setSelectedBoxes] = useState([]); // Tracks selected boxes
  const [matchedBoxes, setMatchedBoxes] = useState([]);   // Tracks matched boxes
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    const selectedSet = storedSets.find((set) => set.id === parseInt(id)); // Find set by `id`

    if (selectedSet && selectedSet.terms) {
      // Limit to only 5 term-definition pairs
      const newSet = selectedSet.terms.slice(0, 5);
      const items = newSet.flatMap(card => [
        { text: card.term, type: "term", pairId: card.term },
        { text: card.definition, type: "definition", pairId: card.term }
      ]);

      // Shuffle items
      const shuffled = items.sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
    } else {
      alert("Flashcard set not found!");
      router.push("/"); // Redirect to home if no set is found
    }

    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on unmount or when `running` changes
  }, [id, running, router]);

  const handleBoxClick = (index) => {
    if (matchedBoxes.includes(index)) {
      return;
    }

    // Only allow two boxes to be selected at once
    if (selectedBoxes.length === 2) return;

    const newSelection = [...selectedBoxes];

    if (selectedBoxes.includes(index)) {
      // Deselect if clicked twice
      newSelection.splice(newSelection.indexOf(index), 1);
      setSelectedBoxes(newSelection);
    } else {
      newSelection.push(index);
      setSelectedBoxes(newSelection);
    }

    if (newSelection.length === 2) {
      const [first, second] = newSelection;

      // Check for match
      if (
        shuffledItems[first].pairId === shuffledItems[second].pairId &&
        shuffledItems[first].type !== shuffledItems[second].type
      ) {
        setMatchedBoxes((prev) => [...prev, first, second]);

        // Check if all items are matched
        if (matchedBoxes.length + 2 === shuffledItems.length) {
          setRunning(false); // Stop the timer when all pairs are matched
        }
      }

      // Reset selections after a short delay
      setTimeout(() => setSelectedBoxes([]), 500);
    }
  };

  if (shuffledItems.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Loading flashcard set...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
        <Link href={`/viewset/${id}`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
            X
          </button>
        </Link>
        <div className="flex-1 text-center font-bold">
          {/* Minutes */}
          <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
          {/* Seconds */}
          <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
          {/* Milliseconds */}
          <span>{("0" + Math.floor((time / 10) % 100)).slice(-2)}</span>
        </div>
      </div>

      {/* Match game body */}
      <div className="flex-1 flex justify-center items-center">
        <div className="grid justify-center grid-cols-[repeat(auto-fit,minmax(200px,1fr))] auto-rows-fr gap-5 p-10">
          {shuffledItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleBoxClick(index)}
              className={`flex justify-center items-center bg-white p-6 rounded-lg shadow-lg transition cursor-pointer ${
                matchedBoxes.includes(index) ? "opacity-0 pointer-events-none" : ""
              } ${
                selectedBoxes.includes(index)
                  ? "border-solid border-4 border-blue-200"
                  : "hover:bg-gray-200"
              }`}
            >
              <div className="text-center leading-tight">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game complete screen */}
    {!running && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
            <Link href={`/viewset/${id}`}>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
                Back to Flashcard Set
                </button>
            </Link>
            <div className="flex-1 text-center font-bold">
                Ace-It
            </div>
            <Link href="/">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition">
                Home
                </button>
            </Link>
            </div>
            
            {/* Completion Content */}
            <div className="flex flex-1 flex-col items-center justify-center">
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
    )}
    </div>
  );
};

export default MatchFlashcard;