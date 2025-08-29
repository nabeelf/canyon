"use client";

import { downloadQuoteDocument } from "@/app/utils/download_file";
import { ApprovalTimeChart } from "./ApprovalTimeChart";
import { QuotesByRoleChart } from "./QuotesByRoleChart";
import { QuotesByStageChart } from "./QuotesByStageChart";
import { StatsCards } from "./StatsCards";

interface HomeProps {
  userName: string;
  userEmail: string;
}

export function HomeLoggedIn({ userName, userEmail }: HomeProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-16 animate-slide-in-top">
      {/* Welcome Section - Top Left */}
      <div className="text-left space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">{userName}!</span>
        </h1>
        <p className= "text-muted-foreground">
          Here are some insights on your quotes.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="mb-8">
        <StatsCards />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* First Row - Two Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApprovalTimeChart />
          <QuotesByRoleChart />
        </div>
        
        {/* Second Row - Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <QuotesByStageChart />
        </div>
      </div>
    </div>
  );
}
