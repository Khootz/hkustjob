import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { parsePageInput } from '@/lib/api';

interface ScrapingDialogProps {
  onStartScraping: (pages: number[], phpSessionId: string) => void;
  isLoading: boolean;
  children: ReactNode;
}

export const ScrapingDialog = ({ onStartScraping, isLoading, children }: ScrapingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const [phpSessionId, setPhpSessionId] = useState('3716823befe2fdb680e128fc013e9fc59b9d9958b9c1eadc73136eb9b9aea835');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      setError('');
      const pages = parsePageInput(pageInput);
      
      if (pages.length > 50) {
        setError('Warning: Large page ranges may take a long time to process.');
      }
      
      onStartScraping(pages, phpSessionId);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
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
            <Label htmlFor="session">PHP Session ID</Label>
            <Input
              id="session"
              value={phpSessionId}
              onChange={(e) => setPhpSessionId(e.target.value)}
              placeholder="PHP Session ID from HKUST career site"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Copy from your browser's cookies when logged into the HKUST career portal
            </p>
          </div>

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
              onClick={handleSubmit}
              disabled={isLoading || !pageInput.trim()}
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