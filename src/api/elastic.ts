import _ from "lodash";
import { SessionsFilter, SessionsFilterTerms } from "../types";

const termValue = (value: string | string[] | number) => {
  return Array.isArray(value) ? value : [value];
};

interface Args {
  filter?: SessionsFilter;
  timeRange?: string;
}

const createConditions = (args?: SessionsFilter) => {
  let result: any = [
    {
      exists: {
        field: "sessionId",
      },
    },
  ];
  if (!args) {
    return result;
  }

  const should = createTerms(args.should);

  const must = createTerms(args.must);
  if (_.size(must)) {
    result = result.concat(must);
  }

  if (_.size(should)) {
    result = [
      ...result,
      {
        bool: {
          should,
        },
      },
    ];
  }
  return result;
};

const createQuery = (args: Args) => {
  let bool: any = {}
    if (args.timeRange) {
      bool.filter = [
        {
          range: {
            timestamp: {
              gte: `now-${args.timeRange}`,
            },
          },
        },
      ];
    }
  const must = createConditions(args.filter);
  bool.must = must;


  return { bool };
};

const createTerms = (filter?: SessionsFilterTerms) => {
  if (!filter) {
    return [];
  }
  return _.map(filter, (it) => {
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
    query: createQuery(args),
    highlight: {
      pre_tags: ["@kibana-highlighted-field@"],
      post_tags: ["@/kibana-highlighted-field@"],
      fields: {
        "*": {},
      },
    },
  };
};
