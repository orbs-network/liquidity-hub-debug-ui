import { App } from "@/App";
import {
  LiquidityHubPages,
  TwapPages,
  MainPage,
} from "@/pages";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./config";
import { Order } from "@orbs-network/twap-sdk";

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
            element: <LiquidityHubPages.SwapsPage />,
          },

          {
            path: ROUTES.liquidityHub.swap,
            element: <LiquidityHubPages.SwapPage />,
          },
          {
            path: ROUTES.liquidityHub.swapPreview,
            element: <LiquidityHubPages.SwapPage isPreview={true} />,
          },

          {
            path: ROUTES.liquidityHub.overview,
            element: <LiquidityHubPages.OverviewPage />,
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


export const navigation = {
  liquidityHub: {
    swap: (value: string) =>
      ROUTES.liquidityHub.swap.replace(":identifier", value),
    swapPreview: (value: string) =>
      ROUTES.liquidityHub.swapPreview.replace(":identifier", value),
    overview: () => ROUTES.liquidityHub.overview,
  },
  twap: {
    order: (order: Order) => {
      return ROUTES.twap.order
        .replace(":orderId", order.id.toString())
        .replace(":twapAddress", order.twapAddress)
        .replace(":chainId", order.chainId.toString());
    },
  },
};
