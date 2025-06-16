import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatProvider';

const SettingsModal = ({ isOpen, onClose }) => {
  const fileInputRef = useRef(null);
  const { user, updateUser } = useChat();
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  useEffect(() => {
    if (user) {
      setProfilePictureUrl(user.profilePicture || '');
    }
  }, [user]);
  if (!isOpen) return null;

  const handleSaveProfile = () => {
    updateUser({ profilePicture: profilePictureUrl });
    // Optionally, give user feedback on save
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setProfilePictureUrl(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This action is irreversible.')) {
      localStorage.removeItem('chat-data');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary-text-light dark:text-primary-text-dark mb-4">Settings</h2>
        
        <div className="space-y-6"> 
          <div>
            <h3 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark">Your Profile</h3>
            <div className="flex items-center space-x-4 mt-2">
              <div className="relative">
                <img src={profilePictureUrl} alt="Your profile" className="w-16 h-16 rounded-full" />
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600"
                  aria-label="Change profile picture"
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
              <div className="flex-grow">
                <label htmlFor="profile-pic-url" className="block text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark">Or paste image URL</label>
                <input 
                  type="text"
                  id="profile-pic-url"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  className="w-full mt-1 p-2 bg-secondary-bg-light dark:bg-secondary-bg-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                />
              </div>
            </div>
             <button 
              onClick={handleSaveProfile} 
              className="mt-3 w-full bg-accent-light dark:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"
            >
              Save Profile
            </button>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div>
            <h3 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark">Data Management</h3>
            <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark mb-2">
              This will delete all your contacts, groups, and conversations permanently.
            </p>
            <button 
              onClick={handleResetData} 
              className="w-full bg-destructive-light dark:bg-destructive-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
            >
              Reset All Data
            </button>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button 
            onClick={onClose} 
            className="bg-gray-200 dark:bg-gray-700 text-primary-text-light dark:text-primary-text-dark font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
