import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // @ts-expect-error type issue
        let activeOrg: string | undefined = await session.session.activeOrganizationId;
        if (activeOrg) {
            const list = await auth.api.listOrganizations({
                headers: await headers()
            })
            if (list?.[0]?.id) {
                await auth.api.setActiveOrganization({
                    body: {
                        organizationId: list[0].id
                    },
                    headers: await headers()
                })
                activeOrg = list[0].id;
            } else {
                return NextResponse.json({ clients: [], projects: [], role: "user", orgRole: "member" })
            }

        }

        const member = await prisma.member.findFirst({
            where: {
                userId: session.user.id,
                organizationId: activeOrg
            },
            select: {
                memberProjects: {
                    select: {
                        clientId: true,
                        projectId: true
                    }
                },
                role: true
            }
        })
        const clients = [...new Set(member?.memberProjects?.map(mp => mp.clientId))];
        const projects = [...new Set(member?.memberProjects?.map(mp => mp.projectId))];
        return NextResponse.json({ clients, projects, role: session.user.role, orgRole: member?.role })
    } catch (error) {
        return NextResponse.json({ clients: [], projects: [], role: "user", orgRole: "member" })
    }

}
