import React, { useState } from 'react';
import { Deal } from '../types';
import { Plus, MoreVertical, DollarSign, Calendar, Sparkles, X, Edit2, Trash2 } from 'lucide-react';
import { analyzeDeal } from '../services/geminiService';
import { ConfirmationModal } from './ConfirmationModal';

interface DealsProps {
  deals: Deal[];
  onAdd: (deal: Omit<Deal, 'id'>) => void;
  onUpdate: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

const INITIAL_DEAL: Omit<Deal, 'id'> = {
  title: '',
  value: 0,
  stage: 'Lead',
  contactId: '',
  contactName: '',
  expectedCloseDate: new Date().toISOString().split('T')[0],
  probability: 50
};

export const Deals: React.FC<DealsProps> = ({ deals, onAdd, onUpdate, onDelete }) => {
  const [analyzingDealId, setAnalyzingDealId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // CRUD State
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Deal, 'id'> | Deal>(INITIAL_DEAL);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Confirmation State
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);

  const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'] as const;

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'Lead': return 'border-blue-500';
      case 'Qualified': return 'border-indigo-500';
      case 'Proposal': return 'border-violet-500';
      case 'Negotiation': return 'border-amber-500';
      case 'Closed Won': return 'border-emerald-500';
      default: return 'border-slate-300';
    }
  };

  const handleAnalyze = async (deal: Deal) => {
    setAnalyzingDealId(deal.id);
    setIsAnalysisModalOpen(true);
    setAnalysisResult(null); // Clear previous
    
    // Create a rich context string for the AI
    const dealContext = `
      Deal Title: ${deal.title}
      Value: $${deal.value}
      Stage: ${deal.stage}
      Contact: ${deal.contactName}
      Expected Close: ${deal.expectedCloseDate}
      Current Probability: ${deal.probability}%
    `;

    const result = await analyzeDeal(dealContext);
    setAnalysisResult(result);
    setAnalyzingDealId(null);
  };

  const openAddModal = () => {
    setFormData(INITIAL_DEAL);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (deal: Deal) => {
    setFormData(deal);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && 'id' in formData) {
      onUpdate(formData as Deal);
    } else {
      onAdd(formData as Omit<Deal, 'id'>);
    }
    setShowFormModal(false);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDealToDelete(id);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      onDelete(dealToDelete);
      setDealToDelete(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Deals Pipeline</h1>
          <p className="text-slate-500 mt-1">Track your opportunities.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-6 min-w-max pb-4 h-full">
          {stages.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div key={stage} className="w-80 flex flex-col bg-slate-100/50 rounded-xl p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">{stage}</h3>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded-full text-slate-500 border border-slate-200">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mb-4 font-medium">
                  Total: ${(stageValue / 1000).toFixed(1)}k
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                  {stageDeals.map((deal) => (
                    <div 
                      key={deal.id} 
                      onClick={() => openEditModal(deal)}
                      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getStageColor(deal.stage)} hover:shadow-md transition-shadow cursor-pointer group relative`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800 text-sm truncate pr-6">{deal.title}</h4>
                        <div className="absolute top-2 right-2 hidden group-hover:flex bg-white shadow-sm rounded-md border border-slate-100">
                           <button 
                              onClick={(e) => handleDeleteClick(deal.id, e)}
                              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete Deal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-slate-500 mb-3">{deal.contactName}</div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-3">
                        <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                          <DollarSign className="w-3 h-3 mr-1 text-slate-400" />
                          {deal.value.toLocaleString()}
                        </span>
                        <span className="flex items-center bg-slate-50 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {new Date(deal.expectedCloseDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="text-xs font-medium text-slate-400">
                           Prob: <span className={`${deal.probability > 70 ? 'text-green-600' : 'text-slate-600'}`}>{deal.probability}%</span>
                        </div>
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAnalyze(deal); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-1.5 rounded-md"
                          title="Ask AI for Insights"
                        >
                          <Sparkles className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={!!dealToDelete}
        title="Delete Deal"
        message="Are you sure you want to delete this deal? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDealToDelete(null)}
      />

      {/* Add/Edit Deal Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Deal' : 'Add Deal'}</h3>
              <button onClick={() => setShowFormModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Value ($)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseInt(e.target.value) || 0})}
                  />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Probability (%)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    max="100"
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.probability}
                    onChange={(e) => setFormData({...formData, probability: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.stage}
                  onChange={(e) => setFormData({...formData, stage: e.target.value as any})}
                >
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Expected Close Date</label>
                <input 
                  type="date" 
                  required 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {isAnalysisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
                Gemini Deal Analysis
              </h3>
              <button onClick={() => setIsAnalysisModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!analysisResult ? (
                 <div className="flex flex-col items-center justify-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                   <p className="text-slate-500 text-sm">Analyzing deal probability and risks...</p>
                 </div>
              ) : (
                <div className="prose prose-sm prose-indigo max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700">{analysisResult}</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsAnalysisModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};