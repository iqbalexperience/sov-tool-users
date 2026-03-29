
"use client"
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";
import Link from "next/link";



export default function SideNav({ path, isAdmin }: { path: string, isAdmin: boolean }) {
    return (
        <div className="flex w-48 flex-col gap-1 lg:w-60 items-start">
            <OrganizationSwitcher className="w-full" hideCreate hidePersonal
                variant={"outline"}
                onSetActive={() => {
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                }}
            />
            {/* <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start rounded-sm")} href="/account/settings">Account Settings</Link> */}
            <Link className={cn(buttonVariants({ variant: path === "settings" ? "secondary" : "ghost" }), "w-full justify-start rounded-sm mt-4")} href="/organization/settings">Settings</Link>
            <Link className={cn(buttonVariants({ variant: path === "members" ? "secondary" : "ghost" }), "w-full justify-start rounded-sm")} href="/organization/members">Members</Link>
            {isAdmin && <Link className={cn(buttonVariants({ variant: path === "clients" ? "secondary" : "ghost" }), "w-full justify-start rounded-sm")} href="/organization/clients">Clients</Link>}
            <Link className={cn(buttonVariants({ variant: path === "projects" ? "secondary" : "ghost" }), "w-full justify-start rounded-sm")} href="/organization/projects">Projects</Link>
        </div>
    )
}