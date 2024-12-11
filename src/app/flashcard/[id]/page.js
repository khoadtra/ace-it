"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers"; // Import Firestore helper

export default function FlashcardGrid() {
    const { id } = useParams(); // Destructure id directly from params
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            if (!id) {
                console.warn("Invalid ID for fetching flashcard set");
                setLoading(false);
                return;
            }
            try {
                const selectedSet = await getFlashcardSetById(id); // Fetch set by ID
                if (selectedSet) {
                    setFlashcardSet(selectedSet);
                } else {
                    console.warn("Flashcard set not found for the provided ID");
                }
            } catch (error) {
                console.error("Error fetching flashcard set:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcardSet();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center text-gray-500 mt-20">
                Loading flashcard set...
            </div>
        );
    }

    return (
        <div className="flex justify-center p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {flashcardSet.terms.map((card, index) => (
                    <FlashcardFlip
                        key={index}
                        term={card.term}
                        definition={card.definition}
                    />
                ))}
            </div>
        </div>
    );
}

const FlashcardFlip = ({ term, definition }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className={`card ${isFlipped ? "flip" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front Side */}
            <div className="front text-2xl font-semibold text-gray-800 p-4">
                {term}
            </div>

            {/* Back Side */}
            <div className="back text-xl font-medium text-gray-600 p-4">
                {definition}
            </div>
        </div>
    );
};