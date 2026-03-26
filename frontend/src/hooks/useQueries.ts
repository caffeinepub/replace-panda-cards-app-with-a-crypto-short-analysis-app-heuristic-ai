import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Types for crypto analysis (matching expected backend interface)
export interface OHLCVDataPoint {
  timestamp: bigint;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AnalysisResult {
  id: string;
  asset: string;
  timestamp: bigint;
  recommendation: string;
  score: number;
  reasons: string[];
}

export interface AnalysisSummary {
  id: string;
  asset: string;
  timestamp: bigint;
  recommendation: string;
  score: number;
}

// Store for the latest analysis result (temporary until backend is ready)
let latestAnalysisResult: AnalysisResult | null = null;
let analysisHistoryStore: AnalysisSummary[] = [];

// Mock analysis function (will be replaced with actual backend call)
function mockAnalysis(asset: string, ohlcvData: OHLCVDataPoint[]): AnalysisResult {
  // Simple mock logic based on data length and last close price
  const lastClose = ohlcvData[ohlcvData.length - 1]?.close || 0;
  const firstClose = ohlcvData[0]?.close || 0;
  const priceChange = ((lastClose - firstClose) / firstClose) * 100;
  
  let recommendation = 'Neutral';
  let score = 50;
  const reasons: string[] = [];

  if (priceChange > 10) {
    recommendation = 'Consider Short';
    score = 75;
    reasons.push('Price has increased significantly (+' + priceChange.toFixed(2) + '%), indicating potential overbought conditions');
    reasons.push('Strong upward momentum may be due for a correction');
  } else if (priceChange < -10) {
    recommendation = 'Avoid Short';
    score = 30;
    reasons.push('Price has decreased significantly (' + priceChange.toFixed(2) + '%), already in downtrend');
    reasons.push('Further shorting may have limited profit potential');
  } else {
    recommendation = 'Neutral - Insufficient Signal';
    score = 50;
    reasons.push('Price movement is relatively flat (' + priceChange.toFixed(2) + '%)');
    reasons.push('No strong technical signals detected for short position');
  }

  reasons.push('Analysis based on ' + ohlcvData.length + ' data points');

  const result: AnalysisResult = {
    id: Date.now().toString(),
    asset,
    timestamp: BigInt(Date.now()),
    recommendation,
    score,
    reasons,
  };

  return result;
}

export function useRunAnalysis() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ asset, ohlcvData }: { asset: string; ohlcvData: OHLCVDataPoint[] }) => {
      // TODO: Replace with actual backend call when available
      // if (!actor) throw new Error('Actor not initialized');
      // return await actor.submitAnalysis(asset, ohlcvData);
      
      // Mock implementation
      const result = mockAnalysis(asset, ohlcvData);
      latestAnalysisResult = result;
      
      // Add to history
      analysisHistoryStore.unshift({
        id: result.id,
        asset: result.asset,
        timestamp: result.timestamp,
        recommendation: result.recommendation,
        score: result.score,
      });
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysisResult'] });
      queryClient.invalidateQueries({ queryKey: ['analysisHistory'] });
    },
  });
}

export function useAnalysisResult() {
  return useQuery<AnalysisResult | null>({
    queryKey: ['analysisResult'],
    queryFn: async () => {
      // TODO: Replace with actual backend call when available
      return latestAnalysisResult;
    },
    staleTime: 0,
  });
}

export function useAnalysisHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<AnalysisSummary[]>({
    queryKey: ['analysisHistory'],
    queryFn: async () => {
      // TODO: Replace with actual backend call when available
      // if (!actor) return [];
      // return await actor.listAnalysisHistory();
      
      // Mock implementation
      return analysisHistoryStore;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnalysisById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<AnalysisResult>({
    queryKey: ['analysis', id],
    queryFn: async () => {
      // TODO: Replace with actual backend call when available
      // if (!actor) throw new Error('Actor not initialized');
      // return await actor.getAnalysisById(BigInt(id));
      
      // Mock implementation
      const found = analysisHistoryStore.find(a => a.id === id);
      if (!found) throw new Error('Analysis not found');
      
      // Return full result (in real implementation, backend would have this)
      return {
        ...found,
        reasons: [
          'Mock reason 1: Technical indicator analysis',
          'Mock reason 2: Price action evaluation',
          'Mock reason 3: Volume analysis',
        ],
      };
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
