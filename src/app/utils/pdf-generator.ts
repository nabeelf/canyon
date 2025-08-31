import { QuoteMetadata } from "../types";

export async function generatePDF(markdownContent: string, quoteMetadata: QuoteMetadata | null): Promise<void> {
  if (!markdownContent) return;

  try {
    // Call the server-side PDF generation API
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

    // Get the PDF blob from the response
    const pdfBlob = await response.blob();

    // Generate filename
    const filename = quoteMetadata?.name
      ? `${quoteMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}_Quote.pdf`
      : 'Generated_Quote.pdf';

    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Error generating PDF:', err);
    throw new Error('Failed to generate PDF');
  }
}
