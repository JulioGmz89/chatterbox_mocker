import React from 'react';
import { useChat } from '../context/ChatProvider';

const ContactList = ({ onSelectContact }) => {
  const { contacts } = useChat();

  return (
    <div className="bg-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Contacts</h2>
      </div>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id} onClick={() => onSelectContact(contact.id)} className="p-3 flex items-center cursor-pointer hover:bg-gray-700 border-b border-gray-700">
            <img src={contact.profilePicture} alt={contact.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-grow">
                <p className="font-semibold">{contact.name}</p>
                <p className="text-sm text-gray-400 truncate">{contact.about}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
