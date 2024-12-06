import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import ResultPage from "./pages/ResultPage.tsx";
import Page404 from "./pages/Page404.tsx";

import { ResultProvider } from "./helper/context.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Page404 />,
  },
  {
    path: "/results",
    element: <ResultPage />,
    errorElement: <Page404 />,
  },
  {
    path: "*", // This handles any non-matching routes
    element: <Page404 />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <ResultProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ResultProvider>
);
