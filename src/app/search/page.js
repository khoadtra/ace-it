"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { fbdb } from "@/lib/firebase/config";
import Link from "next/link";

const PreviewModal = ({ flashcards, onClose }) => (
    <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

        {/* Modal */}
        <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg">
            <div className="flex flex-col gap-4 p-10">
                <button
                    className="text-xl text-gray-400 w-full text-right -mb-5"
                    onClick={onClose}
                >
                    X
                </button>
                <h1 className="text-2xl font-bold">Preview</h1>
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

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const router = useRouter();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                const snapshot = await getDocs(collection(fbdb, "flashcardSets"));
                const allSets = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                if (query) {
                    // Filter by search query
                    const filteredSets = allSets.filter((set) =>
                        set.title.toLowerCase().includes(query.toLowerCase())
                    );
                    setFlashcardSets(filteredSets);
                } else {
                    // Show all sets if no query
                    setFlashcardSets(allSets);
                }
            } catch (error) {
                console.error("Error fetching flashcard sets:", error.message);
            }
        };

        fetchFlashcardSets();
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const searchQuery = e.target.value.trim();
            if (searchQuery) {
                router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    return (
        <>
            {/* Main Content */}
            <h1 className="text-2xl my-5 font-medium w-[80%] mx-auto">
                Results for "{query || "All Sets"}"
            </h1>

            <div className="flex flex-col gap-5 w-[80%] mx-auto">
                <p className="text-md font-medium">Flashcard sets</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {flashcardSets.map((set) => (
                        <div
                            key={set.id}
                            className="bg-white border border-solid border-gray-300 rounded-lg p-3"
                        >
                            <h1 className="text-md font-bold py-2">{set.title}</h1>
                            <p className="text-sm font-medium bg-blue-200 w-fit rounded-md p-1">
                                {set.terms.length} Terms
                            </p>
                            <div className="flex justify-between items-center mt-3">
                                <div className="flex items-center space-x-2">
                                    {/* Adjusted icon and username size */}
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

            {selectedSet && (
                <PreviewModal
                    flashcards={selectedSet.terms}
                    onClose={() => setSelectedSet(null)}
                />
            )}
        </>
    );
};

export default Search;
