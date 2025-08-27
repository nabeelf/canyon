
"use client";

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check cookies on component mount
  useEffect(() => {
    const checkAuthStatus = () => {      
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(cookie => cookie.trim().startsWith('user_name='));
      const emailCookie = cookies.find(cookie => cookie.trim().startsWith('user_email='));
      
      if (userCookie) {
        const name = decodeURIComponent(userCookie.split('=')[1]);
        const email = emailCookie ? decodeURIComponent(emailCookie.split('=')[1]) : '';
        setUserName(name);
        setUserEmail(email);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserName('');
        setUserEmail('');
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background transition-smooth ${isLoggedIn ? 'relative' : ''}`}>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {isLoggedIn ? (
        <SidebarProvider>
          <div className="flex pt-16 animate-slide-in-bottom">
            <Sidebar />
            <main className="flex-1 flex items-center justify-center min-h-screen">
              <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
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
                </div>
              </div>
            </main>
          </div>
        </SidebarProvider>
              ) : (
          <main className="flex items-center justify-center min-h-screen pb-40 animate-slide-in-top">
            <HeroSection />
          </main>
        )}
    </div>
  );
}
