export interface Job {
  company: string;
  job_title: string;
  job_nature: string;
  email: string;
  website: string;
  details: string;
  deadline: string;
  posting_date: string;
  applied: boolean | string; // Can be boolean or "NO EMAIL"
  letter: boolean;
  job_id?: string;
  detail_url?: string;
}

export interface ScrapingRequest {
  pages: number[];
  phpSessionId?: string;
}

export interface ScrapingResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    summary: {
      total_pages_scraped: number;
      pages: number[];
      total_jobs: number;
      duplicates_skipped: number;
      excel_filename?: string;
    };
    excel_file_path?: string;
  } | null;
}

export interface ScrapingProgress {
  total_pages: number;
  completed_pages: number;
  total_jobs_found: number;
  new_jobs: number;
  status: 'in_progress' | 'completed' | 'error';
  current_page?: number;
  message?: string;
}

export type JobStatus = 'new' | 'applied' | 'generated' | 'no_email';

export interface JobFilters {
  search: string;
  status: 'all' | JobStatus;
}