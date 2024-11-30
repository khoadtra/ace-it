"use client";

import { useState } from "react";
import "./flashcards.css"; // Ensure this is the correct relative path for local styles.

export default function Flashcard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="front">
        <p>{question}</p>
      </div>
      <div className="back">
        <p>{answer}</p>
      </div>
    </div>
  );
}