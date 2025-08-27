import { Header } from '@/components/Header';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background transition-smooth">
      <Header isLoggedIn={false} />
      <div className="flex items-center justify-center min-h-screen animate-slide-in-top">
        <h1 className="text-4xl font-bold text-foreground">
          Coming Soon
        </h1>
      </div>
    </div>
  );
}
