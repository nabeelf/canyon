import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import { QuoteMetadata } from "@/app/types";



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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', 'Helvetica', 'Arial', sans-serif;
          font-size: 11px;
          line-height: 1.5;
          color: #1a202c;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        
        .document-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: #ffffff;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          position: relative;
          overflow: hidden;
          page-break-inside: avoid;
          break-inside: avoid;
          page-break-after: avoid;
          break-after: avoid;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(30px, -30px);
        }
        
        .title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        
        .metadata-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 20px;
        }
        
        .metadata-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .metadata-label {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .metadata-value {
          font-size: 12px;
          font-weight: 600;
          color: white;
        }
        
        .content {
          font-size: 11px;
          line-height: 1.6;
          color: #2d3748;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-size: 16px;
          font-weight: 600;
          color: #1a202c;
          margin-top: 25px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
          page-break-after: avoid;
          break-after: avoid;
        }
        
        h1 {
          font-size: 20px;
          color: #2d3748;
          border-bottom: 3px solid #667eea;
        }
        
        h2 {
          font-size: 18px;
          color: #2d3748;
          border-bottom: 2px solid #667eea;
        }
        
        h3 {
          font-size: 14px;
          color: #4a5568;
          border-bottom: 1px solid #e2e8f0;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        
        h4, h5, h6 {
          font-size: 12px;
          color: #718096;
          border-bottom: none;
          margin-top: 15px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        p {
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 12px;
          text-align: justify;
          color: #4a5568;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        ul, ol {
          font-size: 11px;
          line-height: 1.6;
          margin-bottom: 15px;
          padding-left: 20px;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        li {
          margin-bottom: 6px;
          color: #4a5568;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        code {
          font-size: 10px;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          background: #f7fafc;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 12px;
          border: 1px solid #e2e8f0;
          color: #2d3748;
          display: block;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
          border: none;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        td {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          text-align: left;
          color: #4a5568;
          font-size: 10px;
          background: #ffffff;
        }
        
        tr:nth-child(even) td {
          background: #f7fafc;
        }
        
        strong {
          font-weight: 600;
          color: #1a202c;
        }
        
        em {
          font-style: italic;
          color: #4a5568;
        }
        
        .section {
          margin-bottom: 20px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .highlight-box {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          box-shadow: 0 4px 12px rgba(240, 147, 251, 0.2);
        }
        
        .info-box {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
        }
        
        .success-box {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          box-shadow: 0 4px 12px rgba(67, 233, 123, 0.2);
        }
        
        .warning-box {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          box-shadow: 0 4px 12px rgba(250, 112, 154, 0.2);
        }
        
        .footer {
          margin-top: 40px;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
          border-top: 3px solid #667eea;
          text-align: center;
          font-size: 10px;
          color: #718096;
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
      <div class="document-container">
        ${quoteMetadata ? `
          <div class="header">
            <div class="title">${quoteMetadata.name}</div>
            <div class="metadata-grid">
              <div class="metadata-item">
                <span class="metadata-label">Company</span>
                <span class="metadata-value">${quoteMetadata.company.name}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Total Contract Value</span>
                <span class="metadata-value">$${quoteMetadata.tcv?.toLocaleString()}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Plan</span>
                <span class="metadata-value">${quoteMetadata.plan}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Term</span>
                <span class="metadata-value">${quoteMetadata.term_months} months</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Quote Type</span>
                <span class="metadata-value">${quoteMetadata.quote_type}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-label">Seats</span>
                <span class="metadata-value">${quoteMetadata.seats?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ` : ''}
        <div class="content">
          ${html}
        </div>
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>This quote is valid for 30 days from the date of generation.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { markdownContent, quoteMetadata } = await request.json();

    if (!markdownContent) {
      return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
    }

    // Create HTML content
    const htmlContent = await createPDFHTML(markdownContent, quoteMetadata);

    // Determine environment and load appropriate Puppeteer
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: any;
    let launchOptions: any = {
      headless: true,
    };

    if (isVercel) {
      // Use puppeteer-core with @sparticuz/chromium on Vercel
      const chromium = (await import("@sparticuz/chromium")).default;
      puppeteer = await import("puppeteer-core");
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      };
    } else {
      // Use regular puppeteer for local development with macOS fixes
      puppeteer = await import("puppeteer");
      
      // Try to use system Chrome on macOS if available
      const systemChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
      const fs = await import('fs');
      
      if (fs.existsSync(systemChromePath)) {
        launchOptions = {
          ...launchOptions,
          executablePath: systemChromePath,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        };
      } else {
        // Fallback to bundled Chrome with macOS fixes
        launchOptions = {
          ...launchOptions,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
          ],
        };
      }
    }

    // Launch browser
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set content and wait for it to load
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    // Close browser
    await browser.close();

    // Generate filename
    const filename = quoteMetadata?.name
      ? `${quoteMetadata.name.replace(/[^a-zA-Z0-9]/g, '_')}_Quote.pdf`
      : 'Generated_Quote.pdf';

    // Return PDF with proper headers
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
