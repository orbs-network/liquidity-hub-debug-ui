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
  dex
}: {
  chainId?: number;
  page: number;
  limit: number;
  walletAddress?: string;
  dex?: string;
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

export const queries = {
  transactionHash,
  swaps,
  clientTrasactions,
  sessionId,
  quote,
  client,
};
