import Dashboard from "./components/Dashboard";

function Flagged({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  return (
    <div className="fixed inset-0 grid grid-cols-[16rem_1fr] bg-white">
      <Dashboard setCurrentPage={setCurrentPage} />
      <main className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold mb-6">Flagged Clients</h1>
        <p className="mb-6 text-lg text-gray-700">
          Use this page to view flagged clients in the system.
        </p>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setCurrentPage("Home")}
          >
            Go to Home
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => setCurrentPage("Search")}
          >
            Search Clients
          </button>
        </div>
      </main>
    </div>
  );
}

export default Flagged;
