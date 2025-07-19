import { REACT_QUERY_KEYS } from "@/consts";
import { Config } from "@/types";
import { getPartnerIdentifier, LEGACY_EXCHANGES_MAP } from "@orbs-network/twap-sdk";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";




export const useConfigs = () => {
  return useQuery<Config[]>({
    queryKey: [REACT_QUERY_KEYS.configs],
    queryFn: async ({ signal }) => {
      const response = await axios.get(
        "https://raw.githubusercontent.com/orbs-network/twap/master/configs.json",
        {
          signal,
        }
      );
      const configs = response.data;

      return _.map(configs, (config) => {
        const key = getPartnerIdentifier(config)
        const legacyExchanges = LEGACY_EXCHANGES_MAP[key]
        return {
          ...config,
          exchangeAddresses: legacyExchanges ? [...legacyExchanges, config.exchangeAddress] : [config.exchangeAddress],
        legacyExchanges: legacyExchanges || []
        };
      });
    },
    staleTime: Infinity,
  });
};