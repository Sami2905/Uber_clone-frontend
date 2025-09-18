"use client";
import { useEffect, useState } from "react";

export default function AdminClient() {
	const [refunds, setRefunds] = useState<any[]>([]);
	const [lost, setLost] = useState<any[]>([]);

	async function load() {
		const [r1, r2] = await Promise.all([
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/refunds`, { headers: { "x-test-role": "admin" } }).then(r => r.json()),
			fetch(`${process.env.NEXT_PUBLIC_API_URL}/lost-item`, { headers: { "x-test-role": "admin" } }).then(r => r.json()),
		]);
		setRefunds(r1.items ?? []);
		setLost(r2.items ?? []);
	}

	useEffect(() => { void load(); }, []);

	async function approveRefund(id: string) {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/refunds/${id}/approve`, { method: "POST", headers: { "x-test-role": "admin" } });
		await load();
	}
	async function rejectRefund(id: string) {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/refunds/${id}/reject`, { method: "POST", headers: { "x-test-role": "admin" } });
		await load();
	}

	return (
		<div className="min-h-screen p-6 space-y-6">
			<h1 className="text-xl font-semibold">Admin</h1>
			<section>
				<h2 className="font-semibold mb-2">Refund Requests</h2>
				<div className="space-y-2">
					{refunds.map((r) => (
						<div key={r.id} className="border rounded p-3 text-sm flex items-center justify-between">
							<div>
								<div className="font-mono">{r.id}</div>
								<div>Ride: {r.rideId}</div>
								<div>Amount: {r.amountUsd ? `$${r.amountUsd}` : "full/auto"} • Status: {r.status}</div>
							</div>
							<div className="flex gap-2">
								<button onClick={() => approveRefund(r.id)} className="px-3 py-1 rounded border">Approve</button>
								<button onClick={() => rejectRefund(r.id)} className="px-3 py-1 rounded border">Reject</button>
							</div>
						</div>
					))}
					{refunds.length === 0 && <div className="text-sm opacity-70">No requests.</div>}
				</div>
			</section>
			<section>
				<h2 className="font-semibold mb-2">Lost Items</h2>
				<div className="space-y-2">
					{lost.map((l) => (
						<div key={l.id} className="border rounded p-3 text-sm">
							<div className="font-mono">{l.id}</div>
							<div>Ride: {l.rideId}</div>
							<div>Status: {l.status}</div>
							<div>Description: {l.description}</div>
						</div>
					))}
					{lost.length === 0 && <div className="text-sm opacity-70">No lost-item reports.</div>}
				</div>
			</section>
		</div>
	);
}


