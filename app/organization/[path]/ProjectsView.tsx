import { authClient } from "@/lib/auth-client";
import ProjectsClient from "./ProjectsClient";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export interface Project {
    id: string;
    name: string;
    updated_at: number;
    current_step: string;
    status: string | null;
    usersCount?: number;
}

export interface Client {
    id: string;
    name: string;
    domain: string;
    created_at: string;
    status: string;
    settings: {
        excludedBrands: string[];
        faviconDataUrl: string | null;
        brandMatchMode: string | null;
    };
    projects: Project[];
}

export default async function ProjectsView({ sessionData }: { sessionData: any }) {

    let orgId = sessionData?.session?.activeOrganizationId;
    // console.log(sessionData)

    let org = null;
    if (!orgId) {
        const res = await auth.api.listOrganizations({ headers: await headers() })
        console.log(res)
        const istOrg = res?.[0]?.id
        if (istOrg) {
            orgId = istOrg
            await auth.api.setActiveOrganization({
                body: {
                    organizationId: istOrg,
                }, headers: await headers()
            })
        }
    }
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

    const membership = await prisma.member.findFirst({
        where: {
            organizationId: orgId,
            userId: sessionData?.user?.id
        },
        select: {
            role: true
        }
    })

    const isOrgAdmin = membership?.role === "admin" || membership?.role === "owner" || sessionData?.user?.role === "admin"

    return <ProjectsClient orgClients={org?.clients || []} orgId={orgId || ""} />;
}
