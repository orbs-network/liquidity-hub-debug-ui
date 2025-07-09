import { useHeight } from "@/hooks";
import { ReactNode } from "react";

export function FullHeightContainer({children, className  =''}:{children: ReactNode, className?: string}) {
  const height = useHeight();
  return <div className={className} style={{ height, width:'100%' }}>
    {children}
  </div>;
}
