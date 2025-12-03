import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Contacts } from './components/Contacts';
import { Deals } from './components/Deals';
import { Tasks } from './components/Tasks';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { ViewState, User, Contact, Deal, Task } from './types';
import { MOCK_CONTACTS, MOCK_DEALS, MOCK_TASKS, MOCK_ACTIVITIES } from './constants';

// Extended User type for internal mock DB including password
interface MockUser extends User {
  password: string;
}

// Helper to get initial users from localStorage or default
const getInitialUsers = (): MockUser[] => {
  const stored = localStorage.getItem('nexus_users_db');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored users", e);
    }
  }
  return [{
      id: 'u1',
      name: 'Alex Morgan',
      email: 'admin@gmail.com',
      role: 'Sales Director',
      avatar: 'https://picsum.photos/id/64/200/200',
      password: 'admin123'
  }];
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Mock Database of Users (Initialize from LocalStorage if available)
  const [usersDb, setUsersDb] = useState<MockUser[]>(getInitialUsers);

  // Current Logged In User
  const [currentUser, setCurrentUser] = useState<User>(usersDb[0]);
  
  // Data State
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  // 1. Persist Users DB whenever it changes
  useEffect(() => {
    localStorage.setItem('nexus_users_db', JSON.stringify(usersDb));
  }, [usersDb]);

  // 2. Check for Auth Token on Mount (Session Persistence)
  useEffect(() => {
    const token = localStorage.getItem('nexus_auth_token');
    if (token) {
      try {
        // Decode the mock token
        const decoded = JSON.parse(atob(token));
        
        // Check if token is expired
        if (decoded.expiry > Date.now()) {
          const user = usersDb.find(u => u.id === decoded.userId);
          if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            // User not found (maybe DB was cleared), invalid token
            localStorage.removeItem('nexus_auth_token');
          }
        } else {
          // Token expired
          localStorage.removeItem('nexus_auth_token');
        }
      } catch (e) {
        // Invalid token format
        localStorage.removeItem('nexus_auth_token');
      }
    }
  }, []); // Run once on mount. usersDb dependency omitted intentionally as we want initial state check.

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    const userFound = usersDb.find(u => u.email === email && u.password === pass);
    
    if (userFound) {
      // Generate a mock JWT-style token
      const tokenPayload = {
        userId: userFound.id,
        expiry: Date.now() + (24 * 60 * 60 * 1000) // 24 hours from now
      };
      const token = btoa(JSON.stringify(tokenPayload));
      
      // Store token
      localStorage.setItem('nexus_auth_token', token);

      setCurrentUser(userFound);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_auth_token');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  // Settings Handlers
  const handleUpdateProfile = (name: string) => {
    const updatedUser = { ...currentUser, name };
    setCurrentUser(updatedUser);
    
    // Update in DB as well
    setUsersDb(prev => prev.map(u => u.id === currentUser.id ? { ...u, name } : u));
  };

  const handleUpdatePassword = (newPassword: string) => {
    // Update in DB
    setUsersDb(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u));
  };

  const handleCreateAccount = (email: string, password: string): boolean => {
    // Check for duplicates
    if (usersDb.some(u => u.email === email)) {
      return false; 
    }

    const newUser: MockUser = {
      id: Date.now().toString(),
      name: email.split('@')[0], // Default name from email
      email: email,
      role: 'Sales Rep', // Default role
      avatar: `https://ui-avatars.com/api/?background=random&name=${email}`,
      password: password
    };

    setUsersDb(prev => [...prev, newUser]);
    return true;
  };

  // CRUD Handlers for Contacts
  const handleAddContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: Date.now().toString() };
    setContacts(prev => [...prev, newContact]);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // CRUD Handlers for Deals
  const handleAddDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal = { ...deal, id: Date.now().toString() };
    setDeals(prev => [...prev, newDeal]);
  };

  const handleUpdateDeal = (updatedDeal: Deal) => {
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  // CRUD Handlers for Tasks
  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard deals={deals} contacts={contacts} tasks={tasks} activities={activities} />;
      case 'contacts':
        return (
          <Contacts 
            contacts={contacts} 
            onAdd={handleAddContact} 
            onUpdate={handleUpdateContact} 
            onDelete={handleDeleteContact} 
          />
        );
      case 'deals':
        return (
          <Deals 
            deals={deals} 
            onAdd={handleAddDeal} 
            onUpdate={handleUpdateDeal} 
            onDelete={handleDeleteDeal}
          />
        );
      case 'tasks':
        return (
          <Tasks 
            tasks={tasks} 
            onAdd={handleAddTask} 
            onUpdate={handleUpdateTask} 
            onDelete={handleDeleteTask}
          />
        );
      case 'settings':
        return (
          <Settings 
            user={currentUser}
            onUpdateProfile={handleUpdateProfile}
            onUpdatePassword={handleUpdatePassword}
            onCreateAccount={handleCreateAccount}
          />
        );
      default:
        return <Dashboard deals={deals} contacts={contacts} tasks={tasks} activities={activities} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      user={currentUser}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;