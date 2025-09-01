type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen bg-background flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
