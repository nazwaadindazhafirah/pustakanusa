import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookProvider>
          <RouterProvider router={router} />
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}