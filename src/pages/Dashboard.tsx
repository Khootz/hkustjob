import { useState } from "react";
import { 
  Briefcase, 
  FileText, 
  Mail, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  SendHorizonal,
  Play,
  Sparkles,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);

  const kpiData = [
    {
      title: "Total Jobs Found",
      value: "247",
      change: "+12.5%",
      trend: "up",
      icon: Briefcase,
      lastUpdate: "2 hours ago"
    },
    {
      title: "Cover Letters Generated",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      lastUpdate: "1 hour ago"
    },
    {
      title: "Emails Sent",
      value: "98",
      change: "+15.3%",
      trend: "up",
      icon: Mail,
      lastUpdate: "30 min ago"
    },
    {
      title: "Response Rate",
      value: "12.8%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      lastUpdate: "Live"
    }
  ];

  const quickActions = [
    {
      title: "Run Job Scraper",
      description: "Scrape latest job postings",
      icon: Play,
      variant: "primary" as const,
      action: () => handleRunScraper()
    },
    {
      title: "Generate Cover Letters",
      description: "Create personalized letters",
      icon: Sparkles,
      variant: "secondary" as const,
      action: () => handleGenerateLetters()
    },
    {
      title: "Send Email Batch",
      description: "Send queued applications",
      icon: SendHorizonal,
      variant: "accent" as const,
      action: () => handleSendEmails()
    }
  ];

  const handleRunScraper = () => {
    setIsRunning(true);
    toast({
      title: "Job Scraper Started",
      description: "Searching for new job opportunities...",
    });
    setTimeout(() => {
      setIsRunning(false);
      toast({
        title: "Scraping Complete",
        description: "Found 15 new job opportunities!",
      });
    }, 3000);
  };

  const handleGenerateLetters = () => {
    toast({
      title: "Generating Cover Letters",
      description: "Creating personalized cover letters for new jobs...",
    });
  };

  const handleSendEmails = () => {
    toast({
      title: "Email Batch Queued",
      description: "23 applications will be sent over the next hour.",
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your job application overview.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">System Active</span>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={kpi.title} className={`kpi-card animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-5 w-5 text-primary animate-float" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold gradient-text mb-1">{kpi.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-success font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {kpi.change}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {kpi.lastUpdate}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card key={action.title} className={`glass-card hover:scale-105 cursor-pointer transition-all duration-300 animate-slide-up`} style={{ animationDelay: `${(index + 4) * 0.1}s` }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    action.variant === 'primary' ? 'gradient-primary' :
                    action.variant === 'secondary' ? 'bg-secondary' :
                    'bg-accent'
                  }`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={action.action}
                  disabled={isRunning && action.title.includes("Scraper")}
                  className={`w-full action-button ${
                    action.variant === 'primary' ? 'gradient-primary text-white hover:shadow-lg' :
                    action.variant === 'secondary' ? 'bg-secondary hover:bg-secondary-glow' :
                    'bg-accent hover:bg-accent-glow'
                  }`}>
                  {isRunning && action.title.includes("Scraper") ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.title}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { icon: CheckCircle, text: "15 new jobs scraped from TechCareers", time: "2 hours ago", status: "success" },
                { icon: FileText, text: "Cover letters generated for 8 positions", time: "3 hours ago", status: "success" },
                { icon: SendHorizonal, text: "12 applications sent successfully", time: "4 hours ago", status: "success" },
                { icon: BarChart3, text: "Weekly report generated", time: "1 day ago", status: "info" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg glass-button">
                  <div className={`p-2 rounded-lg ${
                    activity.status === 'success' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                  }`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;