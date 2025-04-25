import { useState } from "react";

const useAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem("Token")
  );

  const login = (token: string) => {
    localStorage.setItem("Token", token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem("Token");
    setAuthToken(null);
  };

  return { authToken, login, logout };
};

export default useAuth;
