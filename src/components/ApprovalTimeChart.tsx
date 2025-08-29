"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ApprovalParty } from "@/app/types";

// Sample data using actual ApprovalParty enum values - you can replace this with real data from your API
const approvalData = [
  {
    role: ApprovalParty.DEAL_DESK,
    avgDays: 2.5,
    minDays: 1,
    maxDays: 5,
  },
  {
    role: ApprovalParty.FINANCE,
    avgDays: 4.2,
    minDays: 2,
    maxDays: 8,
  },
  {
    role: ApprovalParty.LEGAL,
    avgDays: 6.8,
    minDays: 3,
    maxDays: 12,
  },
  {
    role: ApprovalParty.CRO,
    avgDays: 3.1,
    minDays: 1,
    maxDays: 7,
  },
];

const CustomTooltip = ({ active, payload, label }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          Average: <span className="text-primary font-semibold">{payload[0].value} days</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Range: {payload[0].payload.minDays} - {payload[0].payload.maxDays} days
        </p>
      </div>
    );
  }
  return null;
};

export function ApprovalTimeChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Approval Time by Role
        </CardTitle>
        <CardDescription>
          Average days to approve quotes by different roles in the approval process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={approvalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                label={{ value: "Days", angle: -90, position: "insideLeft" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="avgDays"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {approvalData.reduce((acc, item) => acc + item.avgDays, 0) / approvalData.length}
            </p>
            <p className="text-sm text-muted-foreground">Avg Overall</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">
              {Math.max(...approvalData.map(item => item.avgDays))}
            </p>
            <p className="text-sm text-muted-foreground">Slowest Role</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
