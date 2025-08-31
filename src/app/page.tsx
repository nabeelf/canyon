
"use client";

import { Header } from '@/components/Header';
import { HomeLoggedIn } from '@/components/HomeLoggedIn';
import { HomeLoggedOut } from '@/components/HomeLoggedOut';
import { useAuthStatus } from './utils/auth';
import { Loading } from '@/components/ui/loading';
import { SidebarWrapper } from '@/components/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Home() {
  const { isLoggedIn, userName, isLoading } = useAuthStatus();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`min-h-screen bg-background ${isLoggedIn ? 'relative' : ''}`}>
      <Header isLoggedIn={isLoggedIn} />
      
      {isLoggedIn ? (
        <div className="flex pt-20">
          <SidebarProvider>
            <SidebarWrapper />
            <main className="flex-1 min-h-screen animate-slide-in-bottom">
              <HomeLoggedIn userName={userName} />
            </main>
          </SidebarProvider>
        </div>
      ) : (
        <main className="flex items-center justify-center min-h-screen pb-40 animate-slide-in-top">
          <HomeLoggedOut />
        </main>
      )}
    </div>
  );
}
