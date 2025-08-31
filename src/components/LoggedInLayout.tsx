"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStatus } from "@/app/utils/auth";
import { Loading } from "@/components/ui/loading";
import { Header } from "./Header";
import { SidebarWrapper } from "./Sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { useRouter } from "next/navigation";

export function LoggedInLayout({ children }: {children: ReactNode}) {
  const { isLoggedIn, isLoading } = useAuthStatus();
  const router = useRouter();

  // Redirect to home if not logged in
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex pt-20">
        <SidebarProvider>
          <SidebarWrapper />
          <main className="flex-1 min-h-screen animate-slide-in-bottom">
            {children}
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
