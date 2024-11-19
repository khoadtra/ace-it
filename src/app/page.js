export default function Home() {
  return (
    <>
      <nav className=" bg-blue-100 flex justify-around items-center h-12">
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
          <button>
            <img
              className="h-9"
              src="https://img.icons8.com/?size=100&id=48129&format=png&color=000000"/>
          </button>
          <button>
            <img
              className="h-10 ml-2"
              src="https://img.icons8.com/?size=100&id=NjOjDSZRU0Ma&format=png&color=000000" />
          </button> 
        </div>
      </nav>

      <div className="bg-gray-200 flex flex-col h-[calc(100vh-3rem)]">

      </div>
    </>
  );
}

