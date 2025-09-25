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
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const CoverLetterStudio = () => {
  const { toast } = useToast();
  const [tone, setTone] = useState(70);
  const [length, setLength] = useState(50);
  const [selectedJob, setSelectedJob] = useState("senior-frontend");
  const [customHighlights, setCustomHighlights] = useState("");

  const jobOptions = [
    { value: "senior-frontend", label: "Senior Frontend Developer - TechCorp" },
    { value: "fullstack", label: "Full Stack Engineer - StartupXYZ" },
    { value: "react-dev", label: "React Developer - Digital Solutions" },
    { value: "software-eng", label: "Software Engineer - MegaCorp" }
  ];

  const handleGeneratePreview = () => {
    toast({
      title: "Generating Preview",
      description: "Creating personalized cover letter with your settings...",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your cover letter has been downloaded successfully!",
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Your customizations have been saved for future use.",
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold gradient-text">Cover Letter Studio</h1>
            <p className="text-muted-foreground">Create and customize personalized cover letters</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveTemplate} variant="outline" className="glass-button">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={handleDownloadPDF} className="action-button gradient-primary text-white">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Job Selection */}
          <Card className="glass-card animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Job Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Target Position</Label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger className="glass-button border-glass-border mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-panel border-glass-border">
                    {jobOptions.map((job) => (
                      <SelectItem key={job.value} value={job.value}>
                        {job.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGeneratePreview} className="w-full action-button">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Preview
              </Button>
            </CardContent>
          </Card>

          {/* Personalization Controls */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-primary" />
                Personalization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium flex items-center justify-between">
                  Tone
                  <span className="text-xs text-muted-foreground">
                    {tone < 30 ? 'Professional' : tone < 70 ? 'Balanced' : 'Enthusiastic'}
                  </span>
                </Label>
                <Slider
                  value={[tone]}
                  onValueChange={(value) => setTone(value[0])}
                  max={100}
                  step={1}
                  className="mt-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Formal</span>
                  <span>Casual</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center justify-between">
                  Length
                  <span className="text-xs text-muted-foreground">
                    {length < 30 ? 'Concise' : length < 70 ? 'Standard' : 'Detailed'}
                  </span>
                </Label>
                <Slider
                  value={[length]}
                  onValueChange={(value) => setLength(value[0])}
                  max={100}
                  step={1}
                  className="mt-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Brief</span>
                  <span>Comprehensive</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Custom Highlights</Label>
                <Textarea
                  placeholder="Add specific achievements or skills to emphasize..."
                  value={customHighlights}
                  onChange={(e) => setCustomHighlights(e.target.value)}
                  className="mt-2 glass-button border-glass-border resize-none"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Options */}
          <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Template Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Style</Label>
                <Select defaultValue="modern">
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
                <Label className="text-sm font-medium">Font</Label>
                <Select defaultValue="inter">
                  <SelectTrigger className="glass-button border-glass-border mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-panel border-glass-border">
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="helvetica">Helvetica</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                    <SelectItem value="georgia">Georgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="border-b border-glass-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Live Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="glass-button">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                  <Button size="sm" variant="outline" className="glass-button">
                    <Type className="h-3 w-3 mr-1" />
                    Zoom
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* PDF Preview Mock */}
              <div className="aspect-[8.5/11] bg-white m-6 rounded-lg shadow-lg border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50">
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="border-b pb-4">
                      <h1 className="text-xl font-bold text-gray-800">John Doe</h1>
                      <p className="text-sm text-gray-600">john.doe@email.com • (555) 123-4567</p>
                    </div>

                    {/* Date and Address */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{new Date().toLocaleDateString()}</p>
                      <p className="pt-2">Hiring Manager<br />TechCorp Inc.<br />San Francisco, CA</p>
                    </div>

                    {/* Letter Content */}
                    <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                      <p>Dear Hiring Manager,</p>
                      
                      <p>I am writing to express my strong interest in the Senior Frontend Developer position at TechCorp Inc. With over 5 years of experience in modern web development and a passion for creating exceptional user experiences, I am excited about the opportunity to contribute to your innovative team.</p>
                      
                      <p>In my current role, I have successfully led multiple React-based projects, implementing scalable architectures and optimizing performance for applications serving millions of users. My expertise in TypeScript, Next.js, and modern development practices aligns perfectly with your requirements.</p>
                      
                      <p>I am particularly drawn to TechCorp's commitment to innovation and would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your continued success.</p>
                      
                      <p>Thank you for considering my application. I look forward to hearing from you.</p>
                      
                      <p className="pt-4">Sincerely,<br />John Doe</p>
                    </div>
                  </div>
                </div>

                {/* Glass overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent pointer-events-none"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterStudio;