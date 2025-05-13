import { useState } from "react"

function Search({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function searchDatabase(): void {
    
  }


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
        <form action={searchDatabase}>
          <label htmlFor="fname">First name:</label>
          <input id="fname" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="border" />
          <label htmlFor="lname">Last name:</label>
          <input id="lname" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="border" />
          <label htmlFor="address">Address:</label>
          <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="border" />
          <label htmlFor="phone">Phone:</label>
          <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className="border" />
          <input type="submit" value="Search" />
        </form>
      </main>
    </div>
  );
}

export default Search;
