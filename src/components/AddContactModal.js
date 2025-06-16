import React, { useState } from 'react';

const AddContactModal = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [about, setAbout] = useState('Hey there! I am using WhatsApp.');
  const [profilePicture, setProfilePicture] = useState('');

  const handleSave = () => {
    // Basic validation
    if (!name.trim() || !phoneNumber.trim()) {
      alert('Name and Phone Number are required.');
      return;
    }
    onSave({
      name,
      phoneNumber,
      about,
      // Use a random avatar if no picture is provided
      profilePicture: profilePicture || `https://picsum.photos/seed/${Date.now()}/150/150`,
      status: 'Online', // Default status
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">Add New Contact</h2>
        
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-green-500"
          />
          <input 
            type="text" 
            placeholder="Phone Number" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-green-500"
          />
          <input 
            type="text" 
            placeholder="About" 
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-green-500"
          />
          <input 
            type="text" 
            placeholder="Profile Picture URL (optional)" 
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-semibold transition">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition">Save Contact</button>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
