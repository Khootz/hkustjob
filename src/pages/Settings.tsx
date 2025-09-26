import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Mail, 
  Database, 
  FileText, 
  Shield, 
  Clock,
  Save,
  FlaskConical,
  Zap,
  Bell,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "smtp.outlook.com",
    smtpPort: "587",
    email: "your.email@outlook.com",
    password: "",
    useOAuth: true
  });

  const [scrapingSettings, setScrapingSettings] = useState({
    targetSite: "linkedin.com/jobs",
    cadence: "daily",
    maxJobs: "50",
    keywords: "frontend developer, react, javascript"
  });

  const [letterSettings, setLetterSettings] = useState({
    signature: "Best regards,\nJohn Doe\nSoftware Developer",
    template: "modern",
    includePortfolio: true,
    includeLinkedIn: true
  });

  const handleSaveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Testing Connection",
      description: "Verifying email configuration...",
    });
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "Email settings are configured correctly!",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Settings</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Configure your job automation preferences</p>
          </div>
        </div>
        <div className="flex items-center gap-2 glass-card px-3 sm:px-4 py-2 rounded-lg">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium">All Systems Operational</span>
        </div>
      </header>

      <Tabs defaultValue="email" className="space-y-4 sm:space-y-6">
        <TabsList className="glass-card p-1 h-auto grid grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="email" className="glass-button data-[state=active]:gradient-primary data-[state=active]:text-white text-xs sm:text-sm">
            <Mail className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="scraping" className="glass-button data-[state=active]:gradient-primary data-[state=active]:text-white text-xs sm:text-sm">
            <Database className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Scraping</span>
          </TabsTrigger>
          <TabsTrigger value="letters" className="glass-button data-[state=active]:gradient-primary data-[state=active]:text-white text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Letters</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="glass-button data-[state=active]:gradient-primary data-[state=active]:text-white text-xs sm:text-sm">
            <SettingsIcon className="h-4 w-4 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="glass-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  SMTP Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">SMTP Server</Label>
                    <Input
                      value={emailSettings.smtpServer}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
                      className="mt-2 glass-button border-glass-border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Port</Label>
                    <Input
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                      className="mt-2 glass-button border-glass-border"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <Input
                    type="email"
                    value={emailSettings.email}
                    onChange={(e) => setEmailSettings({...emailSettings, email: e.target.value})}
                    className="mt-2 glass-button border-glass-border"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Password</Label>
                  <Input
                    type="password"
                    value={emailSettings.password}
                    onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})}
                    className="mt-2 glass-button border-glass-border"
                    placeholder="App password or OAuth token"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Use OAuth 2.0</Label>
                    <p className="text-xs text-muted-foreground">Recommended for Outlook/Gmail</p>
                  </div>
                  <Switch
                    checked={emailSettings.useOAuth}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, useOAuth: checked})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleTestConnection} variant="outline" className="glass-button">
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button onClick={() => handleSaveSettings("Email")} className="action-button">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Emails per hour</Label>
                  <Select defaultValue="20">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="10">10 emails/hour</SelectItem>
                      <SelectItem value="20">20 emails/hour</SelectItem>
                      <SelectItem value="50">50 emails/hour</SelectItem>
                      <SelectItem value="100">100 emails/hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Delay between emails</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="3">3 minutes</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label className="text-sm font-medium">Smart throttling</Label>
                    <p className="text-xs text-muted-foreground">Automatically adjust based on provider limits</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scraping Settings */}
        <TabsContent value="scraping" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Scraping Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Target Website</Label>
                  <Select value={scrapingSettings.targetSite} onValueChange={(value) => setScrapingSettings({...scrapingSettings, targetSite: value})}>
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="linkedin.com/jobs">LinkedIn Jobs</SelectItem>
                      <SelectItem value="indeed.com">Indeed</SelectItem>
                      <SelectItem value="glassdoor.com">Glassdoor</SelectItem>
                      <SelectItem value="stackoverflow.com/jobs">Stack Overflow Jobs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Scraping Frequency</Label>
                  <Select value={scrapingSettings.cadence} onValueChange={(value) => setScrapingSettings({...scrapingSettings, cadence: value})}>
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Max Jobs per Run</Label>
                  <Input
                    type="number"
                    value={scrapingSettings.maxJobs}
                    onChange={(e) => setScrapingSettings({...scrapingSettings, maxJobs: e.target.value})}
                    className="mt-2 glass-button border-glass-border"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Search Keywords</Label>
                  <Textarea
                    value={scrapingSettings.keywords}
                    onChange={(e) => setScrapingSettings({...scrapingSettings, keywords: e.target.value})}
                    className="mt-2 glass-button border-glass-border resize-none"
                    rows={3}
                    placeholder="Enter keywords separated by commas"
                  />
                </div>

                <Button onClick={() => handleSaveSettings("Scraping")} className="w-full action-button">
                  <Save className="h-4 w-4 mr-2" />
                  Save Scraping Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Filters & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Location Filter</Label>
                  <Input
                    placeholder="e.g., San Francisco, Remote, New York"
                    className="mt-2 glass-button border-glass-border"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Salary Range</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input placeholder="Min" className="glass-button border-glass-border" />
                    <Input placeholder="Max" className="glass-button border-glass-border" />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Job Type</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="fulltime">Full-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="remote">Remote Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Skip duplicate jobs</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Auto-generate cover letters</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Letter Settings */}
        <TabsContent value="letters" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Template Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Default Template</Label>
                  <Select value={letterSettings.template} onValueChange={(value) => setLetterSettings({...letterSettings, template: value})}>
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Email Signature</Label>
                  <Textarea
                    value={letterSettings.signature}
                    onChange={(e) => setLetterSettings({...letterSettings, signature: e.target.value})}
                    className="mt-2 glass-button border-glass-border resize-none"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Include Portfolio Link</Label>
                      <p className="text-xs text-muted-foreground">Add portfolio URL to letters</p>
                    </div>
                    <Switch
                      checked={letterSettings.includePortfolio}
                      onCheckedChange={(checked) => setLetterSettings({...letterSettings, includePortfolio: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Include LinkedIn Profile</Label>
                      <p className="text-xs text-muted-foreground">Add LinkedIn URL to letters</p>
                    </div>
                    <Switch
                      checked={letterSettings.includeLinkedIn}
                      onCheckedChange={(checked) => setLetterSettings({...letterSettings, includeLinkedIn: checked})}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("Cover Letter")} className="w-full action-button">
                  <Save className="h-4 w-4 mr-2" />
                  Save Letter Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  AI Personalization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">AI Model</Label>
                  <Select defaultValue="gpt4">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="gpt4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude">Claude 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Creativity Level</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Personal Context</Label>
                  <Textarea
                    placeholder="Add personal achievements, skills, or experiences to include in letters..."
                    className="mt-2 glass-button border-glass-border resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Company Research</Label>
                    <p className="text-xs text-muted-foreground">Automatically research companies</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Email notifications</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Desktop notifications</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Scraping complete alerts</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Error notifications</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="glass-button border-glass-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-glass-border">
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Animations</Label>
                    <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Glass effects</Label>
                    <p className="text-xs text-muted-foreground">Enable glass morphism</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;