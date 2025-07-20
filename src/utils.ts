import { Configs, eqIgnoreCase, Order } from "@orbs-network/twap-sdk";
import BN from "bignumber.js";
import { ROUTES } from "@/config";
import { FILTER_KEY_NAMES, URL_QUERY_KEYS } from "@/consts";
import _ from "lodash";
import moment from "moment";
import { isHash } from "viem";
import { useAppParams } from "./hooks";
import { PARTNERS } from "./partners";
import { Config } from "./types";
import { networks } from "./networks";

export const isDebug = !!localStorage.getItem("debug");

export const isValidWalletAddress = (address: string) => {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressPattern.test(address);
};

export const isValidTxHash = (txHash: string) => {
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;

  return ethereumTxHashPattern.test(txHash);
};

export const addSlippage = (amount?: string, slippage?: number) => {
  if (!amount || !slippage) return "";

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};

export const getConfig = (exchangeAddress: string, chainId: number) => {
  return _.find(
    Configs,
    (p) =>
      eqIgnoreCase(p.exchangeAddress, exchangeAddress) && p.chainId === chainId
  );
};

export const getPartnerByTwapConfig = (config?: Config) => {
  if (!config) return;
  return _.find(PARTNERS, (p) => p.twapId === config.partner);
};
export const getTwapConfigsWithPartnerId = (
  configs: typeof Configs,
  partner?: string
) => {
  if (!configs) return [];
  return Object.values(configs).filter(
    (config) => config.partner === partner
  ) as Config[];
};

export const getConfigByExchange = (
  configs: Config[],
  exchange: string,
  chainId: number
) => {
  return configs.find(
    (config) =>
      config.exchangeAddresses.some((address) =>
        eqIgnoreCase(address, exchange)
      ) && config.chainId === chainId
  );
};
export const getPartnerByTwapExchange = (
  configs: Config[],
  exchange: string,
  chainId: number
) => {
  const config = getConfigByExchange(configs, exchange, chainId);
  if (!config) return;
  return getPartnerByTwapConfig(config);
};

export const getConfigByTwapAddress = (
  twapAddress: string,
  chainId: number
): Config | undefined => {
  return Object.values(Configs).find(
    (n) => eqIgnoreCase(n.twapAddress, twapAddress) && n.chainId === chainId
  ) as Config | undefined;
};

export const getConfigsByChainIds = (
  chainIds?: number[] | string[]
): Config[] | undefined => {
  const chainIdsNumbers = chainIds?.map(Number);
  return Object.values(Configs).filter((n) =>
    chainIdsNumbers?.includes(n.chainId)
  ) as Config[] | undefined;
};

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export const getPartnersById = (ids?: string[]) => {
  if (!ids) return undefined;
  return _.filter(PARTNERS, (p) => ids.includes(p.id));
};

export const MillisToDuration = (value?: number) => {
  if (!value) {
    return "";
  }
  const time = moment.duration(value);
  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  const arr: string[] = [];

  if (days) {
    arr.push(`${days} days `);
  }
  if (hours) {
    arr.push(`${hours} hours `);
  }
  if (minutes) {
    arr.push(`${minutes} minutes`);
  }
  if (seconds) {
    arr.push(`${seconds} seconds`);
  }
  return arr.join(" ");
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

export const navigation = {
  liquidityHub: {
    tx: (value: string) =>
      ROUTES.liquidityHub.tx.replace(":sessionIdOrTxHash", value),
    user: (value: string) => ROUTES.liquidityHub.user.replace(":user", value),
  },
  twap: {
    order: (order: Order) => {
      return ROUTES.twap.order
        .replace(":orderId", order.id.toString())
        .replace(":twapAddress", order.twapAddress)
        .replace(":chainId", order.chainId.toString());
    },
  },
};

export function isNumeric(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
}

export const validateOrderIdentifier = (value: string): boolean => {
  const val = value.split(",");
  for (const v of val) {
    if (!isValidWalletAddress(v) && !isHash(v) && !isNumeric(v)) {
      return false;
    }
  }
  return true;
};

export const resolveOrderIdentifier = (identifier: string) => {
  const parsedIdentifiers = identifier.split(",");

  const result: Record<string, string[] | undefined> = {};

  for (const value of parsedIdentifiers) {
    if (isValidWalletAddress(value)) {
      result[URL_QUERY_KEYS.USER] = [
        ...(result[URL_QUERY_KEYS.USER] || []),
        value,
      ];
    }
    if (isHash(value)) {
      result[URL_QUERY_KEYS.TX_HASH] = [
        ...(result[URL_QUERY_KEYS.TX_HASH] || []),
        value,
      ];
    }
    if (isNumeric(value)) {
      result[URL_QUERY_KEYS.ORDER_ID] = [
        ...(result[URL_QUERY_KEYS.ORDER_ID] || []),
        value,
      ];
    }
  }

  return result;
};

export const parseTimestampFromQuery = (timestamp?: string) => {
  if (!timestamp) return { from: undefined, to: undefined };

  const [from, to] = timestamp.split("-");
  return {
    from: from ? moment(Number(from)).valueOf() : undefined,
    to: to ? moment(Number(to)).valueOf() : moment().valueOf(),
  };
};

export const parseAppliedFilters = (
  query: ReturnType<typeof useAppParams>["query"]
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

export const abbreviate = (num: string) => {
  const abs = Number(num);
  if (abs >= 1e9) return (abs / 1e9).toFixed(2).replace(/\.0+$/, "") + "B";
  if (abs >= 1e6) return (abs / 1e6).toFixed(2).replace(/\.0+$/, "") + "M";
  if (abs >= 1e3) return (abs / 1e3).toFixed(2).replace(/\.0+$/, "") + "K";
  
  return String(formatDecimals(num, 2));
};

export const getNetworkByChainId = (chainId?: number) => {
  if (!chainId) return;
  return Object.values(networks).find((network) => network.id === chainId);
};