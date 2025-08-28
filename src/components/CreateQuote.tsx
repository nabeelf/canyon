"use client";

export function CreateQuote() {
  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto px-6 animate-slide-in-top">
      <div className="space-y-4">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Create Quote
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Coming Soon
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-muted-foreground max-w-lg mx-auto">
          Build and configure complex enterprise quotes with our intuitive quote builder.
        </p>
      </div>
    </div>
  );
}
