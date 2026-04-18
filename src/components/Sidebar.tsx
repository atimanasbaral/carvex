/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  FileText, 
  Kanban, 
  Settings, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'job-finder', label: 'Job Finder', icon: Search },
    { id: 'ats-analytics', label: 'ATS Analytics', icon: BarChart3 },
    { id: 'resume-labs', label: 'Resume Labs', icon: FileText },
    { id: 'resume-manager', label: 'Resume Repository', icon: Settings },
    { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  ];

  return (
    <nav className="hidden md:flex bg-slate-900 h-screen w-64 shadow-2xl flex-col py-8 shrink-0 relative z-40">
      <div className="px-8 mb-12">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
             <span className="material-symbols-outlined text-white text-base">robot_2</span>
          </div>
          <p className="text-xl font-display font-bold text-white tracking-tight">Career<span className="text-primary-dark">Agent</span></p>
        </div>
      </div>
      
      <div className="flex-1 space-y-1.5 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center w-full px-5 py-3 rounded-lg transition-all duration-300 text-sm font-semibold",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/10" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className={cn("mr-4 w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto space-y-1.5 px-4 pt-8 border-t border-slate-800">
        <button className="flex items-center w-full px-5 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <Settings className="mr-4 w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
        <button className="flex items-center w-full px-5 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
          <HelpCircle className="mr-4 w-4 h-4 text-slate-500" />
          <span>Support Center</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
