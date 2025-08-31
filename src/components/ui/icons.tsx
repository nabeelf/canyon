type IconProps = {
  className?: string;
  size?: number;
}

const defaultIconProps = {
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
};

// Sidebar Icons
export function HomeIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

export function QuotesIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function CreateQuoteIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

export function ConfigureQuotesIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

export function CompaniesIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

export function PricingPlansIcon({ className = "w-6 h-6", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  );
}

// Chart Icons
export function ApprovalTimeIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

export function QuotesByRoleIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function QuotesByStageIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
    </svg>
  );
}

// Stats Icons
export function TotalQuotesIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

export function PendingQuotesIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function ApprovedQuotesIcon({ className = "w-5 h-5", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Other Icons
export function ArrowLeftIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

export function ArrowUpDownIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
}

export function MoreHorizontalIcon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg className={className} {...defaultIconProps} style={size ? { width: size, height: size } : undefined}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
