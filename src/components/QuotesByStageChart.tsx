/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ApprovalStatus } from "@/app/types";

// Sample data using actual ApprovalStatus enum values - you can replace this with real data from your API
const quotesByStageData = [
  {
    stage: ApprovalStatus.PENDING,
    count: 28,
    percentage: 35,
    color: "#3b82f6", // blue
  },
  {
    stage: ApprovalStatus.APPROVED,
    count: 32,
    percentage: 40,
    color: "#10b981", // green
  },
  {
    stage: ApprovalStatus.REJECTED,
    count: 8,
    percentage: 10,
    color: "#ef4444", // red
  },
  {
    stage: ApprovalStatus.INFO_REQUESTED,
    count: 9,
    percentage: 12,
    color: "#f59e0b", // amber
  },
];

const CustomTooltip = ({ active, payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.stage}</p>
        <p className="text-sm text-muted-foreground">
          Count: <span className="font-semibold">{data.count} quotes</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Percentage: <span className="font-semibold">{data.percentage}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value} ({quotesByStageData[index].count})
          </span>
        </div>
      ))}
    </div>
  );
};

export function QuotesByStageChart() {
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          Quotes by Approval Stage
        </CardTitle>
        <CardDescription>
          Distribution of quotes across different approval stages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={quotesByStageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="count"
                label={({ stage, percentage }) => `${stage} (${percentage}%)`}
                labelLine={false}
              >
                {quotesByStageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {quotesByStageData.reduce((acc, item) => acc + item.count, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Quotes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-1">
              {quotesByStageData.find(item => item.stage === ApprovalStatus.PENDING)?.count || 0}
            </p>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </div>
        </div>
        
        {/* Custom Legend */}
        <CustomLegend payload={quotesByStageData.map((item, index) => ({
          value: item.stage,
          color: item.color,
          type: 'circle'
        }))} />
      </CardContent>
    </Card>
  );
}
