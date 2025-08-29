"use client";

import { DataTable } from "./DataTable";
import { QuoteDetails } from "./QuoteDetails";
import { ApprovalParty, ApprovalStatus, Quote } from "@/app/types";
import { useState } from "react";

interface QuotesProps {
  quotes: Quote[];
}

export function Quotes({ quotes }: QuotesProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
  };

  const handleBackToQuotes = () => {
    setSelectedQuote(null);
  };

  // If a quote is selected, show the details view
  if (selectedQuote) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top">
        <QuoteDetails 
          quote={selectedQuote} 
          onBack={handleBackToQuotes} 
        />
      </div>
    );
  }

  // Otherwise show the quotes table
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">Quotes</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all your enterprise quotes in one place.
            </p>
          </div>
        </div>
        
        <DataTable 
          quotes={quotes} 
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );
}
