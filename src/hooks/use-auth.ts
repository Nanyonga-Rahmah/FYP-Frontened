import { useState } from "react";

const useAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("Token")
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = (token: string, userData: any) => {
    localStorage.setItem("Token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  return { authToken, user, login, logout };
};

export default useAuth;
