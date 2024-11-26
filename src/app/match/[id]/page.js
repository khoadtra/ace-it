'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

const MatchFlashcard = ({ params }) => {
    const { id } = React.use(params);
    const [shuffledItems, setShuffledItems] = useState([]);
    const [selectedBoxes, setSelectedBoxes] = useState([]); // Tracks selected boxes
    const [matchedBoxes, setMatchedBoxes] = useState([]);   // Tracks matched boxes


    useEffect(() => {
        const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
        const set = storedSets[id];
        
        if (set && set.terms) {
            // Limit to only 5 term-definition pair
            const newSet = set.terms.splice(0, 5);
            const items = newSet.flatMap(card => [
                { text: card.term, type: "term", pairId: card.term },
                { text: card.definition, type: "definition", pairId: card.term }
            ]);
            // Shuffule
            const shuffled = items.sort(() => Math.random() - 0.5)
            setShuffledItems(shuffled);
        }
    }, [id]);

    const handleBoxClick = (index) => {
        if (matchedBoxes.includes(index)) {
            return;
        }   

        // Only allow to choose 2 boxes at once
        if (selectedBoxes.length === 2)
            return;

        // Add selection
        const newSelection = [...selectedBoxes];
        
        if (selectedBoxes.includes(index)) {
            // Deselect if click twice
            newSelection.splice(newSelection.indexOf(index), 1)
            setSelectedBoxes(newSelection);
        } else {
            newSelection.push(index);
            setSelectedBoxes(newSelection);
        }

        if (newSelection.length === 2) {
            const [first, second] = newSelection;
            console.log("1 pairID " + shuffledItems[first].pairId);
            console.log("2 pairID " + shuffledItems[second].pairId);
            console.log("1 type " + shuffledItems[first].type);
            console.log("2 type " + shuffledItems[second].type);

            // Check for match
            // Same pairId and diffrent type consided a match
            if (shuffledItems[first].pairId === shuffledItems[second].pairId
                && shuffledItems[first].type !== shuffledItems[second].type
            ) {
                setMatchedBoxes((prev) => [...prev, first, second]);
            }
            setSelectedBoxes([]);

        }
    }


    if (shuffledItems.length === 0) {
        return (
          <div className="text-center text-gray-500 mt-20">
            Loading flashcard set...
          </div>
        );
    }

    return (
        <>
            <div className="sticky top-0 bg-blue-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
                <Link href={`/viewset/${id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
                        X
                    </button>
                </Link>
            </div>

            {/* Match game body */}

            <div className="grid gap-5 grid-cols-3 ml-auto mr-auto mt-10 w-4/5 sm:grid-cols-3 lg:grid-cols-4">
                {shuffledItems.slice(0, 10).map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleBoxClick(index)}
                        className={`flex items-center justify-center bg-white p-6 rounded-lg shadow-lg aspect-square min-h[50px] max-w-full transition cursor-pointer ${
                            matchedBoxes.includes(index) ? "opacity-0 pointer-events-none" : ""
                        } ${
                            selectedBoxes.includes(index) ? "border-solid border-4 border-blue-200 " : "hover:bg-gray-200"
                        }`}>
                        <span
                            className="text-center break-words text-ellipsis overflow-hidden text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-tight">
                            {item.text}
                        </span>
                    </div>
                ))}
            </div>
        </>
    )
};

export default MatchFlashcard;