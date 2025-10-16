import React, { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { me, logout as logoutService } from "../services/authentication";
import type { IUser } from "../types";

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: IUser) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export type { AuthContextType };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = (userData: IUser) => {
    setUser(userData);
    // Store user data in localStorage for persistence
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // First check if we have user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }

      // Then verify with the server
      const response = await me();
      if (response.success && response.data) {
        const userData: IUser = {
          _id: response.data._id,
          username: response.data.username,
          createdAt: "", // These might not be available from the /me endpoint
          updatedAt: "", // You may need to adjust based on your API response
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // If verification fails, clear stored data
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
