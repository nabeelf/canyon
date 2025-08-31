"use client";

import { PageHeader } from "./PageHeader";
import { useState } from "react";
import { COMPANY_LIST_BY_ID } from "../app/consts";
import { v4 as uuidv4 } from 'uuid';
import { ChatInterface } from "@/components/ui/chat-interface";
import { QuotePreview } from "@/components/ui/quote-preview";
import { generatePDF } from "@/app/utils/pdf-generator";
import { QuoteMetadata } from "@/app/types";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
}

export function CreateQuote() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [quoteMetadata, setQuoteMetadata] = useState<QuoteMetadata | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  const parseResponse = (content: string) => {
    // Extract markdown content between <MARKDOWN> tags
    const markdownMatch = content.match(/<MARKDOWN>([\s\S]*?)<\/MARKDOWN>/);
    if (markdownMatch) {
      const markdown = markdownMatch[1].trim();
      setMarkdownContent(markdown);
    }

    // Extract quote metadata between <QUOTE_METADATA> tags
    const metadataMatch = content.match(/<QUOTE_METADATA>([\s\S]*?)<\/QUOTE_METADATA>/);
    if (metadataMatch) {
      try {
        const metadataJson = metadataMatch[1].trim();
        const metadata = JSON.parse(metadataJson);
        
        // Find company by name
        const companyEntry = Array.from(COMPANY_LIST_BY_ID.values()).find((c) => c.name === metadata.company);
        if (!companyEntry) {
          throw new Error('Company not found');
        }
        
        // Replace company name with full company object
        metadata.company = companyEntry;
        setQuoteMetadata(metadata);
      } catch (err) {
        console.error('Failed to parse quote metadata:', err);
      }
    }
  };

  const createPDFBlob = async (): Promise<Blob | null> => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdownContent,
          quoteMetadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF blob:', error);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    if (!markdownContent) return;

    setIsGeneratingPDF(true);
    try {
      await generatePDF(markdownContent, quoteMetadata);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const saveQuote = async () => {
    if (!quoteMetadata || !markdownContent) return;

    setIsSavingQuote(true);
    setSaveMessage("");
    
    try {
      // Generate UUID for filename
      const uuid = uuidv4();
      
      // Generate PDF first
      const pdfBlob = await createPDFBlob();
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }

      // Convert PDF blob to base64 for backend upload
      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data:application/pdf;base64, prefix
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
      });

      // First: Save quote document to storage with filename
      const documentResponse = await fetch('/api/quote_document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteMetadata.name,
          company_id: quoteMetadata.company.id,
          tcv: quoteMetadata.tcv,
          plan: quoteMetadata.plan,
          term_months: quoteMetadata.term_months,
          quote_type: quoteMetadata.quote_type,
          seats: quoteMetadata.seats,
          discount_percentage: quoteMetadata.discount_percentage || 0,
          filename: uuid,
          step_number: 1,
          pdfData: pdfBase64,
        }),
      });

      const documentResult = await documentResponse.json();

      if (!documentResponse.ok) {
        throw new Error(documentResult.error || 'Failed to save quote document');
      }

      // Second: Create the quote itself in the database
      const quoteResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteMetadata.name,
          company_id: quoteMetadata.company.id,
          tcv: quoteMetadata.tcv,
          plan: quoteMetadata.plan,
          term_months: quoteMetadata.term_months,
          quote_type: quoteMetadata.quote_type,
          seats: quoteMetadata.seats,
          discount_percentage: quoteMetadata.discount_percentage || 0,
          filename: uuid,
          step_number: 1,
        }),
      });

      const quoteResult = await quoteResponse.json();

      if (!quoteResponse.ok) {
        throw new Error(quoteResult.error || 'Failed to create quote');
      }

      setSaveMessage("✅ Quote saved successfully with PDF! You can configure approval steps on the Quotes tab.");
      
      // Clear the message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
      
    } catch (err) {
      setSaveMessage("❌ Failed to save quote: " + (err instanceof Error ? err.message : 'Unknown error'));
      
      // Clear the error message after 5 seconds
      setTimeout(() => setSaveMessage(""), 5000);
    } finally {
      setIsSavingQuote(false);
    }
  };

  const handleSubmit = async (message: string) => {
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError("");

    // Add user message to chat history
    const newUserMessage: ChatMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);

    try {
      const response = await fetch('/api/create-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedHistory,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get completion');
      }

      // Parse the response for markdown and metadata
      parseResponse(result.data);

      // Strip tags from the response for display in chat
      const cleanResponse = result.data
        .replace(/<MARKDOWN>[\s\S]*?<\/MARKDOWN>/g, '')
        .replace(/<QUOTE_METADATA>[\s\S]*?<\/QUOTE_METADATA>/g, '')
        .trim();

      // Add assistant response to chat history with cleaned content
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: cleanResponse || "Quote generated successfully! Check the details below."
      };
      setChatHistory([...updatedHistory, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setError("");
    setMarkdownContent("");
    setQuoteMetadata(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-8 animate-slide-in-top">
      <PageHeader
        title="Create Quote"
        subtitle="Spin up enterprise quotes instantly with our AI quote builder."
      />

      {/* Quote Builder Interface */}
      <div className="mt-8 space-y-6">
        <ChatInterface
          chatHistory={chatHistory}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSubmit}
          onClearChat={clearChat}
        />

        {/* Quote Preview */}
        {quoteMetadata && (
          <QuotePreview
            quoteMetadata={quoteMetadata}
            markdownContent={markdownContent}
            isSavingQuote={isSavingQuote}
            isGeneratingPDF={isGeneratingPDF}
            saveMessage={saveMessage}
            onSaveQuote={saveQuote}
            onGeneratePDF={handleGeneratePDF}
          />
        )}
      </div>
    </div>
  );
}
