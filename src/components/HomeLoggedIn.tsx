"use client";

import { ApprovalTimeChart } from "./ApprovalTimeChart";
import { QuotesByRoleChart } from "./QuotesByRoleChart";
import { QuotesByStageChart } from "./QuotesByStageChart";
import { StatsCards } from "./StatsCards";
import { PageHeader } from "./PageHeader";

interface HomeProps {
  userName: string;
}

export function HomeLoggedIn({ userName }: HomeProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-16 animate-slide-in-top">
      {/* Welcome Section - Top Left */}
      <PageHeader
        title={`Welcome, ${userName}!`}
        subtitle="Here are some insights on your quotes."
      />

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
