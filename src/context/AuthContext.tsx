
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, LoginData, RegisterData, User } from "../types/auth";
import { simulateAuth } from "../utils/api";
import { toast } from "@/components/ui/use-toast";

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await simulateAuth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await simulateAuth.register(data);
      setUser(newUser);
      setIsAuthenticated(true);
      toast({
        title: "Registration successful",
        description: `Welcome, ${newUser.username}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await simulateAuth.login(data);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: `Welcome back, ${loggedInUser.username}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await simulateAuth.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      toast({
        title: "Logout failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
