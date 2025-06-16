import React, { useState, useEffect } from 'react';

const EditContactModal = ({ isOpen, onClose, contact, onSave }) => {
  const [formData, setFormData] = useState(contact);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary-text-light dark:text-primary-text-dark">Edit Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark mb-1">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark" />
          </div>
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark mb-1">About</label>
            <input type="text" name="about" value={formData.about} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark" />
          </div>
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-secondary-text-light dark:text-secondary-text-dark">Profile Picture</label>
            <input 
              type="file" 
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-secondary-text-light dark:text-secondary-text-dark file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-light/20 dark:file:bg-accent-dark/20 file:text-accent-light dark:file:text-accent-dark hover:file:bg-accent-light/30 dark:hover:file:bg-accent-dark/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"
            />
            {formData.profilePicture && <img src={formData.profilePicture} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover"/>}
          </div>
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark mb-1">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark" />
          </div>
          <div>
            <label className="block text-secondary-text-light dark:text-secondary-text-dark mb-1">Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 text-primary-text-light dark:text-primary-text-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-primary-text-light dark:text-primary-text-dark font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-accent-light hover:bg-accent-light/90 dark:bg-accent-dark dark:hover:bg-accent-dark/90 rounded-lg text-white font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
