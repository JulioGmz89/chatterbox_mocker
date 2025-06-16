import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useChat } from '../context/ChatProvider';

const ChatView = ({ chat, conversation, onBack }) => {
  const chatContainerRef = useRef(null);
  const [message, setMessage] = useState('');
    const [currentSender, setCurrentSender] = useState('me'); // 'me' or a contact's id
  const { contacts, sendMessage, updateMessageTimestamp } = useChat();

  const isGroupChat = !!chat.members;

  const handleSendMessage = (e) => {
    e.preventDefault();
                if (message.trim()) {
      sendMessage(chat.id, message, currentSender);
      setMessage('');
    }
  };

    const getSenderName = (senderId) => {
    if (senderId === 'me') return null;
    const contact = contacts.find(c => c.id === senderId);
    return contact ? contact.name.split(' ')[0] : null;
  };

    const handleExport = () => {
    if (chatContainerRef.current === null) {
      return;
    }

    htmlToImage.toPng(chatContainerRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${chat.name}-chat.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  };

  const handleTimestampEdit = (msg) => {
    const newTime = prompt('Enter new time (HH:MM):', new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    if (newTime) {
      const [hours, minutes] = newTime.split(':');
            if (!isNaN(hours) && !isNaN(minutes)) {
        const newTimestamp = new Date(msg.timestamp);
        newTimestamp.setHours(hours, minutes);
        updateMessageTimestamp(chat.id, msg.id, newTimestamp.toISOString());
      }
    }
  };
      if (!chat) return null;

  return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg" ref={chatContainerRef}>
      {/* Chat Header */}
            <header className="flex items-center p-3 border-b border-gray-700 bg-gray-700 rounded-t-lg">
        <button onClick={onBack} className="mr-4 text-white hover:text-green-400 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
                    <p className="font-semibold text-white">{chat.name}</p>
          { !isGroupChat && <p className="text-sm text-gray-400">{chat.status}</p> }
        </div>
        <div className="ml-auto">
            <button onClick={handleExport} className="p-2 text-white hover:text-green-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
        </div>
      </header>

      {/* Messages Area */}
      {/* Messages Area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-2">
        {conversation.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'bg-green-700 text-white' : 'bg-gray-600 text-white'}`}>
              {isGroupChat && msg.sender !== 'me' && (
                <p className="font-bold text-sm text-green-300">{getSenderName(msg.sender)}</p>
              )}
              <p>{msg.text}</p>
                            <p 
                onClick={() => handleTimestampEdit(msg)}
                className="text-xs text-gray-400 text-right mt-1 cursor-pointer hover:text-white transition"
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
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
            {isGroupChat 
              ? chat.members.map(memberId => {
                  const member = contacts.find(c => c.id === memberId);
                  return member ? <option key={member.id} value={member.id}>{member.name.split(' ')[0]}</option> : null;
              })
              : <option value={chat.id}>{chat.name.split(' ')[0]}</option>
            }
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
