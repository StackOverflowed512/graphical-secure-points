
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { isExtensionInstalled } from "@/utils/extensionConnector";
import PasswordListItem from "./PasswordListItem";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";
import ExtensionButton from "./ExtensionButton";

const PasswordList = ({ passwords, loading, onEdit, onDelete, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [extensionInstalled, setExtensionInstalled] = useState(false);

    // Check if extension is installed
    useEffect(() => {
        const checkExtension = () => {
            const isInstalled = isExtensionInstalled();
            console.log("Extension installed:", isInstalled);
            setExtensionInstalled(isInstalled);
        };
        
        checkExtension();
        
        // Recheck when window is focused
        window.addEventListener('focus', checkExtension);
        
        return () => {
            window.removeEventListener('focus', checkExtension);
        };
    }, []);

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
                <SearchBar 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm} 
                />
                <div className="flex gap-2">
                    {!extensionInstalled && <ExtensionButton />}
                    <Button onClick={onAdd}>
                        <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>
                </div>
            </div>

            {filteredPasswords.length === 0 ? (
                <EmptyState searchTerm={searchTerm} onAdd={onAdd} />
            ) : (
                <div className="space-y-3">
                    {filteredPasswords.map((password) => (
                        <PasswordListItem
                            key={password.id}
                            password={password}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PasswordList;
