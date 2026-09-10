import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

// Blocks already-authenticated users from Login/Signup and sends them
// straight to their dashboard instead.
export default function GuestRoute() {
  const { isAuthenticated, role, initializing } = useAuth();

  if (initializing) return <Loader full label="Loading MedTrack..." />;

  if (isAuthenticated) {
    return <Navigate to={role === "DOCTOR" ? "/doctor/dashboard" : "/patient/dashboard"} replace />;
  }

  return <Outlet />;
}
