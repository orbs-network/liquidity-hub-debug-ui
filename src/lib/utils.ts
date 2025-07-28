/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import _ from "lodash";
import moment, { Moment } from "moment";
import * as chains from "viem/chains";
import { formatUnits, parseUnits } from "viem";
import BN from "bignumber.js";
import { PARTNERS } from "@/partners";
import { useQueryFilterParams } from "./hooks/use-query-filter-params";
import { FILTER_KEY_NAMES, URL_QUERY_KEYS } from "@/consts";
import { networks } from "@/networks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const getRpcUrl = (chainId?: number) => {
  if (!chainId) return undefined;
  return `${
    import.meta.env.VITE_RPC_URL
  }/rpc?chainId=${chainId}&appId=debug-tool`;
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

export const toAmountUI = (amount?: string | number, decimals?: number) => {
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



export const isValidWalletAddress = (address: string) => {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressPattern.test(address);
};

export const isValidTxHash = (txHash: string) => {
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;

  return ethereumTxHashPattern.test(txHash);
};

export const addSlippage = (amount?: string | number, slippage?: number) => {
  if (!amount || !slippage) return "";

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};


export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export const getPartnersById = (ids?: string[]) => {
  if (!ids) return undefined;
  return _.filter(PARTNERS, (p) => ids.map(id => id.toLowerCase()).includes(p.id.toLowerCase()));
};


export function getMinDecimalScaleForLeadingZero(
  value?: string | number
): number | undefined {
  // Convert the value to a string
  if (!value) return undefined;
  const valueStr = typeof value === "number" ? value.toString() : value;

  if (parseFloat(valueStr) === 0) return undefined; // If the value is 0, return undefined

  const decimalIndex = valueStr.indexOf(".");

  if (decimalIndex === -1) {
    // No decimal point, it's an integer
    return undefined;
  }

  const decimals = valueStr.slice(decimalIndex + 1);

  // Check if decimals start with '0'
  if (decimals.startsWith("0")) {
    // Count decimal places until the first non-zero digit
    for (let i = 0; i < decimals.length; i++) {
      if (decimals[i] !== "0") {
        return i + 1; // Include the first non-zero digit
      }
    }
  }

  return undefined; // Return null if decimals don't start with '0'
}

export const handleZeroValue = (value?: string) => {
  if (!value) return value;

  return BN(value).gt(0) ? value : undefined;
};



export function isNumeric(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

export function isValidLHTxId(value: string): boolean {
  const pattern = /^[a-fA-F0-9]+_[0-9]+$/;
  return pattern.test(value);
}


export const keywordScriptFilter = (field: string, values: string[]) => ({
  script: {
    script: {
      source: `params.values.contains(doc['${field}'].value.toLowerCase())`,
      params: {
        values: values.map((v) => v.toLowerCase()),
      },
    },
  },
});

export const parseTimestampFromQuery = (timestamp?: string) => {
  if (!timestamp) return { from: undefined, to: undefined };

  const [from, to] = timestamp.split("-");
  return {
    from: from ? moment(Number(from)).valueOf() : undefined,
    to: to ? moment(Number(to)).valueOf() : moment().valueOf(),
  };
};

export const parseAppliedFilters = (
  query: ReturnType<typeof useQueryFilterParams>["query"]
) => {
  return _.map(query, (value, key) => {
    const name = FILTER_KEY_NAMES[key as keyof typeof FILTER_KEY_NAMES];

    if (key === URL_QUERY_KEYS.TIMESTAMP && value) {
      const { from, to } = parseTimestampFromQuery(value as string);
      return {
        key,
        value: `${moment(from).format("DD/MM/YYYY")} - ${moment(to).format(
          "DD/MM/YYYY"
        )}`,
        name,
      };
    }
    return {
      key,
      value,
      name,
    };
  });
};


export function formatDecimals(value?: string, scale = 6, maxDecimals = 8): string {
  if (!value) return "";

  // ─── keep the sign, work with the absolute value ────────────────
  const sign = value.startsWith("-") ? "-" : "";
  const abs = sign ? value.slice(1) : value;

  const [intPart, rawDec = ""] = abs.split(".");

  // Fast-path: decimal part is all zeros (or absent) ───────────────
  if (!rawDec || Number(rawDec) === 0) return sign + intPart;

  /** Case 1 – |value| ≥ 1 *****************************************/
  if (intPart !== "0") {
    const sliced = rawDec.slice(0, scale);
    const cleaned = sliced.replace(/0+$/, ""); // drop trailing zeros
    const trimmed = cleaned ? "." + cleaned : "";
    return sign + intPart + trimmed;
  }

  /** Case 2 – |value| < 1 *****************************************/
  const firstSigIdx = rawDec.search(/[^0]/); // first non-zero position
  if (firstSigIdx === -1) return "0"; // decimal part is all zeros
  if (firstSigIdx + 1 > maxDecimals) return "0"; // too many leading zeros → 0

  const leadingZeros = rawDec.slice(0, firstSigIdx); // keep them
  const significantRaw = rawDec.slice(firstSigIdx).slice(0, scale);
  const significant = significantRaw.replace(/0+$/, ""); // trim trailing zeros

  return significant ? sign + "0." + leadingZeros + significant : "0";
}

export const abbreviate = (num: string | number, maxDecimals = 2) => {
  if (!num || num === "0" || isNaN(Number(num))) return "0";
  if (typeof num === "number") {
    num = num.toString();
  }
  const abs = Number(num);
  if (abs >= 1e9) return (abs / 1e9).toFixed(2).replace(/\.0+$/, "") + "B";
  if (abs >= 1e6) return (abs / 1e6).toFixed(2).replace(/\.0+$/, "") + "M";
  if (abs >= 1e3) return (abs / 1e3).toFixed(2).replace(/\.0+$/, "") + "K";
  
  return String(formatDecimals(num, maxDecimals));
};

export const getNetworkByChainId = (chainId?: number) => {
  if (!chainId) return;
  return Object.values(networks).find((network) => network.id === chainId);
};


export function padArrayToLength<T = number>(arr: T[], targetLength: number, padValue: T = 0 as T): T[] {
  const paddingCount = Math.max(0, targetLength - arr.length);
  const padding = Array<T>(paddingCount).fill(padValue);
  return [...padding, ...arr];
}