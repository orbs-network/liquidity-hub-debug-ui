export interface SwapLog {
  chainId: number;
  dex: string;
  txHash: string;
  amountIn: number;
  tokenInAddress: string;
  tokenInName: string;
  tokenOutAddress: string;
  tokenOutName: string;
  id: string;
  timestamp: number;
  dollarValue: number;
  swapStatus: string;
  userAddress: string;
  savings: string;
  exactOutAmount: string;
  exactOutAmountUsd: string;
  txData: any;
  dutchPrice: string;
  slippage: number;
  ip: string;
  serializedOrder: string;
  signature: string;
  gasPriceGwei: string;
  gasUsed: number;
  blockNumber: number;
  feeOutAmount: string;
  amountInUsd: number;
  feeOutAmountUsd: number;
  gasUsedNativeToken: string;
}

export type QuoteLog = {
  lhAmountOut?: string;
  lhAmountOutUsd: number;
  dexAmountOut?: number | string;
  dexAmountOutWS?: number | string;
  lhAmountOutWS?: number | string;
};

export interface LHSession extends SwapLog, QuoteLog {
  logs: {
    swap: any;
    quote: any[];
    client: any[];
  };
}

export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

export interface TransferLog {
  from: string;
  to: string;
  value: string;
  token: Token;
  rawValue: string;
}
