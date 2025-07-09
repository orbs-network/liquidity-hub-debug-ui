/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import moment, { Moment } from "moment";
import axios from "axios";
import * as chains from "viem/chains";
import { formatUnits, parseUnits } from "viem";

export const getValueFromSessionLogs = (data?: any, key?: string) => {
  const arr = _.flatten(data);
  if (!key || !data) return undefined;
  return (
    _.find(arr, (value: any) => {
      return !_.isNaN(value[key]);
    }) as any | undefined
  )?.[key];
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
    case 59144:
      return "https://lineascan.build";
    case 8453:
      return "https://sepolia.scrollscan.com";
    case 250:
      return "https://ftmscan.com";
    default:
      break;
  }
};

export const getLogo = (chainId?: number) => {
  if (!chainId) return "";
  switch (chainId) {
    case 137:
      return "https://polygonscan.com";
    case 56:
      return "https://bscscan.com";
  }
};

export const getRpcUrl = (chainId?: number) => {
  if (!chainId) return undefined;
  return `https://rpcman.orbs.network/rpc?chainId=${chainId}&appId=liquidity-hub-debug-tool`;
};

export const getIdsFromSessions = (sessions: any[]) => {
  return _.uniq(
    _.map(sessions, (session) => session.sessionId).filter(
      (id) => id !== undefined
    )
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

export const swapStatusText = (status?: string) => {
  if (!status) return "-";
  switch (status) {
    case "success":
      return "COMPLETED";
    case "failed":
      return "FAILED";
    default:
      return "-";
  }
};

export function convertScientificStringToDecimal(
  scientificString: string,
  decimals: number
) {
  // Check if the input string is in scientific notation
  if (isScientificStringToDecimal(scientificString)) {
    // Convert scientific notation string to decimal string
    const decimalString = parseFloat(scientificString).toFixed(decimals);
    return decimalString;
  } else {
    // If not in scientific notation, return the original string
    return scientificString;
  }
}

export const isScientificStringToDecimal = (scientificString: string) => {
  // Check if the input string is in scientific notation
  if (/e/i.test(scientificString)) {
    return true;
  } else {
    return false;
  }
};

export const isTxHash = (value?: string) => value?.startsWith("0x");

export const getChain = (chainId?: number) => {
  if (!chainId) return undefined;
  return Object.values(chains).find((network) => network.id === chainId);
};

export const datesDiff = (date: Moment) => {
  const duration = moment.duration(moment().diff(date));
  const years = duration.asYears();
  const days = duration.asDays();
  const hours = duration.asHours();
  const minutes = duration.asMinutes();
  const seconds = duration.asSeconds();

  if (years > 1) {
    return `${Math.floor(years)} years ago`;
  }

  if (days > 1) {
    return `${Math.floor(days)} days ago`;
  }

  if (hours > 1) {
    return `${Math.floor(hours)} hours ago`;
  }

  if (minutes > 1) {
    return `${Math.floor(minutes)} minutes ago`;
  }

  if (seconds > 1) {
    return `${Math.floor(seconds)} seconds ago`;
  }
};



export const toAmountUI = (amount?: string, decimals?: number) => {
  if (!decimals || !amount) return "";
  try {
    return formatUnits(BigInt(amount), decimals);
  } catch (error) {
    return "0";
  }
};

export const toAmountWei = (amount?: string, decimals?: number) => {
  if (!decimals || !amount) return "0";

  try {
    return parseUnits(amount, decimals).toString();
  } catch (error) {
    return "0";
  }
};

export const fetchElastic = async (
  url: string,
  data: any,
  signal?: AbortSignal
) => {
  const response = await axios.post(`${url}/_search`, { ...data }, { signal });

  return normalizeSessions(
    response.data.hits?.hits.map((hit: any) => hit.fields)
  );
};
