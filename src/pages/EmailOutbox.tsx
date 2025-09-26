import { useState, useEffect } from "react";
import { 
  Mail, 
  Send, 
  Sparkles, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const EmailOutbox = () => {
  const { toast } = useToast();
  const [showNumberDialog, setShowNumberDialog] = useState(false);
  const [numberOfEmails, setNumberOfEmails] = useState(20);
  const [isSending, setIsSending] = useState(false);
  const [currentSending, setCurrentSending] = useState(0);
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  // Mock job data with company names and emails
  const mockJobs = [
    { id: 1, company: "TechCorp Inc.", position: "Senior Frontend Developer", email: "hiring@techcorp.com" },
    { id: 2, company: "StartupXYZ", position: "Full Stack Engineer", email: "careers@startupxyz.com" },
    { id: 3, company: "Digital Solutions", position: "React Developer", email: "hr@digitalsolutions.com" },
    { id: 4, company: "MegaCorp", position: "Software Engineer", email: "jobs@megacorp.com" },
    { id: 5, company: "InnovateCo", position: "Frontend Developer", email: "talent@innovateco.com" },
    { id: 6, company: "DevCorp", position: "Backend Developer", email: "recruitment@devcorp.com" },
  ];

  const handleStartSending = () => {
    setShowNumberDialog(true);
  };

  const handleConfirmSending = () => {
    setShowNumberDialog(false);
    setIsSending(true);
    setCurrentSending(0);
    setSentEmails([]);
    
    // Send emails with 1 second intervals
    const interval = setInterval(() => {
      setCurrentSending(prev => {
        const next = prev + 1;
        const job = mockJobs[(next - 1) % mockJobs.length];
        const emailDescription = `Email to ${job.company} (${job.email})`;
        
        setSentEmails(prevEmails => [...prevEmails, emailDescription]);
        
        if (next >= numberOfEmails) {
          clearInterval(interval);
          setIsSending(false);
          toast({
            title: "All Emails Sent!",
            description: `Successfully sent ${numberOfEmails} emails.`,
          });
        }
        
        return next;
      });
    }, 1000); // 1 second interval
  };

  const progress = isSending ? (currentSending / numberOfEmails) * 100 : 0;

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Email Sender</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Send personalized emails to job applications</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Action Card */}
        <Card className="glass-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Mail className="h-6 w-6 text-primary" />
              Email Sending
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!isSending ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to send personalized emails to companies from your job database
                </p>
                <Button 
                  onClick={handleStartSending}
                  size="lg"
                  className="action-button gradient-primary text-white px-8 py-3 text-lg"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Emails
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="font-medium">Sending emails...</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentSending} of {numberOfEmails} sent
                  </p>
                </div>
                
                <Progress value={progress} className="w-full max-w-md mx-auto" />
                
                {currentSending > 0 && (
                  <div className="text-sm text-primary font-medium">
                    Currently sending: {sentEmails[sentEmails.length - 1]}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sending Results */}
        {sentEmails.length > 0 && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Sent Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {sentEmails.map((email, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{email}</span>
                  </div>
                ))}
              </div>
              
              {!isSending && sentEmails.length === numberOfEmails && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button className="w-full" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    View Email History
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Number Selection Dialog */}
      <Dialog open={showNumberDialog} onOpenChange={setShowNumberDialog}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>How many emails to send?</DialogTitle>
            <DialogDescription>
              Select the number of emails you want to send from your job database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-number-input">Number of emails</Label>
              <Input
                id="email-number-input"
                type="number"
                min="1"
                max="50"
                value={numberOfEmails}
                onChange={(e) => setNumberOfEmails(parseInt(e.target.value) || 1)}
                className="glass-button"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This will send {numberOfEmails} personalized emails with 1 second intervals
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNumberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSending} className="action-button">
              <Send className="h-4 w-4 mr-2" />
              Start Sending
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailOutbox;