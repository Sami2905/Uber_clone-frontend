"use client";
import { useEffect, useState } from "react";

export default function DriverPage() {
	const [rideId, setRideId] = useState("");
	const [driverId, setDriverId] = useState("driver_demo");
	const [result, setResult] = useState<any>(null);
	const [open, setOpen] = useState<any[]>([]);

	useEffect(() => {
		let timer: any;
		async function load() {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/open`, { headers: { "x-test-role": "driver" } });
				const json = await res.json();
				setOpen(json.items || []);
			} catch {}
		}
		load();
		timer = setInterval(load, 5000);
		return () => clearInterval(timer);
	}, []);

	async function accept() {
		if (!rideId) return;
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${rideId}/accept`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-test-role": "driver" },
			body: JSON.stringify({ driverId }),
		});
		setResult(await res.json());
	}

	async function startRide() {
		if (!rideId) return;
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${rideId}/start`, { method: "POST", headers: { "x-test-role": "driver" } });
		setResult(await res.json());
	}

	async function completeRide() {
		if (!rideId) return;
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${rideId}/complete`, { method: "POST", headers: { "x-test-role": "driver" } });
		setResult(await res.json());
	}

	return (
		<div className="min-h-screen p-6 space-y-4">
			<h1 className="text-xl font-semibold">Driver Dashboard (MVP)</h1>
			<div>
				<h2 className="font-semibold mb-2">Open Requests</h2>
				<div className="space-y-2">
					{open.map((r) => (
						<div key={r.id} className="border rounded p-3 text-sm flex items-center justify-between">
							<div>
								<div className="font-mono">{r.id}</div>
								<div>{r.rideType} • ${r.quoteUsd ?? "-"}</div>
							</div>
							<button onClick={() => { setRideId(r.id); accept(); }} className="px-3 py-1 rounded bg-black text-white">Accept</button>
						</div>
					))}
					{open.length === 0 && <div className="text-sm opacity-70">No open requests.</div>}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-2 max-w-md">
				<input className="border rounded p-2" placeholder="Ride ID" value={rideId} onChange={(e) => setRideId(e.target.value)} />
				<input className="border rounded p-2" placeholder="Driver ID" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
			</div>
			<button onClick={accept} className="px-4 py-2 rounded bg-black text-white">Accept Ride</button>
			<div className="flex gap-2">
				<button onClick={startRide} className="px-3 py-2 rounded border">Start</button>
				<button onClick={completeRide} className="px-3 py-2 rounded border">Complete</button>
			</div>
			{result && <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
		</div>
	);
}

