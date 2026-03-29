import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { OrganizationSwitcher, OrganizationView } from "@daveyplate/better-auth-ui"
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import ClientsView from "./ClientsView"
import prisma from "@/lib/prisma"
import ProjectsView from "./ProjectsView"
import { revalidatePath } from "next/cache"
import SideNav from "./sideNav"
// export const dynamicParams = false

// export function generateStaticParams() {
//     return Object.values(organizationViewPaths).map((path) => ({ path }))
// }

export default async function OrganizationPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params

    const sessionData = await auth.api.getSession({ headers: await headers() })
    if (!sessionData) redirect("/auth/sign-in?redirectTo=/auth/settings")
    const orgId = sessionData.session.activeOrganizationId

    const isAdmin = sessionData?.user?.role === "admin"

    return (
        <div className="container mx-auto md:p-6">
            {/* <div className="flex items-start justify-start w-full">
                <Link href="/account/organizations" className={cn(buttonVariants({ variant: "default" }), "w-fit")}>
                    <ArrowLeft className="size-4" />Account Settings</Link>
            </div> */}

            <div className="flex w-full grow flex-col gap-4 md:flex-row md:gap-12">
                <div className="hidden md:block">
                    <SideNav path={path} isAdmin={isAdmin} />
                </div>
                {['settings', 'members'].includes(path) && (
                    <OrganizationView path={path}
                        hideNav={true}
                    />
                )}
                {path === 'clients' && isAdmin && (
                    <ClientsView sessionData={sessionData} />
                )}
                {path === 'projects' && (
                    <ProjectsView sessionData={sessionData} />
                )}
            </div>

        </div>

    )
}