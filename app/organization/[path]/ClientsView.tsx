import React from 'react';
import prisma from '@/lib/prisma';
import { ClientList } from "./ClientList";

interface Client {
    id: string;
    name: string;
    domain: string;
    created_at: string;
    status: string;
    settings: any;
}

export default async function ClientsView({ sessionData }: { sessionData: any }) {
    const orgId = sessionData?.session?.activeOrganizationId;

    let org = null;
    if (orgId) {
        org = await prisma.organization.findFirst({
            where: {
                id: orgId
            },
            select: {
                name: true,
                slug: true,
                clients: true
            }
        });
    }

    // const membership = await prisma.member.findFirst({
    //     where: {
    //         organizationId: orgId,
    //         userId: sessionData?.user?.id
    //     },
    //     select: {
    //         role: true
    //     }
    // })

    const isSuperAdmin = sessionData?.user?.role === "admin"

    // const isOrgAdmin = membership?.role === "admin" || membership?.role === "owner"

    let clients: Client[] = [];
    try {
        // Fetch clients server-side
        const res = await fetch(`${process.env.AI_SEO_URL}/api/db/clients/list/for-auth`, {
            cache: 'no-store'
        });
        if (res.ok) {
            clients = await res.json();

        } else {

            console.error("Failed to fetch clients.");
        }
    } catch (error) {
        console.error("Error fetching clients:", error);
    }

    if (!isSuperAdmin) {
        clients = clients?.filter((client) => org?.clients?.includes(client.id))
    }

    return <ClientList clients={clients} org={org} orgId={orgId || ""} isSuperAdmin={isSuperAdmin} />;
}
