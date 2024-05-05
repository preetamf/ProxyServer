import { useLoaderData, useOutlet } from "react-router-dom";
import { AuthProvider } from "../utils/useAuth";

export const AuthLayout = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>{outlet}</AuthProvider>
  );
};