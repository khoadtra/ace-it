"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getDocs, collection } from "firebase/firestore";
import { fbdb } from "@/lib/firebase/config";

// PreviewModal component for showing the flashcards
const PreviewModal = ({ flashcards, onClose }) => (
    <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

        {/* Modal */}
        <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
            <div className="flex flex-col gap-4 p-10">
                {/* Close button */}
                <button
                    className="text-xl text-gray-400 w-full text-right -mb-5"
                    onClick={onClose}
                >
                    X
                </button>
                <h1 className="text-2xl font-bold">Preview</h1>
                {/* Flashcard terms and definitions */}
                {flashcards.map((card, index) => (
                    <div key={index}>
                        <p className="text-lg font-semibold">{card.term}</p>
                        <p>{card.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    </>
);

// Main Search component
const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query"); // Get the search query from the URL

    const [flashcardSets, setFlashcardSets] = useState([]); // Stores flashcard sets
    const [selectedSet, setSelectedSet] = useState(null); // Selected set for preview
    const [error, setError] = useState(null); // Error state

    /**
     * Fetches flashcard sets from Firestore and applies filtering based on the search query.
     */
    useEffect(() => {
        const fetchFlashcardSets = async () => {
            setError(null); // Reset error state
            try {
                const snapshot = await getDocs(collection(fbdb, "flashcardSets")); // Fetch all sets
                const allSets = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (query) {
                    // Filter sets based on the search query
                    const filteredSets = allSets.filter((set) =>
                        set.title.toLowerCase().includes(query.toLowerCase())
                    );
                    setFlashcardSets(filteredSets);

                    if (filteredSets.length === 0) {
                        setError("No flashcard sets found matching your search.");
                    }
                } else {
                    setFlashcardSets(allSets); // Show all sets if no query
                }
            } catch (err) {
                console.error("Error fetching flashcard sets:", err.message);
                setError("Failed to load flashcard sets. Please try again later.");
            }
        };

        fetchFlashcardSets();
    }, [query]);

    return (
        <>
            {/* Main Content */}
            <h1 className="text-2xl my-5 font-medium w-[80%] mx-auto">
                Results for &quot;{query || "All Sets"}&quot;
            </h1>

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-500 mb-4">{error}</div>
            )}

            {/* Flashcard Sets List */}
            <div className="flex flex-col gap-5 w-[80%] mx-auto">
                <p className="text-md font-medium">Flashcard sets</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {flashcardSets.map((set) => (
                        <div
                            key={set.id}
                            className="bg-white border border-solid border-gray-300 rounded-lg p-3"
                        >
                            {/* Set Title */}
                            <h1 className="text-md font-bold py-2">{set.title}</h1>
                            {/* Number of Terms */}
                            <p className="text-sm font-medium bg-blue-200 w-fit rounded-md p-1">
                                {set.terms.length} Terms
                            </p>
                            <div className="flex justify-between items-center mt-3">
                                {/* Owner Information */}
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="h-8 w-8 flex items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ backgroundColor: set.iconColor || "#cccccc" }}
                                    >
                                        {set.ownerName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {set.ownerName || "Unknown"}
                                    </p>
                                </div>
                                {/* Preview Button */}
                                <button
                                    className="p-2 text-gray-400 font-medium bg-white rounded-lg border border-solid border-gray-300 h-fit hover:bg-gray-100"
                                    onClick={() => setSelectedSet(set)}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Modal */}
            {selectedSet && (
                <PreviewModal
                    flashcards={selectedSet.terms}
                    onClose={() => setSelectedSet(null)}
                />
            )}
        </>
    );
};

// Wrap Search component with Suspense
const SearchPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Search />
    </Suspense>
);

export default SearchPage;
