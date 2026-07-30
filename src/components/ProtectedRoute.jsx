import { Navigate, useLocation } from "react-router-dom";

const ROLE_ROUTE_ACCESS = {
  "/dashboard": ["admin", "hr"],
  "/employees": ["admin", "hr"],
  "/departments": ["admin", "hr"],
  "/attendance": ["admin", "hr"],
  "/leave": ["admin", "hr"],
  "/users": ["admin"],
  "/profile": ["admin", "hr", "employee"],
  "/my-attendance": ["admin", "hr", "employee"],
  "/my-leave": ["admin", "hr", "employee"],
};

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const payload = decodeToken(token);

  if (!payload?.role) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  const allowedRoles = ROLE_ROUTE_ACCESS[location.pathname] || ["admin", "hr", "employee"];

  if (!allowedRoles.includes(payload.role)) {
    const fallbackPath = payload.role === "employee" ? "/profile" : "/dashboard";
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}

export default ProtectedRoute;