"use client";
import { useEffect, useState } from "react";

export default function HistoryPage() {
	const [items, setItems] = useState<any[]>([]);
	const [busy, setBusy] = useState<string>("");
	useEffect(() => {
		(async () => {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides`, { headers: { "x-test-role": "admin" } });
			const json = await res.json();
			setItems(json.items ?? []);
		})();
	}, []);

	async function downloadReceipt(id: string) {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${id}/receipt`, { headers: { "x-test-role": "admin" } });
		const text = await res.text();
		const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${id}_receipt.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function reportLostItem(id: string) {
		const description = prompt("Describe the item");
		if (!description) return;
		setBusy(id);
		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${id}/lost-item`, { method: "POST", headers: { "Content-Type": "application/json", "x-test-role": "rider" }, body: JSON.stringify({ description }) });
			alert("Reported.");
		} finally { setBusy(""); }
	}

	async function requestRefund(id: string) {
		const amount = prompt("Refund amount in USD (optional)");
		const reason = prompt("Reason (optional)") || undefined;
		setBusy(id);
		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${id}/refund`, { method: "POST", headers: { "Content-Type": "application/json", "x-test-role": "rider" }, body: JSON.stringify({ amountUsd: amount ? Number(amount) : undefined, reason }) });
			alert("Refund requested.");
		} finally { setBusy(""); }
	}

	return (
		<div className="min-h-screen p-6 space-y-4">
			<h1 className="text-xl font-semibold">Ride History (MVP)</h1>
			<div className="space-y-2">
				{items.map((r) => (
					<div key={r.id} className="border rounded p-3 text-sm flex items-center justify-between">
						<div>
							<div className="font-mono">{r.id}</div>
							<div>Status: {r.status}</div>
							<div>Type: {r.rideType}</div>
							<div>Quote: {r.quoteUsd ? `$${r.quoteUsd}` : '-'}</div>
						</div>
						<div className="flex gap-2">
							<button onClick={() => downloadReceipt(r.id)} className="px-3 py-1 rounded border">Receipt</button>
							<button disabled={busy===r.id} onClick={() => reportLostItem(r.id)} className="px-3 py-1 rounded border">Lost Item</button>
							<button disabled={busy===r.id} onClick={() => requestRefund(r.id)} className="px-3 py-1 rounded border">Request Refund</button>
						</div>
					</div>
				))}
				{items.length === 0 && <div className="text-sm opacity-70">No rides yet.</div>}
			</div>
		</div>
	);
}

