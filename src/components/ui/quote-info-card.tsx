import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type QuoteInfoCardProps = {
  title: string;
  description: string;
  children: ReactNode;
}

export function QuoteInfoCard({ title, description, children }: QuoteInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

type InfoItemProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  isEmail?: boolean;
  isLink?: boolean;
  href?: string;
}

export function InfoItem({ icon, label, value, isEmail = false, isLink = false, href }: InfoItemProps) {
  const content = isEmail ? (
    <a
      href={`mailto:${value}`}
      className="info-item-link"
    >
      {value}
      {icon}
    </a>
  ) : isLink && href ? (
    <a href={href} className="info-item-link">
      {value}
      {icon}
    </a>
  ) : (
    <span className="info-item-value">{value}</span>
  );

  return (
    <div className="info-item">
      <div className="info-item-label">
        {icon}
        {label}
      </div>
      {content}
    </div>
  );
}
