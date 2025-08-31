"use client";

import { QuoteDetails } from "@/components/QuoteDetails";
import { Quote } from "@/app/types";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthStatus } from "@/app/utils/auth";
import { Loading } from "@/components/ui/loading";
import { Header } from "@/components/Header";

export default function QuotePage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuthStatus();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quoteId = params.id as string;

  // Redirect to home if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, authLoading, router]);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quotes?id=${quoteId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        
        const data = await response.json();
        setQuote(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (quoteId && isLoggedIn) {
      fetchQuote();
    }
  }, [quoteId, isLoggedIn]);

  const handleBackToQuotes = () => {
    router.push('/quotes');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} />
        <Loading />
      </>
    );
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} />
        <Loading />
      </>
    );
  }

  if (error || !quote) {
    return (
      <>
        <Header isLoggedIn={isLoggedIn} />
        <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToQuotes}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quotes
            </Button>
            <div className="text-lg font-medium text-red-600">
              {error || 'Quote not found'}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top pt-20">
        <QuoteDetails 
          quote={quote} 
          onBack={handleBackToQuotes} 
        />
      </div>
    </>
  );
}
