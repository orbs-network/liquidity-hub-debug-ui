import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ROUTES } from "./config";
import { MainPage } from "./pages/main/MainPage";
import { SessionPage } from "./pages/session/SessionPage";

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
