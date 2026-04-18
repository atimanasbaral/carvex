/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Radar, 
  Settings2, 
  Hammer, 
  BookmarkPlus,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { jobService, applicationService } from '../services/api';
import { Job } from '../types';
import { cn } from '../lib/utils';

interface JobFinderProps {
  onTailor?: (description: string) => void;
}

const JobFinder: React.FC<JobFinderProps> = ({ onTailor }) => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!role && !location) return;
    setLoading(true);
    setError(null);
    try {
      const results = await jobService.searchJobs(role, location);
      setJobs(results);
    } catch (err) {
      setError('Backend communication failed. Please ensure the system services are online.');
    } finally {
      setLoading(false);
    }
  };

  const presets = ['Data Engineer', 'ML Engineer', 'Quant Analyst', 'Quant Developer'];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 z-10 relative custom-scrollbar bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8 mb-12">
        <div className="flex flex-col space-y-1">
          <h1 className="font-display text-3xl font-bold text-text-main tracking-tight">Job Matrix</h1>
          <p className="font-body text-text-sub text-sm">Targeting global opportunities based on your profile.</p>
        </div>

        {/* Search Panel */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-sub px-1">Target Role</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white text-text-main border border-border rounded-lg py-3 pl-12 pr-4 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="Senior Software Engineer..."
                type="text"
              />
            </div>
          </div>
          <div className="w-full md:w-64 space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-sub px-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white text-text-main border border-border rounded-lg py-3 pl-12 pr-4 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="Remote, NYC..."
                type="text"
              />
            </div>
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto bg-primary text-white font-bold py-3 px-10 rounded-lg shadow-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 h-[46px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
            Search
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button 
              key={preset}
              onClick={() => {
                setRole(preset);
              }}
              className={cn(
                "px-4 py-1.5 rounded-full font-sans text-xs font-medium transition-all",
                role === preset 
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-text-sub border border-border hover:border-primary hover:text-primary shadow-sm"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="max-w-7xl mx-auto glass-card border-red-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
          <h3 className="font-display text-xl font-bold text-on-surface">System Error: Backend Unreachable</h3>
          <p className="text-on-surface-variant max-w-md">{error}</p>
          <button 
            onClick={handleSearch}
            className="text-primary font-mono text-xs uppercase tracking-widest hover:underline"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <JobCard key={job.id} job={job} index={idx} onTailor={onTailor} />
            ))
          ) : !loading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-outline/40">
              <Radar className="w-16 h-16 mb-4 animate-[pulse_2s_infinite]" />
              <p className="font-mono text-xs uppercase tracking-[0.2em]">Awaiting parameters for global scan...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const JobCard: React.FC<{ job: Job, index: number, onTailor?: (desc: string) => void }> = ({ job, index, onTailor }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await applicationService.addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        status: 'saved',
        matchScore: job.matchScore,
        appliedDate: new Date().toISOString().split('T')[0]
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleTailorClick = () => {
    if (onTailor) {
      onTailor(`Role: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary}\nDescription: We are looking for a ${job.title} to join our team at ${job.company}.`);
    }
  };

  const scoreColor = job.matchScore > 80 ? 'text-success' : job.matchScore > 60 ? 'text-orange-500' : 'text-red-500';
  const progressRingColor = job.matchScore > 80 ? 'text-success' : job.matchScore > 60 ? 'text-orange-400' : 'text-red-400';
  
  // Custom progress ring calculation
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (job.matchScore / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-border rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-all"
    >
      <div className={cn("absolute top-0 left-0 w-full h-[3px]", 
        job.matchScore > 80 ? 'bg-success' : job.matchScore > 60 ? 'bg-orange-500' : 'bg-red-500'
      )} />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{job.company}</p>
          <h3 className="font-display text-lg font-bold text-text-main line-clamp-1 group-hover:text-primary transition-colors">{job.title}</h3>
        </div>
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle className="text-slate-100" cx="18" cy="18" fill="none" r={radius} stroke="currentColor" strokeWidth="3" />
            <circle 
              className={progressRingColor} 
              cx="18" cy="18" 
              fill="none" 
              r={radius} 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeWidth="3" 
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <span className="absolute font-sans text-[10px] font-bold text-text-main">{job.matchScore}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center text-xs font-medium text-text-sub">
          <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
          {job.location}
        </div>
        <div className="flex items-center text-xs font-medium text-text-sub">
          <div className="w-3.5 h-3.5 mr-2 text-slate-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[16px]">payments</span>
          </div>
          {job.salary}
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <button 
          onClick={handleTailorClick}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-text-main font-sans text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Hammer className="w-3.5 h-3.5" />
          Tailor
        </button>
        <button 
          onClick={handleSave}
          disabled={saving || saved}
          className={cn(
            "px-3 rounded-lg transition-all flex items-center justify-center border",
            saved 
              ? "bg-green-50 border-green-200 text-green-600" 
              : "bg-white border-border text-slate-400 hover:text-primary hover:border-primary"
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <BookmarkPlus className="w-4 h-4" />}
        </button>
      </div>
    </motion.div>
  );
};

export default JobFinder;
