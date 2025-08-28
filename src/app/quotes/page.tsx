import { Header } from '@/components/Header';

export default function QuotesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={false} />
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-foreground">
          Coming Soon
        </h1>
      </div>
    </div>
  );
}
