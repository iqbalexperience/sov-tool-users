import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"
import Image from "next/image"
import { saasMeta } from "@/lib/constants"

export const dynamicParams = false

export function generateStaticParams() {
    return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
    const { path } = await params

    return (
        <main className="container flex min-h-screen flex-col items-center justify-center self-center p-4 md:p-6 mx-auto">

            <AuthView
                path={path}
                cardHeader={<div className="flex flex-col items-center gap-4 mb-4 text-center">
                    <Image src="/logo.png" alt={saasMeta.name} width={48} height={48} className="rounded-2xl object-cover drop-shadow-sm mb-2" />
                    <h1 className="text-3xl font-bold">{saasMeta.name}</h1>
                </div>}
            />
        </main>
    )
}