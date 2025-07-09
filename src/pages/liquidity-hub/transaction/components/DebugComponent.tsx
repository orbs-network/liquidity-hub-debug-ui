import React from "react";
import { isDebug } from "@/utils";

export function DebugComponent({ children }: { children: React.ReactNode }) {
  if (!isDebug) return null;
  return <>{children}</>;
}


