import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth"

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // if user is not authenticated
    return <Navigate to="/" />;
  }
  return children;
};