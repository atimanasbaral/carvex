/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  History, 
  Lightbulb, 
  ArrowRight, 
  Calendar, 
  MoreHorizontal, 
  Video, 
  PartyPopper,
  Archive,
  Loader2,
  AlertCircle,
  X,
  Save,
  Edit3,
  Clock,
  AlignLeft,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { applicationService } from '../services/api';
import { Application } from '../types';
import { cn } from '../lib/utils';

const Pipeline: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savingApp, setSavingApp] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getApplications();
      setApplications(data);
    } catch (err) {
      setError('System pulse interrupted. Could not retrieve application pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewApp = () => {
    const newApp: Application = {
      id: `temp-${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      status: 'saved',
      matchScore: 0,
      appliedDate: new Date().toISOString().split('T')[0],
      notes: '',
      deadline: ''
    };
    setSelectedApp(newApp);
    setIsEditModalOpen(true);
  };

  const handleUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    setSavingApp(true);
    try {
      if (selectedApp.id.startsWith('temp-')) {
        // Create new
        const { id, ...payload } = selectedApp;
        await applicationService.addApplication(payload);
      } else {
        // Update existing
        await applicationService.updateApplication(selectedApp.id, selectedApp);
      }
      await fetchApplications(); // Refresh list
      setIsEditModalOpen(false);
      setSelectedApp(null);
    } catch (err) {
      console.error('Failed to save application');
    } finally {
      setSavingApp(false);
    }
  };

  const columns = [
    { id: 'saved', label: 'Saved', color: 'bg-primary' },
    { id: 'applied', label: 'Applied', color: 'bg-orange-500' },
    { id: 'interview', label: 'Interviewing', color: 'bg-success' },
    { id: 'offer', label: 'Offer Received', color: 'bg-purple-500' },
    { id: 'archived', label: 'Archived', color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-mono text-xs uppercase tracking-widest text-slate-400">Syncing Application Pulse...</p>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 opacity-40 shrink-0" />
        <div>
          <h3 className="font-display text-2xl font-bold mb-2 text-text-main">Interface Offline</h3>
          <p className="text-text-sub font-body">The local career database service did not respond. Please ensure the project services are initialized.</p>
        </div>
        <button 
          onClick={fetchApplications}
          className="px-8 py-3 bg-white border border-border rounded-xl text-primary font-sans text-xs font-bold uppercase tracking-widest hover:bg-slate-50 shadow-sm transition-all"
        >
          Re-Initialize Connection
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 px-2 shrink-0 max-w-7xl w-full mx-auto">
        <div className="flex flex-col space-y-1">
          <h1 className="font-display text-3xl font-bold text-text-main tracking-tight">Application Pipeline</h1>
          <p className="font-body text-text-sub text-sm">Visualizing your career trajectory and stage progress.</p>
        </div>
        <button 
          onClick={handleAddNewApp}
          className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Add Application
        </button>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl w-full mx-auto px-2 mb-8 flex flex-wrap gap-2">
        <button 
          onClick={() => setStatusFilter('all')}
          className={cn(
            "px-4 py-2 rounded-lg font-sans text-[11px] font-bold uppercase tracking-wider transition-all",
            statusFilter === 'all' 
              ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
              : "bg-white text-slate-400 border border-border hover:bg-slate-50"
          )}
        >
          All Stages
        </button>
        {columns.map(col => (
          <button 
            key={col.id}
            onClick={() => setStatusFilter(col.id)}
            className={cn(
              "px-4 py-2 rounded-lg font-sans text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-2",
              statusFilter === col.id 
                ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                : "bg-white text-slate-400 border border-border hover:bg-slate-50"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", col.color)} />
            {col.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-x-auto flex pb-20">
        <div className="flex h-full gap-6 min-w-max mx-auto px-2">
          {columns.filter(c => statusFilter === 'all' || statusFilter === c.id).map((col) => {
          const colApps = applications.filter(app => app.status === col.id);
          return (
            <div key={col.id} className="w-80 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="font-display text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <span className={cn("w-2 h-2 rounded-full", col.color)} />
                  {col.label}
                </h3>
                <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {colApps.length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {colApps.map((app) => (
                  <KanbanCard 
                    key={app.id} 
                    application={app} 
                    onClick={() => {
                      setSelectedApp({...app});
                      setIsEditModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-xl h-full rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-white">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border flex items-center justify-center font-bold text-slate-500 text-lg shrink-0">
                    {selectedApp.company ? selectedApp.company.charAt(0) : '?'}
                  </div>
                  <div className="flex-1 space-y-1">
                    {selectedApp.id.startsWith('temp-') ? (
                      <div className="space-y-2">
                        <input 
                          value={selectedApp.jobTitle}
                          onChange={(e) => setSelectedApp({...selectedApp, jobTitle: e.target.value})}
                          placeholder="Job Title (e.g. Senior Backend Engineer)"
                          className="w-full font-display text-lg font-bold text-text-main border-none p-0 focus:ring-0 placeholder:text-slate-300"
                        />
                        <input 
                          value={selectedApp.company}
                          onChange={(e) => setSelectedApp({...selectedApp, company: e.target.value})}
                          placeholder="Company Name"
                          className="w-full text-text-sub text-sm font-medium border-none p-0 focus:ring-0 placeholder:text-slate-300"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="font-display text-xl font-bold text-text-main line-clamp-1">{selectedApp.jobTitle}</h2>
                        <p className="text-text-sub text-sm font-medium">{selectedApp.company}</p>
                      </>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleUpdateApp} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Manual Fields for Temp Apps */}
                {selectedApp.id.startsWith('temp-') && (
                  <div className="space-y-3">
                    <label className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      Location
                    </label>
                    <input 
                      value={selectedApp.location}
                      onChange={(e) => setSelectedApp({...selectedApp, location: e.target.value})}
                      placeholder="e.g. Remote, NYC, London"
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 font-sans text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
                    />
                  </div>
                )}

                {/* Status Selection */}
                <div className="space-y-3">
                  <label className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    Pipeline Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {columns.map(col => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedApp({...selectedApp, status: col.id as any})}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1",
                          selectedApp.status === col.id 
                            ? cn("border-transparent text-white shadow-sm", col.color)
                            : "bg-white border-border text-slate-500 hover:border-slate-300"
                        )}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Applied Date */}
                  <div className="space-y-3">
                    <label className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied Date
                    </label>
                    <input 
                      type="date"
                      value={selectedApp.appliedDate}
                      onChange={(e) => setSelectedApp({...selectedApp, appliedDate: e.target.value})}
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 font-sans text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {/* Deadline Date */}
                  <div className="space-y-3">
                    <label className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 text-orange-500">
                      <Clock className="w-3.5 h-3.5" />
                      Application Deadline
                    </label>
                    <input 
                      type="date"
                      value={selectedApp.deadline || ''}
                      onChange={(e) => setSelectedApp({...selectedApp, deadline: e.target.value})}
                      className="w-full bg-slate-50 border border-border rounded-lg px-4 py-2.5 font-sans text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                  <label className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5" />
                    Application Notes
                  </label>
                  <textarea 
                    value={selectedApp.notes || ''}
                    onChange={(e) => setSelectedApp({...selectedApp, notes: e.target.value})}
                    placeholder="Strategic takeaways, networking contacts, or interview prep notes..."
                    className="w-full h-48 bg-slate-50 border border-border rounded-lg p-4 font-sans text-sm resize-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none custom-scrollbar"
                  />
                </div>
              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border bg-white flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg font-sans text-xs font-bold text-slate-400 hover:text-text-main transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateApp}
                  disabled={savingApp}
                  className="px-8 py-2.5 rounded-lg bg-slate-900 text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-black shadow-lg shadow-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {savingApp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Updates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Coach Tip */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-30 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-white border border-border rounded-xl p-4 flex items-center gap-4 shadow-lg pointer-events-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h5 className="font-display font-bold text-text-main text-sm">Action Suggestion</h5>
            <p className="font-body text-xs text-text-sub">
              Your match for <strong className="text-text-main">Lead Designer at Stripe</strong> is 92%. A follow-up is recommended.
            </p>
          </div>
          <button className="shrink-0 px-4 py-2 rounded-lg bg-slate-900 text-white font-sans text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-2">
            Details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </main>
  );
};

const KanbanCard: React.FC<{ application: Application, onClick?: () => void }> = ({ application: app, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onClick}
      className="bg-white border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all cursor-pointer"
    >
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-[4px]",
        app.status === 'saved' ? 'bg-primary' :
        app.status === 'applied' ? 'bg-orange-500' :
        app.status === 'interview' ? 'bg-success' :
        app.status === 'offer' ? 'bg-purple-500' :
        'bg-red-500'
      )} />
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-border flex items-center justify-center font-bold text-slate-500 text-sm">
          {app.companyLogo ? (
            <img src={app.companyLogo} alt={app.company} className="w-6 h-6 object-contain" />
          ) : (
            app.company.charAt(0)
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-sans text-[10px] font-bold text-success bg-green-50 px-2.5 py-1 rounded-full border border-green-100 uppercase tracking-tight">
            {app.matchScore}% Match
          </span>
          {app.deadline && (
            <span className="font-sans text-[9px] font-bold text-orange-500 italic">
              Due: {app.deadline}
            </span>
          )}
        </div>
      </div>

      <h4 className="font-display text-sm font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{app.jobTitle}</h4>
      <p className="font-sans text-xs text-text-sub mb-4">{app.company} • {app.location}</p>
      
      {app.nextStep && (
        <div className="mt-2 mb-4 p-2.5 bg-slate-50 rounded-lg flex items-center gap-2 text-[11px] font-medium border border-border">
           {app.status === 'interview' ? <Video className="w-3.5 h-3.5 text-primary" /> : <Calendar className="w-3.5 h-3.5 text-primary" />}
           <span className="text-text-main">{app.nextStep}</span>
           {app.nextStepTime && <span className="text-text-sub ml-auto text-[10px]"> {app.nextStepTime}</span>}
        </div>
      )}

      {app.notes && (
        <p className="text-[10px] text-text-sub italic line-clamp-2 mb-4 px-1">
          "{app.notes}"
        </p>
      )}

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" /> {app.appliedDate}
        </span>
        <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
      </div>
    </motion.div>
  );
};

export default Pipeline;
