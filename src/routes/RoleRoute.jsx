import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

// Wrap route groups that belong to a single role, e.g.
// <Route element={<RoleRoute allow={["DOCTOR"]} />}> ... </Route>
export default function RoleRoute({ allow = [] }) {
  const { role, initializing } = useAuth();

  if (initializing) return <Loader full label="Checking your session..." />;

  if (!allow.includes(role)) {
    const fallback = role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
