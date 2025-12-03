import { Contact, Deal, Task, Activity } from './types';

export const MOCK_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Sarah Connor',
    company: 'Skynet Cyberdyne',
    email: 'sarah@skynet.com',
    phone: '+1 (555) 123-4567',
    status: 'Active',
    lastContact: '2023-10-25',
    avatar: 'https://picsum.photos/id/1011/200/200',
    notes: 'Key decision maker for the AI infrastructure project. Interested in scalable solutions.'
  },
  {
    id: 'c2',
    name: 'John Anderson',
    company: 'MetaCortex',
    email: 'neo@metacortex.com',
    phone: '+1 (555) 987-6543',
    status: 'New',
    lastContact: '2023-10-26',
    avatar: 'https://picsum.photos/id/1005/200/200',
    notes: 'Looking for security software updates.'
  },
  {
    id: 'c3',
    name: 'Ellen Ripley',
    company: 'Weyland-Yutani',
    email: 'ripley@weyland.com',
    phone: '+1 (555) 456-7890',
    status: 'Negotiation',
    lastContact: '2023-10-24',
    avatar: 'https://picsum.photos/id/1027/200/200',
    notes: 'Concerns about safety protocols. Needs reassurance on long-term support.'
  },
  {
    id: 'c4',
    name: 'Rick Deckard',
    company: 'Tyrell Corp',
    email: 'deckard@tyrell.com',
    phone: '+1 (555) 222-3333',
    status: 'Inactive',
    lastContact: '2023-09-15',
    avatar: 'https://picsum.photos/id/1012/200/200',
    notes: 'Retired. Might return for specific consulting gigs.'
  },
  {
    id: 'c5',
    name: 'Dana Scully',
    company: 'FBI',
    email: 'scully@fbi.gov',
    phone: '+1 (202) 555-0199',
    status: 'Active',
    lastContact: '2023-10-27',
    avatar: 'https://picsum.photos/id/338/200/200',
    notes: 'Investigating anomalies in our data reporting. Strict compliance requirements.'
  }
];

export const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    title: 'Enterprise AI License',
    value: 150000,
    stage: 'Negotiation',
    contactId: 'c1',
    contactName: 'Sarah Connor',
    expectedCloseDate: '2023-11-15',
    probability: 80
  },
  {
    id: 'd2',
    title: 'Security Audit Q4',
    value: 45000,
    stage: 'Proposal',
    contactId: 'c2',
    contactName: 'John Anderson',
    expectedCloseDate: '2023-11-01',
    probability: 60
  },
  {
    id: 'd3',
    title: 'Fleet Management System',
    value: 850000,
    stage: 'Qualified',
    contactId: 'c3',
    contactName: 'Ellen Ripley',
    expectedCloseDate: '2024-01-20',
    probability: 40
  },
  {
    id: 'd4',
    title: 'Legacy Data Migration',
    value: 25000,
    stage: 'Closed Won',
    contactId: 'c5',
    contactName: 'Dana Scully',
    expectedCloseDate: '2023-10-10',
    probability: 100
  },
  {
    id: 'd5',
    title: 'Cloud Storage Upgrade',
    value: 12000,
    stage: 'Lead',
    contactId: 'c4',
    contactName: 'Rick Deckard',
    expectedCloseDate: '2023-12-05',
    probability: 20
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Prepare contract for Skynet',
    dueDate: '2023-11-10',
    priority: 'High',
    assignedTo: 'Me',
    completed: false,
    relatedTo: 'd1'
  },
  {
    id: 't2',
    title: 'Follow up with Neo',
    dueDate: '2023-10-30',
    priority: 'Medium',
    assignedTo: 'Me',
    completed: false,
    relatedTo: 'c2'
  },
  {
    id: 't3',
    title: 'Quarterly Report Review',
    dueDate: '2023-11-01',
    priority: 'Low',
    assignedTo: 'Team',
    completed: true
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'call',
    description: 'Call with Sarah Connor regarding API limits.',
    timestamp: '2 hours ago',
    user: 'You'
  },
  {
    id: 'a2',
    type: 'email',
    description: 'Sent proposal to John Anderson.',
    timestamp: '5 hours ago',
    user: 'You'
  },
  {
    id: 'a3',
    type: 'meeting',
    description: 'Lunch meeting with Ellen Ripley.',
    timestamp: 'Yesterday',
    user: 'You'
  },
  {
    id: 'a4',
    type: 'note',
    description: 'Updated deal value for Fleet Management.',
    timestamp: '2 days ago',
    user: 'System'
  }
];
