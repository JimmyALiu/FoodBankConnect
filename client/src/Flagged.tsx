import { useEffect, useState } from "react";
import axios from "axios";
import { findDuplicates } from "./utils/utils.ts";

function Flagged({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  // State to hold the fetched guests data
  const [guests, setGuests] = useState<any>(null);

  // State to hold the flagged clients
  const [flaggedEntries, setEntries] = useState<{ [key: string]: string }[]>(
    []
  );

  // State to hold the index of the dismissed client to fade out
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);

  // State to hold the index of the expanded entry when the review button is clicked
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Helper function to remove the entry from the flagged clients and fade it out
  function onDismiss(index: number) {
    setFadingIndex(index);
    setTimeout(() => {
      setEntries((prev) => prev.filter((_, i) => i !== index));
      setFadingIndex(null);
    }, 300);
  }

  // Fetch guests data from the API
  useEffect(() => {
    async function fetchGuests() {
      try {
        const res = await axios.get("http://localhost:3000/api/fbm/guests");
        setGuests(res.data);
        console.log("Check:", res.data);
      } catch (err) {
        console.error("Error fetching guests:", err);
      }
    }
    fetchGuests();
  }, []);

  // Get duplicates from the guests data
  // Also checks to see if guests is populated
  useEffect(() => {
    if (!guests || flaggedEntries.length > 0) return;
    const obj = JSON.parse(JSON.stringify(guests));
    const guestEntries: { [key: string]: string }[] = [];
    for (let i = 0; i < obj.items.length; i++) {
      const entry = {
        "First Name": obj.items[i].firstname,
        "Last Name": obj.items[i].lastname,
        Address: obj.items[i].street_address,
        City: obj.items[i].city,
        State: obj.items[i].state,
      };
      guestEntries.push(entry);
    }
    const duplicates = findDuplicates(guestEntries);
    setEntries(duplicates);
  }, [guests]);

  // Determines if component is loading
  if (!guests) {
    return (
      <div>
        <main className="flex flex-col items-center justify-center p-6">
          <h1>Loading...</h1>
        </main>
      </div>
    );
  }
  // Not loading we can display the flagged clients
  else {
    return (
      <div className="bg-white min-h-screen">
        <main className="flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-semibold mb-4">Flagged Clients</h1>
          <p className="mb-6 text-lg text-gray-700 text-center max-w-xl">
            These clients have incomplete or incorrect information that needs to
            be reviewed.
          </p>
          <div className="flex space-x-4 mb-8">
            <button
              className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
              onClick={() => setCurrentPage("Home")}
            >
              Go to Home
            </button>
            <button
              className="px-4 py-2 text-blue-500 hover:text-blue-700 transition"
              onClick={() => setCurrentPage("Search")}
            >
              Search Clients
            </button>
          </div>
          {/* Flagged entries*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {flaggedEntries.map((entry, index) => (
              <div
                key={index}
                className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow transform transition-opacity duration-300 ${
                  fadingIndex === index ? "opacity-0" : "opacity-100"
                }`}
              >
                <p className="text-red-600 font-semibold mb-2">
                  Flagged Client
                </p>
                <p>
                  <strong>Name:</strong> {entry["First Name"]}{" "}
                  {entry["Last Name"]}
                </p>
                <p>
                  <strong>Location:</strong> {entry["Address"]}, {entry["City"]}
                  , {entry["State"]}
                </p>
                <p>
                  <strong>⚠️ Issue:</strong> {entry["Issue"]}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    {expandedIndex === index ? "Close" : "Review"}
                  </button>
                  <button
                    className="bg-gray-300 text-blue-500 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => onDismiss(index)}
                  >
                    Dismiss
                  </button>
                </div>
                {expandedIndex === index && (
                  <div className="mt-2 text-sm text-gray-700 transition-all duration-300 ease-in-out">
                    <p>📋 Review</p>
                    <p>null</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
}

export default Flagged;
