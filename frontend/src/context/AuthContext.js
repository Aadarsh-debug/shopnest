import React, { createContext, useEffect, useState, useContext } from "react";
import { useToast } from "./ToastContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("userInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
      } else {
        localStorage.removeItem("userInfo");
      }
    } catch (e) {
      console.warn("Could not sync user to localStorage", e);
    }
  }, [user]);

  const login = (userdata) => {
    setUser(userdata);
    localStorage.setItem("userInfo", JSON.stringify(userdata));
    addToast(`Welcome back, ${userdata.name || "User"}!`, "success", "Signed In");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    addToast("You have been signed out safely.", "info", "Signed Out");
  };

  const demoLogin = (role = "user") => {
    if (role === "admin") {
      const adminData = {
        _id: "demo_admin_id",
        name: "Elena Vance",
        email: "admin@shopnest.com",
        role: "admin",
        token: "demo_admin_jwt_token_sample",
      };
      login(adminData);
    } else {
      const userData = {
        _id: "demo_user_id",
        name: "Sophia Reynolds",
        email: "demo@shopnest.com",
        role: "user",
        token: "demo_user_jwt_token_sample",
      };
      login(userData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
