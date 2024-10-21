import { WalletTransactionsPage } from "pages/clob/address/WalletTransactionsPage";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { ClobSessionsPage, PublicPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <ClobSessionsPage />,
        index: true,
      },
      {
        path: ROUTES.address,
        element: <WalletTransactionsPage />,
      },
      {
        path: ROUTES.tx,
        element: <PublicPage />,
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
