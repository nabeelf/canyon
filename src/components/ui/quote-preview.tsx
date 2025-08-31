import { useRef } from "react";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";

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

interface QuotePreviewProps {
  quoteMetadata: QuoteMetadata;
  markdownContent: string;
  isSavingQuote: boolean;
  isGeneratingPDF: boolean;
  saveMessage: string;
  onSaveQuote: () => void;
  onGeneratePDF: () => void;
}

export function QuotePreview({
  quoteMetadata,
  markdownContent,
  isSavingQuote,
  isGeneratingPDF,
  saveMessage,
  onSaveQuote,
  onGeneratePDF
}: QuotePreviewProps) {
  const markdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="quote-preview">
      <div className="quote-preview-header">
        <div className="quote-preview-title">
          <h3 className="quote-preview-name">{quoteMetadata.name}</h3>
          <p className="quote-preview-subtitle">Quote Details</p>
        </div>
        <div className="quote-preview-actions">
          <Button
            onClick={onSaveQuote}
            disabled={isSavingQuote}
            variant="default"
            className="quote-save-button"
          >
            {isSavingQuote ? (
              <>
                <div className="quote-loading-spinner"></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Quote
              </>
            )}
          </Button>
          <Button
            onClick={onGeneratePDF}
            disabled={isGeneratingPDF}
            variant="default"
            className="quote-pdf-button"
          >
            {isGeneratingPDF ? (
              <>
                <div className="quote-loading-spinner"></div>
                Generating PDF...
              </>
            ) : (
              <>
                📄 Preview Quote PDF
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Save Message */}
      {saveMessage && (
        <div className={`quote-save-message ${saveMessage.includes('✅') ? 'quote-save-success' : 'quote-save-error'}`}>
          <p className="quote-save-text">{saveMessage}</p>
        </div>
      )}
      
      <div className="quote-preview-grid">
        <div className="quote-preview-card">
          <h4 className="quote-preview-card-title">Company Information</h4>
          <div className="quote-preview-card-content">
            <div className="quote-preview-item">
              <span className="quote-preview-label">Company:</span>
              <p className="quote-preview-value">{quoteMetadata.company}</p>
            </div>
            <div className="quote-preview-item">
              <span className="quote-preview-label">Quote Type:</span>
              <p className="quote-preview-value">{quoteMetadata.quote_type}</p>
            </div>
          </div>
        </div>
        
        <div className="quote-preview-card">
          <h4 className="quote-preview-card-title">Plan Details</h4>
          <div className="quote-preview-card-content">
            <div className="quote-preview-item">
              <span className="quote-preview-label">Plan:</span>
              <p className="quote-preview-value">{quoteMetadata.plan}</p>
            </div>
            <div className="quote-preview-item">
              <span className="quote-preview-label">Term:</span>
              <p className="quote-preview-value">{quoteMetadata.term_months} months</p>
            </div>
            <div className="quote-preview-item">
              <span className="quote-preview-label">Seats:</span>
              <p className="quote-preview-value">{quoteMetadata.seats?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="quote-preview-card">
          <h4 className="quote-preview-card-title">Financial Summary</h4>
          <div className="quote-preview-card-content">
            <div className="quote-preview-item">
              <span className="quote-preview-label">Total Contract Value:</span>
              <p className="quote-preview-value quote-preview-value-highlight">${quoteMetadata.total_contract_value?.toLocaleString()}</p>
            </div>
            <div className="quote-preview-item">
              <span className="quote-preview-label">Discount:</span>
              <p className="quote-preview-value">{quoteMetadata.discount_percentage !== undefined ? quoteMetadata.discount_percentage : 0}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Markdown content for PDF generation (hidden but accessible) */}
      {markdownContent && (
        <div className="quote-preview-markdown">
          <div ref={markdownRef}>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
