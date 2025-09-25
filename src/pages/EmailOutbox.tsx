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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Email Outbox</h1>
            <p className="text-muted-foreground">Manage your application emails and sending status</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleToggleThrottling}
            variant={isThrottling ? "destructive" : "outline"}
            className={isThrottling ? "" : "glass-button"}
          >
            {isThrottling ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isThrottling ? "Stop Throttling" : "Enable Throttling"}
          </Button>
          <Button onClick={handleSendBatch} className="action-button gradient-primary text-white">
            <Send className="h-4 w-4 mr-2" />
            Send Batch
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails by position or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-button border-glass-border"
              />
            </div>
            <div className="flex gap-2">
              {["all", "sent", "queued", "sending", "failed"].map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? "gradient-primary text-white" : "glass-button"}
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
          <Card key={email.id} className={`glass-card hover:scale-[1.01] transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${(index + 5) * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{email.position}</h3>
                    {getStatusBadge(email.status, email)}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {email.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      {email.recipient}
                    </div>
                    {email.status === "sent" && email.sentAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {email.sentAt}
                      </div>
                    )}
                    {email.status === "queued" && email.scheduledFor && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Scheduled: {email.scheduledFor}
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

                <div className="flex items-center gap-2">
                  {email.status === "failed" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRetryEmail(email.id)}
                      className="action-button"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </Button>
                  )}
                  {email.status === "queued" && email.priority === "high" && (
                    <Badge variant="outline" className="text-warning border-warning">
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