import { App } from "@/App";
import {
  LiquidityHubPages,
  TwapPages,
  MainPage,
} from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./config";

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <App />,
    children: [
      {
        element: <MainPage />,
        index: true,
      },
      {
        path: ROUTES.liquidityHub.root,
        element: <LiquidityHubPages.RootPage />,
        children: [
          {
            index: true,
            path: ROUTES.liquidityHub.root,
            element: <LiquidityHubPages.TransactionsPage />,
          },

          {
            path: ROUTES.liquidityHub.tx,
            element: <LiquidityHubPages.TransactionPage />,
          },
          {
            path: ROUTES.liquidityHub.user,
            element: <LiquidityHubPages.UserTransactionsPage />,
          },
        ],
      },
      {
        path: ROUTES.twap.root,
        element: <TwapPages.Main />,
        children: [
        
          {
            index: true,
            element: <TwapPages.OrdersPage />,
          },
          {
            path: ROUTES.twap.order,
            element: <TwapPages.OrderPage />,
          },
          {
            path: ROUTES.twap.overview,
            element: <TwapPages.OverviewPage />,
          },

        ],
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.root} />,
      },
    ],
  },
]);
