import {
  Config,
  Configs,
  eqIgnoreCase,
  getConfigByExchange,
} from "@orbs-network/twap-sdk";
import BN from "bignumber.js";
import { ROUTES } from "@/config";
import { URL_QUERY_KEYS } from "@/consts";
import _ from "lodash";
import moment from "moment";
import { partners } from "@/partners";
import { isHash } from "viem";

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

export const getPartnerByTwapConfig = (config: Config) => {
  return _.find(partners, (p) => p.twapPartner === config.partner);
};

export const getPartnerByTwapExchange = (exchange: string, chainId: number) => {
  const config = getConfigByExchange(exchange, chainId);
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

export const getPartnerById = (id: string) => {
  return _.find(partners, (p) => p.id === id);
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
    order: (orderIdOrTxHash: string) => {
      return ROUTES.twap.order.replace(":orderIdOrTxHash", orderIdOrTxHash);
    },
    maker: (maker: string) => {
      return ROUTES.twap.maker.replace(":maker", maker);
    },
  },
};

function isNumeric(value: string): boolean {
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

export const resolveOrderIdentifier = (
  identifier: string
): Record<string, string> => {
  const parsedIdentifiers = identifier.split(",");
  console.log(parsedIdentifiers);

  const result: Record<string, string> = {};

  for (const value of parsedIdentifiers) {
    if (isValidWalletAddress(value)) {
      result[URL_QUERY_KEYS.USER] = value;
    }
    if (isHash(value)) {
      result[URL_QUERY_KEYS.TWAP_ORDER_TX_HASH] = value;
    }
    if (isNumeric(value)) {
      result[URL_QUERY_KEYS.ORDER_ID] = value;
    }
  }

  return result;
};
