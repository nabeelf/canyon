"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Average Time to Close */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Time to Close</CardTitle>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">18.5 days</div>
          <p className="text-xs text-muted-foreground">
            This quarter
          </p>
        </CardContent>
      </Card>

      {/* Active Pipeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-1">$2.4M</div>
          <p className="text-xs text-muted-foreground">
            This quarter
          </p>
        </CardContent>
      </Card>

      {/* Closed Pipeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Pipeline</CardTitle>
          <svg
            className="w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-black">$1.8M</div>
          <p className="text-xs text-muted-foreground">
            This quarter
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
