import { App } from "App";
import { OrdersPage } from "pages/twap";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./config";
import { UserTransactionsPage, TransactionPage, TransactionsPage, HomePage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: ROUTES.transactions,
        element: <TransactionsPage />,
      },
      {
        path: ROUTES.address,
        element: <UserTransactionsPage />,
      },
      {
        path: ROUTES.tx,
        element: <TransactionPage />,
      },
      {
        path: ROUTES.twap.root,
        element: <OrdersPage />,
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
