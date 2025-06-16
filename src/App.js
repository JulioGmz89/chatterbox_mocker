import React, { useState } from 'react';
import ChatList from './components/ChatList';
import AddContactModal from './components/AddContactModal';
import ChatView from './components/ChatView';
import { useChat } from './context/ChatProvider';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
        const { theme, toggleTheme, conversations, addContact } = useChat();

    const handleSaveContact = (newContact) => {
    addContact(newContact);
    setIsModalOpen(false);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('chat-data');
      window.location.reload();
    }
  };

  const activeConversation = activeChat ? conversations[activeChat.id] || [] : [];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex justify-center items-center p-4">
      <div className={`w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${activeChat ? 'flex justify-center' : ''}`}>
        {activeChat ? (
          <ChatView chat={activeChat} conversation={activeConversation} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="p-4">
            <header className="mb-6 text-center">
              <div className="flex justify-center items-center mb-4">
                <h1 className="text-4xl font-bold text-green-400 dark:text-green-500">Chatterbox Mocker</h1>
                <button onClick={toggleTheme} className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                  {theme === 'light' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  }
                </button>
              </div>
              <p className="text-gray-400">Create realistic mock chats</p>
            </header>
            <div className="mb-4">
              <button
                onClick={() => setIsModalOpen(true)} 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition w-full"
              >
                Add New Contact
              </button>
              <button 
                  onClick={handleResetData} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition w-full mt-2"
                >
                  Reset Data
              </button>
            </div>
                        <ChatList onSelectChat={setActiveChat} />
          </div>
        )}

        {isModalOpen && (
          <AddContactModal 
            onSave={handleSaveContact} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
