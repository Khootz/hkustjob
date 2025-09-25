import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import type { ScrapingProgress } from '@/types/jobs';

interface ScrapingProgressProps {
  progress: ScrapingProgress;
  onCancel?: () => void;
}

export const ScrapingProgressCard = ({ progress }: ScrapingProgressProps) => {
  const progressPercentage = progress.total_pages > 0 
    ? (progress.completed_pages / progress.total_pages) * 100 
    : 0;

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_progress':
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'completed':
        return 'Scraping completed successfully!';
      case 'error':
        return 'Scraping encountered an error';
      case 'in_progress':
      default:
        return `Scraping in progress... (Page ${progress.completed_pages}/${progress.total_pages})`;
    }
  };

  return (
    <Card className="glass-card w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Job Scraping Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pages processed</span>
            <span>{progress.completed_pages} / {progress.total_pages}</span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Jobs found</span>
            <span className="font-medium text-green-600">{progress.total_jobs_found}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>New jobs</span>
            <span className="font-medium text-blue-600">{progress.new_jobs}</span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {getStatusText()}
        </div>

        {progress.message && (
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {progress.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};