
export type Token = {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
};

export interface TransferLog {
  from: string;
  to: string;
  tokenAddress: string;
  value: string;
}

export type Partner = {
  id: string;
  website: string;
  logo: string;
  name: string;
  twapId: string;
  liquidityHubChains: number[];
};

export interface Config {
  chainName: string;
  chainId: number;
  twapVersion: number;
  twapAddress: string;
  lensAddress: string;
  takers: string[];
  bidDelaySeconds: number;
  minChunkSizeUsd: number;
  name: string;
  partner: string;
  exchangeAddresses: string[];
  exchangeAddress: string;
  exchangeType: string;
  pathfinderKey: string;
  legacyExchanges: string[];
}