function Search({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  return (
    <div className="bg-white">
      <main className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold mb-6">Search Clients</h1>
        <p className="mb-6 text-lg text-gray-700">
          Use this page to search for clients in the system.
        </p>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
            onClick={() => setCurrentPage("Home")}
          >
            Go to Home
          </button>
          <button
            className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
            onClick={() => setCurrentPage("Flagged")}
          >
            View Flagged Entries
          </button>
        </div>
      </main>
    </div>
  );
}

export default Search;
