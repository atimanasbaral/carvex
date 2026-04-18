/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  description: string;
  postedAt: string;
}

export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  categoryBreakdown: {
    skills: number;
    experience: number;
    education: number;
  };
}

export interface Application {
  id: string;
  jobId?: string;
  jobTitle: string;
  companyLogo?: string;
  company: string;
  location: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'archived';
  matchScore: number;
  appliedDate: string;
  deadline?: string;
  notes?: string;
  lastUpdated?: string;
  nextStep?: string;
  nextStepTime?: string;
}

export interface SystemLogItem {
  id: string;
  type: 'status' | 'ai' | 'action' | 'system';
  message: string;
  description?: string;
  timestamp: string;
}

export interface CareerStats {
  totalApplied: number;
  appliedTrend: number;
  interviewsScheduled: number;
  interviewTrend: number;
  avgATSScore: number;
  activeOffers: number;
}
