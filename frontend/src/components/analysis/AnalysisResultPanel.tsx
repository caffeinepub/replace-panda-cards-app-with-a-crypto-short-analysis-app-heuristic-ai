import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { useAnalysisResult } from '../../hooks/useQueries';

export function AnalysisResultPanel() {
  const { data: result, isLoading, error } = useAnalysisResult();

  if (isLoading) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Analysis Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An error occurred during analysis'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return null;
  }

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('short')) return 'text-primary';
    if (recommendation.toLowerCase().includes('avoid')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.toLowerCase().includes('short')) return <CheckCircle2 className="w-5 h-5" />;
    if (recommendation.toLowerCase().includes('avoid')) return <XCircle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <Card className="border-primary/30 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Analysis Result: {result.asset}
        </CardTitle>
        <CardDescription>
          Analysis completed at {new Date(Number(result.timestamp)).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className={getRecommendationColor(result.recommendation)}>
              {getRecommendationIcon(result.recommendation)}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recommendation</p>
              <p className={`text-xl font-bold ${getRecommendationColor(result.recommendation)}`}>
                {result.recommendation}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Confidence Score</p>
            <p className="text-2xl font-bold text-primary">{result.score}%</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Signal Breakdown
          </h3>
          <div className="space-y-2">
            {result.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border/50"
              >
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  {index + 1}
                </Badge>
                <p className="text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
