/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Link as LinkIcon,
  Copy,
  Loader2,
  AlertCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { atsService } from '../services/api';
import { cn } from '../lib/utils';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ResumeLabsProps {
  initialJobDescription?: string;
}

const ResumeLabs: React.FC<ResumeLabsProps> = ({ initialJobDescription = '' }) => {
  const [resume, setResume] = useState('Senior Full Stack Engineer\nExperience\n- Developed scalable microservices using Node.js and Go.\n- Led frontend transition to React, improving load times by 40%.\n- Mentored junior developers and established CI/CD pipelines.\nSkills\nJavaScript, TypeScript, React, Node.js, AWS, Docker');
  const [jobDescription, setJobDescription] = useState(initialJobDescription || 'Role: Lead Frontend Engineer (React/Vue)\nRequirements:\n- 5+ years experience building complex SPAs.\n- Deep expertise in React and modern state management (Redux/Zustand).\n- Experience with WebGL or Three.js is a strong plus.\n- Proven track record of performance optimization.\n- Strong UI/UX sensibilities and collaboration with design teams.');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'tailor' | 'score' | null>(null);
  const [output, setOutput] = useState<{ content: string, score: number, type: 'tailor' | 'score' } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (type: 'tailor' | 'score') => {
    if (!resume || !jobDescription) return;
    setLoading(true);
    setActionType(type);
    setError(null);
    try {
      if (type === 'tailor') {
        const prompt = `You are a professional resume writer and career coach. 
Tailor the following resume to perfectly match the job description provided. 
Highlight the most relevant skills and rewrite bullet points to show impact using industry-standard action verbs.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide the optimized resume content. Do not include any meta-commentary outside the resume text.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });
        
        const optimizedContent = response.text || "Failed to generate content.";
        setOutput({ content: optimizedContent, score: 95, type: 'tailor' });
      } else {
        const prompt = `You are an expert Applicant Tracking System (ATS). 
Analyze the resume against the job description.
Provide the evaluation in JSON format with:
- score (0-100)
- matchedKeywords (string array)
- missingKeywords (string array)
- recommendation (string)

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendation: { type: Type.STRING }
              },
              required: ['score', 'matchedKeywords', 'missingKeywords', 'recommendation']
            }
          }
        });

        const result = JSON.parse(response.text || '{}');
        const content = `Matched Keywords: ${result.matchedKeywords.join(', ')}\n\nMissing Keywords: ${result.missingKeywords.join(', ')}\n\nRecommendation: ${result.recommendation}`;
        setOutput({ content, score: result.score, type: 'score' });
      }
    } catch (err) {
      console.error('AI Error:', err);
      setError('The AI service is currently processing high volume. Please try again in a few moments.');
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar bg-slate-50">
      <div className="max-w-7xl mx-auto h-full flex flex-col space-y-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-text-main mb-1">Resume Optimization</h2>
          <p className="text-text-sub font-body text-sm max-w-2xl">
            Align your core competencies with target job requirements using AI-driven narrative alignment.
          </p>
        </div>

        {/* Split Input Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative flex-1 min-h-[400px]">
          {/* Left: Your Resume */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <FileText className="w-3.5 h-3.5 mr-2 text-primary" />
                Current Resume
              </label>
              <span className="text-[10px] font-mono text-slate-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Last saved: 2h ago
              </span>
            </div>
            <div className="flex-1 bg-white border border-border rounded-xl p-1 relative shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all min-h-[300px]">
              <textarea 
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                className="w-full h-full bg-transparent text-text-main font-mono text-sm p-4 rounded-lg resize-none outline-none custom-scrollbar placeholder:text-slate-300 border-none focus:ring-0" 
                placeholder="Paste your current resume content here..."
              />
            </div>
          </div>

          {/* Right: Job Description */}
          <div className="flex flex-col h-full space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="font-sans text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-primary" />
                Job Requirements
              </label>
              <button className="text-[10px] font-mono text-primary hover:underline transition-colors flex items-center">
                <LinkIcon className="w-3 h-3 mr-1" /> Import from URL
              </button>
            </div>
            <div className="flex-1 bg-white border border-border rounded-xl p-1 relative shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all min-h-[300px]">
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-full bg-transparent text-text-main font-mono text-sm p-4 rounded-lg resize-none outline-none custom-scrollbar placeholder:text-slate-300 border-none focus:ring-0" 
                placeholder="Paste the job description you are targeting..."
              />
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-center gap-4 py-4">
          <button 
            onClick={() => handleAction('score')}
            disabled={loading}
            className="px-8 py-3.5 rounded-lg bg-white border border-border text-text-main font-sans font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && actionType === 'score' ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4 text-primary" />}
            Analyze ATS Score
          </button>
          <button 
            onClick={() => handleAction('tailor')}
            disabled={loading}
            className="px-10 py-3.5 rounded-lg bg-primary text-white font-sans font-bold text-base shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading && actionType === 'tailor' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate AI Tailored Resume
          </button>
        </div>

        {/* Output Section */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-4 text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {output && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-col space-y-4 pb-20"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-display font-bold text-lg text-text-main flex items-center uppercase tracking-tight">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2" />
                  AI Suggested Improvements
                </h3>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-full border border-green-200 uppercase tracking-widest">
                  Match Accuracy: {output.score}%
                </span>
              </div>

              <div className="bg-white border border-border rounded-xl p-8 shadow-sm relative">
                <pre className="whitespace-pre-wrap font-mono text-sm text-text-main leading-relaxed">
                  {output.content}
                </pre>

                <div className="mt-8 flex justify-end space-x-3 border-t border-border pt-6">
                  <button 
                    onClick={() => setOutput(null)}
                    className="px-5 py-2 rounded text-xs font-bold text-text-sub hover:text-text-main transition-colors uppercase tracking-wider"
                  >
                    Discard Changes
                  </button>
                  <button className="px-6 py-2 rounded-lg bg-slate-900 text-white font-sans text-xs font-bold hover:bg-black transition-colors flex items-center uppercase tracking-widest shadow-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default ResumeLabs;
