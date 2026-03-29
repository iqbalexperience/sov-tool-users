"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClientLinkButton } from "./ClientLinkButton";
import { getClientsAction } from "./actions";

interface Client {
    id: string;
    name: string;
    domain: string;
    created_at: string;
    status: string;
    settings: any;
}

interface ClientListProps {
    org: any;
    orgId: string;
    isSuperAdmin: boolean;
}

export function ClientList({ org, orgId, isSuperAdmin }: ClientListProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        let isMounted = true;
        async function fetchClients() {
            try {
                let fetchedClients = await getClientsAction();
                if (!isSuperAdmin) {
                    fetchedClients = fetchedClients?.filter((client: Client) => org?.clients?.includes(client.id));
                }
                if (isMounted) {
                    setClients(fetchedClients || []);
                }
            } catch (error) {
                console.error("Error fetching clients:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchClients();
        return () => { isMounted = false; };
    }, [isSuperAdmin, org?.clients]);

    const filteredClients = clients.filter(client => {
        const query = searchQuery.toLowerCase();
        return (
            client.name?.toLowerCase().includes(query) ||
            client.domain?.toLowerCase().includes(query)
        );
    }).sort((a, b) => {
        const aLinked = org?.clients?.includes(a.id);
        const bLinked = org?.clients?.includes(b.id);
        if (aLinked && !bLinked) return -1;
        if (!aLinked && bLinked) return 1;
        return (a.name || '').localeCompare(b.name || '');
    });

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <CardTitle className="font-semibold text-lg md:text-xl">{org?.name}</CardTitle>
                    <CardDescription className="mt-1">Manage clients and organization linking.</CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search name or domain..."
                        className="w-full pl-8 h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-6 border rounded-xl bg-muted/20 border-dashed">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                            <p className="text-sm text-muted-foreground">Loading clients...</p>
                        </div>
                    </div>
                ) : filteredClients.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {filteredClients.map((client) => {
                            const isLinked = org?.clients?.includes(client.id);

                            return (
                                <div
                                    key={client.id}
                                    className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm bg-background transition-colors hover:bg-muted/30"
                                >
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full border bg-muted/50">
                                            <Globe className="h-5 w-5 text-muted-foreground" />
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm leading-none">{client.name}</span>
                                                {client.status && (
                                                    <Badge variant={client.status === "Demo" ? "default" : "secondary"} className="h-5 text-[10px] px-1.5">
                                                        {client.status}
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {client.domain ? (
                                                    <a href={client.domain} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {client.domain}
                                                    </a>
                                                ) : (
                                                    "No link provided"
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {isSuperAdmin && <ClientLinkButton
                                        clientId={client.id}
                                        orgId={orgId || ""}
                                        initialLinked={!!isLinked}
                                    />}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center p-6 border rounded-xl bg-muted/20 border-dashed">
                        <p className="text-sm text-muted-foreground">
                            {clients.length > 0 ? "No clients match your search." : "No clients found."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
