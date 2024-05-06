import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage"; //custom hook to save user state to local browser if page refreshed
const AuthContext = createContext(); //context Api

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null); //null will store users data
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    if(!data) {
      navigate("/signup")
    }
    setUser(data);
    console.log("context user data", user)
    navigate("/dashboard");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};