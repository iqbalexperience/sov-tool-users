"use server";

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from "next/cache";
import { headers } from 'next/headers';
import type { Client } from "./ProjectsView";
import { query } from '@/lib/pgQuery';

export async function toggleClientLinkAction(orgId: string, clientId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        return false
    }

    try {

        const isLinkedData = await prisma.organization.findFirst({
            where: {
                id: orgId || ""
            },
            select: {
                clients: true
            }
        });

        let newClientsList = isLinkedData?.clients || [];

        if (newClientsList.includes(clientId)) {
            newClientsList = newClientsList.filter((client) => client !== clientId);
        } else {
            newClientsList.push(clientId);
        }

        await prisma.organization.update({
            where: {
                id: orgId || ""
            },
            data: {
                clients: newClientsList
            }
        });
        return true
    } catch (error) {
        console.error("Error toggling client link:", error);
        return false
    }
}

export async function getProjectMemberIdsAction(clientId: string, projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const orgId = session?.session?.activeOrganizationId;
    if (!orgId) return { success: false, error: "No active organization" };

    try {
        const memberProject = await prisma.memberProjects.findFirst({
            where: { clientId, projectId },
            include: { member: { select: { id: true } } }
        });

        const selectedMemberIds = memberProject?.member.map(m => m.id) || [];

        return {
            success: true,
            selectedMemberIds
        };
    } catch (error) {
        console.error("Error fetching project members:", error);
        return { success: false, error: "Failed to fetch project members" };
    }
}

export async function updateProjectMembersAction(clientId: string, projectId: string, memberIds: string[]) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user?.role !== "admin") {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const existing = await prisma.memberProjects.findFirst({
            where: { clientId, projectId },
            select: { id: true }
        });

        if (existing) {
            await prisma.memberProjects.update({
                where: { id: existing.id },
                data: {
                    member: {
                        set: memberIds.map(id => ({ id }))
                    }
                }
            });
        } else {
            const { randomUUID } = require("crypto");
            await prisma.memberProjects.create({
                data: {
                    id: randomUUID(),
                    clientId,
                    projectId,
                    member: {
                        connect: memberIds.map(id => ({ id }))
                    }
                }
            });
        }

        revalidatePath("/organization");
        return { success: true };
    } catch (error) {
        console.error("Error updating project members:", error);
        return { success: false, error: "Failed to update project members" };
    }
}

export async function getProjectsWithCountsAction(orgClients: string[]) {
    let clients: Client[] = [];
    // try {
    //     const res = await fetch(`${process.env.AI_SEO_URL}/api/db/clients/list/for-auth`, {
    //         cache: 'no-store'
    //     });
    //     if (res.ok) {
    //         clients = await res.json();
    //     } else {
    //         console.error("Failed to fetch clients.");
    //     }
    // } catch (error) {
    //     console.error("Error fetching clients:", error);
    // }

    const { rows: clients_1 } = await query(
        `SELECT c.id, c.name, c.domain, c.status,
              COALESCE(json_agg(
                json_build_object(
                  'id', p.id, 'name', p.name
                )
              ) FILTER (WHERE p.id IS NOT NULL), '[]') AS projects
       FROM clients c
       LEFT JOIN projects p ON p.client_id = c.id
       GROUP BY c.id
       ORDER BY c.name`
    );
    console.log(clients_1)
    clients = clients_1.filter((client: any) => orgClients.includes(client.id));


    const memberProjectsCounts = await prisma.memberProjects.findMany({
        where: {
            clientId: { in: clients.map(c => c.id) }
        },
        select: {
            clientId: true,
            projectId: true,
            _count: {
                select: { member: true }
            }
        }
    });

    const countMap = new Map();
    memberProjectsCounts.forEach((mp) => {
        countMap.set(`${mp.clientId}-${mp.projectId}`, mp._count.member);
    });

    return clients.map(client => ({
        ...client,
        projects: client.projects?.map(project => ({
            ...project,
            usersCount: countMap.get(`${client.id}-${project.id}`) || 0
        })) || []
    }));
}

export async function getOrganizationMembersAction(orgId: string) {
    const organizationMembers = await prisma.member.findMany({
        where: { organizationId: orgId },
        include: { user: true }
    });

    return organizationMembers.map(m => ({
        id: m.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role
    }));
}

