"use client";

import { useState } from 'react';
import { logout } from '@/app/utils/auth';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);    
    logout();
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
            onClick={() => window.location.href = '/'}
          />
          <button 
            onClick={() => window.location.href = '/'}
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
              className="text-muted-foreground hover:text-foreground transition-fast px-4 py-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <>
              <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-fast">
                Pricing
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-fast">
                Contact
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}