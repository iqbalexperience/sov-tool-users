"use client";

import { motion } from "framer-motion";
import { ShieldWarning, ArrowLeft, House } from "@phosphor-icons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center space-y-8 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="relative"
            >
                <div className="absolute inset-0 bg-red-500/10 blur-[60px] rounded-full -z-10"></div>
                <div className="p-6 bg-background border-2 border-red-500/20 rounded-[2.5rem] shadow-2xl relative">
                    <ShieldWarning size={64} weight="duotone" className="text-red-500" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-4 max-w-md"
            >
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Access <span className="text-red-500">Denied</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                    It seems you don't have the necessary permissions to access this restricted area. 
                    Please contact an administrator if you believe this is an error.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
                <Button 
                    variant="outline" 
                    className="h-12 px-6 rounded-2xl font-bold bg-background border-border hover:bg-muted transition-all"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Go Back
                </Button>
                <Button 
                    asChild 
                    className="h-12 px-8 rounded-2xl font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                    <Link href="/">
                        <House size={18} className="mr-2" />
                        Return Home
                    </Link>
                </Button>
            </motion.div>

            {/* Subtle decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
        </div>
    );
}
