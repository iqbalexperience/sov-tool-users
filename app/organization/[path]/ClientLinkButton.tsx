"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleClientLinkAction } from "./actions";
import { toast } from "sonner";

interface ClientLinkButtonProps {
    clientId: string;
    orgId: string;
    initialLinked: boolean;
}

export function ClientLinkButton({ clientId, orgId, initialLinked }: ClientLinkButtonProps) {
    const [isLinked, setIsLinked] = useState(initialLinked);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        // Optimistic UI update
        setIsLinked(!isLinked);

        startTransition(async () => {
            // Call the server action passed from actions.ts
            const success = await toggleClientLinkAction(orgId, clientId);
            if (success === false) {
                setIsLinked(isLinked); // Revert optimistic UI update
                toast.error("You don't have permission to do this.");
            }
        });
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isLinked ? "outline" : "default"}
            size="sm"
            className="rounded-lg h-9 px-4 min-w-20"
        >
            {isLinked ? "Unlink" : "Link"}
        </Button>
    );
}
