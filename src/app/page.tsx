"use client";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const MapLeaflet = dynamic(() => import("@/components/MapLeaflet"), { ssr: false });
const MapGoogle = dynamic(() => import("@/components/MapGoogle"), { ssr: false });
import RideForm from "@/components/RideForm";
import WsStatus from "@/components/WsStatus";

export default function Home() {
  const [pickup, setPickup] = useState<[number, number] | null>(null);
  const [dropoff, setDropoff] = useState<[number, number] | null>(null);
  const [summary, setSummary] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const waypoints = pickup && dropoff ? [pickup, dropoff] : undefined;
  const handleWaypointsChange = useCallback((p: { lat: number; lng: number }, d: { lat: number; lng: number }) => {
    const nextPickup: [number, number] = [p.lat, p.lng];
    const nextDropoff: [number, number] = [d.lat, d.lng];
    const samePickup = pickup && pickup[0] === nextPickup[0] && pickup[1] === nextPickup[1];
    const sameDrop = dropoff && dropoff[0] === nextDropoff[0] && dropoff[1] === nextDropoff[1];
    if (!samePickup) setPickup(nextPickup);
    if (!sameDrop) setDropoff(nextDropoff);
  }, [pickup, dropoff]);
  return (
    <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/next.svg" alt="Logo" width={120} height={24} />
          <span className="text-sm opacity-60">Uber Clone</span>
        </div>
        <div className="flex items-center gap-3">
          <WsStatus />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded bg-black text-white">Sign in</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <section className="grid md:grid-cols-2 gap-6">
        {process.env.NEXT_PUBLIC_MAPS_PROVIDER === "google" ? <MapGoogle /> : <MapLeaflet waypoints={waypoints} onRouteSummary={setSummary} />}
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-3">Request a Ride</h2>
          <RideForm onWaypointsChange={handleWaypointsChange} routeSummary={summary} />
          {summary && (
            <div className="mt-3 text-sm opacity-80">Route: {summary.distanceKm} km, ETA: {summary.durationMin} min</div>
          )}
        </div>
      </section>
    </div>
  );
}
