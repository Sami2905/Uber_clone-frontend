"use client";
import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useStripeEnabled } from "@/components/payments/StripeProvider";

function PayForm({ onClose }: { onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    async function pay() {
        if (!stripe || !elements) return;
        setLoading(true);
        const { error } = await stripe.confirmPayment({ elements, confirmParams: {}, redirect: "if_required" });
        if (error) { toast.error(error.message || "Payment error"); } else { toast.success("Payment successful"); onClose(); }
        setLoading(false);
    }
    return (
        <div className="space-y-3">
            <PaymentElement />
            <div className="flex gap-2">
                <Button onClick={pay} variant="primary" disabled={loading}>{loading ? "Processing…" : "Pay"}</Button>
                <DialogClose />
            </div>
        </div>
    );
}

export function CheckoutSheet({ open, onOpenChange, clientSecret }: { open: boolean; onOpenChange: (o: boolean) => void; clientSecret?: string }) {
    const enabled = useStripeEnabled();
    const ready = enabled && !!clientSecret;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader title="Complete payment" description="Secure checkout" />
                {!enabled && <div className="muted text-sm">Payments not configured.</div>}
                {enabled && !clientSecret && <div className="muted text-sm">Preparing payment…</div>}
                {ready && <PayForm onClose={() => onOpenChange(false)} />}
            </DialogContent>
        </Dialog>
    );
}


