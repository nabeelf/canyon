"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ApprovalParty } from "@/app/types";
import { ChartCard, SummaryStat } from "@/components/ui/chart-card";
import { ChartTooltip, ChartTooltipItem } from "@/components/ui/chart-tooltip";
import { ApprovalTimeIcon } from "@/components/ui/icons";

// Sample data using actual ApprovalParty enum values
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

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      minDays: number;
      maxDays: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <ChartTooltip active={active} payload={payload} label={label}>
        <ChartTooltipItem 
          label="Average" 
          value={`${payload[0].value} days`} 
          color="hsl(var(--primary))"
        />
        <ChartTooltipItem 
          label="Range" 
          value={`${payload[0].payload.minDays} - ${payload[0].payload.maxDays} days`}
          className="text-xs"
        />
      </ChartTooltip>
    );
  }
  return null;
};

export function ApprovalTimeChart() {
  const avgOverall = approvalData.reduce((acc, item) => acc + item.avgDays, 0) / approvalData.length;
  const slowestRole = Math.max(...approvalData.map(item => item.avgDays));

  return (
    <ChartCard
      title="Approval Time by Role"
      description="Average days to approve quotes by different roles in the approval process"
      icon={<ApprovalTimeIcon />}
      summaryStats={
        <>
          <SummaryStat 
            value={avgOverall.toFixed(1)} 
            label="Avg Overall" 
            color="hsl(var(--primary))"
          />
          <SummaryStat 
            value={slowestRole} 
            label="Slowest Role" 
            color="hsl(var(--chart-1))"
          />
        </>
      }
    >
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
    </ChartCard>
  );
}
