import { useEffect, useState } from "react";
import axios from "axios";
import { findDuplicates, isValidGuest } from "./utils/utils";
import Modal from "./components/Modal";
import EditClientForm from "./components/EditClientForm";
import type { FBMGuest } from "../../server/routes/helper";


function Flagged({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {

  // State to hold the clients 
  const [clients, setClients] = useState<FBMGuest[]>([])

  // State to hold the flagged clients
  const [flaggedEntries, setEntries] = useState<FBMGuest[]>([]);

  // Controls popup modal for client review
  const [activeClientIndex, setActiveClientIndex] = useState<number | null>(null);

  // State to hold the index of the dismissed client to fade out
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);

  // Helper function to add a guest to DB
  function onAdd(index: number) {
    setFadingIndex(index); 
    setTimeout(() => {
      const guestToAdd = flaggedEntries[index];
      const { notes, ...payload } = guestToAdd;
  
      axios
        .post("http://localhost:3000/api/fbm/guests/add", payload)
        .then((res) => {
          console.log("Added guest:", res.data);
          setEntries((prev) => prev.filter((_, i) => i !== index)); 
        })
        .catch((err) => {
          console.error("Failed to add guest:", err);
        })
        .finally(() => {
          setFadingIndex(null); 
        });
    }, 300); 
  }

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
        setClients(res.data.items);
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
    if (!clients || flaggedEntries.length > 0) return;
    const clientEntries: FBMGuest[] = [];
    for (let i = 0; i < clients.length; i++) {
      if (!isValidGuest(clients[i])) {
        console.error("Invalid guest data:", clients[i]);
        continue; 
      } else {
        clientEntries.push(clients[i]);
      }
    }
    const duplicates: FBMGuest[] = findDuplicates(clientEntries);
    if (duplicates.length > 0) {
      setEntries(duplicates);
    } else {
      console.log("No duplicates found");
    }
  }, [clients]);

  // Determines if component is loading
  if (!flaggedEntries) {
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
                  <strong>Name:</strong> {entry.firstname}{" "}
                  {entry.lastname}
                </p>
                <p>
                  <strong>Location:</strong> {entry.street_address}, {entry.city}
                  , {entry.state}
                </p>
                <p>
                  <strong>⚠️ Issue:</strong> {entry.notes}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    className="bg-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => setActiveClientIndex(index)}
                  >
                    Review
                  </button>
                  <button
                    className="bg-gray-300 text-blue-500 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => onDismiss(index)}
                  >
                    Dismiss
                  </button>
                  <button
                    className="bg-gray-300 text-blue-500 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => onAdd(index)}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
            {/* Modal for editing client */}
            {activeClientIndex !== null && (
              <Modal isOpen={true} onClose={() => setActiveClientIndex(null)}>
                <EditClientForm
                  client={flaggedEntries[activeClientIndex]}
                  onSave={(updatedClient) => {
                    const updatedEntries = [...flaggedEntries];
                    updatedEntries[activeClientIndex] = updatedClient;
                    setEntries(updatedEntries);
                    setActiveClientIndex(null); 
                  }}
                />
              </Modal>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default Flagged;
