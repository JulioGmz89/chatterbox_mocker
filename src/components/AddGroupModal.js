import React, { useState } from 'react';
import { useChat } from '../context/ChatProvider';

const AddGroupModal = ({ isOpen, onClose }) => {
  const { contacts, addGroup } = useChat();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [groupIcon, setGroupIcon] = useState('');

  const handleMemberToggle = (contactId) => {
    setSelectedMembers(prev =>
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const handleIconChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGroupIcon(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim() && selectedMembers.length > 0) {
      const newGroup = {
        name: groupName,
        members: selectedMembers,
        groupIcon: groupIcon || 'https://via.placeholder.com/150',
      };
      addGroup(newGroup);
      onClose();
      setGroupName('');
      setSelectedMembers([]);
      setGroupIcon('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Group Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Select Members</h3>
            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <img src={contact.profilePicture} alt={contact.name} className="w-8 h-8 rounded-full mr-3" />
                    <span>{contact.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(contact.id)}
                    onChange={() => handleMemberToggle(contact.id)}
                    className="form-checkbox h-5 w-5 text-green-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;
