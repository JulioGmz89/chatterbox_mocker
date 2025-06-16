import React, { useState } from 'react';
import { useChat } from '../context/ChatProvider';
import AddGroupModal from './AddGroupModal';

const ChatList = ({ onSelectChat }) => {
  const { contacts, groups, deleteContact, deleteGroup } = useChat();
  const [contextMenu, setContextMenu] = useState(null);
  const [isAddGroupModalOpen, setAddGroupModalOpen] = useState(false);

  const handleContextMenu = (event, chat) => {
    event.preventDefault();
    setContextMenu({
      chat: chat,
      x: event.clientX,
      y: event.clientY,
    });
    document.addEventListener('click', () => setContextMenu(null), { once: true });
  };

  const handleDelete = () => {
    if (contextMenu) {
      if (contextMenu.chat.isGroup) {
        deleteGroup(contextMenu.chat.id);
      } else {
        deleteContact(contextMenu.chat.id);
      }
      setContextMenu(null);
    }
  };

  const allChats = [...contacts, ...groups].sort((a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp));

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chats</h2>
          <button onClick={() => setAddGroupModalOpen(true)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">New Group</button>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {allChats.map(chat => (
            <li 
              key={chat.id} 
              onClick={() => onSelectChat(chat)} 
              onContextMenu={(e) => handleContextMenu(e, chat)}
              className="p-3 flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 relative"
            >
              <img src={chat.profilePicture || chat.groupIcon} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
              <div className="flex-grow">
                <p className="font-semibold">{chat.name}</p>
              </div>
            </li>
          ))}
        </ul>
        {contextMenu && (
          <div style={{ top: contextMenu.y, left: contextMenu.x }} className="absolute bg-white dark:bg-gray-900 shadow-lg rounded-md py-2 z-50">
            <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800">Delete</button>
          </div>
        )}
      </div>
      <AddGroupModal isOpen={isAddGroupModalOpen} onClose={() => setAddGroupModalOpen(false)} />
    </>
  );
};

export default ChatList;
