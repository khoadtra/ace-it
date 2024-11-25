import Link from "next/link";
export default function Home() {
  return (
    <>
      <nav className="bg-blue-100 flex justify-around items-center h-12">
        <div className="flex items-center">
          <img
            className="h-10"
            src="https://img.icons8.com/?size=100&id=OcH8C89hZ9SZ&format=png&color=000000"
            alt="Quizlet Icon" />
          <div className="text-blue-900 ml-2">Your Library</div>
        </div>
        {/*Input Section */}
        <div className="flex w-full max-w-lg">
        <input
          className="bg-gray-50 text-black-100 flex-grow rounded p-1 pl-6 outline-gray-300 bg-no-repeat bg-[length:1rem] bg-[position:5px_50%] bg-[url('https://img.icons8.com/?size=100&id=59878&format=png&color=000000')]"
          placeholder="Flashcard sets, questions, textbooks">
          </input>
          </div>
        <div>
          <Link href="/createset">
            <button>
              <img
                className="h-9"
                src="https://img.icons8.com/?size=100&id=48129&format=png&color=000000"/>
              </button>
          </Link>
          <button>
            <img
              className="h-10 ml-2"
              src="https://img.icons8.com/?size=100&id=NjOjDSZRU0Ma&format=png&color=000000" />
          </button> 
        </div>
      </nav>

      <div className="flex flex-col h-screen w-3/4 ml-auto mr-auto mt-10">
        <div className="flex flex-col bg-white shadow-lg shadow-black-300/50">
          <div className="flex flex-row w-2/5 p-2 items-center text-sm font-medium">
            <div>Terms</div>
            <div className="ml-4 text-gray-200">|</div>
            <img
              className="h-5 ml-4 mr-2"
              src="https://img.icons8.com/?size=100&id=NjOjDSZRU0Ma&format=png&color=000000" />
            <div>Username</div>
          </div>
          <div className="ml-2 mb-4 font-bold">Set Title</div>
        </div>
      </div>
    </>
  );
}

