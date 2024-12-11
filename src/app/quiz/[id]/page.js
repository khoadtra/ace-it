"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFlashcardSetById } from "@/lib/firebase/firestoreHelpers";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Fetches the flashcard set from Firestore and sets the state.
   */
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      setError(null); // Reset error state
      try {
        const selectedSet = await getFlashcardSetById(id);
        if (selectedSet?.terms?.length) {
          setFlashcards(selectedSet.terms);
        } else {
          setError("Flashcard set not found or contains no terms. Redirecting...");
          setTimeout(() => router.push("/"), 3000);
        }
      } catch (err) {
        console.error("Error fetching flashcard set:", err.message);
        setError("Failed to load flashcard set. Redirecting...");
        setTimeout(() => router.push("/"), 3000);
      }
    };

    fetchFlashcardSet();
  }, [id, router]);

  /**
   * Validates and checks the user's answer.
   */
  const handleCheckAnswer = () => {
    if (flashcards.length === 0 || currentIndex >= flashcards.length) return;

    const currentCard = flashcards[currentIndex];
    const isAnswerCorrect =
      userInput.trim().toLowerCase() === currentCard.definition.trim().toLowerCase();

    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
      setFeedback("Correct!");
      setIsCorrect(true);
    } else {
      setFeedback("Wrong! The correct answer is: " + currentCard.definition);
      setIsCorrect(false);
    }

    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserInput("");
      } else {
        setCompleted(true);
      }
      setFeedback("");
      setIsCorrect(null);
    }, 1500);
  };

  /**
   * Ends the quiz early and marks it as completed.
   */
  const handleQuit = () => {
    setCompleted(true);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* Navigation Buttons */}
      <NavigationButtons id={id} router={router} />

      {/* Quiz Content */}
      {completed ? (
        <CompletionScreen id={id} score={score} total={flashcards.length} router={router} />
      ) : (
        <QuizContent
          flashcards={flashcards}
          currentIndex={currentIndex}
          userInput={userInput}
          setUserInput={setUserInput}
          handleCheckAnswer={handleCheckAnswer}
          handleQuit={handleQuit}
          feedback={feedback}
          isCorrect={isCorrect}
        />
      )}
    </div>
  );
}

// Navigation Buttons Component
const NavigationButtons = ({ id, router }) => (
  <div className="w-full flex justify-between mb-6">
    <button
      onClick={() => router.push("/")}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
    >
      Back to Home
    </button>
    <button
      onClick={() => router.push(`/viewset/${id}`)}
      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
    >
      Back to Flashcard Set
    </button>
  </div>
);

// Completion Screen Component
const CompletionScreen = ({ id, score, total, router }) => (
  <div className="text-center">
    <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
    <p className="text-xl">Your score: {score}/{total}</p>
    <button
      onClick={() => router.push(`/viewset/${id}`)}
      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
    >
      Back to Flashcard Set
    </button>
  </div>
);

// Quiz Content Component
const QuizContent = ({
  flashcards,
  currentIndex,
  userInput,
  setUserInput,
  handleCheckAnswer,
  handleQuit,
  feedback,
  isCorrect,
}) => {
  if (flashcards.length === 0) {
    return <div className="text-gray-500 text-center">No flashcards available.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Type the Definition</h1>
      <div className="p-6 bg-white rounded-lg shadow-lg text-center w-96">
        <h2 className="text-lg font-bold mb-4">{flashcards[currentIndex].term}</h2>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer here..."
          className={`w-full p-2 border rounded-lg mb-4 ${
            isCorrect === true
              ? "border-green-500"
              : isCorrect === false
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {feedback && (
          <p
            className={`text-lg mb-4 ${
              isCorrect ? "text-green-500" : "text-red-500"
            } transition-opacity duration-500`}
          >
            {feedback}
          </p>
        )}
        <div className="flex justify-between">
          <button
            onClick={handleCheckAnswer}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
          >
            Submit
          </button>
          <button
            onClick={handleQuit}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};
