/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import JobFinder from './components/JobFinder';
import ResumeLabs from './components/ResumeLabs';
import Pipeline from './components/Pipeline';
import ATSAnalytics from './components/ATSAnalytics';
import ResumeManager from './components/ResumeManager';
import Login from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { applicationService } from './services/api';
import { Application } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJobDescription, setSelectedJobDescription] = useState<string>('');
  const [apps, setApps] = useState<Application[]>([]);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    // Check if user is already "logged in" from session (simple mock)
    const savedUser = localStorage.getItem('career_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      applicationService.getApplications().then(setApps).catch(() => {});
    }
  }, [user]);

  const handleLogin = (userData: {name: string, email: string}) => {
    setUser(userData);
    localStorage.setItem('career_user', JSON.stringify(userData));
  };

  const handleTailorJob = (description: string) => {
    setSelectedJobDescription(description);
    setActiveTab('resume-labs');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Dashboard onAction={setActiveTab} applications={apps} />;
      case 'job-finder':
        return <JobFinder onTailor={handleTailorJob} />;
      case 'ats-analytics':
        return <ATSAnalytics />;
      case 'resume-labs':
        return <ResumeLabs initialJobDescription={selectedJobDescription} />;
      case 'pipeline':
        return <Pipeline />;
      case 'resume-manager':
        return <ResumeManager />;
      default:
        return <Dashboard onAction={setActiveTab} applications={apps} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <TopBar jobsTracked={apps.length} />
        
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
