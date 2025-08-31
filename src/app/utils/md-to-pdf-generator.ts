import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

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

// Create HTML content for PDF
const createPDFHTML = async (markdownContent: string, quoteMetadata: QuoteMetadata | null): Promise<string> => {
  const cleanMarkdown = markdownContent.trim();
  const html = await marked(cleanMarkdown);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #2c3e50;
          margin: 0;
          padding: 80px;
          background: white;
        }
        .header {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
          border: 2px solid #e9ecef;
          border-left: 6px solid #007bff;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 20px;
          text-align: center;
        }
        .metadata {
          font-size: 14px;
          color: #495057;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .content {
          font-size: 14px;
          line-height: 1.6;
          color: #2c3e50;
        }
        h1, h2, h3, h4, h5, h6 {
          font-size: 20px;
          font-weight: bold;
          color: #2c3e50;
          margin-top: 25px;
          margin-bottom: 12px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 8px;
          page-break-after: avoid;
          break-after: avoid;
        }
        p {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
          text-align: justify;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        ul, ol {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
          padding-left: 25px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        li {
          margin-bottom: 6px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        code {
          font-size: 13px;
          font-family: 'Courier New', monospace;
          background: #f8f9fa;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 12px;
          border: 1px solid #e9ecef;
          color: #495057;
          display: block;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #dee2e6;
          margin-bottom: 20px;
          border-radius: 6px;
          overflow: hidden;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        th {
          background: #495057;
          color: white;
          font-weight: bold;
          text-align: center;
          padding: 12px;
          border: 1px solid #dee2e6;
        }
        td {
          padding: 12px;
          border: 1px solid #dee2e6;
          text-align: left;
          color: #495057;
        }
        strong {
          font-weight: bold;
          color: #2c3e50;
        }
        em {
          font-style: italic;
          color: #495057;
        }
        .section {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        @media print {
          body { margin: 0; }
          * {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${quoteMetadata ? `
        <div class="header">
          <div class="title">${quoteMetadata.name}</div>
          <div class="metadata">Company: ${quoteMetadata.company}</div>
          <div class="metadata">Total Contract Value: $${quoteMetadata.total_contract_value?.toLocaleString()}</div>
          <div class="metadata">Plan: ${quoteMetadata.plan}</div>
          <div class="metadata">Term: ${quoteMetadata.term_months} months</div>
          <div class="metadata">Quote Type: ${quoteMetadata.quote_type}</div>
          <div class="metadata">Seats: ${quoteMetadata.seats?.toLocaleString()}</div>
        </div>
      ` : ''}
      <div class="content">
        ${html}
      </div>
    </body>
    </html>
  `;
};

export async function generatePDFBlob(markdownContent: string, quoteMetadata: QuoteMetadata | null): Promise<Blob | null> {
  if (!markdownContent) return null;

  try {
    // Create HTML content
    const htmlContent = await createPDFHTML(markdownContent, quoteMetadata);
    
    // Create a temporary div to render the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = 'fixed'; // Use fixed instead of absolute
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px'; // Move it completely off-screen
    tempDiv.style.width = '800px';
    tempDiv.style.height = 'auto';
    tempDiv.style.overflow = 'hidden'; // Prevent any overflow
    tempDiv.style.visibility = 'hidden'; // Hide it completely
    tempDiv.style.pointerEvents = 'none'; // Disable interactions
    tempDiv.style.zIndex = '-9999'; // Put it behind everything
    
    // Store original body styles
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    
    // Prevent body scroll during PDF generation
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    
    document.body.appendChild(tempDiv);

    // Convert to canvas with better page break handling
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 800,
      windowHeight: tempDiv.scrollHeight,
    });

    // Remove temporary div and restore body styles
    document.body.removeChild(tempDiv);
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.position = originalBodyPosition;

    // Convert canvas to PDF using jsPDF with better page break handling
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 190; // Slightly smaller to account for margins
    const pageHeight = 277; // A4 height minus margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight); // 10mm margins
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position + 10, imgWidth, imgHeight); // 10mm margins
      heightLeft -= pageHeight;
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;

  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}

export async function generatePDF(markdownContent: string, quoteMetadata: QuoteMetadata | null): Promise<void> {
  if (!markdownContent) return;

  try {
    const blob = await generatePDFBlob(markdownContent, quoteMetadata);
    if (!blob) {
      throw new Error('Failed to generate PDF blob');
    }

    // Generate filename
    const filename = quoteMetadata?.name
      ? `${quoteMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}_Quote.pdf`
      : 'Generated_Quote.pdf';

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Keep as PDF
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Error generating PDF:', err);
    throw new Error('Failed to generate PDF');
  }
}
