
import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-transparent border-t-primary",
        sizeClasses[size],
        className
      )}
    />
  );
};

export const FullPageLoader: React.FC = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <Loader size="lg" />
      <p className="mt-4 text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);
