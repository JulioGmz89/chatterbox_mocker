import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const localData = localStorage.getItem('chat-data');
      return localData ? JSON.parse(localData) : initialData;
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
      return initialData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chat-data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [data]);

    const sendMessage = (chatId, messageText, senderId) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
            sender: senderId,
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setData(prevData => ({
      ...prevData,
      conversations: {
        ...prevData.conversations,
        [chatId]: [...(prevData.conversations[chatId] || []), newMessage],
      },
    }));
  };

  const addContact = (newContact) => {
    setData(prevData => ({
      ...prevData,
      contacts: [
        ...prevData.contacts,
        { ...newContact, id: `contact-${Date.now()}` },
      ],
    }));
  };

  const value = {
    ...data,
    addContact,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
