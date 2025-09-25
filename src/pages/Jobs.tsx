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
  Key,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const Jobs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [phpSessionId, setPhpSessionId] = useState("");
  const [showSessionInput, setShowSessionInput] = useState(false);

  // Load PHP Session ID from localStorage on component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem("phpSessionId");
    if (savedSessionId) {
      setPhpSessionId(savedSessionId);
    }
  }, []);

  // Save PHP Session ID to localStorage when it changes
  const handleSessionIdChange = (value: string) => {
    setPhpSessionId(value);
    if (value) {
      localStorage.setItem("phpSessionId", value);
      toast({
        title: "Session ID Saved",
        description: "PHP Session ID has been stored for scraping operations.",
      });
    } else {
      localStorage.removeItem("phpSessionId");
    }
  };

  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120k - $150k",
      type: "Full-time",
      posted: "2 days ago",
      status: "applied",
      description: "Looking for an experienced frontend developer with React expertise...",
      skills: ["React", "TypeScript", "Next.js"]
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$100k - $130k",
      type: "Full-time",
      posted: "1 day ago",
      status: "generated",
      description: "Join our growing team building the next-gen platform...",
      skills: ["Python", "React", "AWS"]
    },
    {
      id: 3,
      title: "React Developer",
      company: "Digital Solutions",
      location: "New York, NY",
      salary: "$90k - $120k",
      type: "Contract",
      posted: "3 hours ago",
      status: "new",
      description: "Seeking a skilled React developer for our client projects...",
      skills: ["React", "JavaScript", "CSS"]
    },
    {
      id: 4,
      title: "Software Engineer",
      company: "MegaCorp",
      location: "Austin, TX",
      salary: "$110k - $140k",
      type: "Full-time",
      posted: "5 hours ago",
      status: "new",
      description: "Building scalable applications for millions of users...",
      skills: ["Node.js", "MongoDB", "Docker"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <Badge className="status-success">Applied</Badge>;
      case "generated":
        return <Badge className="status-warning">Letter Ready</Badge>;
      case "new":
        return <Badge className="status-pending">New</Badge>;
      default:
        return <Badge className="status-pending">Unknown</Badge>;
    }
  };

  const handlePreviewLetter = (jobId: number) => {
    toast({
      title: "Opening Cover Letter",
      description: "Generating preview for this position...",
    });
  };

  const handleQueueEmail = (jobId: number) => {
    toast({
      title: "Email Queued",
      description: "Application will be sent in the next batch.",
    });
  };

  const handleUploadExcel = () => {
    toast({
      title: "Excel Upload",
      description: "Feature coming soon - drag and drop Excel files here.",
    });
  };

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || job.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Jobs</h1>
            <p className="text-muted-foreground">Manage your job applications and opportunities</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* PHP Session ID Input */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSessionInput(!showSessionInput)}
              className={`glass-button ${phpSessionId ? 'border-success text-success' : 'border-muted-foreground'}`}
            >
              <Key className="h-3 w-3 mr-1" />
              {phpSessionId ? <Check className="h-3 w-3 ml-1" /> : <X className="h-3 w-3 ml-1" />}
              Session
            </Button>
            {showSessionInput && (
              <div className="flex items-center gap-2 animate-slide-in">
                <Input
                  placeholder="Enter PHP Session ID..."
                  value={phpSessionId}
                  onChange={(e) => handleSessionIdChange(e.target.value)}
                  className="w-64 glass-button border-glass-border text-xs"
                />
              </div>
            )}
          </div>
          
          <Button onClick={handleUploadExcel} className="action-button">
            <Upload className="h-4 w-4 mr-2" />
            Upload Excel
          </Button>
          <Button variant="outline" className="glass-button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-button border-glass-border"
              />
            </div>
            <div className="flex gap-2">
              {["all", "new", "generated", "applied"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className={selectedFilter === filter ? "gradient-primary text-white" : "glass-button"}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
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
            <div className="text-2xl font-bold gradient-text">{jobsData.length}</div>
            <div className="text-sm text-muted-foreground">Total Jobs</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{jobsData.filter(j => j.status === 'applied').length}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{jobsData.filter(j => j.status === 'generated').length}</div>
            <div className="text-sm text-muted-foreground">Letters Ready</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{jobsData.filter(j => j.status === 'new').length}</div>
            <div className="text-sm text-muted-foreground">New</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job, index) => (
          <Card key={job.id} className={`glass-card hover:scale-[1.02] transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </div>
                  </div>
                </div>
                {getStatusBadge(job.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-success font-medium">
                  <DollarSign className="h-3 w-3" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {job.posted}
                </div>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {job.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs glass-button">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => handlePreviewLetter(job.id)}
                  className="flex-1 action-button"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Preview Letter
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQueueEmail(job.id)}
                  className="flex-1 glass-button"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Queue Email
                </Button>
                <Button size="sm" variant="ghost" className="glass-button p-2">
                  <ExternalLink className="h-3 w-3" />
                </Button>
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