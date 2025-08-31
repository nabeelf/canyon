interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  children?: React.ReactNode;
}

export function ChartTooltip({ active, payload, label, children }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip-title">{label}</p>}
      {children}
    </div>
  );
}

interface ChartTooltipItemProps {
  label: string;
  value: string | number;
  color?: string;
  className?: string;
}

export function ChartTooltipItem({ label, value, color, className = "" }: ChartTooltipItemProps) {
  return (
    <p className={`chart-tooltip-item ${className}`}>
      {label}: <span className="chart-tooltip-value" style={{ color }}>{value}</span>
    </p>
  );
}
