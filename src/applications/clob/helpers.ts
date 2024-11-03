import _ from "lodash";
import moment from "moment";
import { LHSession, QuoteLog, SwapLog } from "types";
import BN from "bignumber.js";
import { addSlippage } from "utils";

const handleName = (name?: string) => {
  if (name?.toLowerCase() === "matic") return "POL";
  if (name?.toLowerCase() === "wmatic") return "WPOL";
  return name || "";
};

const parseSwapLog = (log: any): SwapLog => {
  const slippage = log.slippage;
  return {
    feeOutAmount: log.feeOutAmount,
    amountIn: log.amountIn,
    chainId: log.chainId,
    dex: log.chainId === 1101 ? `${log.dex}-zkevm` : log.dex,
    txHash: log.txHash,
    tokenInAddress: log.tokenInAddress,
    tokenInName: handleName(log.tokenInName),
    tokenOutAddress: log.tokenOutAddress,
    tokenOutName: handleName(log.tokenOutName),
    id: log.sessionId,
    timestamp: moment(log.timestamp).valueOf(),
    dollarValue: log.dollarValue,
    swapStatus: log.swapStatus,
    userAddress: log.user,
    savings: log.exactOutAmountSavings,
    exactOutAmount: log.exactOutAmount,
    exactOutAmountUsd: log.exactOutAmountUsd,
    txData: log.txData,
    dutchPrice: log.dutchPrice,
    slippage,
    ip: log.ip,
    serializedOrder: log.serializedOrder,
    signature: log.signature,
    gasPriceGwei: log.gasPriceGwei,
    gasUsed: log.gasUsed,
    gasUsedNativeToken: BN(log.gasUsed || 0)
      .times(log.gasPriceGwei || 0)
      .toFixed(),
    blockNumber: log.blockNumber,
    amountInUsd: log.amountInUSD,
    feeOutAmountUsd: log.feeOutAmountUsd,
  };
};

const parseQuotesLog = (quotes: any[]): QuoteLog => {
  const sorted = quotes.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const quote = sorted[0];
  return {
    lhAmountOut: quote.amountOut,
    lhAmountOutUsd: quote.dollarValue,
    dexAmountOut: quote.amountOutUI,
    dexAmountOutWS: addSlippage(quote.amountOutUI, quote.slippage),
    lhAmountOutWS: addSlippage(quote.amountOut, quote.slippage),
  };
};

export const parseSwapLogs = (logs: any[]) => {
  return logs.map((log) => {
    return parseSwapLog(log);
  });
};

export const parseFullSessionLogs = (
  swapLog: any,
  quoteLogs: any[],
  clientLogs: any[]
): LHSession => {

  const parsedSwapLog = parseSwapLog(swapLog);
  const parsedQuotes = parseQuotesLog(quoteLogs);

  return {
    ...parsedSwapLog,
    ...parsedQuotes,
    logs: {
      swap: swapLog,
      quote: quoteLogs,
      client: clientLogs,
    },
  };
};
