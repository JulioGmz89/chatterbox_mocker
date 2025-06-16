import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data';

const ChatContext = createContext();

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
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

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

      const updateContact = (updatedContact) => {
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(c => c.id === updatedContact.id ? updatedContact : c),
    }));
  };

  const deleteChat = (chatId) => {
    setData(prevData => {
      const newContacts = prevData.contacts.filter(c => c.id !== chatId);
      const newGroups = prevData.groups.filter(g => g.id !== chatId);
      const newConversations = { ...prevData.conversations };
      delete newConversations[chatId];

      return {
        ...prevData,
        contacts: newContacts,
        groups: newGroups,
        conversations: newConversations,
      };
    });
  };

  const updateMessageTimestamp = (chatId, messageId, newTimestamp) => {
    setData(prevData => {
      const updatedConversation = prevData.conversations[chatId].map(msg =>
        msg.id === messageId ? { ...msg, timestamp: newTimestamp } : msg
      );

      return {
        ...prevData,
        conversations: {
          ...prevData.conversations,
          [chatId]: updatedConversation,
        },
      };
    });
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

    const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    ...data,
    addContact,
    sendMessage,
    updateMessageTimestamp,
    deleteChat,
    updateContact: updateContact, // Corrected here
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
