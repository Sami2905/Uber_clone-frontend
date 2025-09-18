"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { CheckoutSheet } from "@/components/payments/CheckoutSheet";

export function CheckoutButton({ rideId, amountUsd }: { rideId: string; amountUsd: number }) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
    async function checkout() {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: amountUsd, rideId }),
            });
            const data = await res.json();
            if (data?.clientSecret) setClientSecret(data.clientSecret as string);
            setOpen(true);
        } catch {
            toast.error("Payment failed");
        } finally { setLoading(false); }
    }
    return (
        <>
            <Button onClick={checkout} variant="primary" disabled={loading}>{loading ? "Processing..." : `Pay ₹${amountUsd}`}</Button>
            <CheckoutSheet open={open} onOpenChange={setOpen} clientSecret={clientSecret} />
        </>
    );
}


