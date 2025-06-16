import React, { useState, useRef } from 'react';

const AddContactModal = ({ onSave, onClose }) => {
  const fileInputRef = useRef(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [about, setAbout] = useState('Hey there! I am using WhatsApp.');
  const [profilePicture, setProfilePicture] = useState('');

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfilePicture(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      profilePicture: profilePicture || `https://robohash.org/${name.replace(/\s/g, '_')}.png?size=150x150`,
      status: 'Online', // Default status
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary-text-light dark:text-primary-text-dark">Add New Contact</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src={profilePicture || 'https://robohash.org/default.png?size=150x150'} 
                alt="Profile preview" 
                className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
                aria-label="Upload profile picture"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z" /></svg>
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handlePictureUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="flex-grow space-y-4">
              <input 
                type="text" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
              />
            </div>
          </div>


          <input 
            type="text" 
            placeholder="About" 
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
          />
          <input 
            type="text" 
            placeholder="Or paste Profile Picture URL (optional)" 
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-primary-text-light dark:text-primary-text-dark font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-accent-light hover:bg-accent-light/90 dark:bg-accent-dark dark:hover:bg-accent-dark/90 rounded-lg text-white font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">Save Contact</button>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
