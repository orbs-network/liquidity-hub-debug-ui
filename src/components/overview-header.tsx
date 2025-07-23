import React from 'react'
import { Skeleton } from './ui/skeleton';

export function OverviewHeader({children}: {children: React.ReactNode}) {
  return (
    <div className="flex flex-col gap-2 items-stretch md:flex-row md:gap-4">
        {children}
    </div>
  )
}

const Item = ({
    title,
    value,
    icon,
    isLoading,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    isLoading?: boolean;
  }) => {
    return (
      <div className="flex items-start gap-2 bg-card-foreground rounded-lg p-4 flex-1 min-h-[90px]">
        {icon}
        <div className="flex flex-col gap-1">
          <p className="text-[15px] text-secondary-foreground">{title}</p>
         {isLoading ? <Skeleton className="w-full h-[20px]" /> : <p className="text-lg font-bold text-[20px]">{value}</p>}
        </div>
      </div>
    );
  };
  
OverviewHeader.Item = Item;