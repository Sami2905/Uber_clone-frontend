"use client";
import { useEffect, useState } from "react";
import { CheckoutButton } from "@/components/payments/CheckoutButton";

export default function PaymentsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const headers: Record<string,string> = { "x-test-role": "rider", "x-test-user-id": "rider_1" };
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/my`, { headers });
                const json = await res.json();
                setItems((json.items || []).filter((r: any) => r.status === "accepted" && typeof r.quoteUsd === "number"));
            } finally { setLoading(false); }
        })();
    }, []);
    return (
        <div className="min-h-screen p-6 space-y-4">
            <h1 className="text-xl font-semibold">Payments</h1>
            {loading ? (
                <div className="grid gap-2"><div className="skeleton h-16" /><div className="skeleton h-16" /></div>
            ) : items.length === 0 ? (
                <div className="card p-6 text-sm">No rides to pay right now.</div>
            ) : (
                <div className="grid gap-3">
                    {items.map((r) => (
                        <div key={r.id} className="border rounded p-3 text-sm flex items-center justify-between">
                            <div>
                                <div className="font-mono">{r.id}</div>
                                <div>Status: {r.status}</div>
                                <div>Amount: ₹{r.quoteUsd}</div>
                            </div>
                            <CheckoutButton rideId={r.id} amountUsd={r.quoteUsd} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


