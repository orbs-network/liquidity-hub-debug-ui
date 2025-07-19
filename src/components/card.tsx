import { cn } from "@/lib/utils";
import React from "react";
import { Spinner } from "./ui/spinner";

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "text-white text-[18px] font-bold bg-card-foreground  py-3 px-4 border-b border-border w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

const Card = ({
  children,
  className,
  isLoading,
}: {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-slate-800/50 border border-border rounded-lg text-white overflow-hidden",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Spinner className="w-16 h-16" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;

export { Card };
