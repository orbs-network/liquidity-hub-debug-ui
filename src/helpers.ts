import _ from "lodash";
import moment from "moment";
import Web3 from "web3";
import { BSC_RPC, POLYGON_INFURA_RPC } from "./config";
import { Session } from "./types";

export const parseSessions = (sessions: any[]) => {
  const grouped = _.mapValues(_.groupBy(sessions, "sessionId"), (value) => {
    return _.groupBy(value, "type");
  });

  const findValue = (data?: any, key?: string) => {
    const arr = _.flatten(data);
    if (!key || !data) return undefined;
    return (
      _.find(arr, (value: any) => {
        return value[key];
      }) as any | undefined
    )?.[key];
  };

  const sessionValues = _.mapValues(grouped, (session, key): Session => {
    const fromSwap = (key: string) => findValue(session.swap, key);
    const fromQuote = (key: string) => findValue(session.quote, key);
    const fromClient = (key: string) => findValue(session.client, key);
    let timestamp =
      fromSwap("timestamp") ||
      fromQuote("timestamp") ||
      fromClient("timestamp");

    return {
      id: key,
      amountInRaw: fromQuote("amountIn") || fromClient("amountIn"),
      amountInUI: fromQuote("amountInF"),
      amountOutRaw: fromQuote("amountOut") || fromClient("amountOut"),
      amountOutUI: fromQuote("amountOut"),
      timestampMillis: moment(timestamp).valueOf(),
      timestamp: moment(timestamp).format("DD/MM/YY HH:mm:ss"),
      amountOutUSD:
        fromSwap("dollarValue") ||
        fromQuote("dollarValue") ||
        fromClient("amountOutUSD"),
      amountInUSD: fromSwap("amountInUSD") || fromClient("amountInUSD"),
      isAction: fromSwap("isAction") || fromClient("isAction"),
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
      txStatus: fromSwap("txStatus") || fromClient("txStatus"),
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

export const normalizeSessions = (sessions: any[]) => {
  return _.map(sessions, (session) => {
    return _.mapValues(session, (value) => {
      if (Array.isArray(value) && _.size(value) === 1) {
        value = _.first(value);
      }

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      } else {
        return value;
      }
    });
  });
};

export const getExplorer = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "https://polygonscan.com";
    case 56:
      return "https://bscscan.com";
    default:
      break;
  }
};

export const getWeb3 = (chainId?: number) => {
  if (!chainId) return undefined;
  let rpc = "";
  switch (chainId) {
    case 137:
      rpc = POLYGON_INFURA_RPC;
      break;
    case 56:
      rpc = BSC_RPC;
      break;
    default:
      break;
  }

  return new Web3(new Web3.providers.HttpProvider(rpc));
};

export const getIdsFromSessions = (sessions: any[]) => {
  return _.map(sessions, (session) => session.sessionId).filter(
    (id) => id !== undefined
  ) as string[];
};

export const getChainName = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "Polygon";
    case 56:
      return "BSC";
    default:
      break;
  }
};


export const makeElipsisAddress = (address?: string, padding = 6): string => {
  if (!address) return "";
  return `${address.substring(0, padding)}...${address.substring(
    address.length - padding
  )}`;
};
