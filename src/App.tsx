import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./Router";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
      <ToastContainer autoClose={2000} />
    </ThemeProvider>
  );
}
