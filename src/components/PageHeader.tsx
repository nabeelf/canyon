"use client";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
}

export function PageHeader({ title, subtitle, description }: PageHeaderProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 animate-slide-in-top">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">{title}</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {subtitle}
          </p>
        </div>

        {description && (
          <div>
            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
