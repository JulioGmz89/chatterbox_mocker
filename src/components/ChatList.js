import React, { useState } from 'react';
import { useChat } from '../context/ChatProvider';

const ChatList = ({ onSelectChat }) => {
  const { contacts, groups, deleteChat } = useChat();
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event, chat) => {
    event.preventDefault();
    setContextMenu({
      chatId: chat.id,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDelete = () => {
    if (contextMenu) {
      deleteChat(contextMenu.chatId);
      setContextMenu(null);
    }
  };
  

  // Combine contacts and groups into a single list for rendering
  const allChats = [...contacts, ...groups];

  return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Chats</h2>
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
                {/* We can add last message preview here later */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
