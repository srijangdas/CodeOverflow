import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const stored = localStorage.getItem("stackit-user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email) => {
    const newUser = { email };
    setUser(newUser);
    localStorage.setItem("stackit-user", JSON.stringify(newUser)); // Save
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stackit-user"); // Clear
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
