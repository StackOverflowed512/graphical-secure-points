
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginFormData, RegisterFormData, AuthContextType } from "../types/auth";
import { toast } from "@/components/ui/use-toast";
import { loginUser, registerUser } from "@/utils/authUtils";
import { setupExtensionHandler, initializeExtension } from "@/utils/extensionConnector";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
  const login = async (data: LoginFormData): Promise<boolean> => {
    setLoading(true);
    
    try {
      const user = await loginUser(data);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Initialize extension connection when user logs in
      setupExtensionHandler();
      initializeExtension(user.id, user.token || "auth-token");
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterFormData): Promise<boolean> => {
    setLoading(true);
    
    try {
      const user = await registerUser(data);
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Initialize extension connection when user registers
      setupExtensionHandler();
      initializeExtension(user.id, user.token || "auth-token");
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.username}!`,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
