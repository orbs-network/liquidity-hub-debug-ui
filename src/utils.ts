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
    return "invalid";
  }
}
