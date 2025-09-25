import { useState } from "react";
import { 
  Activity, 
  Filter, 
  Download, 
  Search, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Database,
  Mail,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const ActivityLogs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const logsData = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      type: "scrape",
      action: "Job Scraping Started",
      description: "Initiated scraping for LinkedIn Jobs with keywords: 'frontend developer, react'",
      status: "success",
      details: "Found 15 new job postings",
      duration: "2m 34s"
    },
    {
      id: 2,
      timestamp: "2024-01-15 14:28:15",
      type: "generate",
      action: "Cover Letter Generation",
      description: "Generated cover letter for Senior Frontend Developer at TechCorp",
      status: "success",
      details: "PDF generated successfully (247KB)",
      duration: "45s"
    },
    {
      id: 3,
      timestamp: "2024-01-15 14:25:10",
      type: "send",
      action: "Email Batch Send",
      description: "Sent application emails for 5 positions",
      status: "success",
      details: "All emails delivered successfully",
      duration: "1m 12s"
    },
    {
      id: 4,
      timestamp: "2024-01-15 14:20:45",
      type: "scrape",
      action: "Job Scraping Failed",
      description: "Failed to scrape Indeed.com due to rate limiting",
      status: "error",
      details: "Error: Too many requests (429)",
      duration: "30s"
    },
    {
      id: 5,
      timestamp: "2024-01-15 14:15:30",
      type: "generate",
      action: "Cover Letter Generation",
      description: "Generated cover letter for Full Stack Engineer at StartupXYZ",
      status: "warning",
      details: "Generated with limited company information",
      duration: "1m 5s"
    },
    {
      id: 6,
      timestamp: "2024-01-15 14:10:20",
      type: "system",
      action: "System Startup",
      description: "Job automation system initialized",
      status: "info",
      details: "All services running normally",
      duration: "5s"
    },
    {
      id: 7,
      timestamp: "2024-01-15 13:45:15",
      type: "send",
      action: "Email Send Failed",
      description: "Failed to send email to careers@company.com",
      status: "error",
      details: "SMTP Error: Invalid recipient address",
      duration: "15s"
    },
    {
      id: 8,
      timestamp: "2024-01-15 13:30:10",
      type: "scrape",
      action: "Scheduled Scraping",
      description: "Daily scheduled scraping completed for all configured sites",
      status: "success",
      details: "Processed 3 job sites, found 23 new positions",
      duration: "4m 28s"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "scrape":
        return <Database className="h-4 w-4" />;
      case "generate":
        return <FileText className="h-4 w-4" />;
      case "send":
        return <Mail className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="status-success">Success</Badge>;
      case "error":
        return <Badge className="status-destructive">Error</Badge>;
      case "warning":
        return <Badge className="status-warning">Warning</Badge>;
      case "info":
        return <Badge className="status-pending">Info</Badge>;
      default:
        return <Badge className="status-pending">Unknown</Badge>;
    }
  };

  const handleDownloadLogs = () => {
    toast({
      title: "Downloading Logs",
      description: "Exporting activity logs to CSV format...",
    });
  };

  const handleRefreshLogs = () => {
    toast({
      title: "Refreshing Logs",
      description: "Fetching latest activity data...",
    });
  };

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || log.type === selectedType;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: logsData.length,
    success: logsData.filter(l => l.status === 'success').length,
    error: logsData.filter(l => l.status === 'error').length,
    warning: logsData.filter(l => l.status === 'warning').length
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Activity & Logs</h1>
            <p className="text-muted-foreground">Monitor system activity and troubleshoot issues</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleRefreshLogs} variant="outline" className="glass-button">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleDownloadLogs} className="action-button">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card text-center animate-slide-up">
          <CardContent className="p-4">
            <div className="text-2xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stats.success}</div>
            <div className="text-sm text-muted-foreground">Success</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stats.error}</div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{stats.warning}</div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activity logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-button border-glass-border"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="glass-button border-glass-border w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-glass-border">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scrape">Scraping</SelectItem>
                  <SelectItem value="generate">Generate</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="glass-button border-glass-border w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-glass-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-4">
        {filteredLogs.map((log, index) => (
          <Card key={log.id} className={`glass-card hover:scale-[1.01] transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${(index + 5) * 0.05}s` }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  log.status === 'success' ? 'bg-success/20 text-success' :
                  log.status === 'error' ? 'bg-destructive/20 text-destructive' :
                  log.status === 'warning' ? 'bg-warning/20 text-warning' :
                  'bg-primary/20 text-primary'
                }`}>
                  {getTypeIcon(log.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{log.action}</h3>
                      {getStatusBadge(log.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {log.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.timestamp}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{log.description}</p>

                  <div className="flex items-center gap-2 text-sm">
                    {getStatusIcon(log.status)}
                    <span className={
                      log.status === 'success' ? 'text-success' :
                      log.status === 'error' ? 'text-destructive' :
                      log.status === 'warning' ? 'text-warning' :
                      'text-primary'
                    }>
                      {log.details}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <Card className="glass-card text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No activity found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ActivityLogs;