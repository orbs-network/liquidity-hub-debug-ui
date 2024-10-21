import { SessionsFilter } from "types";

export interface FetchSessionArgs {
    url: string;
    filter?: SessionsFilter;
    timeRange?: string;
    signal?: AbortSignal;
  }
  
  