"use client";
import { useEffect, useRef, useState } from "react";
import type { RideRequest } from "@/types/ride";
import { geocode } from "@/lib/nominatim";

type Props = {
	onWaypointsChange?: (pickup: { lat: number; lng: number }, dropoff: { lat: number; lng: number }) => void;
	routeSummary?: { distanceKm: number; durationMin: number } | null;
};

export default function RideForm({ onWaypointsChange, routeSummary }: Props) {
	const [pickup, setPickup] = useState<{ lat: number; lng: number } | null>(null);
	const [dropoff, setDropoff] = useState<{ lat: number; lng: number } | null>(null);
	const [pickupQuery, setPickupQuery] = useState("");
	const [dropoffQuery, setDropoffQuery] = useState("");
	const [pickupResults, setPickupResults] = useState<any[]>([]);
	const [dropoffResults, setDropoffResults] = useState<any[]>([]);
	const [rideType, setRideType] = useState<RideRequest["rideType"]>("standard");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<any>(null);
	const [ride, setRide] = useState<any>(null);
	const [quote, setQuote] = useState<any>(null);
	const wsRef = useRef<WebSocket | null>(null);
	const [showRating, setShowRating] = useState(false);
	const [stars, setStars] = useState(5);
	const [note, setNote] = useState("");

	function estimateFromDistance(distanceKm: number, type: RideRequest["rideType"]) {
		const base = 2.5;
		const perKm = type === "premium" ? 1.8 : type === "xl" ? 2.0 : 1.2;
		return Math.max(5, Math.round((base + distanceKm * perKm) * 100) / 100);
	}

	async function submit() {
		if (!pickup || !dropoff) { alert("Select pickup and dropoff first."); return; }
		setLoading(true);
		setResult(null);
		try {
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/rides` : "/api/rides", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ pickup, dropoff, rideType }),
			});
			const json = await res.json();
			setResult(json);
			setRide(json);
			// Create PaymentIntent preferring OSRM-based estimate when available
			const preferredEstimate = routeSummary ? estimateFromDistance(routeSummary.distanceKm, rideType) : quote?.estimate;
			if (preferredEstimate && process.env.NEXT_PUBLIC_API_URL) {
				await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/intent`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ amount: preferredEstimate, rideId: json.id }),
				});
			}
		} finally {
			setLoading(false);
		}
	}

	async function getQuote() {
		if (!pickup || !dropoff) { alert("Select pickup and dropoff first."); return; }
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/quote`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pickup, dropoff, rideType }),
		});
		setQuote(await res.json());
	}

	async function searchPickup(q: string) {
		setPickupQuery(q);
		if (q.trim().length < 3) { setPickupResults([]); return; }
		try {
			const items = await geocode(q);
			setPickupResults(items);
		} catch {}
	}

	async function searchDropoff(q: string) {
		setDropoffQuery(q);
		if (q.trim().length < 3) { setDropoffResults([]); return; }
		try {
			const items = await geocode(q);
			setDropoffResults(items);
		} catch {}
	}

	useEffect(() => {
		if (!ride?.id) return;
		const base = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:4000";
		const ws = new WebSocket(`${base}/ws?rideId=${ride.id}`);
		wsRef.current = ws;
		ws.onmessage = (e) => {
			try {
				const msg = JSON.parse(e.data);
				if (msg.type === "ride.updated") setRide(msg.ride);
				if (msg.type === "driver.location" && msg.coords) {
					// @ts-ignore demo hook exposed by MapLeaflet
					if (typeof window !== "undefined" && (window as any).__setDriver) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						(window as any).__setDriver(msg.coords.lat, msg.coords.lng);
					}
				}
			} catch {}
		};
		return () => ws.close();
	}, [ride?.id]);

	useEffect(() => {
		if (!onWaypointsChange) return;
		if (pickup && dropoff) {
			onWaypointsChange(pickup, dropoff);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng]);

	return (
		<div className="space-y-3">
			<div className="space-y-2">
				<div>
					<input className="border rounded p-2 w-full" value={pickupQuery} onChange={(e) => searchPickup(e.target.value)} placeholder="Pickup address" />
					{pickupResults.length > 0 && (
						<div className="border rounded mt-1 max-h-40 overflow-auto text-sm">
							{pickupResults.map((r) => (
								<button key={r.place_id} className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => { setPickup({ lat: Number(r.lat), lng: Number(r.lon) }); setPickupQuery(r.display_name); setPickupResults([]); }}>
									{r.display_name}
								</button>
							))}
						</div>
					)}
				</div>
				<div>
					<input className="border rounded p-2 w-full" value={dropoffQuery} onChange={(e) => searchDropoff(e.target.value)} placeholder="Dropoff address" />
					{dropoffResults.length > 0 && (
						<div className="border rounded mt-1 max-h-40 overflow-auto text-sm">
							{dropoffResults.map((r) => (
								<button key={r.place_id} className="block w-full text-left px-2 py-1 hover:bg-gray-100" onClick={() => { setDropoff({ lat: Number(r.lat), lng: Number(r.lon) }); setDropoffQuery(r.display_name); setDropoffResults([]); }}>
									{r.display_name}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
			<select className="border rounded p-2" value={rideType} onChange={(e) => setRideType(e.target.value as any)}>
				<option value="standard">Standard</option>
				<option value="premium">Premium</option>
				<option value="xl">XL</option>
			</select>
			<div className="flex items-center gap-2">
				<button onClick={getQuote} className="px-3 py-2 rounded border">Get Quote</button>
				{routeSummary ? (
					<span className="text-sm">Route: {routeSummary.distanceKm} km, ETA {routeSummary.durationMin} min, Est. ${estimateFromDistance(routeSummary.distanceKm, rideType)}</span>
				) : (
					quote && <span className="text-sm">Est.: ${quote.estimate} ({quote.distanceKm} km)</span>
				)}
			</div>
			<div className="flex items-center gap-2">
				<button disabled={loading} onClick={submit} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">{loading ? "Requesting..." : "Request Ride"}</button>
				<button onClick={() => { setPickup(null); setDropoff(null); setPickupQuery(""); setDropoffQuery(""); setPickupResults([]); setDropoffResults([]); }} className="px-3 py-2 rounded border">Clear</button>
			</div>
			{ride && (
				<div className="text-sm">
					<div>Ride ID: <span className="font-mono">{ride.id}</span></div>
					<div>Status: <span className="font-semibold">{ride.status}</span></div>
					<div className="flex gap-2 mt-2">
						<button onClick={async () => { await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${ride.id}/cancel`, { method: "POST", headers: { "x-test-role": "rider" } }); }} className="px-3 py-2 rounded border">Cancel Ride</button>
						<button onClick={() => setShowRating(true)} className="px-3 py-2 rounded border">Rate Ride</button>
					</div>
				</div>
			)}
			{showRating && ride && (
				<div className="mt-3 border rounded p-3 space-y-2">
					<div className="font-semibold">Rate your ride</div>
					<select className="border rounded p-2" value={stars} onChange={(e) => setStars(Number(e.target.value))}>
						{[5,4,3,2,1].map(s => <option key={s} value={s}>{s} stars</option>)}
					</select>
					<textarea className="border rounded p-2 w-full" placeholder="Comments (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
					<div className="flex gap-2">
						<button className="px-3 py-2 rounded bg-black text-white" onClick={async () => {
							await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rides/${ride.id}/rating`, { method: "POST", headers: { "Content-Type": "application/json", "x-test-role": "rider" }, body: JSON.stringify({ stars, comment: note }) });
							setShowRating(false);
						}}>Submit</button>
						<button className="px-3 py-2 rounded border" onClick={() => setShowRating(false)}>Close</button>
					</div>
				</div>
			)}
		</div>
	);
}

