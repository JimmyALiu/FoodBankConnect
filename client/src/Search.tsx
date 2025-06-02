import { useState } from "react"
import axios from 'axios'
import { parseSearchResponseData } from './utils/utils'

function Search({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const [clients, setClients] = useState([
    {
      id: "",
      firstname: "",
      lastname: "",
      street_address: "",
      phone: "",
      othersHousehold: [
        { name: "" }
      ]
    }
  ])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  });

  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function searchDatabase(): void {
    // validate form
    if (formData.firstName != "" && !/^[a-zA-Z]+$/.test(formData.firstName)) {
      setErrorMsg("Please enter a valid first name");
      return;
    }

    if (formData.lastName != "" && !/^[a-zA-Z]+$/.test(formData.lastName)) {
      setErrorMsg("Please enter a valid last name");
      return;
    }

    if (formData.phone != "" && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      setErrorMsg("Please enter a valid phone number");
      return;
    }
    
    setErrorMsg("");
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
        setClients(parseSearchResponseData(response.data));
      })
      .catch(error => {
        console.log(error);
      })

  }


  return (
    <div className="bg-white">
      <main className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold mb-6">Search Clients</h1>
        <p className="mb-10 text-lg text-gray-700 w-[45%] text-center">
          Use this page to search for clients in the system. <br /> Leave blank to retrieve the whole database, search fields are all optional.
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
          <input id="fname" name="firstName" type="text" value={formData.firstName} onChange={handleChange} className="px-2 py-1 border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="lname">Last name:</label>
          <input id="lname" name="lastName" type="text" value={formData.lastName} onChange={handleChange} className="px-2 py-1 border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="address">Address:</label>
          <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} className="px-2 py-1 border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <label htmlFor="phone">Phone:</label>
          <input id="phone" name="phone" type="text" value={formData.phone} placeholder="123-456-7890" onChange={handleChange} className="px-2 py-1 border-2 border-blue-300 rounded-md focus:border-blue-400 focus:outline-none transition duration-250" />
          <input type="submit" value="Search" className="specialBtn text-blue-500 font-semibold hover:text-blue-700 py-2 my-5 rounded-lg" />
        </form>

        <div className="mb-3 mt-5">
          <p className="text-red-600">{errorMsg}</p>
        </div>

        {/* search results */}
        <div className="overflow-hidden mt-10 shadow-md rounded-xl">
          <table className='border-collapse table-auto'>
            <thead className='bg-[#ecf5fc] border-b border-blue-300'>
              <tr className="text-blue-500">
                <th className="py-2 px-5">ID</th>
                <th className="py-2 px-5">First Name</th>
                <th className="py-2 px-5">Last Name</th>
                <th className="py-2 px-5">Address</th>
                <th className="py-2 px-5">Phone</th>
                <th className="py-2 px-5">Other Households</th>
              </tr>
            </thead>
            <tbody className="bg-white">
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
                  <tr key={id} className="border-b border-blue-100">
                    <td className="py-3 px-6">{el.id}</td>
                    <td className="py-3 px-6">{el.firstname}</td>
                    <td className="py-3 px-6">{el.lastname}</td>
                    <td className="py-3 px-6">{el.street_address}</td>
                    <td className="py-3 px-6">{el.phone}</td>
                    <td className="py-3 px-6">{others}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Search;
