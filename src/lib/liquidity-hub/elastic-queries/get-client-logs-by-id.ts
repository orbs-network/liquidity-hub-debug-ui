import { queryInitialData } from "./main";

export  const getClientBySessionId = (sessionId: string) => {
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