/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { Job, ATSResult, Application } from '../types';

const BASE_URL = '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobService = {
  searchJobs: async (role: string, location: string): Promise<Job[]> => {
    try {
      const response = await api.post('/api/search/jobs', { role, location });
      return response.data;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },
};

export const atsService = {
  scoreResume: async (resume: string, jobDescription: string): Promise<ATSResult> => {
    try {
      const response = await api.post('/api/ats/score', { resume, jobDescription });
      return response.data;
    } catch (error) {
      console.error('Error scoring resume:', error);
      throw error;
    }
  },

  tailorResume: async (resume: string, jobDescription: string): Promise<{ optimizedContent: string, matchScore: number }> => {
    try {
      const response = await api.post('/api/resume/tailor', { resume, jobDescription });
      return response.data;
    } catch (error) {
      console.error('Error tailoring resume:', error);
      throw error;
    }
  },
};

export const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    try {
      const response = await api.get('/api/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  addApplication: async (application: Partial<Application>): Promise<Application> => {
    try {
      const response = await api.post('/api/applications', application);
      return response.data;
    } catch (error) {
      console.error('Error adding application:', error);
      throw error;
    }
  },
  
  updateApplication: async (id: string, updates: Partial<Application>): Promise<Application> => {
    try {
      const response = await api.put(`/api/applications/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },
};

export default api;
