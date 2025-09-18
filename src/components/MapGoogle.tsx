"use client";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { useMemo } from "react";

type Props = { center?: google.maps.LatLngLiteral; zoom?: number };

export default function MapGoogle({ center, zoom }: Props) {
	const { isLoaded } = useJsApiLoader({ id: "gmaps-script", googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "" });
	const { theme, systemTheme } = useTheme();
	const mode = theme === "system" ? systemTheme : theme;
	const mapStyles = useMemo(() => (mode === "light" ? lightStyle : darkStyle), [mode]);
	if (!isLoaded) return <div className="w-full h-[60vh] rounded-lg border" />;
	const c = center || { lat: 28.6139, lng: 77.209 };
	return (
		<div className="w-full h-[60vh] rounded-lg overflow-hidden border">
			<GoogleMap center={c} zoom={zoom ?? 13} options={{ styles: mapStyles as any, disableDefaultUI: true }} mapContainerStyle={{ width: "100%", height: "100%" }}>
				<Marker position={c} animation={window.google ? window.google.maps.Animation.DROP : undefined} />
			</GoogleMap>
		</div>
	);
}

// Minimalistic dark/light styles inspired by premium apps
const darkStyle = [
	{ elementType: "geometry", stylers: [{ color: "#0b0b0c" }] },
	{ elementType: "labels.text.fill", stylers: [{ color: "#a3a3a3" }] },
	{ elementType: "labels.text.stroke", stylers: [{ color: "#0b0b0c" }] },
	{ featureType: "road", elementType: "geometry", stylers: [{ color: "#17181a" }] },
	{ featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9aa0a6" }] },
	{ featureType: "poi", elementType: "geometry", stylers: [{ color: "#141416" }] },
	{ featureType: "water", elementType: "geometry", stylers: [{ color: "#0f1113" }] },
];

const lightStyle = [
	{ elementType: "geometry", stylers: [{ color: "#f7f7f8" }] },
	{ elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
	{ elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
	{ featureType: "road", elementType: "geometry", stylers: [{ color: "#e7e9ee" }] },
	{ featureType: "poi", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
	{ featureType: "water", elementType: "geometry", stylers: [{ color: "#dfe9f6" }] },
];

