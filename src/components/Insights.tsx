"use client";

export function Insights() {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto px-6 animate-slide-in-top">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Insights
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Coming Soon
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground max-w-lg mx-auto">
          Get powerful analytics and insights into your quote performance, conversion rates, and business metrics.
        </p>
      </div>
    </div>
  );
}
