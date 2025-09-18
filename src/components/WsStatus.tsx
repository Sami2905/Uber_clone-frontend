"use client";
import { useEffect, useRef, useState } from "react";

export default function WsStatus() {
	const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
	const [lastMsg, setLastMsg] = useState<string>("");
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		setStatus("connecting");
		const url = process.env.NEXT_PUBLIC_API_URL?.replace(/^http/, "ws") || "ws://localhost:4000";
		const role = "rider"; const userId = "test";
		const ws = new WebSocket(`${url}/ws?role=${encodeURIComponent(role)}&userId=${encodeURIComponent(userId)}`);
		wsRef.current = ws;
		ws.onopen = () => setStatus("connected");
		ws.onclose = () => setStatus("disconnected");
		ws.onmessage = (e) => setLastMsg(e.data);
		return () => ws.close();
	}, []);

	return (
		<div className="text-xs px-2 py-1 rounded border inline-flex items-center gap-2">
			<span>WS:</span>
			<span className={status === "connected" ? "text-green-600" : status === "connecting" ? "text-yellow-600" : "text-red-600"}>{status}</span>
			{lastMsg && <span className="opacity-60 truncate max-w-[200px]">{lastMsg}</span>}
		</div>
	);
}

