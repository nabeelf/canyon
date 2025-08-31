import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ChartCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  children: ReactNode;
  summaryStats?: ReactNode;
}

export function ChartCard({ title, description, icon, children, summaryStats }: ChartCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="chart-title">
          {icon && <span className="chart-icon">{icon}</span>}
          {title}
        </CardTitle>
        <CardDescription className="chart-description">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          {children}
        </div>
        
        {summaryStats && (
          <div className="chart-summary">
            {summaryStats}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type SummaryStatProps = {
  value: string | number;
  label: string;
  color?: string;
  className?: string;
}

export function SummaryStat({ value, label, color, className = "" }: SummaryStatProps) {
  return (
    <div className={`summary-stat ${className}`}>
      <p className="summary-stat-value" style={{ color }}>
        {value}
      </p>
      <p className="summary-stat-label">{label}</p>
    </div>
  );
}
