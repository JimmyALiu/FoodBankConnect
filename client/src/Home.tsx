import { FaSearch, FaFlag } from "react-icons/fa";

function Home() {
  return (
    <div className="fixed inset-0 grid grid-cols-[16rem_1fr] bg-white">
      {/* Sidebar */}
      <aside className="bg-blue-800 shadow-lg flex flex-col space-x-2 px-4">
        <div className="py-6 flex items center justify-center">
          <span className="text-white text-xl font-bold">
            🍎 Foodbank Connect
          </span>
        </div>
        <nav className="flex-1 mt-2">
          <ul className="space-y-6">
            {["Dashboard", "Search Clients", "Flagged Entries", "Log Out"].map(
              (label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="block px-6 py-2 text-white text-xl hover:bg-blue-500 rounded-lg transition duration-200"
                  >
                    {label}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center p-6 -mt-100">
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
