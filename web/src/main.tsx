import React from "react";
import ReactDOM from "react-dom/client";
import "./api/config";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainPage from "./pages/MainPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/app",
    element: <MainPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
