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

  const updateGroup = (updatedGroup) => {
    setData(prevData => ({
      ...prevData,
      groups: prevData.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g),
    }));
  };

  const deleteContact = (contactId) => {
    setData(prevData => {
      const newContacts = prevData.contacts.filter(c => c.id !== contactId);
      const newConversations = { ...prevData.conversations };
      delete newConversations[contactId];
      return { ...prevData, contacts: newContacts, conversations: newConversations };
    });
  };

  const deleteGroup = (groupId) => {
    setData(prevData => {
      const newGroups = prevData.groups.filter(g => g.id !== groupId);
      const newConversations = { ...prevData.conversations };
      delete newConversations[groupId];
      return { ...prevData, groups: newGroups, conversations: newConversations };
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

  const addGroup = (newGroup) => {
    setData(prevData => ({
      ...prevData,
      groups: [
        ...prevData.groups,
        { ...newGroup, id: `group-${Date.now()}`, members: newGroup.members || [], isGroup: true },
      ],
    }));
  };

  const getSender = (senderId) => {
    return data.contacts.find(c => c.id === senderId);
  };

  const updateChatBackground = (chatId, backgroundUrl) => {
    setData(prevData => ({
      ...prevData,
      chatBackgrounds: {
        ...(prevData.chatBackgrounds || {}),
        [chatId]: backgroundUrl,
      },
    }));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const { contacts, groups, conversations, chatBackgrounds } = data;

  const value = {
    theme,
    toggleTheme,
    contacts: contacts || [],
    groups: groups || [],
    conversations: conversations || {},
    chatBackgrounds: chatBackgrounds || {},
    addContact,
    updateContact,
    deleteContact,
    addGroup,
    updateGroup,
    deleteGroup,
    sendMessage,
    updateMessageTimestamp,
    getSender,
    updateChatBackground,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
