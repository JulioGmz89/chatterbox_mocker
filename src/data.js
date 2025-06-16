export const initialData = {
  contacts: [
    {
      id: 'contact-1',
      name: 'Jane Doe',
      profilePicture: 'https://robohash.org/jane_doe.png?size=150x150',
      status: 'Online',
      about: 'Hey there! I am using WhatsApp.',
      phoneNumber: '+1 123-456-7890',
    },
    {
      id: 'contact-2',
      name: 'John Smith',
      profilePicture: 'https://robohash.org/john_smith.png?size=150x150',
      status: 'Typing...',
      about: 'At the movies.',
      phoneNumber: '+1 987-654-3210',
    },
  ],
  groups: [],
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

  },
};
