
import React, { createContext, useContext, useState } from "react";
import { addPassword, deletePassword, getUserPasswords, updatePassword } from "../utils/passwordService";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

// Create context with default values
const PasswordContext = createContext({
  passwords: [],
  loading: false,
  error: null,
  getPasswords: async () => {},
  addPassword: async () => {},
  updatePassword: async () => {},
  deletePassword: async () => {},
});

export const usePasswords = () => useContext(PasswordContext);

export const PasswordProvider = ({ children }) => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch all passwords for the current user
  const getPasswords = async () => {
    if (!user) return;
    
    if (!isInitialized) {
      setLoading(true);
    }

    setError(null);
    
    try {
      console.log("Fetching passwords for user:", user.id);
      const userPasswords = await getUserPasswords(user.id);
      console.log("Passwords fetched:", userPasswords);
      setPasswords(userPasswords);
      setIsInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch passwords";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new password
  const handleAddPassword = async (data) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newPassword = await addPassword(user.id, data);
      setPasswords((prevPasswords) => [...prevPasswords, newPassword]);
      toast({
        title: "Password added",
        description: "Your password has been securely stored",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add password";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing password
  const handleUpdatePassword = async (data) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedPassword = await updatePassword(user.id, data);
      setPasswords((prevPasswords) =>
        prevPasswords.map((p) => (p.id === data.id ? updatedPassword : p))
      );
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a password
  const handleDeletePassword = async (id) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await deletePassword(user.id, id);
      setPasswords((prevPasswords) => prevPasswords.filter((p) => p.id !== id));
      toast({
        title: "Password deleted",
        description: "Your password has been deleted successfully",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete password";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    passwords,
    loading,
    error,
    getPasswords,
    addPassword: handleAddPassword,
    updatePassword: handleUpdatePassword,
    deletePassword: handleDeletePassword,
  };

  return <PasswordContext.Provider value={value}>{children}</PasswordContext.Provider>;
};
