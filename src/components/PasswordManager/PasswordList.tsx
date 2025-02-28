
import React, { useState } from "react";
import { Password } from "@/types/password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Copy, Pencil, Trash2, Lock, Search, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PasswordListProps {
  passwords: Password[];
  loading: boolean;
  onEdit: (password: Password) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const PasswordList: React.FC<PasswordListProps> = ({
  passwords,
  loading,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy password to clipboard
  const copyToClipboard = (text: string, type: "password" | "username") => {
    navigator.clipboard.writeText(text);
    // Toast notification handled in the wrapper component
  };

  // Filter passwords based on search term
  const filteredPasswords = passwords.filter(
    (password) =>
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (password.url && password.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={onAdd} className="ml-2">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="text-center py-8">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-2 text-lg font-medium">No passwords found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm
              ? "Try a different search term"
              : "Add your first password to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={onAdd} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Password
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPasswords.map((password) => (
            <Card key={password.id} className="w-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{password.title}</CardTitle>
                    {password.url && (
                      <CardDescription>
                        <a
                          href={password.url.startsWith("http") ? password.url : `https://${password.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {password.url}
                        </a>
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(password)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(password.id)}
                      className="h-8 w-8 p-0 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm text-muted-foreground">Username</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{password.username}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.username, "username")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy username</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm text-muted-foreground">Password</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {visiblePasswords[password.id]
                          ? password.password
                          : "•".repeat(Math.min(12, password.password.length))}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePasswordVisibility(password.id)}
                        className="h-6 w-6 p-0"
                      >
                        {visiblePasswords[password.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span className="sr-only">
                          {visiblePasswords[password.id] ? "Hide" : "Show"} password
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(password.password, "password")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                        <span className="sr-only">Copy password</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              {password.notes && (
                <CardFooter className="pt-0">
                  <div className="w-full">
                    <div className="font-medium text-sm text-muted-foreground mb-1">Notes</div>
                    <p className="text-sm whitespace-pre-wrap">{password.notes}</p>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasswordList;
