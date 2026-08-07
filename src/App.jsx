import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#fff",
            borderRadius: "0.85rem",
            padding: "0.75rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "600",
            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;