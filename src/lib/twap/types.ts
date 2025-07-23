export interface TwapConfig {
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