"use client";

import { Quotes } from "@/components/Quotes";
import { Quote } from "@/app/types";
import { useState, useEffect } from "react";
import { LoggedInLayout } from "@/components/LoggedInLayout";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Fetch quotes data
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        const result = await response.json();
        
        if (result.success) {
          setQuotes(result.data);
        } else {
          console.error('API error:', result.error, result.message);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <LoggedInLayout>
      <Quotes quotes={quotes} />
    </LoggedInLayout>
  );
}
