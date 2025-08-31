import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: any;
    let launchOptions: any = {
      headless: true,
    };

    if (isVercel) {
      // Use puppeteer with built-in browser download on Vercel
      puppeteer = await import("puppeteer");
      
      // Download and install browser if needed
      const install = require('puppeteer/internal/node/install.js').downloadBrowser;
      await install();
      
      launchOptions = {
        ...launchOptions,
        args: [
          "--use-gl=angle",
          "--use-angle=swiftshader", 
          "--single-process",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--no-first-run",
          "--no-zygote",
          "--disable-extensions",
        ],
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
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--disable-extensions',
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

    // Launch browser with retry mechanism
    let browser;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        browser = await puppeteer.launch(launchOptions);
        break;
      } catch (error) {
        retryCount++;
        console.error(`Browser launch attempt ${retryCount} failed:`, error);
        
        if (retryCount >= maxRetries) {
          throw new Error(`Failed to launch browser after ${maxRetries} attempts: ${error}`);
        }
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    const page = await browser.newPage();

    // Navigate to a simple page
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Get page title
    const title = await page.title();
    
    // Take a screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      timeout: 30000 
    });

    // Close browser
    await browser.close();

    return NextResponse.json({
      success: true,
      title,
      screenshot: screenshot.toString('base64'),
      environment: isVercel ? 'vercel' : 'local'
    });

  } catch (error) {
    console.error('Puppeteer test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        environment: !!process.env.VERCEL_ENV ? 'vercel' : 'local'
      },
      { status: 500 }
    );
  }
}
