"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams(); // Use useParams to fetch params dynamically
  const { id } = params;

  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(""); // Feedback message
  const [isCorrect, setIsCorrect] = useState(null); // To track answer correctness

  // Fetch flashcard data from localStorage or API
  useEffect(() => {
    const storedSets = JSON.parse(localStorage.getItem("flashcardSets")) || [];
    const selectedSet = storedSets.find((set) => set.id === parseInt(id));
    
    if (selectedSet) {
      setFlashcards(selectedSet.terms);
    } else {
      alert("Flashcard set not found!");
      router.push("/");
    }
  }, [id, router]);
  
  

  const handleCheckAnswer = () => {
    const currentCard = flashcards[currentIndex];
    const isAnswerCorrect =
      userInput.toLowerCase().trim() === currentCard.definition.toLowerCase().trim();
  
    if (isAnswerCorrect) {
      setScore((prev) => prev + 1); // Increment score only if correct
      setFeedback("Correct!");
      setIsCorrect(true);
    } else {
      setFeedback("Wrong!");
      setIsCorrect(false);
    }
  
    // Delay to show feedback before moving to the next card
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex((prev) => prev + 1); // Move to the next card
        setUserInput("");
      } else {
        setCompleted(true); // End the quiz if no more cards are left
      }
      setFeedback("");
      setIsCorrect(null);
    }, 1000); // 1-second delay
  };
  

  const handleQuit = () => {
    setCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      {/* Navigation Buttons */}
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

      {/* Quiz Content */}
      {completed ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Completed!</h1>
          <p className="text-xl">Your score: {score}/{flashcards.length}</p>
          <button
            onClick={() => router.push(`/viewset/${id}`)}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          >
            Back to Flashcard Set
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Type the Definition</h1>
          {flashcards.length > 0 && (
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
              {/* Feedback message */}
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
          )}
        </div>
      )}
    </div>
  );
}
