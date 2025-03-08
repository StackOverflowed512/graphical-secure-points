
import React, { useEffect, useState } from "react";
import { usePasswords } from "@/context/PasswordContext";
import { useAuth } from "@/context/AuthContext";
import PasswordList from "./PasswordList";
import PasswordForm from "./PasswordForm";
import { syncPasswordsWithExtension, isExtensionInstalled } from "@/utils/extensionConnector";
import { Password, CreatePasswordData, UpdatePasswordData } from "@/types/password";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PasswordDashboard: React.FC = () => {
  const { user } = useAuth();
  const { passwords, loading, getPasswords, addPassword, updatePassword, deletePassword } = usePasswords();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);
  const [passwordToDelete, setPasswordToDelete] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [extensionDetected, setExtensionDetected] = useState(false);

  // Load passwords when component mounts
  useEffect(() => {
    const loadPasswords = async () => {
      setInitialLoading(true);
      await getPasswords();
      setInitialLoading(false);
    };
    
    loadPasswords();
    
    // Check for extension
    setExtensionDetected(isExtensionInstalled());
    
    // Debug
    console.log("PasswordDashboard mounted, loading passwords");
  }, [getPasswords]);

  // Sync passwords with extension when they change
  useEffect(() => {
    if (user && passwords.length > 0 && extensionDetected) {
      syncPasswordsWithExtension(user.id, passwords);
    }
  }, [user, passwords, extensionDetected]);

  const handleAddPassword = () => {
    setSelectedPassword(null);
    setIsFormOpen(true);
  };

  const handleEditPassword = (password: Password) => {
    setSelectedPassword(password);
    setIsFormOpen(true);
  };

  const handleDeletePassword = (id: string) => {
    setPasswordToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (passwordToDelete) {
      try {
        await deletePassword(passwordToDelete);
      } catch (error) {
        // Error is already handled in the context
        console.error("Error deleting password:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setPasswordToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (data: CreatePasswordData) => {
    try {
      if (selectedPassword) {
        // Update existing password
        await updatePassword({
          id: selectedPassword.id,
          ...data,
        } as UpdatePasswordData);
      } else {
        // Create new password
        await addPassword(data);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error is already handled in the context
      console.error("Error saving password:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Password Manager</h2>
        <p className="text-muted-foreground">
          Securely store and manage your passwords in one place.
        </p>
      </div>

      <PasswordList
        passwords={passwords}
        loading={initialLoading}
        onEdit={handleEditPassword}
        onDelete={handleDeletePassword}
        onAdd={handleAddPassword}
      />

      <PasswordForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPassword || undefined}
        title={selectedPassword ? "Edit Password" : "Add Password"}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this password. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasswordDashboard;
