"use client";
import { ReactNode } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { StripeProvider } from "@/components/payments/StripeProvider";

export function ClientProviders({ children }: { children: ReactNode }) {
    const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const Inner = (
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
            <Header />
            <StripeProvider>
                <AnimatePresence mode="wait">
                    <motion.main
                        key={typeof window !== "undefined" ? window.location.pathname : ""}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </StripeProvider>
            <Toaster richColors position="bottom-right" />
        </ThemeProvider>
    );
    return hasClerk ? <ClerkProvider>{Inner}</ClerkProvider> : Inner;
}


