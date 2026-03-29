import React from 'react';
import prisma from '@/lib/prisma';
import { ClientList } from "./ClientList";

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

    return <ClientList org={org} orgId={orgId || ""} isSuperAdmin={isSuperAdmin} />;
}
