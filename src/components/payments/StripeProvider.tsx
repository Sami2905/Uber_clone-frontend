"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { ReactNode, useMemo, createContext, useContext } from "react";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export const StripeEnabledContext = createContext<boolean>(false);
export function useStripeEnabled() { return useContext(StripeEnabledContext); }

export function StripeProvider({ children }: { children: ReactNode }) {
    const { theme, systemTheme } = useTheme();
    const mode = theme === "system" ? systemTheme : theme;
    const options = useMemo(() => ({
        appearance: {
            theme: mode === "light" ? "stripe" : "night",
            variables: {
                colorPrimary: getCssVar("--primary") || "#0f62fe",
                colorBackground: getCssVar("--bg") || "#0b0b0c",
                colorText: getCssVar("--text") || "#e8e8ea",
                borderRadius: "8px",
            },
        },
    }), [mode]);
    const enabled = !!stripePromise;
    if (!enabled) {
        return <StripeEnabledContext.Provider value={false}>{children}</StripeEnabledContext.Provider>;
    }
    return (
        <StripeEnabledContext.Provider value={true}>
            <Elements stripe={stripePromise} options={options}>{children}</Elements>
        </StripeEnabledContext.Provider>
    );
}

function getCssVar(name: string) {
    if (typeof window === "undefined") return undefined;
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}


