import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { ClobSessionPage, ClobSessionsPage } from "./pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.main,
    element: <App />,
    children: [
      {
        element: <ClobSessionsPage searchBy="all" />,
        index: true,
      },
      {
        element: <ClobSessionsPage searchBy="all" />,
        path: ROUTES.clobSessions,
      },
      {
        path: ROUTES.clobSessionsByAddress,
        element: <ClobSessionsPage searchBy="address" />,
      },
      {
        path: ROUTES.clobSession,
        element: <ClobSessionPage />,
      },

      {
        path: "*",
        element: <Navigate to={ROUTES.main} />,
      },
    ],
  },
]);
