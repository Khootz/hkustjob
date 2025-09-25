import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Loader2, AlertCircle, Bug } from 'lucide-react';
import { parsePageInput, debugScraping } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ScrapingDialogProps {
  onStartScraping: (pages: number[], phpSessionId: string) => void;
  isLoading: boolean;
  children: ReactNode;
}

export const ScrapingDialog = ({ onStartScraping, isLoading, children }: ScrapingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [phpSessionId, setPhpSessionId] = useState('');
  const [error, setError] = useState('');
  const [debugResult, setDebugResult] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = () => {
    try {
      setError('');
      const pages = parsePageInput(pageInput);
      
      if (!phpSessionId.trim()) {
        setError('PHP Session ID is required');
        return;
      }
      
      if (pages.length > 50) {
        setError('Warning: Large page ranges may take a long time to process.');
      }
      
      console.log('Sending to backend:', { pages, phpSessionId: phpSessionId.substring(0, 10) + '...' });
      onStartScraping(pages, phpSessionId);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  const handleDebugTest = async () => {
    if (!phpSessionId.trim()) {
      setError('Please enter a PHP Session ID first');
      return;
    }

    try {
      setError('');
      setDebugResult('Testing...');
      const result = await debugScraping(phpSessionId, 1);
      
      if (result.success) {
        const info = result.debug_info;
        setDebugResult(`
✅ Connected successfully!
📊 Found ${info.job_rows_found} job rows
📝 Response length: ${info.response_length} chars
🔗 URL: ${info.url}
📋 Session ID used: ${info.session_id_used}
        `.trim());
        
        toast({
          title: "Debug Test Successful",
          description: `Found ${info.job_rows_found} job rows on the page`,
        });
      } else {
        setDebugResult(`❌ Test failed: ${result.message}`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Debug test failed';
      setDebugResult(`❌ Error: ${errorMsg}`);
      setError(errorMsg);
    }
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
    setError('');
    
    try {
      const pages = parsePageInput(value);
      if (pages.length > 20) {
        setError(`Will scrape ${pages.length} pages. This may take a while.`);
      }
    } catch {
      // Don't show error while typing
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Start Job Scraping
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pages">Pages to scrape</Label>
            <Input
              id="pages"
              value={pageInput}
              onChange={(e) => handlePageInputChange(e.target.value)}
              placeholder="e.g., 1 or 1-5"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter a single page (e.g., 3) or a range (e.g., 1-10)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">PHP Session ID *</Label>
            <Input
              id="session"
              value={phpSessionId}
              onChange={(e) => setPhpSessionId(e.target.value)}
              placeholder="Enter your PHP Session ID from HKUST career site"
              disabled={isLoading}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              <strong>Required:</strong> Copy PHPSESSID cookie from career.hkust.edu.hk after logging in
            </p>
          </div>

          {debugResult && (
            <Alert className="border-blue-200 bg-blue-50">
              <Bug className="h-4 w-4" />
              <AlertDescription className="text-blue-800 whitespace-pre-line font-mono text-xs">
                {debugResult}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className={error.includes('Warning') ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={error.includes('Warning') ? 'text-yellow-800' : 'text-red-800'}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleDebugTest}
              disabled={isLoading || !phpSessionId.trim()}
              variant="outline"
              size="sm"
            >
              <Bug className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !pageInput.trim() || !phpSessionId.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Start Scraping
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};