import { hydrateRoot } from "react-dom/client";
import { hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();
declare global {
  interface Window {
    __SUVARNA_QUERY_STATE__?: unknown;
  }
}

if (window.__SUVARNA_QUERY_STATE__) {
  hydrate(queryClient, window.__SUVARNA_QUERY_STATE__ as Parameters<typeof hydrate>[1]);
}

hydrateRoot(document.getElementById("root")!,
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
