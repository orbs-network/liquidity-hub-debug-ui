

const transactionHash = (txHash: string) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            term: {
              "txHash.keyword": txHash,
            },
          },
          {
            term: {
              "type.keyword": "swap",
            },
          },
        ],
      },
    },
    size: 1,
  };
};

const sessionId = (sessionId: string) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            term: {
              "sessionId.keyword": sessionId,
            },
          },
          {
            term: {
              "type.keyword": "swap",
            },
          },
        ],
      },
    },
    size: 1,
  };
};

const quote = (sessionId: string) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            term: {
              "sessionId.keyword": sessionId,
            },
          },
          {
            term: {
              "type.keyword": "quote",
            },
          },
        ],
      },
    },
  };
};

const client = (sessionId: string) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            term: {
              "sessionId.keyword": sessionId, // Array of specific sessionIds
            },
          },
        ],
      },
    },
    sort: [
      {
        timestamp: {
          order: "desc",
        },
      },
    ],
  };
};

const swaps = ({
  page,
  limit,
  chainId,
  walletAddress,
  dex,
  minDollarValue,
  inToken,
  outToken,

  feeOutAmountUsd,
}: {
  chainId?: string[];
  page: number;
  limit: number;
  walletAddress?: string[];
  dex?: string[];
  minDollarValue?: string;
  inToken?: string[];
  outToken?: string[];
  feeOutAmountUsd?: string;
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
const clientTrasactions = (ids: string[], page: number, limit: number) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            terms: {
              "sessionId.keyword": ids,
            },
          },
        ],
      },
    },
    size: limit, // Number of results per page
    from: page * limit, // Starting point (adjust for pagination, e.g., 0 for page 1, 100 for page 2, etc.)

    sort: [
      {
        timestamp: {
          order: "desc",
        },
      },
    ],
  };
};

const queryInitialData = {
  fields: [
    {
      field: "*",
    },
    {
      field: "timestamp",
    },
  ],
  version: true,
  script_fields: {},
  stored_fields: ["*"],
  runtime_mappings: {},
  _source: false,
  highlight: {
    pre_tags: ["@kibana-highlighted-field@"],
    post_tags: ["@/kibana-highlighted-field@"],
    fields: {
      "*": {},
    },
  },
};

const twapLogs = (orderId: number, chainId: number) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          {
            bool: {
              should: [
                {
                  term: {
                    chainId: chainId,
                  },
                },
                {
                  term: {
                    chain: chainId,
                  },
                },
              ],
              minimum_should_match: 1, // At least one of the conditions in 'should' must match
            },
          },
          {
            bool: {
              should: [
                {
                  term: {
                    newOrderId: orderId,
                  },
                },
                {
                  term: {
                    orderId: orderId,
                  },
                },
              ],
              minimum_should_match: 1, // At least one of the conditions in 'should' must match
            },
          },
        ],
      },
    },
  };
};

export const queries = {
  transactionHash,
  swaps,
  clientTrasactions,
  sessionId,
  quote,
  client,
  twapLogs,
};
