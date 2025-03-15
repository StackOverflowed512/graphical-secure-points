
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getExtensionUrl } from "@/utils/extensionConnector";

const ExtensionButton = () => {
    const handleGetExtension = () => {
        window.open(getExtensionUrl(), '_blank');
    };

    return (
        <Button variant="outline" onClick={handleGetExtension}>
            <Download className="mr-2 h-4 w-4" /> Get Extension
        </Button>
    );
};

export default ExtensionButton;
