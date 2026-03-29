"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Folder, Search, Loader2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Client } from "./ProjectsView";
import { ProjectUsersDialog } from "./ProjectUsersDialog";
import { getProjectsWithCountsAction, getOrganizationMembersAction } from "./actions";

export default function ProjectsClient({ userProjects, orgClients, orgId, isOrgAdmin }: { userProjects: string[], orgClients: string[], orgId: string, isOrgAdmin: boolean }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [organizationMembers, setOrganizationMembers] = useState<{ id: string; name: string; email: string; role: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // console.log({ userProjects })
        Promise.all([
            getProjectsWithCountsAction(orgClients, isOrgAdmin, userProjects),
            orgId ? getOrganizationMembersAction(orgId) : Promise.resolve([])
        ]).then(([clientsRes, membersRes]) => {
            setClients(clientsRes);
            setOrganizationMembers(membersRes);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, [orgClients, orgId]);

    if (loading) {
        return (
            <div className="flex flex-col gap-6 w-full">
                <div className="flex justify-center p-6 border rounded-xl bg-muted/20 border-dashed">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                        <p className="text-sm text-muted-foreground">Loading Projects...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!clients || clients.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 w-full min-h-[50vh] text-muted-foreground">
                <p className="text-sm font-medium">No projects available.</p>
            </div>
        );
    }

    const filteredClients = clients.map((client) => {
        const query = searchQuery.toLowerCase();

        // Filter projects based on the query
        const filteredProjects = client.projects?.filter((project) =>
            project.name.toLowerCase().includes(query)
        );

        // Check if the client name or domain matches
        const matchesClient =
            client.name.toLowerCase().includes(query) ||
            (client.domain && client.domain.toLowerCase().includes(query));

        if (matchesClient || (filteredProjects && filteredProjects.length > 0)) {
            return {
                ...client,
                projects: matchesClient ? client.projects : filteredProjects
            };
        }

        return null;
    }).filter(Boolean) as Client[];
    // console.log(filteredClients)

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by client, domain, or project..."
                    className="pl-8 bg-background rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredClients.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                        No results found for "{searchQuery}".
                    </CardContent>
                </Card>
            ) : (
                filteredClients.map((client) => (
                    <Card key={client.id} className="w-full">
                        <CardHeader>
                            <div className="flex flex-row items-center gap-4">
                                <CardTitle className="font-semibold text-lg md:text-xl">{client.name}</CardTitle>
                                <Badge variant={client.status === "Demo" ? "default" : "secondary"}>{client.status}</Badge>
                            </div>
                            <CardDescription>
                                {client.domain && (
                                    <a
                                        href={client.domain}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {client.domain}
                                    </a>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {client.projects && client.projects.length > 0 ? (
                                <div className="flex flex-col gap-4">
                                    {client.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="flex flex-row items-center justify-between rounded-xl border p-4 shadow-sm bg-background transition-colors hover:bg-muted/30"
                                        >
                                            <div className="flex flex-row items-center gap-4">
                                                {/* Project Icon */}
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-muted/50">
                                                    <Folder className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-medium leading-none">{project.name}</p>

                                                </div>
                                            </div>

                                            <div className="flex flex-row items-center gap-4">

                                                <Link href={`https://aiseo.inboundcph.dk/project/${client.id}/${project.id}`} target="_blank">
                                                    <Button variant="outline" size="sm" className="rounded-lg h-9 px-4">
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                </Link>

                                                {/* Action Button */}
                                                {isOrgAdmin && <ProjectUsersDialog clientId={client.id} projectId={project.id} projectName={project.name} organizationMembers={organizationMembers}>
                                                    <Button variant="outline" size="sm" className="rounded-lg h-9 px-4">
                                                        {project?.usersCount} Users
                                                    </Button>
                                                </ProjectUsersDialog>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center p-4 border rounded-xl bg-muted/20 border-dashed">
                                    <p className="text-sm text-muted-foreground">No projects found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
