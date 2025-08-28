"use client";

export function Quotes() {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto px-6 animate-slide-in-top">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Quotes
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Coming Soon
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground max-w-lg mx-auto">
          Manage and view all your enterprise quotes in one place. Track status, history, and performance.
        </p>
      </div>
    </div>
  );
}
