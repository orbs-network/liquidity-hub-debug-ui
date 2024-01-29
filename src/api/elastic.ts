import _ from "lodash";
import { SessionsFilter } from "../types";

const termValue = (value: string | string[]) => {
  return Array.isArray(value) ? value : [value];
};

const createTerms = (filter?: SessionsFilter) => {
  if (!filter) {
    return []
  }
return  _.map(filter, (it) => {
    return { terms: { [`${it.keyword}.keyword`]: termValue(it.value) } };
  });
  

};

export const createQueryBody = (args: {
  filter?: SessionsFilter;
  timeRange?: string;
}) => {
  return {
    fields: [
      {
        field: "*",
        include_unmapped: "true",
      },
      {
        field: "timestamp",
        format: "strict_date_optional_time",
      },
    ],
    size: 500,
    version: true,
    script_fields: {},
    stored_fields: ["*"],
    runtime_mappings: {},
    _source: false,
    query: {
      bool: {
        must: [...createTerms(args.filter), {
          exists: {
            field: "sessionId",
          }
        }],
        

        filter: [
          {
            range: {
              timestamp: {
                gte: `now-${args.timeRange}`,
              },
            },
          },
        ],
        must_not: [],
      },
    },
    highlight: {
      pre_tags: ["@kibana-highlighted-field@"],
      post_tags: ["@/kibana-highlighted-field@"],
      fields: {
        "*": {},
      },
    },
  };
};
