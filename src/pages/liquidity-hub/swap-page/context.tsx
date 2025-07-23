import { SwapQueryResponse } from "@/lib/liquidity-hub";
import { createContext } from "react";

interface ContextType extends SwapQueryResponse {
  isPreview?: boolean;
}

export const Context = createContext({} as ContextType);
