export type Status = 'Active' | 'Inactive' | 'Pending' | 'New' | 'Qualified' | 'Negotiation' | 'Won' | 'Lost';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  lastContact: string;
  avatar: string;
  notes?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won';
  contactId: string;
  contactName: string;
  expectedCloseDate: string;
  probability: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  completed: boolean;
  relatedTo?: string; // e.g., Deal ID or Contact ID
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  timestamp: string;
  user: string;
}

export type ViewState = 'dashboard' | 'contacts' | 'deals' | 'tasks' | 'settings';
