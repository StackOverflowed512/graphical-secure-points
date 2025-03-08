
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginData, RegisterData, AuthContextType } from "../types/auth";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_AUTH_IMAGES } from "@/utils/authUtils";
import { setupExtensionHandler, initializeExtension } from "@/utils/extensionConnector";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Initialize extension connection if the user is logged in
        if (parsedUser && parsedUser.id) {
          setupExtensionHandler();
          initializeExtension(parsedUser.id, parsedUser.token || "auth-token");
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (data: LoginData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate login API call - in a real app, this would be an actual API call
      const userData = {
        id: 'user123',
        username: data.email.split('@')[0],
        email: data.email,
        token: 'sample-token-' + Math.random().toString(36).substring(2)
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Initialize extension connection when user logs in
      setupExtensionHandler();
      initializeExtension(userData.id, userData.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate register API call - in a real app, this would be an actual API call
      const userData = {
        id: 'user' + Math.random().toString(36).substring(2),
        username: data.username || data.email.split('@')[0],
        email: data.email,
        token: 'sample-token-' + Math.random().toString(36).substring(2)
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Initialize extension connection when user registers
      setupExtensionHandler();
      initializeExtension(userData.id, userData.token);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.username}!`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
