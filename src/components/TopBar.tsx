/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, Network, UserCircle } from 'lucide-react';

interface TopBarProps {
  jobsTracked?: number;
}

const TopBar: React.FC<TopBarProps> = ({ jobsTracked = 12 }) => {
  return (
    <header className="bg-white border-b border-border z-50 shadow-sm flex justify-between items-center w-full px-8 py-5 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold font-display text-text-main tracking-tight">
          Dashboard <span className="text-text-sub font-normal">Overview</span>
        </h1>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="font-sans text-[11px] font-bold text-green-700 uppercase tracking-wider">Backend Online</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-text-sub mr-4">
          <span className="text-sm font-medium">Alex Chen</span>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-border">
            <UserCircle className="w-5 h-5 text-slate-400" />
          </div>
        </div>
        <button className="text-text-sub hover:text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
