import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { History, AlertCircle } from 'lucide-react';
import { useAnalysisHistory } from '../../hooks/useQueries';
import { AnalysisDetailsDialog } from './AnalysisDetailsDialog';

interface AnalysisHistoryProps {
  onSelectAnalysis: (id: string | null) => void;
  selectedAnalysisId: string | null;
}

export function AnalysisHistory({ onSelectAnalysis, selectedAnalysisId }: AnalysisHistoryProps) {
  const { data: history, isLoading, error } = useAnalysisHistory();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (id: string) => {
    onSelectAnalysis(id);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    onSelectAnalysis(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analysis history: {error instanceof Error ? error.message : 'Unknown error'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Analysis History
          </CardTitle>
          <CardDescription>Your past analyses will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              No analyses yet. Run your first analysis to get started.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Analysis History
          </CardTitle>
          <CardDescription>
            Click on any row to view detailed analysis results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(item.id)}
                >
                  <TableCell className="font-mono font-medium">{item.asset}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(Number(item.timestamp)).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.recommendation.toLowerCase().includes('short')
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {item.recommendation}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {item.score}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedAnalysisId && (
        <AnalysisDetailsDialog
          analysisId={selectedAnalysisId}
          open={detailsOpen}
          onOpenChange={handleCloseDetails}
        />
      )}
    </>
  );
}
