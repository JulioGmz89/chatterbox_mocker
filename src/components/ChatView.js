import React, { useState } from 'react';
import { useChat } from '../context/ChatProvider';

const ChatView = ({ contact, conversation, onBack }) => {
  const [message, setMessage] = useState('');
  const [currentSender, setCurrentSender] = useState('me'); // 'me' or contact.id
  const { sendMessage } = useChat();

  const handleSendMessage = (e) => {
    e.preventDefault();
        if (message.trim()) {
      sendMessage(contact.id, message, currentSender);
      setMessage('');
    }
  };
  if (!contact) return null;

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg">
      {/* Chat Header */}
      <header className="flex items-center p-3 border-b border-gray-700 bg-gray-700 rounded-t-lg">
        <button onClick={onBack} className="mr-4 text-white hover:text-green-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src={contact.profilePicture} alt={contact.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-white">{contact.name}</p>
          <p className="text-sm text-gray-400">{contact.status}</p>
        </div>
      </header>

      {/* Messages Area */}
      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-2">
        {conversation.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'bg-green-700 text-white' : 'bg-gray-600 text-white'}`}>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400 text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
            {/* Message Input */}
      <footer className="p-3 border-t border-gray-700 bg-gray-700 rounded-b-lg">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <select 
            value={currentSender} 
            onChange={(e) => setCurrentSender(e.target.value)}
            className="p-2 bg-gray-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="me">Me</option>
            <option value={contact.id}>{contact.name.split(' ')[0]}</option>
          </select>
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow p-2 bg-gray-600 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </form>
      </footer>
    </div>
  );
};

export default ChatView;
