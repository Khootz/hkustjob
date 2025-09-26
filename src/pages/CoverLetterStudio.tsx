import { useState, useEffect } from "react";
import { 
  FileText, 
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

const CoverLetterStudio = () => {
  const { toast } = useToast();
  const [showNumberDialog, setShowNumberDialog] = useState(false);
  const [numberOfLetters, setNumberOfLetters] = useState(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerating, setCurrentGenerating] = useState(0);
  const [generatedLetters, setGeneratedLetters] = useState<string[]>([]);

  const handleStartGeneration = () => {
    setShowNumberDialog(true);
  };

  const handleConfirmGeneration = () => {
    setShowNumberDialog(false);
    setIsGenerating(true);
    setCurrentGenerating(0);
    setGeneratedLetters([]);
    
    // Simulate generation process (18 seconds total)
    const interval = setInterval(() => {
      setCurrentGenerating(prev => {
        const next = prev + 1;
        setGeneratedLetters(prevLetters => [...prevLetters, `Cover letter ${next}`]);
        
        if (next >= numberOfLetters) {
          clearInterval(interval);
          setIsGenerating(false);
          toast({
            title: "Generation Complete!",
            description: `Successfully generated ${numberOfLetters} cover letters.`,
          });
        }
        
        return next;
      });
    }, (18 * 1000) / numberOfLetters); // 18 seconds divided by number of letters
  };

  const progress = isGenerating ? (currentGenerating / numberOfLetters) * 100 : 0;

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="glass-button p-2 rounded-lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Cover Letter Generator</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Generate personalized cover letters for your job applications</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Action Card */}
        <Card className="glass-card animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-primary" />
              Cover Letter Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {!isGenerating ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Ready to generate personalized cover letters based on your job database
                </p>
                <Button 
                  onClick={handleStartGeneration}
                  size="lg"
                  className="action-button gradient-primary text-white px-8 py-3 text-lg"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Cover Letters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="font-medium">Generating cover letters...</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentGenerating} of {numberOfLetters} completed
                  </p>
                </div>
                
                <Progress value={progress} className="w-full max-w-md mx-auto" />
                
                {currentGenerating > 0 && (
                  <div className="text-sm text-primary font-medium">
                    Currently generating: {generatedLetters[generatedLetters.length - 1]}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generation Results */}
        {generatedLetters.length > 0 && (
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Cover Letters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {generatedLetters.map((letter, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{letter}</span>
                  </div>
                ))}
              </div>
              
              {!isGenerating && generatedLetters.length === numberOfLetters && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button className="w-full" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Generated Letters
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
            <DialogTitle>How many cover letters to generate?</DialogTitle>
            <DialogDescription>
              Select the number of cover letters you want to generate from your job database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="number-input">Number of cover letters</Label>
              <Input
                id="number-input"
                type="number"
                min="1"
                max="50"
                value={numberOfLetters}
                onChange={(e) => setNumberOfLetters(parseInt(e.target.value) || 1)}
                className="glass-button"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This will generate {numberOfLetters} personalized cover letters (estimated time: 18 seconds)
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNumberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmGeneration} className="action-button">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Generation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverLetterStudio;