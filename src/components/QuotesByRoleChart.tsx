"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ApprovalParty } from "@/app/types";

// Sample data using actual ApprovalParty enum values - you can replace this with real data from your API
const quotesByRoleData = [
  {
    role: ApprovalParty.DEAL_DESK,
    activeQuotes: 12,
    totalQuotes: 25,
    pendingQuotes: 8,
  },
  {
    role: ApprovalParty.FINANCE,
    activeQuotes: 8,
    totalQuotes: 18,
    pendingQuotes: 5,
  },
  {
    role: ApprovalParty.LEGAL,
    activeQuotes: 15,
    totalQuotes: 22,
    pendingQuotes: 12,
  },
  {
    role: ApprovalParty.CRO,
    activeQuotes: 6,
    totalQuotes: 12,
    pendingQuotes: 3,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          Active: <span className="text-primary font-semibold">{data.activeQuotes} quotes</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Pending: <span className="text-chart-1 font-semibold">{data.pendingQuotes} quotes</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Total: {data.totalQuotes} quotes
        </p>
      </div>
    );
  }
  return null;
};

export function QuotesByRoleChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Active Quotes by Role
        </CardTitle>
        <CardDescription>
          Number of quotes currently active and pending approval by different roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quotesByRoleData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="role"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
                label={{ value: "Quotes", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="activeQuotes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
                name="Active Quotes"
              />
              <Bar
                dataKey="pendingQuotes"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
                name="Pending Quotes"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {quotesByRoleData.reduce((acc, item) => acc + item.activeQuotes, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">
              {quotesByRoleData.reduce((acc, item) => acc + item.pendingQuotes, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">
              {quotesByRoleData.reduce((acc, item) => acc + item.totalQuotes, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Quotes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
