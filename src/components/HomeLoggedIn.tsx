"use client";

import { downloadQuoteDocument } from "@/app/utils/download_file";

interface HomeProps {
  userName: string;
  userEmail: string;
}

export function HomeLoggedIn({ userName, userEmail }: HomeProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6 animate-slide-in-top">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome, <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">{userName}!</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            You've successfully signed in with Google
          </p>
          
          {userEmail && (
            <p className="text-lg text-muted-foreground">
              Signed in as: <span className="font-mono bg-muted px-2 py-1 rounded">{userEmail}</span>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-muted-foreground max-w-lg mx-auto">
            You're now ready to configure, price, and quote complex enterprise deals with Canyon.ai
          </p>
          
          <button
            onClick={async () => {
              try {
                await downloadQuoteDocument('pdf-sample_0.pdf', 'PdfSample', '.pdf');
              } catch (error) {
                console.error('Download failed:', error);
                alert('Download failed. Please try again.');
              }
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Download PDF Sample
          </button>
        </div>
      </div>
    </div>
  );
}
