'use client';

import React, {useEffect, useState } from "react";
import Link from "next/link";

const MatchFlashcard = ({ params }) => {
    const { id } = React.use(params);
    const [shuffledItems, setShuffledItems] = useState([]);
    const [selectedBoxes, setSelectedBoxes] = useState([]); // Tracks selected boxes
    const [matchedBoxes, setMatchedBoxes] = useState([]);   // Tracks matched boxes
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(true);


    useEffect(() => {
        const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
        const set = storedSets[id];
        let interval;
        
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
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10)
        } else if (!running) {
            clearInterval(interval)
        }

        return () => clearInterval(interval); // Cleanup on unmount or when running changes
    }, [id, running]);

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
                console.log(matchedBoxes.length);
                 // Check if all items are matched
                 if (matchedBoxes.length + 2 === shuffledItems.length) {
                    setRunning(false); // Stop the timer when all pairs are matched
                }
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
        <div className="flex flex-col h-screen">
            {/*Header */}
            <div className="sticky top-0 bg-green-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
                <Link href={`/viewset/${id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
                        X
                    </button>
                </Link>
                <div className="flex-1 text-center font-bold">
                     {/* Minutes */}
                    <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                    {/* Second */}
                    <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                    <span>{("0" + Math.floor((time / 10) % 60)).slice(-2)}</span>
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
                        <div className="text-center leading-tight">
                        {item.text}
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {!running && (
                <>
                    <div className="flex flex-col relative left-[40%] bottom-1/2 w-1/4 gap-10 z-50">
                        <div className="flex items-center justify-between">
                            <p className="text-4xl tex-wrap font-bold">Nice work! Can you match even faster?</p>
                            <img
                                src="https://img.icons8.com/?size=100&id=LGgNkNSbLSQq&format=png&color=000000"
                                alt="Congratulation"
                                className=""/>
                        </div>
                        <p className="text-xl text-gray-500 font-light">Try and beat your best time of <strong>{(time / 1000).toFixed(1)} seconds</strong></p>
                        <button onClick={() => window.location.reload()} className="text-xl text-white w-1/2 bg-blue-600 rounded-lg p-5 hover:bg-blue-800 transition">
                            Play Again
                        </button>
                    </div>
                    
                </>
            )}
        </div>
    )
};

export default MatchFlashcard;