import { AccountView, RedirectToSignIn } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(accountViewPaths).map((path) => ({ path }))
}

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
            <AccountView path={path} />
        </main>
    )
}