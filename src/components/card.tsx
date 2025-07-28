import { cn } from "@/lib/utils";
import React from "react";
import { Skeleton } from "./ui/skeleton";

export function CardContent({
  children,
  className,
  isLoading,
}: {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <div className={cn("p-3 md:p-5 w-full h-full", className)}>
      {isLoading ? (
        <div className="flex flex-col gap-4 items-start justify-start w-full h-full">
          <Skeleton className="w-[60%] h-[20px]" />
          <Skeleton className="w-[80%] h-[20px]" />
          <Skeleton className="w-[70%] h-[20px]" />
        </div>
      ) : (
        children
      )}
    </div>
  );
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
        "text-white text-[15px]  font-bold bg-card-foreground  py-3 px-4 border-b border-border w-full md:text-[18px] ",
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
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-slate-800/50 border border-border rounded-lg text-white overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Content = CardContent;

export { Card };
