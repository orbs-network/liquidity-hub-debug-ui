import BN from "bignumber.js";

export const isDebug = !!localStorage.getItem("debug");

export function identifyAddressOrTxHash(input?: string) {
  const ethereumAddressPattern = /^0x[a-fA-F0-9]{40}$/;
  const ethereumTxHashPattern = /^0x[a-f0-9]{64}$/;
  
  if(!input){
    return "invalid";
  }
    
  // Check for Ethereum wallet addresses
  if (ethereumAddressPattern.test(input)) {
    return "address";
  }

  // Check for Ethereum transaction hashes
  else if (ethereumTxHashPattern.test(input)) {
    return "txHash";
  }
  // If none match
  else {
    return "sessionId";
  }
}

export const addSlippage = (amount?: string, slippage?: number) => {
  if (!amount || !slippage) return amount;

  const slippageBN = BN(amount).times(slippage).div(100);

  return BN(amount).plus(slippageBN).toString();
};

