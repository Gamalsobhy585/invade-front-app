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
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [name, setName] = useState<string | null>(localStorage.getItem("name"));
  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));
  const [image, setImage] = useState<string | null>(localStorage.getItem("image"));

  useEffect(() => {
    token ? localStorage.setItem("token", token) : localStorage.removeItem("token");
    role ? localStorage.setItem("role", role) : localStorage.removeItem("role");
    name ? localStorage.setItem("name", name) : localStorage.removeItem("name");
    email ? localStorage.setItem("email", email) : localStorage.removeItem("email");
    image ? localStorage.setItem("image", image) : localStorage.removeItem("image");
  }, [token, role, name, email, image]);

  return (
    <UserContext.Provider value={{ token, role, name, email, image, setToken, setRole, setName, setEmail, setImage }}>
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
