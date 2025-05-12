import { FaSearch, FaFlag } from "react-icons/fa";
import Dashboard from "./components/Dashboard";

function Home({ setCurrentPage }: { setCurrentPage: (page: string) => void }) {
  return (
    <div className="fixed inset-0 grid grid-cols-[16rem_1fr] bg-white">
      {/* Sidebar */}
      <Dashboard setCurrentPage={setCurrentPage} />
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-6 mb-[10%]">
        <h1 className="text-3xl font-semibold mb-12 text-black">
          Welcome to Volunteer Hub
        </h1>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10">
          {/* Buttons */}
          <button
            className="
              flex flex-col items-center justify-center
              w-64 h-64
              rounded-xl border
              shadow-md hover:shadow-lg transition
              bg-gradient-to-br from-blue-300 to-blue-500
              hover:from-blue-500 hover:to-blue-300
            "
            onClick={() => setCurrentPage("Search")}
          >
            <FaSearch className="text-4xl text-blue-700 mb-4" />
            <span className="text-white text-lg font-semibold">
              Search for Clients
            </span>
          </button>
          <button
            className="
              flex flex-col items-center justify-center
              w-64 h-64
              rounded-xl border
              shadow-md hover:shadow-lg transition
              bg-gradient-to-br from-rose-300 to-red-500
              hover:from-red-500 hover:to-rose-300
            "
            onClick={() => setCurrentPage("Flagged")}
          >
            <FaFlag className="text-4xl text-red-700 mb-4" />
            <span className="text-white text-lg font-semibold">
              View Flagged Entries
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;
