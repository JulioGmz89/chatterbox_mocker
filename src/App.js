import React, { useState } from 'react';
import ContactList from './components/ContactList';
import AddContactModal from './components/AddContactModal';
import ChatView from './components/ChatView';
import { useChat } from './context/ChatProvider';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const { contacts, conversations, addContact } = useChat();

  const handleSaveContact = (newContact) => {
    addContact(newContact);
    setIsModalOpen(false);
  };

  const activeContact = contacts.find(c => c.id === activeChatId);
  const activeConversation = conversations[activeChatId] || [];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-md h-[90vh] bg-gray-800 rounded-2xl shadow-2xl flex flex-col">
        {activeChatId ? (
          <ChatView contact={activeContact} conversation={activeConversation} onBack={() => setActiveChatId(null)} />
        ) : (
          <div className="p-4">
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-green-400">WhatsApp Mocker</h1>
              <p className="text-gray-400">Create realistic mock chats</p>
            </header>
            <div className="mb-4">
              <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Add New Contact
              </button>
            </div>
            <ContactList onSelectContact={setActiveChatId} />
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
