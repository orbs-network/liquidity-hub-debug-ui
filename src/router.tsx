import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { UserTransactionsPage, TransactionPage, MainPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <MainPage />,
        index: true,
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
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
