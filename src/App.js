import React, { useState } from 'react';
import ChatList from './components/ChatList';
import AddContactModal from './components/AddContactModal';
import NewGroupModal from './components/NewGroupModal';
import EditGroupModal from './components/EditGroupModal';
import SettingsModal from './components/SettingsModal';
import ChatView from './components/ChatView';
import { useChat } from './context/ChatProvider';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const { addContact, addGroup, updateGroup, conversations } = useChat();

  const handleSaveContact = (newContact) => {
    addContact(newContact);
    setIsModalOpen(false);
  };

  const handleSaveGroup = (newGroup) => {
    addGroup(newGroup);
    setIsNewGroupModalOpen(false);
  };

  const handleOpenEditGroupModal = (group) => {
    setEditingGroup(group);
    setIsEditGroupModalOpen(true);
  };

  const handleUpdateGroup = (updatedGroup) => {
    updateGroup(updatedGroup);
    setIsEditGroupModalOpen(false);
    setEditingGroup(null);
  };
  
  const activeConversation = activeChat ? conversations[activeChat.id] || [] : [];

  return (
    <div className="h-screen w-full relative md:flex overflow-hidden">
      {/* Left Pane - Chat List */}
      <div className={ `
        w-full md:w-96 flex-shrink-0 bg-secondary-bg-light dark:bg-secondary-bg-dark border-r border-gray-200 dark:border-gray-700 flex flex-col
        transition-transform duration-300 ease-in-out
        ${activeChat ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        <ChatList 
          onSelectChat={setActiveChat}
          onNewChat={() => setIsModalOpen(true)}
          onNewGroup={() => setIsNewGroupModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          activeChatId={activeChat?.id}
        />
      </div>

      {/* Right Pane - Chat View */}
      <div className={ `
        absolute top-0 left-0 w-full h-full md:static flex-1 flex flex-col min-w-0
        transition-transform duration-300 ease-in-out
        ${activeChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {activeChat ? (
          <ChatView 
            chat={activeChat} 
            conversation={activeConversation} 
            onBack={() => setActiveChat(null)}
            onEditGroup={handleOpenEditGroupModal} 
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center bg-primary-bg-light dark:bg-primary-bg-dark">
            <h2 className="text-2xl font-semibold text-primary-text-light dark:text-primary-text-dark">
              Welcome to Chatterbox Mocker
            </h2>
            <p className="text-secondary-text-light dark:text-secondary-text-dark mt-2">
              Select a chat from the left to start mocking.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddContactModal 
          onSave={handleSaveContact} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
      />

      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        onSave={handleSaveGroup}
      />

      <EditGroupModal
        isOpen={isEditGroupModalOpen}
        onClose={() => setIsEditGroupModalOpen(false)}
        group={editingGroup}
        onSave={handleUpdateGroup}
      />
    </div>
  );
}

export default App;
