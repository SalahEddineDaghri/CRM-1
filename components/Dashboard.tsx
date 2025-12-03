import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import * as XLSX from 'xlsx';
import { Activity, Deal, Contact, Task } from '../types';
import { ArrowUpRight, DollarSign, Users, Briefcase, Activity as ActivityIcon, CheckSquare, Download } from 'lucide-react';

interface DashboardProps {
  deals: Deal[];
  contacts: Contact[];
  tasks: Task[];
  activities: Activity[];
}

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className="text-emerald-500 font-medium flex items-center">
        <ArrowUpRight className="w-4 h-4 mr-1" />
        {change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ deals, contacts, tasks, activities }) => {
  const totalPipelineValue = deals.reduce((acc, deal) => acc + deal.value, 0);
  const activeContacts = contacts.filter(c => c.status === 'Active').length;
  
  const data = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  const dealStagesData = [
    { name: 'Lead', count: deals.filter(d => d.stage === 'Lead').length },
    { name: 'Qualified', count: deals.filter(d => d.stage === 'Qualified').length },
    { name: 'Proposal', count: deals.filter(d => d.stage === 'Proposal').length },
    { name: 'Negotiation', count: deals.filter(d => d.stage === 'Negotiation').length },
    { name: 'Won', count: deals.filter(d => d.stage === 'Closed Won').length },
  ];

  const handleGenerateReport = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheets
    const wsContacts = XLSX.utils.json_to_sheet(contacts);
    const wsDeals = XLSX.utils.json_to_sheet(deals);
    const wsTasks = XLSX.utils.json_to_sheet(tasks);
    const wsActivities = XLSX.utils.json_to_sheet(activities);

    // Append worksheets to workbook
    XLSX.utils.book_append_sheet(wb, wsContacts, "Contacts");
    XLSX.utils.book_append_sheet(wb, wsDeals, "Deals");
    XLSX.utils.book_append_sheet(wb, wsTasks, "Tasks");
    XLSX.utils.book_append_sheet(wb, wsActivities, "Activity Log");

    // Generate filename with date
    const date = new Date().toISOString().split('T')[0];
    const fileName = `NexusCRM_Report_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your sales performance.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={handleGenerateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pipeline" 
          value={`$${(totalPipelineValue / 1000).toFixed(1)}k`} 
          change="+12.5%" 
          icon={DollarSign} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Contacts" 
          value={activeContacts} 
          change="+4.3%" 
          icon={Users} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Open Deals" 
          value={deals.filter(d => d.stage !== 'Closed Won').length} 
          change="+2.1%" 
          icon={Briefcase} 
          color="bg-violet-500" 
        />
        <StatCard 
          title="Activities" 
          value={activities.length} 
          change="+8.4%" 
          icon={ActivityIcon} 
          color="bg-emerald-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Deals by Stage</h3>
          <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dealStagesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 flex items-start space-x-4 hover:bg-slate-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'call' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'meeting' ? 'bg-orange-100 text-orange-600' :
                'bg-slate-100 text-slate-600'
              }`}>
                {activity.type === 'call' && <ActivityIcon className="w-5 h-5" />}
                {activity.type === 'email' && <Users className="w-5 h-5" />}
                {activity.type === 'meeting' && <Briefcase className="w-5 h-5" />}
                {activity.type === 'note' && <CheckSquare className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.timestamp} • {activity.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};