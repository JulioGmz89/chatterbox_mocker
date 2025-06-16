import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useChat } from '../context/ChatProvider';
import EditContactModal from './EditContactModal';

const ChatView = ({ chat, conversation, onBack }) => {
  const { sendMessage, getSender, updateContact } = useChat();
  const [message, setMessage] = useState('');
  const [currentSenderId, setCurrentSenderId] = useState('me');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const participants = [
    { id: 'me', name: 'Me', profilePicture: 'https://i.pravatar.cc/150?u=me' },
    ...(chat.isGroup ? chat.members.map(getSender).filter(Boolean) : [chat])
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(chat.id, message, currentSenderId);
      setMessage('');
    }
  };

  const handleExport = () => {
    setMenuOpen(false);
    if (chatContainerRef.current === null) return;
    htmlToImage.toPng(chatContainerRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${chat.name}-chat.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Oops, something went wrong!', err));
  };

  const handleSaveContact = (updatedContact) => {
    updateContact(updatedContact);
    setEditModalOpen(false);
  };

  const ActionMenu = () => (
    <div className="relative">
      <button onClick={() => setMenuOpen(!isMenuOpen)} aria-label="Open menu" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button onClick={handleExport} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">Export as PNG</button>
          {!chat.isGroup && <button onClick={() => { setEditModalOpen(true); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">Edit Contact</button>}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-primary-bg-light dark:bg-primary-bg-dark">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} aria-label="Back to chat list" className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-10 h-10 rounded-full mr-4" />
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-primary-text-light dark:text-primary-text-dark">{chat.name}</h2>
          <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark">online</p>
        </div>
        <div className="flex items-center space-x-2">
          <button aria-label="Start video call" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
          <button aria-label="Start audio call" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
          <ActionMenu />
        </div>
      </header>

      {/* Message Area */}
      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto bg-secondary-bg-light dark:bg-secondary-bg-dark">
        <div className="space-y-4">
          {conversation.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-my-message-bg-light text-my-message-text-light dark:bg-my-message-bg-dark dark:text-my-message-text-dark' : 'bg-their-message-bg-light text-their-message-text-light dark:bg-their-message-bg-dark dark:text-their-message-text-dark'}`}>
                <p>{msg.text}</p>
                <p className="text-xs text-right mt-1 opacity-75">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Composer */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark" />
          <button type="submit" aria-label="Send message" className="p-2 rounded-full bg-accent-light dark:bg-accent-dark text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
        </form>
        <div className="flex items-center mt-3 space-x-2">
          <span className="text-sm text-secondary-text-light dark:text-secondary-text-dark">Send as:</span>
          {participants.map(p => (
            <button key={p.id} onClick={() => setCurrentSenderId(p.id)} aria-label={`Send as ${p.name}`} className={`flex items-center p-1 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark ${currentSenderId === p.id ? 'ring-2 ring-accent-light dark:ring-accent-dark' : ''}`}>
              <img src={p.profilePicture} alt={p.name} className="w-8 h-8 rounded-full" />
            </button>
          ))}
        </div>
      </footer>

      {!chat.isGroup && (
        <EditContactModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} contact={chat} onSave={handleSaveContact} />
      )}
    </div>
  );
};

export default ChatView;
