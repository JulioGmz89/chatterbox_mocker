export const initialData = {
  contacts: [
    {
      id: 'contact-1',
      name: 'Jane Doe',
      profilePicture: 'https://i.pravatar.cc/150?u=jane_doe',
      status: 'Online',
      about: 'Hey there! I am using WhatsApp.',
      phoneNumber: '+1 123-456-7890',
    },
    {
      id: 'contact-2',
      name: 'John Smith',
      profilePicture: 'https://i.pravatar.cc/150?u=john_smith',
      status: 'Typing...',
      about: 'At the movies.',
      phoneNumber: '+1 987-654-3210',
    },
  ],
  groups: [
    {
      id: 'group-1',
      name: 'Project Team',
      groupIcon: 'https://i.pravatar.cc/150?u=project_team',
      description: 'Discussion about the new project.',
      creationDate: '2025-06-15T10:00:00Z',
      members: ['contact-1', 'contact-2'], // IDs of contacts
    },
  ],
  conversations: {
    'contact-1': [
      {
        id: 'msg-1',
        sender: 'contact-1',
        text: 'Hey! How are you?',
        timestamp: '2025-06-15T10:05:00Z',
      },
      {
        id: 'msg-2',
        sender: 'me',
        text: 'I am good, thanks! How about you?',
        timestamp: '2025-06-15T10:06:00Z',
      },
    ],
    'group-1': [
      {
        id: 'msg-3',
        sender: 'contact-1',
        text: 'Hello team, just a reminder about the meeting tomorrow.',
        timestamp: '2025-06-15T11:00:00Z',
      },
      {
        id: 'msg-4',
        sender: 'me',
        text: 'Thanks for the reminder, Jane!',
        timestamp: '2025-06-15T11:01:00Z',
      },
    ],
  },
};
