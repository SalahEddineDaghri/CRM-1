import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, Calendar, User, Flag, Plus, Edit2, Trash2, X } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

interface TasksProps {
  tasks: Task[];
  onAdd: (task: Omit<Task, 'id'>) => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const INITIAL_TASK: Omit<Task, 'id'> = {
  title: '',
  dueDate: new Date().toISOString().split('T')[0],
  priority: 'Medium',
  assignedTo: 'Me',
  completed: false,
  relatedTo: ''
};

export const Tasks: React.FC<TasksProps> = ({ tasks, onAdd, onUpdate, onDelete }) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Task, 'id'> | Task>(INITIAL_TASK);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Confirmation State
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const openAddModal = () => {
    setFormData(INITIAL_TASK);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const openEditModal = (task: Task) => {
    setFormData(task);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && 'id' in formData) {
      onUpdate(formData as Task);
    } else {
      onAdd(formData as Omit<Task, 'id'>);
    }
    setShowFormModal(false);
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTaskToDelete(id);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      onDelete(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const toggleComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...task, completed: !task.completed });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500 mt-1">Stay on top of your to-do list.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => openEditModal(task)}
              className="p-4 sm:p-6 flex items-start group hover:bg-slate-50 transition-colors cursor-pointer relative"
            >
              <button 
                onClick={(e) => toggleComplete(task, e)}
                className={`mt-1 flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-slate-300 hover:text-blue-500'}`}
              >
                {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between pr-8">
                  <h4 className={`text-sm font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {task.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {task.assignedTo}
                  </div>
                  {task.relatedTo && (
                     <div className="flex items-center text-blue-600">
                       <Flag className="w-3 h-3 mr-1" />
                       Related
                     </div>
                  )}
                </div>
              </div>
              
              <div className="absolute right-4 top-4 hidden group-hover:flex items-center space-x-2">
                <button 
                  onClick={(e) => handleDeleteClick(task.id, e)}
                  className="p-1 text-slate-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              No tasks found. Create one to get started!
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={!!taskToDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

       {/* Add/Edit Task Modal */}
       {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">{isEditing ? 'Edit Task' : 'Add Task'}</h3>
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
                   <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select 
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Related To (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Deal or Contact Name"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.relatedTo || ''}
                  onChange={(e) => setFormData({...formData, relatedTo: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowFormModal(false)} className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};