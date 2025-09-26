import { useState } from "react";
import { 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Settings,
  Play,
  Pause,
  BarChart3,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const EmailOutbox = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isThrottling, setIsThrottling] = useState(false);

  const emailsData = [
    {
      id: 1,
      position: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      recipient: "hiring@techcorp.com",
      status: "sent",
      sentAt: "2024-01-15 09:30 AM",
      opened: true,
      response: false
    },
    {
      id: 2,
      position: "Full Stack Engineer",
      company: "StartupXYZ",
      recipient: "careers@startupxyz.com",
      status: "queued",
      scheduledFor: "2024-01-15 02:00 PM",
      priority: "high"
    },
    {
      id: 3,
      position: "React Developer",
      company: "Digital Solutions",
      recipient: "hr@digitalsolutions.com",
      status: "failed",
      error: "Invalid email address",
      lastAttempt: "2024-01-15 08:45 AM"
    },
    {
      id: 4,
      position: "Software Engineer",
      company: "MegaCorp",
      recipient: "jobs@megacorp.com",
      status: "sending",
      progress: 75
    },
    {
      id: 5,
      position: "Frontend Developer",
      company: "InnovateCo",
      recipient: "talent@innovateco.com",
      status: "queued",
      scheduledFor: "2024-01-15 03:30 PM",
      priority: "normal"
    }
  ];

  const getStatusBadge = (status: string, extra?: any) => {
    switch (status) {
      case "sent":
        return <Badge className="status-success">Sent</Badge>;
      case "queued":
        return <Badge className="status-warning">Queued</Badge>;
      case "sending":
        return <Badge className="status-warning">Sending ({extra.progress}%)</Badge>;
      case "failed":
        return <Badge className="status-destructive">Failed</Badge>;
      default:
        return <Badge className="status-pending">Unknown</Badge>;
    }
  };

  const handleRetryEmail = (emailId: number) => {
    toast({
      title: "Email Retry",
      description: "Attempting to resend the failed email...",
    });
  };

  const handleToggleThrottling = () => {
    setIsThrottling(!isThrottling);
    toast({
      title: isThrottling ? "Throttling Disabled" : "Throttling Enabled",
      description: isThrottling 
        ? "Emails will be sent at normal speed" 
        : "Email sending has been throttled for safety",
    });
  };

  const handleSendBatch = () => {
    toast({
      title: "Batch Send Started",
      description: "Processing queued emails with rate limiting...",
    });
  };

  const filteredEmails = emailsData.filter(email => {
    const matchesSearch = email.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || email.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: emailsData.length,
    sent: emailsData.filter(e => e.status === 'sent').length,
    queued: emailsData.filter(e => e.status === 'queued').length,
    failed: emailsData.filter(e => e.status === 'failed').length
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text break-words">Email Outbox</h1>
            <p className="text-muted-foreground text-xs sm:text-sm lg:text-base break-words">Manage your application emails and sending status</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
          <Button 
            onClick={handleToggleThrottling}
            variant={isThrottling ? "destructive" : "outline"}
            className={`w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4 ${isThrottling ? "" : "glass-button"}`}
          >
            {isThrottling ? <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />}
            <span className="truncate">{isThrottling ? "Stop Throttling" : "Enable Throttling"}</span>
          </Button>
          <Button onClick={handleSendBatch} className="action-button gradient-primary text-white w-full sm:w-auto text-xs sm:text-sm px-3 sm:px-4">
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Send Batch</span>
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card text-center animate-slide-up">
          <CardContent className="p-4">
            <div className="text-2xl font-bold gradient-text">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Emails</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stats.sent}</div>
            <div className="text-sm text-muted-foreground">Sent</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{stats.queued}</div>
            <div className="text-sm text-muted-foreground">Queued</div>
          </CardContent>
        </Card>
        <Card className="glass-card text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-button border-glass-border w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["all", "sent", "queued", "sending", "failed"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={`text-xs sm:text-sm ${selectedStatus === status ? "gradient-primary text-white" : "glass-button"}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <div className="space-y-4">
        {filteredEmails.map((email, index) => (
          <Card key={email.id} className={`glass-card hover:scale-[1.01] transition-all duration-300 animate-slide-up overflow-hidden`} style={{ animationDelay: `${(index + 5) * 0.1}s` }}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between sm:space-x-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
                    <h3 className="font-semibold text-sm sm:text-base lg:text-lg break-words leading-tight">{email.position}</h3>
                    <div className="self-start sm:self-auto">
                      {getStatusBadge(email.status, email)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1 min-w-0">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{email.company}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0">
                      <Send className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{email.recipient}</span>
                    </div>
                    {email.status === "sent" && email.sentAt && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{email.sentAt}</span>
                      </div>
                    )}
                    {email.status === "queued" && email.scheduledFor && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Scheduled: {email.scheduledFor}</span>
                      </div>
                    )}
                  </div>

                  {email.status === "sent" && (
                    <div className="flex items-center gap-4 text-xs">
                      <div className={`flex items-center gap-1 ${email.opened ? 'text-success' : 'text-muted-foreground'}`}>
                        <CheckCircle className="h-3 w-3" />
                        {email.opened ? 'Opened' : 'Not opened'}
                      </div>
                      <div className={`flex items-center gap-1 ${email.response ? 'text-success' : 'text-muted-foreground'}`}>
                        <Mail className="h-3 w-3" />
                        {email.response ? 'Response received' : 'No response'}
                      </div>
                    </div>
                  )}

                  {email.status === "failed" && email.error && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <XCircle className="h-3 w-3" />
                      Error: {email.error}
                    </div>
                  )}

                  {email.status === "sending" && email.progress && (
                    <div className="w-full bg-glass rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${email.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                  {email.status === "failed" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRetryEmail(email.id)}
                      className="action-button text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      <span>Retry</span>
                    </Button>
                  )}
                  {email.status === "queued" && email.priority === "high" && (
                    <Badge variant="outline" className="text-warning border-warning text-xs">
                      High Priority
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost" className="glass-button p-2">
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="glass-button p-2">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmails.length === 0 && (
        <Card className="glass-card text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No emails found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmailOutbox;