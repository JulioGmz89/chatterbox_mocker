import React from 'react';

const SettingsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
        
        <div className="space-y-4">
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
