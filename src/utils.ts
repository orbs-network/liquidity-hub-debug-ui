import { Configs } from "@orbs-network/twap-sdk";
import BN from "bignumber.js";

export const isDebug = !!localStorage.getItem("debug");




export const isValidWalletAddress = (address: string) => {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;

  return ethereumAddressPattern.test(address)
}

export const isValidTxHash = (txHash: string) => {
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;

  return ethereumTxHashPattern.test(txHash)
}

export const isValidSessionId = (sessionId: string) => {
  const regex = /^[a-zA-Z0-9]+_\d+$/;
  return regex.test(sessionId);
}



export const addSlippage = (amount?: string, slippage?: number) => {
  if (!amount || !slippage) return amount;

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};

console.log({Configs});


export const getDexDetailsByExchange = (exchange: string) => {
  switch (exchange) {
    case Configs.Arbidex.exchangeAddress:

      break;
  
    default:
      break;
  }
}