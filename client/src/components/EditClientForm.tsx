import React, { useState } from "react";
import type { FBMGuest } from "../../../server/routes/helper";

interface EditClientProps {
  client: FBMGuest;
  onSave?: (client: FBMGuest) => void;
}

const EditClient: React.FC<EditClientProps> = ({ client, onSave }) => {
  const [formData, setFormData] = useState(client);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative w-[90%] max-w-xl max-h-[90%]">
      <h2 className="text-2xl font-bold mb-4">Edit Client</h2>
      <form>
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstname"             
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"              
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="street_address"       
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.street_address}
            onChange={handleChange}
          />
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"                  
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        {/* State */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"                   
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <input
            type="text"
            name="notes"                   
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-blue py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e) => {
            e.preventDefault();
            if (onSave) {
              onSave(formData);
            }
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditClient;
