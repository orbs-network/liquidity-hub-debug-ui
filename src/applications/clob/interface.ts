import _ from "lodash";
import moment from "moment";
import BN from "bignumber.js";
import { addSlippage, handleZeroValue } from "utils";

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
  dexSimulateOutAmount: string;
  dexRouteData: any;
  dexRouteTo: string;

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
    this.dexSimulateOutAmount = handleZeroValue(rawSwap.dexSimulateOutAmount);
    this.dexRouteData = rawSwap.dexRouteData;
    this.dexRouteTo = rawSwap.dexRouteTo;
  }
}

export class LiquidityHubSession extends LiquidityHubSwap {
  lhAmountOut: string;
  lhAmountOutUsd: number;
  dexAmountOut: string;
  dexAmountOutWS: string;
  lhAmountOutWS: string;
  gasCostOutToken: string;
  dexAmountOutWSminusGas: string;
  userSavings: string;
  lhAmountOutExpected: string;
  dexSimulateOutAmountMinusGas: string;
  lhExactOutAmountPreDeduction: string;

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

    const parsedQuote = parseQuote(quotes);

    this.lhAmountOut = parsedQuote?.lhAmountOut || rawSwap.amountOut;
    this.lhAmountOutUsd = parsedQuote?.lhAmountOutUsd || rawSwap.dollarValue;
    this.dexAmountOut = parsedQuote?.dexAmountOut || rawSwap.amountOutUI;
    this.lhAmountOutWS =
      parsedQuote?.lhAmountOutWS ||
      addSlippage(rawSwap.amountOut, this.slippage);
    this.gasCostOutToken = parsedQuote?.gasCostOutToken || "";
    this.dexAmountOutWS = addSlippage(this.dexAmountOut, this.slippage);
    this.dexAmountOutWSminusGas = BN(this?.dexAmountOutWS || 0)
      .minus(this.gasCostOutToken || 0)
      .toFixed();

    const userSavings = BN(this.exactOutAmount || 0).minus(
      this.dexAmountOutWSminusGas || 0
    );

    this.userSavings = userSavings.gt(0) ? userSavings.toFixed() : "";
    this.lhAmountOutExpected = BN(this?.lhAmountOut || 0)
      .minus(this.gasCostOutToken || 0)
      .toFixed();
    const dexSimulateOutAmountMinusGas = BN(
      this?.dexSimulateOutAmount || 0
    ).minus(this?.gasCostOutToken || 0);
    this.dexSimulateOutAmountMinusGas = dexSimulateOutAmountMinusGas.gt(0)
      ? dexSimulateOutAmountMinusGas.toFixed()
      : "";
    this.lhExactOutAmountPreDeduction = BN(this.exactOutAmount || 0)
      .plus(this?.gasCostOutToken || 0)
      .plus(this?.feeOutAmount || 0)
      .toFixed();
  }
}

const parseQuote = (quotes: any[]) => {
  const sorted = quotes.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const quote = sorted[0];
  if (!quote) {
    return undefined;
  }

  const winnerIndex = quote["auctionData.exchange"].indexOf(
    quote["auctionWinner"]
  );

  return {
    lhAmountOut: quote.amountOut,
    lhAmountOutUsd: quote.dollarValue,
    dexAmountOut: quote.amountOutUI,
    lhAmountOutWS: addSlippage(quote.amountOut, quote.slippage) || "",
    gasCostOutToken: quote["auctionData.gasCost"][winnerIndex] || "",
  };
};
