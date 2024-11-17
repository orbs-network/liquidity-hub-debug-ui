import _ from "lodash";
import moment from "moment";
import BN from "bignumber.js";
import { addSlippage } from "utils";

const nameModifier = (name?: string) => {
  if (name?.toLowerCase() === "matic") return "POL";
  if (name?.toLowerCase() === "wmatic") return "WPOL";
  return name || "";
};

export class LiquidityHubSwap {
  feeOutAmount: number;
  amountIn: number;
  chainId: number;
  dex: string;
  txHash: string;
  tokenInAddress: string;
  tokenInName: string;
  tokenOutAddress: string;
  tokenOutName: string;
  id: string;
  timestamp: number;
  dollarValue: number;
  swapStatus: string;
  userAddress: string;
  savings: number;
  exactOutAmount: string;
  txData: string;
  dutchPrice: number;
  slippage: number;
  ip: string;
  serializedOrder: string;
  signature: string;
  gasPriceGwei: number;
  gasUsed: number;
  gasUsedNativeToken: string;
  blockNumber: number;
  amountInUsd: number;
  feeOutAmountUsd: number;

  constructor(rawSwap: any) {
    const slippage = rawSwap.slippage;

    this.feeOutAmount = rawSwap.feeOutAmount;
    this.amountIn = rawSwap.amountIn;
    this.chainId = rawSwap.chainId;
    this.dex = rawSwap.chainId === 1101 ? `${rawSwap.dex}-zkevm` : rawSwap.dex;
    this.txHash = rawSwap.txHash;
    this.tokenInAddress = rawSwap.tokenInAddress;
    this.tokenInName = nameModifier(rawSwap.tokenInName);
    this.tokenOutAddress = rawSwap.tokenOutAddress;
    this.tokenOutName = nameModifier(rawSwap.tokenOutName);
    this.id = rawSwap.sessionId;
    this.timestamp = moment(rawSwap.timestamp).valueOf();
    this.dollarValue = rawSwap.dollarValue;
    this.swapStatus = rawSwap.swapStatus;
    this.userAddress = rawSwap.user;
    this.savings = rawSwap.exactOutAmountSavings;
    this.exactOutAmount = BN(rawSwap.exactOutAmount || 0)
      .plus(rawSwap.exactOutAmountSavings || 0)
      .toFixed();
    this.txData = rawSwap.txData;
    this.dutchPrice = rawSwap.dutchPrice;
    this.slippage = slippage;
    this.ip = rawSwap.ip;
    this.serializedOrder = rawSwap.serializedOrder;
    this.signature = rawSwap.signature;
    this.gasPriceGwei = rawSwap.gasPriceGwei;
    this.gasUsed = rawSwap.gasUsed;
    this.gasUsedNativeToken = BN(rawSwap.gasUsed || 0)
      .times(rawSwap.gasPriceGwei || 0)
      .toFixed();
    this.blockNumber = rawSwap.blockNumber;
    this.amountInUsd = rawSwap.amountInUSD;
    this.feeOutAmountUsd = rawSwap.feeOutAmountUsd;
  }
}

export class LiquidityHubSession extends LiquidityHubSwap {
  lhAmountOut: string;
  lhAmountOutUsd: number;
  dexAmountOut: string;
  dexAmountOutWS: string;
  lhAmountOutWS: string;
  gasCostOutToken: string;
  logs: {
    swap: any;
    quote: any[];
    client: any[];
  };
  constructor(rawSwap: any, quotes: any[], client: any[]) {
    super(rawSwap);
    this.logs = {
      swap: rawSwap,
      quote: quotes,
      client,
    };
    const sorted = quotes.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    try {
      const quote = sorted[0];
      if (!quote) {
        throw new Error("No quote found");
      }
        
      const winnerIndex = quote["auctionData.exchange"].indexOf(quote['auctionWinner']);
      this.lhAmountOut = quote.amountOut;
      this.lhAmountOutUsd = quote.dollarValue;
      this.dexAmountOut = quote.amountOutUI;
      this.lhAmountOutWS = addSlippage(quote.amountOut, quote.slippage) || "";
      this.gasCostOutToken = quote["auctionData.gasCost"][winnerIndex] || '';
    } catch (error) {
      this.lhAmountOut = rawSwap.amountOut;
      this.lhAmountOutUsd = rawSwap.dollarValue;
      this.dexAmountOut = rawSwap.amountOutUI;
      this.lhAmountOutWS = addSlippage(rawSwap.amountOut, this.slippage) || "";
      this.gasCostOutToken = '';
    }
    this.dexAmountOut = BN(this.dexAmountOut).lte(0) ? '' : this.dexAmountOut;
    this.dexAmountOutWS = addSlippage(this.dexAmountOut, this.slippage) || ''
  }
}
