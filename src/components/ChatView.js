import React, { useState, useEffect, useRef } from 'react';
import EditContactModal from './EditContactModal';
import * as htmlToImage from 'html-to-image';
import { useChat } from '../context/ChatProvider';

const ChatView = ({ chat, onBack }) => {
  const {
    contacts,
    conversations,
    chatBackgrounds,
    sendMessage,
    updateMessageTimestamp,
    updateContact,
    deleteContact,
    deleteGroup,
    updateChatBackground,
    getSender,
    theme,
    toggleTheme
  } = useChat();

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentSender, setCurrentSender] = useState('me');
  const [defaultBgDataUrl, setDefaultBgDataUrl] = useState('');

  const DEFAULT_BG_URL = 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png';

  useEffect(() => {
    const toDataURL = async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Failed to convert image to data URL:', error);
        return url;
      }
    };
    
    if (!chatBackgrounds[chat.id]) {
        toDataURL(DEFAULT_BG_URL).then(dataUrl => setDefaultBgDataUrl(dataUrl));
    }
  }, [chat.id, chatBackgrounds]);

  const conversation = conversations[chat.id] || [];
  const isGroupChat = !!chat.isGroup;
  const chatBackground = chatBackgrounds[chat.id] || defaultBgDataUrl || DEFAULT_BG_URL;

  const handleSaveContact = (updatedContact) => {
    updateContact(updatedContact);
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete this ${isGroupChat ? 'group' : 'chat'}? This action cannot be undone.`)) {
      if (isGroupChat) {
        deleteGroup(chat.id);
      } else {
        deleteContact(chat.id);
      }
      onBack();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(chat.id, message, currentSender);
      setMessage('');
    }
  };

  const getSenderName = (senderId) => {
    const sender = getSender(senderId);
    return sender ? sender.name.split(' ')[0] : 'Unknown';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleExport = () => {
    setMenuOpen(false);
    setIsExporting(true);
  };

  useEffect(() => {
    if (isExporting) {
      if (chatContainerRef.current === null) {
        setIsExporting(false);
        return;
      }
      const element = chatContainerRef.current;
      htmlToImage.toPng(element, {
        width: element.clientWidth,
        height: element.clientHeight,
      })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${chat.name}-chat.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => console.error('Oops, something went wrong!', err))
        .finally(() => {
          setIsExporting(false);
        });
    }
  }, [isExporting, chat.name]);

  const handleTimestampEdit = (msg) => {
    const newTime = prompt('Enter new time (HH:MM):', new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    if (newTime) {
      const [hours, minutes] = newTime.split(':');
      if (!isNaN(hours) && !isNaN(minutes)) {
        const newTimestamp = new Date(msg.timestamp);
        newTimestamp.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        updateMessageTimestamp(chat.id, msg.id, newTimestamp.toISOString());
      }
    }
  };

  const handleChangeBackground = () => {
    backgroundInputRef.current.click();
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateChatBackground(chat.id, reader.result);
      };
      reader.readAsDataURL(file);
    }
    setMenuOpen(false);
  };

  if (!chat) return null;

  return (
    <>
      <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden" style={{height: '812px', width: '375px'}} ref={chatContainerRef}>
        {/* Chat Header */}
        {isExporting ? (
          <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-t-lg flex-shrink-0">
            <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{chat.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{isGroupChat ? `${chat.members.length} members` : (chat.status || 'online')}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2 text-gray-800 dark:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 01.55.89V19.1a1 1 0 01-1.55.83L15 16.5l-3.45 2.43a1 1 0 01-1.55-.83v-8.22a1 1 0 01.55-.89L10 10l5 .01z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0119 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
            </div>
          </header>
        ) : (
          <header className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-t-lg flex-shrink-0">
            <button onClick={onBack} className="mr-4 text-gray-800 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-grow">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{chat.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{isGroupChat ? `${chat.members.length} members` : (chat.status || 'online')}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              {!isGroupChat && (
                <button onClick={() => setEditModalOpen(true)} className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 5.232z" /></svg>
                </button>
              )}
              <button className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 01.55.89V19.1a1 1 0 01-1.55.83L15 16.5l-3.45 2.43a1 1 0 01-1.55-.83v-8.22a1 1 0 01.55-.89L10 10l5 .01z" /></svg>
              </button>
              <button className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0119 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </button>
              <div className="relative">
                <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <button onClick={handleExport} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Export Chat</button>
                    <button onClick={handleChangeBackground} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Change Background</button>
                    <button onClick={toggleTheme} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Toggle Theme</button>
                    <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">Delete {isGroupChat ? 'Group' : 'Chat'}</button>
                  </div>
                )}
              </div>
              <input type="file" ref={backgroundInputRef} onChange={handleBackgroundChange} className="hidden" accept="image/*" />
            </div>
          </header>
        )}

        {/* Messages Area */}
        <div className="flex-grow flex flex-col" style={{ backgroundImage: `url(${chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {conversation.map(msg => {
                const sender = msg.sender === 'me' ? null : getSender(msg.sender);
                const senderProfilePicture = sender ? sender.profilePicture : null;
                
                return (
                  <div key={msg.id} className={`flex items-end ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender !== 'me' && senderProfilePicture && (
                      <img src={senderProfilePicture} alt={sender.name} className="w-6 h-6 rounded-full mr-2" />
                    )}
                    <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'me' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'}`}>
                      {isGroupChat && msg.sender !== 'me' && (
                        <p className="font-bold text-sm text-teal-500 dark:text-green-300">{getSenderName(msg.sender)}</p>
                      )}
                      <p className="text-gray-900 dark:text-white">{msg.text}</p>
                      <p 
                        onClick={() => handleTimestampEdit(msg)}
                        className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1 cursor-pointer hover:text-black dark:hover:text-white transition"
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Message Input */}
        {isExporting ? (
          <footer className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-b-lg flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="flex-grow flex items-center bg-white dark:bg-gray-600 rounded-full py-2 px-4">
                <button type="button" className="text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <p className="text-gray-500 dark:text-gray-400 ml-2">Type a message</p>
                <button type="button" className="ml-auto text-gray-500 dark:text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
              </div>
              <button type="button" className="bg-green-500 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </button>
            </div>
          </footer>
        ) : (
          <footer className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-b-lg flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <select
                value={currentSender}
                onChange={(e) => setCurrentSender(e.target.value)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="me">Me</option>
                {isGroupChat
                  ? chat.members.map(memberId => {
                    const member = getSender(memberId);
                    return member ? <option key={member.id} value={member.id}>{member.name.split(' ')[0]}</option> : null;
                  })
                  : <option value={chat.id}>{chat.name.split(' ')[0]}</option>
                }
              </select>
              <div className="flex-grow flex items-center relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="w-full bg-gray-200 dark:bg-gray-600 rounded-full py-2 pl-10 pr-10 text-gray-900 dark:text-white focus:outline-none"
                />
                <button type="button" className="absolute left-3 text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button type="button" className="absolute right-3 text-gray-500 dark:text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
              </div>
              <button type="submit" className="bg-green-500 rounded-full p-2 hover:bg-green-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </footer>
        )}
      </div>

      {!isGroupChat && (
        <EditContactModal 
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          contact={chat}
          onSave={handleSaveContact}
        />
      )}
    </>
  );
};

export default ChatView;
