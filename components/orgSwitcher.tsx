
"use client"
import { OrganizationSwitcher } from "@daveyplate/better-auth-ui";

export default function OrgSwitcher({ className }: { className?: string }) {
    return (
        <OrganizationSwitcher className={className} hideCreate hidePersonal
            variant={"outline"}
            onSetActive={() => {
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }}
        />
    )
}