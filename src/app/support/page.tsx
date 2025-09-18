"use client";
import { useEffect, useState } from "react";

export default function SupportPage() {
	const [items, setItems] = useState<any[]>([]);
	const [subject, setSubject] = useState("");
	const [category, setCategory] = useState("general");
	const [message, setMessage] = useState("");

	async function load() {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/tickets`, { headers: { "x-test-role": "rider" } });
		const json = await res.json();
		setItems(json.items ?? []);
	}

	useEffect(() => { void load(); }, []);

	async function createTicket() {
		if (!subject.trim()) return;
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support/tickets`, {
			method: "POST",
			headers: { "Content-Type": "application/json", "x-test-role": "rider" },
			body: JSON.stringify({ subject, category, message })
		});
		setSubject(""); setMessage("");
		await load();
	}

	return (
		<div className="min-h-screen p-6 space-y-4">
			<h1 className="text-xl font-semibold">Support</h1>
			<div className="grid gap-2 max-w-xl">
				<input className="border rounded p-2" placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} />
				<select className="border rounded p-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
					<option value="general">General</option>
					<option value="payment">Payment</option>
					<option value="ride">Ride</option>
					<option value="account">Account</option>
				</select>
				<textarea className="border rounded p-2" placeholder="Describe your issue" value={message} onChange={(e)=>setMessage(e.target.value)} />
				<button onClick={createTicket} className="px-3 py-2 rounded bg-black text-white">Create Ticket</button>
			</div>

			<h2 className="font-semibold mt-6">Your Tickets</h2>
			<div className="space-y-2">
				{items.map((t) => (
					<div key={t.id} className="border rounded p-3 text-sm">
						<div className="font-mono">{t.id}</div>
						<div>{t.subject} • {t.category}</div>
						<div>Status: {t.status}</div>
					</div>
				))}
				{items.length === 0 && <div className="text-sm opacity-70">No tickets yet.</div>}
			</div>
		</div>
	);
}
