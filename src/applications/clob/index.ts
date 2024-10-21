import axios from "axios";
import _ from "lodash";
import { getIdsFromSessions, normalizeSessions } from "helpers";
import { elastic } from "services/elastic";
import { SessionsFilter } from "types";
import { FetchSessionArgs } from "./types";
import { parseSessions } from "./helpers";

class Clob {
  SERVER_SESSIONS = "orbs-clob-poc10.*";
  CLIENT_SESSIONS = "orbs-liquidity-hub-ui*";

  getSessions = async ({
    signal,
    timeRange,
    filter,
  }: {
    signal?: AbortSignal;
    timeRange?: string;
    filter?: SessionsFilter;
  }) => {
    let args: Partial<FetchSessionArgs> = {
      signal,
      timeRange,
      filter,
    };
    const swapFirst =
      _.size(
        filter?.must?.find(
          (f) =>
            f.keyword === "type" ||
            f.keyword === "swapStatus" ||
            f.keyword === "txHash"
        )
      ) > 0;

    if (!swapFirst) {
      const serverSessions = await this.fetchServerSessions(args);
      const ids = getIdsFromSessions(serverSessions);

      const clientSessions = await this.fetchClientSessions({
        timeRange: args.timeRange,
        signal: args.signal,
        filter: {
          must: [
            {
              keyword: "sessionId",
              value: ids,
            },
          ],
          should: undefined,
        },
      });

      return parseSessions(_.flatten([clientSessions, serverSessions]));
    }

    const swapSessions = await this.fetchServerSessions(args);

    const ids = getIdsFromSessions(swapSessions);

    const quoteSessions = this.fetchServerSessions({
      ...args,
      filter: {
        must: [
          {
            keyword: "sessionId",
            value: ids,
          },
          {
            keyword: "type",
            value: "quote",
          },
        ],
        should: undefined,
      },
    });

    const clientSessions = this.fetchClientSessions({
      ...args,
      filter: {
        must: [
          {
            keyword: "sessionId",
            value: ids,
          },
        ],
        should: undefined,
      },
    });

    const [quoteRes, clientRes] = await Promise.all([
      quoteSessions,
      clientSessions,
    ]);

    return parseSessions(_.flatten([clientRes, swapSessions, quoteRes]));
  };

  async fetchSessions({ url, filter, timeRange, signal }: FetchSessionArgs) {
    const data = elastic.createQueryBody({
      filter: filter && _.size(filter) ? filter : undefined,
      timeRange,
    });

    const response = await axios.post(
      `${elastic.endpoint}/${url}/_search`,
      { ...data },
      { signal }
    );

    return normalizeSessions(
      response.data.hits?.hits.map((hit: any) => hit.fields)
    );
  }
  async fetchServerSessions(args: Partial<FetchSessionArgs>) {
    return this.fetchSessions({ url: this.SERVER_SESSIONS, ...args });
  }

  async fetchClientSessions(args: Partial<FetchSessionArgs>) {
    const sessions = await this.fetchSessions({
      url: this.CLIENT_SESSIONS,
      ...args,
    });
    return sessions.map((session) => {
      return {
        ...session,
        type: "client",
      };
    });
  }
}

export const clob = new Clob();
