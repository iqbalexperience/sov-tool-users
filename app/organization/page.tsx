import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import { redirect } from "next/navigation";



export default function LandingPage() {
    redirect("/account/organizations")
}