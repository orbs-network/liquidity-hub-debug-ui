import { Configs } from "@orbs-network/twap-sdk";
import BN from "bignumber.js";
import { dexConfig } from "config";

export const isDebug = !!localStorage.getItem("debug");

export const isValidWalletAddress = (address: string) => {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressPattern.test(address);
};

export const isValidTxHash = (txHash: string) => {
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;

  return ethereumTxHashPattern.test(txHash);
};

export const isValidSessionId = (sessionId: string) => {
  const regex = /^[a-zA-Z0-9]+_\d+$/;
  return regex.test(sessionId);
};

export const addSlippage = (amount?: string, slippage?: number) => {
  if (!amount || !slippage) return amount;

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};

export const getDexByExchange = (exchange: string) => {
  switch (exchange) {
    case Configs.Arbidex.exchangeAddress:
      return dexConfig.arbidex;
    case Configs.BaseSwap.exchangeAddress:
      return dexConfig.baseswap;
    case Configs.Chronos.exchangeAddress:
      return dexConfig.chronos;
    case Configs.DragonSwap.exchangeAddress:
      return dexConfig.dragonswap;
    case Configs.Lynex.exchangeAddress:
      return dexConfig.lynex;
    case Configs.PancakeSwap.exchangeAddress:
      return dexConfig.pancakeswap;
    case Configs.Pangolin.exchangeAddress:
    case Configs.PangolinDaas.exchangeAddress:
      return dexConfig.pangolin;
    case Configs.QuickSwap.exchangeAddress:
      return dexConfig.quickswap;
    case Configs.SpookySwap.exchangeAddress:
      return dexConfig.spookyswap;
      case Configs.Thena.exchangeAddress:
      return dexConfig.thena;
      case Configs.SyncSwap.exchangeAddress:
        return dexConfig.syncswap;
    case Configs.SushiArb.exchangeAddress:
    case Configs.SushiBase.exchangeAddress:
    case Configs.SushiEth.exchangeAddress:
      return dexConfig.sushiswap;
      case Configs.Retro.exchangeAddress:
        return dexConfig.retro;
    default:
      break;
  }
};
