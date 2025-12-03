import React, { useState } from 'react';
import { Contact, Status } from '../types';
import { Mail, Phone, Filter, Plus, Sparkles, X, Trash2, Edit2 } from 'lucide-react';
import { draftEmail } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';

interface ContactsProps {
  contacts: Contact[];
  onAdd: (contact: Omit<Contact, 'id'>) => void;
  onUpdate: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const INITIAL_CONTACT: Omit<Contact, 'id'> = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'New',
  lastContact: new Date().toISOString().split('T')[0],
  avatar: `https://ui-avatars.com/api/?background=random&name=New+User`,
  notes: ''
};

export const Contacts: React.FC<ContactsProps> = ({ contacts, onAdd, onUpdate, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // AI Email State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [emailContext, setEmailContext] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  // CRUD Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Contact, 'id'> | Contact>(INITIAL_CONTACT);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Confirmation State
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.company.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDraftEmail = async () => {
    if (!selectedContact) return;
    setIsDrafting(true);
    const draft = await draftEmail(selectedContact.name, emailContext);
    setEmailDraft(draft);
    setIsDrafting(false);
  };

  const openAddModal = () => {
    setFormData(INITIAL_CONTACT);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (contact: Contact) => {
    setFormData(contact);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && 'id' in formData) {
      onUpdate(formData as Contact);
    } else {
      onAdd({ ...formData, avatar: `https://ui-avatars.com/api/?background=random&name=${formData.name}` } as Omit<Contact, 'id'>);
    }
    setShowFormModal(false);
  };

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      onDelete(contactToDelete);
      setContactToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-500 mt-1">Manage your customer relationships.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter contacts..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover" src={contact.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{contact.name}</div>
                        <div className="text-sm text-slate-500">{contact.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contact.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      contact.status === 'Inactive' ? 'bg-slate-100 text-slate-800' :
                      contact.status === 'Negotiation' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 flex items-center mb-1">
                      <Mail className="w-3 h-3 mr-2 text-slate-400" /> {contact.email}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <Phone className="w-3 h-3 mr-2 text-slate-400" /> {contact.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {contact.lastContact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setSelectedContact(contact); setShowEmailModal(true); setEmailDraft(''); setEmailContext(''); }}
                        className="text-blue-600 hover:text-blue-900 flex items-center bg-blue-50 px-2 py-1 rounded"
                        title="Draft Email with AI"
                      >
                        <Sparkles className="w-3 h-3 mr-1" /> AI Draft
                      </button>
                      <button 
                        onClick={() => openEditModal(contact)}
                        className="text-slate-400 hover:text-blue-600 p-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(contact.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={!!contactToDelete}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone and will remove all associated data."
        onConfirm={confirmDelete}
        onCancel={() => setContactToDelete(null)}
      />

      {/* Add/Edit Contact Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Contact' : 'Add Contact'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Status})}
                >
                  <option value="New">New</option>
                  <option value="Active">Active</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Email Modal */}
      {showEmailModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                AI Email Assistant
              </h3>
              <button onClick={() => setShowEmailModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                <div className="text-slate-900 font-medium">{selectedContact.name} ({selectedContact.email})</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What is this email about?</label>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="e.g. Following up on last week's meeting about the Enterprise plan..."
                  value={emailContext}
                  onChange={(e) => setEmailContext(e.target.value)}
                ></textarea>
              </div>

              {emailDraft && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Draft</label>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{emailDraft}</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDraftEmail}
                disabled={isDrafting || !emailContext}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDrafting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};