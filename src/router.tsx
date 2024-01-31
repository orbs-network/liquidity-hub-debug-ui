import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { SessionPage, SessionsPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <SessionsPage searchBy="all" />,
        index: true,
      },
      {
        path: ROUTES.sessionsByAddress,
        element: <SessionsPage searchBy="address" />,
      },
      {
        path: ROUTES.session,
        element: <SessionPage />,
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
