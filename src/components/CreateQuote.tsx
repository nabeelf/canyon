"use client";

import { PageHeader } from "./PageHeader";
import { useState, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { COMPANY_LIST_BY_ID } from "../app/consts";
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuoteMetadata {
  name: string;
  company: string;
  total_contract_value: number;
  plan: string;
  term_months: number;
  quote_type: string;
  seats: number;
  discount_percentage?: number;
}

export function CreateQuote() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [quoteMetadata, setQuoteMetadata] = useState<QuoteMetadata | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  const markdownRef = useRef<HTMLDivElement>(null);

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
        setQuoteMetadata(metadata);
      } catch (err) {
        console.error('Failed to parse quote metadata:', err);
      }
    }

    // Create a cleaned response for display by removing the tags and their content
  };

  const generatePDFBlob = async (): Promise<Blob | null> => {
    if (!markdownRef.current || !markdownContent) return null;

    try {
      // Create a temporary container for the PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';

      // Add header with metadata if available
      let headerContent = '';
      if (quoteMetadata) {
        headerContent = `
          <div style="margin-bottom: 30px; border-bottom: 2px solid #333333; padding-bottom: 20px;">
            <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">${quoteMetadata.name}</h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div><strong>Company:</strong> ${quoteMetadata.company}</div>
              <div><strong>Total Contract Value:</strong> $${quoteMetadata.total_contract_value?.toLocaleString()}</div>
              <div><strong>Plan:</strong> ${quoteMetadata.plan}</div>
              <div><strong>Term:</strong> ${quoteMetadata.term_months} months</div>
              <div><strong>Quote Type:</strong> ${quoteMetadata.quote_type}</div>
              <div><strong>Seats:</strong> ${quoteMetadata.seats?.toLocaleString()}</div>
            </div>
          </div>
        `;
      }

      // Add the header content
      tempContainer.innerHTML = headerContent;
      
      // Create a container for the markdown content
      const markdownContainer = document.createElement('div');
      markdownContainer.className = 'markdown-content';
      markdownContainer.style.cssText = `
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      `;
      tempContainer.appendChild(markdownContainer);
      
      // Render markdown to HTML using a simple approach
      const markdownElement = document.createElement('div');
      markdownElement.innerHTML = markdownContent;
      markdownElement.style.cssText = `
        h1, h2, h3, h4, h5, h6 { 
          margin: 20px 0 10px 0; 
          color: #333; 
          font-weight: bold; 
        }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        p { margin: 10px 0; }
        ul, ol { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
      `;
      markdownContainer.appendChild(markdownElement);
      
      document.body.appendChild(tempContainer);

      // Convert to canvas using html2canvas-pro - supports all modern color functions (lab, lch, oklab, oklch)
      const canvas = await html2canvas(tempContainer, {
        width: 800,
        height: tempContainer.scrollHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF using jsPDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob');
      return pdfBlob;

    } catch (err) {
      console.error('Error generating PDF blob:', err);
      return null;
    }
  };

  const generatePDF = async () => {
    if (!markdownRef.current || !markdownContent) return;

    setIsGeneratingPDF(true);
    try {
      // Create a temporary container for the PDF content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '800px';
      tempContainer.style.padding = '40px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';

      // Add header with metadata if available
      let headerContent = '';
      if (quoteMetadata) {
        headerContent = `
          <div style="margin-bottom: 30px; border-bottom: 2px solid #333333; padding-bottom: 20px;">
            <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">${quoteMetadata.name}</h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
              <div><strong>Company:</strong> ${quoteMetadata.company}</div>
              <div><strong>Total Contract Value:</strong> $${quoteMetadata.total_contract_value?.toLocaleString()}</div>
              <div><strong>Plan:</strong> ${quoteMetadata.plan}</div>
              <div><strong>Term:</strong> ${quoteMetadata.term_months} months</div>
              <div><strong>Quote Type:</strong> ${quoteMetadata.quote_type}</div>
              <div><strong>Seats:</strong> ${quoteMetadata.seats?.toLocaleString()}</div>
            </div>
          </div>
        `;
      }

      // Add the header content
      tempContainer.innerHTML = headerContent;
      
      // Create a container for the markdown content
      const markdownContainer = document.createElement('div');
      markdownContainer.className = 'markdown-content';
      markdownContainer.style.cssText = `
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      `;
      tempContainer.appendChild(markdownContainer);
      
      // Render markdown to HTML using a simple approach
      const markdownElement = document.createElement('div');
      markdownElement.innerHTML = markdownContent;
      markdownElement.style.cssText = `
        h1, h2, h3, h4, h5, h6 { 
          margin: 20px 0 10px 0; 
          color: #333; 
          font-weight: bold; 
        }
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        p { margin: 10px 0; }
        ul, ol { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
      `;
      markdownContainer.appendChild(markdownElement);
      
      document.body.appendChild(tempContainer);

      // Convert to canvas using html2canvas-pro - supports all modern color functions (lab, lch, oklab, oklch)
      const canvas = await html2canvas(tempContainer, {
        width: 800,
        height: tempContainer.scrollHeight,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF using jsPDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const filename = quoteMetadata?.name 
        ? `${quoteMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}_Quote.pdf`
        : 'Generated_Quote.pdf';

      // Download PDF
      pdf.save(filename);

      // Remove temporary container
      document.body.removeChild(tempContainer);
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
      const pdfBlob = await generatePDFBlob();
      if (!pdfBlob) {
        throw new Error('Failed to generate PDF');
      }



      // Find company ID by name
              const companyEntry = Array.from(COMPANY_LIST_BY_ID.values()).find((c: any) => c.name === quoteMetadata.company); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (!companyEntry) {
        throw new Error('Company not found');
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

      // First: Save quote document to database with filename
      const documentResponse = await fetch('/api/quote_document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteMetadata.name,
          company_id: companyEntry.id,
          tcv: quoteMetadata.total_contract_value,
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

      // Second: Create the quote itself
      const quoteResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: quoteMetadata.name,
          company_id: companyEntry.id,
          tcv: quoteMetadata.total_contract_value,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);
    setError("");

    // Add user message to chat history and clear input immediately
    const newUserMessage: ChatMessage = { role: 'user', content: userMessage };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setUserMessage(""); // Clear input immediately

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

      // Add assistant response to chat history with cleaned content
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
                  content: "✅ Quote generated successfully! The detailed quote content can be seen and saved below. You can now preview the PDF or continue the conversation." 
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
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top">
      <PageHeader
        title="Create Quote"
        subtitle="Spin up enterprise quotes instantly with our AI quote builder."
      />

      {/* Quote Builder Interface */}
      <div className="mt-8 space-y-6">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI Quote Assistant</h2>
            {chatHistory.length > 0 && (
              <button
                onClick={clearChat}
                className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
              >
                Clear Chat
              </button>
            )}
          </div>
          

          
          {/* Chat History Display */}
          {chatHistory.length > 0 && (
            <div className="mb-6 max-h-96 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-md">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userMessage" className="block text-sm font-medium text-muted-foreground mb-2">
                {chatHistory.length === 0 ? 'Describe your quote requirements' : 'Continue the conversation'}
              </label>
              <textarea
                id="userMessage"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder={chatHistory.length === 0 
                  ? "e.g., I need a quote for 100 enterprise software licenses with annual billing and volume discounts..."
                  : "Ask follow-up questions or provide more details..."
                }
                className="w-full h-32 p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Generating..." : (chatHistory.length === 0 ? "Generate Quote" : "Send Message")}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* Quote Details Page */}
          {quoteMetadata && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{quoteMetadata.name}</h3>
                  <p className="text-gray-600">Quote Details</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={saveQuote}
                    disabled={isSavingQuote}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-3 shadow-md"
                  >
                    {isSavingQuote ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        💾 Save Quote
                      </>
                    )}
                  </button>
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-3 shadow-md"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        📄 Preview Quote PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Save Message */}
              {saveMessage && (
                <div className={`mb-4 p-3 rounded-md border ${
                  saveMessage.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="text-sm font-medium">{saveMessage}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Company Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Company:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.company}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Quote Type:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.quote_type}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Plan Details</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Plan:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.plan}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Term:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.term_months} months</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Seats:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.seats?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Financial Summary</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 text-sm">Total Contract Value:</span>
                      <p className="font-bold text-2xl text-blue-600">${quoteMetadata.total_contract_value?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm">Discount:</span>
                      <p className="font-medium text-gray-900">{quoteMetadata.discount_percentage !== undefined ? quoteMetadata.discount_percentage : 0}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Markdown content for PDF generation (hidden but accessible) */}
              {markdownContent && (
                <div className="hidden">
                  <div ref={markdownRef}>
                    <ReactMarkdown>{markdownContent}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
