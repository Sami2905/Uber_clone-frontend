"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

type MapLeafletProps = {
	center?: [number, number];
	zoom?: number;
	waypoints?: Array<[number, number]>;
	onRouteSummary?: (summary: { distanceKm: number; durationMin: number }) => void;
};

// React-Leaflet requires window; dynamic import to avoid SSR
const Inner = dynamic(async () => {
	const RL = await import("react-leaflet");
	const leafletModule: any = await import("leaflet");
	const L = leafletModule.default || leafletModule; // use instance, not namespace
	// Expose L so leaflet-routing-machine can extend it
	// @ts-ignore
	(globalThis as any).L = L;
	// Fix default marker asset URLs to avoid 404s
	try {
		L.Icon.Default.mergeOptions({
			iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
			iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
			shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
		});
	} catch {}
	// @ts-ignore no types
	await import("leaflet-routing-machine");
	const { MapContainer, TileLayer, useMap, Marker } = RL as any;

	function RouteControl({ waypoints, onRouteSummary }: { waypoints?: Array<[number, number]>; onRouteSummary?: (s: { distanceKm: number; durationMin: number }) => void; }) {
		const map = useMap();
		const controlRef = useRef<any>(null);
		const aliveRef = useRef(true);

		// Create or destroy control based on waypoints presence
		useEffect(() => {
			aliveRef.current = true;
			// @ts-ignore global from leaflet-routing-machine
			const LR = (L as any).Routing;
			if (!LR) return;

			// If we have two waypoints and no control, create it
			if (!controlRef.current && waypoints && waypoints.length === 2) {
				const control = LR.control({
					waypoints: [L.latLng(waypoints[0][0], waypoints[0][1]), L.latLng(waypoints[1][0], waypoints[1][1])],
					router: new LR.OSRMv1({ serviceUrl: "https://router.project-osrm.org/route/v1" }),
					addWaypoints: false,
					routeWhileDragging: false,
					show: false,
				}).addTo(map);
				control.on('routesfound', (e: any) => {
					if (!aliveRef.current) return;
					try {
						const route = e.routes?.[0];
						if (route) {
							const distanceKm = +(route.summary.totalDistance / 1000).toFixed(2);
							const durationMin = +(route.summary.totalTime / 60).toFixed(1);
							onRouteSummary && onRouteSummary({ distanceKm, durationMin });
						}
					} catch {}
				});
				controlRef.current = control;
			}

			// If we have a control and no valid waypoints, remove it safely
			if (controlRef.current && (!waypoints || waypoints.length !== 2)) {
				try { map.removeControl(controlRef.current); } catch {}
				controlRef.current = null;
			}

			return () => { aliveRef.current = false; };
		}, [map, waypoints?.[0]?.[0], waypoints?.[0]?.[1], waypoints?.[1]?.[0], waypoints?.[1]?.[1], onRouteSummary]);

		// Update waypoints on existing control
		useEffect(() => {
			if (!controlRef.current) return;
			if (!(waypoints && waypoints.length === 2)) return;
			try {
				// @ts-ignore
				controlRef.current.setWaypoints([(L as any).latLng(waypoints[0][0], waypoints[0][1]), (L as any).latLng(waypoints[1][0], waypoints[1][1])]);
			} catch {}
		}, [waypoints?.[0]?.[0], waypoints?.[0]?.[1], waypoints?.[1]?.[0], waypoints?.[1]?.[1]]);

		return null;
	}

	return function InnerMap({ center, zoom, waypoints, onRouteSummary }: MapLeafletProps) {
		const _center = useMemo(() => center ?? [28.6139, 77.2090], [center]);
		const [driver, setDriver] = useState<[number, number] | null>(null);

		// Expose a simple way to update driver marker from window for demo (replace with WS wiring in page)
		useEffect(() => {
			// @ts-ignore
			window.__setDriver = (lat: number, lng: number) => setDriver([lat, lng]);
		}, []);

		return (
			<MapContainer
				center={_center}
				zoom={zoom ?? 13}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<RouteControl waypoints={waypoints} onRouteSummary={onRouteSummary} />
				{driver && <Marker position={{ lat: driver[0], lng: driver[1] }} />}
			</MapContainer>
		);
	};
}, { ssr: false });

export default function MapLeaflet(props: MapLeafletProps) {
	return (
		<div className="w-full h-[60vh] rounded-lg overflow-hidden border">
			<Inner {...props} />
		</div>
	);
}

