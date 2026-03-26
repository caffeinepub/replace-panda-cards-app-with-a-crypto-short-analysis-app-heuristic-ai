import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useAnalysisById } from '../../hooks/useQueries';

interface AnalysisDetailsDialogProps {
  analysisId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AnalysisDetailsDialog({
  analysisId,
  open,
  onOpenChange,
}: AnalysisDetailsDialogProps) {
  const { data: analysis, isLoading, error } = useAnalysisById(analysisId);

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('short')) return <CheckCircle2 className="w-5 h-5 text-primary" />;
    if (recommendation.toLowerCase().includes('avoid')) return <XCircle className="w-5 h-5 text-destructive" />;
    return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analysis Details</DialogTitle>
          <DialogDescription>
            Detailed breakdown of the analysis results
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load analysis details: {error instanceof Error ? error.message : 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Asset</span>
                <span className="font-mono font-bold">{analysis.asset}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Analysis Date</span>
                <span className="text-sm">{new Date(Number(analysis.timestamp)).toLocaleString()}</span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3">
                {getRecommendationIcon(analysis.recommendation)}
                <div>
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className="text-lg font-bold">{analysis.recommendation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold text-primary">{analysis.score}%</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Signal Breakdown</h3>
              <div className="space-y-2">
                {analysis.reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border"
                  >
                    <Badge variant="outline" className="mt-0.5 shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-sm leading-relaxed">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
