import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContextType } from "./type";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [name, setName] = useState<string | null>(localStorage.getItem("name"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

  useEffect(() => {
    token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
    name ? localStorage.setItem("name", name) : localStorage.removeItem("name");
    email ? localStorage.setItem("email", email) : localStorage.removeItem("email");
  }, [token, name, email]);

  return (
    <UserContext.Provider value={{ token, name, email, setToken, setName, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
