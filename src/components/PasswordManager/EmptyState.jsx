
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, Plus } from "lucide-react";

const EmptyState = ({ searchTerm, onAdd }) => {
    return (
        <div className="text-center py-8">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-2 text-lg font-medium">
                No passwords found
            </h3>
            <p className="text-sm text-muted-foreground">
                {searchTerm
                    ? "Try a different search term"
                    : "Add your first password to get started"}
            </p>
            {!searchTerm && (
                <Button
                    onClick={onAdd}
                    variant="outline"
                    className="mt-4"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Password
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
