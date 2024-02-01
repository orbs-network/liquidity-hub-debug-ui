export interface ClobSession {
  id: string;
  amountInRaw: string | number;
  amountInUI: string | number;
  amountOutRaw?: string | number;
  amountOutUI?: string | number;
  chainId?: number;
  timestampMillis?: number;
  timestamp?: string;
  gasUnits?: number;
  amountOutUSD?: number;
  amountInUSD?: number;
  isAction?: boolean;
  slippage?: number;
  tokenInSymbol?: string;
  tokenInAddress?: string;
  txHash?: string;
  tokenOutAddress?: string;
  tokenOutSymbol?: string;
  uaServer?: string;
  serializedOrder?: string;
  txStatus?: string;
  signature?: string;
  swapStatus?: string;
  dex?: string;
  userAddress?: string;
  ip?: string;
  amountOutDiff?: number;
  dexAmountOut?: string;
  timeFromNow?: string;
  logs: {
    client: any;
    swap: any[];
    quote: any[];
  };
}


export type SessionsFilterTerms = {
  keyword: string;
  value: string |  string[] | number;
}[];


export interface SessionsFilter {
  must?: SessionsFilterTerms;
  should?: SessionsFilterTerms;
}


export type SessionType = "swap" | "success" | 'failed'  | "all";


export type SessionsSearchBy = 'address' | 'all'