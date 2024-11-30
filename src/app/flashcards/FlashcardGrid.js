import Flashcard from "./Flashcard";

export default function FlashcardGrid() {
  const cards = [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is the color of the sky?", answer: "Blue" },
    { question: "What is 5 x 3?", answer: "15" },
    { question: "What is 10 / 2?", answer: "5" },
    { question: "What is the largest planet?", answer: "Jupiter" },
    { question: "What is the speed of light?", answer: "299,792 km/s" },
    { question: "Who wrote 'Hamlet'?", answer: "Shakespeare" },
    { question: "What is H2O?", answer: "Water" },
  ];

  return (
    <div className="flashcard-grid">
      {cards.map((card, index) => (
        <Flashcard
          key={index}
          question={card.question}
          answer={card.answer}
        />
      ))}
    </div>
  );
}