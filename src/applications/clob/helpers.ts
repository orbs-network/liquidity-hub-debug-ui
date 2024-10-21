import { datesDiff, getValueFromSessionLogs } from "helpers";
import _ from "lodash";
import moment from "moment";
import { ClobSession } from "types";

export const parseSessions = (sessions: any[]) => {
  const grouped = _.mapValues(_.groupBy(sessions, "sessionId"), (value) => {
    return _.groupBy(value, "type");
  });

  const sessionValues = _.mapValues(grouped, (session, key): ClobSession => {
    const fromSwap = (key: string) =>
      getValueFromSessionLogs(session.swap, key);
    const fromQuote = (key: string) =>
      getValueFromSessionLogs(session.quote, key) || fromSwap(key);
    const fromClient = (key: string) =>
      getValueFromSessionLogs(session.client, key);
    let timestamp =
      fromSwap("timestamp") ||
      fromQuote("timestamp") ||
      fromClient("timestamp");

    let dexAmountOut = fromClient("dexOutAmountWS") || fromQuote("amountOutUI");
    const timestampMillis = moment(timestamp).valueOf();
    const savings = fromSwap("exactOutAmountSavings");
    const amountOutRaw = fromQuote("amountOut") || fromClient("amountOut");
    const exactOutAmount = fromSwap("exactOutAmount");
    const txData = fromSwap("txData");

    return {
      id: key,
      amountInRaw: fromQuote("amountIn") || fromClient("amountIn"),
      amountInUI: fromQuote("amountInF") || fromClient("srcAmountUI"),
      amountOutRaw: amountOutRaw?.toString(),
      timestampMillis,
      timestamp: moment(timestamp).format("DD/MM/YY HH:mm:ss"),
      timeFromNow: datesDiff(moment(timestampMillis)),
      dexSwapTxHash: fromClient("dexSwapTxHash"),
      dutchPrice: fromSwap("dutchPrice"),
      amountOut: fromQuote("amountOut"),
      dexAmountOut: !dexAmountOut
        ? undefined
        : dexAmountOut <= 0
        ? undefined
        : dexAmountOut,
      amountOutDiff: 0,
      amountOutUSD:
        fromSwap("dollarValue") ||
        fromQuote("dollarValue") ||
        fromClient("dstTokenUsdValue"),
      amountInUSD: fromSwap("amountInUSD") || fromClient("amountInUSD"),
      isAction: fromSwap("isAction") || fromClient("isAction"),
      isClobTrade: fromClient("isClobTrade"),
      slippage:
        fromSwap("slippage") || fromQuote("slippage") || fromClient("slippage"),
      tokenOutAddress:
        fromSwap("tokenOutAddress") ||
        fromQuote("tokenOutAddress") ||
        fromClient("dstTokenAddress"),
      tokenInAddress:
        fromSwap("tokenInAddress") ||
        fromQuote("tokenInAddress") ||
        fromClient("srcTokenAddress"),
      tokenOutSymbol:
        fromSwap("tokenOutSymbol") ||
        fromQuote("tokenOutSymbol") ||
        fromClient("dstTokenSymbol"),
      txStatus: fromSwap("txStatus"),
      tokenInSymbol:
        fromSwap("tokenInSymbol") ||
        fromQuote("tokenInSymbol") ||
        fromClient("srcTokenSymbol"),
      uaServer: fromSwap("uaServer") || fromClient("uaServer"),
      chainId:
        fromSwap("chainId") || fromQuote("chainId") || fromClient("chainId"),
      dex: fromSwap("dex") || fromQuote("dex") || fromClient("partner"),
      userAddress:
        fromSwap("user") ||
        fromQuote("userAddress") ||
        fromClient("walletAddress"),
      ip: fromSwap("ip") || fromClient("ip"),
      serializedOrder:
        fromSwap("serializedOrder") || fromClient("serializedOrder"),
      signature: fromSwap("signature") || fromClient("signature"),
      swapStatus: fromSwap("swapStatus") || fromClient("swapStatus"),
      txHash: fromSwap("txHash") || fromClient("txHash"),
      gasPriceGwei: fromSwap("gasPriceGwei") || fromClient("gasPriceGwei"),
      gasUsed: fromSwap("gasUsed") || fromClient("gasUsed"),
      exactOutAmount: exactOutAmount,
      exactOutAmountUsd: fromSwap("exactOutAmountUsd"),
      savings: savings,
      txData,
      blockNumber: fromSwap("blockNumber") || fromClient("blockNumber"),
      logs: {
        client: session.client,
        swap: session.swap,
        quote: session.quote,
      },
    };
  });

  const _sessions = _.values(sessionValues);
  return _.sortBy(_sessions, "timestampMillis").reverse();
};
