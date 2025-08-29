/**
 * Downloads a quote document using the quote document API endpoint
 * @param uri - The URI/path of the quote document
 * @param quoteName - The name of the quote (used for filename)
 * @param fileExtension - The file extension to use (defaults to '.pdf')
 * @returns Promise<void>
 */
export async function downloadQuoteDocument(
  uri: string, 
  quoteName: string, 
  fileExtension: string = '.pdf'
): Promise<void> {
  try {
    const filename = `${quoteName}${fileExtension}`;
    const apiUrl = `/api/quote_document?path=${encodeURIComponent(uri)}&name=${encodeURIComponent(filename)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    
    // Append to body, click, and cleanup
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the object URL
    URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Quote document download failed:', error);
    throw new Error('Failed to download quote document. Please try again.');
  }
}
