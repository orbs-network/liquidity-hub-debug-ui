import _ from "lodash";
import moment from "moment";
import { LHSession, SwapLog } from "types";

const parseSwapLog = (log: any): SwapLog => {
  return {
    feeOutAmount: log.feeOutAmount,
    dexAmountOut: Number(log.amountOutUI || '0') < 0 ? undefined : log.amountOutUI,
    lhAmountOut: log.amountOut,
    amountIn: log.amountIn,
    chainId: log.chainId,
    dex: log.chainId === 1101 ? `${log.dex}-zkevm` : log.dex,
    txHash: log.txHash,
    tokenInAddress: log.tokenInAddress,
    tokenInName: log.tokenInName,
    tokenOutAddress: log.tokenOutAddress,
    tokenOutName: log.tokenOutName,
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
    slippage: log.slippage,
    ip: log.ip,
    serializedOrder: log.serializedOrder,
    signature: log.signature,
    gasPriceGwei: log.gasPriceGwei,
    gasUsed: log.gasUsed,
    blockNumber: log.blockNumber,
    amountInUsd: log.amountInUSD,
    lhAmountOutUsd: log.dollarValue,
    feeOutAmountUsd: log.feeOutAmountUsd,
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
  console.log({swapLog, quoteLogs});

  const parsedSwapLog = parseSwapLog(swapLog);

  return {
    ...parsedSwapLog,
    logs: {
      swap: swapLog,
      quote: quoteLogs,
      client: clientLogs,
    },
  };
};
