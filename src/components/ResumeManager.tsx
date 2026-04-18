import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Eye, 
  Download, 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2,
  Trash2,
  Edit2
} from 'lucide-react';
import { cn } from '../lib/utils';

const ResumeManager: React.FC = () => {
  const [resumes, setResumes] = useState([
    { id: '1', name: 'Software Engineer Lead (2026)', status: 'Primary', date: '2 days ago', version: 'v2.4' },
    { id: '2', name: 'Product Designer - Focus: AI/ML', status: 'Draft', date: '1 week ago', version: 'v1.1' },
    { id: '3', name: 'Quant Developer - Legacy', status: 'Archived', date: '1 month ago', version: 'v1.0' },
  ]);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12 z-10 relative custom-scrollbar bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col space-y-1">
            <h1 className="font-display text-3xl font-bold text-text-main tracking-tight">Resume Depository</h1>
            <p className="font-body text-text-sub text-sm">Manage multiple iterations of your career narrative.</p>
          </div>
          <button className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Upload PDF/DOCX
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center group hover:border-primary/50 transition-all cursor-pointer bg-white/50"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary" />
            </div>
            <h3 className="font-display text-base font-bold text-text-main">Create New Resume</h3>
            <p className="text-[11px] text-text-sub mt-1 max-w-[180px]">Start from a template or pull from LinkedIn.</p>
          </motion.div>

          {resumes.map((resume, idx) => (
            <motion.div 
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  resume.status === 'Primary' ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-400'
                )}>
                  <FileText className="w-5 h-5" />
                </div>
                <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-sm font-bold text-text-main group-hover:text-primary transition-colors truncate">
                    {resume.name}
                  </h3>
                  {resume.status === 'Primary' && (
                    <span className="bg-success/10 text-success text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-success/20">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center text-[10px] text-text-sub font-mono">
                  <span className="mr-3 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {resume.date}
                  </span>
                  <span className="flex items-center">
                    Ver: {resume.version}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-text-main font-sans text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-text-main font-sans text-[10px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Suggestion */}
        <section className="bg-slate-900 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Identity Verification</h3>
                <p className="text-white/60 text-sm font-body">Your profile is 85% complete. Verify your GitHub to unlock better matches.</p>
              </div>
            </div>
            <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-xl hover:bg-slate-100 transition-all shadow-lg whitespace-nowrap">
              Link Accounts
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResumeManager;
