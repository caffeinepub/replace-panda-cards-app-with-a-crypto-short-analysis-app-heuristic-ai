import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingDown } from 'lucide-react';
import { useRunAnalysis } from '../../hooks/useQueries';
import { parseOHLCVData } from '../../utils/ohlcvParser';
import { toast } from 'sonner';

export function AnalysisForm() {
  const [asset, setAsset] = useState('');
  const [ohlcvText, setOhlcvText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  const runAnalysisMutation = useRunAnalysis();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setParseError(null);

    if (!asset.trim()) {
      setParseError('Please enter an asset identifier');
      return;
    }

    if (!ohlcvText.trim()) {
      setParseError('Please paste OHLCV data');
      return;
    }

    try {
      const parsedData = parseOHLCVData(ohlcvText);
      
      await runAnalysisMutation.mutateAsync({
        asset: asset.trim(),
        ohlcvData: parsedData,
      });

      toast.success('Analysis completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse data';
      setParseError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-primary" />
          Run Analysis
        </CardTitle>
        <CardDescription>
          Enter the asset identifier and paste OHLCV (Open, High, Low, Close, Volume) data to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Asset Identifier</Label>
            <Input
              id="asset"
              placeholder="e.g., BTC/USD, ETH/USD"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ohlcv">OHLCV Data (CSV format)</Label>
            <Textarea
              id="ohlcv"
              placeholder="timestamp,open,high,low,close,volume&#10;1234567890,50000,51000,49500,50500,1000&#10;1234567900,50500,51500,50000,51000,1200&#10;..."
              value={ohlcvText}
              onChange={(e) => setOhlcvText(e.target.value)}
              className="font-mono text-sm min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Paste CSV data with columns: timestamp, open, high, low, close, volume (minimum 14 rows required for RSI calculation)
            </p>
          </div>

          {parseError && (
            <Alert variant="destructive">
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={runAnalysisMutation.isPending}
          >
            {runAnalysisMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
