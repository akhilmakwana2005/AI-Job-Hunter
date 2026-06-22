import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL
});

// Request interceptor for adding the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration / 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if we receive a 401 unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  }
};

export const userService = {
  updatePreferences: async (data) => {
    const response = await api.put('/users/preferences', data);
    return response.data;
  }
};

export const jobService = {
  getJobs: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/jobs?${queryParams}`);
    return response.data;
  }
};

export const resumeService = {
  getResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  analyzeResume: async (data) => {
    const response = await api.post('/resumes/analyze', data);
    return response.data;
  },
  getSkillGap: async () => {
    const response = await api.get('/resumes/skill-gap');
    return response.data;
  },
  rewriteResume: async (data) => {
    const response = await api.post('/resumes/rewrite', data);
    return response.data;
  },
  recreateResume: async (data) => {
    const response = await api.post('/resumes/recreate', data);
    return response.data;
  }
};

export const applicationService = {
  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },
  addApplication: async (data) => {
    const response = await api.post('/applications', data);
    return response.data;
  },
  updateApplication: async (id, data) => {
    const response = await api.put(`/applications/${id}`, data);
    return response.data;
  },
  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};

export const coverLetterService = {
  getCoverLetters: async () => {
    const response = await api.get('/cover-letters');
    return response.data;
  },
  generateCoverLetter: async (data) => {
    const response = await api.post('/cover-letters/generate', data);
    return response.data;
  }
};

export const interviewService = {
  getInterviews: async () => {
    const response = await api.get('/interviews');
    return response.data;
  },
  startInterview: async (data) => {
    const response = await api.post('/interviews/start', data);
    return response.data;
  },
  submitAnswer: async (id, data) => {
    const response = await api.post(`/interviews/${id}/answer`, data);
    return response.data;
  }
};

export const linkedinService = {
  getAnalyses: async () => {
    const response = await api.get('/linkedin');
    return response.data;
  },
  analyzeProfile: async (data) => {
    const response = await api.post('/linkedin/analyze', data);
    return response.data;
  }
};

export const networkingService = {
  getMessages: async () => {
    const response = await api.get('/networking');
    return response.data;
  },
  generateMessage: async (data) => {
    const response = await api.post('/networking/generate', data);
    return response.data;
  }
};

export const salaryService = {
  getNegotiations: async () => {
    const response = await api.get('/salary');
    return response.data;
  },
  generateNegotiationEmail: async (data) => {
    const response = await api.post('/salary/negotiate', data);
    return response.data;
  }
};

export const paymentService = {
  upgradeToPro: async (paymentData) => {
    const response = await api.post('/payment/upgrade', paymentData);
    return response.data;
  }
};

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  promoteUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/promote`);
    return response.data;
  }
};

export const portfolioService = {
  generatePortfolio: async (data) => {
    const response = await api.post('/portfolio/generate', data);
    return response.data;
  }
};

export const autoMatchService = {
  getMatches: async (resumeId) => {
    const url = resumeId ? `/automatch?resumeId=${resumeId}` : '/automatch';
    const response = await api.get(url);
    return response.data;
  }
};

export default api;
