import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { OrganizationView } from "@daveyplate/better-auth-ui"
import { organizationViewPaths } from "@daveyplate/better-auth-ui/server"
import { ArrowLeft } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(organizationViewPaths).map((path) => ({ path }))
}

export default async function OrganizationPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params

    const sessionData = await auth.api.getSession({ headers: await headers() })
    if (!sessionData) redirect("/auth/sign-in?redirectTo=/auth/settings")

    return (
        <div className="container mx-auto">
            <div className="flex grow flex-col items-center justify-center gap-4 p-4">
                <div className="flex items-start justify-start w-full">
                    <Link href="/account/organizations" className={cn(buttonVariants({ variant: "default" }), "w-fit")}>
                        <ArrowLeft className="size-4" />Account Settings</Link>
                </div>
                <OrganizationView path={path} />
            </div>
        </div>

    )
}