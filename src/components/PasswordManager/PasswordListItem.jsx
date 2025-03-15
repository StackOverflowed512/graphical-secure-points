
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Eye,
    EyeOff,
    Copy,
    Pencil,
    Trash2,
    ExternalLink
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { isExtensionInstalled, requestAutofill } from "@/utils/extensionConnector";

const PasswordListItem = ({ password, onEdit, onDelete }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const extensionInstalled = isExtensionInstalled();

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prev => !prev);
    };

    // Copy text to clipboard
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        toast({
            title: `${type === "password" ? "Password" : "Username"} copied`,
            description: `The ${type} has been copied to your clipboard.`,
        });
    };

    // Autofill password in a website
    const handleAutofill = () => {
        console.log("Autofill requested for:", password.title);
        
        if (!extensionInstalled) {
            toast({
                title: "Extension not detected",
                description: "Please install the browser extension to use autofill.",
                variant: "destructive",
            });
            return;
        }
        
        const result = requestAutofill(
            password.username,
            password.password,
            password.url
        );
        
        if (result.success) {
            toast({
                title: "Autofill requested",
                description: `Credentials for ${password.title} will be filled when you visit the site.`,
            });
        } else {
            toast({
                title: "Autofill failed",
                description: result.message || "Failed to communicate with the extension.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card key={password.id} className="w-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">
                            {password.title}
                        </CardTitle>
                        {password.url && (
                            <CardDescription>
                                <a
                                    href={
                                        password.url.startsWith("http")
                                            ? password.url
                                            : `https://${password.url}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline flex items-center gap-1"
                                >
                                    {password.url}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex gap-1">
                        {password.url && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAutofill}
                                className="h-8 text-xs"
                                title="Autofill on site"
                            >
                                Autofill
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(password)}
                            className="h-8 w-8 p-0"
                        >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">
                                Edit
                            </span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(password.id)}
                            className="h-8 w-8 p-0 text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">
                                Delete
                            </span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="font-medium text-sm text-muted-foreground">
                            Username
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">
                                {password.username}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(password.username, "username")}
                                className="h-6 w-6 p-0"
                            >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">
                                    Copy username
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="font-medium text-sm text-muted-foreground">
                            Password
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">
                                {isPasswordVisible
                                    ? password.password
                                    : "•".repeat(Math.min(12, password.password.length))}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={togglePasswordVisibility}
                                className="h-6 w-6 p-0"
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className="h-3 w-3" />
                                ) : (
                                    <Eye className="h-3 w-3" />
                                )}
                                <span className="sr-only">
                                    {isPasswordVisible ? "Hide" : "Show"} password
                                </span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(password.password, "password")}
                                className="h-6 w-6 p-0"
                            >
                                <Copy className="h-3 w-3" />
                                <span className="sr-only">
                                    Copy password
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
            {password.notes && (
                <CardFooter className="pt-0">
                    <div className="w-full">
                        <div className="font-medium text-sm text-muted-foreground mb-1">
                            Notes
                        </div>
                        <p className="text-sm whitespace-pre-wrap">
                            {password.notes}
                        </p>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};

export default PasswordListItem;
