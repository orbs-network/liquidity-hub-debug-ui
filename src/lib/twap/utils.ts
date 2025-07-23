import { Configs, eqIgnoreCase } from "@orbs-network/twap-sdk";
import { URL_QUERY_KEYS } from "@/consts";
import _ from "lodash";
import moment from "moment";
import { isHash } from "viem";
import { PARTNERS } from "@/partners";
import { TwapConfig } from "./types";
import { isNumeric, isValidWalletAddress } from "../utils";

export const getTwapConfig = (exchangeAddress: string, chainId: number) => {
  return _.find(
    Configs,
    (p) =>
      eqIgnoreCase(p.exchangeAddress, exchangeAddress) && p.chainId === chainId
  );
};

export const getPartnerByTwapConfig = (config?: TwapConfig) => {
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
  ) as TwapConfig[];
};

export const getConfigByExchange = (
  configs: TwapConfig[],
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
  configs: TwapConfig[],
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
): TwapConfig | undefined => {
  return Object.values(Configs).find(
    (n) => eqIgnoreCase(n.twapAddress, twapAddress) && n.chainId === chainId
  ) as TwapConfig | undefined;
};

export const getConfigsByChainIds = (
  chainIds?: number[] | string[]
): TwapConfig[] | undefined => {
  const chainIdsNumbers = chainIds?.map(Number);
  return Object.values(Configs).filter((n) =>
    chainIdsNumbers?.includes(n.chainId)
  ) as TwapConfig[] | undefined;
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
