"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const Search = ({params}) => {
    const searchParams = useSearchParams(); 
    const search = searchParams.get("query");
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const id = "";

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
    
          const query = e.target.value.trim();
    
          if (query) {
            router.push(`/search?query=${encodeURIComponent(query)}`);
          }
        }
      }

    return (
        <>
            {/* Navigation Bar */}
            <nav className="bg-green-100 flex justify-between items-center h-14 px-6">
                {/* Logo and Title */}
                <div className="flex items-center">
                <div className="h-10 w-10 bg-green-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                    A
                </div>
                <div className="text-green-900 ml-3 text-xl font-bold">Ace-It</div>
                </div>
                {/* Search Bar */}
                <div className="flex w-full max-w-lg">
                <input
                    className="bg-gray-50 text-gray-700 flex-grow rounded p-2 pl-10 outline-gray-300 bg-no-repeat bg-[length:1rem] bg-[position:5px_50%] bg-[url('https://img.icons8.com/?size=100&id=59878&format=png&color=000000')]"
                    placeholder="Search keywords"
                    onKeyDown={handleKeyDown}
                />
                </div>
            </nav>

            <h1 className="text-2xl my-5 font-medium w-[80%] mx-auto">
                Result for "{search}"
            </h1>
            
            {/* Main content */}
            <div className="flex flex-col gap-5 w-[80%] mx-auto">
                <p className="text-md font-medium">
                    Flashcard sets
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {[...Array(2)].map((_, index) => (
                        <div
                            key={index}
                            className="bg-white border border-solid border-gray-300 rounded-lg p-3"
                        >
                            <h1 className="text-md font-bold py-2">title</h1>
                            <p className="text-sm font-medium  bg-blue-200 w-fit rounded-md p-1">3 Terms</p>
                            <div className="flex justify-between items-center">
                                <p className="text-md font-medium pt-5">Created By Mike</p>
                                <button
                                    className="p-2 text-gray-400 font-medium bg-white rounded-lg border border-solid border-gray-300 h-fit hover:bg-gray-100"
                                    onClick={() => setShowModal(true)}
                                >
                                    Preview
                                </button>
                            </div>
                            
                        </div>
                    ))}

                </div>
            </div>

            {showModal &&
                (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>

                    {/* Modal */}
                    <div
                        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[70%] lg:w-[50%] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent click propagation
                    >
                        <div className="flex flex-col gap-4  pl-10 pb-10 pr-10">
                            <button
                                className="text-xl text-gray-400 w-full box-border mt-10 text-right -mb-5"
                                onClick={() => setShowModal(false)}
                            >
                                X

                            </button>
                            <h1 className="text-2xl font-bold">API</h1>
                            {[...Array(7)].map((_, index) => (
                                <div key={index}>
                                    <p className="text-lg font-semibold">Term</p>
                                    <p>Is a set of governing protocol or rules on how software elements should communicate and interact with one another.</p>
                                </div>
                            ))}
                        </div>

                            {/* Footer */}
                        <div className="flex justify-end items-center sticky p-3 h-16 gap-2 bg-gray-50 bottom-0 border-t border-solid border-gray-200">
                            <button className="text-lg text-white font-bold bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg">
                                Save
                            </button>
                            <Link href={`/viewset/${id}`}>
                                <button className="text-lg text-white font-bold bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg">
                                Study
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                </>
                )
            }
        </>
    )
}

export default Search;