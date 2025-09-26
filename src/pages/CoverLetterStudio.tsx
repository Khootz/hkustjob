import { useState } from "react";
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Sparkles, 
  Palette, 
  Type,
  Sliders,
  RefreshCw,
  Save,
  Clock,
  CheckCircle,
  Mail,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CoverLetterStudio = () => {
  const { toast } = useToast();
  const [generateCount, setGenerateCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock job data based on backend output
  const jobStats = {
    totalJobs: 533,
    completed: 513,
    pending: 12,
    noEmail: 8
  };

  const pendingJobs = [
    {
      id: 515,
      company: "Huawei Tech. Investment Co., Limited (華為技術投資有限公司)",
      position: "Research Intern (6 months or above)",
      email: "hkrcrecruit@huawei.com"
    },
    {
      id: 516,
      company: "Ann Health Services (安然康健服務)",
      position: "Creative Writer Intern (Marketing Stream)",
      email: "hr@ahealth.com.hk"
    },
    {
      id: 517,
      company: "HONG KONG COMPETENCE EDUCATION FOUNDATION LIMITED",
      position: "Part Time Tutor",
      email: "hr@hkcef.info"
    },
    {
      id: 518,
      company: "Ratingdog (瑞霆狗（深圳）信息技术有限公司)",
      position: "Analysts (Macro Strategy)",
      email: "recruitment@ratingdog.cn"
    },
    {
      id: 519,
      company: "Doo Technology Limited (都會科技有限公司)",
      position: "Customer Service Executive",
      email: "hk.jobs@doogroup.com"
    }
  ];

  const handleGenerateCoverLetters = async () => {
    setIsGenerating(true);
    toast({
      title: "Generating Cover Letters",
      description: `Generating ${generateCount} cover letters...`,
    });
    
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Cover Letters Generated",
        description: `Successfully generated ${generateCount} cover letters!`,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Cover Letter Generator</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Generate cover letters for pending job applications</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button 
            onClick={handleGenerateCoverLetters} 
            disabled={isGenerating}
            className="action-button gradient-primary text-white w-full sm:w-auto text-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Cover Letters
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Status Summary */}
        <div className="space-y-4 sm:space-y-6">
          {/* Job Stats */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Job Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{jobStats.completed}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{jobStats.pending}</div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t border-glass-border">
                <div className="text-sm text-muted-foreground">
                  Total Jobs: <span className="font-medium">{jobStats.totalJobs}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  No Email: <span className="font-medium text-amber-600">{jobStats.noEmail}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Settings */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Number of Cover Letters to Generate</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[generateCount]}
                    onValueChange={(value) => setGenerateCount(value[0])}
                    max={jobStats.pending}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="min-w-[3rem] justify-center">
                    {generateCount}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Max: {jobStats.pending} pending jobs
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Queue */}
        <div>
          <Card className="glass-card h-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Next Jobs Ready for Cover Letters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {pendingJobs.slice(0, generateCount).map((job, index) => (
                <div
                  key={job.id}
                  className={`p-3 rounded-lg border transition-all ${
                    index < generateCount 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/5 border-muted/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Badge variant="outline" className="text-xs">
                        #{job.id}
                      </Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{job.company}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {job.position}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <Mail className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600 truncate">{job.email}</span>
                      </div>
                    </div>
                    {index < generateCount && (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
              {pendingJobs.length > generateCount && (
                <div className="text-center py-3 border-t border-glass-border">
                  <p className="text-sm text-muted-foreground">
                    +{pendingJobs.length - generateCount} more jobs available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterStudio;