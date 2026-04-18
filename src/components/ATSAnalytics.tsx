/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  CheckCircle2, 
  Plus, 
  Wand2, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const ATSAnalytics: React.FC = () => {
  // Mock data for the detailed view
  const result = {
    score: 73,
    title: "Senior Frontend Developer",
    matchedKeywords: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'GraphQL', 'CI/CD'],
    missingKeywords: ['Docker', 'AWS', 'Microservices', 'System Design'],
    categoryBreakdown: {
      skills: 80,
      experience: 65,
      education: 90
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10 custom-scrollbar max-w-7xl mx-auto w-full bg-slate-50">
      <div className="flex flex-col space-y-1">
        <h1 className="font-display text-2xl font-bold text-text-main tracking-tight">Competency Assessment</h1>
        <p className="font-body text-text-sub text-sm">Quantifying your profile suitability for target roles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Top Section: Score Dial & High-Level Metrics */}
        <div className="col-span-1 bg-white border border-border rounded-xl p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full">
              <circle className="text-slate-100" cx="112" cy="112" fill="transparent" r="100" stroke="currentColor" strokeWidth="6" />
              <motion.circle 
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * result.score / 100) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary" 
                cx="112" cy="112" 
                fill="transparent" 
                r="100" 
                stroke="currentColor" 
                strokeDasharray="628" 
                strokeLinecap="round" 
                strokeWidth="6" 
              />
            </svg>
            <div className="text-center absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-sans text-6xl font-black text-text-main">{result.score}</span>
              <span className="font-sans text-xs text-text-sub font-bold uppercase tracking-widest">Score / 100</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="font-display text-xl font-bold text-text-main">Strong Candidate</h2>
            <p className="font-body text-xs text-text-sub mt-2 font-medium">Relevance for {result.title}</p>
          </div>
        </div>

        {/* Section Progress Bars */}
        <div className="col-span-1 lg:col-span-2 space-y-8 bg-white border border-border rounded-xl p-8 h-full flex flex-col justify-center shadow-sm">
          <h3 className="font-display text-lg font-bold text-text-main mb-2 uppercase tracking-tight">Factor Breakdown</h3>
          
          <ProgressBar label="Technical Skills" progress={result.categoryBreakdown.skills} color="bg-primary" textColor="text-primary" />
          <ProgressBar label="Domain Experience" progress={result.categoryBreakdown.experience} color="bg-orange-500" textColor="text-orange-600" />
          <ProgressBar label="Qualifications" progress={result.categoryBreakdown.education} color="bg-success" textColor="text-success" />
          
          <div className="pt-6">
            <button className="w-full bg-slate-900 hover:bg-black text-white font-sans text-xs font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4" />
              Analyze Structural Gaps
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Matched Keywords */}
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm border-l-4 border-l-success flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="text-success w-5 h-5" />
              <h3 className="font-display text-base font-bold text-text-main">Keywords Detected</h3>
            </div>
            <span className="font-mono text-[10px] bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 font-bold uppercase">
              {result.matchedKeywords.length} Found
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matchedKeywords.map(kw => (
              <span key={kw} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 font-sans text-xs font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm border-l-4 border-l-red-500 flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <XCircle className="text-red-500 w-5 h-5" />
              <h3 className="font-display text-base font-bold text-text-main">Identified Gaps</h3>
            </div>
            <span className="font-mono text-[10px] bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 font-bold uppercase">
              {result.missingKeywords.length} Missing
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missingKeywords.map(kw => (
              <button key={kw} className="group inline-flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary hover:text-primary transition-all shadow-sm">
                <span className="font-sans text-xs text-slate-600 font-medium group-hover:text-primary">{kw}</span>
                <Plus className="w-3 h-3 text-primary group-hover:scale-125 transition-transform" />
              </button>
            ))}
          </div>
          <p className="font-sans text-xs text-text-sub mt-2 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-primary" />
            Strategic Note: Adding these terms could boost relevancy significantly.
          </p>
        </div>
      </div>
    </div>
  );
};

const ProgressBar: React.FC<{ label: string, progress: number, color: string, textColor: string }> = ({ label, progress, color, textColor }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end px-1">
      <span className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <span className={cn("font-sans text-xs font-bold", textColor)}>{progress}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className={cn("h-full rounded-full shadow-sm", color)} 
      />
    </div>
  </div>
);

export default ATSAnalytics;
