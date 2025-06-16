import React, { useState } from 'react';
import ChatList from './components/ChatList';
import AddContactModal from './components/AddContactModal';
import ChatView from './components/ChatView';
import { useChat } from './context/ChatProvider';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
      const { conversations, addContact } = useChat();

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
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md h-[90vh] bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
                {activeChat ? (
          <ChatView chat={activeChat} conversation={activeConversation} onBack={() => setActiveChat(null)} />
        ) : (
          <div className="p-4">
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-green-400">WhatsApp Mocker</h1>
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
