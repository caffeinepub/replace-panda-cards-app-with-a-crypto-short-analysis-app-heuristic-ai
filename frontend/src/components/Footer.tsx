import { Heart } from 'lucide-react';

export function Footer() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname || 'crypto-short-analysis')
    : 'crypto-short-analysis';

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6 space-y-3">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © {new Date().getFullYear()}. Built with{' '}
            <Heart className="w-4 h-4 text-primary fill-primary" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
        <div className="text-center text-xs text-muted-foreground/70">
          <p>
            This tool is for informational purposes only and does not constitute financial advice. 
            Trading cryptocurrencies carries substantial risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
