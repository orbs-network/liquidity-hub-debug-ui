/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNativeAddress } from "@orbs-network/twap-sdk";
import { useQuery } from "@tanstack/react-query";
import { erc20Abi, zeroAddress } from "viem";
import { getPublicClient } from "../lib";
import { getNetworkByChainId } from "../utils";
import { useMemo } from "react";
import _ from "lodash";
import { Token } from "../types";

// --- LocalStorage helpers ---

// const getTokenFromLocalStorage = (
//   _address: string,
//   chainId: number
// ): Token | null => {
//   const key = `tokens-${chainId}`;
//   const tokens = localStorage.getItem(key);
//   if (!tokens) return null;
//   try {
//     const parsed = JSON.parse(tokens) as Record<string, Token>;
//     return parsed[_address.toLowerCase()] ?? null;
//   } catch {
//     return null;
//   }
// };

// const setTokenToLocalStorage = (
//   address: string,
//   chainId: number,
//   token: Token
// ) => {
//   const key = `tokens-${chainId}`;
//   let parsed: Record<string, Token> = {};
//   try {
//     const existing = localStorage.getItem(key);
//     if (existing) parsed = JSON.parse(existing);
//   } catch {
//     parsed = {};
//   }
//   parsed[address.toLowerCase()] = token;
//   localStorage.setItem(key, JSON.stringify(parsed));
// };
export const useTokens = (
  _tokenAddresses?: (string | undefined)[],
  chainId?: number,
  disabled = false
) => {
  const tokenAddresses = useMemo(
    () => _.uniq(_tokenAddresses),
    [_tokenAddresses]
  );

  return useQuery({
    queryKey: ["useTokens", tokenAddresses?.join(","), chainId],
    queryFn: async () => {
      const publicClient = getPublicClient(chainId!);
      const chain = getNetworkByChainId(chainId);
      if (!publicClient) throw new Error("Public client not found");

      const filteredAddresses =
        tokenAddresses?.filter((a): a is string => !!a) ?? [];

      const nativeTokenIndexes: number[] = [];
      const tokensFromCache: Token[] = [];

      // Collect tokens from localStorage
      const addressesToFetch: string[] = [];

      filteredAddresses.forEach((address, index) => {
        if (isNativeAddress(address)) {
          nativeTokenIndexes.push(index);
        } else {
          addressesToFetch.push(address);
          // const cached = getTokenFromLocalStorage(address, chainId!);
          // if (cached) {
          //   tokensFromCache.push(cached);
          // } else {
          //   addressesToFetch.push(address);
          // }
        }
      });

      const contracts = addressesToFetch.flatMap((address) => [
        {
          address: address as `0x${string}`,
          abi: erc20Abi,
          functionName: "decimals",
        },
        {
          address: address as `0x${string}`,
          abi: erc20Abi,
          functionName: "name",
        },
        {
          address: address as `0x${string}`,
          abi: erc20Abi,
          functionName: "symbol",
        },
      ]);

      const results: Token[] = [...tokensFromCache];

      if (contracts.length > 0) {
        const multicallResults = await publicClient.multicall({
          contracts,
          allowFailure: true,
        });

        for (let i = 0; i < addressesToFetch.length; i++) {
          const offset = i * 3;
          const token: Token = {
            address: addressesToFetch[i],
            decimals: multicallResults[offset]?.result as number,
            name: multicallResults[offset + 1]?.result as string,
            symbol: multicallResults[offset + 2]?.result as string,
          };
          if (token.decimals !== undefined) {
            results.push(token);
            // setTokenToLocalStorage(token.address, chainId!, token);
          }
        }
      }

      // Insert native tokens at correct indexes
      nativeTokenIndexes.forEach((index) => {
        results.splice(index, 0, {
          address: zeroAddress,
          decimals: chain?.native.decimals as number,
          name: chain?.native.symbol as string,
          symbol: chain?.native.symbol as string,
        });
      });

      return results;
    },
    enabled: !!tokenAddresses?.length && !!chainId && !disabled,
    staleTime: Infinity,
  });
};

export const useToken = (address?: string, chainId?: number) => {

  const data = useTokens([address], chainId);
  return useMemo(() => {
    return data.data?.[0];
  }, [data.data]);
};
