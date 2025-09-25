import type { ScrapingRequest, ScrapingResponse } from '@/types/jobs';

const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : ''; // Vercel will handle routing in production

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Request failed');
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(0, error instanceof Error ? error.message : 'Network error');
  }
};

export const jobsApi = {
  /**
   * Start the job scraping process
   */
  startScraping: async (request: ScrapingRequest): Promise<ScrapingResponse> => {
    const response = await apiRequest('/api/scrape', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    return response.json();
  },

  /**
   * Download the Excel file generated from scraping
   */
  downloadExcel: async (filePath: string): Promise<Blob> => {
    const response = await apiRequest(`/api/download/${encodeURIComponent(filePath)}`, {
      method: 'GET',
    });

    return response.blob();
  },

  /**
   * Health check for the API
   */
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiRequest('/api/health');
    return response.json();
  },
};

// Utility function to trigger file download in browser
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper function to parse page ranges like "1-5" or "3"
export const parsePageInput = (input: string): number[] => {
  const trimmed = input.trim();
  
  if (trimmed.includes('-')) {
    const [start, end] = trimmed.split('-').map(s => parseInt(s.trim()));
    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      throw new Error('Invalid page range format');
    }
    if (end - start > 100) {
      throw new Error('Page range too large (max 100 pages)');
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  } else {
    const page = parseInt(trimmed);
    if (isNaN(page) || page < 1) {
      throw new Error('Invalid page number');
    }
    return [page];
  }
};

export { ApiError };