/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Sparkles, 
  Target, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Trophy, 
  ArrowUp, 
  ArrowRight,
  History,
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../lib/utils';

import { applicationService } from '../services/api';
import { Application } from '../types';

const data = [
  { name: 'Mar', value: 30, color: '#e2e8f0' },
  { name: 'Apr', value: 45, color: '#e2e8f0' },
  { name: 'May', value: 40, color: '#e2e8f0' },
  { name: 'Jun', value: 70, color: '#2563eb' },
  { name: 'Jul', value: 90, color: '#22c55e' },
];

const Dashboard: React.FC<{ onAction: (action: string) => void, applications: Application[] }> = ({ onAction, applications: apps }) => {
  const totalApplied = apps.filter(a => ['applied', 'interview', 'offer'].includes(a.status)).length;
  const inInterview = apps.filter(a => a.status === 'interview').length;
  const offers = apps.filter(a => a.status === 'offer').length;
  const avgScore = apps.length > 0 ? Math.round(apps.reduce((acc, a) => acc + (a.matchScore || 0), 0) / apps.length) : 0;

  return (
    <div className="flex-1 flex flex-col gap-8 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      {/* Hero / Quick Actions */}
      <section className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-main mb-2">Good morning, Atimanas.</h2>
          <p className="text-text-sub text-sm md:text-base max-w-xl">
            Here is your current progress. We've identified {apps.filter(a => (a.matchScore || 0) > 80).length} high-probability matches based on your latest ATS scan.
          </p>
        </motion.div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button 
            onClick={() => onAction('job-finder')}
            className="bg-primary text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:bg-primary-dark transition-all"
          >
            <Search className="w-4 h-4" />
            Search Jobs
          </button>
          <button 
            onClick={() => onAction('resume-labs')}
            className="bg-white border border-border text-text-main font-semibold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Tailor Resume
          </button>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Stats & Chart */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard 
              title="Total Applied" 
              value={totalApplied.toString().padStart(2, '0')} 
              trend="+12%" 
              icon={Send} 
              themeColor="blue" 
            />
            <StatCard 
              title="Interviews" 
              value={inInterview.toString().padStart(2, '0')} 
              trend="+2%" 
              icon={MessageSquare} 
              themeColor="green" 
            />
            <StatCard 
              title="Avg ATS Score" 
              value={avgScore.toString()} 
              suffix="/100"
              progress={avgScore}
              icon={CheckCircle2} 
              themeColor="amber" 
            />
            <StatCard 
              title="Active Offers" 
              value={offers.toString().padStart(2, '0')} 
              trend={offers > 0 ? "ACTION READY" : "IN PROGRESS"} 
              icon={Trophy} 
              themeColor="purple" 
              pulseTrend={offers > 0}
            />
          </div>

          {/* Trajectory Section */}
          <section className="bg-white border border-border rounded-xl p-6 lg:p-8 flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold text-text-main">Application Trajectory</h3>
              <button className="text-primary hover:underline font-sans text-xs font-bold uppercase flex items-center gap-1 transition-colors">
                View Full Report <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="h-[250px] w-full bg-slate-50/50 rounded-lg p-4 border border-border">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column: System Log */}
        <aside className="xl:col-span-1">
          <div className="bg-white border border-border rounded-xl h-full flex flex-col p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold text-text-main">Recent Activity</h3>
              <History className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <LogItem 
                time="JUST NOW" 
                title="Stripe - Product Designer" 
                desc="Application moved to INTERVIEW stage." 
                type="success"
              />
              <LogItem 
                time="2 HOURS AGO" 
                title="Resume Tailored: Vercel" 
                desc="ATS match score increased from 62 to 88." 
                type="ai"
              />
              <LogItem 
                time="2 DAYS AGO" 
                title="Action Required: Meta" 
                desc="Complete technical assessment by Friday." 
                type="warning"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  suffix?: string;
  icon: any;
  themeColor: 'blue' | 'green' | 'amber' | 'purple';
  progress?: number;
  pulseTrend?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, suffix, icon: Icon, themeColor, progress, pulseTrend }) => {
  const colorMap = {
    blue: 'text-primary',
    green: 'text-success',
    amber: 'text-orange-500',
    purple: 'text-purple-600',
  };

  const bgMap = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    amber: 'bg-orange-50',
    purple: 'bg-purple-50',
  };

  return (
    <div className="bg-white border border-border rounded-xl p-6 relative overflow-hidden group transition-all hover:shadow-md">
      <div className={cn("absolute right-4 top-4 p-2 rounded-lg transition-transform group-hover:scale-110", bgMap[themeColor])}>
        <Icon className={cn("w-5 h-5", colorMap[themeColor])} />
      </div>
      <h3 className="font-sans text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="font-display text-4xl font-bold text-text-main leading-none">{value}</span>
        {suffix && <span className="text-text-sub font-sans text-sm mb-1">{suffix}</span>}
      </div>
      {trend && (
        <div className={cn(
          "text-[10px] font-bold flex items-center mt-3",
          colorMap[themeColor],
          pulseTrend && "animate-pulse"
        )}>
          {!pulseTrend && <ArrowUp className="w-3 h-3 mr-1" />}
          {trend}
        </div>
      )}
      {progress !== undefined && (
        <div className="w-full h-1 bg-slate-100 mt-4 rounded-full overflow-hidden border border-slate-200 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={cn("h-full rounded-full", themeColor === 'amber' ? 'bg-orange-500' : 'bg-primary')} 
          />
        </div>
      )}
    </div>
  );
};

const LogItem: React.FC<{ time: string, title: string, desc: string, type: string }> = ({ time, title, desc, type }) => {
  const icons = {
    success: { icon: CheckCircle2, color: 'text-success', bg: 'bg-green-50', border: 'border-green-100' },
    ai: { icon: Sparkles, color: 'text-primary', bg: 'bg-blue-50', border: 'border-blue-100' },
    warning: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    info: { icon: Bookmark, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' },
    default: { icon: Send, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' },
  };

  const { icon: Icon, color, bg, border } = icons[type as keyof typeof icons] || icons.default;

  return (
    <div className="relative pl-8 pb-6 last:pb-0 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-100">
      <div className={cn(
        "absolute left-0 top-0 w-6 h-6 rounded-lg flex items-center justify-center z-10 border shadow-sm",
        bg,
        border
      )}>
        <Icon className={cn("w-3 h-3", color)} />
      </div>
      <p className="font-sans text-[10px] font-bold text-slate-300 mb-1 uppercase tracking-wider">{time}</p>
      <p className="text-xs font-bold text-text-main line-clamp-1">{title}</p>
      <p className="text-xs text-text-sub mt-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: desc.replace(/(INTERVIEW)/g, '<span class="text-success font-bold">$1</span>') }} />
    </div>
  );
};

export default Dashboard;
