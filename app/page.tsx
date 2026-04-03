import { auth } from "@/lib/auth";
import ProjectsView from "./organization/[path]/ProjectsView";
import { headers } from "next/headers";
import { RedirectToSignIn } from "@daveyplate/better-auth-ui";
import { redirect } from "next/navigation";
import OrgSwitcher from "@/components/orgSwitcher";



export default async function LandingPage() {
    const sessionData = await auth.api.getSession({ headers: await headers() })
    if (!sessionData) {
        return (
            <RedirectToSignIn />
        )
    }
    redirect("https://aiseo.inboundcph.dk/")

    return (
        <div className="container p-6 mx-auto max-w-4xl">
            <div className="flex  flex-col gap-4 ">
                <OrgSwitcher className="w-fit" />
                <ProjectsView sessionData={sessionData} />
            </div>
        </div>
    )
}