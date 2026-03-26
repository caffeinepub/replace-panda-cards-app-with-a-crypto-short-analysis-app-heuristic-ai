import { useState } from 'react';
import { AnalysisForm } from '../components/analysis/AnalysisForm';
import { AnalysisResultPanel } from '../components/analysis/AnalysisResultPanel';
import { AnalysisHistory } from '../components/analysis/AnalysisHistory';
import { Disclaimer } from '../components/Disclaimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export function CryptoShortAnalysisPage() {
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Crypto Short Analysis Terminal</h1>
        <p className="text-muted-foreground">
          Analyze cryptocurrency price data with technical indicators to identify potential short opportunities
        </p>
      </div>

      <Disclaimer />

      <Separator className="my-6" />

      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="analysis">New Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <AnalysisForm />
          <AnalysisResultPanel />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <AnalysisHistory 
            onSelectAnalysis={setSelectedAnalysisId}
            selectedAnalysisId={selectedAnalysisId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
