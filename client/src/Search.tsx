import { useState } from "react"
import axios from 'axios'

function Search({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {

  const [clients, setClients] = useState([
    {
      id: "1",
      firstname: "Alice",
      lastname: "Smith",
      street_address: "123 Main St",
      phone: "555-1234",
      othersHousehold: [
        { name: "Charlie" },
        { name: "Daisy" }
      ]
    },
    {
      id: "2",
      firstname: "Bob",
      lastname: "Jones",
      street_address: "456 Oak Ave",
      phone: "555-5678",
      othersHousehold: []
    },
    {
      id: "3",
      firstname: "Carol",
      lastname: "Brown",
      street_address: "789 Pine Rd",
      phone: "555-0000",
      othersHousehold: [
        { name: "alice" }
      ]
    }
  ])

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
    console.log("click!");
    setClients([]);

    // should send a request to the database
    const url = "http://localhost:3000/api/fbm";
    axios.get(url + "/guest/search" +
        `?firstname=${formData.firstName}&` +
        `lastname=${formData.lastName}&` +
        `street_address=${formData.address}&` +
        `phone=${formData.phone}`
    )
      .then(response => {
        // populate results from the request into clients
        console.log(response.data);
        let len: number = response.data.results.length;
        console.log(len + "HI");

        let newClients: any = [];
        for (let i = 0; i < len; i++) {
          console.log("iteration: " + i);
          newClients = [
            ...newClients, 
            {
              id: response.data.results[i].id,
              firstname: response.data.results[i].firstname,
              lastname: response.data.results[i].lastname,
              street_address: response.data.results[i].street_address,
              phone: response.data.results[i].phone,
              othersHousehold: response.data.results[i].othersHousehold
            }
          ]
          console.log("client: " + newClients);
        }

        setClients(newClients);
      })
      .catch(error => {
        console.log(error);
      })

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
        <form action={searchDatabase} className="pt-[2%] flex flex-col gap-2">
          <label htmlFor="fname">First name:</label>
          <input id="fname" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="lname">Last name:</label>
          <input id="lname" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="address">Address:</label>
          <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="phone">Phone:</label>
          <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} className="border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <input type="submit" value="Search" className="specialBtn text-blue-500 font-semibold hover:text-blue-700 py-2 my-5 rounded-lg" />
        </form>

        {/* search results */}
        <table className='border border-collapse table-auto'>
          <thead>
            <tr>
              <th className="border border-gray-500 py-2 px-5">ID</th>
              <th className="border border-gray-500 py-2 px-5">First Name</th>
              <th className="border border-gray-500 py-2 px-5">Last Name</th>
              <th className="border border-gray-500 py-2 px-5">Address</th>
              <th className="border border-gray-500 py-2 px-5">Phone</th>
              <th className="border border-gray-500 py-2 px-5">Other Households</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((el, id) => {
              let others: string = "";

              if (el.othersHousehold !== null) { 
                for (let i = 0; i < el.othersHousehold.length - 1; i++) {
                  others += el.othersHousehold[i].name;
                  others += ", ";
                }

                if (el.othersHousehold.length > 0) {
                  others += el.othersHousehold[el.othersHousehold.length - 1].name;
                }
              } else {
                others = "null";
              }

              return (
                <tr key={id}>
                  <td className="border border-gray-500 py-2 px-5">{el.id}</td>
                  <td className="border border-gray-500 py-2 px-5">{el.firstname}</td>
                  <td className="border border-gray-500 py-2 px-5">{el.lastname}</td>
                  <td className="border border-gray-500 py-2 px-5">{el.street_address}</td>
                  <td className="border border-gray-500 py-2 px-5">{el.phone}</td>
                  <td className="border border-gray-500 py-2 px-5">{others}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Search;
