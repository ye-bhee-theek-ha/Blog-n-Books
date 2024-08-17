import { createContext, useContext } from "react";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isloggedin = !!token;

  const storeTokenInLS = (serverToken) => {
    localStorage.setItem('token', serverToken);
    setToken(serverToken); // Update token state
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    // window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ storeTokenInLS, isloggedin, getToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
