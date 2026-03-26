import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <Alert className="border-amber-500/50 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-500">Important Disclaimer</AlertTitle>
      <AlertDescription className="text-sm">
        This tool is for informational and educational purposes only. The analysis provided is based on technical indicators 
        and does not constitute financial advice. Cryptocurrency trading involves substantial risk of loss. Always conduct 
        your own research and consult with qualified financial advisors before making investment decisions.
      </AlertDescription>
    </Alert>
  );
}
