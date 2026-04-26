import { createContext, useState, useEffect } from "react";

// create context
export const AuthContext = createContext();

function AuthProvider({ children }) {

  // state
  const [user, setUser] = useState(null);

  // ✅ load user from localStorage (on app start)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ save user when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // provide values globally
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;