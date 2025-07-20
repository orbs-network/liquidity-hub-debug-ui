import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import { REACT_QUERY_KEYS } from "./consts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 5 * 60, // 60 minutes cache duration
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return [
        REACT_QUERY_KEYS.configs,
      ].includes(query.queryKey[0] as keyof typeof REACT_QUERY_KEYS);
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  </GoogleOAuthProvider>

);
