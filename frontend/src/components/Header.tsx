import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center gap-3">
        <img 
          src="/assets/generated/crypto-short-icon.dim_128x128.png" 
          alt="Crypto Short Analysis" 
          className="w-10 h-10 rounded-lg"
          style={{ width: '40px', height: '40px' }}
        />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Crypto Short Analysis
          </h1>
          <p className="text-xs text-muted-foreground">Technical Analysis Terminal</p>
        </div>
      </div>
    </header>
  );
}
