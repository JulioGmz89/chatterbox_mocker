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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">About</label>
            <input type="text" name="about" value={formData.about} onChange={handleChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
            <input 
              type="file" 
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 dark:file:bg-green-900 file:text-green-700 dark:file:text-green-300 hover:file:bg-green-100 dark:hover:file:bg-green-800"
            />
            {formData.profilePicture && <img src={formData.profilePicture} alt="Preview" className="mt-2 w-20 h-20 rounded-full object-cover"/>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded bg-gray-300 dark:bg-gray-600">Cancel</button>
            <button type="submit" className="py-2 px-4 rounded bg-green-500 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
