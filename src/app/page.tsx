
"use client";

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SidebarWrapper } from '@/components/Sidebar';
import { HomeLoggedIn } from '@/components/HomeLoggedIn';
import { Quotes } from '@/components/Quotes';
import { CreateQuote } from '@/components/CreateQuote';

import { SidebarProvider } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import { Quote } from './types';


export enum ViewType {
  HOME = 'home',
  QUOTES = 'quotes',
  CREATE_QUOTE = 'create-quote'
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Try to get the saved view from localStorage, default to HOME
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('canyon-current-view');
      return saved && Object.values(ViewType).includes(saved as ViewType) 
        ? saved as ViewType 
        : ViewType.HOME;
    }
    return ViewType.HOME;
  }); 
  const [quotes, setQuotes] = useState<Quote[]>([]);  

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

  // Save current view to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('canyon-current-view', currentView);
    }
  }, [currentView]);

  // Fetch quotes data
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch('/api/quotes');
        const result = await response.json();
        
        if (result.success) {
          setQuotes(result.data);
        } else {
          console.error('API error:', result.error, result.message);
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
      }
    };

    fetchQuotes();
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
      <Header 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        onLogoClick={() => setCurrentView(ViewType.HOME)}
      />
      
      {isLoggedIn ? (
       <div className="flex pt-20 animate-slide-in-bottom">
        <SidebarProvider>
          <SidebarWrapper currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 min-h-screen">
              {currentView === ViewType.HOME && (
                <HomeLoggedIn userName={userName} userEmail={userEmail} />
              )}

              {currentView === ViewType.QUOTES && (
                <Quotes quotes={quotes} />
              )}

              {currentView === ViewType.CREATE_QUOTE && (
                <CreateQuote />
              )}


            </main>
            </SidebarProvider>
          </div>
              ) : (
          <main className="flex items-center justify-center min-h-screen pb-40 animate-slide-in-top">
            <HeroSection />
          </main>
        )}
    </div>
  );
}
