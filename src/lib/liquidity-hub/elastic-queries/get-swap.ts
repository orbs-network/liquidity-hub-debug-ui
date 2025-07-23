import { queryInitialData } from "./main";

export const getSwaps = ({
    page,
    limit,
    chainId,
    walletAddress,
    dex,
    minDollarValue,
    inToken,
    outToken,
    sessionId,
    startDate,
    endDate,
    feeOutAmountUsd,
    txHash
  }: {
    chainId?: string[];
    page: number;
    limit: number;
    walletAddress?: string[];
    dex?: string[];
    minDollarValue?: string;
    inToken?: string[];
    outToken?: string[];
    sessionId?: string[];
    startDate?: string; // ISO format e.g. "2025-07-01T00:00:00Z"
    endDate?: string;   // ISO format e.g. "2025-07-20T23:59:59Z"
    feeOutAmountUsd?: string;
    txHash?: string[];
  }) => {
    return {
      ...queryInitialData,
      query: {
        bool: {
          filter: [
            chainId?.length && {
              terms: {
                chainId: chainId,
              },
            },
            walletAddress?.length && {
              script: {
                script: {
                  source: `
                    params.users.contains(doc['user.keyword'].value.toLowerCase())
                  `,
                  params: {
                    users: walletAddress.map((a) => a.toLowerCase()),
                  },
                },
              },
            },
            dex?.length && {
              script: {
                script: {
                  source: `
                    params.dexes.contains(doc['dex.keyword'].value.toLowerCase())
                  `,
                  params: {
                    dexes: dex.map((d) => d.toLowerCase()),
                  },
                },
              },
            },
            txHash?.length && {
              script: {
                script: {
                  source: `
                    params.txHashes.contains(doc['txHash.keyword'].value.toLowerCase())
                  `,
                  params: {
                    txHashes: txHash.map((t) => t.toLowerCase()),
                  },
                },
              },
            },
            {
              term: {
                "type.keyword": "swap",
              },
            },
            inToken?.length && {
              script: {
                script: {
                  source: `
                    params.inTokens.contains(doc['tokenInName.keyword'].value.toLowerCase())
                  `,
                  params: {
                    inTokens: inToken.map((t) => t.toLowerCase()),
                  },
                },
              },
            },
            outToken?.length && {
              script: {
                script: {
                  source: `
                    params.outTokens.contains(doc['tokenOutName.keyword'].value.toLowerCase())
                  `,
                  params: {
                    outTokens: outToken.map((t) => t.toLowerCase()),
                  },
                },
              },
            },
            sessionId?.length && {
              terms: {
                "sessionId.keyword": sessionId,
              },
            },
            (startDate || endDate) && {
              range: {
                timestamp: {
                  ...(startDate ? { gte: startDate } : {}),
                  ...(endDate ? { lte: endDate } : {}),
                  format: "strict_date_optional_time",
                },
              },
            },
            {
              exists: {
                field: "txHash.keyword",
              },
            },
            {
              exists: {
                field: "swapStatus.keyword",
              },
            },
            minDollarValue && {
              range: {
                dollarValue: {
                  gt: minDollarValue,
                },
              },
            },
            feeOutAmountUsd && {
              range: {
                feeOutAmountUsd: {
                  gt: feeOutAmountUsd,
                },
              },
            },
          ].filter(Boolean),
          must_not: [
            {
              term: {
                "txHash.keyword": "",
              },
            },
            {
              term: {
                "swapStatus.keyword": "",
              },
            },
          ],
        },
      },
      size: limit,
      from: page * limit,
      sort: [
        {
          timestamp: {
            order: "desc",
          },
        },
      ],
    };
  };
  