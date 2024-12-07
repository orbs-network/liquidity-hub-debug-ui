import _ from "lodash";

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
  outToken
}: {
  chainId?: number;
  page: number;
  limit: number;
  walletAddress?: string;
  dex?: string;
  minDollarValue?: number;
  inToken?: string;
  outToken?: string;
}) => {
  return {
    ...queryInitialData,
    query: {
      bool: {
        filter: [
          chainId && {
            term: {
              chainId: chainId,
            },
          },
          walletAddress
            ? {
              script: {
                script: {
                  source: "doc['user.keyword'].value.toLowerCase() == params.user.toLowerCase()",
                  params: {
                    user: walletAddress,
                  },
                },
              },
            }
            : undefined,
            dex
            ? {
              script: {
                script: {
                  source: "doc['dex.keyword'].value.toLowerCase() == params.dex.toLowerCase()",
                  params: {
                    dex: dex,
                  },
                },
              },
            }
            : undefined,
          {
            term: {
              "type.keyword": "swap",
            },
          },
          inToken ?  {
            script: {
              script: {
                source: "doc['tokenInName.keyword'].value.toLowerCase() == params.tokenInName.toLowerCase()",
                params: {
                  tokenInName: inToken,
                },
              },
            },
          } : undefined,
          outToken ?  {
            script: {
              script: {
                source: "doc['tokenOutName.keyword'].value.toLowerCase() == params.tokenOutName.toLowerCase()",
                params: {
                  tokenOutName: outToken,
                },
              },
            },
          } : undefined,
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
          minDollarValue ? {
            range: {
              dollarValue: {
                gt: minDollarValue,
              },
            },
          } : undefined,
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
                    "chainId": chainId,
                  },
                },
                {
                  term: {
                    "chain": chainId,
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
                    "newOrderId": orderId,
                  },
                },
                {
                  term: {
                    "orderId": orderId,
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
  twapLogs
};
