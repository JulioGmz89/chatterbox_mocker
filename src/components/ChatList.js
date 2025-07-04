import React from 'react';
import { useChat } from '../context/ChatProvider';

const ChatList = ({ onSelectChat, onNewChat, onNewGroup, onOpenSettings, activeChatId }) => {
  const { contacts, groups, theme, toggleTheme, conversations } = useChat();

  const getLastMessage = (chatId) => {
    const chatConversation = conversations[chatId] || [];
    if (chatConversation.length === 0) return 'No messages yet';
    const lastMsg = chatConversation[chatConversation.length - 1];
    return lastMsg.text;
  };

  const allChats = [...contacts, ...groups].sort((a, b) => {
    const lastMessageA = conversations[a.id]?.[conversations[a.id]?.length - 1];
    const lastMessageB = conversations[b.id]?.[conversations[b.id]?.length - 1];
    const timeA = lastMessageA ? new Date(lastMessageA.timestamp) : new Date(0);
    const timeB = lastMessageB ? new Date(lastMessageB.timestamp) : new Date(0);
    return timeB - timeA;
  });

  const handleKeyPress = (e, chat) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelectChat(chat);
    }
  };

  const ThemeToggleIcon = () => (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-primary-text-light dark:text-primary-text-dark">Chatterbox</h1>
        <div className="flex items-center space-x-2">
          <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <ThemeToggleIcon />
          <button onClick={onNewGroup} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark" aria-label="Create new group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 3a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          <button onClick={onNewChat} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-text-light dark:text-secondary-text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto">
        <ul>
          {allChats.map(chat => (
            <li 
              key={chat.id} 
              onClick={() => onSelectChat(chat)} 
              onKeyPress={(e) => handleKeyPress(e, chat)}
              tabIndex="0"
              className={`p-3 flex items-center cursor-pointer transition-colors duration-200 rounded-lg mx-2 my-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-light dark:focus-visible:ring-accent-dark ${activeChatId === chat.id ? 'bg-accent-light/20 dark:bg-accent-dark/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-12 h-12 rounded-full mr-4 flex-shrink-0" />
              <div className="flex-grow truncate">
                <p className="font-semibold text-primary-text-light dark:text-primary-text-dark text-base">{chat.name}</p>
                <p className="text-sm text-secondary-text-light dark:text-secondary-text-dark truncate">
                  {getLastMessage(chat.id)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatList;
