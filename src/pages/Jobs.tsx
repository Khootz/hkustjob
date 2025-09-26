import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  ExternalLink, 
  FileText, 
  Mail,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { ScrapingDialog } from "@/components/ScrapingDialog";
import { ScrapingProgressCard } from "@/components/ScrapingProgress";
import { jobsApi, downloadFile } from "@/lib/api";
import type { Job, ScrapingProgress } from "@/types/jobs";

const Jobs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState<ScrapingProgress | null>(null);
  const [excelFilePath, setExcelFilePath] = useState<string | null>(null);

  // Load jobs from localStorage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem('hkust-jobs');
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs));
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    }
  }, []);

  // Save jobs to localStorage when jobs change
  useEffect(() => {
    if (jobs.length > 0) {
      localStorage.setItem('hkust-jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  const handleStartScraping = async (pages: number[], phpSessionId: string) => {
    setIsLoading(true);
    setScrapingProgress({
      total_pages: pages.length,
      completed_pages: 0,
      total_jobs_found: 0,
      new_jobs: 0,
      status: 'in_progress'
    });

    try {
      const response = await jobsApi.startScraping({
        pages,
        phpSessionId
      });

      if (response.success && response.data) {
        setJobs(response.data.jobs);
        setExcelFilePath(response.data.excel_file_path || null);
        
        setScrapingProgress({
          total_pages: pages.length,
          completed_pages: pages.length,
          total_jobs_found: response.data.jobs.length,
          new_jobs: response.data.jobs.length,
          status: 'completed'
        });

        toast({
          title: "Scraping Completed",
          description: `Successfully scraped ${response.data.jobs.length} jobs from ${pages.length} pages.`,
        });
      } else {
        throw new Error(response.message || 'Scraping failed');
      }
    } catch (error) {
      setScrapingProgress({
        total_pages: pages.length,
        completed_pages: 0,
        total_jobs_found: 0,
        new_jobs: 0,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });

      toast({
        title: "Scraping Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!excelFilePath) {
      toast({
        title: "No Excel File",
        description: "Please run scraping first to generate an Excel file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const blob = await jobsApi.downloadExcel(excelFilePath);
      const filename = `hkust_jobs_${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(blob, filename);
      
      toast({
        title: "Download Started",
        description: "Excel file download has started.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download Excel file",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (job: Job) => {
    if (job.applied === "NO EMAIL") {
      return <Badge className="status-warning">No Email</Badge>;
    } else if (job.applied === true) {
      return <Badge className="status-success">Applied</Badge>;
    } else if (job.letter === true) {
      return <Badge className="status-warning">Letter Ready</Badge>;
    } else {
      return <Badge className="status-pending">New</Badge>;
    }
  };

  const handlePreviewLetter = (jobIndex: number) => {
    const job = jobs[jobIndex];
    toast({
      title: "Opening Cover Letter",
      description: `Generating preview for ${job.job_title} at ${job.company}...`,
    });
  };

  const handleQueueEmail = (jobIndex: number) => {
    const job = jobs[jobIndex];
    
    // Update the job status
    const updatedJobs = [...jobs];
    updatedJobs[jobIndex] = { ...job, applied: true };
    setJobs(updatedJobs);
    
    toast({
      title: "Email Queued",
      description: `Application for ${job.job_title} will be sent in the next batch.`,
    });
  };

  const getJobStatus = (job: Job): 'new' | 'applied' | 'generated' | 'no_email' => {
    if (job.applied === "NO EMAIL") return 'no_email';
    if (job.applied === true) return 'applied';
    if (job.letter === true) return 'generated';
    return 'new';
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const jobStatus = getJobStatus(job);
    const matchesFilter = selectedFilter === "all" || jobStatus === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatsCount = (status: 'applied' | 'generated' | 'new' | 'no_email') => {
    return jobs.filter(job => getJobStatus(job) === status).length;
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Jobs</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage your job applications and opportunities</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <ScrapingDialog onStartScraping={handleStartScraping} isLoading={isLoading}>
            <Button className="action-button w-full sm:w-auto text-sm">
              <Download className="h-4 w-4 mr-2" />
              Start Scraping
            </Button>
          </ScrapingDialog>
          <Button 
            onClick={handleDownloadExcel} 
            disabled={!excelFilePath}
            variant="outline" 
            className="glass-button w-full sm:w-auto text-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </header>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-button border-glass-border w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "new", "generated", "applied", "no_email"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={`text-xs sm:text-sm ${selectedFilter === filter ? "gradient-primary text-white" : "glass-button"}`}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {filter === 'no_email' ? 'No Email' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold gradient-text">{jobs.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{getStatsCount('applied')}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{getStatsCount('generated')}</div>
            <div className="text-sm text-muted-foreground">Letters Ready</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{getStatsCount('new')}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
      </div>

      {/* Show scraping progress if active */}
      {scrapingProgress && (
        <div className="flex justify-center">
          <ScrapingProgressCard progress={scrapingProgress} />
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {filteredJobs.map((job, index) => (
          <Card key={`${job.company}-${job.job_title}-${index}`} className={`glass-card hover:scale-[1.02] transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{job.job_title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.job_nature || "Not specified"}
                    </div>
                  </div>
                </div>
                {getStatusBadge(job)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {job.email || "No email provided"}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {job.posting_date || "Unknown"}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.details ? job.details.substring(0, 150) + '...' : "No description available"}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Deadline: {job.deadline || "Not specified"}</span>
                {job.website && (
                  <a href={job.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                    Visit Website
                  </a>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => handlePreviewLetter(index)}
                  className="flex-1 action-button text-xs sm:text-sm"
                  disabled={job.applied === "NO EMAIL"}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Preview Letter
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQueueEmail(index)}
                  className="flex-1 glass-button text-xs sm:text-sm"
                  disabled={job.applied === "NO EMAIL" || job.applied === true}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  {job.applied === true ? "Applied" : "Queue Email"}
                </Button>
                {job.detail_url && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="glass-button p-2 sm:flex-shrink-0"
                    onClick={() => window.open(job.detail_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="glass-card text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Jobs;