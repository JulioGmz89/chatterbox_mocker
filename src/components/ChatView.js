import React, { useState, useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { useChat } from '../context/ChatProvider';
import EditContactModal from './EditContactModal';

const ChatView = ({ chat, conversation, onBack, onEditGroup }) => {
  const { sendMessage, getSender, updateContact, updateMessageTimestamp, updateChatBackground, chatBackgrounds } = useChat();
  const [message, setMessage] = useState('');
  const [currentSenderId, setCurrentSenderId] = useState('me');
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [editingTimestamp, setEditingTimestamp] = useState(null);
  const [newTimestamp, setNewTimestamp] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const exportRef = useRef(null);
  const chatBackground = chat ? chatBackgrounds[chat.id] : null;
  const [avatarDataUrls, setAvatarDataUrls] = useState({});

  const participants = [
    { id: 'me', name: 'Me', profilePicture: 'https://robohash.org/me.png?size=150x150' },
    ...(chat.isGroup ? chat.members.map(getSender).filter(Boolean) : [chat])
  ];

  useEffect(() => {
    const convertImagesToDataUrls = async () => {
      const urls = {};
      for (const participant of participants) {
        if (participant.profilePicture && !avatarDataUrls[participant.id]) {
          try {
            const response = await fetch(participant.profilePicture);
            if (!response.ok) throw new Error('Network response was not ok.');
            const blob = await response.blob();
            const dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            urls[participant.id] = dataUrl;
          } catch (error) {
            console.error(`Failed to fetch image for ${participant.name}:`, error);
            urls[participant.id] = participant.profilePicture; // Fallback
          }
        }
      }
      if (Object.keys(urls).length > 0) {
        setAvatarDataUrls(prev => ({ ...prev, ...urls }));
      }
    };
    convertImagesToDataUrls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(participants)]);

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

  const exportChat = (asPhone = false) => {
    setMenuOpen(false);
    if (exportRef.current === null) return;

    const node = exportRef.current;
    const elementsToHide = node.querySelectorAll('.hide-on-export, .send-as-section');
    elementsToHide.forEach(el => el.style.display = 'none');
    
    const originalBackgroundColor = node.style.backgroundColor;
    const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    node.style.backgroundColor = theme === 'dark' ? '#121827' : '#FFFFFF';

    const exportOptions = {
      cacheBust: true,
      skipFonts: true,
      pixelRatio: window.devicePixelRatio || 1,
    };
    let originalStyle = {};

    if (asPhone) {
      originalStyle = {
        width: node.style.width,
        height: node.style.height,
        border: node.style.border,
        borderRadius: node.style.borderRadius,
        boxShadow: node.style.boxShadow,
        overflow: node.style.overflow,
      };
      
      Object.assign(node.style, {
        width: '390px',
        height: '844px',
        border: '16px solid black',
        borderRadius: '36px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      });
    }

    htmlToImage.toPng(node, exportOptions)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${chat.name}-chat${asPhone ? '-phone' : ''}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.error('Oops, something went wrong!', err))
      .finally(() => {
        elementsToHide.forEach(el => el.style.display = '');
        node.style.backgroundColor = originalBackgroundColor;
        if (asPhone) {
          Object.assign(node.style, originalStyle);
        }
      });
  };

  const handleChangeWallpaper = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          updateChatBackground(chat.id, readerEvent.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
    setMenuOpen(false);
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
        <div className="absolute right-0 mt-2 w-56 bg-secondary-bg-light dark:bg-secondary-bg-dark rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <button onClick={() => exportChat(false)} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">Export as PNG</button>
          <button onClick={() => exportChat(true)} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">Export as Phone Screenshot</button>
          {chat.isGroup && (
            <button onClick={() => { onEditGroup(chat); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700">Edit Group</button>
          )}
          <button onClick={handleChangeWallpaper} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-700">Change Background</button>
          {!chat.isGroup && <button onClick={() => { setEditModalOpen(true); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-primary-text-light dark:text-primary-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800">Edit Contact</button>}
        </div>
      )}
    </div>
  );

  return (
    <div ref={exportRef} style={{ backgroundImage: `url(${chatBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col h-full bg-primary-bg-light dark:bg-primary-bg-dark">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} aria-label="Back to chat list" className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <img src={avatarDataUrls[chat.id] || chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-10 h-10 rounded-full mr-4" />
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
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {conversation.map((msg, index) => {
            const sender = getSender(msg.sender);
            const showSenderInfo = chat.isGroup && msg.sender !== 'me';
            const prevMessage = conversation[index - 1];
            const showDetails = showSenderInfo && (!prevMessage || prevMessage.sender !== msg.sender);

            return (
              <div key={msg.id} className={`group flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                {showSenderInfo && (
                  <div className="w-8 h-8 flex-shrink-0">
                    {showDetails && sender && 
                      <img src={avatarDataUrls[sender.id] || sender.profilePicture} alt={sender.name} className="w-8 h-8 rounded-full" />
                    }
                  </div>
                )}
                <div className={`max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'me' ? 'bg-my-message-bg-light text-my-message-text-light dark:bg-my-message-bg-dark dark:text-my-message-text-dark' : 'bg-their-message-bg-light text-their-message-text-light dark:bg-their-message-bg-dark dark:text-their-message-text-dark'}`}>
                  {showDetails && sender && 
                    <p className="font-bold text-sm mb-1 text-accent-light dark:text-accent-dark">{sender.name}</p>
                  }
                  <p>{msg.text}</p>
                  {editingTimestamp === msg.id ? (
                    <input
                      type="text"
                      value={newTimestamp}
                      onChange={(e) => setNewTimestamp(e.target.value)}
                      onBlur={() => {
                        updateMessageTimestamp(chat.id, msg.id, newTimestamp);
                        setEditingTimestamp(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateMessageTimestamp(chat.id, msg.id, newTimestamp);
                          setEditingTimestamp(null);
                        }
                      }}
                      className="bg-transparent text-xs text-right w-full focus:outline-none focus:ring-1 focus:ring-accent-light rounded-sm"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <p className="text-xs opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <button
                        onClick={() => {
                          setEditingTimestamp(msg.id);
                          setNewTimestamp(msg.timestamp);
                        }}
                        className="hide-on-export opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        aria-label="Edit timestamp"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <footer className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <form onSubmit={handleSendMessage} className="flex-grow flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-full px-2">
            <button type="button" aria-label="Emoji" className="p-2 rounded-full text-secondary-text-light dark:text-secondary-text-dark hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="w-full bg-transparent py-2 focus:outline-none text-primary-text-light dark:text-primary-text-dark" />
          </form>
          {message.trim() ? (
            <button onClick={handleSendMessage} aria-label="Send message" className="p-3 rounded-full bg-accent-light dark:bg-accent-dark text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          ) : (
            <button type="button" aria-label="Record audio" className="p-3 rounded-full bg-accent-light dark:bg-accent-dark text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 6v4m0 0H9m4 0h2M5 11a7 7 0 0114 0" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center mt-3 space-x-2 send-as-section">
          <span className="text-sm text-secondary-text-light dark:text-secondary-text-dark">Send as:</span>
          {participants.map(p => (
            <button key={p.id} onClick={() => setCurrentSenderId(p.id)} aria-label={`Send as ${p.name}`} className={`flex items-center p-1 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark ${currentSenderId === p.id ? 'ring-2 ring-accent-light dark:ring-accent-dark' : ''}`}>
              <img
                src={avatarDataUrls[p.id] || p.profilePicture}
                alt={p.name}
                className="w-8 h-8 rounded-full"
              />
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
