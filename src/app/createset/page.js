"use client"; // Add this directive to make the file a client component
import React, { useState, useRef } from 'react'


const createset = () => {

  const titleRef = useRef();
  const descriptionRef = useRef();
  const termRefs = useRef([]);
  const definitionRefs = useRef([]);

  const [flashcardSet, setFlashcardSet] = useState({
      title: "",
      description: "",
      terms: [
        { term: "", definition: "" },
        { term: "", definition: "" },
        {term: "", definition: ""}
      ],
  });
  
  const addFlashCard = () => {
    setFlashcardSet({
      title: titleRef.current.value || "",
      description: descriptionRef.current.value || "",
      terms: flashcardSet.terms.map((_, index) => ({
        term: termRefs.current[index]?.value || "",
        definition: definitionRefs.current[index]?.value || "",
      })),
    });
  };

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-blue-100 h-14 flex ml-auto mr-auto items-center border-b-2 border-solid border-black">
        <div className=" text-lg font-bold ml-auto mr-auto">
          Create a New Flashcard Set
        </div>
        <div className="ml-auto mr-20">
          <button
            className=" bg-blue-500 rounded-lg p-1"
            onClick={addFlashCard}>
            <span className="p-1">Create</span>
            </button>
        </div>
      </div>

      {/* Title, Description Input */}
      <div className="w-1/2 mt-5 ml-10">
        <input
          type="text"
          id="title"
          ref={titleRef}
          placeholder="Enter your set title"
          className="w-full tracking-wide outline-none border-b-2 border-black p-1"/>
        <textarea
          id="description"
          ref={descriptionRef}
          placeholder="Add a description..."
          className="w-full tracking-wide outline-none border-b-2 border-black resize-none mt-5">       
          </textarea>
      </div>

      {/* Input */}
      <div className="flex-col h-[100vh] ml-10 mr-10 mt-14">
        {flashcardSet.terms.map((_, index) => (
          <div key={index} className="flex-col bg-white mb-5">
            <div className="p-2 mb-10 border-b-2 border-gray-100">{index}</div>
            <div className="flex gap-4 justify-between">

            {/* Term Input */}
            <textarea
              type="text"
              ref={(el) => termRefs.current[index] = el}
              placeholder="Enter term"
              className="w-1/2 ml-2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-yellow-500"
              >
            </textarea>
              
            {/* Definition Input */}
            <textarea
              type="text"
              ref={(el) => definitionRefs.current[index] = el}
              placeholder="Enter definition"
              className="w-1/2 mr-2 tracking-wide outline-none resize-none border-b-2 border-black p-1 focus:border-yellow-500">
            </textarea>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default createset