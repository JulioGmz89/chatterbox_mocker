import React, { useState } from 'react';
import { useChat } from '../context/ChatProvider';

const NewGroupModal = ({ isOpen, onClose, onSave }) => {
  const { contacts } = useChat();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  if (!isOpen) return null;

  const handleMemberToggle = (contactId) => {
    setSelectedMembers(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSave = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      const newGroup = {
        name: groupName,
        members: selectedMembers,
        groupIcon: `https://robohash.org/${groupName.replace(/\s/g, '_')}.png?size=150x150`,
      };
      onSave(newGroup);
      setGroupName('');
      setSelectedMembers([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-primary-bg-light dark:bg-primary-bg-dark p-6 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-primary-text-light dark:text-primary-text-dark">Create New Group</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Group Name"
          className="w-full p-2 mb-4 bg-secondary-bg-light dark:bg-secondary-bg-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
        />
        <h3 className="text-lg font-semibold mb-2 text-primary-text-light dark:text-primary-text-dark">Select Members</h3>
        <div className="max-h-60 overflow-y-auto mb-4">
          {contacts.map(contact => (
            <div key={contact.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <input
                type="checkbox"
                id={`member-${contact.id}`}
                checked={selectedMembers.includes(contact.id)}
                onChange={() => handleMemberToggle(contact.id)}
                className="mr-3 h-4 w-4 rounded text-accent-light focus:ring-accent-light"
              />
              <label htmlFor={`member-${contact.id}`} className="flex items-center cursor-pointer">
                <img src={contact.profilePicture} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
                <span className="text-primary-text-light dark:text-primary-text-dark">{contact.name}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-primary-text-light dark:text-primary-text-dark hover:bg-gray-300 dark:hover:bg-gray-600">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-accent-light dark:bg-accent-dark text-white hover:opacity-90">Create Group</button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
