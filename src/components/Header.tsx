"use client";

import { useState } from 'react';

interface HeaderProps {
  isLoggedIn?: boolean;
  setIsLoggedIn?: (value: boolean) => void; // Made optional
  onLogoClick?: () => void; // Function to handle logo click
}

export function Header({ isLoggedIn = false, setIsLoggedIn, onLogoClick }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    console.log('Logout clicked, clearing cookies...');
    
    // Log current cookies for debugging
    console.log('Current cookies:', document.cookie);
    
    // Clear cookies with multiple approaches to ensure they're removed
    document.cookie = 'user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    document.cookie = 'user_name=; max-age=0; path=/';
    document.cookie = 'user_email=; max-age=0; path=/';
    
    // Also try clearing with domain
    const hostname = window.location.hostname;
    document.cookie = `user_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    document.cookie = `user_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
    
    console.log('Cookies cleared, updating state...');
    
    // Update the React state to trigger re-render if setter is provided
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    setIsLoggingOut(false);
  };

  return (
    <header className="w-full border-b border-border/50 bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between p-4 px-8">
        <div className="flex items-center space-x-2">
          {/* Canyon Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
            src="/canyon-logo.png" 
            alt="Canyon Logo" 
            className="w-8 h-8 object-contain cursor-pointer mb-2"
            onClick={onLogoClick}
          />
          <button 
            onClick={onLogoClick}
            className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              Canyon.ai
            </span>
          </button>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-muted-foreground hover:text-foreground transition-fast px-4 py-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-slide-in-right"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <>
              <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-fast animate-slide-in-right">
                Pricing
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-fast animate-slide-in-right">
                Contact
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}