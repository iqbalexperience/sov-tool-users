import { AccountView, RedirectToSignIn } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ProjectsView from "../../organization/[path]/ProjectsView"

// export const dynamicParams = false

// export function generateStaticParams() {
//     return Object.values(accountViewPaths).map((path) => ({ path }))
// }

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return <RedirectToSignIn />
    }

    const { path } = await params

    return (
        <main className="container p-4 md:p-6">
            <div className="flex w-full grow flex-col gap-4 md:flex-row md:gap-12">
                <div className="hidden md:block">
                    <div className="flex w-48 flex-col gap-1 lg:w-60 items-start">
                        <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-sm")} href="/account/settings">Account</Link>
                        <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-sm")} href="/account/security">Security</Link>
                        <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-sm")} href={session.user.role === "admin" ? "/account/organizations" : "/organization/settings"}>Organizations</Link>
                    </div>
                </div>
                {['settings', 'security', 'organizations'].includes(path) && (
                    <AccountView path={path}
                        hideNav
                    />
                )}

            </div>
        </main>
    )
}